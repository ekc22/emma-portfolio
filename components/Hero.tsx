import { hero } from "@/content/profile";
import { site } from "@/content/site";
import EditorialImage from "./EditorialImage";
import TextLink from "./TextLink";

/** Oversized serif headline with deliberate line breaks; portrait sits to the side and the layout holds without it. */
export default function Hero() {
  return (
    <section aria-labelledby="hero-title" className="frame pb-20 pt-10 md:pb-32 md:pt-16">
      <div className="grid-12">
        <p className="label col-span-4 md:col-span-12 motion-safe:animate-page-in">{site.eyebrow}</p>

        <h1 id="hero-title" className="col-span-4 mt-8 text-display-xl md:col-span-12 md:mt-12">
          <span className="block motion-safe:animate-page-in">A little bit of</span>
          <span className="block italic text-cherry motion-safe:animate-page-in [animation-delay:90ms]">everything.</span>
          <span className="block md:pl-[16.66%] motion-safe:animate-page-in [animation-delay:180ms]">A lot of getting</span>
          <span className="block md:pl-[16.66%] motion-safe:animate-page-in [animation-delay:270ms]">things done.</span>
        </h1>

        <div className="col-span-4 mt-14 md:col-span-6 md:col-start-3 md:mt-24 lg:col-span-5 lg:col-start-3">
          <div className="prose-editorial text-lg leading-[1.75] md:text-xl md:leading-[1.7]">
            {hero.intro.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-x-10 gap-y-4 text-base">
            <TextLink href="/work">Explore my work</TextLink>
            <TextLink href="/work-with-me">Work with me</TextLink>
          </div>
        </div>

        <figure className="col-span-3 col-start-2 mt-16 md:col-span-3 md:col-start-10 md:-mt-6 lg:-mt-[19rem] xl:-mt-[23rem]">
          <EditorialImage
            image={hero.portrait}
            brief="Founder portrait — waist up, three-quarter turn, paper-toned wall, one cherry note. Real photograph only."
            ratio="4 / 5"
            sizes="(min-width: 768px) 25vw, 75vw"
            priority
          />
          <figcaption className="mt-3 text-[0.75rem] leading-relaxed text-muted-ink">
            <span className="block text-oxblood">{site.name}</span>
            <span className="block italic">{site.roles.join(" · ")}</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
