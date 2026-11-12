/**
 * Deterministic business analytics. Pure functions over stored records.
 *
 * These are "verified" signals: every figure is computed from records and every
 * signal carries references to the records behind it. The AI reads the same
 * functions through its tools, so its conclusions trace back to the same data.
 */
import { FUNDRAISING_STAGES, OPEN_COMMERCIAL_STAGES, COMMERCIAL_STAGES } from "../schema";
import type { Row, SourceRef } from "../types";
import { daysFromToday, sum, todayISO } from "../utils";

export type Severity = "high" | "medium" | "low";
export interface Signal {
  key: string;
  area: "strategy" | "delivery" | "operations" | "commercial" | "investors" | "capital" | "decisions";
  severity: Severity;
  title: string;
  detail: string;
  refs: SourceRef[];
}

const ref = (table: SourceRef["table"], r: Row, labelField: string): SourceRef => ({ table, id: r.id, label: String(r[labelField] ?? "") });
const isOverdue = (iso: string | null | undefined, today = todayISO()) => !!iso && iso.slice(0, 10) < today;

/* ---------------- Commercial ---------------- */
export const STALL_ACTIVITY_DAYS = 21;
export const STALL_STAGE_DAYS = 45;

export function pipelineMetrics(opps: Row[], today = todayISO()) {
  const open = opps.filter((o) => (OPEN_COMMERCIAL_STAGES as string[]).includes(o.stage));
  const won = opps.filter((o) => o.stage === "Won");
  const lost = opps.filter((o) => o.stage === "Lost");
  const weighted = (o: Row) => (Number(o.value) || 0) * (Number(o.probability) || 0) / 100;
  const byStage = COMMERCIAL_STAGES.map((stage) => {
    const rows = opps.filter((o) => o.stage === stage);
    return { stage, count: rows.length, value: sum(rows.map((r) => r.value)), weighted: sum(rows.map(weighted)) };
  });
  const in90 = open.filter((o) => { const d = daysFromToday(o.expected_close, today); return d !== null && d >= 0 && d <= 90; });
  const stalled = open.filter((o) => {
    const act = daysFromToday(o.last_activity_date, today);
    const stage = daysFromToday(o.stage_changed_at, today);
    return (act !== null && -act > STALL_ACTIVITY_DAYS) || (stage !== null && -stage > STALL_STAGE_DAYS);
  });
  const noNextStep = open.filter((o) => !o.next_action || !o.next_action_date);
  const pastClose = open.filter((o) => isOverdue(o.expected_close, today));
  const overdueNext = open.filter((o) => o.next_action_date && isOverdue(o.next_action_date, today));
  const closed = won.length + lost.length;
  return {
    openCount: open.length,
    total: sum(open.map((o) => o.value)),
    weighted: sum(open.map(weighted)),
    weightedNext90: sum(in90.map(weighted)),
    wonValue: sum(won.map((o) => o.value)),
    winRate: closed ? (won.length / closed) * 100 : null,
    byStage,
    stalled,
    noNextStep,
    pastClose,
    overdueNext,
    upcoming: open.filter((o) => { const d = daysFromToday(o.next_action_date, today); return d !== null && d >= 0 && d <= 7; }),
  };
}

/** Stage-to-stage conversion: share of deals that reached a stage which went on to reach the next. */
export function stageConversion(opps: Row[]) {
  const order = COMMERCIAL_STAGES.filter((s) => s !== "Lost");
  const reached = (o: Row, stage: string) => {
    if (o.stage === "Lost") return false; // unknown how far a lost deal reached; excluded
    return order.indexOf(o.stage) >= order.indexOf(stage as (typeof order)[number]);
  };
  return order.slice(0, -1).map((stage, i) => {
    const atOrBeyond = opps.filter((o) => reached(o, stage)).length;
    const next = opps.filter((o) => reached(o, order[i + 1])).length;
    return { from: stage, to: order[i + 1], rate: atOrBeyond ? (next / atOrBeyond) * 100 : null, count: atOrBeyond };
  });
}

/* ---------------- Fundraising ---------------- */
const OPEN_FUND_STAGES = FUNDRAISING_STAGES.filter((s) => !["Funds Received", "Closed", "Passed"].includes(s));

