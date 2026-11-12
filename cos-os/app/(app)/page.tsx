import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { loadPage } from "@/lib/page";
import { isClaudeConfigured } from "@/lib/env";
import { capitalPosition, computeSignals, kpiProgress, deliveryHealth, fundraisingPosition, investorIntelligence, pipelineMetrics } from "@/lib/analytics";
import type { BriefingData } from "@/lib/ai/briefing";
import { FUNDRAISING_STAGES, type TableName } from "@/lib/schema";
import type { Lookups, Row } from "@/lib/types";
import { cn, daysFromToday, formatDate, formatDateTime, formatMoney, relativeDays, todayISO } from "@/lib/utils";
import { PageHeader, SectionTitle } from "@/components/app/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Stat, Meter } from "@/components/app/stat";
import { SignalList } from "@/components/app/signal-list";
import { RagDot, StatusBadge } from "@/components/app/status";
import { DataTag } from "@/components/app/provenance";
import { AiActionButton } from "@/components/ai/ai-action-button";

export const metadata = { title: "Executive Command Centre" };

const TABLES = [
  "strategic_objectives", "kpis", "projects", "milestones", "tasks", "dependencies", "risks", "decisions", "meetings",
  "commercial_opportunities", "investors", "fundraising_rounds", "fundraising_opportunities", "investor_commitments",
  "capital_receipts", "due_diligence_requests", "investor_interactions", "financial_snapshots", "reports", "users", "status_updates", "routines", "requests",
] as const;

