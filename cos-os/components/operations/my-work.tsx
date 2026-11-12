"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogBody, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label, Textarea } from "@/components/ui/input";
import { StatusBadge } from "@/components/app/status";
import { completeTask } from "@/lib/actions/operations";
import { updateRecord } from "@/lib/actions/records";
import type { Lookups, Row } from "@/lib/types";
import { cn, daysFromToday, formatDate, relativeDays } from "@/lib/utils";

type Group = { id: string; title: string; hint: string; rows: Row[] };

/** A person's own actions, grouped by urgency, with one-step status changes. */
export function MyWork({ tasks, lookups, canWrite, today }: { tasks: Row[]; lookups: Lookups; canWrite: boolean; today: string }) {
  const open = tasks.filter((t) => t.status !== "done");
  const d = (t: Row) => daysFromToday(t.due_date, today);
  const groups: Group[] = [
    { id: "overdue", title: "Overdue", hint: "Past their due date", rows: open.filter((t) => (d(t) ?? 1) < 0 && t.status !== "blocked") },
    { id: "blocked", title: "Blocked", hint: "Waiting on someone or something", rows: open.filter((t) => t.status === "blocked") },
    { id: "week", title: "This week", hint: "Due in the next 7 days", rows: open.filter((t) => { const x = d(t); return x !== null && x >= 0 && x <= 7 && t.status !== "blocked"; }) },
    { id: "later", title: "Later", hint: "Due after this week, or undated", rows: open.filter((t) => { const x = d(t); return (x === null || x > 7) && t.status !== "blocked"; }) },
  ];
  const done = tasks.filter((t) => t.status === "done").sort((a, b) => String(b.updated_at).localeCompare(String(a.updated_at))).slice(0, 5);
  const [completing, setCompleting] = React.useState<Row | null>(null);

  return (
    <div className="flex flex-col gap-8">
      {groups.map((g) => (
        <section key={g.id} aria-labelledby={`g-${g.id}`}>
          <div className="mb-2 flex items-baseline justify-between border-b border-oxblood pb-1.5">
            <h3 id={`g-${g.id}`} className={cn("font-serif text-[22px]", g.id === "overdue" && g.rows.length && "text-rag-red")}>{g.title} <span className="num font-sans text-xs text-muted-foreground">{g.rows.length}</span></h3>
            <span className="text-2xs text-muted-foreground">{g.hint}</span>
          </div>
          {g.rows.length ? (
            <ul className="divide-y divide-linen-deep">
              {g.rows.map((t) => <TaskRow key={t.id} t={t} lookups={lookups} canWrite={canWrite} today={today} onDone={() => setCompleting(t)} />)}
            </ul>
          ) : <p className="py-3 text-xs text-muted-foreground">Nothing here.</p>}
        </section>
      ))}
      {done.length > 0 && (
        <section>
          <div className="mb-2 border-b border-linen-deep pb-1.5"><h3 className="font-serif text-[18px] text-muted-foreground">Recently done</h3></div>
          <ul className="divide-y divide-linen-deep">
            {done.map((t) => (
              <li key={t.id} className="flex items-start justify-between gap-3 py-2 text-[13px]">
                <Link href={`/records/tasks/${t.id}`} className="text-muted-foreground line-through decoration-linen-deep hover:text-oxblood">{t.title}</Link>
                <span className="max-w-[45%] truncate text-2xs text-muted-foreground" title={t.evidence ?? ""}>{t.evidence ? `Evidence: ${t.evidence}` : <span className="text-rag-amber">No evidence recorded</span>}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
      <CompleteDialog task={completing} onClose={() => setCompleting(null)} />
    </div>
  );
}

function TaskRow({ t, lookups, canWrite, today, onDone }: { t: Row; lookups: Lookups; canWrite: boolean; today: string; onDone: () => void }) {
  const router = useRouter();
  const [pending, start] = React.useTransition();
  const [error, setError] = React.useState<string | null>(null);
  const d = daysFromToday(t.due_date, today);
  const setStatus = (status: string) => start(async () => {
    const res = await updateRecord("tasks", t.id, { status });
    if (!res.ok) setError(res.error); else router.refresh();
  });
  const context = [t.project_id && lookups.projects?.[t.project_id], t.routine_id && `Routine: ${lookups.routines?.[t.routine_id] ?? ""}`, t.request_id && "From a request"].filter(Boolean).join(" · ");
  return (
    <li className="grid grid-cols-1 gap-2 py-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <Link href={`/records/tasks/${t.id}`} className="text-[14px] leading-snug hover:text-cherry">{t.title}</Link>
          {t.priority === "critical" && <StatusBadge value="critical" />}
          {t.escalated && <span className="label !text-rag-red">Escalated</span>}
        </div>
        <div className="mt-0.5 text-2xs text-muted-foreground">
          {t.due_date ? <span className={cn("num", d !== null && d < 0 && "font-medium text-rag-red")}>{formatDate(t.due_date, { day: "numeric", month: "short" })} ({relativeDays(t.due_date)})</span> : "No due date"}
          {t.estimate_hours ? ` · ${t.estimate_hours}h` : ""}{context ? ` · ${context}` : ""}
        </div>
        {error && <p role="alert" className="text-2xs text-rag-red">{error}</p>}
      </div>
      {canWrite && (
        <div className="flex items-center gap-2">
          <label className="sr-only" htmlFor={`st-${t.id}`}>Status of {t.title}</label>
          <select id={`st-${t.id}`} value={t.status} disabled={pending} onChange={(e) => setStatus(e.target.value)} className="h-8 border border-input bg-surface px-2 font-sans text-xs">
            <option value="todo">To do</option>
            <option value="in_progress">In progress</option>
            <option value="blocked">Blocked</option>
          </select>
          <Button size="sm" variant="secondary" onClick={onDone} disabled={pending}><Check /> Done</Button>
        </div>
      )}
    </li>
  );
}

function CompleteDialog({ task, onClose }: { task: Row | null; onClose: () => void }) {
  const router = useRouter();
  const [evidence, setEvidence] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [pending, start] = React.useTransition();
  React.useEffect(() => { setEvidence(""); setError(null); }, [task?.id]);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!task) return;
    start(async () => {
      const res = await completeTask(task.id, evidence);
      if (!res.ok) { setError(res.error); return; }
      onClose();
      router.refresh();
    });
  };
  return (
    <Dialog open={!!task} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
          <DialogHeader>
            <DialogTitle>Mark as done</DialogTitle>
            <DialogDescription>{task?.title}</DialogDescription>
          </DialogHeader>
          <DialogBody className="flex flex-col gap-1.5">
            <Label htmlFor="evidence">What shows it&apos;s done?</Label>
            <Textarea id="evidence" rows={3} value={evidence} onChange={(e) => setEvidence(e.target.value)} placeholder="A link, a document, or who confirmed it" autoFocus />
            <p className="text-2xs text-muted-foreground">Recorded on the action and in the audit log, so progress reports rest on evidence.</p>
            {error && <p role="alert" className="text-xs text-rag-red">{error}</p>}
          </DialogBody>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={pending}>{pending ? "Saving…" : "Mark as done"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
