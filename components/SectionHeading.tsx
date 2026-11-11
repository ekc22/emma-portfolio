import type { ReactNode } from "react";
import Reveal from "./Reveal";

type Props = {
  number?: string;
  label: string;
  title?: ReactNode;
  intro?: ReactNode;
  as?: "h1" | "h2";
  id?: string;
  className?: string;
};

/** Numbered small-caps label on a fine rule, with an optional large serif headline. */
export default function SectionHeading({ number, label, title, intro, as: H = "h2", id, className = "" }: Props) {
  return (
    <header className={`grid-12 ${className}`}>
      <div className="rule col-span-4 flex items-baseline gap-4 pt-4 md:col-span-12">
        {number && <span className="label text-burgundy">{number}</span>}
        <span className="label">{label}</span>
      </div>
      {title && (
        <Reveal className="col-span-4 mt-10 md:col-span-10 md:mt-14 lg:col-span-9">
          <H id={id} className="text-display-lg">
            {title}
          </H>
        </Reveal>
      )}
      {intro && (
        <Reveal delay={100} className="col-span-4 mt-6 max-w-measure text-lg text-muted-ink md:col-span-6 md:mt-8">
          {intro}
        </Reveal>
      )}
    </header>
  );
}
