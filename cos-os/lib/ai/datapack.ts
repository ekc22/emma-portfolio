import "server-only";
import { canSeeInvestors } from "../auth/permissions";
import type { AiContext } from "./context";
import { runTool } from "./tools";

export type PackPart = "overview" | "delivery" | "operations" | "pipeline" | "fundraising" | "investors" | "strategy";

/** Collects tool outputs into one JSON document for single-call generation (briefings, reports). */
export async function dataPack(ctx: AiContext, parts: PackPart[]) {
  const names: Record<PackPart, string> = { overview: "workspace_overview", delivery: "delivery_health", operations: "team_operations", pipeline: "pipeline_forecast", fundraising: "fundraising_position", investors: "investor_intelligence", strategy: "strategy_alignment" };
  const out: Record<string, unknown> = {};
  for (const p of parts) {
    if ((p === "fundraising" || p === "investors") && !canSeeInvestors(ctx.session.role)) continue;
    out[p] = (await runTool(ctx, names[p], {})).result;
  }
  return out;
}

/** Ids the model may cite: every record visible in this context. */
export async function knownIds(ctx: AiContext) {
  const lk = await ctx.lookups();
  const map = new Map<string, { table: string; label: string }>();
  for (const [table, rows] of Object.entries(lk)) for (const [id, label] of Object.entries(rows ?? {})) map.set(id, { table, label });
  return map;
}
