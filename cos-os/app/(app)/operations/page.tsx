import Link from "next/link";
import { loadPage } from "@/lib/page";
import { isClaudeConfigured } from "@/lib/env";
import { checkInCoverage, operationsSignals, requestQueue, routinesDue, teamWorkload, weekEnding, DEFAULT_ESTIMATE_HOURS, WORKLOAD_WINDOW_DAYS } from "@/lib/analytics";
import { cn, formatDate, todayISO } from "@/lib/utils";
import { PageHeader, SectionTitle } from "@/components/app/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ViewTabs } from "@/components/ui/view-tabs";
import { Stat, Meter } from "@/components/app/stat";
import { RagDot } from "@/components/app/status";
import { SignalList } from "@/components/app/signal-list";
import { EntityTable } from "@/components/app/entity-table";
import { NewRecordButton } from "@/components/app/record-form";
import { DataTag } from "@/components/app/provenance";
import { AiActionButton } from "@/components/ai/ai-action-button";
import { ProposalQueue } from "@/components/ai/proposal-queue";
import { GenerateReportButton } from "@/components/app/generate-report-button";
import { MyWork } from "@/components/operations/my-work";
import { RoutineList } from "@/components/operations/routine-list";
import { RequestQueue } from "@/components/operations/request-queue";

export const metadata = { title: "Team & Operations" };

