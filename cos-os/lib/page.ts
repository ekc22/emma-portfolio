import "server-only";
import { requireSession } from "./auth/session";
import { canSeeInvestors, canWrite } from "./auth/permissions";
import { loadLookups, loadTables } from "./data";
import type { TableName } from "./schema";

/** Loads a page's tables, relation labels and the viewer's permissions in one call. */
export async function loadPage<T extends TableName>(tables: readonly T[]) {
  const session = await requireSession();
  const data = await loadTables(session, tables);
  const lookups = await loadLookups(session, [...tables], data);
  return {
    session,
    data,
    lookups,
    write: (t: TableName) => canWrite(t, session.role),
    investors: canSeeInvestors(session.role),
  };
}
