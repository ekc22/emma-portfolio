import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { loadPage } from "@/lib/page";
import { fundraisingPosition, investorIntelligence } from "@/lib/analytics";
import { FUNDRAISING_STAGES } from "@/lib/schema";
import type { Row } from "@/lib/types";
import { formatDate, formatMoney, formatPercent, relativeDays } from "@/lib/utils";
import { SectionTitle } from "@/components/app/page-header";
import { Stat, Meter } from "@/components/app/stat";
import { CapitalLadder } from "@/components/app/charts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTag } from "@/components/app/provenance";
import { GenerateReportButton } from "@/components/app/generate-report-button";
import { RecordListCard, type ListItem } from "@/components/pipeline/record-list";
import { currentRound } from "@/components/investors/round";

export const metadata = { title: "Investor Relations Desk" };

const TABLES = ["investors", "fundraising_rounds", "fundraising_opportunities", "investor_commitments", "capital_receipts", "due_diligence_requests", "investor_interactions", "users"] as const;

export default async function InvestorsDashboard() {
  const { data, lookups } = await loadPage(TABLES);
  const round = currentRound(data.fundraising_rounds);
  const pos = fundraisingPosition(round, data.fundraising_opportunities, data.investor_commitments, data.capital_receipts);
  const ii = investorIntelligence(data.investors, data.fundraising_opportunities, data.due_diligence_requests, data.investor_interactions);
  const inv = (id: string) => lookups.investors?.[id] ?? "Investor";
  const owner = (id: string | null) => (id ? lookups.users?.[id] ?? "Unassigned" : "Unassigned");
  const target = pos.target;
  const pct = (n: number) => (target ? (n / target) * 100 : 0);

  const fo = (r: Row, meta: string, right?: React.ReactNode): ListItem => ({ id: r.id, table: "fundraising_opportunities", title: r.name ?? inv(r.investor_id), meta, right });
  const ir = (r: Row, meta: string): ListItem => ({ id: r.id, table: "investors", title: r.name, meta });
  const dd = (r: Row): ListItem => ({ id: r.id, table: "due_diligence_requests", title: r.request, meta: `${inv(r.investor_id)} · ${owner(r.owner_id)}`, right: formatDate(r.deadline, { day: "numeric", month: "short" }) });

  const stageCounts = pos.byStage.filter((s) => s.stage !== "Passed");
  const maxCount = Math.max(1, ...stageCounts.map((s) => s.count));

  return (
    <div className="flex flex-col gap-8">
      {!round ? (
        <Card><CardContent className="py-8 text-center text-[13px] text-muted-foreground">No fundraising round recorded. Add one under Fundraising pipeline to track progress against a target.</CardContent></Card>
      ) : (
        <section>
          <SectionTitle
            title={`${round.name}: progress against ${formatMoney(target)}`}
            description={`Target close ${formatDate(round.target_close_date)}${pos.daysToTargetClose !== null ? ` (${relativeDays(round.target_close_date)})` : ""}. Pre-money ${formatMoney(round.pre_money)}.`}
            actions={<GenerateReportButton defaultType="ir_briefing" types={["ir_briefing", "investor_update", "board_pack"]} label="Weekly IR briefing" />}
          />
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <Stat label="Indicative interest" kind="indicative" value={formatMoney(pos.indicative)} sub={`Not committed · potential ${formatMoney(pos.potential)}`} method="Sum of indicative amounts investors have stated, across investors still in process. Stated interest only." />
            <Stat label="Soft commitments" kind="verified" value={formatMoney(pos.soft)} sub={`${formatPercent(pct(pos.soft))} of target · not binding`} />
            <Stat label="Legally committed" kind="verified" value={formatMoney(pos.legal)} sub={`${formatPercent(pct(pos.legal))} of target`} tone={pos.legal >= target ? "green" : undefined} />
            <Stat label="Funds received" kind="verified" value={formatMoney(pos.received)} sub={`${formatPercent(pct(pos.received))} of target`} />
          </div>

          <div className="mt-4 grid gap-6 lg:grid-cols-3">
            <Card className="min-w-0 lg:col-span-2">
              <CardHeader>
                <div>
                  <CardTitle>Capital ladder</CardTitle>
                  <p className="mt-0.5 text-xs text-muted-foreground">From what investors have said to cash in the bank. Only the bottom two bars are binding.</p>
                </div>
              </CardHeader>
              <CardContent>
                <CapitalLadder
                  target={target}
                  rows={[
                    { label: "Indicative interest", value: pos.indicative, kind: "indicative" },
                    { label: "Soft commitments", value: pos.soft, kind: "soft" },
                    { label: "Legally committed", value: pos.legal, kind: "legal" },
                    { label: "Funds received", value: pos.received, kind: "received" },
                  ]}
                />
                <div className="mt-3 grid gap-2 rounded-md bg-background px-3 py-2.5 text-xs sm:grid-cols-3">
                  <div><div className="eyebrow">Gap to target (legal)</div><div className="num text-[15px] font-semibold">{formatMoney(pos.gapToLegal)}</div></div>
                  <div><div className="eyebrow">Gap if all soft convert</div><div className="num text-[15px] font-semibold">{formatMoney(pos.gapToSoftAndLegal)}</div></div>
                  <div className="flex items-end"><DataTag kind="calculated" /><span className="ml-1 text-2xs text-muted-foreground">Target − committed amounts</span></div>
                </div>
              </CardContent>
            </Card>
            <Card className="min-w-0">
              <CardHeader><div><CardTitle>Investor conversion</CardTitle><p className="mt-0.5 text-xs text-muted-foreground">{pos.activeInvestors} active investors · {pos.ddConversion === null ? "—" : formatPercent(pos.ddConversion)} reached diligence or later</p></div></CardHeader>
              <ul className="space-y-1.5 px-4 py-3">
                {stageCounts.map((s) => (
                  <li key={s.stage} className="grid grid-cols-[8.5rem_1fr_1.5rem] items-center gap-2 text-xs">
                    <span className="truncate text-muted-foreground">{s.stage}</span>
                    <Meter value={s.count} max={maxCount} tone={FUNDRAISING_STAGES.indexOf(s.stage) >= FUNDRAISING_STAGES.indexOf("Soft Commitment") ? "sage" : "navy"} />
                    <span className="num text-right font-medium">{s.count}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {pos.unverified.length > 0 && (
            <div role="status" className="mt-4 flex items-start gap-2 rounded-md border border-rag-amber/40 bg-[#F6EBC8]/60 px-3 py-2.5 text-[13px]">
              <AlertTriangle className="mt-0.5 size-4 shrink-0 text-rag-amber" aria-hidden />
              <div>
                <strong className="font-medium">{pos.unverified.length} commitment or receipt record{pos.unverified.length === 1 ? " is" : "s are"} not verified.</strong>{" "}
                They are included in the totals above. Verify against the signed document or bank statement under{" "}
                <Link href="/investors/fundraising" className="text-navy underline underline-offset-2">Fundraising pipeline</Link>.
              </div>
            </div>
          )}
        </section>
      )}

      <section className="grid gap-4 md:grid-cols-2">
        <RecordListCard title="In due diligence" items={pos.inDiligence.map((o) => fo(o, `${owner(o.owner_id)} · next: ${o.next_action ?? "none set"}`, formatMoney(o.indicative_amount ?? o.potential_amount)))} empty="No investors in diligence." />
        <RecordListCard title="Expected to close within 30 days" items={pos.closingSoon.map((o) => fo(o, `${o.stage} · ${formatDate(o.expected_close)}`, formatMoney(o.indicative_amount ?? o.potential_amount)))} empty="Nothing expected to close in 30 days." />
      </section>

      <section>
        <SectionTitle title="Relationship intelligence" description="Computed from investor, pipeline, diligence and interaction records." />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <RecordListCard title="Follow-ups due" tone="amber" items={ii.followUpDue.map((i) => ir(i, `Due ${formatDate(i.next_follow_up)} · ${owner(i.relationship_owner_id)}`))} empty="No follow-ups due." />
          <RecordListCard title="Overdue next actions" tone="amber" items={ii.overdueNext.map((o) => fo(o, `${o.next_action} · ${owner(o.owner_id)}`, formatDate(o.next_action_date, { day: "numeric", month: "short" })))} empty="No overdue next actions." />
          <RecordListCard title="No contact in 30+ days" items={ii.dormant.map((i) => ir(i, `Last contact ${i.last_contact_date ? relativeDays(i.last_contact_date) : "never"}`))} empty="Every active relationship is warm." />
          <RecordListCard title="Overdue or blocked diligence" tone="red" items={[...ii.overdueDD, ...ii.blockedDD.filter((b) => !ii.overdueDD.includes(b))].map(dd)} empty="No overdue or blocked requests." />
          <RecordListCard title="Diligence awaiting release approval" items={ii.awaitingApproval.map(dd)} empty="Nothing awaiting approval." />
          <RecordListCard title="Potentially relevant, not yet in pipeline" items={ii.prospects.map((i) => ir(i, [i.investment_focus, i.sectors].filter(Boolean).join(" · ") || "No focus recorded"))} empty="Every investor in the CRM is in the pipeline." />
        </div>
        {ii.repeated.length > 0 && (
          <Card className="mt-4">
            <CardHeader><div><CardTitle>Repeated investor questions</CardTitle><p className="mt-0.5 text-xs text-muted-foreground">Topics requested by two or more investors. One standard pack saves duplicated work.</p></div></CardHeader>
            <ul className="divide-y divide-border">
              {ii.repeated.map((g) => (
                <li key={g.topic} className="px-4 py-2.5 text-[13px]">
                  <span className="font-medium capitalize">{g.topic}</span>
                  <span className="text-muted-foreground"> · {g.investors} investors</span>
                  <ul className="mt-1 space-y-0.5 text-xs">
                    {g.rows.map((r) => (
                      <li key={r.id}><Link href={`/records/due_diligence_requests/${r.id}`} className="text-navy hover:underline underline-offset-2">{r.request}</Link> <span className="text-muted-foreground">· {inv(r.investor_id)}</span></li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </Card>
        )}
      </section>
    </div>
  );
}
