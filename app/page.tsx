import CapabilityCard from "@/components/CapabilityCard";
import CurrentlyList from "@/components/CurrentlyList";
import Hero from "@/components/Hero";
import InterestsCollage from "@/components/InterestsCollage";
import ProjectCard from "@/components/ProjectCard";
import Reveal from "@/components/Reveal";
import ReviewNote from "@/components/ReviewNote";
import SectionHeading from "@/components/SectionHeading";
import TextLink from "@/components/TextLink";
import { aboutTeaser, beyondWork, capabilities, currently, facts, journeys } from "@/content/profile";
import { featuredProjects } from "@/content/projects";
import { site } from "@/content/site";

export default function Home() {
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    jobTitle: site.roles.join(", "),
    description: site.valueProposition,
    url: site.url,
    ...(site.links.linkedin ? { sameAs: [site.links.linkedin] } : {}),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />

      <Hero />

      {/* 02 — A little about me (keeps the original "little bit of everything" ethos) */}
      <section aria-labelledby="about-title" className="frame py-20 md:py-28">
        <div className="grid-12">
          <div className="col-span-4 flex gap-4 border-t border-linen-deep pt-4 md:col-span-12">
            <span className="label text-cherry">02</span>
            <span className="label">{aboutTeaser.label}</span>
          </div>
          <Reveal className="col-span-4 mt-12 md:col-span-8 md:col-start-4 md:mt-16">
            <h2 id="about-title" className="text-display-lg">
              <span className="block">A little bit of <em className="text-cherry">everything.</em></span>
              <span className="block">A lot of getting things done.</span>
            </h2>
          </Reveal>
          <Reveal delay={100} className="prose-editorial col-span-4 mt-12 text-[1.5rem] leading-[1.4] md:col-span-5 md:col-start-4 md:mt-20 md:text-[1.75rem]">
            {aboutTeaser.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
            <div className="!mt-10">
              <TextLink href="/about">My story</TextLink>
            </div>
          </Reveal>
          <Reveal as="aside" delay={200} className="col-span-4 mt-14 md:col-span-3 md:col-start-10 md:mt-28">
            <div className="border-l border-cherry pl-6">
              <p className="font-serif text-[1.75rem] italic leading-[1.2] text-cherry">{aboutTeaser.pullQuote}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Credibility strip */}
      <section aria-labelledby="facts-title" className="bg-butter/50">
        <div className="frame py-16 md:py-24">
          <h2 id="facts-title" className="label">In numbers</h2>
          <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4 md:gap-x-0">
            {facts.map((f, i) => (
              <Reveal key={f.figure} delay={i * 80} className={`flex flex-col-reverse ${i > 0 ? "md:border-l md:border-linen-deep md:pl-8" : ""} md:pr-8`}>
                <dt className="mt-3 max-w-[24ch] text-[1.0625rem] leading-snug text-muted-ink">{f.label}</dt>
                <dd className="font-serif text-[clamp(2.75rem,5vw,4.5rem)] leading-none text-cherry">{f.figure}</dd>
              </Reveal>
            ))}
          </dl>
          <ReviewNote className="mt-10">Figures to confirm as current and shareable</ReviewNote>
        </div>
      </section>

      {/* Visitor journeys */}
      <nav aria-labelledby="journeys-title" className="frame py-20 md:py-28">
        <h2 id="journeys-title" className="label">Where would you like to start?</h2>
        <ul className="mt-8 grid grid-cols-1 border-t border-linen-deep md:grid-cols-3">
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

      {/* 03 — What I bring to the table */}
      <section aria-labelledby="capabilities-title" className="frame py-20 md:py-28">
        <SectionHeading number="03" label="Capabilities" id="capabilities-title" title="What I bring to the table." />
        <div className="mt-16 grid grid-cols-1 gap-x-16 md:mt-24 md:grid-cols-2">
          {capabilities.map((c, i) => (
            <Reveal key={c.title} delay={(i % 2) * 100}>
              <CapabilityCard capability={c} index={i} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* 04 — Selected work */}
      <section aria-labelledby="work-title" className="frame py-20 md:py-32">
        <SectionHeading
          number="04"
          label="Selected work"
          id="work-title"
          title={<>A few things I’ve <em className="text-cherry">worked on.</em></>}
        />
        <div className="mt-16 space-y-28 md:mt-28 md:space-y-44">
          {featuredProjects.map((p, i) => (
            <ProjectCard key={p.slug} project={p} index={i} />
          ))}
        </div>
        <div className="mt-24 flex justify-end md:mt-32">
          <TextLink href="/work">All five stories</TextLink>
        </div>
      </section>

      {/* 05 — Beyond the boardroom */}
      <section aria-labelledby="beyond-title" className="bg-butter/50 py-20 md:py-32">
        <div className="frame">
          <SectionHeading
            number="05"
            label={beyondWork.label}
            id="beyond-title"
            title={<>A curious mind rarely stays <em className="text-cherry">in one place.</em></>}
            intro={beyondWork.intro}
          />
          <div className="mt-16 md:mt-24">
            <InterestsCollage interests={beyondWork.interests} />
          </div>
        </div>
      </section>

      {/* 06 — Currently */}
      <section aria-labelledby="currently-title" className="frame py-20 md:py-32">
        <SectionHeading number="06" label={currently.label} id="currently-title" title={currently.headline} />
        <div className="mt-14 md:mt-20">
          <CurrentlyList entries={currently.entries} />
        </div>
        <div className="mt-12 flex items-center justify-between gap-6">
          <p className="text-muted-ink">Updated {currently.updated}</p>
          <TextLink href="/currently">More of what I’m thinking about</TextLink>
        </div>
      </section>
    </>
  );
}
