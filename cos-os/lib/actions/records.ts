"use server";

import { revalidatePath } from "next/cache";
import { requireSession } from "../auth/session";
import { canWrite } from "../auth/permissions";
import { getStore } from "../data";
import { writeAudit, recordLabel } from "../audit";
import { cleanRecord } from "../validate";
import { entity, isTable, type TableName } from "../schema";
import { todayISO } from "../utils";
import { touchParent } from "../data/hooks";

export type ActionResult = { ok: true; id: string } | { ok: false; error: string; fieldErrors?: Record<string, string> };

function guard(table: string): TableName {
  if (!isTable(table)) throw new Error("Unknown record type");
  return table;
}

/** Fields that only change through dedicated flows. */
const LOCKED: Partial<Record<TableName, string[]>> = { audit_logs: ["*"], ai_recommendations: ["status"] };

export async function createRecord(tableName: string, values: Record<string, unknown>): Promise<ActionResult> {
  const table = guard(tableName);
  const session = await requireSession();
  if (!canWrite(table, session.role) || LOCKED[table]?.includes("*")) return { ok: false, error: "Your role cannot create this record." };
  const clean = cleanRecord(table, values);
  if (!clean.ok) return { ok: false, error: "Check the highlighted fields.", fieldErrors: clean.errors };
  try {
    const store = await getStore(session);
    const data = withLifecycle(table, clean.data, null);
    const row = await store.insert(table, { ...data, created_by: session.authUserId });
    await touchParent(store, table, row);
    await writeAudit(store, session, { action: "create", table, recordId: row.id, summary: `Created ${entity(table).label.toLowerCase()} “${recordLabel(table, row)}”`, changes: data });
    revalidatePath("/", "layout");
    return { ok: true, id: row.id };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function updateRecord(tableName: string, id: string, values: Record<string, unknown>): Promise<ActionResult> {
  const table = guard(tableName);
  const session = await requireSession();
  if (!canWrite(table, session.role)) return { ok: false, error: "Your role cannot edit this record." };
  const locked = LOCKED[table] ?? [];
  if (locked.includes("*") || Object.keys(values).some((k) => locked.includes(k))) return { ok: false, error: "That field changes only through its approval flow." };
  const clean = cleanRecord(table, values, true);
  if (!clean.ok) return { ok: false, error: "Check the highlighted fields.", fieldErrors: clean.errors };
  try {
    const store = await getStore(session);
    const before = await store.get(table, id);
    if (!before) return { ok: false, error: "Record not found." };
    const patch = withLifecycle(table, clean.data, before);
    const changed = Object.fromEntries(Object.entries(patch).filter(([k, v]) => JSON.stringify(before[k] ?? null) !== JSON.stringify(v ?? null)));
    if (!Object.keys(changed).length) return { ok: true, id };
    const row = await store.update(table, id, changed);
    await writeAudit(store, session, {
      action: "update", table, recordId: id,
      summary: `Updated ${entity(table).label.toLowerCase()} “${recordLabel(table, row)}”: ${Object.keys(changed).join(", ")}`,
      changes: Object.fromEntries(Object.keys(changed).map((k) => [k, { from: before[k] ?? null, to: changed[k] }])),
    });
    revalidatePath("/", "layout");
    return { ok: true, id };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function deleteRecord(tableName: string, id: string): Promise<ActionResult> {
  const table = guard(tableName);
  const session = await requireSession();
  if (!canWrite(table, session.role) || LOCKED[table]?.includes("*")) return { ok: false, error: "Your role cannot delete this record." };
  try {
    const store = await getStore(session);
    const before = await store.get(table, id);
    if (!before) return { ok: false, error: "Record not found." };
    await store.remove(table, id);
    await writeAudit(store, session, { action: "delete", table, recordId: id, summary: `Deleted ${entity(table).label.toLowerCase()} “${recordLabel(table, before)}”`, changes: before });
    revalidatePath("/", "layout");
    return { ok: true, id };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

/** Keeps stage and completion dates honest when status fields change. */
function withLifecycle(table: TableName, data: Record<string, unknown>, before: Record<string, unknown> | null) {
  const out = { ...data };
  const today = todayISO();
  if ((table === "commercial_opportunities" || table === "fundraising_opportunities") && "stage" in out && out.stage !== before?.stage) {
    out.stage_changed_at = today;
    if (table === "commercial_opportunities" && out.stage === "Won") out.probability = 100;
    if (table === "commercial_opportunities" && out.stage === "Lost") out.probability = 0;
  }
  if (table === "milestones" && out.status === "complete" && before?.status !== "complete" && !out.completed_on) out.completed_on = today;
  return out;
}
