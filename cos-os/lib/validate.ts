import { entity, humanize, type TableName } from "./schema";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

export type Clean = { ok: true; data: Record<string, unknown> } | { ok: false; errors: Record<string, string> };

/**
 * Coerces and validates input against the entity registry.
 * `partial` validates only the keys present (for updates).
 */
export function cleanRecord(table: TableName, input: Record<string, unknown>, partial = false): Clean {
  const def = entity(table);
  const data: Record<string, unknown> = {};
  const errors: Record<string, string> = {};

  for (const f of def.fields) {
    if (f.system && !(f.key in input)) continue;
    if (partial && !(f.key in input)) continue;
    let v = input[f.key];
    if (typeof v === "string") v = v.trim();
    const empty = v === undefined || v === null || v === "";

    if (empty) {
      if (f.type === "boolean") data[f.key] = false;
      else data[f.key] = null;
      if (f.required) errors[f.key] = `${f.label} is required`;
      continue;
    }

    switch (f.type) {
      case "number":
      case "currency":
      case "percent":
      case "score": {
        const n = Number(String(v).replace(/[£$€,\s%]/g, ""));
        if (!Number.isFinite(n)) errors[f.key] = `${f.label} must be a number`;
        else if (f.type === "percent" && (n < 0 || n > 100)) errors[f.key] = `${f.label} must be between 0 and 100`;
        else if (f.type === "score" && (n < 1 || n > 5)) errors[f.key] = `${f.label} must be 1 to 5`;
        else data[f.key] = n;
        break;
      }
      case "boolean":
        data[f.key] = v === true || v === "true" || v === "on" || v === "1";
        break;
      case "date": {
        const s = String(v).slice(0, 10);
        if (!DATE.test(s)) errors[f.key] = `${f.label} must be a date`;
        else data[f.key] = s;
        break;
      }
      case "datetime": {
        const d = new Date(String(v));
        if (Number.isNaN(d.getTime())) errors[f.key] = `${f.label} must be a date and time`;
        else data[f.key] = d.toISOString();
        break;
      }
      case "select":
        if (f.options && !f.options.includes(String(v))) errors[f.key] = `${f.label} must be one of: ${f.options.map(humanize).join(", ")}`;
        else data[f.key] = String(v);
        break;
      case "relation":
        if (!UUID.test(String(v))) errors[f.key] = `${f.label} is not a valid record`;
        else data[f.key] = String(v);
        break;
      default:
        data[f.key] = String(v).slice(0, 20000);
    }
  }
  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, data };
}
