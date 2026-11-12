import "server-only";
import type Anthropic from "@anthropic-ai/sdk";
import { canSeeInvestors, canWrite } from "../auth/permissions";
import { ENTITIES, REPORT_TYPE, TABLES, entity, isTable, type TableName } from "../schema";
import { cleanRecord } from "../validate";
import { capitalPosition, checkInCoverage, deliveryHealth, fundraisingPosition, investorIntelligence, pipelineMetrics, requestQueue, routinesDue, stageConversion, strategyAlignment, teamWorkload, DEFAULT_ESTIMATE_HOURS, WORKLOAD_WINDOW_DAYS } from "../analytics";
import { todayISO } from "../utils";
import { writeAudit } from "../audit";
import type { AiContext } from "./context";
import type { Row, SourceRef } from "../types";

/** Record types the AI may never propose changes to: financial records, permissions and its own queue. */
export const AI_READ_ONLY: TableName[] = ["organisations", "users", "teams", "audit_logs", "ai_recommendations", "investor_commitments", "capital_receipts", "financial_snapshots", "reports"];

const READABLE_TABLES = TABLES.filter((t) => t !== "audit_logs" && t !== "organisations");

export const TOOL_LABELS: Record<string, string> = {
  workspace_overview: "Reviewing the workspace",
  search_records: "Searching records",
  get_record: "Reading a record",
  delivery_health: "Analysing project delivery",
  pipeline_forecast: "Calculating the pipeline forecast",
  fundraising_position: "Analysing the fundraising position",
  investor_intelligence: "Reviewing investor relationships",
  strategy_alignment: "Checking strategic alignment",
  team_operations: "Reviewing team workload and operations",
  my_work: "Looking at personal workload",
  propose_update: "Proposing a change for approval",
  save_report_draft: "Saving a report draft",
};

