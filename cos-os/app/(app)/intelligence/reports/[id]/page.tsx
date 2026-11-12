import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireSession } from "@/lib/auth/session";
import { canWrite } from "@/lib/auth/permissions";
import { getStore } from "@/lib/data";
import { humanize } from "@/lib/schema";
import { formatDateTime } from "@/lib/utils";
import { PageHeader } from "@/components/app/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/app/status";
import { DataTag } from "@/components/app/provenance";
import { ReportEditor } from "@/components/reports/report-editor";

export default async function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await requireSession();
  const store = await getStore(session);
  const r = await store.get("reports", id);
  if (!r) notFound();
  const sources = Array.isArray(r.sources) ? (r.sources as { table: string; id: string; label?: string }[]) : [];
  const canEdit = canWrite("reports", session.role);
  const canApprove = canEdit && ["owner", "admin", "executive"].includes(session.role);
  return (
    <div>
      <Link href="/intelligence" className="mb-3 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"><ArrowLeft className="size-3" /> Intelligence & Reporting</Link>
      <PageHeader number={humanize(r.report_type)} title={r.title} description={r.period ? `Period: ${r.period}` : undefined} />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
        <Card className={r.ai_generated ? "border-dashed border-ai-border" : undefined}>
          <CardContent className="py-5">
            {r.ai_generated && r.status !== "approved" && (
              <p className="mb-4 rounded-md bg-ai-soft px-3 py-2 text-xs text-ai">Drafted by AI from workspace records. Check figures and claims against the linked records before approving. Nothing here is verified until a person approves it.</p>
            )}
            <ReportEditor id={r.id} body={String(r.body ?? "")} status={r.status} canEdit={canEdit} canApprove={canApprove} />
          </CardContent>
        </Card>
        <aside className="flex flex-col gap-6">
          <Card>
            <CardHeader><CardTitle>Status</CardTitle><StatusBadge value={r.status} /></CardHeader>
            <CardContent className="space-y-1.5 text-xs">
              <div>{r.ai_generated ? <DataTag kind="ai" /> : <DataTag kind="verified" />}</div>
              <div className="text-muted-foreground">Created {formatDateTime(r.created_at)}</div>
              {r.edited_by && <div className="text-muted-foreground">Last edited by {r.edited_by}</div>}
              {r.status === "approved" && <div>Approved by {r.approved_by} · {formatDateTime(r.approved_at)}</div>}
              {!canApprove && <div className="text-muted-foreground">Owners, admins and executives can approve.</div>}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Sources</CardTitle><span className="num text-xs text-muted-foreground">{sources.length}</span></CardHeader>
            {sources.length ? (
              <ul className="divide-y divide-border">
                {sources.map((s) => (
                  <li key={s.id} className="px-4 py-2 text-xs">
                    <Link className="text-navy hover:underline" href={`/records/${s.table}/${s.id}`}>{s.label || s.table}</Link>
                    <span className="text-muted-foreground"> · {s.table.replace(/_/g, " ")}</span>
                  </li>
                ))}
              </ul>
            ) : <CardContent className="text-xs text-muted-foreground">No linked records.</CardContent>}
          </Card>
        </aside>
      </div>
    </div>
  );
}
