import "server-only";
import type { Store } from "./data/store";
import { entity, type TableName } from "./schema";
import type { Session } from "./types";

/** Appends an audit entry. Never throws: auditing must not block the change it records. */
export async function writeAudit(
  store: Store,
  session: Session,
  entry: { action: "create" | "update" | "delete" | "approve" | "reject"; table: TableName; recordId: string; summary: string; changes?: unknown; actorType?: "user" | "ai" | "system" },
) {
  try {
    await store.insert("audit_logs", {
      actor_id: session.authUserId,
      actor_name: session.name,
      actor_type: entry.actorType ?? "user",
      action: entry.action,
      table_name: entry.table,
      record_id: entry.recordId,
      summary: entry.summary,
      changes: entry.changes ?? null,
    });
  } catch (e) {
    console.error("Audit write failed", e);
  }
}

export const recordLabel = (table: TableName, row: Record<string, unknown> | null | undefined) =>
  String(row?.[entity(table).titleField] ?? entity(table).label);
