"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export const NAV = [
  { n: "01", label: "Command Centre", full: "Executive Command Centre", href: "/" },
  { n: "02", label: "Strategy", full: "Strategy & Objectives", href: "/strategy" },
  { n: "03", label: "Delivery", full: "Projects & Delivery", href: "/projects" },
  { n: "04", label: "Operations", full: "Team & Operations", href: "/operations" },
  { n: "05", label: "Pipeline", full: "Commercial Pipeline", href: "/pipeline" },
  { n: "06", label: "Investors", full: "Investor Relations Desk", href: "/investors", investor: true },
  { n: "07", label: "Meetings", full: "Meetings & Decisions", href: "/meetings" },
  { n: "08", label: "Intelligence", full: "Intelligence & Reporting", href: "/intelligence" },
  { n: "09", label: "Chief of Staff", full: "AI Chief of Staff", href: "/agent" },
  { n: "10", label: "Settings", full: "Settings & Integrations", href: "/settings" },
] as const;

function useLondonTime() {
  const [time, setTime] = React.useState<string | null>(null);
  React.useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/London" });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, []);
  return time;
}

/**
 * Masthead navigation (brand guidelines §08): place and time on the left, the
 * name in the centre, the person on the right; the ten desks run beneath.
 * On phones: "E." left, Menu right, and a full-screen serif menu.
 */
export function Masthead({ orgName, user, role, demo, signOut, canSeeInvestors, pendingProposals }: {
  orgName: string; user: string; role: string; demo: boolean; signOut: React.ReactNode; canSeeInvestors: boolean; pendingProposals: number;
}) {
  const path = usePathname();
  const [open, setOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const time = useLondonTime();
  React.useEffect(() => setOpen(false), [path]);
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open]);
  const active = (href: string) => (href === "/" ? path === "/" : path.startsWith(href));

  return (
    <header className={cn("sticky top-0 z-40 bg-paper/95 backdrop-blur-md transition-[border-color] duration-500", scrolled ? "border-b border-linen-deep" : "border-b border-transparent")}>
      <div className="mx-auto grid h-16 max-w-[1400px] grid-cols-[1fr_auto] items-center px-4 sm:px-6 lg:h-20 lg:grid-cols-[1fr_auto_1fr] lg:px-10">
        <p className="hidden font-sans text-[0.8125rem] tabular-nums text-muted-foreground lg:block">
          London{time && <span aria-hidden="true" suppressHydrationWarning> · {time}</span>}
          <span className="ml-3 text-muted-foreground/80">{orgName}</span>
        </p>
        <Link href="/" aria-label="CoS OS, Command Centre" className="font-serif text-[1.75rem] leading-none text-cherry lg:hidden">E.</Link>

        <Link href="/" aria-label="CoS OS, Command Centre" className="hidden items-baseline gap-3 lg:flex">
          <span aria-hidden="true" className="font-serif text-[2rem] leading-none text-cherry">E.</span>
          <span aria-hidden="true" className="wordmark text-[1.6rem]">CoS OS</span>
        </Link>

        <div className="hidden items-center justify-self-end gap-4 lg:flex">
          <div className="text-right leading-tight">
            <div className="font-serif text-[1.1rem]">{user}</div>
            <div className="label !text-[10px]">{role}{demo && " · Demo data"}</div>
          </div>
          {signOut}
        </div>

        <button onClick={() => setOpen(true)} className="label justify-self-end !text-oxblood lg:hidden" aria-expanded={open} aria-controls="mobile-menu">Menu</button>
      </div>

      <nav aria-label="Desks" className="mx-auto hidden max-w-[1400px] px-10 lg:block">
        <ul className="-mb-px flex gap-6 overflow-x-auto border-t border-oxblood pt-2.5">
          {NAV.map((item) => {
            const locked = "investor" in item && item.investor && !canSeeInvestors;
            const on = active(item.href);
            return (
              <li key={item.href} className="shrink-0">
                <Link href={item.href} aria-current={on ? "page" : undefined} title={item.full}
                  className={cn("group flex items-baseline gap-1.5 border-b-2 pb-2.5 font-serif text-[1.05rem] leading-none transition-colors duration-300", on ? "border-cherry text-cherry" : "border-transparent text-oxblood hover:text-cherry")}>
                  <span className="num font-sans text-[10px] font-semibold tracking-[0.08em] text-cherry/80">{item.n}</span>
                  {item.label}
                  {locked && <Lock className="size-3 self-center text-muted-foreground" aria-label="Restricted for your role" />}
                  {item.href === "/agent" && pendingProposals > 0 && (
                    <span className="num self-center bg-cherry px-1 font-sans text-[10px] font-semibold text-paper" aria-label={`${pendingProposals} AI proposals awaiting approval`}>{pendingProposals}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {open && (
        <div id="mobile-menu" role="dialog" aria-modal="true" aria-label="Menu" className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-paper px-5 pb-8 lg:hidden">
          <div className="flex h-16 items-center justify-between">
            <span className="font-serif text-[1.75rem] leading-none text-cherry">E.</span>
            <button onClick={() => setOpen(false)} className="label !text-oxblood" autoFocus>Close</button>
          </div>
          <ul className="mt-4 border-t border-oxblood">
            {NAV.map((item) => (
              <li key={item.href} className="border-b border-linen-deep">
                <Link href={item.href} className={cn("flex items-baseline gap-3 py-3 font-serif text-[1.9rem] leading-none", active(item.href) ? "text-cherry" : "text-oxblood")}>
                  <span className="num font-sans text-[11px] font-semibold text-cherry">{item.n}</span>
                  {item.full}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex items-end justify-between gap-4">
            <div><div className="font-serif text-xl">{user}</div><div className="label">{role}{demo && " · Demo data"}</div></div>
            {signOut}
          </div>
        </div>
      )}
    </header>
  );
}