export function toolDefinitions(): Anthropic.Beta.BetaTool[] {
  return [
    {
      name: "workspace_overview",
      description: "Headline view of the whole business: counts, key metrics and every computed signal (overdue work, stalled deals, decisions awaiting approval, investor follow-ups, runway) with record references. Call this first for broad questions such as briefings or 'where should leadership focus'.",
      input_schema: { type: "object", properties: {} },
    },
    {
      name: "search_records",
      description: `Search one type of record. Returns compact rows with ids and resolved names. Record types: ${READABLE_TABLES.join(", ")}. Use 'filters' for exact matches on fields such as status, stage, owner_id or project_id. Results respect the user's permissions; a restricted type returns an error.`,
      input_schema: {
        type: "object",
        properties: {
          table: { type: "string", enum: [...READABLE_TABLES] },
          query: { type: "string", description: "Free-text search across names and descriptions. Omit to list all." },
          filters: { type: "object", description: "Exact-match filters, e.g. {\"status\": \"blocked\"}", additionalProperties: { type: ["string", "number", "boolean", "null"] } },
          limit: { type: "integer", minimum: 1, maximum: 60 },
        },
        required: ["table"],
      },
    },
    {
      name: "get_record",
      description: "Read one record in full, plus the records linked to it (milestones of a project, activity on a deal, diligence requests of an investor, and so on).",
      input_schema: { type: "object", properties: { table: { type: "string", enum: [...READABLE_TABLES] }, id: { type: "string" } }, required: ["table", "id"] },
    },
    {
      name: "delivery_health",
      description: "Project delivery analysis: RAG counts, overdue milestones and actions, blocked and escalated actions, deadline clashes for one owner across projects, cross-project dependencies at risk, projects past target date or over budget.",
      input_schema: { type: "object", properties: {} },
    },
    {
      name: "pipeline_forecast",
      description: "Commercial pipeline maths: total, weighted (value × probability), weighted closing in 90 days, win rate, stage totals, stage-to-stage conversion, stalled deals, deals without next steps, past close dates.",
      input_schema: { type: "object", properties: {} },
    },
    {
      name: "fundraising_position",
      description: "Fundraising and capital: target, indicative pipeline, soft commitments, legally binding commitments and cash received kept separate; investors by stage; diligence; cash, burn and runway with assumptions. Investor-access roles only.",
      input_schema: { type: "object", properties: {} },
    },
    {
      name: "investor_intelligence",
      description: "Investor relationship signals: follow-ups due, investors with no recent contact, overdue or blocked diligence, repeated investor questions, requests awaiting approval, relevant investors not yet in the pipeline. Investor-access roles only.",
      input_schema: { type: "object", properties: {} },
    },
    {
      name: "strategy_alignment",
      description: "Strategy checks: objectives without owners, measurable outcomes or delivery plans; active projects not linked to an objective; objectives at risk; KPIs against target.",
      input_schema: { type: "object", properties: {} },
    },
    {
      name: "team_operations",
      description: "Internal team operations: workload per person against capacity over the next two weeks (with the method), who is overloaded or has overdue or blocked work, projects without a check-in this week, routines that are overdue or ready to run, and the internal request queue (untriaged, unassigned, overdue). Use for questions about the team, capacity, who should take work, standups and the weekly operating rhythm.",
      input_schema: { type: "object", properties: { team_id: { type: "string", description: "Optional: limit to one team" } } },
    },
    {
      name: "my_work",
      description: "One person's work: open actions grouped as overdue, blocked, due this week and later, their routines and assigned requests, and their load against capacity. Defaults to the signed-in user. Use for 'what should I focus on', 'what's on Tom's plate', or to prepare a 1:1.",
      input_schema: { type: "object", properties: { person_id: { type: "string", description: "A users id. Omit for the signed-in user." } } },
    },
    {
      name: "propose_update",
      description: "Propose creating or updating a record. Nothing changes until a person approves it in the AI proposals queue. Use for actions from meetings, status changes the user describes, new risks or decisions. Never use it to mark work complete without evidence. Financial records, commitments and receipts cannot be proposed.",
      input_schema: {
        type: "object",
        properties: {
          table: { type: "string", enum: TABLES.filter((t) => !AI_READ_ONLY.includes(t)) },
          action: { type: "string", enum: ["create", "update"] },
          record_id: { type: "string", description: "Required for update." },
          changes: { type: "object", description: "Field values using the field keys from search results. Use ids for relation fields (e.g. owner_id).", additionalProperties: true },
          title: { type: "string", description: "One-line description of the proposal, e.g. 'Create action: Sophie to send Halcyon proposal v2 by Friday'." },
          rationale: { type: "string", description: "Why, with the evidence." },
          confidence: { type: "string", enum: ["low", "medium", "high"] },
          source_refs: { type: "array", items: { type: "object", properties: { table: { type: "string" }, id: { type: "string" } }, required: ["table", "id"] } },
        },
        required: ["table", "action", "changes", "title", "rationale", "confidence"],
      },
    },
    {
      name: "save_report_draft",
      description: "Save a report you have written as an unapproved draft in Intelligence & Reporting. Use when the user asks you to prepare a briefing, update or board report. The body is Markdown and must cite records as [Name](/records/<table>/<id>).",
      input_schema: {
        type: "object",
        properties: {
          title: { type: "string" },
          report_type: { type: "string", enum: [...REPORT_TYPE] },
          period: { type: "string" },
          body: { type: "string" },
          source_refs: { type: "array", items: { type: "object", properties: { table: { type: "string" }, id: { type: "string" } }, required: ["table", "id"] } },
        },
        required: ["title", "report_type", "body"],
      },
    },
  ];
}

export interface ToolOutcome { result: unknown; isError?: boolean; proposalId?: string; reportId?: string }

