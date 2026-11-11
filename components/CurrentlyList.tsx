import type { CurrentlyEntry } from "@/content/profile";
import Reveal from "./Reveal";

/** Three columns divided by hairlines; stacks on mobile. */
export default function CurrentlyList({ entries, large = false }: { entries: CurrentlyEntry[]; large?: boolean }) {
  return (
    <ul className="grid grid-cols-1 border-t border-charcoal/15 md:grid-cols-3">
      {entries.map((e, i) => (
        <Reveal
          as="li"
          key={e.label}
          delay={i * 100}
          className={`border-b border-charcoal/15 py-8 md:border-b-0 md:py-10 ${i > 0 ? "md:border-l md:pl-8" : ""} ${i < entries.length - 1 ? "md:pr-8" : ""}`}
        >
          <p className="label text-burgundy">{e.label}</p>
          <p className={`mt-5 font-serif ${large ? "text-display-sm" : "text-[1.75rem] leading-[1.15]"}`}>{e.title}</p>
          <p className="mt-4 text-muted-ink">{e.body}</p>
        </Reveal>
      ))}
    </ul>
  );
}
