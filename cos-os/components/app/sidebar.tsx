"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Lock, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export const NAV = [
  { n: "01", label: "Executive Command Centre", href: "/" },
  { n: "02", label: "Strategy & Objectives", href: "/strategy" },
  { n: "03", label: "Projects & Delivery", href: "/projects" },
  { n: "04", label: "Commercial Pipeline", href: "/pipeline" },
  { n: "05", label: "Investor Relations Desk", href: "/investors", investor: true },
  { n: "06", label: "Meetings & Decisions", href: "/meetings" },
  { n: "07", label: "Intelligence & Reporting", href: "/intelligence" },
  { n: "08", label: "AI Chief of Staff", href: "/agent" },
  { n: "09", label: "Settings & Integrations", href: "/settings" },
] as const;

export function Sidebar({ orgName, footer, canSeeInvestors, pendingProposals }: { orgName: string; footer: React.ReactNode; canSeeInvestors: boolean; pendingProposals: number }) {
  const path = usePathname();
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => setOpen(false), [path]);
  const active = (href: string) => (href === "/" ? path === "/" : path.startsWith(href));

  const nav = (
    <nav aria-label="Main" className="flex flex-col gap-0.5">
      {NAV.map((item) => {
        const locked = "investor" in item && item.investor && !canSeeInvestors;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active(item.href) ? "page" : undefined}
            className={cn(
              "group flex items-center gap-3 rounded-md px-2.5 py-1.5 text-[13px] transition-colors",
              active(item.href) ? "bg-surface font-medium text-foreground shadow-subtle" : "text-muted-foreground hover:bg-surface/70 hover:text-foreground",
            )}
          >
            <span className="num w-5 text-2xs text-muted-foreground/80">{item.n}</span>
            <span className="flex-1 truncate">{item.label}</span>
            {locked && <Lock className="size-3 text-muted-foreground/70" aria-label="Restricted for your role" />}
            {item.href === "/agent" && pendingProposals > 0 && (
              <span className="num rounded-full bg-ai-soft px-1.5 text-2xs font-medium text-ai" aria-label={`${pendingProposals} AI proposals awaiting approval`}>{pendingProposals}</span>
            )}
          </Link>
        );
      })}
    </nav>
  );

  const brand = (
    <Link href="/" className="block px-2.5">
      <div className="font-serif text-xl font-medium tracking-tight">CoS OS</div>
      <div className="truncate text-2xs text-muted-foreground">{orgName}</div>
    </Link>
  );

  return (
    <>
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-background/95 px-4 py-2.5 backdrop-blur lg:hidden">
        {brand}
        <button onClick={() => setOpen(true)} className="rounded-md p-2 hover:bg-muted" aria-label="Open navigation" aria-expanded={open}>
          <Menu className="size-4" />
        </button>
      </div>
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation">
          <div className="absolute inset-0 bg-navy/20" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 flex w-72 flex-col gap-6 overflow-y-auto border-r border-border bg-background p-3 pt-4">
            <div className="flex items-start justify-between">{brand}<button onClick={() => setOpen(false)} className="rounded-md p-1.5 hover:bg-muted" aria-label="Close navigation"><X className="size-4" /></button></div>
            {nav}
            <div className="mt-auto">{footer}</div>
          </div>
        </div>
      )}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col gap-6 overflow-y-auto border-r border-border bg-[#F2EFE8] p-3 pt-5 lg:flex">
        {brand}
        {nav}
        <div className="mt-auto">{footer}</div>
      </aside>
    </>
  );
}
