import CapabilityCard from "@/components/CapabilityCard";
import CurrentlyList from "@/components/CurrentlyList";
import Hero from "@/components/Hero";
import InterestsCollage from "@/components/InterestsCollage";
import ProjectCard from "@/components/ProjectCard";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import TextLink from "@/components/TextLink";
import { aboutTeaser, beyondWork, capabilities, currently } from "@/content/profile";
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

      {/* 02 — A little about me */}
      <section aria-labelledby="about-title" className="frame py-20 md:py-32">
        <div className="grid-12">
          <div className="col-span-4 flex gap-4 border-t border-charcoal/15 pt-4 md:col-span-12">
            <span className="label text-burgundy">02</span>
            <span className="label">{aboutTeaser.label}</span>
          </div>
          <Reveal className="col-span-4 mt-12 md:col-span-7 md:col-start-4 md:mt-16">
            <h2 id="about-title" className="text-display-lg">
              Business-minded. <em className="text-burgundy">Curious</em> by nature.
            </h2>
          </Reveal>
          <Reveal delay={100} className="prose-editorial col-span-4 mt-12 text-lg md:col-span-5 md:col-start-4 md:mt-20">
            {aboutTeaser.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
            <div className="!mt-10">
              <TextLink href="/about">More about me</TextLink>
            </div>
          </Reveal>
          <Reveal as="aside" delay={200} className="col-span-4 mt-14 md:col-span-3 md:col-start-10 md:mt-28">
            <div className="border-l border-burgundy pl-6">
              <p className="font-serif text-[1.75rem] italic leading-[1.2] text-burgundy">{aboutTeaser.pullQuote}</p>
            </div>
          </Reveal>
        </div>
      </section>

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
          title={<>A few things I’ve <em className="text-burgundy">worked on.</em></>}
        />
        <div className="mt-16 space-y-28 md:mt-28 md:space-y-44">
          {featuredProjects.map((p, i) => (
            <ProjectCard key={p.slug} project={p} index={i} />
          ))}
        </div>
        <div className="mt-24 flex justify-end md:mt-32">
          <TextLink href="/work">See all work</TextLink>
        </div>
      </section>

      {/* 05 — Beyond the work */}
      <section aria-labelledby="beyond-title" className="bg-white/60 py-20 md:py-32">
        <div className="frame">
          <SectionHeading
            number="05"
            label={beyondWork.label}
            id="beyond-title"
            title={<>There’s more to life than a <em className="text-burgundy">job title.</em></>}
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
        <div className="mt-12 flex items-center justify-between gap-6 text-[0.875rem]">
          <p className="text-muted-ink">Updated {currently.updated}</p>
          <TextLink href="/currently">More of what I’m thinking about</TextLink>
        </div>
      </section>
    </>
  );
}
