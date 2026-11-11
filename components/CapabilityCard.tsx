import type { Capability } from "@/content/profile";

/** One numbered capability — typography and a fine rule, not a box. */
export default function CapabilityCard({ capability, index }: { capability: Capability; index: number }) {
  const num = String(index + 1).padStart(2, "0");
  return (
    <article className="group relative border-t border-charcoal/15 pb-12 pt-6 transition-colors duration-500">
      <span
        aria-hidden="true"
        className="absolute inset-x-0 -top-px h-px origin-left scale-x-0 bg-burgundy transition-transform duration-700 ease-editorial group-hover:scale-x-100"
      />
      <div className="flex items-baseline gap-4">
        <span className="font-serif text-xl text-muted transition-colors duration-500 group-hover:text-burgundy">{num}</span>
        <span className="text-muted" aria-hidden="true">/</span>
        <h3 className="text-display-sm">{capability.title}</h3>
      </div>
      <p className="mt-5 max-w-[34ch] text-muted-ink md:ml-[3.25rem]">{capability.description}</p>
      <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-1 text-[0.875rem] md:ml-[3.25rem]">
        {capability.points.map((p) => (
          <li key={p} className="before:mr-2 before:text-burgundy before:content-['—']">
            {p}
          </li>
        ))}
      </ul>
    </article>
  );
}
