"use server";

import { revalidatePath } from "next/cache";
import { requireSession } from "../auth/session";
import { canWrite } from "../auth/permissions";
import { getStore } from "../data";
import { writeAudit } from "../audit";
import { cleanRecord } from "../validate";
import { entity, isTable } from "../schema";
import { todayISO } from "../utils";
import { AI_READ_ONLY } from "../ai/tools";

export type DecisionResult = { ok: true; recordId?: string } | { ok: false; error: string };

/**
 * Applies an AI proposal after a person approves it. The approver's
 * permissions decide whether it can be applied; the audit log records both
 * the AI origin and the approving person.
 */
export async function approveProposal(id: string, edits?: Record<string, unknown>): Promise<DecisionResult> {
  const session = await requireSession();
  const store = await getStore(session);
  const rec = await store.get("ai_recommendations", id);
  if (!rec) return { ok: false, error: "Proposal not found." };
  if (rec.status !== "pending") return { ok: false, error: `This proposal is already ${rec.status}.` };
  const table = String(rec.target_table);
  if (!isTable(table) || AI_READ_ONLY.includes(table)) return { ok: false, error: "This record type cannot be changed from a proposal." };
  if (!canWrite(table, session.role)) return { ok: false, error: `Your role cannot approve changes to ${entity(table).plural.toLowerCase()}.` };

  const payload = { ...(rec.payload ?? {}), ...(edits ?? {}) } as Record<string, unknown>;
  const clean = cleanRecord(table, payload, rec.action === "update");
  if (!clean.ok) return { ok: false, error: Object.values(clean.errors).join(" ") };
  const data = rec.action === "update" ? Object.fromEntries(Object.keys(payload).map((k) => [k, clean.data[k]])) : clean.data;

  if (table === "tasks" && data.status === "done" && !data.evidence) {
    const existing = rec.target_id ? await store.get("tasks", rec.target_id) : null;
    if (!existing?.evidence) return { ok: false, error: "Add completion evidence before approving this action as done." };
  }

  try {
    let recordId: string;
    if (rec.action === "update") {
      if (!rec.target_id || !(await store.get(table, rec.target_id))) return { ok: false, error: "The record this proposal changes no longer exists." };
      if (table === "milestones" && data.status === "complete" && !data.completed_on) data.completed_on = todayISO();
      await store.update(table, rec.target_id, data);
      recordId = rec.target_id;
    } else {
      const row = await store.insert(table, { ...data, created_by: session.authUserId });
      recordId = row.id;
    }
    await store.update("ai_recommendations", id, { status: "applied", decided_by: session.name, decided_at: new Date().toISOString(), applied_record_id: recordId, payload });
    await writeAudit(store, session, { action: "approve", table, recordId, summary: `Applied AI proposal “${rec.title}”, approved by ${session.name}`, changes: data, actorType: "ai" });

    // A meeting action that becomes a task is marked as approved on the meeting too.
    if (rec.meeting_action_id) {
      try { await store.update("meeting_actions", rec.meeting_action_id, { status: "approved", task_id: table === "tasks" ? recordId : null }); } catch { /* optional link */ }
    }
    revalidatePath("/", "layout");
    return { ok: true, recordId };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function rejectProposal(id: string, reason?: string): Promise<DecisionResult> {
  const session = await requireSession();
  if (!canWrite("ai_recommendations", session.role)) return { ok: false, error: "Your role cannot decide on proposals." };
  const store = await getStore(session);
  const rec = await store.get("ai_recommendations", id);
  if (!rec) return { ok: false, error: "Proposal not found." };
  if (rec.status !== "pending") return { ok: false, error: `This proposal is already ${rec.status}.` };
  await store.update("ai_recommendations", id, { status: "rejected", decided_by: session.name, decided_at: new Date().toISOString(), rejection_reason: reason ?? null });
  if (rec.meeting_action_id) {
    try { await store.update("meeting_actions", rec.meeting_action_id, { status: "rejected" }); } catch { /* optional */ }
  }
  await writeAudit(store, session, { action: "reject", table: "ai_recommendations", recordId: id, summary: `Rejected AI proposal “${rec.title}”` });
  revalidatePath("/", "layout");
  return { ok: true };
}
