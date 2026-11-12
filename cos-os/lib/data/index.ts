import "server-only";
import { isSupabaseConfigured } from "../env";
import { canRead } from "../auth/permissions";
import { ENTITIES, relationTables, type TableName } from "../schema";
import type { Lookups, Row, Session } from "../types";
import { LocalStore } from "./local-store";
import { SupabaseStore } from "./supabase-store";
import { supabaseServer } from "../supabase/server";
import type { ListOptions, Store } from "./store";

export async function getStore(session: Session): Promise<Store> {
  if (isSupabaseConfigured()) return new SupabaseStore(await supabaseServer(), session.orgId);
  return new LocalStore(session.orgId);
}

/** Lists a table if the role may read it; otherwise returns an empty list. */
export async function listIfAllowed(store: Store, session: Session, table: TableName, opts?: ListOptions): Promise<Row[]> {
  if (!canRead(table, session.role)) return [];
  return store.list(table, opts);
}

/** Loads several tables at once, respecting permissions. */
export async function loadTables<T extends TableName>(session: Session, tables: readonly T[]) {
  const store = await getStore(session);
  const entries = await Promise.all(tables.map(async (t) => [t, await listIfAllowed(store, session, t)] as const));
  return Object.fromEntries(entries) as Record<T, Row[]>;
}

/** id → display label maps for every relation the given tables point at. */
export async function loadLookups(session: Session, tables: TableName[], preloaded: Partial<Record<TableName, Row[]>> = {}): Promise<Lookups> {
  const store = await getStore(session);
  const needed = relationTables(tables);
  const out: Lookups = {};
  await Promise.all(
    needed.map(async (t) => {
      const rows = preloaded[t] ?? (await listIfAllowed(store, session, t));
      const tf = ENTITIES[t].titleField;
      out[t] = Object.fromEntries(rows.map((r) => [r.id, String(r[tf] ?? "Untitled")]));
    }),
  );
  return out;
}
