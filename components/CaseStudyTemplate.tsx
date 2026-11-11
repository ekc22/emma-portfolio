import Link from "next/link";
import type { Project } from "@/content/projects";
import { showReviewNotes } from "@/lib/review";
import EditorialImage from "./EditorialImage";
import Reveal from "./Reveal";
import ReviewNote from "./ReviewNote";
import TextLink from "./TextLink";

type Props = { project: Project; index: number; next: Project; nextIndex: number };

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="grid-12 border-t border-charcoal/15 py-12 md:py-16">
      <h2 className="label col-span-4 md:col-span-3">{label}</h2>
      <div className="col-span-4 mt-6 md:col-span-7 md:col-start-5 md:mt-0">{children}</div>
    </section>
  );
}

/** Editorial case study. Emma's own role and the wider team's results are always shown separately. */
export default function CaseStudyTemplate({ project, index, next, nextIndex }: Props) {
  const num = String(index + 1).padStart(2, "0");
  const outcomes = project.teamOutcomes ?? [];

  return (
    <article>
      <header className="frame pb-16 pt-10 md:pb-24 md:pt-16">
        <nav aria-label="Breadcrumb" className="text-[0.875rem] text-muted-ink">
          <Link href="/work" className="transition-colors hover:text-burgundy">← All work</Link>
        </nav>
        <div className="grid-12 mt-12 md:mt-20">
          <span aria-hidden="true" className="col-span-4 font-serif text-numeral text-stone-deep md:col-span-2">{num}</span>
          <div className="col-span-4 mt-8 md:col-span-9 md:col-start-4 md:mt-0">
            <p className="label text-burgundy">{project.category}</p>
            <h1 className="mt-5 text-display-lg motion-safe:animate-page-in">{project.title}</h1>
            <p className="mt-8 max-w-[40ch] text-xl leading-relaxed text-muted-ink">{project.summary}</p>
            {project.status === "draft" && <ReviewNote className="mt-8" />}
          </div>
        </div>

        <dl className="grid-12 mt-16 gap-y-6 border-t border-charcoal/15 pt-6 text-[0.9375rem] md:mt-24">
          <div className="col-span-2 md:col-span-3">
            <dt className="label">Context</dt>
            <dd className="mt-2">{project.context}</dd>
          </div>
          <div className="col-span-2 md:col-span-3">
            <dt className="label">Discipline</dt>
            <dd className="mt-2">{project.category}</dd>
          </div>
          {project.timeframe && (
            <div className="col-span-2 md:col-span-3">
              <dt className="label">Timeframe</dt>
              <dd className="mt-2">{project.timeframe}</dd>
            </div>
          )}
        </dl>
      </header>

      <div className="frame">
        <Reveal>
          <EditorialImage image={project.image} brief={project.imageBrief} ratio="16 / 9" sizes="100vw" priority />
        </Reveal>
      </div>

      <div className="frame py-20 md:py-28">
        <Row label="The challenge">
          <p className="font-serif text-display-sm">{project.challenge}</p>
        </Row>

        <Row label="The approach">
          <ol className="space-y-6">
            {project.approach.map((step, i) => (
              <li key={step} className="grid grid-cols-[3rem_1fr] text-lg">
                <span className="font-serif text-2xl text-burgundy">{String(i + 1).padStart(2, "0")}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </Row>

        <Row label="My role">
          <p className="mb-6 text-[0.9375rem] text-muted-ink">What I personally did.</p>
          <ul className="space-y-3 text-lg">
            {project.myRole.map((r) => (
              <li key={r} className="flex gap-4">
                <span aria-hidden="true" className="text-burgundy">—</span>
                {r}
              </li>
            ))}
          </ul>
        </Row>

        {(outcomes.length > 0 || showReviewNotes) && (
          <Row label="Team outcomes">
            <p className="mb-6 text-[0.9375rem] text-muted-ink">
              What the wider team achieved together — shared results, not mine alone.
            </p>
            {outcomes.length > 0 ? (
              <ul className="space-y-3 text-lg">
                {outcomes.map((o) => (
                  <li key={o} className="flex gap-4">
                    <span aria-hidden="true" className="text-burgundy">—</span>
                    {o}
                  </li>
                ))}
              </ul>
            ) : (
              <ReviewNote>Outcomes to be added once verified</ReviewNote>
            )}
          </Row>
        )}

        {project.reflection && (
          <section className="grid-12 border-t border-charcoal/15 pt-16 md:pt-24">
            <h2 className="label col-span-4 md:col-span-3">Reflection</h2>
            <blockquote className="col-span-4 mt-6 md:col-span-8 md:col-start-5 md:mt-0">
              <p className="font-serif text-display-md italic text-burgundy">“{project.reflection}”</p>
            </blockquote>
          </section>
        )}
      </div>

      <nav aria-label="Next project" className="frame pb-24 md:pb-32">
        <div className="group relative border-t border-charcoal/15 pt-8">
          <p className="label">Next project — {String(nextIndex + 1).padStart(2, "0")}</p>
          <p className="mt-4 font-serif text-display-md transition-colors duration-500 group-hover:text-burgundy">
            <Link href={`/work/${next.slug}`} className="after:absolute after:inset-0 after:content-['']">
              {next.title}
            </Link>
          </p>
          <div className="mt-8">
            <TextLink href="/work" className="relative z-10">All projects</TextLink>
          </div>
        </div>
      </nav>
    </article>
  );
}
