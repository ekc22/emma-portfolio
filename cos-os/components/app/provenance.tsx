import { BadgeCheck, Calculator, Sparkles, CircleDashed } from "lucide-react";
import { cn } from "@/lib/utils";

export type Provenance = "verified" | "calculated" | "indicative" | "ai";

const META: Record<Provenance, { label: string; title: string; cls: string; Icon: typeof Sparkles }> = {
  verified: { label: "Verified", title: "Recorded business data", cls: "text-sage-deep", Icon: BadgeCheck },
  calculated: { label: "Calculated", title: "Computed from recorded data. Hover a figure to see the method.", cls: "text-navy-soft", Icon: Calculator },
  indicative: { label: "Indicative", title: "Pipeline or stated interest. Not committed.", cls: "text-stone-deep", Icon: CircleDashed },
  ai: { label: "AI-generated", title: "Written by Claude. Check against the linked records before relying on it.", cls: "text-ai", Icon: Sparkles },
};

/** Marks where a figure or passage comes from, so AI output is never mistaken for verified data. */
export function DataTag({ kind, className }: { kind: Provenance; className?: string }) {
  const m = META[kind];
  return (
    <span title={m.title} className={cn("inline-flex items-center gap-1 text-2xs font-medium", m.cls, className)}>
      <m.Icon className="size-3" aria-hidden />
      {m.label}
    </span>
  );
}
