"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { nav, site } from "@/content/site";
import { withBase } from "@/lib/paths";

export default function MobileMenu({ cv = false }: { cv?: boolean }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on navigation.
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLElement>("a")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
      // Keep focus inside the open menu.
      if (e.key === "Tab" && panelRef.current) {
        const items = [buttonRef.current, ...Array.from(panelRef.current.querySelectorAll<HTMLElement>("a"))].filter(Boolean) as HTMLElement[];
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="justify-self-end lg:hidden">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((v) => !v)}
        className="relative z-50 -mr-2 px-2 py-2 text-[0.75rem] uppercase tracking-label"
      >
        {open ? "Close" : "Menu"}
      </button>

      <div
        id="mobile-menu"
        ref={panelRef}
        hidden={!open}
        className={`fixed inset-0 z-40 flex-col bg-paper ${open ? "flex" : "hidden"} px-5 pb-10 pt-24 motion-safe:animate-page-in sm:px-8`}
      >
        <nav aria-label="Mobile">
          <ol className="border-t border-linen-deep">
            {nav.map((item, i) => (
              <li key={item.href} className="border-b border-linen-deep">
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className="flex items-baseline gap-5 py-5 font-serif text-[2.5rem] leading-none transition-colors hover:text-cherry aria-[current=page]:italic aria-[current=page]:text-cherry"
                >
                  <span className="label w-6">{String(i + 1).padStart(2, "0")}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ol>
          {cv && <a href={withBase(site.cv.path)} className="text-link mt-6 inline-block text-[1.25rem]">{site.cv.label}</a>}
        </nav>
        <div className="mt-auto">
          <p className="wordmark text-[2rem]">{site.name}</p>
          <p className="label mt-3">{site.title}</p>
        </div>
      </div>
    </div>
  );
}
