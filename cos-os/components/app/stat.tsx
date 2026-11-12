import * as React from "react";
import { cn } from "@/lib/utils";
import { DataTag, type Provenance } from "./provenance";

/** A single headline figure with its provenance and, where calculated, its method. */
export function Stat({ label, value, sub, kind = "verified", method, tone, className }: { label: string; value: React.ReactNode; sub?: React.ReactNode; kind?: Provenance; method?: string; tone?: "red" | "amber" | "green"; className?: string }) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-1 rounded-lg border border-border bg-surface px-4 py-3 shadow-subtle", kind === "indicative" && "border-dashed", className)} title={method}>
      <span className="eyebrow leading-4">{label}</span>
      <div className={cn("num text-[22px] font-semibold tracking-tight", tone === "red" && "text-rag-red", tone === "amber" && "text-rag-amber", tone === "green" && "text-rag-green")}>{value}</div>
      {sub && <div className="text-xs text-muted-foreground">{sub}</div>}
      <DataTag kind={kind} className="mt-auto pt-1" />
    </div>
  );
}

export function Meter({ value, max = 100, className, tone = "navy" }: { value: number; max?: number; className?: string; tone?: "navy" | "sage" | "amber" | "red" }) {
  const pct = Math.max(0, Math.min(100, (value / (max || 1)) * 100));
  const c = { navy: "bg-navy", sage: "bg-sage", amber: "bg-rag-amber", red: "bg-rag-red" }[tone];
  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-muted", className)} role="meter" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100}>
      <div className={cn("h-full rounded-full", c)} style={{ width: `${pct}%` }} />
    </div>
  );
}
