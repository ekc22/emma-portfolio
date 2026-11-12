import Image from "next/image";
import { withBase } from "@/lib/paths";

export type ImageAsset = { src: string; alt: string; width: number; height: number };

type Props = {
  image?: ImageAsset;
  /** Typographic fallback when no image exists: the headline fact, set large. */
  motif?: { figure: string; caption: string };
  ratio?: string; // CSS aspect-ratio, e.g. "4 / 5"
  sizes?: string;
  priority?: boolean;
  className?: string;
  hoverZoom?: boolean;
  tone?: "linen" | "deep" | "cherry" | "turnout" | "butter";
};

/**
 * A real photograph when supplied; otherwise a typography-led panel.
 * Never shows stock imagery or visible "image to come" placeholders.
 */
export default function EditorialImage({
  image,
  motif,
  ratio = "4 / 5",
  sizes = "(min-width: 768px) 50vw, 100vw",
  priority,
  className = "",
  hoverZoom,
  tone = "linen",
}: Props) {
  const zoom = hoverZoom
    ? "motion-safe:transition-transform motion-safe:duration-[1200ms] motion-safe:ease-editorial motion-safe:group-hover:scale-[1.03]"
    : "";

  if (image) {
    return (
      <div className={`relative overflow-hidden bg-linen ${className}`} style={{ aspectRatio: ratio }}>
        <Image src={withBase(image.src)} alt={image.alt} fill sizes={sizes} priority={priority} className={`object-cover ${zoom}`} />
      </div>
    );
  }

  if (!motif) return null;

  const tones = {
    linen: "bg-linen text-oxblood",
    deep: "bg-linen-deep text-oxblood",
    cherry: "bg-cherry text-paper",
    turnout: "bg-turnout text-oxblood",
    butter: "bg-butter text-oxblood",
  };

  return (
    <div className={`relative overflow-hidden ${tones[tone]} ${className}`} style={{ aspectRatio: ratio }} aria-hidden="true">
      <div className={`absolute inset-0 flex flex-col justify-end p-6 sm:p-8 md:p-10 ${zoom}`}>
        <span className="font-serif text-[clamp(3rem,8vw,7.5rem)] leading-[0.9] tracking-[-0.02em]">{motif.figure}</span>
        <span className="mt-4 max-w-[28ch] text-[0.75rem] font-semibold uppercase tracking-label opacity-75">{motif.caption}</span>
      </div>
    </div>
  );
}
