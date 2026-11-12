import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import TextLink from "@/components/TextLink";
import { getProject } from "@/content/projects";
import Opportunities from "@/components/Opportunities";
import { offerings, workWithMe } from "@/content/services";
import { mailto } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Work With Me",
  description:
    "Founder’s office and strategic execution, commercial strategy and go-to-market, and AI enablement and business operations: the problems Emma Clark can own in a founder-led business.",
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
            Good ideas need people who <em className="text-cherry">make them happen.</em>
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
          <h2 id="help-title" className="label">What I can own</h2>
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
                  <h4 className="label">Including</h4>
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

      <Opportunities />
    </>
  );
}
