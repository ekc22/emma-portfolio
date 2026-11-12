import { loadPage } from "@/lib/page";
import { INVESTOR_CATEGORY, RELATIONSHIP_STRENGTH, humanize } from "@/lib/schema";
import { formatMoney, sum } from "@/lib/utils";
import { SectionTitle } from "@/components/app/page-header";
import { EntityTable } from "@/components/app/entity-table";
import { ViewTabs } from "@/components/ui/view-tabs";
import { Card } from "@/components/ui/card";

export const metadata = { title: "Investor CRM" };

const TABLES = ["investors", "investor_contacts", "investor_interactions", "fundraising_opportunities", "users"] as const;

export default async function InvestorCrmPage() {
  const { data, lookups, write } = await loadPage(TABLES);
  const inv = data.investors;
  const segments = INVESTOR_CATEGORY.map((c) => {
    const rows = inv.filter((i) => i.category === c);
    return { c, n: rows.length, cheque: sum(rows.map((r) => r.cheque_max)) };
  }).filter((s) => s.n);
  const strength = RELATIONSHIP_STRENGTH.map((s) => ({ s, n: inv.filter((i) => i.relationship_strength === s).length }));
  const unowned = inv.filter((i) => !i.relationship_owner_id).length;

  return (
    <div className="flex flex-col gap-6">
      <section>
        <SectionTitle title="Segmentation" description="Investors by category and relationship strength. Use the filters in the table to drill in." />
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="p-4 md:col-span-2">
            <div className="eyebrow mb-2">By category · upper cheque size</div>
            <ul className="grid gap-x-6 gap-y-1.5 sm:grid-cols-2">
              {segments.map((s) => (
                <li key={s.c} className="flex items-baseline justify-between gap-2 border-b border-border/60 pb-1 text-[13px]">
                  <span>{humanize(s.c)}</span>
                  <span className="num text-xs text-muted-foreground">{s.n} · up to {formatMoney(s.cheque)}</span>
                </li>
              ))}
            </ul>
          </Card>
          <Card className="p-4">
            <div className="eyebrow mb-2">Relationship strength</div>
            <ul className="space-y-1.5 text-[13px]">
              {strength.map((s) => <li key={s.s} className="flex justify-between"><span>{humanize(s.s)}</span><span className="num font-medium">{s.n}</span></li>)}
              <li className="flex justify-between border-t border-border pt-1.5 text-muted-foreground"><span>No relationship owner</span><span className="num">{unowned}</span></li>
            </ul>
          </Card>
        </div>
      </section>
      <ViewTabs
        tabs={[
          { id: "investors", label: `Investors (${inv.length})` },
          { id: "contacts", label: "Key contacts" },
          { id: "history", label: "Relationship history" },
        ]}
        panels={{
          investors: <EntityTable table="investors" rows={inv} lookups={lookups} canWrite={write("investors")} filters={["category", "relationship_strength"]} />,
          contacts: <EntityTable table="investor_contacts" rows={data.investor_contacts} lookups={lookups} canWrite={write("investor_contacts")} />,
          history: <EntityTable table="investor_interactions" rows={data.investor_interactions} lookups={lookups} canWrite={write("investor_interactions")} filters={["interaction_type"]} />,
        }}
      />
    </div>
  );
}
