import { loadPage } from "@/lib/page";
import { capitalPosition, fundraisingPosition } from "@/lib/analytics";
import { formatDate, formatMoney } from "@/lib/utils";
import { SectionTitle } from "@/components/app/page-header";
import { Stat } from "@/components/app/stat";
import { CashLine } from "@/components/app/charts";
import { EntityTable } from "@/components/app/entity-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTag } from "@/components/app/provenance";
import { ScenarioModeller } from "@/components/investors/scenario-modeller";
import { currentRound } from "@/components/investors/round";

export const metadata = { title: "Capital & runway" };

const TABLES = ["financial_snapshots", "fundraising_rounds", "fundraising_opportunities", "investor_commitments", "capital_receipts", "investors", "users"] as const;

export default async function CapitalPage() {
  const { data, lookups, write } = await loadPage(TABLES);
  const cap = capitalPosition(data.financial_snapshots);
  const round = currentRound(data.fundraising_rounds);
  const pos = fundraisingPosition(round, data.fundraising_opportunities, data.investor_commitments, data.capital_receipts);
  const latest = cap.latest;
  const runway = cap.runwayMonths;

  return (
    <div className="flex flex-col gap-8">
      <section>
        <SectionTitle title="Capital position" description="From recorded month-end snapshots and fundraising records." />
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
          <Stat label="Cash" kind={latest?.verified ? "verified" : "calculated"} value={formatMoney(latest?.cash_balance)} sub={latest ? `Month-end ${formatDate(latest.period)}` : "No snapshot"} />
          <Stat label="Average net burn" kind="calculated" value={formatMoney(cap.avgBurn3m)} sub="Last 3 month-ends" method="Mean of net monthly burn across the three most recent snapshots." />
          <Stat label="Runway" kind="calculated" value={runway === null ? "—" : `${runway.toFixed(1)} months`} tone={runway === null ? undefined : runway < 6 ? "red" : runway < 9 ? "amber" : "green"} method="Cash ÷ average net burn." />
          <Stat label="Committed, not received" kind="verified" value={formatMoney(Math.max(pos.soft + pos.legal - pos.received, 0))} sub={`Legal ${formatMoney(Math.max(pos.legal - pos.received, 0))}`} />
          <Stat label="Funding gap" kind="calculated" value={formatMoney(pos.gapToLegal)} sub={round ? `${round.name} target less legal commitments` : "No round"} method="Round target − legally committed capital." />
        </div>
        <Card className="mt-4">
          <CardHeader><CardTitle>How these figures are calculated</CardTitle><DataTag kind="calculated" /></CardHeader>
          <CardContent>
            <ul className="list-disc space-y-1 pl-5 text-[13px] text-muted-foreground">
              {cap.assumptions.map((a) => <li key={a}>{a}</li>)}
            </ul>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card className="min-w-0">
          <CardHeader><div><CardTitle>Cash history</CardTitle><p className="mt-0.5 text-xs text-muted-foreground">Month-end cash balance.</p></div></CardHeader>
          <CardContent><CashLine data={cap.history.map((h) => ({ label: formatDate(h.period, { month: "short", year: "2-digit" }), cash: Number(h.cash_balance) }))} /></CardContent>
        </Card>
        <Card className="min-w-0">
          <CardHeader><div><CardTitle>Burn and revenue</CardTitle><p className="mt-0.5 text-xs text-muted-foreground">Net burn against revenue in month.</p></div></CardHeader>
          <CardContent>
            <ul className="divide-y divide-border text-[13px]">
              {[...cap.history].reverse().map((h) => (
                <li key={h.id} className="grid grid-cols-3 gap-2 py-1.5">
                  <span className="text-muted-foreground">{formatDate(h.period, { month: "short", year: "numeric" })}</span>
                  <span className="num text-right">burn {formatMoney(h.monthly_burn)}</span>
                  <span className="num text-right">revenue {formatMoney(h.revenue)}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>

      <section>
        <SectionTitle title="Funding scenarios" description="Change any input to see how runway moves. Nothing here is saved or treated as a forecast." />
        <Card className="p-4">
          <ScenarioModeller
            initial={{
              cash: Number(latest?.cash_balance) || 0,
              monthlyBurn: Math.round(cap.avgBurn3m ?? 0),
              burnGrowthPct: 0,
              monthlyRevenueGrowth: 0,
              raiseAmount: pos.gapToLegal,
              raiseMonth: Math.max(Math.round((pos.daysToTargetClose ?? 120) / 30), 1),
              months: 24,
            }}
          />
        </Card>
      </section>

      <section>
        <SectionTitle title="Month-end snapshots" description="Financial record. Only owners and admins can add or change snapshots." />
        <EntityTable table="financial_snapshots" rows={data.financial_snapshots} lookups={lookups} canWrite={write("financial_snapshots")} />
      </section>
    </div>
  );
}
