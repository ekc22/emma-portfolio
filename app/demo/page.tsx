import type { Metadata } from "next";
import CosDemo from "@/components/CosDemo";
import TextLink from "@/components/TextLink";

export const metadata: Metadata = {
  title: "CoS OS demo",
  description:
    "A guided demo of CoS OS, the AI Chief of Staff platform Emma Clark built, using a fictional company raising an £8m Series A.",
  alternates: { canonical: "/demo/" },
};

export default function DemoPage() {
  return (
    <>
      <section className="frame pb-10 pt-12 md:pb-14 md:pt-20">
        <div className="grid-12">
          <p className="label col-span-4 md:col-span-12">CoS OS · Guided demo</p>
          <h1 className="col-span-4 mt-6 text-display-lg md:col-span-9 md:mt-8 motion-safe:animate-page-in">
            Meet the AI <em className="text-cherry">Chief of Staff.</em>
          </h1>
          <div className="col-span-4 mt-6 space-y-4 text-[1.25rem] leading-[1.45] md:col-span-7 md:mt-8 md:text-[1.375rem]">
            <p>
              This is the desk of Fernhill Systems, a fictional company raising an £8m Series A. Choose a question and the Chief of Staff answers from
              the priorities, pipeline and decisions on the desk.
            </p>
            <p className="text-[1.0625rem] leading-snug text-muted-ink md:text-[1.125rem]">
              The answers are samples, written in advance to show how CoS OS responds. In the live product they are generated from the records, and any
              change the AI proposes waits for a person to approve it. Everything runs in your browser; nothing is sent anywhere.
            </p>
          </div>
        </div>
      </section>

      <section aria-label="Demo" className="frame pb-16 md:pb-24">
        <CosDemo />
      </section>

      <section className="frame pb-20 md:pb-28">
        <div className="flex flex-wrap gap-x-10 gap-y-4 border-t border-linen-deep pt-8">
          <TextLink href="/work/cos-os">Read the CoS OS case study</TextLink>
          <TextLink href="/work">All work</TextLink>
        </div>
      </section>
    </>
  );
}
