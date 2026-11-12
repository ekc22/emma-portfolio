import Link from "next/link";
import { loadPage } from "@/lib/page";
import { computeSignals, deliveryHealth, type Bundle } from "@/lib/analytics";
import { PROJECT_STATUS } from "@/lib/schema";
import { PageHeader, SectionTitle } from "@/components/app/page-header";
import { Stat, Meter } from "@/components/app/stat";
import { RagDot, StatusBadge } from "@/components/app/status";
import { DataTag } from "@/components/app/provenance";
import { EntityTable } from "@/components/app/entity-table";
import { Kanban } from "@/components/app/kanban";
import { SignalList } from "@/components/app/signal-list";
import { NewRecordButton } from "@/components/app/record-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { ViewTabs } from "@/components/ui/view-tabs";
import { ActionTracker } from "@/components/projects/action-tracker";
import { Timeline } from "@/components/projects/timeline";
import { RiskHeatmap } from "@/components/projects/risk-heatmap";
import { cn, formatDate, formatMoney, sum, todayISO, daysFromToday } from "@/lib/utils";
import type { Row } from "@/lib/types";

export const metadata = { title: "Projects & Delivery" };

export default async function ProjectsPage() {
  const { data, lookups, write } = await loadPage(["projects", "milestones", "tasks", "dependencies", "risks", "strategic_objectives", "users"] as const);
  const { projects, milestones, tasks, dependencies, risks } = data;
  const today = todayISO();
  const people = lookups.users ?? {};
  const projectName = lookups.projects ?? Object.fromEntries(projects.map((p) => [p.id, p.name]));

  const health = deliveryHealth(projects, milestones, tasks, dependencies, today);
  const bundle: Bundle = {
    objectives: data.strategic_objectives, kpis: [], projects, milestones, tasks, dependencies, risks, decisions: [], commercial_opportunities: [],
    investors: [], fundraising_rounds: [], fundraising_opportunities: [], investor_commitments: [], capital_receipts: [], due_diligence_requests: [], investor_interactions: [], financial_snapshots: [],
    users: data.users,
  };
  const signals = computeSignals(bundle, false, today).filter((s) => s.area === "delivery");

  const live = health.activeProjects;
  const budget = sum(live.map((p) => p.budget));
  const spent = sum(live.map((p) => p.spent));
  const openRisks = risks.filter((r) => r.status !== "closed");
  const score = (r: Row) => (Number(r.likelihood) || 0) * (Number(r.impact) || 0);

  /* ---------- Portfolio ---------- */
  const portfolio = (
    <Card>
      <Table>
        <THead>
          <tr>
            <TH>Project</TH><TH>Status</TH><TH>Owner</TH><TH>Sponsor</TH><TH>Target</TH><TH className="w-36">Progress</TH><TH className="text-right">Budget used</TH><TH className="text-right">Open actions</TH>
          </tr>
        </THead>
        <TBody>
          {[...projects].sort((a, b) => PROJECT_STATUS.indexOf(a.status) - PROJECT_STATUS.indexOf(b.status) || String(a.target_date).localeCompare(String(b.target_date))).map((p) => {
            const d = daysFromToday(p.target_date, today);
            const late = d !== null && d < 0 && !["completed", "cancelled"].includes(p.status);
            const used = p.budget ? (Number(p.spent) / Number(p.budget)) * 100 : null;
            const openActions = tasks.filter((t) => t.project_id === p.id && t.status !== "done");
            const overdueActions = openActions.filter((t) => t.due_date && t.due_date < today).length;
            return (
              <TR key={p.id}>
                <TD className="max-w-[20rem]">
                  <div className="flex items-center gap-2">
                    <RagDot rag={p.rag} />
                    <Link href={`/records/projects/${p.id}`} className="truncate font-medium hover:underline underline-offset-2">{p.name}</Link>
                  </div>
                  <div className="ml-4 truncate text-2xs text-muted-foreground">{p.objective_id ? lookups.strategic_objectives?.[p.objective_id] : <span className="text-rag-amber">Not linked to an objective</span>}</div>
                </TD>
                <TD><StatusBadge value={p.status} /></TD>
                <TD className="whitespace-nowrap">{people[p.owner_id] ?? "—"}</TD>
                <TD className="whitespace-nowrap text-muted-foreground">{people[p.sponsor_id] ?? "—"}</TD>
                <TD className={cn("num whitespace-nowrap", late && "font-medium text-rag-red")} title={late ? `${-d!} days past target` : undefined}>{formatDate(p.target_date)}</TD>
                <TD><div className="flex items-center gap-2"><Meter value={Number(p.progress) || 0} tone={p.rag === "red" ? "red" : p.rag === "amber" ? "amber" : "sage"} /><span className="num w-9 text-right text-xs">{Number(p.progress) || 0}%</span></div></TD>
                <TD className={cn("num whitespace-nowrap text-right", used !== null && used > 100 && "font-medium text-rag-red")} title={p.budget ? `${formatMoney(p.spent, "GBP", false)} of ${formatMoney(p.budget, "GBP", false)}` : undefined}>
                  {used === null ? "—" : `${Math.round(used)}%`}
                  {p.budget ? <span className="block text-2xs font-normal text-muted-foreground">{formatMoney(p.spent)} / {formatMoney(p.budget)}</span> : null}
                </TD>
                <TD className="num text-right">{openActions.length}{overdueActions ? <span className="ml-1 text-2xs text-rag-red">({overdueActions} late)</span> : null}</TD>
              </TR>
            );
          })}
          {!projects.length && <tr><td colSpan={8} className="px-3 py-10 text-center text-[13px] text-muted-foreground">No projects yet.</td></tr>}
        </TBody>
      </Table>
    </Card>
  );

  /* ---------- Risks ---------- */
  const risksView = (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 lg:grid-cols-[300px_minmax(0,1fr)]">
        <Card>
          <CardHeader><CardTitle>Open risk map</CardTitle><span className="num text-xs text-muted-foreground">{openRisks.length} open</span></CardHeader>
          <CardContent className="flex justify-center"><RiskHeatmap risks={risks} /></CardContent>
        </Card>
        <Card className="min-w-0">
          <CardHeader><CardTitle>Highest-scoring open risks</CardTitle><DataTag kind="calculated" /></CardHeader>
          <ul className="divide-y divide-border">
            {[...openRisks].sort((a, b) => score(b) - score(a)).slice(0, 6).map((r) => (
              <li key={r.id} className="flex items-start gap-3 px-4 py-2.5">
                <span className={cn("num mt-0.5 w-7 shrink-0 rounded text-center text-xs font-semibold", score(r) >= 15 ? "bg-[#F4E1DE] text-rag-red" : score(r) >= 8 ? "bg-[#F6EBD6] text-rag-amber" : "bg-sage-soft text-sage-deep")} title="Likelihood × impact">{score(r)}</span>
                <div className="min-w-0 flex-1">
                  <Link href={`/records/risks/${r.id}`} className="text-[13px] font-medium hover:underline underline-offset-2">{r.title}</Link>
                  <div className="text-xs text-muted-foreground">{people[r.owner_id] ?? "No owner"} · {r.category} · review {formatDate(r.review_date)}</div>
                  {r.mitigation ? <div className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">Mitigation: {r.mitigation}</div> : <div className="mt-0.5 text-xs text-rag-amber">No mitigation recorded</div>}
                </div>
              </li>
            ))}
            {!openRisks.length && <li className="px-4 py-8 text-center text-[13px] text-muted-foreground">No open risks.</li>}
          </ul>
        </Card>
      </div>
      <EntityTable table="risks" rows={risks} lookups={lookups} canWrite={write("risks")} filters={["status", "category"]} />
    </div>
  );

  /* ---------- Dependencies ---------- */
  const depsView = (
    <div className="flex flex-col gap-4">
      {dependencies.length > 0 && (
        <Card>
          <ul className="divide-y divide-border">
            {dependencies.map((d) => {
              const late = d.status !== "resolved" && d.needed_by && d.needed_by < today;
              return (
                <li key={d.id} className="grid gap-2 px-4 py-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 text-[13px]">
                      <Link href={`/records/projects/${d.project_id}`} className="font-medium hover:underline underline-offset-2">{projectName[d.project_id] ?? "Project"}</Link>
                      <span className="text-muted-foreground">waits on</span>
                      <Link href={`/records/projects/${d.depends_on_project_id}`} className="font-medium hover:underline underline-offset-2">{projectName[d.depends_on_project_id] ?? "Project"}</Link>
                    </div>
                    <Link href={`/records/dependencies/${d.id}`} className="text-xs text-muted-foreground hover:underline underline-offset-2">{d.description}</Link>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className={cn("num", late && "font-medium text-rag-red")}>Needed {formatDate(d.needed_by)}</span>
                    <StatusBadge value={d.status} />
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>
      )}
      <EntityTable table="dependencies" rows={dependencies} lookups={lookups} canWrite={write("dependencies")} />
    </div>
  );

  return (
    <div>
      <PageHeader
        number="03"
        title="Projects & Delivery"
        description="The project portfolio, the central action tracker and the risks and dependencies that decide whether delivery lands."
        actions={
          <>
            {write("tasks") && <NewRecordButton table="tasks" lookups={lookups} label="New action" variant="secondary" defaults={{ status: "todo" }} />}
            {write("projects") && <NewRecordButton table="projects" lookups={lookups} label="New project" defaults={{ status: "planning", rag: "green" }} />}
          </>
        }
      />

      <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-5">
        <Stat
          label="Active portfolio"
          value={live.length}
          sub={
            <span className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1"><RagDot rag="green" /> <span className="num">{health.rag.green ?? 0}</span></span>
              <span className="inline-flex items-center gap-1"><RagDot rag="amber" /> <span className="num">{health.rag.amber ?? 0}</span></span>
              <span className="inline-flex items-center gap-1"><RagDot rag="red" /> <span className="num">{health.rag.red ?? 0}</span></span>
            </span>
          }
        />
        <Stat label="Overdue milestones" value={health.overdueMilestones.length} kind="calculated" method="Not complete and past due date" tone={health.overdueMilestones.length ? "red" : undefined} sub={`${health.upcomingMilestones.length} due in the next 30 days`} />
        <Stat label="Overdue actions" value={health.overdueTasks.length} kind="calculated" method="Open actions past due date" tone={health.overdueTasks.length ? "red" : undefined} sub={`${health.blocked.length} blocked · ${health.escalated.length} escalated`} />
        <Stat label="Budget used" value={budget ? `${Math.round((spent / budget) * 100)}%` : "—"} kind="calculated" method="Spent to date ÷ budget, across active, planning and on-hold projects" sub={`${formatMoney(spent)} of ${formatMoney(budget)}`} tone={spent > budget ? "red" : undefined} />
        <Stat label="Open risks" value={openRisks.length} sub={`${openRisks.filter((r) => score(r) >= 15).length} scored 15 or more`} tone={openRisks.some((r) => score(r) >= 15) ? "amber" : undefined} />
      </div>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0">
          <ViewTabs
            panels={[
              { id: "portfolio", label: "Portfolio", content: portfolio },
              { id: "kanban", label: "Kanban", content: <Kanban table="projects" rows={projects} groupField="status" columns={PROJECT_STATUS} lookups={lookups} canWrite={write("projects")} dateField="target_date" subtitleField="objective_id" /> },
              { id: "timeline", label: "Timeline", content: <Timeline projects={projects.filter((p) => p.status !== "cancelled")} milestones={milestones} today={today} /> },
              { id: "table", label: "Table", content: <EntityTable table="projects" rows={projects} lookups={lookups} canWrite={write("projects")} filters={["status", "priority"]} /> },
              { id: "actions", label: `Action tracker (${tasks.filter((t) => t.status !== "done").length})`, content: <ActionTracker rows={tasks} lookups={lookups} canWrite={write("tasks")} today={today} /> },
              { id: "milestones", label: "Milestones", content: <EntityTable table="milestones" rows={milestones} lookups={lookups} canWrite={write("milestones")} filters={["status"]} /> },
              { id: "risks", label: "Risks", content: risksView },
              { id: "dependencies", label: "Dependencies", content: depsView },
            ]}
          />
        </div>
        <aside className="flex min-w-0 flex-col gap-6">
          <div>
            <SectionTitle title="Delivery signals" description="Calculated from projects, milestones, actions and dependencies." />
            <Card>
              <CardHeader><CardTitle>Needs attention</CardTitle><DataTag kind="calculated" /></CardHeader>
              <CardContent className="py-1"><SignalList signals={signals} empty="No delivery issues detected." /></CardContent>
            </Card>
          </div>
          <div>
            <SectionTitle title="Next 30 days" />
            <Card>
              <ul className="divide-y divide-border">
                {health.upcomingMilestones.slice(0, 8).map((m) => (
                  <li key={m.id} className="flex items-start justify-between gap-3 px-4 py-2.5">
                    <div className="min-w-0">
                      <Link href={`/records/milestones/${m.id}`} className="block truncate text-[13px] font-medium hover:underline underline-offset-2">{m.title}</Link>
                      <div className="truncate text-xs text-muted-foreground">{projectName[m.project_id]} · {people[m.owner_id] ?? "No owner"}</div>
                    </div>
                    <span className="num shrink-0 text-xs text-muted-foreground">{formatDate(m.due_date, { day: "numeric", month: "short" })}</span>
                  </li>
                ))}
                {!health.upcomingMilestones.length && <li className="px-4 py-6 text-center text-[13px] text-muted-foreground">No milestones due in the next 30 days.</li>}
              </ul>
            </Card>
          </div>
        </aside>
      </div>
    </div>
  );
}
