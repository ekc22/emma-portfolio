"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowUpRight, ChevronDown, ChevronUp, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, NativeSelect } from "@/components/ui/input";
import { Table, TBody, TD, TH, THead, TR } from "@/components/ui/table";
import { entity, humanize, type TableName } from "@/lib/schema";
import type { Lookups, Row } from "@/lib/types";
import { FieldValue } from "./field-value";
import { RecordForm } from "./record-form";

export interface EntityTableProps {
  table: TableName;
  rows: Row[];
  lookups: Lookups;
  canWrite: boolean;
  columns?: string[];
  filters?: string[];
  defaults?: Record<string, unknown>;
  hideFields?: string[];
  emptyText?: string;
  toolbar?: React.ReactNode;
  pageSize?: number;
  newLabel?: string;
}

/** Searchable, filterable, sortable table with create, edit and delete. */
export function EntityTable({ table, rows, lookups, canWrite, columns, filters, defaults, hideFields, emptyText, toolbar, pageSize = 50, newLabel }: EntityTableProps) {
  const def = entity(table);
  const cols = (columns ?? def.fields.filter((f) => f.list).map((f) => f.key)).map((k) => def.fields.find((f) => f.key === k)!).filter(Boolean);
  const filterFields = (filters ?? def.fields.filter((f) => f.list && f.type === "select").slice(0, 2).map((f) => f.key)).map((k) => def.fields.find((f) => f.key === k)!).filter(Boolean);

  const [q, setQ] = React.useState("");
  const [f, setF] = React.useState<Record<string, string>>({});
  const [sort, setSort] = React.useState<[string, "asc" | "desc"] | null>(null);
  const [editing, setEditing] = React.useState<Row | null>(null);
  const [creating, setCreating] = React.useState(false);
  const [limit, setLimit] = React.useState(pageSize);

  const textOf = React.useCallback((r: Row) => {
    const parts = def.search.map((k) => String(r[k] ?? ""));
    for (const fd of def.fields) if (fd.type === "relation" && r[fd.key]) parts.push(lookups[fd.relation!]?.[r[fd.key]] ?? "");
    return parts.join(" ").toLowerCase();
  }, [def, lookups]);

  const shown = React.useMemo(() => {
    let out = rows;
    for (const [k, v] of Object.entries(f)) if (v) out = out.filter((r) => String(r[k] ?? "") === v);
    if (q.trim()) out = out.filter((r) => textOf(r).includes(q.trim().toLowerCase()));
    if (sort) {
      const [k, dir] = sort;
      const fd = def.fields.find((x) => x.key === k);
      const val = (r: Row) => (fd?.type === "relation" ? lookups[fd.relation!]?.[r[k]] ?? "" : r[k]);
      out = [...out].sort((a, b) => {
        const x = val(a), y = val(b);
        if (x === y) return 0;
        if (x === null || x === undefined || x === "") return 1;
        if (y === null || y === undefined || y === "") return -1;
        const c = typeof x === "number" && typeof y === "number" ? x - y : fd?.options ? fd.options.indexOf(x) - fd.options.indexOf(y) : String(x).localeCompare(String(y));
        return dir === "asc" ? c : -c;
      });
    }
    return out;
  }, [rows, f, q, sort, textOf, def, lookups]);

  const toggleSort = (k: string) => setSort((s) => (s?.[0] === k ? (s[1] === "asc" ? [k, "desc"] : null) : [k, "asc"]));

  return (
    <div className="rounded-lg border border-border bg-surface shadow-subtle">
      <div className="flex flex-wrap items-center gap-2 border-b border-border px-3 py-2">
        <div className="relative min-w-[12rem] flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <Input aria-label={`Search ${def.plural.toLowerCase()}`} placeholder={`Search ${def.plural.toLowerCase()}`} value={q} onChange={(e) => setQ(e.target.value)} className="pl-8" />
        </div>
        {filterFields.map((fd) => (
          <NativeSelect key={fd.key} aria-label={`Filter by ${fd.label}`} className="w-auto min-w-[8rem]" value={f[fd.key] ?? ""} onChange={(e) => setF((s) => ({ ...s, [fd.key]: e.target.value }))}>
            <option value="">All {fd.label.toLowerCase()}</option>
            {fd.options?.map((o) => <option key={o} value={o}>{humanize(o)}</option>)}
          </NativeSelect>
        ))}
        {toolbar}
        <span className="ml-auto text-xs text-muted-foreground num">{shown.length} of {rows.length}</span>
        {canWrite && <Button size="sm" onClick={() => setCreating(true)}><Plus /> {newLabel ?? `New ${def.label.toLowerCase()}`}</Button>}
      </div>
      <Table>
        <THead>
          <tr>
            {cols.map((c) => (
              <TH key={c.key} aria-sort={sort?.[0] === c.key ? (sort[1] === "asc" ? "ascending" : "descending") : "none"}>
                <button className="inline-flex items-center gap-1 uppercase hover:text-foreground" onClick={() => toggleSort(c.key)}>
                  {c.label}
                  {sort?.[0] === c.key && (sort[1] === "asc" ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />)}
                </button>
              </TH>
            ))}
            <TH className="w-8"><span className="sr-only">Open</span></TH>
          </tr>
        </THead>
        <TBody>
          {shown.slice(0, limit).map((r) => (
            <TR key={r.id} className="cursor-pointer" onClick={(e) => { if (!(e.target as HTMLElement).closest("a,button,select")) setEditing(r); }}>
              {cols.map((c, i) => (
                <TD key={c.key} className={i === 0 ? "max-w-[22rem] font-medium" : "max-w-[16rem]"}>
                  {i === 0 ? (
                    <button className="text-left hover:underline underline-offset-2" onClick={(e) => { e.stopPropagation(); setEditing(r); }}>
                      {String(r[c.key] ?? "Untitled")}
                    </button>
                  ) : (
                    <FieldValue field={c} value={r[c.key]} lookups={lookups} row={r} />
                  )}
                </TD>
              ))}
              <TD>
                <Link href={`/records/${table}/${r.id}`} onClick={(e) => e.stopPropagation()} className="text-muted-foreground hover:text-foreground" aria-label="Open record page">
                  <ArrowUpRight className="size-3.5" />
                </Link>
              </TD>
            </TR>
          ))}
          {!shown.length && (
            <tr><td colSpan={cols.length + 1} className="px-3 py-10 text-center text-[13px] text-muted-foreground">{rows.length ? "Nothing matches these filters." : emptyText ?? `No ${def.plural.toLowerCase()} yet.`}</td></tr>
          )}
        </TBody>
      </Table>
      {shown.length > limit && (
        <div className="border-t border-border px-3 py-2 text-center">
          <Button variant="ghost" size="sm" onClick={() => setLimit((l) => l + pageSize)}>Show {Math.min(pageSize, shown.length - limit)} more</Button>
        </div>
      )}
      <RecordForm table={table} row={editing} lookups={lookups} open={!!editing} onOpenChange={(o) => !o && setEditing(null)} canWrite={canWrite} hideFields={hideFields} />
      <RecordForm table={table} lookups={lookups} defaults={defaults} hideFields={hideFields} open={creating} onOpenChange={setCreating} canWrite={canWrite} />
    </div>
  );
}