export function fundraisingPosition(round: Row | undefined, fundOpps: Row[], commitments: Row[], receipts: Row[], today = todayISO()) {
  const inRound = (r: Row) => !round || r.round_id === round.id;
  const opps = fundOpps.filter(inRound);
  const comms = commitments.filter(inRound);
  const recs = receipts.filter(inRound);
  const target = Number(round?.target_amount) || 0;
  const open = opps.filter((o) => (OPEN_FUND_STAGES as string[]).includes(o.stage));
  const soft = sum(comms.filter((c) => c.commitment_type === "soft").map((c) => c.amount));
  const legal = sum(comms.filter((c) => c.commitment_type === "legal").map((c) => c.amount));
  const received = sum(recs.map((r) => r.amount));
  const unverified = [...comms, ...recs].filter((x) => !x.verified);
  const byStage = FUNDRAISING_STAGES.map((stage) => {
    const rows = opps.filter((o) => o.stage === stage);
    return { stage, count: rows.length, potential: sum(rows.map((r) => r.potential_amount)), indicative: sum(rows.map((r) => r.indicative_amount)) };
  });
  const active = opps.filter((o) => o.stage !== "Passed");
  const reachedDD = active.filter((o) => FUNDRAISING_STAGES.indexOf(o.stage) >= FUNDRAISING_STAGES.indexOf("Due Diligence")).length;
  return {
    round,
    target,
    potential: sum(open.map((o) => o.potential_amount)),
    indicative: sum(open.map((o) => o.indicative_amount)),
    soft,
    legal,
    received,
    gapToLegal: Math.max(target - legal, 0),
    gapToSoftAndLegal: Math.max(target - legal - soft, 0),
    byStage,
    activeInvestors: active.length,
    inDiligence: opps.filter((o) => o.stage === "Due Diligence"),
    ddConversion: active.length ? (reachedDD / active.length) * 100 : null,
    unverified,
    closingSoon: open.filter((o) => { const d = daysFromToday(o.expected_close, today); return d !== null && d >= 0 && d <= 30; }),
    daysToTargetClose: daysFromToday(round?.target_close_date, today),
  };
}

/* ---------------- Capital ---------------- */
export function capitalPosition(snapshots: Row[]) {
  const sorted = [...snapshots].sort((a, b) => String(b.period).localeCompare(String(a.period)));
  const latest = sorted[0];
  const last3 = sorted.slice(0, 3);
  const avgBurn = last3.length ? sum(last3.map((s) => s.monthly_burn)) / last3.length : null;
  const runway = latest && avgBurn ? Number(latest.cash_balance) / avgBurn : null;
  return {
    latest,
    history: [...sorted].reverse(),
    avgBurn3m: avgBurn,
    runwayMonths: runway,
    assumptions: latest
      ? [
          `Cash: £${Number(latest.cash_balance).toLocaleString("en-GB")} at the ${latest.period} month-end (${latest.verified ? "verified" : "unverified"}, source: ${latest.source ?? "not recorded"}).`,
          `Burn: average net burn of the last ${last3.length} month-ends, £${Math.round(avgBurn ?? 0).toLocaleString("en-GB")} a month.`,
          "Runway = cash ÷ average burn. Excludes un-received commitments and any change in burn.",
        ]
      : ["No financial snapshots recorded. Add a month-end snapshot to calculate runway."],
  };
}

export interface Scenario {
  cash: number;
  monthlyBurn: number;
  burnGrowthPct: number; // per month
  monthlyRevenueGrowth: number; // £ reduction in net burn per month from revenue growth
  raiseAmount: number;
  raiseMonth: number; // months from now
  months: number;
}

/** Month-by-month cash projection for scenario modelling. Every input is shown to the user. */
export function projectCash(s: Scenario) {
  const rows: { month: number; cash: number; burn: number; raise: number }[] = [];
  let cash = s.cash;
  let burn = s.monthlyBurn;
  let zeroAt: number | null = null;
  for (let m = 1; m <= s.months; m++) {
    burn = Math.max(burn * (1 + s.burnGrowthPct / 100) - s.monthlyRevenueGrowth, 0);
    const raise = m === s.raiseMonth ? s.raiseAmount : 0;
    cash = cash - burn + raise;
    if (cash <= 0 && zeroAt === null) zeroAt = m;
    rows.push({ month: m, cash: Math.round(cash), burn: Math.round(burn), raise });
  }
  return { rows, zeroAt };
}

