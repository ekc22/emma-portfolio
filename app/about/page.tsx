import type { Metadata } from "next";
import EditorialImage from "@/components/EditorialImage";
import Reveal from "@/components/Reveal";
import ReviewNote from "@/components/ReviewNote";
import TextLink from "@/components/TextLink";
import { about, beyondWork, education, hero, identity, timeline, workedWith } from "@/content/profile";
import { site } from "@/content/site";
import { mailto } from "@/lib/contact";
import { hasCv } from "@/lib/cv";
import { withBase } from "@/lib/paths";

export const metadata: Metadata = {
  title: "About",
  description:
    "Emma Clark’s story: a decade inside listed, private equity-backed and venture-backed businesses, and now building: Turnout, go-to-market for early-stage ventures and AI systems.",
  alternates: { canonical: "/about/" },
};

const timelineGroups = [
  { kind: "employment", title: "Employment", note: "" },
  { kind: "founder", title: "Founder & fractional", note: "Running alongside my full-time role." },
] as const;

export default function AboutPage() {
  const cv = hasCv();
  const permanentHref = mailto(site.contact.subjects.permanent);

  return (
    <>
      <section className="frame pb-16 pt-12 md:pb-24 md:pt-20">
        <div className="grid-12">
          <p className="label col-span-4 md:col-span-12">About · A little about me</p>
          <h1 className="col-span-4 mt-8 text-display-xl md:col-span-11 md:mt-12 motion-safe:animate-page-in">
            I’ve never been particularly interested in staying <em className="text-cherry">in one lane.</em>
          </h1>
          <div className="col-span-4 mt-8 md:col-span-6 md:col-start-6 md:mt-12">
            <ReviewNote />
          </div>
        </div>
      </section>

      {/* Story, told in chapters */}
      <section aria-label="My story" className="frame pb-20 md:pb-32">
        <div className="grid-12 gap-y-12">
          <aside aria-label="At a glance" className="col-span-4 md:sticky md:top-28 md:col-span-4 md:self-start">
            {hero.portrait && <EditorialImage image={hero.portrait} ratio="3 / 4" sizes="(min-width: 768px) 33vw, 100vw" className="mb-8" />}
            <div className="border-t border-cherry pt-5">
              <p className="text-display-sm text-cherry">{identity.title}</p>
              <p className="mt-3 text-muted-ink">{identity.positioning}</p>
            </div>
            <div className="mt-8 border-t border-linen-deep pt-5">
              <p className="label">Where I’ve worked</p>
              <ul className="mt-3 space-y-1 text-[1.25rem]">
                {workedWith.map((w) => (
                  <li key={w}>{w}</li>
                ))}
              </ul>
            </div>
            <div className="mt-8">
              <TextLink href={withBase(site.cv.path)} disabled={!cv}>{site.cv.label}</TextLink>
            </div>
          </aside>

          <div className="col-span-4 md:col-span-7 md:col-start-6">
            {about.chapters.map((ch, i) => (
              <Reveal as="section" key={ch.label} className={i > 0 ? "mt-16 md:mt-20" : ""}>
                <h2 className="flex gap-3 border-t border-linen-deep pt-4">
                  <span className="label text-cherry">{String(i + 1).padStart(2, "0")}</span>
                  <span className="label">{ch.label}</span>
                </h2>
                <div className="prose-editorial mt-8 text-[1.375rem] leading-[1.5] md:text-[1.5rem]">
                  {ch.paragraphs.map((p, j) => (
                    <p key={p} className={i === 2 && j === 0 ? "text-display-sm text-cherry" : ""}>{p}</p>
                  ))}
                </div>
                {i === 2 && (
                  <div className="mt-8 flex flex-wrap gap-x-10 gap-y-3">
                    <TextLink href="/work/when-youre-the-one-building-it">Building Turnout</TextLink>
                    <TextLink href="/work/finding-a-market-before-the-playbook">Go-to-market at a seed-stage AI venture</TextLink>
                    <TextLink href="/work/circus-capital">Circus Capital</TextLink>
                  </div>
                )}
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Career timeline (from the CV) */}
      <section aria-labelledby="timeline-title" className="frame pb-20 md:pb-28">
        <div className="grid-12 gap-y-10">
          <div className="col-span-4 border-t border-linen-deep pt-4 md:col-span-12">
            <h2 id="timeline-title" className="label">Career timeline</h2>
          </div>
          <div className="col-span-4 space-y-12 md:col-span-8">
            {timelineGroups.map((g) => (
              <div key={g.kind}>
                <h3 className="label text-cherry">{g.title}</h3>
                {g.note && <p className="mt-2 text-[1rem] text-muted-ink">{g.note}</p>}
                <ol className="mt-3">
                  {timeline
                    .filter((t) => t.kind === g.kind)
                    .map((t) => (
                      <li key={t.org + t.when} className="grid grid-cols-1 gap-x-8 gap-y-1 border-b border-linen-deep py-5 sm:grid-cols-[11rem_1fr]">
                        <span className="text-[1rem] tabular-nums text-muted-ink">{t.when}</span>
                        <span>
                          <span className="block text-[1.5rem] leading-tight">{t.org}</span>
                          <span className="mt-1 block text-[1.0625rem] leading-snug text-muted-ink">{t.role}</span>
                        </span>
                      </li>
                    ))}
                </ol>
              </div>
            ))}
          </div>
          <div className="col-span-4 md:col-span-4">
            <p className="label">Education & qualifications</p>
            <ul className="mt-4 space-y-3">
              {education.map((e) => (
                <li key={e} className="text-[1.125rem] leading-snug">{e}</li>
              ))}
            </ul>
            <div className="mt-8">
              <TextLink href={withBase(site.cv.path)} disabled={!cv}>{site.cv.label}</TextLink>
            </div>
          </div>
        </div>
      </section>

      {/* What connects it */}
      <section aria-labelledby="connects-title" className="bg-butter/50">
        <div className="frame py-20 md:py-32">
          <div className="grid-12">
            <h2 id="connects-title" className="label col-span-4 border-t border-linen-deep pt-4 md:col-span-12">
              What connects all of it
            </h2>
            <Reveal className="col-span-4 mt-10 md:col-span-10 md:mt-14">
              <blockquote>
                <p className="text-display-lg italic text-cherry">“{about.pullQuote}”</p>
              </blockquote>
            </Reveal>
            <p className="col-span-4 mt-10 text-[1.375rem] leading-[1.5] md:col-span-5 md:col-start-7 md:mt-14 md:text-[1.5rem]">
              {about.connects}
            </p>
          </div>
        </div>
      </section>

      {/* Outside work + hiring-manager journey */}
      <section aria-labelledby="outside-title" className="frame py-20 md:py-32">
        <div className="grid-12 gap-y-10">
          <div className="col-span-4 border-t border-linen-deep pt-4 md:col-span-12">
            <span className="label">Beyond the boardroom</span>
          </div>
          <h2 id="outside-title" className="col-span-4 text-display-md md:col-span-5">
            And outside <em className="text-cherry">work?</em>
          </h2>
          <div className="col-span-4 md:col-span-6 md:col-start-7">
            <p className="text-[1.5rem] leading-[1.45]">{about.outside}</p>
            <ul className="mt-8 flex flex-wrap gap-x-2 gap-y-1 text-[1.5rem] leading-snug text-muted-ink">
              {beyondWork.interests.map((it, i) => (
                <li key={it.title}>
                  {it.title}
                  {i < beyondWork.interests.length - 1 && <span aria-hidden="true" className="ml-2 text-cherry">/</span>}
                </li>
              ))}
            </ul>
            <p className="mt-10 text-display-sm italic text-cherry">{about.closing}</p>
          </div>
        </div>

        <aside aria-labelledby="hiring-title" className="mt-20 grid-12 border-t border-linen-deep pt-8 md:mt-28">
          <p className="label col-span-4 md:col-span-3">For hiring managers</p>
          <div className="col-span-4 mt-4 md:col-span-7 md:col-start-5 md:mt-0">
            <h2 id="hiring-title" className="sr-only">For hiring managers</h2>
            <p className="text-[1.375rem] leading-[1.5]">{about.permanent}</p>
            <div className="mt-6 flex flex-wrap gap-x-10 gap-y-3">
              <TextLink href="/work">View my work</TextLink>
              {permanentHref && <TextLink href={permanentHref}>Get in touch</TextLink>}
              <TextLink href={withBase(site.cv.path)} disabled={!cv}>{site.cv.label}</TextLink>
            </div>
          </div>
        </aside>
      </section>
    </>
  );
}
