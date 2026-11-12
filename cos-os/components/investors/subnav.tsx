"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/investors", label: "Dashboard" },
  { href: "/investors/crm", label: "Investor CRM" },
  { href: "/investors/fundraising", label: "Fundraising pipeline" },
  { href: "/investors/diligence", label: "Due diligence" },
  { href: "/investors/reporting", label: "Board & investor reporting" },
  { href: "/investors/capital", label: "Capital & runway" },
];

export function InvestorSubnav() {
  const path = usePathname();
  return (
    <nav aria-label="Investor Relations Desk" className="-mt-2 mb-6 flex gap-1 overflow-x-auto border-b border-border">
      {ITEMS.map((i) => {
        const active = i.href === "/investors" ? path === "/investors" : path.startsWith(i.href);
        return (
          <Link key={i.href} href={i.href} aria-current={active ? "page" : undefined} className={cn("-mb-px whitespace-nowrap border-b-2 px-3 py-2 font-sans text-[11.5px] font-semibold uppercase tracking-[0.1em]", active ? "border-cherry text-cherry" : "border-transparent text-muted-foreground hover:text-foreground")}>
            {i.label}
          </Link>
        );
      })}
    </nav>
  );
}
