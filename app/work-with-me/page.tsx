import type { Metadata } from "next";
import FourDesks from "@/components/FourDesks";
import Reveal from "@/components/Reveal";
import ReviewNote from "@/components/ReviewNote";
import TextLink from "@/components/TextLink";
import { getProject } from "@/content/projects";
import { fundraisingNote, offerings, process, waysToWork, workWithMe } from "@/content/services";
import { mailto } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Work With Me",
  description:
    "Commercial thinking, structure and hands-on execution for founders and leadership teams: fractional, project-based or permanent.",
  alternates: { canonical: "/work-with-me/" },
};

export default function WorkWithMePage() {
  return (
    <>
      {/* Intro */}
      <section className="frame pb-20 pt-12 md:pb-28 md:pt-20">
        <div className="grid-12">
          <p className="label col-span-4 md:col-span-12">Work with me</p>
          <h1 className="col-span-4 mt-8 text-display-xl md:col-span-11 md:mt-12 motion-safe:animate-page-in">
            Good ideas need people who make them <em className="text-cherry">happen.</em>
          </h1>
          <div className="prose-editorial col-span-4 mt-12 text-[1.375rem] leading-[1.45] md:col-span-6 md:col-start-6 md:mt-20 md:text-[1.625rem]">
            {workWithMe.intro.map((p) => (
              <p key={p}>{p}</p>
            ))}
            <ReviewNote className="!mt-8" />
          </div>
        </div>
      </section>

      {/* Where I can help */}
      <section aria-labelledby="help-title" className="frame pb-20 md:pb-32">
        <div className="border-t border-linen-deep pt-4">
          <h2 id="help-title" className="label">Where I can help</h2>
        </div>
        <ol className="mt-4">
          {offerings.map((o, i) => {
            const href = mailto(o.subject);
            const study = o.caseStudy ? getProject(o.caseStudy) : undefined;
            return (
              <li key={o.id} id={o.id} className="grid-12 border-b border-linen-deep py-12 md:py-16">
                <span aria-hidden="true" className="col-span-4 font-serif text-[clamp(3.5rem,7vw,6rem)] leading-[0.8] text-linen-deep md:col-span-2">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <Reveal className="col-span-4 mt-6 md:col-span-5 md:col-start-3 md:mt-0">
                  <h3 className="text-display-md">
                    {o.from} <em className="block text-cherry">{o.to}</em>
                  </h3>
                </Reveal>
                <Reveal delay={100} className="col-span-4 mt-6 md:col-span-4 md:col-start-9 md:mt-2">
                  <p className="text-[1.375rem] leading-[1.45]">{o.description}</p>
                  <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
                    {href && <TextLink href={href}>Talk about this</TextLink>}
                    {study && <TextLink href={`/work/${study.slug}`}>See an example</TextLink>}
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </section>

      {/* The four desks (brand system graphic) */}
      <section aria-labelledby="desks-title" className="bg-butter/50">
        <div className="frame py-20 md:py-32">
          <div className="grid-12">
            <div className="col-span-4 border-t border-linen-deep pt-4 md:col-span-12">
              <span className="label">For founders · the four desks</span>
            </div>
            <h2 id="desks-title" className="col-span-4 mt-10 text-display-lg md:col-span-7 md:mt-14">
              The company behind <em className="text-cherry">the company.</em>
            </h2>
            <p className="col-span-4 mt-6 max-w-measure text-[1.375rem] leading-[1.45] text-muted-ink md:col-span-4 md:col-start-9 md:mt-16">
              For founders raising, hiring or scaling faster than their operations: the work behind the work, with you at the centre of it.
            </p>
          </div>
          <div className="mt-14 md:mt-20">
            <FourDesks />
          </div>
          <p className="mt-6 max-w-[70ch] text-[1rem] text-muted-ink">{fundraisingNote}</p>
        </div>
      </section>

      {/* Ways we could work together */}
      <section aria-labelledby="ways-title" className="frame py-20 md:py-32">
        <div className="grid-12">
          <div className="col-span-4 border-t border-linen-deep pt-4 md:col-span-12">
            <span className="label">Ways we could work together</span>
          </div>
          <h2 id="ways-title" className="col-span-4 mt-10 text-display-lg md:col-span-6 md:mt-14">
            Fractional, focused, <em className="text-cherry">or for the long run.</em>
          </h2>
          <div className="prose-editorial col-span-4 mt-8 text-[1.375rem] leading-[1.45] md:col-span-5 md:col-start-8 md:mt-16">
            <p>{waysToWork.intro}</p>
            <p className="italic text-cherry">{waysToWork.emphasis}</p>
          </div>
        </div>
        <ul className="mt-14 grid grid-cols-1 border-t border-linen-deep md:mt-20 md:grid-cols-3">
          {waysToWork.types.map((t, i) => {
            const href = mailto(t.subject);
            return (
              <Reveal
                as="li"
                key={t.title}
                delay={i * 100}
                className={`border-b border-linen-deep py-8 md:border-b-0 md:py-10 ${i > 0 ? "md:border-l md:pl-8" : ""} md:pr-8`}
              >
                <h3 className="text-display-sm">{t.title}</h3>
                <p className="mt-4 text-muted-ink">{t.body}</p>
                {href && (
                  <div className="mt-6">
                    <TextLink href={href}>Get in touch</TextLink>
                  </div>
                )}
              </Reveal>
            );
          })}
        </ul>
      </section>

      {/* How it starts */}
      <section aria-labelledby="process-title" className="frame pb-24 md:pb-36">
        <div className="grid-12">
          <div className="col-span-4 border-t border-linen-deep pt-4 md:col-span-12">
            <span className="label">How it starts</span>
          </div>
          <h2 id="process-title" className="col-span-4 mt-10 text-display-md md:col-span-4 md:mt-14">
            Simple, and <em className="text-cherry">no pitch.</em>
          </h2>
          <ol className="col-span-4 mt-10 space-y-10 md:col-span-6 md:col-start-7 md:mt-14">
            {process.map((step, i) => (
              <Reveal as="li" key={step.title} delay={i * 100} className="grid grid-cols-[3.5rem_1fr]">
                <span className="font-serif text-3xl text-cherry">{i + 1}.</span>
                <div>
                  <h3 className="text-2xl">{step.title}</h3>
                  <p className="mt-2 text-muted-ink">{step.body}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
