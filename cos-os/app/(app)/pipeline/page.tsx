import Link from "next/link";
import { loadPage } from "@/lib/page";
import { computeSignals, pipelineMetrics, stageConversion, STALL_ACTIVITY_DAYS, STALL_STAGE_DAYS } from "@/lib/analytics";
import { COMMERCIAL_STAGES } from "@/lib/schema";
import type { Row } from "@/lib/types";
import { formatDate, formatMoney, formatPercent, relativeDays } from "@/lib/utils";
import { PageHeader, SectionTitle } from "@/components/app/page-header";
import { Stat } from "@/components/app/stat";
import { StageBars } from "@/components/app/charts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { SignalList } from "@/components/app/signal-list";
import { Kanban } from "@/components/app/kanban";
import { EntityTable } from "@/components/app/entity-table";
import { NewRecordButton } from "@/components/app/record-form";
import { StatusBadge } from "@/components/app/status";
import { ViewTabs } from "@/components/ui/view-tabs";
import { RecordListCard, type ListItem } from "@/components/pipeline/record-list";

export const metadata = { title: "Commercial Pipeline" };

const TABLES = [
  "commercial_opportunities",
  "commercial_accounts",
  "commercial_contacts",
  "commercial_activities",
  "strategic_objectives",
  "projects",
  "milestones",
  "tasks",
  "dependencies",
  "decisions",
  "users",
] as const;

