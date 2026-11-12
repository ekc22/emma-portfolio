import "server-only";
import fs from "node:fs";
import path from "node:path";
import { entity, TABLES, type TableName } from "../schema";
import type { Row } from "../types";
import type { ListOptions, Store } from "./store";
import { buildSeed, demoMemberships, resolveTokens } from "./seed";

/**
 * Demo-mode persistence: a JSON file at .data/cos-os.json, created from the
 * fictional seed on first use. Survives restarts; delete the file (or run
 * `npm run demo:reset`) to start again.
 */
const FILE = path.join(process.cwd(), ".data", "cos-os.json");

type DB = { version: 1; seededAt: string; tables: Record<string, Row[]>; memberships: ReturnType<typeof demoMemberships> };

function freshDb(): DB {
  const tables = resolveTokens(buildSeed()) as unknown as Record<string, Row[]>;
  for (const t of TABLES) tables[t] ||= [];
  return { version: 1, seededAt: new Date().toISOString(), tables, memberships: demoMemberships() };
}

export function loadDb(): DB {
  try {
    return JSON.parse(fs.readFileSync(FILE, "utf8")) as DB;
  } catch {
    const db = freshDb();
    saveDb(db);
    return db;
  }
}

function saveDb(db: DB) {
  fs.mkdirSync(path.dirname(FILE), { recursive: true });
  const tmp = FILE + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(db));
  fs.renameSync(tmp, FILE);
}

export function resetDemoDb() {
  const db = freshDb();
  saveDb(db);
  return db;
}

const norm = (v: unknown) => (v === undefined ? null : v);

function compare(a: unknown, b: unknown) {
  if (a === b) return 0;
  if (a === null || a === undefined || a === "") return 1; // empties last
  if (b === null || b === undefined || b === "") return -1;
  if (typeof a === "number" && typeof b === "number") return a - b;
  return String(a).localeCompare(String(b));
}

export function applyList(rows: Row[], table: TableName, opts: ListOptions = {}) {
  let out = rows;
  if (opts.where) {
    for (const [k, v] of Object.entries(opts.where)) out = out.filter((r) => norm(r[k]) === v);
  }
  if (opts.search?.trim()) {
    const q = opts.search.trim().toLowerCase();
    const fields = entity(table).search;
    out = out.filter((r) => fields.some((f) => String(r[f] ?? "").toLowerCase().includes(q)));
  }
  const order = opts.orderBy ?? entity(table).sort;
  if (order) {
    const [f, dir] = order;
    const empty = (v: unknown) => v === null || v === undefined || v === "";
    const filled = out.filter((r) => !empty(r[f])).sort((a, b) => (dir === "asc" ? 1 : -1) * compare(a[f], b[f]));
    out = [...filled, ...out.filter((r) => empty(r[f]))]; // empties last either way
  }
  if (opts.limit) out = out.slice(0, opts.limit);
  return out;
}

export class LocalStore implements Store {
  constructor(private orgId: string) {}

  async list(table: TableName, opts?: ListOptions) {
    const rows = (loadDb().tables[table] ?? []).filter((r) => r.organisation_id === this.orgId);
    return applyList(rows, table, opts);
  }

  async get(table: TableName, id: string) {
    return (loadDb().tables[table] ?? []).find((r) => r.id === id && r.organisation_id === this.orgId) ?? null;
  }

  async insert(table: TableName, data: Record<string, unknown>) {
    const db = loadDb();
    const now = new Date().toISOString();
    const row = { ...data, id: (data.id as string) || crypto.randomUUID(), organisation_id: this.orgId, created_at: now, updated_at: now } as Row;
    (db.tables[table] ||= []).push(row);
    saveDb(db);
    return row;
  }

  async update(table: TableName, id: string, patch: Record<string, unknown>) {
    const db = loadDb();
    const rows = db.tables[table] ?? [];
    const i = rows.findIndex((r) => r.id === id && r.organisation_id === this.orgId);
    if (i < 0) throw new Error("Record not found");
    const { id: _id, organisation_id: _org, created_at: _c, ...rest } = patch;
    void _id; void _org; void _c;
    rows[i] = { ...rows[i], ...rest, updated_at: new Date().toISOString() };
    saveDb(db);
    return rows[i];
  }

  async remove(table: TableName, id: string) {
    const db = loadDb();
    db.tables[table] = (db.tables[table] ?? []).filter((r) => !(r.id === id && r.organisation_id === this.orgId));
    saveDb(db);
  }
}