/* ---------------- Delivery ---------------- */
export function deliveryHealth(projects: Row[], milestones: Row[], tasks: Row[], deps: Row[], today = todayISO()) {
  const activeProjects = projects.filter((p) => p.status === "active" || p.status === "planning" || p.status === "on_hold");
  const overdueMilestones = milestones.filter((m) => m.status !== "complete" && isOverdue(m.due_date, today));
  const overdueTasks = tasks.filter((t) => t.status !== "done" && isOverdue(t.due_date, today));
  const blocked = tasks.filter((t) => t.status === "blocked");
  const escalated = tasks.filter((t) => t.escalated && t.status !== "done");
  const upcomingMilestones = milestones
    .filter((m) => m.status !== "complete")
    .filter((m) => { const d = daysFromToday(m.due_date, today); return d !== null && d >= 0 && d <= 30; })
    .sort((a, b) => String(a.due_date).localeCompare(String(b.due_date)));

  // Conflicting deadlines: one owner with two or more open milestones due within 3 days of each other.
  const open = milestones.filter((m) => m.status !== "complete" && m.owner_id && m.due_date);
  const conflicts: { owner_id: string; items: Row[] }[] = [];
  const seen = new Set<string>();
  for (const a of open) {
    for (const b of open) {
      if (a.id >= b.id || a.owner_id !== b.owner_id || a.project_id === b.project_id) continue;
      const gap = Math.abs((daysFromToday(a.due_date, today) ?? 0) - (daysFromToday(b.due_date, today) ?? 0));
      const k = [a.id, b.id].sort().join();
      if (gap <= 3 && !seen.has(k) && (daysFromToday(a.due_date, today) ?? -1) >= 0) {
        seen.add(k);
        conflicts.push({ owner_id: a.owner_id, items: [a, b] });
      }
    }
  }
  const atRiskDeps = deps.filter((d) => d.status !== "resolved" && (d.status === "at_risk" || isOverdue(d.needed_by, today)));
  const overBudget = projects.filter((p) => p.budget && p.spent && Number(p.spent) > Number(p.budget));
  const pastTarget = activeProjects.filter((p) => isOverdue(p.target_date, today));
  const rag = { green: 0, amber: 0, red: 0 } as Record<string, number>;
  for (const p of activeProjects) if (p.rag) rag[p.rag] = (rag[p.rag] ?? 0) + 1;
  return { activeProjects, overdueMilestones, overdueTasks, blocked, escalated, upcomingMilestones, conflicts, atRiskDeps, overBudget, pastTarget, rag };
}

/* ---------------- Strategy ---------------- */
export function strategyAlignment(objectives: Row[], projects: Row[], opps: Row[]) {
  const live = objectives.filter((o) => o.status !== "achieved");
  const linkedObjectiveIds = new Set([...projects.map((p) => p.objective_id), ...opps.map((o) => o.objective_id)].filter(Boolean));
  // an annual objective counts as planned if it or one of its quarterly children has linked work
  const children = (id: string) => objectives.filter((o) => o.parent_id === id).map((o) => o.id);
  const hasPlan = (o: Row) => linkedObjectiveIds.has(o.id) || children(o.id).some((c) => linkedObjectiveIds.has(c));
  const activeProjects = projects.filter((p) => p.status !== "completed" && p.status !== "cancelled");
  return {
    noOwner: live.filter((o) => !o.owner_id),
    noMeasure: live.filter((o) => !o.measure),
    noDeliveryPlan: live.filter((o) => !hasPlan(o)),
    unalignedProjects: activeProjects.filter((p) => !p.objective_id),
    atRisk: live.filter((o) => o.status === "at_risk" || o.status === "off_track"),
  };
}

/* ---------------- Investor relationships ---------------- */
const KEYWORDS = ["churn", "cohort", "retention", "security", "iso", "architecture", "model", "pipeline", "contracts", "references", "impact", "carbon", "hiring", "org chart"];

