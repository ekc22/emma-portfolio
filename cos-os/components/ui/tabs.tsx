"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/** Lightweight accessible tabs (roving focus with arrow keys). */
export function Tabs({ tabs, initial, children, className }: { tabs: { id: string; label: React.ReactNode }[]; initial?: string; children: (active: string) => React.ReactNode; className?: string }) {
  const [active, setActive] = React.useState(initial ?? tabs[0]?.id);
  const refs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const onKey = (e: React.KeyboardEvent, i: number) => {
    const n = e.key === "ArrowRight" ? i + 1 : e.key === "ArrowLeft" ? i - 1 : null;
    if (n === null) return;
    const j = (n + tabs.length) % tabs.length;
    setActive(tabs[j].id);
    refs.current[j]?.focus();
  };
  return (
    <div className={className}>
      <div role="tablist" className="flex gap-1 overflow-x-auto border-b border-border">
        {tabs.map((t, i) => (
          <button
            key={t.id}
            ref={(el) => { refs.current[i] = el; }}
            role="tab"
            aria-selected={active === t.id}
            tabIndex={active === t.id ? 0 : -1}
            onClick={() => setActive(t.id)}
            onKeyDown={(e) => onKey(e, i)}
            className={cn("-mb-px whitespace-nowrap border-b-2 px-3 py-2 font-sans text-[11.5px] font-semibold uppercase tracking-[0.1em] transition-colors", active === t.id ? "border-cherry text-cherry" : "border-transparent text-muted-foreground hover:text-foreground")}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div role="tabpanel" className="pt-4">{children(active)}</div>
    </div>
  );
}
