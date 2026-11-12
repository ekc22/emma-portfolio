"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NativeSelect, Input } from "@/components/ui/input";
import { approveProposal, rejectProposal } from "@/lib/actions/recommendations";
import { ENTITIES, isTable } from "@/lib/schema";
import type { Lookups, Row } from "@/lib/types";
import { formatDateTime } from "@/lib/utils";
import { FieldValue } from "@/components/app/field-value";

/**
 * Pending AI proposals. Nothing the AI suggests reaches the business records
 * until a person approves it here; owner and due date can be corrected first.
 */
export function ProposalQueue({ proposals, lookups, canDecide, empty = "No proposals waiting." }: { proposals: Row[]; lookups: Lookups; canDecide: boolean; empty?: string }) {
  if (!proposals.length) return <p className="py-6 text-center text-[13px] text-muted-foreground">{empty}</p>;
  return (
    <ul className="flex flex-col gap-3">
      {proposals.map((p) => <ProposalCard key={p.id} p={p} lookups={lookups} canDecide={canDecide} />)}
    </ul>
  );
}

function ProposalCard({ p, lookups, canDecide }: { p: Row; lookups: Lookups; canDecide: boolean }) {
  const router = useRouter();
  const [pending, start] = React.useTransition();
  const [error, setError] = React.useState<string | null>(null);
  const table = isTable(p.target_table) ? p.target_table : null;
  const def = table ? ENTITIES[table] : null;
  const payload = (p.payload ?? {}) as Record<string, unknown>;
  const editable = def?.fields.filter((f) => (f.key === "owner_id" || f.key === "due_date") && (f.key in payload || p.action === "create")) ?? [];
  const [edits, setEdits] = React.useState<Record<string, string>>({});

  const decide = (approve: boolean) =>
    start(async () => {
      setError(null);
      const res = approve ? await approveProposal(p.id, Object.fromEntries(Object.entries(edits).filter(([, v]) => v !== undefined))) : await rejectProposal(p.id);
      if (!res.ok) setError(res.error);
      else router.refresh();
    });

  return (
    <li className="rounded-lg border border-dashed border-ai-border bg-ai-soft/40 p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge variant="ai"><Sparkles className="size-3" /> AI proposal</Badge>
            <Badge variant="muted">{p.action === "update" ? "Update" : "Create"} {def?.label.toLowerCase() ?? p.target_table}</Badge>
            <Badge variant={p.confidence === "high" ? "sage" : p.confidence === "low" ? "amber" : "stone"}>{p.confidence} confidence</Badge>
          </div>
          <p className="mt-1.5 text-[13px] font-medium leading-snug">{p.title}</p>
          {p.rationale && <p className="mt-0.5 text-xs text-muted-foreground">{p.rationale}</p>}
        </div>
        <span className="shrink-0 text-2xs text-muted-foreground" suppressHydrationWarning>{formatDateTime(p.created_at)}</span>
      </div>

      {def && (
        <dl className="mt-2 grid grid-cols-1 gap-x-4 gap-y-1 rounded-md bg-surface px-3 py-2 text-xs sm:grid-cols-2">
          {p.action === "update" && p.target_id && (
            <div className="sm:col-span-2"><dt className="inline text-muted-foreground">Record: </dt><dd className="inline"><Link className="text-navy underline-offset-2 hover:underline" href={`/records/${table}/${p.target_id}`}>{lookups[table!]?.[p.target_id] ?? "Open record"}</Link></dd></div>
          )}
          {def.fields.filter((f) => f.key in payload && payload[f.key] !== null && payload[f.key] !== "" && !editable.includes(f)).map((f) => (
            <div key={f.key} className={f.type === "textarea" ? "sm:col-span-2" : ""}>
              <dt className="inline text-muted-foreground">{f.label}: </dt>
              <dd className="inline"><FieldValue field={f} value={payload[f.key]} lookups={lookups} /></dd>
            </div>
          ))}
        </dl>
      )}

      {canDecide && editable.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {editable.map((f) => f.type === "relation" ? (
            <label key={f.key} className="flex items-center gap-1.5 text-xs">
              <span className="text-muted-foreground">{f.label}</span>
              <NativeSelect className="h-7 w-44" value={edits[f.key] ?? String(payload[f.key] ?? "")} onChange={(e) => setEdits((s) => ({ ...s, [f.key]: e.target.value }))}>
                <option value="">Unassigned</option>
                {Object.entries(lookups.users ?? {}).sort((a, b) => a[1].localeCompare(b[1])).map(([id, n]) => <option key={id} value={id}>{n}</option>)}
              </NativeSelect>
            </label>
          ) : (
            <label key={f.key} className="flex items-center gap-1.5 text-xs">
              <span className="text-muted-foreground">{f.label}</span>
              <Input type="date" className="h-7 w-36" value={edits[f.key] ?? String(payload[f.key] ?? "")} onChange={(e) => setEdits((s) => ({ ...s, [f.key]: e.target.value }))} />
            </label>
          ))}
        </div>
      )}

      {Array.isArray(p.source_refs) && p.source_refs.length > 0 && (
        <div className="mt-2 text-2xs text-muted-foreground">
          Evidence:{" "}
          {p.source_refs.map((r: { table: string; id: string; label?: string }, i: number) => (
            <span key={r.id}>{i > 0 && ", "}<Link className="text-navy underline-offset-2 hover:underline" href={`/records/${r.table}/${r.id}`}>{r.label || lookups[r.table as keyof Lookups]?.[r.id] || r.table.replace(/_/g, " ")}</Link></span>
          ))}
        </div>
      )}

      <div className="mt-3 flex items-center justify-end gap-2">
        {error && <span role="alert" className="mr-auto text-xs text-rag-red">{error}</span>}
        {canDecide ? (
          <>
            <Button size="sm" variant="ghost" onClick={() => decide(false)} disabled={pending}><X /> Reject</Button>
            <Button size="sm" onClick={() => decide(true)} disabled={pending}><Check /> {pending ? "Applying…" : "Approve and apply"}</Button>
          </>
        ) : (
          <span className="text-2xs text-muted-foreground">Your role cannot approve proposals.</span>
        )}
      </div>
    </li>
  );
}
