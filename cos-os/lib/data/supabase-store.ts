import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { entity, type TableName } from "../schema";
import type { Row } from "../types";
import type { ListOptions, Store } from "./store";

/** Postgres via Supabase, using the user's own session. RLS enforces access. */
export class SupabaseStore implements Store {
  constructor(private db: SupabaseClient, private orgId: string) {}

  async list(table: TableName, opts: ListOptions = {}) {
    let q = this.db.from(table).select("*").eq("organisation_id", this.orgId);
    for (const [k, v] of Object.entries(opts.where ?? {})) q = v === null ? q.is(k, null) : q.eq(k, v);
    if (opts.search?.trim()) {
      const term = opts.search.trim().replace(/[,()%*\\]/g, " ");
      q = q.or(entity(table).search.map((f) => `${f}.ilike.%${term}%`).join(","));
    }
    const order = opts.orderBy ?? entity(table).sort;
    if (order) q = q.order(order[0], { ascending: order[1] === "asc", nullsFirst: false });
    if (opts.limit) q = q.limit(opts.limit);
    const { data, error } = await q;
    if (error) throw new Error(error.message);
    return (data ?? []) as Row[];
  }

  async get(table: TableName, id: string) {
    const { data, error } = await this.db.from(table).select("*").eq("id", id).eq("organisation_id", this.orgId).maybeSingle();
    if (error) throw new Error(error.message);
    return (data as Row) ?? null;
  }

  async insert(table: TableName, data: Record<string, unknown>) {
    const { data: row, error } = await this.db.from(table).insert({ ...data, organisation_id: this.orgId }).select("*").single();
    if (error) throw new Error(error.message);
    return row as Row;
  }

  async update(table: TableName, id: string, patch: Record<string, unknown>) {
    const { id: _i, organisation_id: _o, created_at: _c, updated_at: _u, ...rest } = patch;
    void _i; void _o; void _c; void _u;
    const { data, error } = await this.db.from(table).update(rest).eq("id", id).eq("organisation_id", this.orgId).select("*").single();
    if (error) throw new Error(error.message);
    return data as Row;
  }

  async remove(table: TableName, id: string) {
    const { error } = await this.db.from(table).delete().eq("id", id).eq("organisation_id", this.orgId);
    if (error) throw new Error(error.message);
  }
}
