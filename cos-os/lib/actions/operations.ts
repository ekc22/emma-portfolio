"use server";

import { revalidatePath } from "next/cache";
import { requireSession } from "../auth/session";
import { canWrite } from "../auth/permissions";
import { getStore } from "../data";
import { writeAudit } from "../audit";
import { todayISO, addDays } from "../utils";

export type OpsResult = { ok: true; created?: number; id?: string } | { ok: false; error: string };

/** Marks an action done. Completion always records what shows it is done. */
export async function completeTask(id: string, evidence: string): Promise<OpsResult> {
  const session = await requireSession();
  if (!canWrite("tasks", session.role)) return { ok: false, error: "Your role cannot update actions." };
  const text = evidence.trim();
  if (text.length < 5) return { ok: false, error: "Say briefly what shows this is done (a link, a document, who confirmed it)." };
  const store = await getStore(session);
  const t = await store.get("tasks", id);
  if (!t) return { ok: false, error: "Action not found." };
  await store.update("tasks", id, { status: "done", evidence: text.slice(0, 4000), escalated: false });
  await writeAudit(store, session, { action: "update", table: "tasks", recordId: id, summary: `Completed action “${t.title}” with evidence`, changes: { status: { from: t.status, to: "done" }, evidence: text } });
  if (t.request_id) {
    try { await store.update("requests", t.request_id, { status: "done" }); } catch { /* request may be gone */ }
  }
  revalidatePath("/", "layout");
  return { ok: true, id };
}

function nextDate(iso: string, cadence: string) {
  const d = new Date(iso + "T00:00:00");
  if (cadence === "weekly") return addDays(iso, 7);
  if (cadence === "fortnightly") return addDays(iso, 14);
  const months = cadence === "quarterly" ? 3 : 1;
  const day = d.getDate();
  d.setDate(1);
  d.setMonth(d.getMonth() + months);
  const last = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  d.setDate(Math.min(day, last));
  return todayISO(d);
}

/**
 * Runs a routine: one action per checklist line, owned by the routine owner and
 * due on the routine's due date, then moves the routine to its next date.
 */
export async function runRoutine(id: string): Promise<OpsResult> {
  const session = await requireSession();
  if (!canWrite("routines", session.role) || !canWrite("tasks", session.role)) return { ok: false, error: "Your role cannot run routines." };
  const store = await getStore(session);
  const r = await store.get("routines", id);
  if (!r) return { ok: false, error: "Routine not found." };
  const steps = String(r.checklist ?? "").split("\n").map((l) => l.replace(/^[-*•\d.)\s]+/, "").trim()).filter(Boolean);
  const items = steps.length ? steps : [r.title];
  const due = r.next_due && r.next_due >= todayISO() ? r.next_due : todayISO();
  for (const step of items) {
    await store.insert("tasks", {
      title: steps.length ? `${r.title}: ${step}` : step,
      status: "todo", priority: "medium", owner_id: r.owner_id ?? null, due_date: due,
      project_id: r.project_id ?? null, routine_id: r.id, escalated: false, created_by: session.authUserId,
    });
  }
  const next = nextDate(r.next_due ?? todayISO(), r.cadence);
  await store.update("routines", id, { last_run: todayISO(), next_due: next < todayISO() ? nextDate(todayISO(), r.cadence) : next });
  await writeAudit(store, session, { action: "update", table: "routines", recordId: id, summary: `Ran routine “${r.title}”: ${items.length} actions created`, changes: { next_due: { from: r.next_due, to: next } } });
  revalidatePath("/", "layout");
  return { ok: true, created: items.length };
}

/** Turns an internal request into a tracked action and links the two. */
export async function convertRequest(id: string, ownerId?: string, dueDate?: string): Promise<OpsResult> {
  const session = await requireSession();
  if (!canWrite("requests", session.role) || !canWrite("tasks", session.role)) return { ok: false, error: "Your role cannot convert requests." };
  const store = await getStore(session);
  const r = await store.get("requests", id);
  if (!r) return { ok: false, error: "Request not found." };
  if (r.task_id) return { ok: false, error: "This request already has an action." };
  const owner = ownerId || r.owner_id;
  if (!owner) return { ok: false, error: "Choose who owns it first." };
  const task = await store.insert("tasks", {
    title: r.title, description: r.detail ?? null, status: "todo", priority: r.priority ?? "medium",
    owner_id: owner, due_date: dueDate || r.needed_by || null, request_id: r.id, escalated: false, created_by: session.authUserId,
  });
  await store.update("requests", id, { status: "in_progress", owner_id: owner, task_id: task.id });
  await writeAudit(store, session, { action: "update", table: "requests", recordId: id, summary: `Converted request “${r.title}” into an action` });
  revalidatePath("/", "layout");
  return { ok: true, id: task.id };
}

export async function setRequestStatus(id: string, status: "triaged" | "declined"): Promise<OpsResult> {
  const session = await requireSession();
  if (!canWrite("requests", session.role)) return { ok: false, error: "Your role cannot triage requests." };
  const store = await getStore(session);
  const r = await store.get("requests", id);
  if (!r) return { ok: false, error: "Request not found." };
  await store.update("requests", id, { status });
  await writeAudit(store, session, { action: "update", table: "requests", recordId: id, summary: `Request “${r.title}” marked ${status}` });
  revalidatePath("/", "layout");
  return { ok: true, id };
}
