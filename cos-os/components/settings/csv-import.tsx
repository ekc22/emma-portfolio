"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { FileUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label, NativeSelect } from "@/components/ui/input";
import { ENTITIES, type TableName } from "@/lib/schema";
import { IMPORTABLE, autoMap, parseCsv } from "@/lib/import";
import { importRecords, type ImportCheck } from "@/lib/actions/import";

/** Four steps: choose a record type, load a CSV, check the column matches, import the valid rows. */
export function CsvImport({ writable }: { writable: TableName[] }) {
  const router = useRouter();
  const tables = IMPORTABLE.filter((t) => writable.includes(t));
  const [table, setTable] = React.useState<TableName>(tables[0]);
  const [fileName, setFileName] = React.useState("");
  const [grid, setGrid] = React.useState<string[][]>([]);
  const [map, setMap] = React.useState<string[]>([]);
  const [check, setCheck] = React.useState<ImportCheck | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [pending, start] = React.useTransition();
  const def = ENTITIES[table];
  const fields = def.fields.filter((f) => !f.system);
  const headers = grid[0] ?? [];
  const body = grid.slice(1);

  const load = (file: File | undefined) => {
    if (!file) return;
    setError(null); setCheck(null);
    if (file.size > 5_000_000) { setError("That file is over 5 MB. Split it into smaller files."); return; }
    const reader = new FileReader();
    reader.onload = () => {
      const rows = parseCsv(String(reader.result ?? ""));
      if (rows.length < 2) { setError("The file needs a header row and at least one data row."); return; }
      setGrid(rows); setFileName(file.name); setMap(autoMap(table, rows[0]));
    };
    reader.onerror = () => setError("The file could not be read. Save it as CSV (UTF-8) and try again.");
    reader.readAsText(file);
  };

  const changeTable = (t: TableName) => { setTable(t); setCheck(null); if (headers.length) setMap(autoMap(t, headers)); };
  const payload = () => body.map((r) => Object.fromEntries(map.map((k, i) => [k, r[i] ?? ""]).filter(([k]) => k)));
  const missingRequired = fields.filter((f) => f.required && !map.includes(f.key));

  const run = (dryRun: boolean) => start(async () => {
    setError(null);
    const res = await importRecords(table, payload(), dryRun);
    if (!res.ok) { setError(res.error ?? "The import failed."); return; }
    setCheck(res);
    if (!dryRun) router.refresh();
  });

  const template = () => {
    const csv = fields.map((f) => `"${f.label}"`).join(",") + "\n";
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url; a.download = `${table}-template.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex max-w-5xl flex-col gap-6">
      <p className="text-xs text-muted-foreground">Bring in records from a spreadsheet or another tool&apos;s CSV export. People and organisations can be given by name; they&apos;re matched to existing records. Dates like 14/11/2026 and amounts like £1.5m are understood. Only rows that pass every check are imported, and the import is logged.</p>

      <div className="grid gap-4 sm:grid-cols-[16rem_1fr] sm:items-end">
        <div className="flex flex-col gap-1">
          <Label htmlFor="imp-table">1. What are you importing?</Label>
          <NativeSelect id="imp-table" value={table} onChange={(e) => changeTable(e.target.value as TableName)}>
            {tables.map((t) => <option key={t} value={t}>{ENTITIES[t].plural}</option>)}
          </NativeSelect>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <label className="inline-flex h-9 cursor-pointer items-center gap-1.5 bg-cherry px-4 font-sans text-[11.5px] font-semibold uppercase tracking-[0.1em] text-paper hover:bg-oxblood">
            <FileUp className="size-3.5" /> 2. Choose CSV file
            <input type="file" accept=".csv,text/csv" className="sr-only" onChange={(e) => load(e.target.files?.[0])} />
          </label>
          {fileName && <span className="text-xs text-muted-foreground">{fileName} · {body.length} rows</span>}
          <button type="button" onClick={template} className="label !text-cherry">Download a template</button>
        </div>
      </div>

      {error && <p role="alert" className="text-xs text-rag-red">{error}</p>}

      {headers.length > 0 && (
        <section>
          <h3 className="mb-2 font-serif text-[20px]">3. Check the column matches</h3>
          <div className="relative overflow-x-auto border-t border-oxblood">
            <table className="w-full min-w-[560px] text-[13px]">
              <thead><tr>{["Column in your file", "Example", "Goes into"].map((h) => <th key={h} className="label border-b border-linen-deep px-3 py-2 text-left font-semibold">{h}</th>)}</tr></thead>
              <tbody>
                {headers.map((h, i) => (
                  <tr key={i} className="border-b border-linen-deep">
                    <td className="px-3 py-2">{h || <span className="text-muted-foreground">(blank)</span>}</td>
                    <td className="max-w-[16rem] truncate px-3 py-2 text-xs text-muted-foreground">{body[0]?.[i]}</td>
                    <td className="px-3 py-1.5">
                      <label className="sr-only" htmlFor={`map-${i}`}>Field for {h}</label>
                      <NativeSelect id={`map-${i}`} className="h-8 text-xs" value={map[i] ?? ""} onChange={(e) => { const m = [...map]; m[i] = e.target.value; setMap(m); setCheck(null); }}>
                        <option value="">Don&apos;t import</option>
                        {fields.map((f) => <option key={f.key} value={f.key} disabled={map.includes(f.key) && map[i] !== f.key}>{f.label}{f.required ? " *" : ""}</option>)}
                      </NativeSelect>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {missingRequired.length > 0 && <p className="mt-2 text-xs text-rag-amber">Required and not matched: {missingRequired.map((f) => f.label).join(", ")}. Match a column, or every row will fail.</p>}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Button variant="secondary" onClick={() => run(true)} disabled={pending}>{pending ? "Checking…" : "4. Check the rows"}</Button>
            {check && !check.created && check.valid > 0 && <Button onClick={() => run(false)} disabled={pending}>Import {check.valid} {check.valid === 1 ? "row" : "rows"}</Button>}
          </div>
        </section>
      )}

      {check && (
        <section aria-live="polite" className="border-t border-linen-deep pt-4">
          {check.created !== undefined ? (
            <p className="font-serif text-[20px]">Imported {check.created} {def.plural.toLowerCase()}.{check.problems.length ? ` ${check.problems.length} rows were skipped.` : ""}</p>
          ) : (
            <p className="text-[13px]"><span className="font-semibold">{check.valid}</span> of {check.total} rows are ready to import.{check.problems.length ? ` ${check.problems.length} need fixing:` : " No problems found."}</p>
          )}
          {check.problems.length > 0 && (
            <ul className="mt-2 max-h-72 overflow-y-auto text-xs">
              {check.problems.slice(0, 50).map((p) => <li key={p.row} className="border-b border-linen-deep py-1.5"><span className="num font-semibold">Row {p.row}:</span> {p.messages.join("; ")}</li>)}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}