export async function runTool(ctx: AiContext, name: string, input: Record<string, unknown>): Promise<ToolOutcome> {
  try {
    switch (name) {
      case "workspace_overview": return { result: await overview(ctx) };
      case "search_records": return { result: await search(ctx, input) };
      case "get_record": return { result: await getRecord(ctx, input) };
      case "delivery_health": return { result: await delivery(ctx) };
      case "pipeline_forecast": return { result: await pipeline(ctx) };
      case "fundraising_position": return { result: await fundraising(ctx) };
      case "investor_intelligence": return { result: await investorIntel(ctx) };
      case "strategy_alignment": return { result: await strategy(ctx) };
      case "team_operations": return { result: await teamOps(ctx, input) };
      case "my_work": return { result: await myWork(ctx, input) };
      case "propose_update": return await propose(ctx, input);
      case "save_report_draft": return await saveReport(ctx, input);
      default: return { result: `Unknown tool ${name}`, isError: true };
    }
  } catch (e) {
    return { result: `Tool failed: ${(e as Error).message}`, isError: true };
  }
}

/* ---------------- implementations ---------------- */

async function overview(ctx: AiContext) {
  const b = await ctx.bundle();
  const signals = await ctx.signals();
  const pm = pipelineMetrics(b.commercial_opportunities);
  const out: Record<string, unknown> = {
    today: todayISO(),
    organisation: ctx.session.orgName,
    counts: {
      objectives: b.objectives.length, active_projects: b.projects.filter((p) => p.status === "active").length,
      open_actions: b.tasks.filter((t) => t.status !== "done").length, open_risks: b.risks.filter((r) => r.status !== "closed").length,
      open_opportunities: pm.openCount,
      decisions_awaiting: b.decisions.filter((d) => d.status === "awaiting_approval" || d.status === "proposed").length,
    },
    kpis: b.kpis.map((k) => ({ id: k.id, name: k.name, current: k.current_value, target: k.target_value, unit: k.unit, direction: k.direction, last_measured: k.last_updated, source: k.source })),
    commercial: { open_pipeline: pm.total, weighted_pipeline: Math.round(pm.weighted), weighted_next_90_days: Math.round(pm.weightedNext90), win_rate_pct: pm.winRate },
    signals: signals.map((s) => ({ severity: s.severity, area: s.area, title: s.title, detail: s.detail, refs: s.refs })),
    upcoming_meetings: (await ctx.rows("meetings")).filter((m) => m.held_at >= new Date().toISOString()).map((m) => ({ id: m.id, title: m.title, held_at: m.held_at })),
  };
  if (canSeeInvestors(ctx.session.role)) {
    const round = b.fundraising_rounds.find((r) => r.status !== "closed");
    const fp = fundraisingPosition(round, b.fundraising_opportunities, b.investor_commitments, b.capital_receipts);
    const cap = capitalPosition(b.financial_snapshots);
    out.fundraising = { round: round?.name, target: fp.target, indicative_pipeline: fp.indicative, soft_commitments: fp.soft, legally_committed: fp.legal, funds_received: fp.received, investors_in_diligence: fp.inDiligence.length };
    out.capital = { cash: cap.latest?.cash_balance, as_of: cap.latest?.period, avg_burn_3m: Math.round(cap.avgBurn3m ?? 0), runway_months: cap.runwayMonths ? Number(cap.runwayMonths.toFixed(1)) : null, assumptions: cap.assumptions };
  } else {
    out.note = "This user's role cannot see investor, fundraising or financial records. Do not speculate about them.";
  }
  return out;
}

async function search(ctx: AiContext, input: Record<string, unknown>) {
  const table = String(input.table);
  if (!isTable(table) || !ctx.readable(table)) return { error: `Record type '${table}' is not available to this user.` };
  const limit = Math.min(Number(input.limit) || 25, 60);
  let rows = await ctx.rows(table);
  const filters = (input.filters ?? {}) as Record<string, unknown>;
  for (const [k, v] of Object.entries(filters)) rows = rows.filter((r) => (r[k] ?? null) === v);
  const q = String(input.query ?? "").trim().toLowerCase();
  if (q) {
    const lk = await ctx.lookups();
    const def = entity(table);
    rows = rows.filter((r) => {
      const parts = def.search.map((f) => String(r[f] ?? ""));
      for (const f of def.fields) if (f.type === "relation" && r[f.key]) parts.push(lk[f.relation!]?.[r[f.key]] ?? "");
      return q.split(/\s+/).every((w) => parts.join(" ").toLowerCase().includes(w));
    });
  }
  return { table, total_matches: rows.length, returned: Math.min(rows.length, limit), rows: await Promise.all(rows.slice(0, limit).map((r) => ctx.compact(table, r))) };
}

