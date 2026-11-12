import Link from "next/link";
import { loadPage } from "@/lib/page";
import { isClaudeConfigured } from "@/lib/env";
import { computeSignals } from "@/lib/analytics";
import { REPORT_TYPE, humanize } from "@/lib/schema";
import { formatDateTime } from "@/lib/utils";
import { PageHeader, SectionTitle } from "@/components/app/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/app/status";
import { SignalList } from "@/components/app/signal-list";
import { DataTag } from "@/components/app/provenance";
import { GenerateReportButton } from "@/components/app/generate-report-button";
import { ViewTabs } from "@/components/ui/view-tabs";

export const metadata = { title: "Intelligence & Reporting" };

const TABLES = ["strategic_objectives", "kpis", "projects", "milestones", "tasks", "dependencies", "risks", "decisions", "commercial_opportunities", "investors", "fundraising_rounds", "fundraising_opportunities", "investor_commitments", "capital_receipts", "due_diligence_requests", "investor_interactions", "financial_snapshots", "users", "reports", "ai_recommendations"] as const;
const INVESTOR_ONLY = new Set(["ir_briefing"]);

export default async function IntelligencePage() {
  const { data: d, write, investors } = await loadPage(TABLES);
  const signals = computeSignals({ ...d, objectives: d.strategic_objectives }, investors);
  const reports = [...d.reports].sort((a, b) => String(b.created_at).localeCompare(String(a.created_at)));
  const types = REPORT_TYPE.filter((t) => investors || !INVESTOR_ONLY.has(t));
  const ai = isClaudeConfigured() && write("reports");
  const areas = ["delivery", "commercial", "investors", "capital", "strategy", "decisions"] as const;
  const decided = d.ai_recommendations.filter((r) => r.status !== "pending").sort((a, b) => String(b.decided_at).localeCompare(String(a.decided_at))).slice(0, 15);

  return (
    <div>
      <PageHeader
        number="07"
        title="Intelligence & Reporting"
        description="Reports drafted from structured workspace data, with sources, review and approval. Missing data is flagged, never filled in."
        actions={ai ? <GenerateReportButton types={types} /> : undefined}
      />
      {!isClaudeConfigured() && <p className="mb-6 rounded-md border border-border bg-surface px-4 py-3 text-xs text-muted-foreground">AI drafting is off: add ANTHROPIC_API_KEY to enable it. You can still write, edit and approve reports by hand.</p>}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <section className="min-w-0">
          <SectionTitle title="Reports" description="Drafts stay unapproved until a person approves them." />
          <Card>
            <ul className="divide-y divide-border">
              {reports.map((r) => (
                <li key={r.id} className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <Link href={`/intelligence/reports/${r.id}`} className="text-[13px] font-medium hover:underline underline-offset-2">{r.title}</Link>
                    <div className="mt-0.5 flex flex-wrap items-center gap-2 text-2xs text-muted-foreground">
                      <span>{humanize(r.report_type)}</span><span>·</span><span>{formatDateTime(r.created_at)}</span>
                      {r.ai_generated ? <DataTag kind="ai" /> : <DataTag kind="verified" />}
                    </div>
                  </div>
                  <StatusBadge value={r.status} />
                </li>
              ))}
              {!reports.length && <li className="px-4 py-10 text-center text-[13px] text-muted-foreground">No reports yet.</li>}
            </ul>
          </Card>

          <div className="mt-8">
            <SectionTitle title="Report library" description="Each draft is built from the records listed in its sources." />
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {types.map((t) => (
                <Card key={t} className="flex flex-col justify-between gap-3 p-4">
                  <div>
                    <div className="text-[13px] font-medium">{humanize(t)}</div>
                    <div className="mt-0.5 text-2xs text-muted-foreground">{reports.filter((r) => r.report_type === t).length} saved</div>
                  </div>
                  {ai && <GenerateReportButton defaultType={t} types={[t]} label="Draft" />}
                </Card>
              ))}
            </div>
          </div>
        </section>

        <aside className="flex min-w-0 flex-col gap-6">
          <Card>
            <CardHeader><div><CardTitle>Signals</CardTitle><p className="text-xs text-muted-foreground">Calculated from records</p></div><DataTag kind="calculated" /></CardHeader>
            <CardContent className="py-1">
              <ViewTabs panels={[{ id: "all", label: `All (${signals.length})`, content: <SignalList signals={signals} /> }, ...areas.filter((a) => signals.some((s) => s.area === a)).map((a) => ({ id: a, label: humanize(a), content: <SignalList signals={signals.filter((s) => s.area === a)} /> }))]} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Recent AI proposal decisions</CardTitle><Link href="/agent" className="text-xs text-muted-foreground hover:text-foreground">Queue →</Link></CardHeader>
            {decided.length ? (
              <ul className="divide-y divide-border">
                {decided.map((r) => (
                  <li key={r.id} className="px-4 py-2 text-xs">
                    <div className="flex items-start justify-between gap-2"><span>{r.title}</span><Badge variant={r.status === "applied" ? "green" : "muted"}>{r.status}</Badge></div>
                    <div className="text-2xs text-muted-foreground">{r.decided_by} · {formatDateTime(r.decided_at)}</div>
                  </li>
                ))}
              </ul>
            ) : <CardContent className="text-xs text-muted-foreground">No proposals decided yet.</CardContent>}
          </Card>
        </aside>
      </div>
    </div>
  );
}
