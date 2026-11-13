import { entity, humanize, type FieldDef, type TableName } from "./schema";

/** Record types that can be imported from CSV. */
export const IMPORTABLE: TableName[] = [
  "investors", "investor_contacts", "fundraising_opportunities", "investor_interactions",
  "commercial_accounts", "commercial_contacts", "commercial_opportunities", "commercial_activities",
  "projects", "milestones", "tasks", "risks", "decisions",
  "strategic_objectives", "kpis", "users", "requests", "routines",
];

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

const SYNONYMS: Record<string, string[]> = {
  owner_id: ["owner", "assignee", "assignedto", "responsible", "accountable", "dealowner", "relationshipowner"],
  account_id: ["organisation", "organization", "company", "account", "customer", "client"],
  investor_id: ["investor", "fund", "firm"],
  project_id: ["project"],
  due_date: ["due", "deadline", "duedate", "dueby"],
  expected_close: ["closedate", "close", "expectedclosedate"],
  value: ["amount", "dealvalue", "acv", "arr", "value"],
  full_name: ["name", "fullname", "contact", "person"],
  email: ["email", "emailaddress"],
  stage: ["stage", "dealstage", "status"],
  title: ["title", "name", "task", "action", "subject"],
};

/** Guesses which field each CSV column should fill. Returns field key or "" (ignore). */
export function autoMap(table: TableName, headers: string[]) {
  const fields = entity(table).fields.filter((f) => !f.system);
  const used = new Set<string>();
  return headers.map((h) => {
    const n = norm(h);
    const match =
      fields.find((f) => !used.has(f.key) && (norm(f.key) === n || norm(f.label) === n || norm(f.key.replace(/_id$/, "")) === n)) ??
      fields.find((f) => !used.has(f.key) && (SYNONYMS[f.key] ?? []).includes(n));
    if (match) used.add(match.key);
    return match?.key ?? "";
  });
}

/** RFC 4180-ish CSV parser: quotes, escaped quotes, CRLF, BOM, comma/semicolon/tab. */
export function parseCsv(text: string): string[][] {
  const src = text.replace(/^﻿/, "");
  const first = src.split(/\r?\n/, 1)[0] ?? "";
  const delim = [",", ";", "\t"].sort((a, b) => first.split(b).length - first.split(a).length)[0];
  const rows: string[][] = [];
  let row: string[] = [], cell = "", inQ = false;
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (inQ) {
      if (c === '"' && src[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') inQ = false;
      else cell += c;
    } else if (c === '"') inQ = true;
    else if (c === delim) { row.push(cell); cell = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && src[i + 1] === "\n") i++;
      row.push(cell); rows.push(row); row = []; cell = "";
    } else cell += c;
  }
  if (cell.length || row.length) { row.push(cell); rows.push(row); }
  return rows.filter((r) => r.some((c) => c.trim() !== ""));
}

/** Converts a spreadsheet value into the form validation expects. Relations are resolved separately. */
export function coerce(field: FieldDef, raw: string): string {
  const v = raw.trim();
  if (!v) return "";
  switch (field.type) {
    case "currency":
    case "number":
    case "percent":
    case "score": {
      const m = v.replace(/[£$€,\s%]/g, "").match(/^(-?\d*\.?\d+)([kmb])?$/i);
      if (!m) return v;
      const mult = { k: 1e3, m: 1e6, b: 1e9 }[(m[2] ?? "").toLowerCase() as "k" | "m" | "b"] ?? 1;
      return String(Number(m[1]) * mult);
    }
    case "date": {
      const uk = v.match(/^(\d{1,2})[/.-](\d{1,2})[/.-](\d{2,4})$/);
      if (uk) {
        const y = uk[3].length === 2 ? `20${uk[3]}` : uk[3];
        return `${y}-${uk[2].padStart(2, "0")}-${uk[1].padStart(2, "0")}`;
      }
      if (/^\d{4}-\d{2}-\d{2}/.test(v)) return v.slice(0, 10);
      const d = new Date(v);
      return Number.isNaN(d.getTime()) ? v : d.toISOString().slice(0, 10);
    }
    case "boolean":
      return /^(y|yes|true|1|x|✓)$/i.test(v) ? "true" : "false";
    case "select": {
      const opts = field.options ?? [];
      const hit = opts.find((o) => norm(o) === norm(v) || norm(humanize(o)) === norm(v));
      return hit ?? v;
    }
    default:
      return v;
  }
}