async function getRecord(ctx: AiContext, input: Record<string, unknown>) {
  const table = String(input.table);
  if (!isTable(table) || !ctx.readable(table)) return { error: `Record type '${table}' is not available to this user.` };
  const row = (await ctx.rows(table)).find((r) => r.id === input.id);
  if (!row) return { error: "No record with that id (or it is restricted)." };
  const related: Record<string, unknown[]> = {};
  for (const t of TABLES) {
    if (!ctx.readable(t) || t === "ai_recommendations") continue;
    for (const f of ENTITIES[t].fields) {
      if (f.type !== "relation" || f.relation !== table) continue;
      const rows = (await ctx.rows(t)).filter((r) => r[f.key] === row.id);
      if (rows.length) related[`${t} (via ${f.key})`] = await Promise.all(rows.slice(0, 25).map((r) => ctx.compact(t, r)));
    }
  }
  return { table, record: await ctx.compact(table, row, true), related };
}

const ids = (rows: Row[], f: string) => rows.map((r) => ({ id: r.id, name: r[f] }));

async function delivery(ctx: AiContext) {
  const b = await ctx.bundle();
  const d = deliveryHealth(b.projects, b.milestones, b.tasks, b.dependencies);
  const name = (id: string) => b.users.find((u) => u.id === id)?.full_name ?? "Unassigned";
  return {
    today: todayISO(),
    rag_counts: d.rag,
    projects: await Promise.all(d.activeProjects.map((p) => ctx.compact("projects", p))),
    overdue_milestones: await Promise.all(d.overdueMilestones.map((m) => ctx.compact("milestones", m))),
    overdue_actions: await Promise.all(d.overdueTasks.map((t) => ctx.compact("tasks", t))),
    blocked_actions: ids(d.blocked, "title"),
    escalated_actions: ids(d.escalated, "title"),
    deadline_clashes: d.conflicts.map((c) => ({ owner: name(c.owner_id), milestones: c.items.map((i) => ({ id: i.id, title: i.title, due: i.due_date })) })),
    dependencies_at_risk: await Promise.all(d.atRiskDeps.map((x) => ctx.compact("dependencies", x))),
    past_target_date: ids(d.pastTarget, "name"),
    over_budget: d.overBudget.map((p) => ({ id: p.id, name: p.name, budget: p.budget, spent: p.spent })),
    open_risks: await Promise.all(b.risks.filter((r) => r.status !== "closed").map((r) => ctx.compact("risks", r))),
  };
}

async function pipeline(ctx: AiContext) {
  const opps = await ctx.rows("commercial_opportunities");
  const pm = pipelineMetrics(opps);
  return {
    today: todayISO(),
    method: "Weighted value = estimated annual value × probability. Win rate = won ÷ (won + lost) by count.",
    totals: { open_count: pm.openCount, open_value: pm.total, weighted: Math.round(pm.weighted), weighted_next_90_days: Math.round(pm.weightedNext90), won_value: pm.wonValue, win_rate_pct: pm.winRate },
    by_stage: pm.byStage,
    stage_conversion: stageConversion(opps),
    stalled: await Promise.all(pm.stalled.map((o) => ctx.compact("commercial_opportunities", o))),
    without_next_step: ids(pm.noNextStep, "name"),
    past_expected_close: ids(pm.pastClose, "name"),
    overdue_next_actions: ids(pm.overdueNext, "name"),
    next_7_days: ids(pm.upcoming, "name"),
    open_opportunities: await Promise.all(opps.filter((o) => o.stage !== "Won" && o.stage !== "Lost").map((o) => ctx.compact("commercial_opportunities", o))),
  };
}

