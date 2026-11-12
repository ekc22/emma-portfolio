import { withBase } from "@/lib/paths";

type Props = { ratio?: string; className?: string; hoverZoom?: boolean; figureWidth?: string };

/**
 * Turnout's running figures on Turnout blue. Turnout keeps its own brand:
 * shown on its own ground, never merged into the EMMA CLARK mark.
 */
export default function TurnoutPanel({ ratio = "4 / 3", className = "", hoverZoom, figureWidth = "58%" }: Props) {
  return (
    <div className={`relative flex items-center justify-center overflow-hidden bg-turnout ${className}`} style={{ aspectRatio: ratio }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={withBase("/images/turnout-figures.svg")}
        alt="Turnout logo: two running figures"
        width={2154}
        height={1238}
        style={{ width: figureWidth, height: "auto" }}
        className={
          hoverZoom
            ? "motion-safe:transition-transform motion-safe:duration-[1200ms] motion-safe:ease-editorial motion-safe:group-hover:scale-[1.04]"
            : ""
        }
      />
    </div>
  );
}
