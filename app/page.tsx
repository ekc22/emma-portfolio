import Link from "next/link";
import Hero from "@/components/Hero";
import InterestsCollage from "@/components/InterestsCollage";
import ProjectCard from "@/components/ProjectCard";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import TextLink from "@/components/TextLink";
import Opportunities from "@/components/Opportunities";
import { beyondWork, facts, founderPerspective, whatIBring } from "@/content/profile";
import { projects } from "@/content/projects";
import { site } from "@/content/site";

/** Featured, in this order: CoS OS, Turnout and the seed-stage AI venture. The rest live on /work. */
const selected = ["cos-os", "when-youre-the-one-building-it", "finding-a-market-before-the-playbook"]
  .map((slug) => projects.find((p) => p.slug === slug))
  .filter((p): p is (typeof projects)[number] => Boolean(p));

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

      {/* Selected work */}
      <section aria-labelledby="work-title" className="frame py-20 md:py-28">
        <SectionHeading
          label="Selected work"
          id="work-title"
          title={<>A few things I’ve <em className="text-cherry">worked on.</em></>}
        />
        <div className="mt-16 space-y-24 md:mt-24 md:space-y-36">
          {selected.map((p, i) => (
            <ProjectCard key={p.slug} project={p} index={projects.indexOf(p)} flipIndex={i} />
          ))}
        </div>
        <div className="mt-20 flex justify-end md:mt-28">
          <TextLink href="/work">See all projects</TextLink>
        </div>
      </section>

      {/* What I bring */}
      <section aria-labelledby="bring-title" className="frame py-20 md:py-28">
        <div className="grid-12 gap-y-10">
          <div className="col-span-4 border-t border-linen-deep pt-4 md:col-span-12">
            <span className="label">{whatIBring.label}</span>
          </div>
          <Reveal className="col-span-4 md:col-span-7">
            <h2 id="bring-title" className="text-display-lg">
              I can see the bigger picture. <em className="text-cherry">I can also build what’s missing.</em>
            </h2>
          </Reveal>
          <Reveal delay={100} className="prose-editorial col-span-4 text-[1.375rem] leading-[1.45] md:col-span-4 md:col-start-9 md:self-end md:text-[1.5rem]">
            {whatIBring.intro.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </Reveal>
          <ol className="col-span-4 mt-4 grid grid-cols-1 sm:grid-cols-2 md:col-span-12 md:mt-10 md:grid-cols-4">
            {whatIBring.items.map((it, i) => (
              <li key={it.title} className={`border-t border-linen-deep py-6 md:border-t-0 md:py-0 ${i > 0 ? "md:border-l md:pl-6" : ""} md:pr-6`}>
                <p className="label text-cherry">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-3 text-display-sm">{it.title}</h3>
                <p className="mt-3 text-[1.125rem] leading-snug text-muted-ink">{it.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Founder perspective */}
      <section aria-labelledby="founder-title" className="bg-oxblood text-paper">
        <div className="frame py-20 md:py-28">
          <div className="grid-12 gap-y-8">
            <p className="label col-span-4 border-t border-paper/20 pt-4 !text-paper/70 md:col-span-12">{founderPerspective.label}</p>
            <Reveal className="col-span-4 md:col-span-6">
              <h2 id="founder-title" className="text-display-lg">
                I’ve sat on <em>both sides</em> of the table.
              </h2>
            </Reveal>
            <Reveal delay={100} className="col-span-4 md:col-span-5 md:col-start-8 md:self-end">
              <div className="space-y-5 text-[1.25rem] leading-[1.5] md:text-[1.375rem]">
                {founderPerspective.body.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-x-10 gap-y-3">
                <TextLink href="/work/when-youre-the-one-building-it" className="!text-paper hover:!text-paper/70">Building Turnout</TextLink>
                <TextLink href="/about" className="!text-paper hover:!text-paper/70">My story</TextLink>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Beyond the boardroom */}
      <section aria-labelledby="beyond-title" className="frame py-20 md:py-28">
        <SectionHeading
          label={beyondWork.label}
          id="beyond-title"
          title={<>A curious mind rarely stays <em className="text-cherry">in one place.</em></>}
          intro={beyondWork.intro}
        />
        <div className="mt-14 md:mt-20">
          <InterestsCollage interests={beyondWork.interests} />
        </div>
      </section>

      {/* Opportunities */}
      <Opportunities />
    </>
  );
}