async function fundraising(ctx: AiContext) {
  if (!canSeeInvestors(ctx.session.role)) return { error: "This user's role cannot see fundraising or financial data." };
  const b = await ctx.bundle();
  const round = b.fundraising_rounds.find((r) => r.status !== "closed");
  const fp = fundraisingPosition(round, b.fundraising_opportunities, b.investor_commitments, b.capital_receipts);
  const cap = capitalPosition(b.financial_snapshots);
  return {
    today: todayISO(),
    important: "Indicative interest is not committed capital. Only 'legally_committed' is binding and only 'funds_received' is cash.",
    round: round ? await ctx.compact("fundraising_rounds", round) : null,
    target: fp.target, indicative_pipeline: fp.indicative, potential_pipeline: fp.potential, soft_commitments: fp.soft, legally_committed: fp.legal, funds_received: fp.received,
    gap_to_target_on_legal_commitments: fp.gapToLegal,
    unverified_commitments_or_receipts: fp.unverified.map((x) => ({ id: x.id, reference: x.reference })),
    by_stage: fp.byStage.filter((s) => s.count),
    pipeline: await Promise.all(b.fundraising_opportunities.map((o) => ctx.compact("fundraising_opportunities", o))),
    commitments: await Promise.all(b.investor_commitments.map((c) => ctx.compact("investor_commitments", c))),
    days_to_target_close: fp.daysToTargetClose,
    capital: { latest_snapshot: cap.latest ? await ctx.compact("financial_snapshots", cap.latest) : null, avg_burn_3m: Math.round(cap.avgBurn3m ?? 0), runway_months: cap.runwayMonths ? Number(cap.runwayMonths.toFixed(1)) : null, assumptions: cap.assumptions },
  };
}

async function investorIntel(ctx: AiContext) {
  if (!canSeeInvestors(ctx.session.role)) return { error: "This user's role cannot see investor data." };
  const b = await ctx.bundle();
  const ii = investorIntelligence(b.investors, b.fundraising_opportunities, b.due_diligence_requests, b.investor_interactions);
  return {
    today: todayISO(),
    follow_ups_due: ids(ii.followUpDue, "name"),
    no_recent_contact_30d: ii.dormant.map((i) => ({ id: i.id, name: i.name, last_contact: i.last_contact_date })),
    overdue_diligence: await Promise.all(ii.overdueDD.map((d) => ctx.compact("due_diligence_requests", d))),
    blocked_diligence: ids(ii.blockedDD, "request"),
    awaiting_internal_approval: ids(ii.awaitingApproval, "request"),
    repeated_questions: ii.repeated.map((g) => ({ topic: g.topic, investors: g.investors, requests: ids(g.rows, "request") })),
    pipeline_next_actions_overdue: ids(ii.overdueNext, "name"),
    pipeline_without_next_action: ids(ii.noNext, "name"),
    investors_not_in_pipeline: await Promise.all(ii.prospects.map((i) => ctx.compact("investors", i))),
  };
}

async function strategy(ctx: AiContext) {
  const b = await ctx.bundle();
  const s = strategyAlignment(b.objectives, b.projects, b.commercial_opportunities);
  return {
    objectives: await Promise.all(b.objectives.map((o) => ctx.compact("strategic_objectives", o))),
    kpis: await Promise.all(b.kpis.map((k) => ctx.compact("kpis", k))),
    without_owner: ids(s.noOwner, "title"),
    without_measurable_outcome: ids(s.noMeasure, "title"),
    without_delivery_plan: ids(s.noDeliveryPlan, "title"),
    projects_not_linked_to_strategy: ids(s.unalignedProjects, "name"),
    at_risk: ids(s.atRisk, "title"),
  };
}

