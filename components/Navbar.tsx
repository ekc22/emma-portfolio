"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav, site } from "@/content/site";
import { withBase } from "@/lib/paths";
import MobileMenu from "./MobileMenu";

function useLondonTime() {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/London" });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, []);
  return time;
}

/**
 * Masthead navigation (brand guidelines §08): place and time on the left, the name in the
 * centre, sections on the right. On the home page the centre holds the full EMMA CLARK
 * wordmark, which settles into "E." as you scroll. On phones: "E." left, Menu right.
 */
export default function Navbar({ cv = false }: { cv?: boolean }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const time = useLondonTime();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const showFull = isHome && !scrolled;
  const isActive = (href: string) => href !== "#contact" && (pathname === href || pathname.startsWith(`${href}/`));

  return (
    <header
      className={`sticky top-0 z-50 transition-[background-color,border-color] duration-500 ${
        scrolled ? "border-b border-linen-deep bg-paper/90 backdrop-blur-md" : "border-b border-transparent bg-paper"
      }`}
    >
      <div className="frame grid h-16 grid-cols-[1fr_auto] items-center lg:h-20 lg:grid-cols-[1fr_auto_1fr]">
        {/* Left: place and time (desktop) / monogram (mobile) */}
        <p className="hidden font-sans text-[0.8125rem] tabular-nums text-muted-ink lg:block" aria-label={`Based in ${site.location}`}>
          {site.location}
          {time && <span aria-hidden="true"> · {time}</span>}
        </p>
        <Link href="/" aria-label={`${site.name}, home`} className="font-serif text-[1.75rem] leading-none text-cherry lg:hidden">
          E.
        </Link>

        {/* Centre: the name */}
        <Link href="/" aria-label={`${site.name}, home`} className="relative hidden h-10 items-center justify-center lg:flex">
          <span
            aria-hidden="true"
            className={`wordmark absolute whitespace-nowrap text-[1.75rem] transition-[opacity,transform] duration-500 ease-editorial ${
              showFull ? "opacity-100" : "pointer-events-none -translate-y-1 opacity-0"
            }`}
          >
            {site.name}
          </span>
          <span
            aria-hidden="true"
            className={`font-serif text-[2rem] leading-none text-cherry transition-[opacity,transform] duration-500 ease-editorial ${
              showFull ? "translate-y-1 opacity-0" : "opacity-100"
            }`}
          >
            E.
          </span>
        </Link>

        {/* Right: sections */}
        <nav aria-label="Main" className="hidden justify-self-end lg:block">
          <ul className="flex items-center gap-7 text-[1.125rem]">
            {nav.map((item) => {
              const active = isActive(item.href);
              const isCta = item.href === "#contact";
              const cls = `relative py-1 transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:bg-current after:transition-transform after:duration-500 after:ease-editorial ${
                isCta
                  ? "text-cherry after:scale-x-100 hover:text-oxblood"
                  : active
                    ? "text-cherry after:scale-x-100"
                    : "hover:text-cherry after:scale-x-0 hover:after:scale-x-100"
              }`;
              return (
                <li key={item.href}>
                  {isCta ? (
                    <a href={item.href} className={cls}>{item.label}</a>
                  ) : (
                    <Link href={item.href} className={cls} aria-current={active ? "page" : undefined}>
                      {item.label}
                    </Link>
                  )}
                </li>
              );
            })}
            <li>
              {cv ? (
                <a href={withBase(site.cv.path)} className="text-[0.6875rem] font-semibold uppercase tracking-label text-muted-ink transition-colors hover:text-cherry">
                  CV<span className="sr-only"> (PDF)</span>
                </a>
              ) : (
                <span aria-disabled="true" title="Updated CV coming soon" className="cursor-default text-[0.6875rem] font-semibold uppercase tracking-label text-muted-ink opacity-60">CV</span>
              )}
            </li>
          </ul>
        </nav>

        <MobileMenu cv={cv} />
      </div>
    </header>
  );
}
