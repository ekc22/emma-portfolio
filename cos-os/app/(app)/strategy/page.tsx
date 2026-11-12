import Link from "next/link";
import { loadPage } from "@/lib/page";
import { strategyAlignment } from "@/lib/analytics";
import { PageHeader, SectionTitle } from "@/components/app/page-header";
import { Stat, Meter } from "@/components/app/stat";
import { StatusBadge } from "@/components/app/status";
import { DataTag } from "@/components/app/provenance";
import { EntityTable } from "@/components/app/entity-table";
import { NewRecordButton } from "@/components/app/record-form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ViewTabs } from "@/components/ui/view-tabs";
import { cn, formatDate, daysFromToday } from "@/lib/utils";
import type { Row } from "@/lib/types";

export const metadata = { title: "Strategy & Objectives" };

const statusTone = (s: string) => (s === "off_track" ? "red" : s === "at_risk" ? "amber" : s === "achieved" || s === "on_track" ? "sage" : "navy") as "red" | "amber" | "sage" | "navy";

/** Progress from baseline toward target, respecting whether higher or lower is better. */
function kpiProgress(k: Row) {
  const base = Number(k.baseline), cur = Number(k.current_value), tgt = Number(k.target_value);
  if (![base, cur, tgt].every(Number.isFinite) || tgt === base) return null;
  return Math.max(0, Math.min(100, ((cur - base) / (tgt - base)) * 100));
}

function formatKpi(v: unknown, unit: string | null | undefined) {
  if (v === null || v === undefined || v === "") return "—";
  const n = Number(v);
  if (unit === "£") return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", notation: "compact", maximumFractionDigits: 2 }).format(n);
  if (unit === "%") return `${n}%`;
  if (unit === "x") return `${n}×`;
  return `${n.toLocaleString("en-GB")}${unit ? ` ${unit}` : ""}`;
}

