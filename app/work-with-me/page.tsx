import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import ReviewNote from "@/components/ReviewNote";
import SectionHeading from "@/components/SectionHeading";
import TextLink from "@/components/TextLink";
import { site } from "@/content/site";
import { engagementTypes, offerings, process } from "@/content/services";
import { mailto } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Work With Me",
  description:
    "Fractional Chief of Staff and founder’s office support, commercial strategy and growth projects, and business operations and AI workflows. Open to relevant permanent roles.",
  alternates: { canonical: "/work-with-me" },
};

export default function WorkWithMePage() {
  return (
    <>
      {/* Intro */}
      <section className="frame pb-20 pt-12 md:pb-28 md:pt-20">
        <div className="grid-12">
          <p className="label col-span-4 md:col-span-12">Work with me</p>
          <h1 className="col-span-4 mt-8 text-display-xl md:col-span-11 md:mt-12 motion-safe:animate-page-in">
            Fractional, focused, <em className="text-burgundy">or for the long run.</em>
          </h1>
          <div className="prose-editorial col-span-4 mt-12 text-lg md:col-span-5 md:col-start-6 md:mt-20 md:text-xl">
            <p>
              I work with founders, CEOs and leadership teams who need an experienced operator alongside them — someone who can do the strategic thinking and the hands-on work that turns it into progress.
            </p>
            <p>
              That might be ongoing fractional support, a clearly defined project, or the right permanent role.
            </p>
            <ReviewNote className="!mt-8" />
          </div>
        </div>

        {/* Jump list */}
        <nav aria-label="Ways to work together" className="mt-20 md:mt-28">
          <ol className="grid grid-cols-1 border-t border-charcoal/15 md:grid-cols-3">
            {offerings.map((o, i) => (
              <li key={o.id} className={`border-b border-charcoal/15 md:border-b-0 ${i > 0 ? "md:border-l md:pl-8" : ""} md:pr-8`}>
                <a href={`#${o.id}`} className="group block py-6 transition-colors hover:text-burgundy">
                  <span className="label">{String(i + 1).padStart(2, "0")}</span>
                  <span className="mt-3 block font-serif text-2xl leading-tight">{o.title}</span>
                  <span className="mt-2 block text-[0.875rem] text-muted-ink">{o.forWhom}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </section>

      {/* Offerings */}
      {offerings.map((o, i) => {
        const href = mailto(o.subject);
        return (
          <section
            key={o.id}
            id={o.id}
            aria-labelledby={`${o.id}-title`}
            className={i % 2 === 0 ? "bg-white/60" : ""}
          >
            <div className="frame py-20 md:py-32">
              <div className="grid-12">
                <span aria-hidden="true" className="col-span-4 font-serif text-numeral text-stone-deep md:col-span-3">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="col-span-4 mt-6 md:col-span-8 md:col-start-5 md:mt-0">
                  <p className="label text-burgundy">{o.forWhom}</p>
                  <Reveal>
                    <h2 id={`${o.id}-title`} className="mt-4 text-display-md">{o.title}</h2>
                  </Reveal>
                  <p className="mt-6 max-w-[46ch] text-lg text-muted-ink md:text-xl">{o.description}</p>
                </div>
              </div>

              <div className="grid-12 mt-14 gap-y-12 md:mt-20">
                <Reveal className="col-span-4 md:col-span-4 md:col-start-5">
                  <h3 className="label border-t border-charcoal/15 pt-4">Problems I help with</h3>
                  <ul className="mt-6 space-y-4">
                    {o.problems.map((p) => (
                      <li key={p} className="font-serif text-[1.375rem] leading-snug">{p}</li>
                    ))}
                  </ul>
                </Reveal>
                <Reveal delay={100} className="col-span-4 md:col-span-3 md:col-start-10">
                  <h3 className="label border-t border-charcoal/15 pt-4">What it can involve</h3>
                  <ul className="mt-6 space-y-2.5">
                    {o.examples.map((e) => (
                      <li key={e} className="flex gap-3">
                        <span aria-hidden="true" className="text-burgundy">—</span>
                        {e}
                      </li>
                    ))}
                  </ul>
                  {href && (
                    <div className="mt-10">
                      <TextLink href={href}>Talk about this</TextLink>
                    </div>
                  )}
                </Reveal>
              </div>
            </div>
          </section>
        );
      })}

      {/* Engagement types */}
      <section aria-labelledby="engagement-title" className="frame py-20 md:py-32">
        <SectionHeading label="Ways of working" id="engagement-title" title={<>However it <em className="text-burgundy">fits best.</em></>} />
        <ul className="mt-14 grid grid-cols-1 border-t border-charcoal/15 md:mt-20 md:grid-cols-3">
          {engagementTypes.map((e, i) => (
            <Reveal
              as="li"
              key={e.title}
              delay={i * 100}
              className={`border-b border-charcoal/15 py-8 md:border-b-0 md:py-10 ${i > 0 ? "md:border-l md:pl-8" : ""} md:pr-8`}
            >
              <h3 className="text-display-sm">{e.title}</h3>
              <p className="mt-4 text-muted-ink">{e.body}</p>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* Process */}
      <section aria-labelledby="process-title" className="frame pb-24 md:pb-36">
        <div className="grid-12">
          <div className="col-span-4 border-t border-charcoal/15 pt-4 md:col-span-12">
            <span className="label">How it starts</span>
          </div>
          <h2 id="process-title" className="col-span-4 mt-10 text-display-md md:col-span-4 md:mt-14">
            Simple, and <em className="text-burgundy">no pitch.</em>
          </h2>
          <ol className="col-span-4 mt-10 space-y-10 md:col-span-6 md:col-start-7 md:mt-14">
            {process.map((step, i) => (
              <Reveal as="li" key={step.title} delay={i * 100} className="grid grid-cols-[3.5rem_1fr]">
                <span className="font-serif text-3xl text-burgundy">{i + 1}.</span>
                <div>
                  <h3 className="font-serif text-2xl">{step.title}</h3>
                  <p className="mt-2 text-muted-ink">{step.body}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
        <p className="mt-20 text-center text-[0.9375rem] text-muted-ink">
          Scroll on to get in touch{site.links.linkedin ? ", or find me on LinkedIn" : ""}.
        </p>
      </section>
    </>
  );
}
