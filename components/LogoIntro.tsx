import { site } from "@/content/site";

/**
 * Logo in motion (brand guidelines §06). Plays once per session as a page loader:
 * letters E-M-M-A, C-L-A-R-K fade in left to right (380 ms each, 40 ms stagger),
 * then the descriptor line at 550 ms. Gone by about 1.35 s; the final frame is the static logo.
 *
 * Pure CSS: an inline script in <head> adds `intro` to <html> only on the first page
 * view of a session, and never with prefers-reduced-motion. Without JS it never shows.
 */
export default function LogoIntro() {
  let i = 0;
  return (
    <div className="logo-intro" aria-hidden="true">
      <div className="text-center">
        <p className="wordmark text-[clamp(3rem,11vw,8.5rem)]">
          {site.name.split(" ").map((word, w) => (
            <span key={word} className="inline-block whitespace-nowrap">
              {w > 0 && " "}
              {word.split("").map((ch) => (
                <span key={`${word}-${i}`} className="logo-intro-letter" style={{ animationDelay: `${i++ * 40}ms` }}>
                  {ch}
                </span>
              ))}
            </span>
          ))}
        </p>
        <p className="logo-intro-descriptor mt-5 px-4 text-[clamp(0.625rem,1.4vw,1rem)] font-medium uppercase tracking-[0.14em] text-oxblood">
          {site.roles.join(" · ")}
        </p>
      </div>
    </div>
  );
}