export default async function CommandCentre() {
  const { session, data: d, lookups, investors, write } = await loadPage(TABLES);
  const today = todayISO();
  const signals = computeSignals({ ...d, objectives: d.strategic_objectives }, investors, today);
  const delivery = deliveryHealth(d.projects, d.milestones, d.tasks, d.dependencies, today);
  const pm = pipelineMetrics(d.commercial_opportunities, today);
  const round = d.fundraising_rounds.find((r) => r.status !== "closed");
  const fp = fundraisingPosition(round, d.fundraising_opportunities, d.investor_commitments, d.capital_receipts, today);
  const cap = capitalPosition(d.financial_snapshots);
  const ii = investorIntelligence(d.investors, d.fundraising_opportunities, d.due_diligence_requests, d.investor_interactions, today);
  const briefing = d.reports.filter((r) => r.report_type === "daily_briefing").sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)))[0];
  const objectives = d.strategic_objectives;
  const onTrack = objectives.filter((o) => o.status === "on_track" || o.status === "achieved").length;
  const decisions = d.decisions.filter((x) => x.status === "awaiting_approval" || x.status === "proposed");
  const risks = d.risks.filter((r) => r.status !== "closed").map((r) => ({ ...r, score: (r.likelihood ?? 0) * (r.impact ?? 0) })).sort((a, b) => b.score - a.score).slice(0, 5);
  const upcomingMeetings = d.meetings.filter((m) => m.held_at >= new Date().toISOString()).sort((a, b) => String(a.held_at).localeCompare(String(b.held_at))).slice(0, 5);
  const name = (id?: string | null) => (id ? lookups.users?.[id] : null) ?? "Unassigned";

  return (
    <div>
      <PageHeader
        number="01"
        title="Executive Command Centre"
        description={`${formatDate(today, { weekday: "long", day: "numeric", month: "long", year: "numeric" })} · ${session.orgName}`}
        actions={write("reports") && isClaudeConfigured() ? <AiActionButton endpoint="/api/briefing" label={briefing ? "Refresh briefing" : "Generate today's briefing"} busyLabel="Preparing briefing… (about a minute)" /> : undefined}
      />

      <Briefing report={briefing} lookups={lookups} configured={isClaudeConfigured()} canWrite={write("reports")} />

      <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <Stat label="Objectives on track" value={`${onTrack} / ${objectives.length}`} kind="calculated" method="Objectives with status On track or Achieved" sub={<Link className="hover:underline" href="/strategy">Strategy →</Link>} />
        <Stat label="Active projects" value={delivery.activeProjects.length} kind="calculated" method="Projects in planning, active or on hold" sub={<span className="flex items-center gap-2"><span className="flex items-center gap-1"><RagDot rag="green" />{delivery.rag.green ?? 0}</span><span className="flex items-center gap-1"><RagDot rag="amber" />{delivery.rag.amber ?? 0}</span><span className="flex items-center gap-1"><RagDot rag="red" />{delivery.rag.red ?? 0}</span></span>} />
        <Stat label="Overdue actions" value={delivery.overdueTasks.length} tone={delivery.overdueTasks.length ? "red" : undefined} kind="calculated" method="Open actions with a due date before today" sub={`${delivery.overdueMilestones.length} overdue milestones`} />
        <Stat label="Open pipeline" value={formatMoney(pm.total)} kind="indicative" sub={`${pm.openCount} opportunities`} />
        <Stat label="Weighted forecast" value={formatMoney(pm.weighted)} kind="calculated" method="Σ estimated annual value × probability, open opportunities" sub={`${formatMoney(pm.weightedNext90)} closing in 90 days`} />
        {investors ? (
          <Stat label="Runway" value={cap.runwayMonths ? `${cap.runwayMonths.toFixed(1)} mo` : "—"} tone={cap.runwayMonths && cap.runwayMonths < 9 ? "amber" : undefined} kind="calculated" method={cap.assumptions.join(" ")} sub={cap.latest ? `${formatMoney(cap.latest.cash_balance)} cash` : "No snapshot"} />
        ) : (
          <Stat label="Decisions waiting" value={decisions.length} kind="calculated" method="Decisions proposed or awaiting approval" />
        )}
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="flex min-w-0 flex-col gap-6">
          <Card>
            <CardHeader>
              <div><CardTitle>Needs attention</CardTitle><p className="text-xs text-muted-foreground">Calculated from records. Open an item to see its evidence.</p></div>
              <DataTag kind="calculated" />
            </CardHeader>
            <CardContent className="py-1"><SignalList signals={signals} limit={10} /></CardContent>
            {signals.length > 10 && <div className="border-t border-border px-4 py-2 text-xs"><Link href="/intelligence" className="text-navy hover:underline">All {signals.length} signals →</Link></div>}
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader><CardTitle>Strategic priorities</CardTitle><Link href="/strategy" className="text-xs text-muted-foreground hover:text-foreground">Strategy →</Link></CardHeader>
              <ul className="divide-y divide-border">
                {objectives.filter((o) => o.level === "quarterly").map((o) => (
                  <li key={o.id} className="px-4 py-2.5">
                    <div className="flex items-start justify-between gap-3">
                      <Link href={`/records/strategic_objectives/${o.id}`} className="text-[13px] leading-snug hover:underline underline-offset-2">{o.title}</Link>
                      <StatusBadge value={o.status} />
                    </div>
                    <div className="mt-1.5 flex items-center gap-3">
                      <Meter value={o.progress ?? 0} tone={o.status === "off_track" ? "red" : o.status === "at_risk" ? "amber" : "sage"} />
                      <span className="num w-9 text-right text-2xs text-muted-foreground">{o.progress ?? 0}%</span>
                    </div>
                    <div className="mt-0.5 text-2xs text-muted-foreground">{o.owner_id ? name(o.owner_id) : <span className="text-rag-amber">No owner</span>}</div>
                  </li>
                ))}
              </ul>
            </Card>

            <Card>
              <CardHeader><CardTitle>Company KPIs</CardTitle><DataTag kind="verified" /></CardHeader>
              <ul className="divide-y divide-border">
                {d.kpis.map((k) => {
                  const pct = kpiProgress(k);
                  const fmt = (v: number) => (k.unit === "£" ? formatMoney(v) : `${Number(v).toLocaleString("en-GB")}${k.unit === "%" ? "%" : k.unit === "x" ? "×" : k.unit === "days" ? " days" : ""}`);
                  return (
                    <li key={k.id} className="px-4 py-2.5" title={`Source: ${k.source ?? "not recorded"} · measured ${k.last_updated ?? "—"}`}>
                      <div className="flex items-baseline justify-between gap-3">
                        <Link href={`/records/kpis/${k.id}`} className="truncate text-[13px] hover:underline underline-offset-2">{k.name}</Link>
                        <span className="num shrink-0 text-[13px] font-medium">{fmt(k.current_value)} <span className="font-normal text-muted-foreground">/ {fmt(k.target_value)}</span></span>
                      </div>
                      <Meter className="mt-1.5" value={pct} tone={pct >= 70 ? "sage" : pct >= 40 ? "amber" : "red"} />
                    </li>
                  );
                })}
              </ul>
            </Card>
          </div>

          <Card>
            <CardHeader><CardTitle>Delivery health</CardTitle><Link href="/projects" className="text-xs text-muted-foreground hover:text-foreground">Projects →</Link></CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead><tr className="text-left text-2xs uppercase tracking-[0.08em] text-muted-foreground"><th className="px-4 py-2 font-medium">Project</th><th className="px-3 py-2 font-medium">Owner</th><th className="px-3 py-2 font-medium">Status</th><th className="px-3 py-2 font-medium">Target</th><th className="px-3 py-2 font-medium">Next milestone</th></tr></thead>
                <tbody>
                  {delivery.activeProjects.map((p) => {
                    const next = d.milestones.filter((m) => m.project_id === p.id && m.status !== "complete").sort((a, b) => String(a.due_date).localeCompare(String(b.due_date)))[0];
                    const late = next && (daysFromToday(next.due_date) ?? 0) < 0;
                    return (
                      <tr key={p.id} className="border-t border-border/70">
                        <td className="px-4 py-2"><span className="flex items-center gap-2"><RagDot rag={p.rag} /><Link href={`/records/projects/${p.id}`} className="hover:underline underline-offset-2">{p.name}</Link></span></td>
                        <td className="px-3 py-2 text-muted-foreground">{name(p.owner_id)}</td>
                        <td className="px-3 py-2"><StatusBadge value={p.status} /></td>
                        <td className={cn("num px-3 py-2", (daysFromToday(p.target_date) ?? 0) < 0 && "text-rag-red")}>{formatDate(p.target_date, { day: "numeric", month: "short" })}</td>
                        <td className="px-3 py-2">{next ? <span className={cn(late && "text-rag-red")}>{next.title} <span className="text-muted-foreground">· {relativeDays(next.due_date)}</span></span> : <span className="text-muted-foreground">—</span>}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader><CardTitle>Commercial pipeline</CardTitle><Link href="/pipeline" className="text-xs text-muted-foreground hover:text-foreground">Pipeline →</Link></CardHeader>
              <CardContent className="flex flex-col gap-2">
                {pm.byStage.filter((s) => s.stage !== "Won" && s.stage !== "Lost").map((s) => (
                  <div key={s.stage} className="grid grid-cols-[6.5rem_1fr_4.5rem] items-center gap-3 text-xs">
                    <span className="text-muted-foreground">{s.stage}</span>
                    <Meter value={s.value} max={Math.max(...pm.byStage.map((x) => x.value), 1)} tone="navy" />
                    <span className="num text-right">{formatMoney(s.value)}</span>
                  </div>
                ))}
                <p className="mt-1 text-2xs text-muted-foreground">{pm.stalled.length} stalled · {pm.noNextStep.length} without a next step · {pm.pastClose.length} past close date</p>
              </CardContent>
            </Card>

            {investors ? (
              <Card>
                <CardHeader><CardTitle>Fundraising{round ? `: ${round.name}` : ""}</CardTitle><Link href="/investors" className="text-xs text-muted-foreground hover:text-foreground">IR desk →</Link></CardHeader>
                <CardContent className="flex flex-col gap-2 text-xs">
                  {[
                    { label: "Indicative interest", value: fp.indicative, kind: "indicative" as const },
                    { label: "Soft commitments", value: fp.soft, kind: "indicative" as const },
                    { label: "Legally committed", value: fp.legal, kind: "verified" as const },
                    { label: "Funds received", value: fp.received, kind: "verified" as const },
                  ].map((r) => (
                    <div key={r.label} className="grid grid-cols-[8.5rem_1fr_4.5rem] items-center gap-3">
                      <span className="text-muted-foreground">{r.label}</span>
                      <Meter value={r.value} max={fp.target || 1} tone={r.kind === "verified" ? "sage" : "navy"} />
                      <span className="num text-right">{formatMoney(r.value)}</span>
                    </div>
                  ))}
                  <p className="mt-1 text-2xs text-muted-foreground">Target {formatMoney(fp.target)}. Indicative and soft amounts are not binding. {fp.inDiligence.length} investors in due diligence; {ii.followUpDue.length} follow-ups due.</p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {FUNDRAISING_STAGES.filter((s) => s !== "Passed").map((s) => {
                      const n = d.fundraising_opportunities.filter((o) => o.stage === s).length;
                      return n ? <Badge key={s} variant="muted" className="num">{s} · {n}</Badge> : null;
                    })}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader><CardTitle>Fundraising</CardTitle></CardHeader>
                <CardContent className="text-xs text-muted-foreground">Investor and fundraising records are restricted for your role.</CardContent>
              </Card>
            )}
          </div>
        </div>

        <aside className="flex min-w-0 flex-col gap-6">
          <Card>
            <CardHeader><CardTitle>Decisions awaiting approval</CardTitle><span className="num text-xs text-muted-foreground">{decisions.length}</span></CardHeader>
            <RecordRows table="decisions" rows={decisions} render={(x) => <><span className="block">{x.title}</span><span className="text-2xs text-muted-foreground">{name(x.owner_id)}{x.due_date ? ` · needed ${relativeDays(x.due_date)}` : ""}</span></>} empty="No decisions waiting." />
          </Card>

          <Card>
            <CardHeader><CardTitle>Upcoming milestones</CardTitle><span className="text-2xs text-muted-foreground">30 days</span></CardHeader>
            <RecordRows table="milestones" rows={delivery.upcomingMilestones.slice(0, 6)} render={(m) => <><span className="block">{m.title}</span><span className="text-2xs text-muted-foreground">{lookups.projects?.[m.project_id]} · {formatDate(m.due_date, { day: "numeric", month: "short" })}</span></>} empty="Nothing due in the next 30 days." />
          </Card>

          <Card>
            <CardHeader><CardTitle>Material risks</CardTitle><Link href="/projects" className="text-xs text-muted-foreground hover:text-foreground">All →</Link></CardHeader>
            <RecordRows table="risks" rows={risks} render={(r) => <><span className="flex items-baseline justify-between gap-2"><span>{r.title}</span><span className={cn("num shrink-0 text-2xs font-medium", r.score >= 15 ? "text-rag-red" : r.score >= 9 ? "text-rag-amber" : "text-muted-foreground")}>{r.score}</span></span><span className="text-2xs text-muted-foreground">{name(r.owner_id)} · {r.category}</span></>} empty="No open risks." />
          </Card>

          <Card>
            <CardHeader><CardTitle>Upcoming executive meetings</CardTitle><Link href="/meetings" className="text-xs text-muted-foreground hover:text-foreground">Meetings →</Link></CardHeader>
            <RecordRows table="meetings" rows={upcomingMeetings} render={(m) => <><span className="block">{m.title}</span><span className="text-2xs text-muted-foreground">{formatDateTime(m.held_at)}</span></>} empty="No meetings scheduled." />
          </Card>

          {investors && (
            <Card>
              <CardHeader><CardTitle>Investor engagement</CardTitle><DataTag kind="calculated" /></CardHeader>
              <CardContent className="space-y-1.5 text-xs">
                <Line label="Active investors in round" value={fp.activeInvestors} />
                <Line label="In due diligence" value={fp.inDiligence.length} />
                <Line label="Follow-ups due" value={ii.followUpDue.length} warn={ii.followUpDue.length > 0} />
                <Line label="Overdue diligence requests" value={ii.overdueDD.length} warn={ii.overdueDD.length > 0} />
                <Line label="No contact in 30 days" value={ii.dormant.length} />
              </CardContent>
            </Card>
          )}
        </aside>
      </div>
    </div>
  );
}

function Line({ label, value, warn }: { label: string; value: number; warn?: boolean }) {
  return <div className="flex justify-between gap-3"><span className="text-muted-foreground">{label}</span><span className={cn("num font-medium", warn && "text-rag-amber")}>{value}</span></div>;
}

function RecordRows({ table, rows, render, empty }: { table: TableName; rows: Row[]; render: (r: Row) => React.ReactNode; empty: string }) {
  if (!rows.length) return <p className="px-4 py-4 text-xs text-muted-foreground">{empty}</p>;
  return (
    <ul className="divide-y divide-border">
      {rows.map((r) => (
        <li key={r.id}>
          <Link href={`/records/${table}/${r.id}`} className="group flex items-start gap-2 px-4 py-2 text-[13px] hover:bg-background/70">
            <span className="min-w-0 flex-1">{render(r)}</span>
            <ArrowUpRight className="mt-0.5 size-3 shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100" />
          </Link>
        </li>
      ))}
    </ul>
  );
}

const QUESTION_ORDER = ["What matters most today?", "What has changed?", "What is falling behind?", "What requires a leadership decision?", "Where should management focus attention?"];

function Briefing({ report, lookups, configured, canWrite }: { report?: Row; lookups: Lookups; configured: boolean; canWrite: boolean }) {
  if (!report?.data) {
    return (
      <Card className="border-dashed border-ai-border bg-ai-soft/30">
        <CardContent className="flex flex-col gap-1 py-5">
          <div className="flex items-center gap-2"><DataTag kind="ai" /><span className="eyebrow">Daily executive briefing</span></div>
          <p className="font-serif text-lg">No briefing yet today.</p>
          <p className="text-xs text-muted-foreground">
            {!configured ? "Add ANTHROPIC_API_KEY to enable AI briefings. The calculated signals below work without it." : canWrite ? "Generate one to get answers to the five leadership questions, each linked to the records behind it." : "Your role is read-only; ask an editor to generate today's briefing."}
          </p>
        </CardContent>
      </Card>
    );
  }
  const b = report.data as BriefingData;
  const isToday = String(report.created_at).slice(0, 10) === todayISO();
  const label = (t: string, id: string) => lookups[t as TableName]?.[id] ?? "record";
  const kindVariant = { fact: "sage", assumption: "stone", recommendation: "navy" } as const;
  return (
    <section aria-labelledby="briefing-title" className="rounded-lg border border-dashed border-ai-border bg-surface shadow-subtle">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-dashed border-ai-border px-5 py-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <DataTag kind="ai" />
            <span className="eyebrow">Daily executive briefing</span>
            <span className="text-2xs text-muted-foreground">Generated {formatDateTime(report.created_at)}{!isToday && " (not today)"}</span>
            <StatusBadge value={report.status} />
          </div>
          <h2 id="briefing-title" className="mt-1.5 font-serif text-xl font-medium leading-snug">{b.headline}</h2>
        </div>
        <Link href={`/intelligence/reports/${report.id}`} className="text-xs text-navy hover:underline">Review and approve →</Link>
      </div>
      <div className="grid gap-x-8 gap-y-5 px-5 py-4 md:grid-cols-2 xl:grid-cols-3">
        {QUESTION_ORDER.map((q) => {
          const s = b.sections.find((x) => x.question === q);
          if (!s) return null;
          return (
            <div key={q} className="min-w-0">
              <h3 className="mb-2 text-[13px] font-semibold">{q}</h3>
              <ul className="flex flex-col gap-2.5">
                {s.items.map((i, k) => (
                  <li key={k} className="text-[13px] leading-snug">
                    <details className="group">
                      <summary className="cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                        <Badge variant={kindVariant[i.kind]} className="mr-1.5 align-[1px]">{i.kind}</Badge>
                        {i.statement}
                        {(i.owner || i.timing) && <span className="mt-0.5 block text-2xs text-muted-foreground">{[i.owner, i.timing].filter(Boolean).join(" · ")}</span>}
                      </summary>
                      <div className="mt-1.5 rounded-md bg-background px-2.5 py-2 text-2xs">
                        <div className="text-muted-foreground">Confidence: {i.confidence}. Evidence:</div>
                        {i.refs.length ? (
                          <ul className="mt-0.5">{i.refs.map((r) => <li key={r.id}><Link className="text-navy hover:underline" href={`/records/${r.table}/${r.id}`}>{label(r.table, r.id)}</Link></li>)}</ul>
                        ) : <div className="text-rag-amber">No linked records. Treat as unsupported.</div>}
                      </div>
                    </details>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
        {b.missing_data.length > 0 && (
          <div className="min-w-0">
            <h3 className="mb-2 text-[13px] font-semibold">Missing data</h3>
            <ul className="list-disc space-y-1 pl-4 text-xs text-muted-foreground">{b.missing_data.map((m, k) => <li key={k}>{m}</li>)}</ul>
          </div>
        )}
      </div>
    </section>
  );
}