export default async function OperationsPage() {
  const { session, data, lookups, write } = await loadPage(["users", "teams", "tasks", "projects", "milestones", "status_updates", "routines", "requests", "ai_recommendations"] as const);
  const today = todayISO();
  const load = teamWorkload(data.users, data.tasks, today);
  const coverage = checkInCoverage(data.projects, data.status_updates, today);
  const rd = routinesDue(data.routines, today);
  const rq = requestQueue(data.requests, today);
  const signals = operationsSignals(data.users, data.tasks, data.projects, data.status_updates, data.routines, data.requests, today);
  const mine = data.tasks.filter((t) => t.owner_id === session.personId);
  const myLoad = load.find((w) => w.user.id === session.personId);
  const over = load.filter((w) => (w.load ?? 0) > 110);
  const missing = coverage.filter((c) => c.stale);
  const we = weekEnding(today);
  const ai = isClaudeConfigured() && write("ai_recommendations");
  const pendingCheckIns = data.ai_recommendations.filter((r) => r.status === "pending" && r.target_table === "status_updates");

  const myWork = session.personId ? (
    <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_320px]">
      <MyWork tasks={mine} lookups={lookups} canWrite={write("tasks")} today={today} />
      <aside className="flex flex-col gap-6">
        {myLoad && (
          <Card>
            <CardHeader><CardTitle>My load</CardTitle><DataTag kind="calculated" /></CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="num font-serif text-[2.2rem] leading-none">{myLoad.load === null ? "—" : `${Math.round(myLoad.load)}%`}</div>
              <Meter value={Math.min(myLoad.load ?? 0, 100)} tone={(myLoad.load ?? 0) > 110 ? "red" : (myLoad.load ?? 0) > 85 ? "amber" : "navy"} />
              <p className="text-muted-foreground">{Math.round(myLoad.hours)}h due in the next {WORKLOAD_WINDOW_DAYS} days against {Math.round(myLoad.capacity)}h of capacity.</p>
            </CardContent>
          </Card>
        )}
        <Card>
          <CardHeader><CardTitle>My routines and requests</CardTitle></CardHeader>
          <ul className="divide-y divide-linen-deep">
            {data.routines.filter((r) => r.owner_id === session.personId).map((r) => (
              <li key={r.id} className="px-4 py-2 text-[13px]"><Link href={`/records/routines/${r.id}`} className="hover:text-cherry">{r.title}</Link><div className="text-2xs text-muted-foreground">Next due {formatDate(r.next_due, { day: "numeric", month: "short" })}</div></li>
            ))}
            {rq.open.filter((r) => r.owner_id === session.personId).map((r) => (
              <li key={r.id} className="px-4 py-2 text-[13px]"><Link href={`/records/requests/${r.id}`} className="hover:text-cherry">{r.title}</Link><div className="text-2xs text-muted-foreground">Request · {r.status.replace("_", " ")}</div></li>
            ))}
            {!data.routines.some((r) => r.owner_id === session.personId) && !rq.open.some((r) => r.owner_id === session.personId) && <li className="px-4 py-3 text-xs text-muted-foreground">None assigned to you.</li>}
          </ul>
        </Card>
      </aside>
    </div>
  ) : (
    <p className="border-t border-oxblood py-6 text-[13px] text-muted-foreground">Your login is not linked to a person in this workspace, so there is no personal list. An admin can link it in Supabase (memberships.person_id).</p>
  );

  const workload = (
    <div className="flex flex-col gap-4">
      <p className="max-w-3xl text-xs text-muted-foreground">Load = estimated hours of open actions due in the next {WORKLOAD_WINDOW_DAYS} days, plus anything overdue, ÷ two weeks of capacity. Actions without an estimate count as {DEFAULT_ESTIMATE_HOURS}h. Set capacity on each person in Settings → People.</p>
      <div className="relative overflow-x-auto border-t border-oxblood">
        <table className="w-full min-w-[720px] text-[13px]">
          <thead><tr className="text-left">{["Person", "Load", "Hours / capacity", "Open", "Overdue", "Blocked", "Critical"].map((h) => <th key={h} className="label border-b border-linen-deep px-3 py-2 font-semibold">{h}</th>)}</tr></thead>
          <tbody>
            {load.map((w) => (
              <tr key={w.user.id} className="border-b border-linen-deep">
                <td className="px-3 py-2.5"><Link href={`/records/users/${w.user.id}`} className="font-serif text-[17px] hover:text-cherry">{w.user.full_name}</Link><div className="text-2xs text-muted-foreground">{w.user.title}</div></td>
                <td className="w-48 px-3 py-2.5">
                  {w.load === null ? <span className="text-2xs text-muted-foreground">No capacity set</span> : (
                    <div className="flex items-center gap-2"><Meter value={Math.min(w.load, 100)} tone={w.load > 110 ? "red" : w.load > 85 ? "amber" : "navy"} /><span className={cn("num w-11 text-right text-xs", w.load > 110 && "font-semibold text-rag-red")}>{Math.round(w.load)}%</span></div>
                  )}
                </td>
                <td className="num px-3 py-2.5 text-xs">{Math.round(w.hours)}h / {Math.round(w.capacity)}h{w.unestimated ? <span className="text-muted-foreground"> · {w.unestimated} unestimated</span> : ""}</td>
                <td className="num px-3 py-2.5">{w.open}</td>
                <td className={cn("num px-3 py-2.5", w.overdue && "text-rag-red")}>{w.overdue}</td>
                <td className={cn("num px-3 py-2.5", w.blocked && "text-rag-amber")}>{w.blocked}</td>
                <td className="num px-3 py-2.5">{w.critical}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const checkIns = (
    <div className="flex flex-col gap-6">
      {pendingCheckIns.length > 0 && (
        <section>
          <SectionTitle title="AI-drafted check-ins awaiting the owner" actions={<DataTag kind="ai" />} />
          <ProposalQueue proposals={pendingCheckIns} lookups={lookups} canDecide={write("status_updates")} />
        </section>
      )}
      <ul className="divide-y divide-linen-deep border-t border-oxblood">
        {coverage.map((c) => (
          <li key={c.project.id} className="grid grid-cols-1 gap-3 py-4 lg:grid-cols-[minmax(0,1fr)_auto]">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <RagDot rag={c.latest?.rag ?? c.project.rag} />
                <Link href={`/records/projects/${c.project.id}`} className="font-serif text-[19px] leading-tight hover:text-cherry">{c.project.name}</Link>
                <span className="text-2xs text-muted-foreground">{lookups.users?.[c.project.owner_id]}</span>
                {c.stale && <span className="label !text-rag-amber">No check-in this week</span>}
              </div>
              {c.latest ? (
                <div className="mt-1">
                  <Link href={`/records/status_updates/${c.latest.id}`} className="text-[14px] hover:text-cherry">{c.latest.headline}</Link>
                  <div className="text-2xs text-muted-foreground">Week ending {formatDate(c.latest.week_ending, { day: "numeric", month: "short" })}{c.latest.blockers ? ` · Blockers: ${c.latest.blockers}` : ""}</div>
                </div>
              ) : <p className="mt-1 text-xs text-muted-foreground">No check-ins yet.</p>}
            </div>
            {write("status_updates") && (
              <div className="flex flex-wrap items-start gap-2">
                <NewRecordButton table="status_updates" lookups={lookups} variant="secondary" label="Write check-in" defaults={{ project_id: c.project.id, week_ending: we, rag: c.project.rag ?? "green", progress: c.project.progress ?? null, owner_id: c.project.owner_id ?? session.personId }} />
                {ai && <AiActionButton endpoint="/api/operations/checkin-draft" body={{ project_id: c.project.id }} size="sm" label="Draft with AI" busyLabel="Reading the project…" />}
              </div>
            )}
          </li>
        ))}
      </ul>
      <details>
        <summary className="label cursor-pointer">All check-ins</summary>
        <div className="mt-3"><EntityTable table="status_updates" rows={data.status_updates} lookups={lookups} canWrite={write("status_updates")} filters={["rag"]} /></div>
      </details>
    </div>
  );

  const routines = (
    <div className="grid grid-cols-1 gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div>
        <p className="mb-3 max-w-2xl text-xs text-muted-foreground">The recurring work that keeps the company running. Creating actions turns each checklist step into an action for the owner, due on the routine date, and moves the routine on to its next date.</p>
        <RoutineList routines={data.routines} lookups={lookups} canWrite={write("routines")} today={today} />
        {write("routines") && <div className="mt-4"><NewRecordButton table="routines" lookups={lookups} variant="secondary" defaults={{ cadence: "weekly", active: true, lead_days: 5, next_due: today }} /></div>}
      </div>
      <Card>
        <CardHeader><CardTitle>Coming up</CardTitle></CardHeader>
        <ul className="divide-y divide-linen-deep">
          {rd.upcoming.slice(0, 8).map((r) => (
            <li key={r.id} className="flex items-baseline justify-between gap-3 px-4 py-2 text-[13px]"><span>{r.title}</span><span className="num shrink-0 text-2xs text-muted-foreground">{formatDate(r.next_due, { day: "numeric", month: "short" })}</span></li>
          ))}
        </ul>
      </Card>
    </div>
  );

  const requests = (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <p className="max-w-2xl text-xs text-muted-foreground">Anyone can raise a request. Triage it, give it an owner and turn it into a tracked action, or decline it.</p>
        {write("requests") && <NewRecordButton table="requests" lookups={lookups} label="Raise a request" defaults={{ status: "new", priority: "medium", requested_by_id: session.personId }} />}
      </div>
      <RequestQueue requests={data.requests} lookups={lookups} canWrite={write("requests")} today={today} />
      <details>
        <summary className="label cursor-pointer">All requests, including closed</summary>
        <div className="mt-3"><EntityTable table="requests" rows={data.requests} lookups={lookups} canWrite={write("requests")} filters={["status", "request_type"]} /></div>
      </details>
    </div>
  );

  return (
    <div>
      <PageHeader
        number="04"
        title="Team & Operations"
        description="How the team runs week to week: what each person owns, who has too much, which projects owe a check-in, the recurring rhythm and the requests coming in."
        actions={ai && write("reports") ? <GenerateReportButton defaultType="team_operations_review" types={["team_operations_review", "weekly_ceo_update"]} label="Weekly ops review" /> : undefined}
      />
      <div className="mb-10 grid grid-cols-2 gap-x-6 gap-y-6 md:grid-cols-4">
        <Stat label="Over capacity" value={over.length} tone={over.length ? "red" : undefined} kind="calculated" method={`People whose load over the next ${WORKLOAD_WINDOW_DAYS} days is above 110% of capacity`} sub={over.map((w) => w.user.full_name.split(" ")[0]).join(", ") || "Nobody"} />
        <Stat label="Check-ins missing" value={`${missing.length} / ${coverage.length}`} tone={missing.length ? "amber" : undefined} kind="calculated" method="Active or on-hold projects without a check-in in the last 7 days" sub={`Week ending ${formatDate(we, { day: "numeric", month: "short" })}`} />
        <Stat label="Routines due" value={rd.overdue.length + rd.readyToRun.length} tone={rd.overdue.length ? "red" : undefined} kind="calculated" method="Routines past due, or inside their lead time and not yet run" sub={`${rd.overdue.length} overdue`} />
        <Stat label="Open requests" value={rq.open.length} kind="calculated" method="Requests not done or declined" sub={`${rq.untriaged.length} untriaged · ${rq.unassigned.length} unassigned`} />
      </div>

      <div className="grid grid-cols-1 gap-10 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0">
          <ViewTabs
            panels={[
              { id: "mine", label: `My work (${mine.filter((t) => t.status !== "done").length})`, content: myWork },
              { id: "workload", label: "Team workload", content: workload },
              { id: "checkins", label: `Check-ins (${missing.length} missing)`, content: checkIns },
              { id: "routines", label: "Operating rhythm", content: routines },
              { id: "requests", label: `Requests (${rq.open.length})`, content: requests },
            ]}
          />
        </div>
        <aside>
          <Card>
            <CardHeader><div><CardTitle>Operations signals</CardTitle><p className="text-xs text-muted-foreground">Calculated from records</p></div><DataTag kind="calculated" /></CardHeader>
            <CardContent className="py-1"><SignalList signals={signals} empty="The team is in good shape." /></CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
