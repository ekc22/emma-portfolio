import Link from "next/link";
import type { FieldDef } from "@/lib/schema";
import type { Lookups } from "@/lib/types";
import { formatDate, formatDateTime, formatMoney, daysFromToday, cn } from "@/lib/utils";
import { StatusBadge } from "./status";

const DATE_SENSITIVE = new Set(["due_date", "deadline", "target_date", "next_action_date", "next_follow_up", "expected_close", "review_date", "needed_by"]);

/** Renders a stored value according to its field type. Works on server and client. */
export function FieldValue({ field, value, lookups, row, currency = "GBP", compact = true }: { field: FieldDef; value: unknown; lookups?: Lookups; row?: Record<string, unknown>; currency?: string; compact?: boolean }) {
  if (value === null || value === undefined || value === "") return <span className="text-muted-foreground/70">—</span>;
  switch (field.type) {
    case "currency":
      return <span className="num">{formatMoney(Number(value), currency, compact)}</span>;
    case "percent":
      return <span className="num">{Number(value)}%</span>;
    case "number":
    case "score":
      return <span className="num">{Number(value).toLocaleString("en-GB")}</span>;
    case "boolean":
      return <span>{value ? "Yes" : "No"}</span>;
    case "date": {
      const d = daysFromToday(String(value));
      const done = row && ["done", "complete", "Won", "Lost", "accepted", "submitted", "approved", "achieved"].includes(String(row.status ?? row.stage));
      const late = DATE_SENSITIVE.has(field.key) && d !== null && d < 0 && !done;
      return <span className={cn("num whitespace-nowrap", late && "font-medium text-rag-red")} title={late ? `${-d} days overdue` : undefined}>{formatDate(String(value))}</span>;
    }
    case "datetime":
      return <span className="num whitespace-nowrap">{formatDateTime(String(value))}</span>;
    case "select":
      return <StatusBadge value={String(value)} />;
    case "relation": {
      const label = field.relation ? lookups?.[field.relation]?.[String(value)] : undefined;
      if (!label) return <span className="text-muted-foreground/70">Restricted or removed</span>;
      return (
        <Link href={`/records/${field.relation}/${value}`} className="text-navy underline-offset-2 hover:underline">
          {label}
        </Link>
      );
    }
    case "textarea":
      return <span className="line-clamp-2 whitespace-pre-line">{String(value)}</span>;
    default:
      return <span>{String(value)}</span>;
  }
}
