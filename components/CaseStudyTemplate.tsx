import Link from "next/link";
import { outcomeLabels, type Project } from "@/content/projects";
import { showReviewNotes } from "@/lib/review";
import EditorialImage from "./EditorialImage";
import TurnoutMark from "./TurnoutMark";
import TurnoutPanel from "./TurnoutPanel";
import Reveal from "./Reveal";
import ReviewNote from "./ReviewNote";
import TextLink from "./TextLink";

type Props = { project: Project; index: number; next: Project; nextIndex: number };

function Row({ number, label, children }: { number: string; label: string; children: React.ReactNode }) {
  return (
    <section className="grid-12 border-t border-linen-deep py-12 md:py-16">
      <h2 className="col-span-4 flex gap-3 md:col-span-3">
        <span className="label text-cherry">{number}</span>
        <span className="label">{label}</span>
      </h2>
      <Reveal className="col-span-4 mt-6 md:col-span-7 md:col-start-5 md:mt-0">{children}</Reveal>
    </section>
  );
}

/**
 * Editorial case study: situation → problem → what I did → what changed → what it taught me.
 * Each result carries its kind (delivered personally, team outcome, pipeline, company milestone).
 */
export default function CaseStudyTemplate({ project, index, next, nextIndex }: Props) {
  const num = String(index + 1).padStart(2, "0");

  return (
    <article>
      <header className="frame pb-16 pt-10 md:pb-24 md:pt-16">
        <nav aria-label="Breadcrumb" className="text-muted-ink">
          <Link href="/work" className="transition-colors hover:text-cherry">← All work</Link>
        </nav>
        <div className="grid-12 mt-12 md:mt-20">
          <span aria-hidden="true" className="col-span-4 font-serif text-numeral text-linen-deep md:col-span-2">{num}</span>
          <div className="col-span-4 mt-8 md:col-span-9 md:col-start-4 md:mt-0">
            {project.accent === "turnout" && <TurnoutMark size={72} className="mb-6" />}
            <p className="label text-cherry">{num} / {project.category}</p>
            <h1 className="mt-5 text-display-lg motion-safe:animate-page-in">{project.title}</h1>
            {project.role && <p className="label mt-6 !text-oxblood">{project.role}</p>}
            <p className="mt-8 max-w-[34ch] text-[1.625rem] leading-[1.35] text-muted-ink">{project.summary}</p>
            {project.status === "draft" && <ReviewNote className="mt-8">Draft: figures and wording awaiting Emma’s approval</ReviewNote>}
          </div>
        </div>

        <dl className="grid-12 mt-16 gap-y-6 border-t border-linen-deep pt-6 md:mt-24">
          <div className="col-span-4 md:col-span-4">
            <dt className="label">Context</dt>
            <dd className="mt-2">{project.context}</dd>
          </div>
          <div className="col-span-2 md:col-span-3">
            <dt className="label">Discipline</dt>
            <dd className="mt-2">{project.category}</dd>
          </div>
          {project.timeframe && (
            <div className="col-span-2 md:col-span-2">
              <dt className="label">Timeframe</dt>
              <dd className="mt-2">{project.timeframe}</dd>
            </div>
          )}
        </dl>
      </header>

      <div className="frame">
        <Reveal>
          {project.accent === "turnout" && !project.image ? (
            <TurnoutPanel ratio="16 / 9" figureWidth="40%" />
          ) : (
            <EditorialImage image={project.image} motif={project.motif} ratio="16 / 9" sizes="100vw" priority tone={project.accent ?? "linen"} />
          )}
        </Reveal>
      </div>

      <div className="frame py-20 md:py-28">
        <Row number="01" label="The situation">
          <p className="text-display-sm">{project.situation}</p>
        </Row>

        <Row number="02" label="The challenge">
          <div className="prose-editorial text-[1.5rem] leading-[1.4] md:text-[1.75rem]">
            {project.problem.split("\n\n").map((para) => (
              <p key={para}>{para}</p>
            ))}
          </div>
        </Row>

        <Row number="03" label="My contribution">
          <ol className="space-y-6">
            {project.myRole.map((step, i) => (
              <li key={typeof step === "string" ? step : step.title} className="grid grid-cols-[3rem_1fr] text-[1.375rem] leading-snug">
                <span className="text-cherry">{String(i + 1).padStart(2, "0")}</span>
                {typeof step === "string" ? (
                  <span>{step}</span>
                ) : (
                  <span>
                    <span className="block text-display-sm">{step.title}</span>
                    <span className="mt-2 block text-muted-ink">{step.body}</span>
                  </span>
                )}
              </li>
            ))}
          </ol>
          {project.note && <p className="mt-8 max-w-[60ch] text-[1rem] leading-snug text-muted-ink">{project.note}</p>}
        </Row>

        <Row number="04" label="The impact">
          {project.whatChanged.length === 0 && <ReviewNote>Outcomes to be added once confirmed</ReviewNote>}
          <ul className="space-y-8">
            {project.whatChanged.map((o) => (
              <li key={o.text}>
                <p className="label text-cherry">{outcomeLabels[o.kind]}</p>
                {o.title ? (
                  <>
                    <h3 className="mt-2 text-display-sm">{o.title}</h3>
                    <p className="mt-2 text-[1.375rem] leading-[1.45] text-muted-ink">{o.text}</p>
                  </>
                ) : (
                  <p className="mt-2 text-display-sm">{o.text}</p>
                )}
              </li>
            ))}
          </ul>
        </Row>

        {(project.lesson || showReviewNotes) && (
          <section className="grid-12 border-t border-linen-deep pt-16 md:pt-24">
            <h2 className="col-span-4 flex gap-3 md:col-span-3">
              <span className="label text-cherry">05</span>
              <span className="label">What it taught me</span>
            </h2>
            <div className="col-span-4 mt-6 md:col-span-8 md:col-start-5 md:mt-0">
              {project.lesson ? (
                <blockquote>
                  <p className="text-display-md italic text-cherry">“{project.lesson}”</p>
                </blockquote>
              ) : (
                <ReviewNote>Emma to add, in her own words</ReviewNote>
              )}
            </div>
          </section>
        )}
      </div>

      <nav aria-label="Next project" className="frame pb-24 md:pb-32">
        <div className="group relative border-t border-linen-deep pt-8">
          <p className="label">Next: {String(nextIndex + 1).padStart(2, "0")} / {next.category}</p>
          <p className="mt-4 text-display-md transition-colors duration-500 group-hover:text-cherry">
            <Link href={`/work/${next.slug}`} className="after:absolute after:inset-0 after:content-['']">
              {next.title}
            </Link>
          </p>
          <div className="mt-8">
            <TextLink href="/work" className="relative z-10">All work</TextLink>
          </div>
        </div>
      </nav>
    </article>
  );
}
