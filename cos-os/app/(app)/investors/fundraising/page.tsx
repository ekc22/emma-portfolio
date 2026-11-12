import { loadPage } from "@/lib/page";
import { FUNDRAISING_STAGES } from "@/lib/schema";
import { fundraisingPosition } from "@/lib/analytics";
import { formatMoney } from "@/lib/utils";
import { SectionTitle } from "@/components/app/page-header";
import { Kanban } from "@/components/app/kanban";
import { EntityTable } from "@/components/app/entity-table";
import { NewRecordButton } from "@/components/app/record-form";
import { Stat } from "@/components/app/stat";
import { ViewTabs } from "@/components/ui/view-tabs";
import { currentRound } from "@/components/investors/round";

export const metadata = { title: "Fundraising pipeline" };

const TABLES = ["fundraising_opportunities", "fundraising_rounds", "investor_commitments", "capital_receipts", "investors", "users"] as const;

export default async function FundraisingPage() {
  const { data, lookups, write } = await loadPage(TABLES);
  const round = currentRound(data.fundraising_rounds);
  const opps = data.fundraising_opportunities;
  const pos = fundraisingPosition(round, opps, data.investor_commitments, data.capital_receipts);
  const roundDefaults = round ? { round_id: round.id } : {};

  return (
    <div className="flex flex-col gap-6">
      <section>
        <SectionTitle
          title={round ? `${round.name} pipeline` : "Fundraising pipeline"}
          description="Indicative values show investor interest and are not commitments. Commitments and receipts are recorded separately below."
          actions={write("fundraising_opportunities") ? <NewRecordButton table="fundraising_opportunities" lookups={lookups} defaults={{ stage: "Identified", ...roundDefaults }} label="Add investor to pipeline" /> : null}
        />
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Stat label="Potential (open)" kind="indicative" value={formatMoney(pos.potential)} sub="Our estimate of capacity" />
          <Stat label="Indicative interest" kind="indicative" value={formatMoney(pos.indicative)} sub="Stated, not committed" />
          <Stat label="Committed (soft + legal)" kind="verified" value={formatMoney(pos.soft + pos.legal)} sub={`Legal ${formatMoney(pos.legal)}`} />
          <Stat label="Received" kind="verified" value={formatMoney(pos.received)} sub={round ? `Target ${formatMoney(pos.target)}` : undefined} />
        </div>
      </section>
      <ViewTabs
        tabs={[
          { id: "board", label: "Board" },
          { id: "table", label: `Pipeline table (${opps.length})` },
          { id: "commitments", label: "Commitments" },
          { id: "receipts", label: "Capital received" },
          { id: "rounds", label: "Rounds" },
        ]}
        panels={{
          board: (
            <Kanban table="fundraising_opportunities" rows={opps} groupField="stage" columns={FUNDRAISING_STAGES} lookups={lookups} canWrite={write("fundraising_opportunities")} amountField="potential_amount" dateField="next_action_date" hideEmpty={false} />
          ),
          table: <EntityTable table="fundraising_opportunities" rows={opps} lookups={lookups} canWrite={write("fundraising_opportunities")} filters={["stage"]} defaults={{ stage: "Identified", ...roundDefaults }} />,
          commitments: (
            <div className="flex flex-col gap-2">
              <p className="text-xs text-muted-foreground">Financial record. Only owners and admins can create or change commitments. Record soft commitments separately from legally binding ones, and mark a record verified only against the signed document.</p>
              <EntityTable table="investor_commitments" rows={data.investor_commitments} lookups={lookups} canWrite={write("investor_commitments")} filters={["commitment_type"]} defaults={roundDefaults} />
            </div>
          ),
          receipts: (
            <div className="flex flex-col gap-2">
              <p className="text-xs text-muted-foreground">Financial record. Mark a receipt bank-verified only once it appears on the bank statement.</p>
              <EntityTable table="capital_receipts" rows={data.capital_receipts} lookups={lookups} canWrite={write("capital_receipts")} defaults={roundDefaults} />
            </div>
          ),
          rounds: <EntityTable table="fundraising_rounds" rows={data.fundraising_rounds} lookups={lookups} canWrite={write("fundraising_rounds")} />,
        }}
      />
    </div>
  );
}
