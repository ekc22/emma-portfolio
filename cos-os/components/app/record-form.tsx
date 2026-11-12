"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Textarea, NativeSelect, Label } from "@/components/ui/input";
import { Dialog, DialogBody, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { createRecord, deleteRecord, updateRecord } from "@/lib/actions/records";
import { entity, humanize, type FieldDef, type TableName } from "@/lib/schema";
import type { Lookups, Row } from "@/lib/types";
import { cn } from "@/lib/utils";

function toInput(field: FieldDef, v: unknown): string | boolean {
  if (field.type === "boolean") return Boolean(v);
  if (v === null || v === undefined) return "";
  if (field.type === "date") return String(v).slice(0, 10);
  if (field.type === "datetime") {
    const d = new Date(String(v));
    if (Number.isNaN(d.getTime())) return "";
    const z = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${z(d.getMonth() + 1)}-${z(d.getDate())}T${z(d.getHours())}:${z(d.getMinutes())}`;
  }
  return String(v);
}

export function RecordForm({
  table, row, defaults, lookups, open, onOpenChange, canWrite = true, onSaved, hideFields = [],
}: {
  table: TableName; row?: Row | null; defaults?: Record<string, unknown>; lookups: Lookups; open: boolean; onOpenChange: (o: boolean) => void;
  canWrite?: boolean; onSaved?: (id: string) => void; hideFields?: string[];
}) {
  const def = entity(table);
  const router = useRouter();
  const fields = def.fields.filter((f) => !f.system && !hideFields.includes(f.key));
  const initial = React.useCallback(
    () => Object.fromEntries(fields.map((f) => [f.key, toInput(f, row ? row[f.key] : defaults?.[f.key])])),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [row?.id, open],
  );
  const [values, setValues] = React.useState<Record<string, string | boolean>>(initial);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [formError, setFormError] = React.useState<string | null>(null);
  const [pending, start] = React.useTransition();
  const [confirmDelete, setConfirmDelete] = React.useState(false);

  React.useEffect(() => {
    if (open) { setValues(initial()); setErrors({}); setFormError(null); setConfirmDelete(false); }
  }, [open, initial]);

  const set = (k: string, v: string | boolean) => setValues((s) => ({ ...s, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canWrite) return;
    const payload = Object.fromEntries(Object.entries(values).map(([k, v]) => {
      const f = fields.find((x) => x.key === k);
      if (f?.type === "datetime" && typeof v === "string" && v) return [k, new Date(v).toISOString()];
      return [k, v];
    }));
    if (defaults) for (const [k, v] of Object.entries(defaults)) if (hideFields.includes(k)) payload[k] = v as string;
    start(async () => {
      const res = row ? await updateRecord(table, row.id, payload) : await createRecord(table, payload);
      if (!res.ok) { setErrors(res.fieldErrors ?? {}); setFormError(res.error); return; }
      onOpenChange(false);
      onSaved?.(res.id);
      router.refresh();
    });
  };

  const remove = () => {
    if (!row) return;
    start(async () => {
      const res = await deleteRecord(table, row.id);
      if (!res.ok) { setFormError(res.error); return; }
      onOpenChange(false);
      router.refresh();
    });
  };

  const fieldsWide = fields.filter((f) => f.type === "textarea");
  const fieldsNarrow = fields.filter((f) => f.type !== "textarea");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent wide={fields.length > 8}>
        <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col" noValidate>
          <DialogHeader>
            <DialogTitle>{row ? String(row[def.titleField] ?? def.label) : `New ${def.label.toLowerCase()}`}</DialogTitle>
            <DialogDescription>{canWrite ? def.description : "Read-only for your role."}</DialogDescription>
          </DialogHeader>
          <DialogBody>
            <fieldset disabled={!canWrite || pending} className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
              {[...fieldsNarrow, ...fieldsWide].map((f) => (
                <div key={f.key} className={cn("flex flex-col gap-1", (f.type === "textarea" || f.key === def.titleField) && "sm:col-span-2")}>
                  <Label htmlFor={`f-${table}-${f.key}`}>
                    {f.label}
                    {f.required && <span className="text-rag-red"> *</span>}
                  </Label>
                  <FieldInput id={`f-${table}-${f.key}`} field={f} value={values[f.key]} onChange={(v) => set(f.key, v)} lookups={lookups} invalid={!!errors[f.key]} />
                  {errors[f.key] ? <p className="text-2xs text-rag-red">{errors[f.key]}</p> : f.hint ? <p className="text-2xs text-muted-foreground">{f.hint}</p> : null}
                </div>
              ))}
            </fieldset>
          </DialogBody>
          <DialogFooter className="justify-between">
            <div>
              {row && canWrite && (confirmDelete ? (
                <span className="flex items-center gap-2 text-xs">
                  Delete permanently?
                  <Button type="button" size="sm" variant="destructive" onClick={remove} disabled={pending}>Delete</Button>
                  <Button type="button" size="sm" variant="ghost" onClick={() => setConfirmDelete(false)}>Keep</Button>
                </span>
              ) : (
                <Button type="button" size="sm" variant="ghost" onClick={() => setConfirmDelete(true)}><Trash2 /> Delete</Button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              {formError && <span className="max-w-[16rem] text-xs text-rag-red" role="alert">{formError}</span>}
              <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>Cancel</Button>
              {canWrite && <Button type="submit" disabled={pending}>{pending ? "Saving…" : row ? "Save changes" : "Create"}</Button>}
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function FieldInput({ id, field, value, onChange, lookups, invalid }: { id: string; field: FieldDef; value: string | boolean | undefined; onChange: (v: string | boolean) => void; lookups: Lookups; invalid: boolean }) {
  const cls = invalid ? "border-rag-red" : undefined;
  switch (field.type) {
    case "textarea":
      return <Textarea id={id} className={cls} rows={field.key === "notes" || field.key === "body" ? 8 : 3} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} />;
    case "boolean":
      return (
        <label className="flex h-8 items-center gap-2 text-[13px]">
          <input id={id} type="checkbox" className="size-4 accent-[#1C2B3F]" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} />
          {field.label}
        </label>
      );
    case "select":
      return (
        <NativeSelect id={id} className={cls} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)}>
          <option value="">—</option>
          {field.options?.map((o) => <option key={o} value={o}>{humanize(o)}</option>)}
        </NativeSelect>
      );
    case "relation": {
      const opts = Object.entries(lookups[field.relation!] ?? {}).sort((a, b) => a[1].localeCompare(b[1]));
      return (
        <NativeSelect id={id} className={cls} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)}>
          <option value="">—</option>
          {opts.map(([k, label]) => <option key={k} value={k}>{label}</option>)}
        </NativeSelect>
      );
    }
    case "date":
      return <Input id={id} className={cls} type="date" value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} />;
    case "datetime":
      return <Input id={id} className={cls} type="datetime-local" value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} />;
    case "number":
    case "currency":
    case "percent":
    case "score":
      return <Input id={id} className={cn("num", cls)} inputMode="decimal" value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} placeholder={field.type === "currency" ? "£" : field.type === "percent" ? "0–100" : field.type === "score" ? "1–5" : ""} />;
    default:
      return <Input id={id} className={cls} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} />;
  }
}

/** A "New …" button that opens the create form. */
export function NewRecordButton({ table, lookups, defaults, label, hideFields, variant = "default" }: { table: TableName; lookups: Lookups; defaults?: Record<string, unknown>; label?: string; hideFields?: string[]; variant?: "default" | "secondary" }) {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button variant={variant} onClick={() => setOpen(true)}>{label ?? `New ${entity(table).label.toLowerCase()}`}</Button>
      <RecordForm table={table} lookups={lookups} defaults={defaults} hideFields={hideFields} open={open} onOpenChange={setOpen} />
    </>
  );
}
