import Link from "next/link";
import { loadPage } from "@/lib/page";
import { humanize } from "@/lib/schema";
import { formatDateTime } from "@/lib/utils";
import { SectionTitle } from "@/components/app/page-header";
import { GenerateReportButton } from "@/components/app/generate-report-button";
import { StatusBadge } from "@/components/app/status";
import { DataTag } from "@/components/app/provenance";
import { Card } from "@/components/ui/card";

export const metadata = { title: "Board & investor reporting" };

const TYPES = ["investor_update", "board_pack", "ir_briefing"] as const;

export default async function InvestorReportingPage() {
  const { data } = await loadPage(["reports"] as const);
  const reports = data.reports.filter((r) => (TYPES as readonly string[]).includes(r.report_type));
  return (
    <div className="flex flex-col gap-4">
      <SectionTitle
        title="Board and investor reporting"
        description="Monthly investor updates, board packs and IR briefings. AI drafts cite the records they draw on and stay drafts until a person approves them."
        actions={<GenerateReportButton defaultType="investor_update" types={["investor_update", "board_pack", "ir_briefing"]} />}
      />
      <Card>
        {reports.length ? (
          <ul className="divide-y divide-border">
            {reports.map((r) => (
              <li key={r.id} className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <Link href={`/intelligence/reports/${r.id}`} className="block truncate text-[13px] font-medium hover:underline underline-offset-2">{r.title}</Link>
                  <div className="text-xs text-muted-foreground">{humanize(r.report_type)}{r.period ? ` · ${r.period}` : ""} · {formatDateTime(r.created_at)}</div>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  {r.ai_generated ? <DataTag kind="ai" /> : <DataTag kind="verified" />}
                  <StatusBadge value={r.status} />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="px-4 py-10 text-center text-[13px] text-muted-foreground">No investor or board reports yet. Draft one with AI, or write one under Intelligence & Reporting.</p>
        )}
      </Card>
    </div>
  );
}