export function investorIntelligence(investors: Row[], fundOpps: Row[], dd: Row[], interactions: Row[], today = todayISO()) {
  const followUpDue = investors.filter((i) => i.next_follow_up && i.next_follow_up <= today);
  const activeOppInvestorIds = new Set(fundOpps.filter((o) => !["Passed", "Closed", "Funds Received"].includes(o.stage)).map((o) => o.investor_id));
  const dormant = investors.filter((i) => activeOppInvestorIds.has(i.id) && ((daysFromToday(i.last_contact_date, today) ?? -999) < -30 || !i.last_contact_date));
  const openDD = dd.filter((d) => d.status !== "accepted" && d.status !== "submitted");
  const overdueDD = openDD.filter((d) => isOverdue(d.deadline, today));
  const blockedDD = openDD.filter((d) => d.status === "blocked");
  const awaitingApproval = openDD.filter((d) => d.approval_status === "pending");
  const repeated = KEYWORDS.map((k) => {
    const rows = dd.filter((d) => String(d.request).toLowerCase().includes(k));
    return { topic: k, rows, investors: new Set(rows.map((r) => r.investor_id)).size };
  }).filter((g) => g.investors >= 2);
  const prospects = investors.filter((i) => !fundOpps.some((o) => o.investor_id === i.id));
  const overdueNext = fundOpps.filter((o) => o.next_action_date && isOverdue(o.next_action_date, today) && !["Passed", "Closed", "Funds Received"].includes(o.stage));
  const noNext = fundOpps.filter((o) => !o.next_action && !["Passed", "Closed", "Funds Received", "Legally Committed"].includes(o.stage));
  const lastInteraction = (investorId: string) => interactions.filter((x) => x.investor_id === investorId).sort((a, b) => String(b.occurred_on).localeCompare(String(a.occurred_on)))[0];
  return { followUpDue, dormant, openDD, overdueDD, blockedDD, awaitingApproval, repeated, prospects, overdueNext, noNext, lastInteraction };
}

/* ---------------- All signals ---------------- */
export interface Bundle {
  objectives: Row[]; kpis: Row[]; projects: Row[]; milestones: Row[]; tasks: Row[]; dependencies: Row[]; risks: Row[]; decisions: Row[];
  commercial_opportunities: Row[];
  investors: Row[]; fundraising_rounds: Row[]; fundraising_opportunities: Row[]; investor_commitments: Row[]; capital_receipts: Row[]; due_diligence_requests: Row[]; investor_interactions: Row[]; financial_snapshots: Row[];
  users: Row[];
  status_updates?: Row[]; routines?: Row[]; requests?: Row[];
}

