import { hero, identity, openTo, workedWith } from "@/content/profile";
import { mailto } from "@/lib/contact";
import { withBase } from "@/lib/paths";
import { hasCv } from "@/lib/cv";
import { site } from "@/content/site";
import EditorialImage from "./EditorialImage";
import TextLink from "./TextLink";

/**
 * "From the boardroom to the blank sheet." Oversized serif with deliberate line breaks.
 * Beside it: a portrait when supplied, otherwise Emma's professional identity in type.
 */
export default function Hero() {
  const talkHref = mailto();
  const cv = hasCv();
  return (
    <section aria-labelledby="hero-title" className="frame pb-16 pt-10 md:pb-24 md:pt-16">
      <div className="grid-12">
        <p className="label col-span-4 md:col-span-12 motion-safe:animate-page-in">{hero.eyebrow}</p>

        <h1 id="hero-title" className="col-span-4 mt-8 text-display-xl md:col-span-8 md:mt-12">
          <span className="block motion-safe:animate-page-in">From the</span>
          <span className="block motion-safe:animate-page-in [animation-delay:90ms]">boardroom</span>
          <span className="block md:pl-[12%] motion-safe:animate-page-in [animation-delay:180ms]">to the</span>
          <span className="block italic text-cherry md:pl-[12%] motion-safe:animate-page-in [animation-delay:270ms]">blank sheet.</span>
        </h1>

        <aside aria-label="Professional identity" className="col-span-4 mt-14 md:col-span-4 md:col-start-9 md:mt-14 md:self-end">
          {hero.portrait && (
            <EditorialImage image={hero.portrait} ratio="4 / 5" sizes="(min-width: 768px) 30vw, 90vw" priority className="mb-8" />
          )}
          <div className="border-t border-cherry pt-5">
            <p className="text-[1.125rem] text-oxblood">{site.name}</p>
            <p className="mt-1 text-display-sm text-cherry">{identity.title}</p>
            <p className="mt-4 text-muted-ink">{identity.positioning}</p>
            <p className="mt-5 text-[1.125rem] italic leading-snug">
              {identity.statement.map((line) => (
                <span key={line} className="block">{line}</span>
              ))}
            </p>
          </div>
        </aside>

        <div className="col-span-4 mt-14 md:col-span-6 md:col-start-3 md:mt-20">
          <div className="prose-editorial text-[1.375rem] leading-[1.45] md:text-[1.5rem]">
            {hero.intro.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap items-baseline gap-x-10 gap-y-4">
            <TextLink href="/work">Explore my work</TextLink>
            {talkHref && <TextLink href={talkHref}>Let’s talk</TextLink>}
            {cv ? (
              <a href={withBase(site.cv.path)} className="text-[1.0625rem] text-muted-ink underline decoration-linen-deep underline-offset-4 transition-colors hover:text-cherry">
                View CV
              </a>
            ) : (
              <span aria-disabled="true" title="Updated CV coming soon" className="cursor-default text-[1.0625rem] text-muted-ink underline decoration-linen-deep underline-offset-4 opacity-60">
                View CV
              </span>
            )}
          </div>
          <p className="mt-8 flex items-center gap-3 text-[1.0625rem] leading-snug text-muted-ink">
            <span aria-hidden="true" className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[#3F6B3A]" />
            {openTo}
          </p>
        </div>
      </div>

      {/* Credibility: where Emma has worked */}
      <div className="mt-20 border-t border-linen-deep pt-5 md:mt-24">
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
