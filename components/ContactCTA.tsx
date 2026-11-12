import { contact } from "@/content/profile";
import { site } from "@/content/site";
import { mailto } from "@/lib/contact";
import Reveal from "./Reveal";

/** Closing contact section. Rendered on every page (from the layout) so the nav's #contact always resolves. */
export default function ContactCTA() {
  const href = mailto();

  return (
    <section id="contact" aria-labelledby="contact-title" className="bg-butter">
      <div className="frame py-24 md:py-36">
        <div className="grid-12">
          <div className="col-span-4 flex items-baseline gap-4 border-t border-linen-deep pt-4 md:col-span-12">
            <span className="label">{contact.label}</span>
          </div>
          <Reveal className="col-span-4 mt-12 md:col-span-10 md:mt-16">
            <h2 id="contact-title" className="text-display-lg">
              Have something <em className="text-cherry">interesting</em> in mind?
            </h2>
          </Reveal>
          <Reveal delay={100} className="prose-editorial col-span-4 mt-10 text-lg md:col-span-5 md:col-start-6 md:mt-14">
            {contact.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
            <div className="!mt-12">
              {href ? (
                <a href={href} className="text-link font-serif text-display-sm">
                  <span>{contact.cta}</span>
                  <span aria-hidden="true" className="arrow">→</span>
                </a>
              ) : (
                <div>
                  {/* TODO(Emma): set site.contact.email in content/site.ts to activate this link. */}
                  <span className="font-serif text-display-sm text-oxblood/40">{contact.cta} →</span>
                  <p className="mt-3 text-sm text-muted-ink">
                    Contact link coming soon — {site.shortName}’s email address will appear here once approved.
                  </p>
                </div>
              )}
              {site.links.linkedin && (
                <p className="mt-6 text-[0.9375rem]">
                  Or find me on{" "}
                  <a href={site.links.linkedin} target="_blank" rel="noopener noreferrer" className="text-link">
                    LinkedIn
                  </a>
                </p>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
