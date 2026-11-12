import Image from "next/image";
import { withBase } from "@/lib/paths";

export type ImageAsset = { src: string; alt: string; width: number; height: number };

type Props = {
  image?: ImageAsset;
  /** What should go here — printed on the placeholder until a real image is supplied. */
  brief: string;
  ratio?: string; // CSS aspect-ratio, e.g. "4 / 5"
  sizes?: string;
  priority?: boolean;
  className?: string;
  hoverZoom?: boolean;
  tone?: "linen" | "deep" | "cherry";
};

/**
 * Real photograph when supplied, otherwise a quiet, clearly labelled placeholder.
 * Never shows stock or generated imagery.
 */
export default function EditorialImage({
  image,
  brief,
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

  const tones = {
    linen: "bg-linen",
    deep: "bg-linen-deep",
    cherry: "bg-cherry/[0.09]",
  };

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ aspectRatio: ratio }}
      role="img"
      aria-label={`Image placeholder: ${brief}`}
    >
      <div className={`absolute inset-0 ${tones[tone]} ${zoom}`}>
        {/* Fine paper-like grain, pure CSS. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.35] mix-blend-multiply"
          style={{
            backgroundImage:
              "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.7), transparent 55%), repeating-linear-gradient(135deg, rgba(37,37,37,0.035) 0 1px, transparent 1px 7px)",
          }}
        />
      </div>
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4 sm:p-5">
        <p className="max-w-[24ch] text-[0.75rem] leading-snug text-muted-ink">
          <span className="label mb-1 block !text-[0.625rem]">Image to come</span>
          {brief}
        </p>
        <span aria-hidden="true" className="font-serif text-2xl italic text-oxblood/30">
          ✕
        </span>
      </div>
    </div>
  );
}
