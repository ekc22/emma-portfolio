import Link from "next/link";
import type { CurrentlyEntry } from "@/content/profile";
import Reveal from "./Reveal";

/** Currently entries, divided by hairlines. Two columns on desktop for four entries. */
export default function CurrentlyList({ entries }: { entries: CurrentlyEntry[] }) {
  return (
    <ul className="grid grid-cols-1 border-t border-linen-deep md:grid-cols-2">
      {entries.map((e, i) => (
        <Reveal
          as="li"
          key={e.label}
          delay={(i % 2) * 100}
          className={`border-b border-linen-deep py-8 md:py-10 ${i % 2 === 1 ? "md:border-l md:pl-10" : "md:pr-10"}`}
        >
          <p className="label text-cherry">{e.label}</p>
          <p className="mt-5 text-display-sm">{e.title}</p>
          <p className="mt-4 text-muted-ink">{e.body}</p>
          {e.href && (
            <Link href={e.href} className="text-link mt-5">
              <span>Read more</span>
              <span aria-hidden="true" className="arrow">→</span>
            </Link>
          )}
        </Reveal>
      ))}
    </ul>
  );
}