export function computeSignals(b: Bundle, canSeeInvestors: boolean, today = todayISO()): Signal[] {
  const out: Signal[] = [];
  const name = (id: string | null | undefined) => b.users.find((u) => u.id === id)?.full_name ?? "Unassigned";

  const d = deliveryHealth(b.projects, b.milestones, b.tasks, b.dependencies, today);
  for (const m of d.overdueMilestones) {
    const p = b.projects.find((x) => x.id === m.project_id);
    out.push({ key: `ms-${m.id}`, area: "delivery", severity: p?.priority === "critical" ? "high" : "medium", title: `Overdue milestone: ${m.title}`, detail: `${p?.name ?? "Project"} · due ${m.due_date} · ${name(m.owner_id)}`, refs: [ref("milestones", m, "title"), ...(p ? [ref("projects", p, "name")] : [])] });
  }
  for (const c of d.conflicts) {
    out.push({ key: `cf-${c.items.map((i) => i.id).join("-")}`, area: "delivery", severity: "medium", title: `Deadline clash for ${name(c.owner_id)}`, detail: c.items.map((i) => `${i.title} (${i.due_date})`).join(" and "), refs: c.items.map((i) => ref("milestones", i, "title")) });
  }
  for (const dep of d.atRiskDeps) {
    const a = b.projects.find((p) => p.id === dep.project_id), z = b.projects.find((p) => p.id === dep.depends_on_project_id);
    out.push({ key: `dep-${dep.id}`, area: "delivery", severity: "medium", title: `Cross-project dependency at risk`, detail: `${a?.name} needs ${z?.name}: ${dep.description}`, refs: [ref("dependencies", dep, "description")] });
  }
  for (const t of d.escalated) out.push({ key: `esc-${t.id}`, area: "delivery", severity: "high", title: `Escalated: ${t.title}`, detail: `${name(t.owner_id)} · due ${t.due_date ?? "no date"} · ${t.status.replace("_", " ")}`, refs: [ref("tasks", t, "title")] });
  for (const p of d.overBudget) out.push({ key: `budget-${p.id}`, area: "delivery", severity: "low", title: `Over budget: ${p.name}`, detail: `Spent £${Number(p.spent).toLocaleString("en-GB")} of £${Number(p.budget).toLocaleString("en-GB")}`, refs: [ref("projects", p, "name")] });

  const s = strategyAlignment(b.objectives, b.projects, b.commercial_opportunities);
  for (const o of s.noOwner) out.push({ key: `own-${o.id}`, area: "strategy", severity: "medium", title: `Objective without an owner`, detail: o.title, refs: [ref("strategic_objectives", o, "title")] });
  for (const o of s.noMeasure) out.push({ key: `meas-${o.id}`, area: "strategy", severity: "low", title: `Objective without a measurable outcome`, detail: o.title, refs: [ref("strategic_objectives", o, "title")] });
  for (const o of s.noDeliveryPlan) out.push({ key: `plan-${o.id}`, area: "strategy", severity: "medium", title: `Objective with no linked projects or deals`, detail: o.title, refs: [ref("strategic_objectives", o, "title")] });
  for (const p of s.unalignedProjects) out.push({ key: `align-${p.id}`, area: "strategy", severity: "low", title: `Project not linked to a strategic objective`, detail: p.name, refs: [ref("projects", p, "name")] });

  const pm = pipelineMetrics(b.commercial_opportunities, today);
  for (const o of pm.stalled) out.push({ key: `stall-${o.id}`, area: "commercial", severity: Number(o.value) >= 200000 ? "high" : "medium", title: `Stalled deal: ${o.name}`, detail: `${o.stage} · last activity ${o.last_activity_date ?? "never"} · £${Number(o.value).toLocaleString("en-GB")}`, refs: [ref("commercial_opportunities", o, "name")] });
  for (const o of pm.noNextStep) if (!pm.stalled.includes(o)) out.push({ key: `next-${o.id}`, area: "commercial", severity: "medium", title: `No next step: ${o.name}`, detail: `${o.stage} · £${Number(o.value).toLocaleString("en-GB")}`, refs: [ref("commercial_opportunities", o, "name")] });
  for (const o of pm.pastClose) out.push({ key: `close-${o.id}`, area: "commercial", severity: "medium", title: `Close date passed: ${o.name}`, detail: `Expected ${o.expected_close}, still in ${o.stage}`, refs: [ref("commercial_opportunities", o, "name")] });

  for (const dec of b.decisions.filter((x) => x.status === "awaiting_approval" || x.status === "proposed")) {
    out.push({ key: `dec-${dec.id}`, area: "decisions", severity: dec.due_date && dec.due_date < today ? "high" : "medium", title: `Decision awaiting approval: ${dec.title}`, detail: `${name(dec.owner_id)}${dec.due_date ? ` · needed by ${dec.due_date}` : ""}`, refs: [ref("decisions", dec, "title")] });
  }

  if (canSeeInvestors) {
    const ii = investorIntelligence(b.investors, b.fundraising_opportunities, b.due_diligence_requests, b.investor_interactions, today);
    for (const r of ii.overdueDD) out.push({ key: `dd-${r.id}`, area: "investors", severity: r.priority === "high" ? "high" : "medium", title: `Overdue diligence request`, detail: `${b.investors.find((i) => i.id === r.investor_id)?.name}: ${r.request} (due ${r.deadline})`, refs: [ref("due_diligence_requests", r, "request")] });
    for (const g of ii.repeated) out.push({ key: `rep-${g.topic}`, area: "investors", severity: "low", title: `Repeated investor question: ${g.topic}`, detail: `${g.investors} investors asked for similar material. One standard pack would save time.`, refs: g.rows.map((r) => ref("due_diligence_requests", r, "request")) });
    for (const i of ii.followUpDue) out.push({ key: `fu-${i.id}`, area: "investors", severity: "medium", title: `Investor follow-up due: ${i.name}`, detail: `Follow-up date ${i.next_follow_up} · ${name(i.relationship_owner_id)}`, refs: [ref("investors", i, "name")] });
    for (const i of ii.dormant) out.push({ key: `dorm-${i.id}`, area: "investors", severity: "low", title: `No recent contact: ${i.name}`, detail: `Last contact ${i.last_contact_date ?? "never"}`, refs: [ref("investors", i, "name")] });
    const cap = capitalPosition(b.financial_snapshots);
    if (cap.runwayMonths !== null && cap.runwayMonths < 9) out.push({ key: "runway", area: "capital", severity: cap.runwayMonths < 6 ? "high" : "medium", title: `Runway ${cap.runwayMonths.toFixed(1)} months`, detail: "Calculated from the latest verified month-end cash and 3-month average burn.", refs: cap.latest ? [ref("financial_snapshots", cap.latest, "period")] : [] });
  }

  out.push(...operationsSignals(b.users, b.tasks, b.projects, b.status_updates ?? [], b.routines ?? [], b.requests ?? [], today));

  const rank = { high: 0, medium: 1, low: 2 };
  return out.sort((a, z) => rank[a.severity] - rank[z.severity]);
}