async function teamOps(ctx: AiContext, input: Record<string, unknown>) {
  const team = typeof input.team_id === "string" ? input.team_id : null;
  const users = (await ctx.rows("users")).filter((u) => !team || u.team_id === team);
  const tasks = await ctx.rows("tasks");
  const load = teamWorkload(users, tasks);
  const coverage = checkInCoverage(await ctx.rows("projects"), await ctx.rows("status_updates"));
  const rd = routinesDue(await ctx.rows("routines"));
  const rq = requestQueue(await ctx.rows("requests"));
  return {
    today: todayISO(),
    method: `Load = estimated hours of open actions due within ${WORKLOAD_WINDOW_DAYS} days (or overdue, or in progress without a date) ÷ (weekly capacity × ${WORKLOAD_WINDOW_DAYS / 7}). Actions without an estimate count as ${DEFAULT_ESTIMATE_HOURS}h.`,
    workload: load.map((w) => ({ person_id: w.user.id, person: w.user.full_name, title: w.user.title, open_actions: w.open, overdue: w.overdue, blocked: w.blocked, critical: w.critical, hours_due_in_window: Math.round(w.hours), unestimated_in_window: w.unestimated, capacity_hours_in_window: Math.round(w.capacity), load_pct: w.load === null ? null : Math.round(w.load), actions_in_window: w.windowTasks.map((t) => ({ id: t.id, title: t.title, due: t.due_date, status: t.status, priority: t.priority, estimate_hours: t.estimate_hours ?? null })) })),
    check_ins: coverage.map((c) => ({ project_id: c.project.id, project: c.project.name, latest_week_ending: c.latest?.week_ending ?? null, latest_rag: c.latest?.rag ?? null, latest_headline: c.latest?.headline ?? null, missing_this_week: c.stale })),
    routines: { overdue: ids(rd.overdue, "title"), ready_to_run: ids(rd.readyToRun, "title"), upcoming: rd.upcoming.slice(0, 8).map((r) => ({ id: r.id, title: r.title, next_due: r.next_due, cadence: r.cadence })) },
    requests: { untriaged: await Promise.all(rq.untriaged.map((r) => ctx.compact("requests", r))), unassigned: ids(rq.unassigned, "title"), overdue: ids(rq.overdue, "title"), due_in_7_days: ids(rq.dueSoon, "title") },
  };
}

async function myWork(ctx: AiContext, input: Record<string, unknown>) {
  const pid = typeof input.person_id === "string" ? input.person_id : ctx.session.personId;
  if (!pid) return { error: "The signed-in user is not linked to a person record. Ask an admin to link their membership to a person." };
  const person = (await ctx.rows("users")).find((u) => u.id === pid);
  if (!person) return { error: "No person with that id." };
  const today = todayISO();
  const tasks = (await ctx.rows("tasks")).filter((t) => t.owner_id === pid);
  const open = tasks.filter((t) => t.status !== "done");
  const due = (t: Row) => (t.due_date ? Math.round((new Date(t.due_date).getTime() - new Date(today).getTime()) / 86400000) : null);
  const c = (rows: Row[]) => Promise.all(rows.map((t) => ctx.compact("tasks", t)));
  const w = teamWorkload([person], await ctx.rows("tasks"))[0];
  return {
    person: { id: person.id, name: person.full_name, title: person.title },
    today,
    overdue: await c(open.filter((t) => (due(t) ?? 1) < 0 && t.status !== "blocked")),
    blocked: await c(open.filter((t) => t.status === "blocked")),
    due_this_week: await c(open.filter((t) => { const d = due(t); return d !== null && d >= 0 && d <= 7 && t.status !== "blocked"; })),
    later: ids(open.filter((t) => { const d = due(t); return (d === null || d > 7) && t.status !== "blocked"; }), "title"),
    routines_owned: (await ctx.rows("routines")).filter((r) => r.owner_id === pid).map((r) => ({ id: r.id, title: r.title, next_due: r.next_due })),
    requests_assigned: ids((await ctx.rows("requests")).filter((r) => r.owner_id === pid && !["done", "declined"].includes(r.status)), "title"),
    decisions_owned_pending: ids((await ctx.rows("decisions")).filter((d) => d.owner_id === pid && ["proposed", "awaiting_approval"].includes(d.status)), "title"),
    load: w ? { hours_due_in_window: Math.round(w.hours), capacity_hours_in_window: Math.round(w.capacity), load_pct: w.load === null ? null : Math.round(w.load) } : null,
  };
}

