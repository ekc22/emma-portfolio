import Link from "next/link";
import type { Row } from "@/lib/types";
import { cn, formatDate } from "@/lib/utils";
import { RagDot } from "@/components/app/status";

const DAY = 86_400_000;
const t = (iso: string) => new Date(iso.slice(0, 10) + "T00:00:00").getTime();

/** Gantt-style view: one bar per project (start → target), milestones as markers, a line for today. */
export function Timeline({ projects, milestones, today }: { projects: Row[]; milestones: Row[]; today: string }) {
  const rows = projects.filter((p) => p.start_date && p.target_date).sort((a, b) => String(a.start_date).localeCompare(String(b.start_date)));
  if (!rows.length) return <p className="py-8 text-center text-[13px] text-muted-foreground">Add start and target dates to projects to see them on the timeline.</p>;
  const dates = [...rows.flatMap((p) => [t(p.start_date), t(p.target_date)]), ...milestones.filter((m) => m.due_date).map((m) => t(m.due_date)), t(today)];
  const min = Math.min(...dates) - 7 * DAY;
  const max = Math.max(...dates) + 7 * DAY;
  const pct = (ms: number) => ((ms - min) / (max - min)) * 100;

  // month ticks
  const ticks: { label: string; at: number }[] = [];
  const d = new Date(min);
  d.setDate(1);
  d.setMonth(d.getMonth() + 1);
  while (d.getTime() < max) {
    ticks.push({ label: d.toLocaleDateString("en-GB", { month: "short", year: "2-digit" }), at: pct(d.getTime()) });
    d.setMonth(d.getMonth() + 1);
  }
  const todayAt = pct(t(today));

  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-surface shadow-subtle">
      <div className="min-w-[760px]">
        <div className="grid grid-cols-[220px_1fr] border-b border-border">
          <div className="px-3 py-2 eyebrow">Project</div>
          <div className="relative h-8">
            {ticks.map((k) => (
              <span key={k.label + k.at} className="absolute top-2 -translate-x-1/2 text-2xs text-muted-foreground num" style={{ left: `${k.at}%` }}>{k.label}</span>
            ))}
          </div>
        </div>
        {rows.map((p) => {
          const left = pct(t(p.start_date));
          const width = Math.max(pct(t(p.target_date)) - left, 0.8);
          const late = p.target_date < today && !["completed", "cancelled"].includes(p.status);
          const ms = milestones.filter((m) => m.project_id === p.id && m.due_date);
          return (
            <div key={p.id} className="grid grid-cols-[220px_1fr] border-b border-border/60 last:border-0">
              <div className="flex min-w-0 items-center gap-2 px-3 py-2.5">
                <RagDot rag={p.rag} />
                <Link href={`/records/projects/${p.id}`} className="truncate text-[13px] hover:underline underline-offset-2">{p.name}</Link>
              </div>
              <div className="relative h-11">
                {ticks.map((k) => <span key={k.at} className="absolute inset-y-0 w-px bg-border/60" style={{ left: `${k.at}%` }} aria-hidden />)}
                <div
                  className={cn("absolute top-1/2 h-3.5 -translate-y-1/2 overflow-hidden rounded-sm", p.status === "on_hold" ? "bg-stone-soft" : "bg-sage-soft", late && "ring-1 ring-rag-red")}
                  style={{ left: `${left}%`, width: `${width}%` }}
                  title={`${p.name}: ${formatDate(p.start_date)} → ${formatDate(p.target_date)}${late ? " (past target)" : ""}`}
                >
                  <div className={cn("h-full", p.status === "on_hold" ? "bg-stone" : "bg-sage")} style={{ width: `${Math.min(Number(p.progress) || 0, 100)}%` }} />
                </div>
                {ms.map((m) => {
                  const overdue = m.status !== "complete" && m.due_date < today;
                  return (
                    <Link
                      key={m.id}
                      href={`/records/milestones/${m.id}`}
                      className={cn("absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45 border border-surface", m.status === "complete" ? "bg-rag-green" : overdue ? "bg-rag-red" : "bg-navy")}
                      style={{ left: `${pct(t(m.due_date))}%` }}
                      title={`${m.title}: ${formatDate(m.due_date)} (${m.status.replace(/_/g, " ")})`}
                      aria-label={`Milestone ${m.title}, due ${formatDate(m.due_date)}, ${m.status.replace(/_/g, " ")}`}
                    />
                  );
                })}
                <span className="absolute inset-y-0 w-px bg-rag-red/70" style={{ left: `${todayAt}%` }} aria-hidden />
              </div>
            </div>
          );
        })}
        <div className="flex flex-wrap items-center gap-4 border-t border-border px-3 py-2 text-2xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5"><span className="h-2 w-5 rounded-sm bg-sage" /> Progress</span>
          <span className="inline-flex items-center gap-1.5"><span className="size-2 rotate-45 bg-navy" /> Milestone</span>
          <span className="inline-flex items-center gap-1.5"><span className="size-2 rotate-45 bg-rag-red" /> Overdue milestone</span>
          <span className="inline-flex items-center gap-1.5"><span className="size-2 rotate-45 bg-rag-green" /> Complete</span>
          <span className="inline-flex items-center gap-1.5"><span className="h-3 w-px bg-rag-red" /> Today</span>
        </div>
      </div>
    </div>
  );
}