/** Progress toward a KPI target, 0–100, respecting whether lower is better. */
export function kpiProgress(k: Row) {
  const cur = Number(k.current_value), target = Number(k.target_value), base = Number(k.baseline);
  if (!Number.isFinite(cur) || !Number.isFinite(target)) return 0;
  const lowerIsBetter = k.direction === "decrease";
  if (lowerIsBetter ? cur <= target : cur >= target) return 100;
  const span = lowerIsBetter ? base - target : target - base;
  if (!Number.isFinite(base) || span <= 0) return Math.max(0, Math.min(99, lowerIsBetter ? (target / cur) * 100 : (cur / target) * 100));
  return Math.max(0, Math.min(99, ((lowerIsBetter ? base - cur : cur - base) / span) * 100));
}

/* ---------------- Team operations ---------------- */
export const DEFAULT_ESTIMATE_HOURS = 4;
export const WORKLOAD_WINDOW_DAYS = 14;

/**
 * Workload per person over the next two weeks: open actions due within the
 * window (or overdue, or undated but in progress), using the action's estimate
 * or a default. Capacity is weekly capacity × 2.
 */
export function teamWorkload(users: Row[], tasks: Row[], today = todayISO()) {
  const open = tasks.filter((t) => t.status !== "done");
  const inWindow = (t: Row) => {
    const d = daysFromToday(t.due_date, today);
    return d === null ? t.status === "in_progress" : d <= WORKLOAD_WINDOW_DAYS;
  };
  return users
    .filter((u) => Number(u.capacity_hours) > 0 || open.some((t) => t.owner_id === u.id))
    .map((u) => {
      const mine = open.filter((t) => t.owner_id === u.id);
      const window = mine.filter(inWindow);
      const hours = sum(window.map((t) => Number(t.estimate_hours) || DEFAULT_ESTIMATE_HOURS));
      const unestimated = window.filter((t) => !t.estimate_hours).length;
      const capacity = (Number(u.capacity_hours) || 0) * (WORKLOAD_WINDOW_DAYS / 7);
      return {
        user: u,
        open: mine.length,
        overdue: mine.filter((t) => isOverdue(t.due_date, today)).length,
        blocked: mine.filter((t) => t.status === "blocked").length,
        critical: mine.filter((t) => t.priority === "critical").length,
        windowTasks: window,
        hours,
        unestimated,
        capacity,
        load: capacity ? (hours / capacity) * 100 : null,
      };
    })
    .sort((a, b) => (b.load ?? 0) - (a.load ?? 0));
}

