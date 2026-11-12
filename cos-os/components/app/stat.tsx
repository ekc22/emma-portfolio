import * as React from "react";
import { cn } from "@/lib/utils";
import { DataTag, type Provenance } from "./provenance";

/** A single headline figure with its provenance and, where calculated, its method. */
export function Stat({ label, value, sub, kind = "verified", method, tone, className }: { label: string; value: React.ReactNode; sub?: React.ReactNode; kind?: Provenance; method?: string; tone?: "red" | "amber" | "green"; className?: string }) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-1.5 border-t-2 border-oxblood bg-transparent px-0.5 pt-3 pb-1", kind === "indicative" && "border-dashed border-oxblood/60", className)} title={method}>
      <span className="eyebrow leading-4">{label}</span>
      <div className={cn("num font-serif text-[2.5rem] leading-none tracking-[-0.02em]", tone === "red" && "text-rag-red", tone === "amber" && "text-rag-amber", tone === "green" && "text-rag-green")}>{value}</div>
      {sub && <div className="text-xs text-muted-foreground">{sub}</div>}
      <DataTag kind={kind} className="mt-auto pt-1" />
    </div>
  );
}

export function Meter({ value, max = 100, className, tone = "navy" }: { value: number; max?: number; className?: string; tone?: "navy" | "sage" | "amber" | "red" }) {
  const pct = Math.max(0, Math.min(100, (value / (max || 1)) * 100));
  const c = { navy: "bg-oxblood", sage: "bg-cherry", amber: "bg-rag-amber", red: "bg-rag-red" }[tone];
  return (
    <div className={cn("h-1 w-full overflow-hidden bg-linen-deep", className)} role="meter" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100}>
      <div className={cn("h-full", c)} style={{ width: `${pct}%` }} />
    </div>
  );
}
