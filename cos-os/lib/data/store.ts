import type { TableName } from "../schema";
import type { Row } from "../types";

export interface ListOptions {
  /** Equality filters, e.g. { project_id: "…" }. A null value matches empty. */
  where?: Record<string, string | number | boolean | null>;
  /** Free-text search across the entity's search fields. */
  search?: string;
  orderBy?: [string, "asc" | "desc"];
  limit?: number;
}

/**
 * Persistence boundary. Two implementations:
 * - LocalStore: JSON file under .data/ (demo mode, no setup needed)
 * - SupabaseStore: Postgres through the signed-in user's session, so RLS applies
 */
export interface Store {
  list(table: TableName, opts?: ListOptions): Promise<Row[]>;
  get(table: TableName, id: string): Promise<Row | null>;
  insert(table: TableName, data: Record<string, unknown>): Promise<Row>;
  update(table: TableName, id: string, patch: Record<string, unknown>): Promise<Row>;
  remove(table: TableName, id: string): Promise<void>;
}
