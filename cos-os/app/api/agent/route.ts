import { getSession } from "@/lib/auth/session";
import { runAgent, type AgentEvent, type ChatTurn } from "@/lib/ai/agent";
import { describeAiError } from "@/lib/ai/client";
import { consumeAiAllowance } from "@/lib/ai/limits";
import { isClaudeConfigured } from "@/lib/env";

export const runtime = "nodejs";
export const maxDuration = 300;

/** Streams agent progress as newline-delimited JSON events. */
export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return Response.json({ error: "Sign in to use the AI Chief of Staff." }, { status: 401 });

  let history: ChatTurn[];
  try {
    const body = await req.json();
    history = (Array.isArray(body.messages) ? body.messages : [])
      .filter((m: ChatTurn) => (m?.role === "user" || m?.role === "assistant") && typeof m.content === "string" && m.content.trim())
      .slice(-20)
      .map((m: ChatTurn) => ({ role: m.role, content: m.content.slice(0, 40000) }));
    while (history.length && history[0].role !== "user") history.shift();
    if (!history.length || history[history.length - 1].role !== "user") throw new Error();
  } catch {
    return Response.json({ error: "Send at least one user message." }, { status: 400 });
  }

  if (isClaudeConfigured()) {
    try { await consumeAiAllowance(session, "agent"); } catch (e) { const { status, message } = describeAiError(e); return Response.json({ error: message }, { status }); }
  }

  const enc = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const emit = (e: AgentEvent) => controller.enqueue(enc.encode(JSON.stringify(e) + "\n"));
      try {
        await runAgent(session, history, emit);
      } catch (e) {
        emit({ type: "error", message: describeAiError(e).message });
      } finally {
        controller.close();
      }
    },
  });
  return new Response(stream, { headers: { "content-type": "application/x-ndjson; charset=utf-8", "cache-control": "no-store" } });
}
