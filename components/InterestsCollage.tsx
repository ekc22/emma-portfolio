import type { Interest } from "@/content/profile";
import EditorialImage from "./EditorialImage";
import Reveal from "./Reveal";

/**
 * A journal-like collage: varied sizes, offsets and ratios so it never reads as a grid of cards.
 * Layout slots repeat if more interests are added.
 */
const slots = [
  { col: "md:col-span-5 md:col-start-1", ratio: "4 / 5", offset: "" },
  { col: "md:col-span-4 md:col-start-8", ratio: "1 / 1", offset: "md:mt-32" },
  { col: "md:col-span-4 md:col-start-2", ratio: "5 / 4", offset: "md:mt-10" },
  { col: "md:col-span-3 md:col-start-8", ratio: "3 / 4", offset: "md:mt-24" },
];
const tones = ["linen", "deep", "cherry", "deep", "linen", "cherry", "deep"] as const;

export default function InterestsCollage({ interests }: { interests: Interest[] }) {
  return (
    <ul className="grid-12 gap-y-12">
      {interests.map((item, i) => {
        const slot = slots[i % slots.length];
        return (
          <li key={item.title} className={`col-span-2 ${slot.col} ${slot.offset}`}>
            <Reveal as="figure" delay={(i % 3) * 80}>
              <EditorialImage image={item.image} brief={item.imageBrief} ratio={slot.ratio} tone={tones[i % tones.length]} sizes="(min-width: 768px) 33vw, 50vw" />
              <figcaption className="mt-4">
                <span className="label text-cherry">No. {String(i + 1).padStart(2, "0")}</span>
                <span className="mt-2 block text-[1.75rem] leading-tight">{item.title}</span>
                <span className="mt-1 block text-[1.1875rem] italic leading-snug text-muted-ink">{item.caption}</span>
              </figcaption>
            </Reveal>
          </li>
        );
      })}
    </ul>
  );
}
