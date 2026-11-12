"use client";

import * as React from "react";
import { EntityTable } from "@/components/app/entity-table";
import type { Lookups, Row } from "@/lib/types";
import { cn } from "@/lib/utils";

type View = "all" | "open" | "overdue" | "escalated" | "no_evidence";

/** Central action tracker: the generic table plus quick views for what needs chasing. */
export function ActionTracker({ rows, lookups, canWrite, today }: { rows: Row[]; lookups: Lookups; canWrite: boolean; today: string }) {
  const [view, setView] = React.useState<View>("open");
  const sets: Record<View, Row[]> = {
    all: rows,
    open: rows.filter((t) => t.status !== "done"),
    overdue: rows.filter((t) => t.status !== "done" && t.due_date && t.due_date < today),
    escalated: rows.filter((t) => t.escalated && t.status !== "done"),
    no_evidence: rows.filter((t) => t.status === "done" && !String(t.evidence ?? "").trim()),
  };
  const label: Record<View, string> = { all: "All", open: "Open", overdue: "Overdue", escalated: "Escalated", no_evidence: "Done, no evidence" };
  const toolbar = (
    <div role="group" aria-label="Quick view" className="flex flex-wrap gap-1">
      {(Object.keys(label) as View[]).map((v) => (
        <button
          key={v}
          onClick={() => setView(v)}
          aria-pressed={view === v}
          className={cn(
            "h-7 rounded-full border px-2.5 text-xs transition-colors",
            view === v ? "border-navy bg-navy text-primary-foreground" : "border-border text-muted-foreground hover:text-foreground",
            v === "overdue" && sets.overdue.length && view !== v && "text-rag-red",
          )}
        >
          {label[v]} <span className="num opacity-70">{sets[v].length}</span>
        </button>
      ))}
    </div>
  );
  return (
    <EntityTable
      table="tasks"
      rows={sets[view]}
      lookups={lookups}
      canWrite={canWrite}
      columns={["title", "project_id", "owner_id", "due_date", "status", "priority", "escalated"]}
      filters={["status", "priority"]}
      toolbar={toolbar}
      emptyText={view === "no_evidence" ? "Every completed action has evidence recorded." : undefined}
    />
  );
}
