import Link from "next/link";
import { nav, site } from "@/content/site";
import { hasCv } from "@/lib/cv";
import { withBase } from "@/lib/paths";

export default function Footer() {
  const cv = hasCv();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-charcoal text-ivory">
      <div className="frame py-14 md:py-20">
        <div className="grid-12 gap-y-12">
          <div className="col-span-4 md:col-span-6">
            <p className="font-serif text-display-md">{site.name}</p>
            <p className="mt-4 max-w-[38ch] text-ivory/70">{site.valueProposition}</p>
          </div>
          <nav aria-label="Footer" className="col-span-2 md:col-span-3 md:col-start-8">
            <p className="label !text-ivory/60">Explore</p>
            <ul className="mt-4 space-y-2">
              {nav
                .filter((n) => !n.href.startsWith("#"))
                .map((n) => (
                  <li key={n.href}>
                    <Link href={n.href} className="transition-colors hover:text-[#D9AEB8]">{n.label}</Link>
                  </li>
                ))}
            </ul>
          </nav>
          <div className="col-span-2 md:col-span-2">
            <p className="label !text-ivory/60">Elsewhere</p>
            <ul className="mt-4 space-y-2">
              <li><a href="#contact" className="transition-colors hover:text-[#D9AEB8]">Contact</a></li>
              {site.links.linkedin && (
                <li>
                  <a href={site.links.linkedin} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-[#D9AEB8]">LinkedIn</a>
                </li>
              )}
              {cv && (
                <li>
                  <a href={withBase(site.cv.path)} download className="transition-colors hover:text-[#D9AEB8]">{site.cv.label}</a>
                </li>
              )}
            </ul>
          </div>
        </div>
        <div className="mt-16 flex flex-col justify-between gap-2 border-t border-ivory/15 pt-6 text-[0.8125rem] text-ivory/60 sm:flex-row">
          <p>© {year} {site.name}</p>
          <p className="italic">{site.title}</p>
        </div>
      </div>
    </footer>
  );
}
