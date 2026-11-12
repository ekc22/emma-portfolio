"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { NativeSelect } from "@/components/ui/input";
import { StatusBadge } from "@/components/app/status";
import { convertRequest, setRequestStatus } from "@/lib/actions/operations";
import { humanize } from "@/lib/schema";
import type { Lookups, Row } from "@/lib/types";
import { cn, daysFromToday, formatDate } from "@/lib/utils";

/** Triage: assign an owner, turn the request into an action, or decline it. */
export function RequestQueue({ requests, lookups, canWrite, today }: { requests: Row[]; lookups: Lookups; canWrite: boolean; today: string }) {
  const rank = { critical: 0, high: 1, medium: 2, low: 3 } as Record<string, number>;
  const open = requests.filter((r) => r.status !== "done" && r.status !== "declined").sort((a, b) => (rank[a.priority] ?? 9) - (rank[b.priority] ?? 9) || String(a.needed_by ?? "9").localeCompare(String(b.needed_by ?? "9")));
  if (!open.length) return <p className="border-t border-oxblood py-6 text-center text-xs text-muted-foreground">No open requests.</p>;
  return <ul className="divide-y divide-linen-deep border-t border-oxblood">{open.map((r) => <RequestRow key={r.id} r={r} lookups={lookups} canWrite={canWrite} today={today} />)}</ul>;
}

function RequestRow({ r, lookups, canWrite, today }: { r: Row; lookups: Lookups; canWrite: boolean; today: string }) {
  const router = useRouter();
  const [owner, setOwner] = React.useState<string>(r.owner_id ?? "");
  const [error, setError] = React.useState<string | null>(null);
  const [pending, start] = React.useTransition();
  const d = daysFromToday(r.needed_by, today);
  const act = (fn: () => Promise<{ ok: boolean; error?: string }>) => start(async () => {
    setError(null);
    const res = await fn();
    if (!res.ok) setError(res.error ?? "That did not work."); else router.refresh();
  });
  return (
    <li className="grid grid-cols-1 gap-2 py-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <Link href={`/records/requests/${r.id}`} className="text-[14px] hover:text-cherry">{r.title}</Link>
          <StatusBadge value={r.priority} />
          <StatusBadge value={r.status} />
        </div>
        <div className="mt-0.5 text-2xs text-muted-foreground">
          {humanize(r.request_type)} · from {lookups.users?.[r.requested_by_id] ?? "unknown"}
          {r.needed_by && <> · needed by <span className={cn("num", d !== null && d < 0 && "font-medium text-rag-red")}>{formatDate(r.needed_by, { day: "numeric", month: "short" })}</span></>}
          {r.task_id && <> · <Link className="text-cherry hover:underline" href={`/records/tasks/${r.task_id}`}>action created</Link></>}
        </div>
        {error && <p role="alert" className="text-2xs text-rag-red">{error}</p>}
      </div>
      {canWrite && !r.task_id && (
        <div className="flex flex-wrap items-center gap-2">
          <label className="sr-only" htmlFor={`own-${r.id}`}>Owner for {r.title}</label>
          <NativeSelect id={`own-${r.id}`} className="h-8 w-40 text-xs" value={owner} onChange={(e) => setOwner(e.target.value)}>
            <option value="">Choose owner</option>
            {Object.entries(lookups.users ?? {}).sort((a, b) => a[1].localeCompare(b[1])).map(([id, n]) => <option key={id} value={id}>{n}</option>)}
          </NativeSelect>
          <Button size="sm" onClick={() => act(() => convertRequest(r.id, owner || undefined))} disabled={pending}>Make it an action</Button>
          {r.status === "new" && <Button size="sm" variant="ghost" onClick={() => act(() => setRequestStatus(r.id, "triaged"))} disabled={pending}>Triaged</Button>}
          <Button size="sm" variant="ghost" onClick={() => act(() => setRequestStatus(r.id, "declined"))} disabled={pending}>Decline</Button>
        </div>
      )}
    </li>
  );
}
