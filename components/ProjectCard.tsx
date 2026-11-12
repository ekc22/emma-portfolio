import Link from "next/link";
import type { Project } from "@/content/projects";
import EditorialImage from "./EditorialImage";
import TurnoutPanel from "./TurnoutPanel";
import Reveal from "./Reveal";

type Props = { project: Project; index: number; flipIndex?: number; headingLevel?: "h2" | "h3" };

/**
 * Magazine-style project feature. Alternates image/text sides, with an oversized numeral.
 * The whole block is clickable via the title link's stretched hit area.
 */
export default function ProjectCard({ project, index, flipIndex, headingLevel: H = "h3" }: Props) {
  const num = String(index + 1).padStart(2, "0");
  const flip = (flipIndex ?? index) % 2 === 1;

  return (
    <article className="group relative grid-12 items-end">
      <Reveal
        className={`col-span-4 ${flip ? "md:col-span-6 md:col-start-7 md:row-start-1" : "md:col-span-7 md:col-start-1"}`}
      >
        {project.accent === "turnout" && !project.image ? (
          <TurnoutPanel ratio={flip ? "1 / 1" : "5 / 4"} hoverZoom figureWidth="52%" />
        ) : !project.image && project.exhibit ? (
          // Product screenshots are shown whole, at their natural shape, not cropped.
          <EditorialImage
            image={project.exhibit}
            ratio={`${project.exhibit.width} / ${project.exhibit.height}`}
            sizes="(min-width: 768px) 58vw, 100vw"
            hoverZoom
            className="ring-1 ring-linen-deep"
          />
        ) : (
        <EditorialImage
          image={project.image}
          motif={project.motif}
          ratio={flip ? "1 / 1" : "5 / 4"}
          sizes="(min-width: 768px) 58vw, 100vw"
          hoverZoom
          tone={project.accent ?? (["linen", "butter", "deep"] as const)[(flipIndex ?? index) % 3]}
        />
        )}
      </Reveal>

      <Reveal
        delay={120}
        className={`col-span-4 mt-8 md:mt-0 md:pb-4 ${flip ? "md:col-span-4 md:col-start-2 md:row-start-1" : "md:col-span-4 md:col-start-9"}`}
      >
        <span aria-hidden="true" className="block font-serif text-numeral text-linen-deep transition-colors duration-700 group-hover:text-cherry/25">
          {num}
        </span>
        <p className="label mt-6 text-cherry">{project.category}</p>
        <H className="mt-3 text-display-sm">
          <Link
            href={`/work/${project.slug}`}
            className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none [&:focus-visible]:after:outline [&:focus-visible]:after:outline-2 [&:focus-visible]:after:outline-offset-8 [&:focus-visible]:after:outline-cherry"
          >
            {project.title}
          </Link>
        </H>
        <p className="mt-4 max-w-[34ch] text-[1.375rem] leading-[1.4] text-muted-ink">{project.summary}</p>
        <span aria-hidden="true" className="text-link mt-6 text-[1.125rem] group-hover:text-cherry">
          <span>View project</span>
          <span className="arrow">→</span>
        </span>
      </Reveal>
    </article>
  );
}