export default async function PipelinePage() {
  const { data, lookups, write, investors } = await loadPage(TABLES);
  const opps = data.commercial_opportunities;
  const m = pipelineMetrics(opps);
  const conv = stageConversion(opps);
  const account = (r: Row) => lookups.commercial_accounts?.[r.account_id] ?? "—";
  const owner = (r: Row) => lookups.users?.[r.owner_id] ?? "Unassigned";

  const signals = computeSignals(
    {
      objectives: data.strategic_objectives, kpis: [], projects: data.projects, milestones: data.milestones, tasks: data.tasks,
      dependencies: data.dependencies, risks: [], decisions: data.decisions, commercial_opportunities: opps,
      investors: [], fundraising_rounds: [], fundraising_opportunities: [], investor_commitments: [], capital_receipts: [],
      due_diligence_requests: [], investor_interactions: [], financial_snapshots: [], users: data.users,
    },
    investors,
  ).filter((s) => s.area === "commercial");

  const item = (r: Row, meta: string, right?: React.ReactNode): ListItem => ({ id: r.id, table: "commercial_opportunities", title: r.name, meta, right });
  const partnerships = opps.filter((o) => o.is_partnership);
  const openStages = COMMERCIAL_STAGES.filter((s) => s !== "Won" && s !== "Lost");

  const board = (
    <Kanban
      table="commercial_opportunities"
      rows={opps.filter((o) => o.stage !== "Lost")}
      groupField="stage"
      columns={COMMERCIAL_STAGES.filter((s) => s !== "Lost")}
      lookups={lookups}
      canWrite={write("commercial_opportunities")}
      amountField="value"
      dateField="expected_close"
      subtitleField="account_id"
    />
  );

  return (
    <div>
      <PageHeader
        number="05"
        title="Commercial Pipeline"
        description="Organisations, opportunities and partnerships, with forecast and the deals that need intervention."
        actions={write("commercial_opportunities") ? <NewRecordButton table="commercial_opportunities" lookups={lookups} defaults={{ stage: "Lead", probability: 10 }} /> : null}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
        <Stat label="Open pipeline" kind="indicative" value={formatMoney(m.total)} sub={`${m.openCount} open opportunities`} method="Sum of estimated annual value of every opportunity not yet Won or Lost. Not committed revenue." />
        <Stat label="Weighted pipeline" kind="calculated" value={formatMoney(m.weighted)} sub="Value × probability" method="Σ (estimated value × probability ÷ 100) across open opportunities." />
        <Stat label="Weighted, next 90 days" kind="calculated" value={formatMoney(m.weightedNext90)} sub="Expected close within 90 days" method="Σ (value × probability ÷ 100) for open opportunities with an expected close date between today and 90 days from now." />
        <Stat label="Win rate" kind="calculated" value={m.winRate === null ? "—" : formatPercent(m.winRate)} sub="Won ÷ (won + lost)" method="Number of Won opportunities divided by Won plus Lost. Open deals are excluded." />
        <Stat label="Won value" kind="verified" value={formatMoney(m.wonValue)} sub="Closed-won opportunities" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="min-w-0 lg:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Opportunities by stage</CardTitle>
              <p className="mt-0.5 text-xs text-muted-foreground">Total estimated value against probability-weighted value.</p>
            </div>
          </CardHeader>
          <CardContent>
            <StageBars data={m.byStage.filter((s) => s.stage !== "Lost").map((s) => ({ stage: s.stage, value: s.value, weighted: Math.round(s.weighted) }))} />
          </CardContent>
        </Card>
        <Card className="min-w-0">
          <CardHeader>
            <div>
              <CardTitle>Stage conversion</CardTitle>
              <p className="mt-0.5 text-xs text-muted-foreground">Share of deals reaching a stage that went on to the next. Lost deals are excluded because the stage they reached is not recorded.</p>
            </div>
          </CardHeader>
          <Table>
            <THead><tr><TH>From → to</TH><TH className="text-right">Deals</TH><TH className="text-right">Rate</TH></tr></THead>
            <TBody>
              {conv.map((c) => (
                <TR key={c.from}>
                  <TD className="text-xs">{c.from} → {c.to}</TD>
                  <TD className="num text-right text-xs">{c.count}</TD>
                  <TD className="num text-right text-xs font-medium">{c.rate === null ? "—" : formatPercent(c.rate)}</TD>
                </TR>
              ))}
            </TBody>
          </Table>
        </Card>
      </div>

      <section className="mt-8">
        <SectionTitle title="Needs intervention" description={`Stalled means no activity for ${STALL_ACTIVITY_DAYS}+ days or ${STALL_STAGE_DAYS}+ days in the same stage.`} />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <RecordListCard title="Stalled deals" tone="red" empty="No stalled deals." items={m.stalled.map((o) => item(o, `${o.stage} · last activity ${o.last_activity_date ? relativeDays(o.last_activity_date) : "never"}`, formatMoney(o.value)))} />
          <RecordListCard title="No next step" tone="amber" empty="Every open deal has a next step." items={m.noNextStep.map((o) => item(o, `${o.stage} · ${owner(o)}`, formatMoney(o.value)))} />
          <RecordListCard title="Past expected close" tone="amber" empty="No deals past their close date." items={m.pastClose.map((o) => item(o, `Expected ${formatDate(o.expected_close)} · ${o.stage}`, formatMoney(o.value)))} />
          <RecordListCard title="Commitments in the next 7 days" empty="No next actions due this week." items={m.upcoming.map((o) => item(o, `${o.next_action} · ${owner(o)}`, formatDate(o.next_action_date, { day: "numeric", month: "short" })))} />
        </div>
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <Card className="min-w-0 lg:col-span-2">
          <CardHeader><div><CardTitle>Commercial signals</CardTitle><p className="mt-0.5 text-xs text-muted-foreground">Computed from pipeline records. Open a signal to see its evidence.</p></div></CardHeader>
          <CardContent className="py-0"><SignalList signals={signals} empty="No commercial signals." /></CardContent>
        </Card>
        <Card className="min-w-0">
          <CardHeader><div><CardTitle>Strategic partnerships</CardTitle><p className="mt-0.5 text-xs text-muted-foreground">Opportunities flagged as partnerships.</p></div></CardHeader>
          {partnerships.length ? (
            <ul className="divide-y divide-border">
              {partnerships.map((p) => (
                <li key={p.id} className="px-4 py-2.5">
                  <Link href={`/records/commercial_opportunities/${p.id}`} className="block text-[13px] font-medium hover:underline underline-offset-2">{p.name}</Link>
                  <div className="mt-1 flex items-center justify-between gap-2 text-xs text-muted-foreground">
                    <span className="truncate">{account(p)}</span>
                    <span className="flex items-center gap-2"><StatusBadge value={p.stage} /><span className="num">{formatMoney(p.value)}</span></span>
                  </div>
                </li>
              ))}
            </ul>
          ) : <p className="px-4 py-5 text-center text-xs text-muted-foreground">No partnerships flagged.</p>}
        </Card>
      </div>

      <section className="mt-10">
        <SectionTitle title="Workspace" description="Move deals on the board, or manage every commercial record in its table." />
        <ViewTabs
          tabs={[
            { id: "board", label: "Board" },
            { id: "opps", label: `Opportunities (${opps.length})` },
            { id: "partners", label: `Partnerships (${partnerships.length})` },
            { id: "accounts", label: "Organisations" },
            { id: "contacts", label: "Contacts" },
            { id: "activity", label: "Activity" },
          ]}
          panels={{
            board,
            opps: <EntityTable table="commercial_opportunities" rows={opps} lookups={lookups} canWrite={write("commercial_opportunities")} filters={["stage"]} defaults={{ stage: "Lead" }} />,
            partners: <EntityTable table="commercial_opportunities" rows={partnerships} lookups={lookups} canWrite={write("commercial_opportunities")} filters={["stage"]} defaults={{ stage: "Lead", is_partnership: true }} newLabel="New partnership" emptyText="No partnerships yet." />,
            accounts: <EntityTable table="commercial_accounts" rows={data.commercial_accounts} lookups={lookups} canWrite={write("commercial_accounts")} />,
            contacts: <EntityTable table="commercial_contacts" rows={data.commercial_contacts} lookups={lookups} canWrite={write("commercial_contacts")} />,
            activity: <EntityTable table="commercial_activities" rows={data.commercial_activities} lookups={lookups} canWrite={write("commercial_activities")} />,
          }}
        />
        <p className="mt-2 text-2xs text-muted-foreground">Open stages: {openStages.join(" → ")} → Won / Lost.</p>
      </section>
    </div>
  );
}