export default async function StrategyPage() {
  const { data, lookups, write } = await loadPage(["strategic_objectives", "kpis", "projects", "commercial_opportunities", "users"] as const);
  const objectives = data.strategic_objectives;
  const kpis = data.kpis;
  const projects = data.projects;
  const opps = data.commercial_opportunities;
  const people = lookups.users ?? {};

  const annual = objectives.filter((o) => o.level === "annual");
  const quarterly = objectives.filter((o) => o.level === "quarterly");
  const orphanQuarterly = quarterly.filter((q) => !q.parent_id || !annual.some((a) => a.id === q.parent_id));
  const align = strategyAlignment(objectives, projects, opps);

  const liveProjects = projects.filter((p) => p.status !== "completed" && p.status !== "cancelled");
  const openOpps = opps.filter((o) => o.stage !== "Won" && o.stage !== "Lost");
  const work = (id: string) => ({
    projects: liveProjects.filter((p) => p.objective_id === id).length,
    opps: openOpps.filter((o) => o.objective_id === id).length,
  });
  const workIncludingChildren = (o: Row) => {
    const ids = [o.id, ...quarterly.filter((q) => q.parent_id === o.id).map((q) => q.id)];
    return ids.reduce((acc, id) => { const w = work(id); return { projects: acc.projects + w.projects, opps: acc.opps + w.opps }; }, { projects: 0, opps: 0 });
  };

  const onTrack = objectives.filter((o) => o.status === "on_track" || o.status === "achieved").length;
  const atRisk = objectives.filter((o) => o.status === "at_risk" || o.status === "off_track").length;
  const gaps = new Set([...align.noOwner, ...align.noMeasure, ...align.noDeliveryPlan].map((o) => o.id)).size;

  const ObjectiveRow = ({ o, nested = false }: { o: Row; nested?: boolean }) => {
    const w = nested ? work(o.id) : workIncludingChildren(o);
    const d = daysFromToday(o.due_date);
    return (
      <div className={cn("grid grid-cols-1 gap-x-6 gap-y-2 py-3 sm:grid-cols-[minmax(0,1fr)_9rem_8rem]", nested && "pl-4 sm:pl-6 border-l border-border ml-1")}>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            {nested && <span className="eyebrow">{o.period}</span>}
            <Link href={`/records/strategic_objectives/${o.id}`} className={cn("hover:underline underline-offset-2", nested ? "text-[13px] font-medium" : "text-[15px] font-semibold tracking-tight")}>{o.title}</Link>
          </div>
          <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
            <span className={cn(!o.owner_id && "text-rag-amber")}>{o.owner_id ? people[o.owner_id] : "No owner"}</span>
            <span className={cn(!o.measure && "text-rag-amber")}>{o.measure ? `Measure: ${o.measure}` : "No measurable outcome"}</span>
            <span className={cn(!w.projects && !w.opps && "text-rag-amber")}>
              {w.projects || w.opps ? `${w.projects} project${w.projects === 1 ? "" : "s"} · ${w.opps} open deal${w.opps === 1 ? "" : "s"}` : "No linked work"}
            </span>
          </div>
        </div>
        <div className="flex flex-col justify-center gap-1">
          <div className="flex items-center justify-between text-xs"><span className="num font-medium">{Number(o.progress) || 0}%</span><StatusBadge value={o.status} /></div>
          <Meter value={Number(o.progress) || 0} tone={statusTone(o.status)} />
        </div>
        <div className="flex flex-col justify-center text-xs sm:text-right">
          <span className="eyebrow">Due</span>
          <span className={cn("num", d !== null && d < 0 && o.status !== "achieved" && "font-medium text-rag-red")}>{formatDate(o.due_date)}</span>
        </div>
      </div>
    );
  };

  const objectivesView = (
    <div className="flex flex-col gap-4">
      {annual.map((a) => {
        const kids = quarterly.filter((q) => q.parent_id === a.id);
        return (
          <Card key={a.id}>
            <CardContent className="py-2">
              <ObjectiveRow o={a} />
              {kids.length > 0 && (
                <div className="mb-2 mt-1 border-t border-border pt-1">
                  <div className="eyebrow pt-2">Quarterly priorities</div>
                  {kids.map((k) => <ObjectiveRow key={k.id} o={k} nested />)}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
      {orphanQuarterly.length > 0 && (
        <Card>
          <CardHeader><div><CardTitle>Quarterly priorities without an annual objective</CardTitle><CardDescription>Link these to an annual objective, or confirm they stand alone.</CardDescription></div></CardHeader>
          <CardContent className="py-1">{orphanQuarterly.map((q) => <ObjectiveRow key={q.id} o={q} nested />)}</CardContent>
        </Card>
      )}
      {!objectives.length && <p className="py-10 text-center text-[13px] text-muted-foreground">No objectives yet. Add the first annual objective to start linking work to strategy.</p>}
    </div>
  );

  const kpiView = (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {kpis.map((k) => {
          const p = kpiProgress(k);
          const better = k.direction === "decrease" ? "Lower is better" : "Higher is better";
          return (
            <Card key={k.id} className="flex flex-col">
              <CardContent className="flex flex-1 flex-col gap-2 py-3">
                <div className="flex items-start justify-between gap-2">
                  <Link href={`/records/kpis/${k.id}`} className="text-[13px] font-medium leading-snug hover:underline underline-offset-2">{k.name}</Link>
                  <DataTag kind="verified" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="num text-[22px] font-semibold tracking-tight">{formatKpi(k.current_value, k.unit)}</span>
                  <span className="num text-xs text-muted-foreground">target {formatKpi(k.target_value, k.unit)}</span>
                </div>
                <div title={`Progress from baseline ${formatKpi(k.baseline, k.unit)} toward target. ${better}.`}>
                  <Meter value={p ?? 0} tone={p === null ? "navy" : p >= 70 ? "sage" : p >= 40 ? "amber" : "red"} />
                  <div className="mt-1 flex justify-between text-2xs text-muted-foreground">
                    <span className="num">Baseline {formatKpi(k.baseline, k.unit)}</span>
                    <span className="num">{p === null ? "—" : `${Math.round(p)}% of the way`}</span>
                  </div>
                </div>
                <div className="mt-auto border-t border-border pt-2 text-2xs text-muted-foreground">
                  <div>{better} · {k.owner_id ? people[k.owner_id] : "No owner"} · measured {formatDate(k.last_updated)}</div>
                  <div className="truncate" title={k.source ?? undefined}>Source: {k.source || <span className="text-rag-amber">not recorded</span>}</div>
                </div>
              </CardContent>
            </Card>
          );
        })}
        {!kpis.length && <p className="col-span-full py-10 text-center text-[13px] text-muted-foreground">No KPIs yet.</p>}
      </div>
      <EntityTable table="kpis" rows={kpis} lookups={lookups} canWrite={write("kpis")} filters={[]} />
    </div>
  );

  const alignmentList = (title: string, rows: Row[], table: "strategic_objectives" | "projects", empty: string, field = "title") => (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between"><h3 className="text-[13px] font-semibold">{title}</h3><span className={cn("num text-xs", rows.length ? "text-rag-amber" : "text-muted-foreground")}>{rows.length}</span></div>
      {rows.length ? (
        <ul className="space-y-1">
          {rows.map((r) => (
            <li key={r.id} className="text-xs"><Link href={`/records/${table}/${r.id}`} className="text-navy hover:underline underline-offset-2">{String(r[field])}</Link></li>
          ))}
        </ul>
      ) : <p className="text-xs text-muted-foreground">{empty}</p>}
    </div>
  );

  return (
    <div>
      <PageHeader
        number="02"
        title="Strategy & Objectives"
        description="Annual objectives, quarterly priorities and the measures behind them, with a check that day-to-day work actually serves the strategy."
        actions={write("strategic_objectives") ? <NewRecordButton table="strategic_objectives" lookups={lookups} label="New objective" /> : undefined}
      />

      <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label="Objectives" value={objectives.length} sub={`${annual.length} annual · ${quarterly.length} quarterly`} />
        <Stat label="On track" value={onTrack} sub="On track or achieved" />
        <Stat label="At risk or off track" value={atRisk} tone={atRisk ? "amber" : undefined} />
        <Stat label="Planning gaps" value={gaps} kind="calculated" method="Objectives missing an owner, a measurable outcome or any linked project or deal" tone={gaps ? "amber" : undefined} sub="Missing owner, measure or plan" />
      </div>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0">
          <ViewTabs
            panels={[
              { id: "objectives", label: "Objectives", content: objectivesView },
              { id: "kpis", label: `KPIs (${kpis.length})`, content: kpiView },
              { id: "manage", label: "Manage objectives", content: <EntityTable table="strategic_objectives" rows={objectives} lookups={lookups} canWrite={write("strategic_objectives")} filters={["level", "status"]} /> },
            ]}
          />
        </div>
        <aside className="min-w-0">
          <SectionTitle title="Alignment check" description="Calculated from objectives, projects and deals." />
          <Card>
            <CardHeader><CardTitle>Where strategy and activity diverge</CardTitle><DataTag kind="calculated" /></CardHeader>
            <CardContent className="flex flex-col gap-4">
              {alignmentList("Objectives without an owner", align.noOwner, "strategic_objectives", "Every objective has an owner.")}
              {alignmentList("Objectives without a measurable outcome", align.noMeasure, "strategic_objectives", "Every objective has a measure.")}
              {alignmentList("Objectives with no delivery plan", align.noDeliveryPlan, "strategic_objectives", "Every objective has linked projects or deals.")}
              {alignmentList("Active projects not linked to an objective", align.unalignedProjects, "projects", "All active projects serve an objective.", "name")}
              <p className="border-t border-border pt-3 text-2xs text-muted-foreground">An annual objective counts as planned when it, or one of its quarterly priorities, has at least one linked project or commercial opportunity.</p>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
