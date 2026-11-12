"use server";

import { revalidatePath } from "next/cache";
import { requireSession } from "../auth/session";
import { canWrite } from "../auth/permissions";
import { getStore } from "../data";
import { writeAudit } from "../audit";
import type { Role } from "../types";

const APPROVERS: Role[] = ["owner", "admin", "executive"];

export type ReportResult = { ok: true } | { ok: false; error: string };

/** Saves an edited report body. Editing an approved report sends it back for review. */
export async function saveReportBody(id: string, body: string): Promise<ReportResult> {
  const session = await requireSession();
  if (!canWrite("reports", session.role)) return { ok: false, error: "Your role cannot edit reports." };
  const store = await getStore(session);
  const r = await store.get("reports", id);
  if (!r) return { ok: false, error: "Report not found." };
  const patch: Record<string, unknown> = { body: body.slice(0, 200000), edited_by: session.name };
  if (r.status === "approved") Object.assign(patch, { status: "in_review", approved_by: null, approved_at: null });
  await store.update("reports", id, patch);
  await writeAudit(store, session, { action: "update", table: "reports", recordId: id, summary: `Edited report “${r.title}”${r.status === "approved" ? " (returned to review)" : ""}` });
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function setReportStatus(id: string, status: "draft" | "in_review" | "approved"): Promise<ReportResult> {
  const session = await requireSession();
  if (!canWrite("reports", session.role)) return { ok: false, error: "Your role cannot change reports." };
  if (status === "approved" && !APPROVERS.includes(session.role)) return { ok: false, error: "Only owners, admins and executives can approve reports." };
  const store = await getStore(session);
  const r = await store.get("reports", id);
  if (!r) return { ok: false, error: "Report not found." };
  await store.update("reports", id, status === "approved" ? { status, approved_by: session.name, approved_at: new Date().toISOString() } : { status, approved_by: null, approved_at: null });
  await writeAudit(store, session, { action: status === "approved" ? "approve" : "update", table: "reports", recordId: id, summary: `Report “${r.title}” set to ${status.replace("_", " ")}` });
  revalidatePath("/", "layout");
  return { ok: true };
}
