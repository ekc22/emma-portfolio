"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { runRoutine } from "@/lib/actions/operations";
import type { Lookups, Row } from "@/lib/types";
import { cn, daysFromToday, formatDate, humanizeCadence } from "@/lib/utils";

export function RoutineList({ routines, lookups, canWrite, today }: { routines: Row[]; lookups: Lookups; canWrite: boolean; today: string }) {
  const sorted = [...routines].sort((a, b) => Number(b.active !== false) - Number(a.active !== false) || String(a.next_due).localeCompare(String(b.next_due)));
  return (
    <ul className="divide-y divide-linen-deep border-t border-oxblood">
      {sorted.map((r) => <RoutineRow key={r.id} r={r} lookups={lookups} canWrite={canWrite} today={today} />)}
      {!sorted.length && <li className="py-6 text-center text-xs text-muted-foreground">No routines yet. Add the recurring work your team does every week, month or quarter.</li>}
    </ul>
  );
}

function RoutineRow({ r, lookups, canWrite, today }: { r: Row; lookups: Lookups; canWrite: boolean; today: string }) {
  const router = useRouter();
  const [pending, start] = React.useTransition();
  const [msg, setMsg] = React.useState<string | null>(null);
  const d = daysFromToday(r.next_due, today);
  const steps = String(r.checklist ?? "").split("\n").filter((l) => l.trim()).length;
  const run = () => start(async () => {
    const res = await runRoutine(r.id);
    setMsg(res.ok ? `${res.created} actions created for ${lookups.users?.[r.owner_id] ?? "the owner"}.` : res.error);
    if (res.ok) router.refresh();
  });
  return (
    <li className={cn("grid grid-cols-1 gap-2 py-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center", r.active === false && "opacity-60")}>
      <div className="min-w-0">
        <div className="flex flex-wrap items-baseline gap-2">
          <Link href={`/records/routines/${r.id}`} className="font-serif text-[19px] leading-tight hover:text-cherry">{r.title}</Link>
          <span className="label">{humanizeCadence(r.cadence)}</span>
          {r.active === false && <span className="label">Paused</span>}
        </div>
        <div className="mt-0.5 text-2xs text-muted-foreground">
          {lookups.users?.[r.owner_id] ?? "No owner"} · next due <span className={cn("num", d !== null && d < 0 && "font-medium text-rag-red")}>{formatDate(r.next_due, { day: "numeric", month: "short" })}</span>
          {steps ? ` · ${steps} steps` : ""}{r.last_run ? ` · last run ${formatDate(r.last_run, { day: "numeric", month: "short" })}` : ""}
        </div>
        {msg && <p role="status" className="mt-1 text-2xs text-sage-deep">{msg}</p>}
      </div>
      {canWrite && r.active !== false && <Button size="sm" variant="secondary" onClick={run} disabled={pending}><Play /> {pending ? "Creating…" : "Create actions"}</Button>}
    </li>
  );
}
