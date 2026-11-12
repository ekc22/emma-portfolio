import type { Metadata } from "next";
import Link from "next/link";
import ProjectCard from "@/components/ProjectCard";
import SectionHeading from "@/components/SectionHeading";
import { projects } from "@/content/projects";

export const metadata: Metadata = {
  title: "Work",
  description: "Selected projects across strategy, operations, AI and founding a venture.",
  alternates: { canonical: "/work" },
};

export default function WorkPage() {
  return (
    <>
      <section className="frame pb-16 pt-12 md:pb-24 md:pt-20">
        <SectionHeading
          as="h1"
          label="Selected work"
          title={<>Projects, ventures and <em className="text-cherry">things I’ve built.</em></>}
          intro="A small selection of work across strategy, operations, technology and founding something of my own. Each one separates what I did from what the wider team achieved."
        />

        {/* Contents-page index */}
        <nav aria-label="Project index" className="mt-16 md:mt-24">
          <ol className="border-t border-linen-deep">
            {projects.map((p, i) => (
              <li key={p.slug} className="border-b border-linen-deep">
                <Link
                  href={`/work/${p.slug}`}
                  className="group grid grid-cols-[2.5rem_1fr] items-baseline gap-x-4 py-5 transition-colors hover:text-cherry md:grid-cols-[4rem_1fr_16rem_2rem]"
                >
                  <span className="label">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-serif text-2xl md:text-3xl">{p.title}</span>
                  <span className="col-start-2 text-[0.875rem] text-muted-ink md:col-start-auto">{p.category}</span>
                  <span aria-hidden="true" className="hidden transition-transform duration-500 ease-editorial group-hover:translate-x-1 md:block">→</span>
                </Link>
              </li>
            ))}
          </ol>
        </nav>
      </section>

      <section aria-label="Projects" className="frame pb-24 md:pb-40">
        <div className="space-y-28 md:space-y-44">
          {projects.map((p, i) => (
            <ProjectCard key={p.slug} project={p} index={i} headingLevel="h2" />
          ))}
        </div>
      </section>
    </>
  );
}
