import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireSession } from "@/lib/auth/session";
import { canRead, canWrite } from "@/lib/auth/permissions";
import { getStore, loadLookups } from "@/lib/data";
import { ENTITIES, TABLES, entity, isTable, type TableName } from "@/lib/schema";
import { PageHeader } from "@/components/app/page-header";
import { FieldValue } from "@/components/app/field-value";
import { EditRecordButton } from "@/components/app/edit-record-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Markdown } from "@/components/app/markdown";
import { DataTag } from "@/components/app/provenance";
import { formatDateTime } from "@/lib/utils";
import type { Row } from "@/lib/types";

export default async function RecordPage({ params }: { params: Promise<{ table: string; id: string }> }) {
  const { table, id } = await params;
  if (!isTable(table)) notFound();
  const session = await requireSession();
  if (!canRead(table, session.role)) {
    return <PageHeader title="Restricted record" description="Your role does not have access to this type of record. Ask a workspace admin if you need it." />;
  }
  const store = await getStore(session);
  const row = await store.get(table, id);
  if (!row) notFound();
  const def = entity(table);

  // Records in other tables that point at this one.
  const related: { table: TableName; field: string; rows: Row[] }[] = [];
  await Promise.all(
    TABLES.filter((t) => t !== "audit_logs" && canRead(t, session.role)).flatMap((t) =>
      ENTITIES[t].fields
        .filter((f) => f.type === "relation" && f.relation === table)
        .map(async (f) => {
          const rows = await store.list(t, { where: { [f.key]: id } });
          if (rows.length) related.push({ table: t, field: f.label, rows });
        }),
    ),
  );
  related.sort((a, b) => a.table.localeCompare(b.table));

  const history = canRead("audit_logs", session.role) ? await store.list("audit_logs", { where: { record_id: id }, limit: 30 }) : [];
  const lookups = await loadLookups(session, [table]);
  const writable = canWrite(table, session.role) && table !== "audit_logs";
  const isReport = table === "reports";

  return (
    <div>
      <Link href="/" className="mb-3 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"><ArrowLeft className="size-3" /> Command Centre</Link>
      <PageHeader
        number={def.label}
        title={String(row[def.titleField] ?? def.label)}
        description={def.description}
        actions={<EditRecordButton table={table} row={row} lookups={lookups} canWrite={writable} />}
      />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Card>
            <CardHeader><CardTitle>Details</CardTitle>{row.ai_generated ? <DataTag kind="ai" /> : <DataTag kind="verified" />}</CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
                {def.fields.filter((f) => !(isReport && f.key === "body")).map((f) => (
                  <div key={f.key} className={f.type === "textarea" ? "sm:col-span-2" : ""}>
                    <dt className="eyebrow mb-0.5">{f.label}</dt>
                    <dd className="text-[13px]">{f.type === "textarea" && row[f.key] ? <span className="whitespace-pre-line">{String(row[f.key])}</span> : <FieldValue field={f} value={row[f.key]} lookups={lookups} row={row} compact={false} />}</dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>
          {isReport && row.body && (
            <Card><CardHeader><CardTitle>Report</CardTitle></CardHeader><CardContent><Markdown text={String(row.body)} /></CardContent></Card>
          )}
          {related.map((r) => (
            <Card key={r.table + r.field}>
              <CardHeader><CardTitle>{ENTITIES[r.table].plural}</CardTitle><span className="text-2xs text-muted-foreground">via {r.field.toLowerCase()} · {r.rows.length}</span></CardHeader>
              <ul className="divide-y divide-border">
                {r.rows.slice(0, 20).map((x) => (
                  <li key={x.id} className="flex items-center justify-between gap-3 px-4 py-2 text-[13px]">
                    <Link href={`/records/${r.table}/${x.id}`} className="truncate hover:underline underline-offset-2">{String(x[ENTITIES[r.table].titleField] ?? "Untitled")}</Link>
                    <span className="shrink-0 text-xs text-muted-foreground">{x.status ?? x.stage ?? ""}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
        <aside className="flex flex-col gap-6">
          <Card>
            <CardHeader><CardTitle>Record</CardTitle></CardHeader>
            <CardContent className="space-y-1 text-xs text-muted-foreground">
              <div>Created {formatDateTime(row.created_at)}</div>
              <div>Updated {formatDateTime(row.updated_at)}</div>
              <div className="break-all font-mono text-2xs">{row.id}</div>
            </CardContent>
          </Card>
          {history.length > 0 && (
            <Card>
              <CardHeader><CardTitle>History</CardTitle></CardHeader>
              <ol className="divide-y divide-border">
                {history.map((h) => (
                  <li key={h.id} className="px-4 py-2 text-xs">
                    <div>{h.summary}</div>
                    <div className="text-muted-foreground">{h.actor_name} · {h.actor_type === "ai" ? "AI proposal, approved" : h.actor_type} · {formatDateTime(h.created_at)}</div>
                  </li>
                ))}
              </ol>
            </Card>
          )}
        </aside>
      </div>
    </div>
  );
}
