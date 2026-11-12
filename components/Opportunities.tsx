import { opportunities } from "@/content/profile";
import { site } from "@/content/site";
import { mailto } from "@/lib/contact";
import { hasCv } from "@/lib/cv";
import { withBase } from "@/lib/paths";
import Reveal from "./Reveal";
import TextLink from "./TextLink";

/** Target roles and environments, with the two hiring actions. Shared by the homepage and Work With Me. */
export default function Opportunities() {
  const cv = hasCv();
  const href = mailto(site.contact.subjects.permanent);
  return (
    <section aria-labelledby="opportunities-title">
      <div className="frame py-20 md:py-28">
        <div className="grid-12 gap-y-10">
          <div className="col-span-4 border-t border-linen-deep pt-4 md:col-span-12">
            <span className="label">{opportunities.label}</span>
          </div>
          <Reveal className="col-span-4 md:col-span-6">
            <h2 id="opportunities-title" className="text-display-md">
              Where I want to make <em className="text-cherry">an impact.</em>
            </h2>
            <div className="prose-editorial mt-8 text-[1.375rem] leading-[1.45] md:text-[1.5rem]">
              {opportunities.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <div className="mt-10 flex flex-wrap gap-x-10 gap-y-4">
              {href && <TextLink href={href}>Let’s talk</TextLink>}
              {cv && <TextLink href={withBase(site.cv.path)}>View CV</TextLink>}
            </div>
          </Reveal>
          <Reveal delay={100} className="col-span-4 md:col-span-4 md:col-start-9 md:self-end">
            <h3 className="label">Roles</h3>
            <ul className="mt-3">
              {opportunities.roles.map((r) => (
                <li key={r} className="border-b border-linen-deep py-2.5 text-[1.25rem] leading-snug">{r}</li>
              ))}
            </ul>
            <h3 className="label mt-8">Environments</h3>
            <ul className="mt-3">
              {opportunities.environments.map((r) => (
                <li key={r} className="border-b border-linen-deep py-2.5 text-[1.25rem] leading-snug">{r}</li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
