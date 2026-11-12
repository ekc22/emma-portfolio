import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import TextLink from "@/components/TextLink";
import { getProject } from "@/content/projects";
import { offerings, waysToWork, workWithMe } from "@/content/services";
import { mailto } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Work With Me",
  description:
    "Growth and go-to-market, founder’s office and strategic execution, and AI and business operations: fractional, project-based or permanent.",
  alternates: { canonical: "/work-with-me/" },
};

export default function WorkWithMePage() {
  return (
    <>
      {/* Intro */}
      <section className="frame pb-20 pt-12 md:pb-24 md:pt-20">
        <div className="grid-12">
          <p className="label col-span-4 md:col-span-12">Work with me</p>
          <h1 className="col-span-4 mt-8 text-display-xl md:col-span-11 md:mt-12 motion-safe:animate-page-in">
            From ambitious ideas to <em className="text-cherry">meaningful progress.</em>
          </h1>
          <div className="prose-editorial col-span-4 mt-12 text-[1.375rem] leading-[1.45] md:col-span-6 md:col-start-6 md:mt-16 md:text-[1.5rem]">
            {workWithMe.intro.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Three areas of support */}
      <section aria-labelledby="help-title" className="frame pb-20 md:pb-28">
        <div className="border-t border-linen-deep pt-4">
          <h2 id="help-title" className="label">Where I can help</h2>
        </div>
        <ol>
          {offerings.map((o, i) => {
            const href = mailto(o.subject);
            const studies = o.caseStudies.map(getProject).filter((p): p is NonNullable<typeof p> => Boolean(p));
            return (
              <li key={o.id} id={o.id} className="grid-12 gap-y-8 border-b border-linen-deep py-14 md:py-20">
                <span aria-hidden="true" className="col-span-4 font-serif text-[clamp(3.5rem,7vw,6rem)] leading-[0.8] text-linen-deep md:col-span-2">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <Reveal className="col-span-4 md:col-span-5 md:col-start-3">
                  <h3 className="text-display-md">{o.title}</h3>
                  <p className="mt-5 max-w-[34ch] text-[1.375rem] leading-[1.45] text-muted-ink">{o.description}</p>
                  {href && (
                    <div className="mt-8">
                      <TextLink href={href}>Talk about this</TextLink>
                    </div>
                  )}
                </Reveal>
                <Reveal delay={100} className="col-span-4 md:col-span-4 md:col-start-9">
                  <h4 className="label">Areas of support</h4>
                  <ul className="mt-4 space-y-2">
                    {o.areas.map((a) => (
                      <li key={a} className="flex gap-3 border-b border-linen-deep/70 pb-2">
                        <span aria-hidden="true" className="text-cherry">/</span>
                        {a}
                      </li>
                    ))}
                  </ul>
                  {studies.length > 0 && (
                    <div className="mt-8">
                      <h4 className="label">See it in practice</h4>
                      <ul className="mt-3 space-y-2">
                        {studies.map((p) => (
                          <li key={p.slug}>
                            <Link href={`/work/${p.slug}`} className="italic text-cherry transition-colors hover:text-oxblood">
                              {p.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </Reveal>
              </li>
            );
          })}
        </ol>
      </section>

      {/* Ways to work together */}
      <section aria-labelledby="ways-title" className="bg-butter/50">
        <div className="frame py-20 md:py-28">
          <div className="grid-12 gap-y-10">
            <div className="col-span-4 border-t border-linen-deep pt-4 md:col-span-12">
              <span className="label">Ways to work together</span>
            </div>
            <h2 id="ways-title" className="col-span-4 text-display-md md:col-span-5">
              I’m interested in…
            </h2>
            <div className="col-span-4 md:col-span-6 md:col-start-7">
              <ul>
                {waysToWork.types.map((t) => {
                  const href = mailto(t.subject);
                  return (
                    <li key={t.title} className="border-b border-linen-deep">
                      {href ? (
                        <a href={href} className="group flex items-baseline justify-between gap-6 py-5 text-[1.5rem] leading-snug transition-colors hover:text-cherry">
                          {t.title}
                          <span aria-hidden="true" className="text-cherry transition-transform duration-500 ease-editorial group-hover:translate-x-1">→</span>
                        </a>
                      ) : (
                        <span className="block py-5 text-[1.5rem] leading-snug">{t.title}</span>
                      )}
                    </li>
                  );
                })}
              </ul>
              <p className="mt-8 text-display-sm italic text-cherry">{waysToWork.emphasis}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
