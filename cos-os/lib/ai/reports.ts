import "server-only";
import type { Session, SourceRef } from "../types";
import { humanize, REPORT_TYPE, type TableName } from "../schema";
import { todayISO } from "../utils";
import { writeAudit } from "../audit";
import { canSeeInvestors } from "../auth/permissions";
import { assertClaude, createMessage, textOf } from "./client";
import { AiContext } from "./context";
import { dataPack, knownIds, type PackPart } from "./datapack";
import { systemBlocks } from "./agent";

type ReportType = (typeof REPORT_TYPE)[number];

const SPEC: Record<ReportType, { parts: PackPart[]; brief: string; investorOnly?: boolean }> = {
  daily_briefing: { parts: ["overview", "delivery", "pipeline", "fundraising", "investors"], brief: "A daily executive briefing answering: what matters most today, what has changed, what is falling behind, what needs a leadership decision, where management should focus." },
  weekly_ceo_update: { parts: ["overview", "delivery", "pipeline", "fundraising", "strategy"], brief: "A weekly CEO update to the leadership team: headlines, progress against objectives, delivery, commercial, fundraising (if visible), risks, decisions needed, focus for next week." },
  project_portfolio: { parts: ["delivery", "strategy"], brief: "An executive-ready project portfolio report with a RAG table (project, owner, RAG, target date, key issue), overdue milestones, deadline clashes, cross-project dependencies, risks and recommended mitigations." },
  pipeline_review: { parts: ["pipeline", "strategy"], brief: "A weekly commercial pipeline review: totals and weighted forecast (show the method), movement, stalled deals, deals without next steps, forecast risks, and the opportunities leadership should prioritise this week with owners." },
  investor_update: { parts: ["overview", "delivery", "pipeline", "fundraising", "strategy"], investorOnly: false, brief: "A monthly investor update for existing investors: highlights, key metrics with sources, commercial progress, product and delivery, team, fundraising status phrased appropriately for external readers, asks. Only include figures that are recorded." },
  monthly_business_review: { parts: ["overview", "delivery", "pipeline", "fundraising", "strategy"], brief: "A monthly business review: performance against objectives and KPIs, commercial, delivery, capital, risks, decisions and next month's priorities." },
  board_pack: { parts: ["overview", "delivery", "pipeline", "fundraising", "investors", "strategy"], brief: "A board pack: executive summary, KPIs, strategic progress, commercial performance, delivery, fundraising and capital (cash, burn, runway with assumptions), key risks, management commentary, capital allocation, decisions requested of the board." },
  risk_summary: { parts: ["delivery", "pipeline", "fundraising", "strategy"], brief: "A strategic risk summary: top risks by likelihood × impact across delivery, commercial, fundraising and people, with owners, mitigations and what would change the rating." },
  ir_briefing: { parts: ["fundraising", "investors"], investorOnly: true, brief: "A weekly investor relations briefing: fundraising position against target (indicative vs soft vs legal vs received kept separate), investors needing follow-up, diligence bottlenecks, repeated questions, relationships with no recent activity, investors to approach, meetings and commitments approaching close dates." },
};

/** Drafts a report from workspace data and saves it as an unapproved AI draft. */
export async function generateReport(session: Session, type: ReportType, period: string, instructions: string) {
  assertClaude();
  const spec = SPEC[type];
  if (spec.investorOnly && !canSeeInvestors(session.role)) throw new Error("Your role cannot generate investor reports.");
  const ctx = await AiContext.create(session);
  const pack = await dataPack(ctx, spec.parts);

  const res = await createMessage({
    max_tokens: 16000,
    system: systemBlocks(session),
    output_config: { effort: "high" },
    messages: [{
      role: "user",
      content: `Write a ${humanize(type).toLowerCase()} for ${session.orgName}${period ? `, period: ${period}` : ""}. Today is ${todayISO()}.

What it should cover: ${spec.brief}
${instructions ? `\nThe requester asked you to emphasise: ${instructions}\n` : ""}
Rules:
- Markdown. Start with a 3–5 bullet executive summary. Use ## section headings and small tables where they help.
- Use only the data below. Cite records inline as [Name](/records/<table>/<id>) using ids from the data.
- Where a section needs data that is not recorded, write "Not recorded" and say what is needed. Never estimate a figure that is not in the data.
- Label assumptions and recommendations explicitly. Recommendations name an owner and a date.
- Do not add a title line; the report has its own title.

Workspace data (JSON):
${JSON.stringify(pack)}`,
    }],
  });
  if (res.stop_reason === "refusal") throw new Error("Claude declined to write this report.");
  const body = textOf(res.content);
  if (!body) throw new Error("Claude returned an empty report. Try again.");

  // Sources: every valid record link in the body.
  const ids = await knownIds(ctx);
  const sources: SourceRef[] = [];
  for (const m of body.matchAll(/\/records\/([a-z_]+)\/([0-9a-f-]{36})/g)) {
    const k = ids.get(m[2]);
    if (k && k.table === m[1] && !sources.some((s) => s.id === m[2])) sources.push({ table: m[1] as TableName, id: m[2], label: k.label });
  }
  const row = await ctx.store.insert("reports", {
    title: `${humanize(type)}${period ? `: ${period}` : ""}`,
    report_type: type,
    period: period || todayISO(),
    status: "draft",
    ai_generated: true,
    body,
    sources,
    created_by: session.authUserId,
  });
  await writeAudit(ctx.store, session, { action: "create", table: "reports", recordId: row.id, summary: `AI drafted “${row.title}”`, actorType: "ai" });
  return row;
}
