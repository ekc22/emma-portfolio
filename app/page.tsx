import Link from "next/link";
import Hero from "@/components/Hero";
import ProjectCard from "@/components/ProjectCard";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import TextLink from "@/components/TextLink";
import Opportunities from "@/components/Opportunities";
import { capabilities, facts, homeAbout } from "@/content/profile";
import { projects } from "@/content/projects";

/** Featured, in this order: CoS OS, Turnout and the seed-stage AI venture. The rest live on /work. */
const selected = ["cos-os", "when-youre-the-one-building-it", "finding-a-market-before-the-playbook"]
  .map((slug) => projects.find((p) => p.slug === slug))
  .filter((p): p is (typeof projects)[number] => Boolean(p));

export default function Home() {

  return (
    <>

      <Hero />

      {/* Proof: evidence of execution */}
      <section aria-labelledby="facts-title" className="bg-butter/50">
        <div className="frame py-16 md:py-24">
          <h2 id="facts-title" className="label">Proof</h2>
          <ul className="mt-10 grid grid-cols-1 gap-y-10 sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-5 lg:gap-x-0">
            {facts.map((f, i) => (
              <Reveal as="li" key={f.title} delay={i * 60} className={`flex flex-col ${i > 0 ? "lg:border-l lg:border-linen-deep lg:pl-6" : ""} lg:pr-6`}>
                <p className="font-serif text-[clamp(2.75rem,4.2vw,3.75rem)] leading-none text-cherry">{f.figure}</p>
                <h3 className="mt-3 text-[1.25rem] leading-tight">{f.title}</h3>
                <p className="mt-2 text-[1rem] leading-snug text-muted-ink">{f.label}</p>
                {f.href && (
                  <Link href={f.href} className="mt-3 text-[0.9375rem] text-cherry underline decoration-cherry/30 underline-offset-4 hover:decoration-cherry">
                    See the work<span className="sr-only">: {f.title}</span>
                  </Link>
                )}
              </Reveal>
            ))}
          </ul>
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
          <TextLink href="/work">See all six projects</TextLink>
        </div>
      </section>

      {/* What I can own */}
      <section aria-labelledby="own-title" className="frame pb-20 md:pb-28">
        <div className="border-t border-linen-deep pt-4">
          <span className="label">{capabilities.label}</span>
        </div>
        <h2 id="own-title" className="mt-10 max-w-[18ch] text-display-lg md:mt-14">
          The work I can take <em className="text-cherry">off your plate.</em>
        </h2>
        <ol className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
          {capabilities.items.map((it, i) => (
            <li key={it.title} className={`border-t border-linen-deep py-6 lg:border-t-0 lg:py-0 ${i > 0 ? "lg:border-l lg:pl-6" : ""} lg:pr-6`}>
              <p className="label text-cherry">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="mt-3 text-[1.5rem] leading-tight">{it.title}</h3>
              <p className="mt-3 text-[1.0625rem] leading-snug text-muted-ink">{it.body}</p>
              <Link href={it.href} className="mt-4 inline-block text-[0.9375rem] italic text-cherry underline decoration-cherry/30 underline-offset-4 hover:decoration-cherry">
                Evidence: {it.evidence}
              </Link>
            </li>
          ))}
        </ol>
      </section>

      {/* About: short professional and personal introduction */}
      <section aria-labelledby="about-title" className="bg-oxblood text-paper">
        <div className="frame py-20 md:py-28">
          <div className="grid-12 gap-y-10">
            <p className="label col-span-4 border-t border-paper/20 pt-4 !text-paper/70 md:col-span-12">{homeAbout.label}</p>
            <Reveal className="col-span-4 md:col-span-6">
              <h2 id="about-title" className="text-display-lg">
                I’ve sat on <em>both sides</em> of the table.
              </h2>
              <div className="mt-8 space-y-5 text-[1.25rem] leading-[1.5] md:text-[1.375rem]">
                {homeAbout.body.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </Reveal>
            <Reveal delay={100} className="col-span-4 md:col-span-5 md:col-start-8 md:self-end">
              <h3 className="label !text-paper/70">{homeAbout.outsideLabel}</h3>
              <div className="mt-4 space-y-4 text-[1.125rem] leading-[1.5] text-paper/85">
                {homeAbout.outside.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-x-10 gap-y-3">
                <TextLink href="/about" className="!text-paper hover:!text-paper/70">My story</TextLink>
                <TextLink href="/work/when-youre-the-one-building-it" className="!text-paper hover:!text-paper/70">Building Turnout</TextLink>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Opportunities */}
      <Opportunities />
    </>
  );
}
