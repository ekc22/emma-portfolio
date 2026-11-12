import "server-only";
import type Anthropic from "@anthropic-ai/sdk";
import type { Session } from "../types";
import { assertClaude, createMessage, textOf } from "./client";
import { AiContext } from "./context";
import { CORE_PROMPT, sessionContext } from "./prompt";
import { runTool, toolDefinitions, TOOL_LABELS } from "./tools";

export type AgentEvent =
  | { type: "tool"; name: string; label: string }
  | { type: "proposal"; id: string }
  | { type: "report"; id: string }
  | { type: "text"; text: string }
  | { type: "error"; message: string };

export interface ChatTurn { role: "user" | "assistant"; content: string }

const MAX_STEPS = 16;

export function systemBlocks(session: Session): Anthropic.Beta.BetaTextBlockParam[] {
  return [
    { type: "text", text: CORE_PROMPT, cache_control: { type: "ephemeral" } },
    { type: "text", text: sessionContext(session) },
  ];
}

/**
 * Runs the Chief of Staff agent: a manual tool-use loop over workspace tools.
 * Earlier turns are replayed as plain text; within a turn the full assistant
 * content (including thinking blocks) is appended unchanged.
 */
export async function runAgent(session: Session, history: ChatTurn[], emit: (e: AgentEvent) => void) {
  assertClaude();
  const ctx = await AiContext.create(session);
  const tools = toolDefinitions();
  const messages: Anthropic.Beta.BetaMessageParam[] = history.map((t) => ({ role: t.role, content: t.content }));

  for (let step = 0; step < MAX_STEPS; step++) {
    const res = await createMessage({
      max_tokens: 16000,
      system: systemBlocks(session),
      tools,
      messages,
      output_config: { effort: "medium" },
    });

    if (res.stop_reason === "refusal") {
      emit({ type: "error", message: "Claude declined this request. Try rephrasing it." });
      return;
    }
    messages.push({ role: "assistant", content: res.content });
    if (res.stop_reason === "pause_turn") continue;

    const uses = res.content.filter((b): b is Anthropic.Beta.BetaToolUseBlock => b.type === "tool_use");
    if (!uses.length) {
      const text = textOf(res.content);
      emit({ type: "text", text: text || "I could not produce an answer. Try asking in a different way." });
      if (res.stop_reason === "max_tokens") emit({ type: "error", message: "The answer was cut short. Ask for a shorter version or one section at a time." });
      return;
    }

    const results: Anthropic.Beta.BetaToolResultBlockParam[] = [];
    for (const u of uses) {
      emit({ type: "tool", name: u.name, label: TOOL_LABELS[u.name] ?? u.name });
      const input = u.input && typeof u.input === "object" ? (u.input as Record<string, unknown>) : {};
      const out = await runTool(ctx, u.name, input);
      if (out.proposalId) emit({ type: "proposal", id: out.proposalId });
      if (out.reportId) emit({ type: "report", id: out.reportId });
      results.push({ type: "tool_result", tool_use_id: u.id, content: JSON.stringify(out.result), is_error: out.isError || undefined });
    }
    messages.push({ role: "user", content: results });
  }
  emit({ type: "error", message: "This request needed more steps than allowed. Try a narrower question." });
}
