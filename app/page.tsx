import Link from "next/link";
import Hero from "@/components/Hero";
import InterestsCollage from "@/components/InterestsCollage";
import ProjectCard from "@/components/ProjectCard";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import TextLink from "@/components/TextLink";
import TurnoutMark from "@/components/TurnoutMark";
import TurnoutScreen from "@/components/TurnoutScreen";
import { aboutTeaser, beyondWork, facts, journeys, turnout } from "@/content/profile";
import { projects } from "@/content/projects";
import { site } from "@/content/site";

/** Featured: Turnout (spotlight), CoS OS and the AI venture. Canaccord is highlighted further down. */
const selected = ["cos-os", "finding-a-market-before-the-playbook"]
  .map((slug) => projects.find((p) => p.slug === slug))
  .filter((p): p is (typeof projects)[number] => Boolean(p));
const executive = projects.find((p) => p.slug === "making-strategy-everyones-business");

export default function Home() {
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    jobTitle: site.title,
    description: site.valueProposition,
    url: site.url,
    ...(site.links.linkedin ? { sameAs: [site.links.linkedin] } : {}),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />

      <Hero />

      {/* In numbers: results first */}
      <section aria-labelledby="facts-title" className="bg-butter/50">
        <div className="frame py-16 md:py-24">
          <h2 id="facts-title" className="label">In numbers</h2>
          <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4 md:gap-x-0">
            {facts.map((f, i) => (
              <Reveal key={f.label} delay={i * 70} className={`flex flex-col ${i > 0 ? "md:border-l md:border-linen-deep md:pl-6" : ""} md:pr-6`}>
                <dt className="order-2 mt-3 max-w-[24ch] text-[1.0625rem] leading-snug text-muted-ink">
                  {f.href ? (
                    <Link href={f.href} className="underline decoration-cherry/40 underline-offset-4 transition-colors hover:text-cherry">
                      {f.label}
                    </Link>
                  ) : (
                    f.label
                  )}
                </dt>
                <dd className="order-1 font-serif text-[clamp(2.75rem,4.6vw,4.25rem)] leading-none text-cherry">{f.figure}</dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      {/* Turnout spotlight: Turnout's own figures on its own blue */}
      <section aria-labelledby="turnout-title" className="frame pb-20 md:pb-28">
        <div className="grid-12 gap-y-10">
          <div className="col-span-4 border-t border-linen-deep pt-4 md:col-span-12">
            <span className="label">{turnout.label}</span>
          </div>
          <Reveal className="col-span-4 md:col-span-5">
            <Link href="/work/when-youre-the-one-building-it" className="group block" aria-label="Read the Turnout story">
              <TurnoutScreen ratio="4 / 3" hoverZoom />
            </Link>
            <p className="mt-3 text-[1rem] leading-snug text-muted-ink">Concept direction, 2026. Product and UX by me; brand by A Plus M Studio.</p>
          </Reveal>
          <Reveal delay={120} className="col-span-4 md:col-span-6 md:col-start-7 md:self-center">
            <div className="flex items-center gap-5">
              <TurnoutMark size={64} />
              <h2 id="turnout-title" className="text-display-md">
                {turnout.name}. <em className="block text-[0.55em] leading-tight text-muted-ink">{turnout.line}</em>
              </h2>
            </div>
            <p className="mt-8 text-display-sm leading-[1.25]">{turnout.what}</p>
            <p className="mt-6 text-[1.25rem] leading-[1.5] text-muted-ink md:text-[1.375rem]">{turnout.body}</p>
            <dl className="mt-8 grid grid-cols-3 gap-x-4 border-t border-linen-deep pt-5">
              {turnout.facts.map((f) => (
                <div key={f.label}>
                  <dt className="label">{f.label}</dt>
                  <dd className="mt-2 text-[1.125rem] leading-tight">{f.value}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-8">
              <TextLink href="/work/when-youre-the-one-building-it">Read the Turnout story</TextLink>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Selected work */}
      <section aria-labelledby="work-title" className="frame py-20 md:py-28">
        <SectionHeading
          label="Selected work"
          id="work-title"
          title={<>A few things I’ve <em className="text-cherry">worked on.</em></>}
        />
        <div className="mt-16 space-y-24 md:mt-24 md:space-y-36">
          {selected.map((p, i) => (
            <ProjectCard key={p.slug} project={p} index={projects.indexOf(p)} flipIndex={i + 1} />
          ))}
        </div>
        <div className="mt-20 flex justify-end md:mt-28">
          <TextLink href="/work">All six case studies</TextLink>
        </div>
      </section>

      {/* Executive delivery: Canaccord */}
      {executive && (
        <section aria-labelledby="executive-title" className="bg-oxblood text-paper">
          <div className="frame py-20 md:py-28">
            <div className="grid-12 gap-y-8">
              <p className="label col-span-4 border-t border-paper/20 pt-4 !text-paper/70 md:col-span-12">Executive-level delivery · {executive.context}</p>
              <h2 id="executive-title" className="col-span-4 text-display-lg md:col-span-6">{executive.title}</h2>
              <div className="col-span-4 md:col-span-5 md:col-start-8">
                <p className="label !text-paper/70">{executive.role}</p>
                <p className="mt-4 text-[1.25rem] leading-[1.5] md:text-[1.375rem]">{executive.summary}</p>
                <ul className="mt-8 space-y-3 border-t border-paper/20 pt-5">
                  {executive.whatChanged.map((o) => (
                    <li key={o.text} className="text-display-sm">{o.title}</li>
                  ))}
                </ul>
                <div className="mt-8">
                  <TextLink href={`/work/${executive.slug}`} className="!text-paper hover:!text-paper/70">Read the Canaccord story</TextLink>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* A little about me: keeps the original "little bit of everything" ethos */}
      <section aria-labelledby="about-title" className="frame py-20 md:py-28">
        <div className="grid-12">
          <div className="col-span-4 border-t border-linen-deep pt-4 md:col-span-12">
            <span className="label">{aboutTeaser.label}</span>
          </div>
          <Reveal className="col-span-4 mt-10 md:col-span-8 md:col-start-4 md:mt-14">
            <h2 id="about-title" className="text-display-lg">
              <span className="block">A little bit of <em className="text-cherry">everything.</em></span>
              <span className="block">A lot of getting things done.</span>
            </h2>
          </Reveal>
          <Reveal delay={100} className="prose-editorial col-span-4 mt-10 text-[1.375rem] leading-[1.45] md:col-span-5 md:col-start-4 md:mt-14 md:text-[1.5rem]">
            {aboutTeaser.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
            <div className="!mt-8">
              <TextLink href="/about">My story</TextLink>
            </div>
          </Reveal>
          <Reveal as="aside" delay={200} className="col-span-4 mt-12 md:col-span-3 md:col-start-10 md:mt-24">
            <p className="border-l border-cherry pl-6 text-[1.625rem] italic leading-[1.25] text-cherry">{aboutTeaser.pullQuote}</p>
          </Reveal>
        </div>
      </section>


      {/* Visitor journeys */}
      <nav aria-labelledby="journeys-title" className="frame pb-20 md:pb-28">
        <h2 id="journeys-title" className="label border-t border-linen-deep pt-4">Where would you like to start?</h2>
        <ul className="mt-4 grid grid-cols-1 md:grid-cols-3">
          {journeys.map((j, i) => (
            <li key={j.audience} className={`border-b border-linen-deep md:border-b-0 ${i > 0 ? "md:border-l md:pl-8" : ""} md:pr-8`}>
              <div className="group relative py-8">
                <p className="label text-cherry">{j.audience}</p>
                <p className="mt-4 text-display-sm transition-colors duration-500 group-hover:text-cherry">{j.title}</p>
                <div className="mt-6">
                  <TextLink href={j.href} className="static after:absolute after:inset-0 after:content-['']">
                    {j.cta}
                  </TextLink>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </nav>

      {/* Beyond the boardroom */}
      <section aria-labelledby="beyond-title" className="bg-butter/50 py-20 md:py-28">
        <div className="frame">
          <SectionHeading
            label={beyondWork.label}
            id="beyond-title"
            title={<>There’s more to life than a <em className="text-cherry">job title.</em></>}
            intro={beyondWork.intro}
          />
          <div className="mt-14 md:mt-20">
            <InterestsCollage interests={beyondWork.interests} />
          </div>
        </div>
      </section>
    </>
  );
}