/** The Monday-to-Sunday week ending date (Sunday) for a date. */
export function weekEnding(iso = todayISO()) {
  const d = new Date(iso + "T00:00:00");
  const add = (7 - d.getDay()) % 7;
  d.setDate(d.getDate() + add);
  return todayISO(d);
}

/** Active projects and their latest check-in; flags projects without one in the last 7 days. */
export function checkInCoverage(projects: Row[], updates: Row[], today = todayISO()) {
  const active = projects.filter((p) => p.status === "active" || p.status === "on_hold");
  return active.map((p) => {
    const mine = updates.filter((u) => u.project_id === p.id).sort((a, b) => String(b.week_ending).localeCompare(String(a.week_ending)));
    const latest = mine[0];
    const age = latest ? -(daysFromToday(latest.week_ending, today) ?? 0) : null;
    return { project: p, latest, history: mine, stale: !latest || (age !== null && age > 7), ageDays: age };
  });
}

export function routinesDue(routines: Row[], today = todayISO()) {
  const active = routines.filter((r) => r.active !== false);
  return {
    overdue: active.filter((r) => isOverdue(r.next_due, today)),
    readyToRun: active.filter((r) => {
      const d = daysFromToday(r.next_due, today);
      const lead = Number(r.lead_days ?? 5);
      return d !== null && d >= 0 && d <= lead && (!r.last_run || daysFromToday(r.last_run, today)! < -lead);
    }),
    upcoming: active.filter((r) => (daysFromToday(r.next_due, today) ?? -1) >= 0).sort((a, b) => String(a.next_due).localeCompare(String(b.next_due))),
  };
}

export function requestQueue(requests: Row[], today = todayISO()) {
  const open = requests.filter((r) => r.status !== "done" && r.status !== "declined");
  return {
    open,
    untriaged: open.filter((r) => r.status === "new"),
    unassigned: open.filter((r) => !r.owner_id),
    overdue: open.filter((r) => isOverdue(r.needed_by, today)),
    dueSoon: open.filter((r) => { const d = daysFromToday(r.needed_by, today); return d !== null && d >= 0 && d <= 7; }),
  };
}

export function operationsSignals(users: Row[], tasks: Row[], projects: Row[], updates: Row[], routines: Row[], requests: Row[], today = todayISO()): Signal[] {
  const out: Signal[] = [];
  for (const w of teamWorkload(users, tasks, today)) {
    if (w.load !== null && w.load > 110) out.push({ key: `load-${w.user.id}`, area: "operations", severity: w.load > 150 ? "high" : "medium", title: `${w.user.full_name} is over capacity`, detail: `${Math.round(w.hours)}h of work due in ${WORKLOAD_WINDOW_DAYS} days against ${Math.round(w.capacity)}h available (${Math.round(w.load)}%)`, refs: w.windowTasks.slice(0, 8).map((t) => ref("tasks", t, "title")) });
  }
  for (const c of checkInCoverage(projects, updates, today).filter((c) => c.stale)) {
    out.push({ key: `checkin-${c.project.id}`, area: "operations", severity: c.project.rag === "red" || c.project.priority === "critical" ? "medium" : "low", title: `No check-in this week: ${c.project.name}`, detail: c.latest ? `Last update ${c.latest.week_ending}` : "No check-in recorded", refs: [ref("projects", c.project, "name")] });
  }
  for (const r of routinesDue(routines, today).overdue) out.push({ key: `routine-${r.id}`, area: "operations", severity: "medium", title: `Routine overdue: ${r.title}`, detail: `Was due ${r.next_due}`, refs: [ref("routines", r, "title")] });
  const q = requestQueue(requests, today);
  for (const r of q.open.filter((x) => (x.priority === "critical" || x.priority === "high") && (!x.owner_id || x.status === "new"))) {
    out.push({ key: `req-${r.id}`, area: "operations", severity: r.priority === "critical" ? "high" : "medium", title: `${r.owner_id ? "Request not triaged" : "Request needs an owner"}: ${r.title}`, detail: `${r.status === "new" ? "Not triaged" : "Unassigned"}${r.needed_by ? ` · needed by ${r.needed_by}` : ""}`, refs: [ref("requests", r, "title")] });
  }
  return out;
}
