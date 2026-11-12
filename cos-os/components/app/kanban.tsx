"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { updateRecord } from "@/lib/actions/records";
import { entity, type TableName } from "@/lib/schema";
import type { Lookups, Row } from "@/lib/types";
import { cn, formatDate, formatMoney, sum, daysFromToday } from "@/lib/utils";
import { RecordForm } from "./record-form";

/**
 * Board view. Cards move between columns with the stage menu on each card
 * (keyboard and screen-reader friendly) or by drag and drop.
 */
export function Kanban({ table, rows, groupField, columns, lookups, canWrite, amountField, dateField, subtitleField, hideEmpty = false }: {
  table: TableName; rows: Row[]; groupField: string; columns: readonly string[]; lookups: Lookups; canWrite: boolean;
  amountField?: string; dateField?: string; subtitleField?: string; hideEmpty?: boolean;
}) {
  const router = useRouter();
  const def = entity(table);
  const [editing, setEditing] = React.useState<Row | null>(null);
  const [optimistic, setOptimistic] = React.useState<Record<string, string>>({});
  const [error, setError] = React.useState<string | null>(null);
  const [, start] = React.useTransition();
  const [dragOver, setDragOver] = React.useState<string | null>(null);
  const groupDef = def.fields.find((f) => f.key === groupField);
  const subtitleDef = def.fields.find((f) => f.key === subtitleField);

  const move = (r: Row, to: string) => {
    if (!canWrite || r[groupField] === to) return;
    setOptimistic((o) => ({ ...o, [r.id]: to }));
    start(async () => {
      const res = await updateRecord(table, r.id, { [groupField]: to });
      if (!res.ok) { setError(res.error); setOptimistic((o) => { const n = { ...o }; delete n[r.id]; return n; }); return; }
      router.refresh();
    });
  };

  const colOf = (r: Row) => optimistic[r.id] ?? r[groupField];
  const cols = columns.filter((c) => !hideEmpty || rows.some((r) => colOf(r) === c));

  return (
    <div>
      {error && <p role="alert" className="mb-2 text-xs text-rag-red">{error}</p>}
      <div className="relative flex gap-3 overflow-x-auto pb-3">
        {cols.map((c) => {
          const items = rows.filter((r) => colOf(r) === c);
          return (
            <section
              key={c}
              aria-label={c}
              onDragOver={(e) => { if (canWrite) { e.preventDefault(); setDragOver(c); } }}
              onDragLeave={() => setDragOver(null)}
              onDrop={(e) => { setDragOver(null); const id = e.dataTransfer.getData("text/plain"); const r = rows.find((x) => x.id === id); if (r) move(r, c); }}
              className={cn("flex w-64 shrink-0 flex-col rounded-lg border border-border bg-background/60", dragOver === c && "border-navy/40 bg-sage-soft/40")}
            >
              <header className="flex items-baseline justify-between gap-2 border-b border-border px-3 py-2">
                <h3 className="text-xs font-semibold">{c.replace(/_/g, " ")}</h3>
                <span className="num text-2xs text-muted-foreground">
                  {items.length}{amountField ? ` · ${formatMoney(sum(items.map((i) => i[amountField])))}` : ""}
                </span>
              </header>
              <ol className="flex min-h-[4rem] flex-col gap-2 p-2">
                {items.map((r) => {
                  const d = dateField ? daysFromToday(r[dateField]) : null;
                  return (
                    <li
                      key={r.id}
                      draggable={canWrite}
                      onDragStart={(e) => e.dataTransfer.setData("text/plain", r.id)}
                      className="group rounded-md border border-border bg-surface p-2.5 shadow-subtle"
                    >
                      <button onClick={() => setEditing(r)} className="block w-full text-left text-[13px] font-medium leading-snug hover:underline underline-offset-2">
                        {String(r[def.titleField])}
                      </button>
                      {subtitleDef && r[subtitleField!] && (
                        <div className="mt-0.5 truncate text-2xs text-muted-foreground">
                          {subtitleDef.type === "relation" ? lookups[subtitleDef.relation!]?.[r[subtitleField!]] : String(r[subtitleField!])}
                        </div>
                      )}
                      <div className="mt-2 flex items-center justify-between gap-2 text-2xs text-muted-foreground">
                        {amountField && <span className="num font-medium text-foreground">{formatMoney(r[amountField])}</span>}
                        {dateField && r[dateField] && <span className={cn("num", d !== null && d < 0 && "text-rag-red")}>{formatDate(r[dateField], { day: "numeric", month: "short" })}</span>}
                        <span className="truncate">{lookups.users?.[r.owner_id] ?? ""}</span>
                      </div>
                      {canWrite && groupDef?.options && (
                        <label className="mt-2 block">
                          <span className="sr-only">Move {String(r[def.titleField])} to</span>
                          <select value={colOf(r)} onChange={(e) => move(r, e.target.value)} className="h-6 w-full rounded border border-border bg-background px-1 text-2xs text-muted-foreground opacity-70 group-hover:opacity-100 focus:opacity-100">
                            {groupDef.options.map((o) => <option key={o} value={o}>{o.replace(/_/g, " ")}</option>)}
                          </select>
                        </label>
                      )}
                    </li>
                  );
                })}
              </ol>
            </section>
          );
        })}
      </div>
      <RecordForm table={table} row={editing} lookups={lookups} open={!!editing} onOpenChange={(o) => !o && setEditing(null)} canWrite={canWrite} />
    </div>
  );
}
