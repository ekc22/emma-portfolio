import Reveal from "./Reveal";
import { desks } from "@/content/services";

/**
 * Brand system graphic, "The four desks" (brand guidelines §02):
 * what Emma runs around the founder. The founder always sits in the centre, in cherry.
 */
export default function FourDesks() {
  return (
    <div className="relative">
      <ul className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
        {desks.map((d, i) => (
          <Reveal as="li" key={d.title} delay={i * 80} className="bg-butter/60 p-7 sm:p-9 md:p-10">
            <p className="font-serif text-xl text-cherry">{d.numeral}</p>
            <h3 className="mt-3 text-display-sm">{d.title}</h3>
            <p className="mt-3 text-[0.75rem] font-semibold uppercase tracking-label text-cherry">{d.label}</p>
            <p className="mt-3 max-w-[36ch] text-muted-ink">{d.body}</p>
          </Reveal>
        ))}
      </ul>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 hidden h-32 w-32 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full bg-cherry text-paper ring-[6px] ring-paper sm:flex"
      >
        <span className="font-serif text-2xl leading-none">You,</span>
        <span className="mt-1 text-[0.5625rem] font-semibold uppercase tracking-[0.12em]">the founder</span>
      </div>
      <p className="sr-only">All four desks are run around you, the founder.</p>
    </div>
  );
}
