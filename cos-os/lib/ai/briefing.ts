import "server-only";
import * as z from "zod/v4";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import type { Session, SourceRef } from "../types";
import { isTable, type TableName } from "../schema";
import { todayISO, formatDate } from "../utils";
import { writeAudit } from "../audit";
import { assertClaude, createMessage, textOf } from "./client";
import { AiContext } from "./context";
import { dataPack, knownIds } from "./datapack";
import { systemBlocks } from "./agent";

export const BRIEFING_QUESTIONS = [
  "What matters most today?",
  "What has changed?",
  "What is falling behind?",
  "What requires a leadership decision?",
  "Where should management focus attention?",
] as const;

const Item = z.object({
  statement: z.string().describe("One or two sentences. Specific, with names, figures and dates from the data."),
  kind: z.enum(["fact", "assumption", "recommendation"]),
  owner: z.string().nullable().describe("Person accountable, from the records, or null"),
  timing: z.string().nullable().describe("When to act, e.g. 'by Friday 14 Nov', or null"),
  confidence: z.enum(["low", "medium", "high"]),
  refs: z.array(z.object({ table: z.string(), id: z.string() })).describe("Records that support this item. Use ids from the data only."),
});
const Briefing = z.object({
  headline: z.string().describe("The single most important message for leadership today, one sentence."),
  sections: z.array(z.object({ question: z.enum(BRIEFING_QUESTIONS), items: z.array(Item) })),
  missing_data: z.array(z.string()).describe("Information that would change the briefing but is not recorded."),
});
export type BriefingData = z.infer<typeof Briefing>;

/** Generates the daily executive briefing as structured data plus Markdown, saved as an AI draft report. */
export async function generateBriefing(session: Session) {
  assertClaude();
  const ctx = await AiContext.create(session);
  const pack = await dataPack(ctx, ["overview", "delivery", "pipeline", "fundraising", "investors", "strategy"]);
  const recent = (await ctx.rows("audit_logs")).slice(0, 40).map((a) => ({ when: a.created_at, summary: a.summary, by: a.actor_name }));

  const res = await createMessage({
    max_tokens: 16000,
    system: systemBlocks(session),
    output_config: { effort: "high", format: zodOutputFormat(Briefing) },
    messages: [{
      role: "user",
      content: `Prepare today's executive briefing (${todayISO()}) for ${session.name}.

Answer each of these five questions, in this order, with 2–4 items each: ${BRIEFING_QUESTIONS.join(" | ")}
- Prioritise by consequence. Connect functions where the data shows a link.
- "What has changed" uses recent changes, stage movements and dates in the data. If little has changed, say so plainly.
- Recommendations name an owner and a timing.
- Every item cites the records that support it, using ids from the data only.
- Do not invent figures. If something important is missing, list it in missing_data.

Workspace data (JSON):
${JSON.stringify(pack)}

Recent changes in the workspace (audit log, newest first; may be empty):
${JSON.stringify(recent)}`,
    }],
  });
  if (res.stop_reason === "refusal") throw new Error("Claude declined to produce the briefing.");
  const parsed = Briefing.safeParse(JSON.parse(textOf(res.content) || "{}"));
  if (!parsed.success) throw new Error("The briefing came back in an unexpected format. Try again.");

  // Keep only references that point at records this user can see.
  const ids = await knownIds(ctx);
  const data: BriefingData = {
    ...parsed.data,
    sections: parsed.data.sections.map((s) => ({
      ...s,
      items: s.items.map((i) => ({ ...i, refs: i.refs.filter((r) => isTable(r.table) && ids.get(r.id)?.table === r.table) })),
    })),
  };
  const sources: SourceRef[] = [];
  for (const s of data.sections) for (const i of s.items) for (const r of i.refs) if (!sources.some((x) => x.id === r.id)) sources.push({ table: r.table as TableName, id: r.id, label: ids.get(r.id)?.label });

  const body = briefingMarkdown(data, (id) => ids.get(id)?.label ?? "record");
  const row = await ctx.store.insert("reports", {
    title: `Daily executive briefing: ${formatDate(todayISO(), { weekday: "long", day: "numeric", month: "long" })}`,
    report_type: "daily_briefing",
    period: todayISO(),
    status: "draft",
    ai_generated: true,
    body,
    sources,
    data,
    created_by: session.authUserId,
  });
  await writeAudit(ctx.store, session, { action: "create", table: "reports", recordId: row.id, summary: "AI generated the daily executive briefing", actorType: "ai" });
  return row;
}

export function briefingMarkdown(b: BriefingData, label: (id: string) => string) {
  const tag = { fact: "Fact", assumption: "Assumption", recommendation: "Recommendation" } as const;
  const lines = [`**${b.headline}**`, ""];
  for (const s of b.sections) {
    lines.push(`## ${s.question}`);
    for (const i of s.items) {
      const meta = [i.owner && `Owner: ${i.owner}`, i.timing && `When: ${i.timing}`, `Confidence: ${i.confidence}`].filter(Boolean).join(" · ");
      const refs = i.refs.map((r) => `[${label(r.id)}](/records/${r.table}/${r.id})`).join(", ");
      lines.push(`- **${tag[i.kind]}:** ${i.statement} *(${meta})*${refs ? ` Evidence: ${refs}` : ""}`);
    }
    lines.push("");
  }
  if (b.missing_data.length) {
    lines.push("## Missing data", ...b.missing_data.map((m) => `- ${m}`));
  }
  return lines.join("\n");
}
