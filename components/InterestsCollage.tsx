import type { Interest } from "@/content/profile";
import EditorialImage from "./EditorialImage";
import Reveal from "./Reveal";

/**
 * Beyond the boardroom: a journal-like index. Typographic by default; when Emma adds
 * a photo to an interest it appears alongside, so the layout works with or without images.
 */
export default function InterestsCollage({ interests }: { interests: Interest[] }) {
  return (
    <ol className="border-t border-linen-deep">
      {interests.map((item, i) => (
        <Reveal as="li" key={item.title} delay={(i % 3) * 60} className="group grid-12 items-baseline border-b border-linen-deep py-7 md:py-9">
          <span className="label col-span-1 text-cherry md:col-span-1">{String(i + 1).padStart(2, "0")}</span>
          <h3 className="col-span-3 text-[clamp(1.75rem,3.4vw,3rem)] leading-[1.05] transition-colors duration-500 group-hover:text-cherry md:col-span-5">
            {item.title}
          </h3>
          <p className="col-span-3 col-start-2 mt-2 italic text-muted-ink md:col-span-4 md:col-start-7 md:mt-0">{item.caption}</p>
          {item.image && (
            <div className="col-span-3 col-start-2 mt-4 md:col-span-2 md:col-start-11 md:mt-0">
              <EditorialImage image={item.image} ratio="4 / 5" sizes="(min-width: 768px) 15vw, 60vw" />
            </div>
          )}
        </Reveal>
      ))}
    </ol>
  );
}
