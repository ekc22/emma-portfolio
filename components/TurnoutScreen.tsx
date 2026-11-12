import { withBase } from "@/lib/paths";

type Props = { ratio?: string; className?: string; hoverZoom?: boolean; caption?: boolean };

/**
 * One Turnout concept screen ("A place opened up") rising from the bottom of a Turnout-blue panel.
 * Product and UX by Emma; brand by A Plus M Studio.
 */
export default function TurnoutScreen({ ratio = "4 / 3", className = "", hoverZoom, caption }: Props) {
  return (
    <figure className={className}>
      <div className="relative flex items-end justify-center overflow-hidden bg-turnout" style={{ aspectRatio: ratio }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={withBase("/images/turnout-place-opened.png")}
          alt="Turnout concept screen: a place opened up on a Saturday long run, held for 9 minutes 41 before it passes to the next person, with a hold-to-take-it button."
          width={678}
          height={1354}
          loading="lazy"
          className={`h-[88%] w-auto origin-bottom ${
            hoverZoom ? "motion-safe:transition-transform motion-safe:duration-[1200ms] motion-safe:ease-editorial motion-safe:group-hover:-translate-y-2" : ""
          }`}
        />
      </div>
      {caption && (
        <figcaption className="mt-3 text-[1rem] leading-snug text-muted-ink">
          Concept direction, 2026. Product and UX by me; brand by A Plus M Studio.
        </figcaption>
      )}
    </figure>
  );
}
