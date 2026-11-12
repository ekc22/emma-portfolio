import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CaseStudyTemplate from "@/components/CaseStudyTemplate";
import { getProject, projects } from "@/content/projects";
import { ogImage } from "@/lib/seo";

type Params = { params: { slug: string } };

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: Params): Metadata {
  const project = getProject(params.slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/work/${project.slug}/` },
    openGraph: { type: "article", title: project.title, description: project.summary, url: `/work/${project.slug}/`, images: [ogImage] },
  };
}

export default function ProjectPage({ params }: Params) {
  const index = projects.findIndex((p) => p.slug === params.slug);
  if (index === -1) notFound();
  const nextIndex = (index + 1) % projects.length;
  return <CaseStudyTemplate project={projects[index]} index={index} next={projects[nextIndex]} nextIndex={nextIndex} />;
}
