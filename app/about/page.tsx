import type { Metadata } from "next";
import EditorialImage from "@/components/EditorialImage";
import Reveal from "@/components/Reveal";
import ReviewNote from "@/components/ReviewNote";
import TextLink from "@/components/TextLink";
import { about, beyondWork } from "@/content/profile";
import { site } from "@/content/site";
import { hasCv } from "@/lib/cv";

export const metadata: Metadata = {
  title: "About",
  description:
    "Emma Clark’s story: experience across FTSE 250, PE-backed and venture-backed businesses, fractional work and founding a sports and community venture.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  const cv = hasCv();

  return (
    <>
      <section className="frame pb-16 pt-12 md:pb-28 md:pt-20">
        <div className="grid-12">
          <p className="label col-span-4 md:col-span-12">About</p>
          <h1 className="col-span-4 mt-8 text-display-xl md:col-span-10 md:mt-12 motion-safe:animate-page-in">
            A generalist, <em className="text-burgundy">on purpose.</em>
          </h1>
          <p className="col-span-4 mt-10 max-w-[30ch] font-serif text-display-sm text-muted md:col-span-6 md:col-start-6 md:mt-16">
            {about.lead}
          </p>
          <div className="col-span-4 mt-8 md:col-span-6 md:col-start-6">
            <ReviewNote />
          </div>
        </div>
      </section>

      {/* Career */}
      <section aria-labelledby="career-title" className="frame pb-20 md:pb-32">
        <div className="grid-12 gap-y-12">
          <figure className="col-span-4 md:col-span-4 md:row-span-2">
            <EditorialImage
              brief="Portrait or working photograph of Emma — supplied by Emma"
              ratio="3 / 4"
              sizes="(min-width: 768px) 33vw, 100vw"
            />
          </figure>
          <div className="col-span-4 md:col-span-6 md:col-start-6">
            <h2 id="career-title" className="label border-t border-charcoal/15 pt-4">Career</h2>
            <Reveal className="prose-editorial mt-8 text-lg">
              {about.career.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      {/* Founder */}
      <section aria-labelledby="founder-title" className="bg-white/60">
        <div className="frame py-20 md:py-32">
          <div className="grid-12">
            <div className="col-span-4 md:col-span-5">
              <p className="label">Founder</p>
              <h2 id="founder-title" className="mt-6 text-display-md">
                Building something <em className="text-burgundy">from scratch.</em>
              </h2>
            </div>
            <Reveal className="prose-editorial col-span-4 mt-10 text-lg md:col-span-6 md:col-start-7 md:mt-0">
              {about.founder.map((p) => (
                <p key={p}>{p}</p>
              ))}
              <div className="!mt-10">
                <TextLink href="/work/sports-community-venture">Read the project</TextLink>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section aria-labelledby="principles-title" className="frame py-20 md:py-32">
        <div className="grid-12">
          <div className="col-span-4 border-t border-charcoal/15 pt-4 md:col-span-12">
            <span className="label">How I work</span>
          </div>
          <h2 id="principles-title" className="col-span-4 mt-10 text-display-lg md:col-span-8 md:mt-14">
            A few working <em className="text-burgundy">principles.</em>
          </h2>
        </div>
        <ol className="mt-14 grid grid-cols-1 gap-x-16 md:mt-20 md:grid-cols-2">
          {about.principles.map((p, i) => (
            <Reveal as="li" key={p.title} delay={(i % 2) * 100} className="border-t border-charcoal/15 py-8">
              <div className="flex items-baseline gap-5">
                <span className="font-serif text-xl text-burgundy">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="text-display-sm">{p.title}</h3>
                  <p className="mt-3 max-w-[40ch] text-muted-ink">{p.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>
      </section>

      {/* Outside work */}
      <section aria-labelledby="outside-title" className="frame pb-24 md:pb-36">
        <div className="grid-12 gap-y-10">
          <div className="col-span-4 border-t border-charcoal/15 pt-4 md:col-span-12">
            <span className="label">Outside work</span>
          </div>
          <h2 id="outside-title" className="col-span-4 text-display-md md:col-span-5">
            Curiosity is the <em className="text-burgundy">common thread.</em>
          </h2>
          <div className="col-span-4 md:col-span-6 md:col-start-7">
            <p className="text-lg">{about.outside}</p>
            <ul className="mt-10 flex flex-wrap gap-x-2 gap-y-2 font-serif text-2xl leading-snug">
              {beyondWork.interests.map((it, i) => (
                <li key={it.title}>
                  {it.title}
                  {i < beyondWork.interests.length - 1 && <span aria-hidden="true" className="ml-2 text-burgundy">/</span>}
                </li>
              ))}
            </ul>
            <div className="mt-12 flex flex-wrap gap-x-10 gap-y-4">
              <TextLink href="/currently">What I’m into right now</TextLink>
              {cv && <TextLink href={site.cv.path}>{site.cv.label}</TextLink>}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
