import Link from "next/link";
import type { Signal } from "@/lib/analytics";
import { cn } from "@/lib/utils";

const SEV = { high: "bg-rag-red", medium: "bg-rag-amber", low: "bg-stone" };
const AREA: Record<Signal["area"], string> = { strategy: "Strategy", delivery: "Delivery", operations: "Operations", commercial: "Commercial", investors: "Investors", capital: "Capital", decisions: "Decisions" };

/** Computed signals with their evidence. Each row expands to the records behind it. */
export function SignalList({ signals, limit, empty = "Nothing needs attention." }: { signals: Signal[]; limit?: number; empty?: string }) {
  const items = limit ? signals.slice(0, limit) : signals;
  if (!items.length) return <p className="py-6 text-center text-[13px] text-muted-foreground">{empty}</p>;
  return (
    <ul className="divide-y divide-border">
      {items.map((s) => (
        <li key={s.key}>
          <details className="group">
            <summary className="flex cursor-pointer list-none items-start gap-3 py-2.5 pr-1 [&::-webkit-details-marker]:hidden">
              <span className={cn("mt-1.5 size-2 shrink-0 rounded-full", SEV[s.severity])} aria-label={`${s.severity} severity`} />
              <span className="min-w-0 flex-1">
                <span className="block text-[13px] font-medium leading-snug">{s.title}</span>
                <span className="block truncate text-xs text-muted-foreground">{s.detail}</span>
              </span>
              <span className="eyebrow shrink-0 pt-0.5">{AREA[s.area]}</span>
            </summary>
            <div className="mb-2 ml-5 rounded-md bg-background px-3 py-2 text-xs">
              <div className="eyebrow mb-1">Evidence</div>
              <ul className="space-y-0.5">
                {s.refs.map((r) => (
                  <li key={r.table + r.id}>
                    <Link href={`/records/${r.table}/${r.id}`} className="text-navy underline-offset-2 hover:underline">{r.label || r.table}</Link>
                    <span className="text-muted-foreground"> · {r.table.replace(/_/g, " ")}</span>
                  </li>
                ))}
              </ul>
            </div>
          </details>
        </li>
      ))}
    </ul>
  );
}
