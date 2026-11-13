"use server";

import { revalidatePath } from "next/cache";
import { requireSession } from "../auth/session";
import { canWrite } from "../auth/permissions";
import { getStore, listIfAllowed } from "../data";
import { writeAudit } from "../audit";
import { cleanRecord } from "../validate";
import { ENTITIES, entity, isTable } from "../schema";
import { IMPORTABLE, coerce } from "../import";

export type ImportCheck = {
  ok: boolean;
  error?: string;
  total: number;
  valid: number;
  created?: number;
  problems: { row: number; messages: string[] }[];
};

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const MAX_ROWS = 2000;

/**
 * Validates (dryRun) or imports spreadsheet rows. `rows` hold raw cell text
 * keyed by field. Relation cells may hold a name ("Tom Reid") or an id.
 * Only valid rows are imported; problems are reported by spreadsheet row number.
 */
export async function importRecords(tableName: string, rows: Record<string, string>[], dryRun: boolean): Promise<ImportCheck> {
  const empty = { total: rows.length, valid: 0, problems: [] };
  if (!isTable(tableName) || !IMPORTABLE.includes(tableName)) return { ok: false, error: "That record type can't be imported.", ...empty };
  const table = tableName;
  const session = await requireSession();
  if (!canWrite(table, session.role)) return { ok: false, error: "Your role can't create these records.", ...empty };
  if (rows.length > MAX_ROWS) return { ok: false, error: `Import up to ${MAX_ROWS} rows at a time.`, ...empty };

  const store = await getStore(session);
  const def = entity(table);
  // Name → id maps for every relation the table uses.
  const names: Record<string, Map<string, string>> = {};
  for (const f of def.fields) {
    if (f.type !== "relation" || !f.relation || names[f.relation]) continue;
    const list = await listIfAllowed(store, session, f.relation);
    const tf = ENTITIES[f.relation].titleField;
    names[f.relation] = new Map(list.map((r) => [String(r[tf] ?? "").trim().toLowerCase(), r.id]));
  }

  const problems: ImportCheck["problems"] = [];
  const ready: Record<string, unknown>[] = [];
  rows.forEach((raw, i) => {
    const messages: string[] = [];
    const values: Record<string, unknown> = {};
    for (const f of def.fields) {
      if (!(f.key in raw)) continue;
      const cell = String(raw[f.key] ?? "").trim();
      if (f.type === "relation" && cell) {
        const id = UUID.test(cell) ? cell : names[f.relation!]?.get(cell.toLowerCase());
        if (!id) { messages.push(`${f.label}: no ${ENTITIES[f.relation!].label.toLowerCase()} called “${cell}”`); continue; }
        values[f.key] = id;
      } else values[f.key] = coerce(f, cell);
    }
    const clean = cleanRecord(table, values);
    if (!clean.ok) messages.push(...Object.values(clean.errors));
    if (messages.length) problems.push({ row: i + 2, messages }); // +2: header row and 1-based numbering
    else ready.push(clean.ok ? clean.data : {});
  });

  if (dryRun) return { ok: true, total: rows.length, valid: ready.length, problems: problems.slice(0, 200) };

  let created = 0;
  for (const data of ready) {
    await store.insert(table, { ...data, created_by: session.authUserId });
    created++;
  }
  await writeAudit(store, session, { action: "create", table, recordId: session.orgId, summary: `Imported ${created} ${def.plural.toLowerCase()} from CSV${problems.length ? ` (${problems.length} rows skipped)` : ""}` });
  revalidatePath("/", "layout");
  return { ok: true, total: rows.length, valid: ready.length, created, problems: problems.slice(0, 200) };
}