function cleanRefs(raw: unknown): SourceRef[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((r) => r && isTable(String(r.table)) && typeof r.id === "string").slice(0, 30).map((r) => ({ table: r.table as TableName, id: String(r.id) }));
}

async function propose(ctx: AiContext, input: Record<string, unknown>): Promise<ToolOutcome> {
  const table = String(input.table);
  if (!isTable(table) || AI_READ_ONLY.includes(table)) return { result: `Changes to '${table}' cannot be proposed by the AI.`, isError: true };
  if (!canWrite(table, ctx.session.role)) return { result: `${ctx.session.name}'s role cannot approve changes to ${table}, so no proposal was created. Suggest who should make the change instead.`, isError: true };
  if (!canWrite("ai_recommendations", ctx.session.role)) return { result: "This user's role is read-only; proposals cannot be created.", isError: true };
  const action = input.action === "update" ? "update" : "create";
  const changes = (input.changes ?? {}) as Record<string, unknown>;
  let existing: Row | undefined;
  if (action === "update") {
    existing = (await ctx.rows(table)).find((r) => r.id === input.record_id);
    if (!existing) return { result: "record_id not found for update.", isError: true };
  }
  const clean = cleanRecord(table, changes, action === "update");
  if (!clean.ok) return { result: { error: "Validation failed", fields: clean.errors }, isError: true };
  const unknownKeys = Object.keys(changes).filter((k) => !entity(table).fields.some((f) => f.key === k));
  if (unknownKeys.length) return { result: `Unknown fields for ${table}: ${unknownKeys.join(", ")}`, isError: true };
  const evidence = clean.data.evidence ?? existing?.evidence;
  if (table === "tasks" && clean.data.status === "done" && !evidence) return { result: "An action cannot be proposed as done without evidence. Include an 'evidence' field describing what proves completion.", isError: true };
  if (table === "milestones" && clean.data.status === "complete" && !evidence) return { result: "A milestone cannot be proposed as complete without evidence.", isError: true };
  const payload = action === "update" ? Object.fromEntries(Object.keys(changes).map((k) => [k, clean.data[k]])) : clean.data;
  const row = await ctx.store.insert("ai_recommendations", {
    kind: "proposed_change",
    title: String(input.title).slice(0, 300),
    rationale: String(input.rationale ?? "").slice(0, 4000),
    confidence: ["low", "medium", "high"].includes(String(input.confidence)) ? input.confidence : "medium",
    target_table: table,
    target_id: action === "update" ? existing!.id : null,
    action,
    payload,
    source_refs: cleanRefs(input.source_refs),
    status: "pending",
    created_by: ctx.session.authUserId,
  });
  await writeAudit(ctx.store, ctx.session, { action: "create", table: "ai_recommendations", recordId: row.id, summary: `AI proposed: ${row.title}`, actorType: "ai" });
  ctx.invalidate("ai_recommendations");
  return { result: { proposal_id: row.id, status: "pending approval", note: "Tell the user it is waiting in the AI proposals queue." }, proposalId: row.id };
}

async function saveReport(ctx: AiContext, input: Record<string, unknown>): Promise<ToolOutcome> {
  if (!canWrite("reports", ctx.session.role)) return { result: "This user's role cannot create reports.", isError: true };
  const type = REPORT_TYPE.includes(input.report_type as (typeof REPORT_TYPE)[number]) ? String(input.report_type) : "weekly_ceo_update";
  const row = await ctx.store.insert("reports", {
    title: String(input.title).slice(0, 200),
    report_type: type,
    period: input.period ? String(input.period) : null,
    status: "draft",
    ai_generated: true,
    body: String(input.body ?? ""),
    sources: cleanRefs(input.source_refs),
    created_by: ctx.session.authUserId,
  });
  await writeAudit(ctx.store, ctx.session, { action: "create", table: "reports", recordId: row.id, summary: `AI drafted report “${row.title}”`, actorType: "ai" });
  return { result: { report_id: row.id, link: `/intelligence/reports/${row.id}`, status: "draft, awaiting review" }, reportId: row.id };
}
