import "server-only";
import * as z from "zod/v4";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import type { Session } from "../types";
import { canWrite } from "../auth/permissions";
import { weekEnding } from "../analytics";
import { todayISO, daysFromToday } from "../utils";
import { writeAudit } from "../audit";
import { assertClaude, createMessage, textOf } from "./client";
import { AiContext } from "./context";
import { systemBlocks } from "./agent";

const CheckIn = z.object({
  headline: z.string().describe("One line a busy CEO would read: the state of the project and the one thing that matters"),
  rag: z.enum(["green", "amber", "red"]),
  progress: z.number().int().min(0).max(100),
  summary: z.string().describe("What moved this week, from completed actions, milestones and changes in the records"),
  blockers: z.string().describe("Blockers and asks of leadership, or 'None recorded'"),
  next_steps: z.string().describe("What happens next week, from open actions and upcoming milestones, with owners"),
  missing: z.array(z.string()).describe("What the owner needs to confirm that the records cannot show"),
});

/**
 * Drafts a weekly check-in for a project from its records and recent changes.
 * The draft is a proposal: the project owner edits and approves it.
 */
export async function draftCheckIn(session: Session, projectId: string) {
  assertClaude();
  if (!canWrite("status_updates", session.role)) throw new Error("Your role cannot write check-ins.");
  const ctx = await AiContext.create(session);
  const project = (await ctx.rows("projects")).find((p) => p.id === projectId);
  if (!project) throw new Error("Project not found.");
  const today = todayISO();
  const rel = async (t: "milestones" | "tasks" | "risks" | "dependencies" | "status_updates", key = "project_id") =>
    Promise.all((await ctx.rows(t)).filter((r) => r[key] === projectId).map((r) => ctx.compact(t, r)));
  const changes = (await ctx.rows("audit_logs"))
    .filter((a) => (daysFromToday(String(a.created_at).slice(0, 10), today) ?? -99) >= -7)
    .slice(0, 60).map((a) => ({ when: a.created_at, summary: a.summary, by: a.actor_name }));
  const data = {
    today, week_ending: weekEnding(today),
    project: await ctx.compact("projects", project, true),
    milestones: await rel("milestones"), actions: await rel("tasks"), risks: await rel("risks"),
    dependencies: [...(await rel("dependencies")), ...(await rel("dependencies", "depends_on_project_id"))],
    previous_check_ins: (await rel("status_updates")).slice(0, 3),
    workspace_changes_last_7_days: changes,
  };
  const res = await createMessage({
    max_tokens: 8000,
    system: systemBlocks(session),
    output_config: { effort: "medium", format: zodOutputFormat(CheckIn) },
    messages: [{ role: "user", content: `Draft this week's check-in for the project below, as its owner would write it.
- Base it only on the records. Completed actions need evidence to count as progress.
- RAG: red if a critical milestone is overdue or the target date has passed; amber if risks or dependencies threaten the plan; otherwise green. Explain the rating in the headline or summary.
- Name owners for next steps. Keep each section to 2-4 short sentences or bullets.
- List anything the owner must confirm in "missing".

${JSON.stringify(data)}` }],
  });
  if (res.stop_reason === "refusal") throw new Error("Claude declined to draft this check-in.");
  const parsed = CheckIn.safeParse(JSON.parse(textOf(res.content) || "{}"));
  if (!parsed.success) throw new Error("The draft came back in an unexpected format. Try again.");
  const c = parsed.data;
  const row = await ctx.store.insert("ai_recommendations", {
    kind: "proposed_change", status: "pending", created_by: session.authUserId,
    title: `Check-in for ${project.name}: ${c.headline}`,
    rationale: `Drafted from the project's records.${c.missing.length ? ` Owner to confirm: ${c.missing.join("; ")}` : ""}`,
    confidence: c.missing.length > 2 ? "low" : "medium",
    target_table: "status_updates", target_id: null, action: "create",
    payload: { headline: c.headline, project_id: project.id, week_ending: data.week_ending, rag: c.rag, progress: c.progress, owner_id: project.owner_id ?? null, summary: c.summary, blockers: c.blockers, next_steps: c.next_steps },
    source_refs: [{ table: "projects", id: project.id, label: project.name }],
  });
  await writeAudit(ctx.store, session, { action: "create", table: "ai_recommendations", recordId: row.id, summary: `AI drafted a check-in for “${project.name}”`, actorType: "ai" });
  return { id: row.id };
}
