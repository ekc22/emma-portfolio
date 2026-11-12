import "server-only";
import type { Store } from "./store";
import type { TableName } from "../schema";

/**
 * Side effects when a record is created: activity moves "last activity" or
 * "last contact" forward, and a check-in updates its project's RAG and progress.
 */
export async function touchParent(store: Store, table: TableName, row: Record<string, unknown>) {
  try {
    if (table === "commercial_activities" && row.opportunity_id && row.occurred_on) {
      const opp = await store.get("commercial_opportunities", String(row.opportunity_id));
      if (opp && (!opp.last_activity_date || opp.last_activity_date < String(row.occurred_on)))
        await store.update("commercial_opportunities", opp.id, { last_activity_date: row.occurred_on });
    }
    if (table === "status_updates" && row.project_id) {
      const patch: Record<string, unknown> = {};
      if (row.rag) patch.rag = row.rag;
      if (row.progress !== null && row.progress !== undefined) patch.progress = row.progress;
      if (Object.keys(patch).length) await store.update("projects", String(row.project_id), patch);
    }
    if (table === "investor_interactions" && row.investor_id && row.occurred_on) {
      const inv = await store.get("investors", String(row.investor_id));
      if (inv && (!inv.last_contact_date || inv.last_contact_date < String(row.occurred_on)))
        await store.update("investors", inv.id, { last_contact_date: row.occurred_on });
    }
  } catch {
    /* parent may be hidden by permissions; the activity itself is saved */
  }
}
