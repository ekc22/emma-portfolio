import "server-only";
import { canRead, canSeeInvestors } from "../auth/permissions";
import { getStore, listIfAllowed } from "../data";
import type { Store } from "../data/store";
import { ENTITIES, TABLES, entity, type TableName } from "../schema";
import type { Lookups, Row, Session } from "../types";
import { computeSignals, type Bundle } from "../analytics";

/**
 * Everything the AI may see for one request, already filtered by the user's role.
 * Rows are loaded lazily and cached for the life of the request.
 */
export class AiContext {
  private cache = new Map<TableName, Row[]>();
  private lookupCache: Lookups | null = null;
  constructor(public session: Session, public store: Store) {}

  static async create(session: Session) {
    return new AiContext(session, await getStore(session));
  }

  readable(table: TableName) {
    return canRead(table, this.session.role) && table !== "audit_logs";
  }

  async rows(table: TableName) {
    if (!this.cache.has(table)) this.cache.set(table, await listIfAllowed(this.store, this.session, table));
    return this.cache.get(table)!;
  }

  invalidate(table: TableName) {
    this.cache.delete(table);
    this.lookupCache = null;
  }

  async lookups(): Promise<Lookups> {
    if (this.lookupCache) return this.lookupCache;
    const out: Lookups = {};
    for (const t of TABLES) {
      if (!this.readable(t) || t === "ai_recommendations") continue;
      const tf = ENTITIES[t].titleField;
      out[t] = Object.fromEntries((await this.rows(t)).map((r) => [r.id, String(r[tf] ?? "")]));
    }
    this.lookupCache = out;
    return out;
  }

  /** A compact, model-friendly view of a record with relation labels resolved. */
  async compact(table: TableName, row: Row, long = false) {
    const lk = await this.lookups();
    const out: Record<string, unknown> = { id: row.id };
    for (const f of entity(table).fields) {
      const v = row[f.key];
      if (v === null || v === undefined || v === "") continue;
      if (f.type === "relation") {
        out[f.key] = v;
        out[f.key.replace(/_id$/, "")] = lk[f.relation!]?.[v] ?? "(restricted)";
      } else if (f.type === "textarea" && !long) {
        out[f.key] = String(v).length > 280 ? String(v).slice(0, 280) + "…" : v;
      } else out[f.key] = v;
    }
    if (table === "reports" && long) out.body = row.body;
    return out;
  }

  async bundle(): Promise<Bundle> {
    const t = async (x: TableName) => (this.readable(x) ? this.rows(x) : []);
    return {
      objectives: await t("strategic_objectives"), kpis: await t("kpis"), projects: await t("projects"), milestones: await t("milestones"),
      tasks: await t("tasks"), dependencies: await t("dependencies"), risks: await t("risks"), decisions: await t("decisions"),
      commercial_opportunities: await t("commercial_opportunities"), investors: await t("investors"), fundraising_rounds: await t("fundraising_rounds"),
      fundraising_opportunities: await t("fundraising_opportunities"), investor_commitments: await t("investor_commitments"), capital_receipts: await t("capital_receipts"),
      due_diligence_requests: await t("due_diligence_requests"), investor_interactions: await t("investor_interactions"), financial_snapshots: await t("financial_snapshots"),
      users: await t("users"),
      status_updates: await t("status_updates"), routines: await t("routines"), requests: await t("requests"),
    };
  }

  async signals() {
    return computeSignals(await this.bundle(), canSeeInvestors(this.session.role));
  }
}
