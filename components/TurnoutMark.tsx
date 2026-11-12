import { withBase } from "@/lib/paths";

/** Turnout's running figures as a small logo chip, always on Turnout blue (its own ground). */
export default function TurnoutMark({ size = 56, className = "" }: { size?: number; className?: string }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-[22%] bg-turnout ${className}`}
      style={{ width: size, height: size }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={withBase("/images/turnout-figures.svg")} alt="Turnout logo" width={2154} height={1238} style={{ width: "78%", height: "auto" }} />
    </span>
  );
}
