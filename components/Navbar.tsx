"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav, site } from "@/content/site";
import MobileMenu from "./MobileMenu";

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) => href !== "#contact" && (pathname === href || pathname.startsWith(`${href}/`));

  return (
    <header
      className={`sticky top-0 z-50 transition-[background-color,border-color] duration-500 ${
        scrolled ? "border-b border-charcoal/10 bg-ivory/90 backdrop-blur-md" : "border-b border-transparent bg-ivory"
      }`}
    >
      <div className="frame flex h-16 items-center justify-between md:h-20">
        <Link href="/" className="text-[0.8125rem] font-medium uppercase tracking-[0.22em] transition-colors hover:text-burgundy">
          {site.name}
        </Link>

        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-8 text-[0.875rem]">
            {nav.map((item) => {
              const active = isActive(item.href);
              const cls = `relative py-1 transition-colors hover:text-burgundy after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:bg-current after:transition-transform after:duration-500 after:ease-editorial ${
                active ? "text-burgundy after:scale-x-100" : "after:scale-x-0 hover:after:scale-x-100"
              }`;
              return (
                <li key={item.href}>
                  {item.href.startsWith("#") ? (
                    <a href={item.href} className={cls}>{item.label}</a>
                  ) : (
                    <Link href={item.href} className={cls} aria-current={active ? "page" : undefined}>
                      {item.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <MobileMenu />
      </div>
    </header>
  );
}
