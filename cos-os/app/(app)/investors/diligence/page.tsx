import Link from "next/link";
import { loadPage } from "@/lib/page";
import { DD_CATEGORY, DD_STATUS, humanize } from "@/lib/schema";
import { investorIntelligence } from "@/lib/analytics";
import { formatDate } from "@/lib/utils";
import { SectionTitle } from "@/components/app/page-header";
import { EntityTable } from "@/components/app/entity-table";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/app/status";
import { RecordListCard } from "@/components/pipeline/record-list";

export const metadata = { title: "Due diligence" };

const TABLES = ["due_diligence_requests", "investors", "fundraising_opportunities", "investor_interactions", "fundraising_rounds", "users"] as const;

export default async function DiligencePage() {
  const { data, lookups, write } = await loadPage(TABLES);
  const reqs = data.due_diligence_requests;
  const ii = investorIntelligence(data.investors, data.fundraising_opportunities, reqs, data.investor_interactions);
  const inv = (id: string) => lookups.investors?.[id] ?? "Investor";
  const owner = (id: string | null) => (id ? lookups.users?.[id] ?? "Unassigned" : "Unassigned");
  const byStatus = DD_STATUS.map((s) => ({ s, n: reqs.filter((r) => r.status === s).length }));
  const byCat = DD_CATEGORY.map((c) => ({ c, open: ii.openDD.filter((r) => r.category === c).length, total: reqs.filter((r) => r.category === c).length })).filter((x) => x.total);
  const item = (r: (typeof reqs)[number]) => ({ id: r.id, table: "due_diligence_requests" as const, title: r.request, meta: `${inv(r.investor_id)} · ${owner(r.owner_id)}`, right: formatDate(r.deadline, { day: "numeric", month: "short" }) });

  return (
    <div className="flex flex-col gap-6">
      <section>
        <SectionTitle title="Document request dashboard" description="Every investor information request, its owner and deadline." />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {byStatus.map((s) => (
            <div key={s.s} className="rounded-lg border border-border bg-surface px-4 py-3 shadow-subtle">
              <div className="mb-1"><StatusBadge value={s.s} /></div>
              <div className="num text-[22px] font-semibold">{s.n}</div>
            </div>
          ))}
        </div>
      </section>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <RecordListCard title="Overdue" tone="red" items={ii.overdueDD.map(item)} empty="No overdue requests." />
        <RecordListCard title="Blocked" tone="red" items={ii.blockedDD.map(item)} empty="Nothing blocked." />
        <RecordListCard title="Awaiting approval before release" tone="amber" items={ii.awaitingApproval.map(item)} empty="Nothing awaiting approval." />
      </section>
      <section className="grid gap-4 lg:grid-cols-2">
        <Card className="min-w-0">
          <CardHeader><CardTitle>Open requests by category</CardTitle></CardHeader>
          <ul className="divide-y divide-border">
            {byCat.map((c) => (
              <li key={c.c} className="flex justify-between px-4 py-2 text-[13px]"><span>{humanize(c.c)}</span><span className="num text-xs text-muted-foreground">{c.open} open of {c.total}</span></li>
            ))}
          </ul>
        </Card>
        <Card className="min-w-0">
          <CardHeader><div><CardTitle>Repeated questions</CardTitle><p className="mt-0.5 text-xs text-muted-foreground">Asked by two or more investors. Answer once, share with all.</p></div></CardHeader>
          {ii.repeated.length ? (
            <ul className="divide-y divide-border">
              {ii.repeated.map((g) => (
                <li key={g.topic} className="px-4 py-2 text-[13px]">
                  <span className="font-medium capitalize">{g.topic}</span><span className="text-xs text-muted-foreground"> · {g.investors} investors</span>
                  <div className="mt-0.5 flex flex-wrap gap-x-3 text-xs">
                    {g.rows.map((r) => <Link key={r.id} href={`/records/due_diligence_requests/${r.id}`} className="text-navy hover:underline underline-offset-2">{inv(r.investor_id)}</Link>)}
                  </div>
                </li>
              ))}
            </ul>
          ) : <p className="px-4 py-5 text-center text-xs text-muted-foreground">No repeated questions.</p>}
        </Card>
      </section>
      <section>
        <SectionTitle title="All requests" description="Sorted by deadline." />
        <EntityTable table="due_diligence_requests" rows={reqs} lookups={lookups} canWrite={write("due_diligence_requests")} filters={["status", "category"]} defaults={{ status: "open", priority: "medium", approval_status: "pending" }} />
      </section>
    </div>
  );
}
