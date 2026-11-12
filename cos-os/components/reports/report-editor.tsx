"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Check, Download, Pencil, Send, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { Markdown } from "@/components/app/markdown";
import { saveReportBody, setReportStatus } from "@/lib/actions/reports";

export function ReportEditor({ id, body, status, canEdit, canApprove }: { id: string; body: string; status: string; canEdit: boolean; canApprove: boolean }) {
  const router = useRouter();
  const [editing, setEditing] = React.useState(false);
  const [text, setText] = React.useState(body);
  const [error, setError] = React.useState<string | null>(null);
  const [pending, start] = React.useTransition();
  React.useEffect(() => setText(body), [body]);

  const run = (fn: () => Promise<{ ok: boolean; error?: string }>, after?: () => void) =>
    start(async () => {
      setError(null);
      const res = await fn();
      if (!res.ok) setError(res.error ?? "That did not work.");
      else { after?.(); router.refresh(); }
    });

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {canEdit && !editing && <Button variant="secondary" onClick={() => setEditing(true)}><Pencil /> Edit</Button>}
        {editing && (
          <>
            <Button onClick={() => run(() => saveReportBody(id, text), () => setEditing(false))} disabled={pending}>{pending ? "Saving…" : "Save"}</Button>
            <Button variant="ghost" onClick={() => { setText(body); setEditing(false); }}>Cancel</Button>
          </>
        )}
        {!editing && canEdit && status === "draft" && <Button variant="secondary" onClick={() => run(() => setReportStatus(id, "in_review"))} disabled={pending}><Send /> Submit for review</Button>}
        {!editing && canApprove && status !== "approved" && <Button onClick={() => run(() => setReportStatus(id, "approved"))} disabled={pending}><Check /> Approve</Button>}
        {!editing && canEdit && status !== "draft" && <Button variant="ghost" onClick={() => run(() => setReportStatus(id, "draft"))} disabled={pending}><Undo2 /> Back to draft</Button>}
        <a href={`/api/reports/${id}/export`} className="ml-auto inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-surface px-3 text-[13px] font-medium shadow-subtle hover:bg-muted"><Download className="size-3.5" /> Export Markdown</a>
        {error && <p role="alert" className="w-full text-xs text-rag-red">{error}</p>}
      </div>
      {editing ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="flex flex-col gap-1">
            <label htmlFor="report-body" className="eyebrow">Markdown</label>
            <Textarea id="report-body" value={text} onChange={(e) => setText(e.target.value)} rows={28} className="font-mono text-xs leading-5" />
          </div>
          <div className="min-w-0"><div className="eyebrow mb-1">Preview</div><div className="rounded-md border border-border bg-background/50 p-4"><Markdown text={text} /></div></div>
        </div>
      ) : (
        <Markdown text={body || "_This report is empty._"} />
      )}
    </div>
  );
}
