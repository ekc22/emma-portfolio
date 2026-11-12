import { cn } from "@/lib/utils";
import type { Row } from "@/lib/types";

/** 5×5 likelihood × impact grid of open risks. */
export function RiskHeatmap({ risks }: { risks: Row[] }) {
  const open = risks.filter((r) => r.status !== "closed");
  const count = (l: number, i: number) => open.filter((r) => Number(r.likelihood) === l && Number(r.impact) === i).length;
  const tone = (score: number) => (score >= 15 ? "bg-[#F4E1DE]" : score >= 8 ? "bg-[#F6EBD6]" : "bg-sage-soft/70");
  return (
    <figure className="w-full max-w-[280px]">
      <div className="flex gap-2">
        <div className="flex w-4 items-center justify-center"><span className="-rotate-90 whitespace-nowrap eyebrow">Likelihood</span></div>
        <div className="grid flex-1 grid-cols-5 gap-1" role="table" aria-label="Open risks by likelihood and impact">
          {[5, 4, 3, 2, 1].map((l) =>
            [1, 2, 3, 4, 5].map((i) => {
              const n = count(l, i);
              return (
                <div key={`${l}-${i}`} role="cell" aria-label={`Likelihood ${l}, impact ${i}: ${n} risks`} className={cn("flex aspect-square items-center justify-center rounded-sm text-xs num", tone(l * i), n ? "font-semibold text-foreground" : "text-transparent")}>
                  {n || "·"}
                </div>
              );
            }),
          )}
        </div>
      </div>
      <figcaption className="mt-1 pl-6 text-center eyebrow">Impact →</figcaption>
    </figure>
  );
}
