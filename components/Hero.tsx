import { hero, workedWith } from "@/content/profile";
import { site } from "@/content/site";
import EditorialImage from "./EditorialImage";
import TextLink from "./TextLink";

/** "From the boardroom to the blank sheet." Oversized serif with deliberate line breaks; works with or without a portrait. */
export default function Hero() {
  return (
    <section aria-labelledby="hero-title" className="frame pb-16 pt-10 md:pb-24 md:pt-16">
      <div className="grid-12">
        <div className="col-span-4 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 md:col-span-12 motion-safe:animate-page-in">
          <p className="label">{hero.eyebrow}</p>
          <p className="label text-cherry">{site.roles.join(". ")}.</p>
        </div>

        <h1 id="hero-title" className="col-span-4 mt-8 text-display-xl md:col-span-12 md:mt-12">
          <span className="block motion-safe:animate-page-in">From the</span>
          <span className="block motion-safe:animate-page-in [animation-delay:90ms]">boardroom</span>
          <span className="block md:pl-[16.66%] motion-safe:animate-page-in [animation-delay:180ms]">to the</span>
          <span className="block italic text-cherry md:pl-[16.66%] motion-safe:animate-page-in [animation-delay:270ms]">blank sheet.</span>
        </h1>

        <div className="col-span-4 mt-14 md:col-span-6 md:col-start-3 md:mt-20">
          <div className="prose-editorial text-[1.375rem] leading-[1.45] md:text-[1.625rem]">
            {hero.intro.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-x-10 gap-y-4">
            <TextLink href="/work">Explore my work</TextLink>
            <TextLink href="/work-with-me">Work with me</TextLink>
          </div>
        </div>

        <figure className="col-span-3 col-start-2 mt-16 md:col-span-3 md:col-start-10 md:-mt-6 lg:-mt-[24rem] xl:-mt-[30rem]">
          <EditorialImage
            image={hero.portrait}
            brief="Founder portrait: waist up, three-quarter turn, paper-toned wall, one cherry note. Real photograph only."
            ratio="4 / 5"
            sizes="(min-width: 768px) 25vw, 75vw"
            priority
          />
          <figcaption className="mt-3 text-[1rem] leading-snug text-muted-ink">
            <span className="block text-oxblood">{site.name}</span>
            <span className="block italic">{site.roles.join(" · ")}</span>
          </figcaption>
        </figure>
      </div>

      {/* Credibility: where Emma has worked */}
      <div className="mt-20 border-t border-linen-deep pt-5 md:mt-28">
        <p className="label">Where I’ve worked</p>
        <ul className="mt-4 flex flex-wrap gap-x-3 gap-y-1 text-[0.8125rem] font-semibold uppercase tracking-label text-oxblood md:text-[0.875rem]">
          {workedWith.map((name, i) => (
            <li key={name}>
              {name}
              {i < workedWith.length - 1 && <span aria-hidden="true" className="ml-3 text-cherry">/</span>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
