# Emma Clark — personal website

An editorial personal site for Emma Clark — Strategic Operator, Founder and Commercial Generalist.
Built with Next.js (App Router), TypeScript and Tailwind CSS. No database: all content lives in typed files in `content/`.

## Run it

Requires Node 18.18+ (Node 20 or 22 recommended).

```bash
npm install
npm run dev        # http://localhost:3000
```

Quality checks (all three must pass before deploying):

```bash
npm run lint
npm run typecheck
npm run build
```

`npm run check` runs all three in order.

## Deploy to Vercel

1. Push this folder to a GitHub repository.
2. In Vercel, **Add New → Project**, import the repo. The framework is detected automatically; no build settings need changing.
3. Add environment variables (Project → Settings → Environment Variables):
   - `NEXT_PUBLIC_SITE_URL` — the live URL, e.g. `https://emmaclark.com` (used for canonical links, sitemap and social cards).
   - `NEXT_PUBLIC_SHOW_REVIEW_NOTES=false` — once Emma has approved the copy, hides the "Draft — awaiting Emma's approval" badges.
4. Deploy. Add a custom domain under Project → Settings → Domains.

## Editing content

| What | Where |
| --- | --- |
| Name, roles, email, LinkedIn, CV | `content/site.ts` |
| Hero, About teaser, capabilities, interests, Currently, contact copy, About page | `content/profile.ts` |
| Case studies (each becomes `/work/<slug>`) | `content/projects.ts` |
| Work With Me offerings, engagement types, process | `content/services.ts` |
| Colours, type scale | `tailwind.config.ts` |

**Adding a project:** copy an entry in `content/projects.ts`, give it a new `slug`. The page, sitemap entry and metadata are generated automatically.

**Case-study rules:** `myRole` is what Emma personally did; `teamOutcomes` is what the wider team achieved. Keep them separate, keep copy qualitative until metrics are verified, and don't name employers or clients without permission.

**Images:** put files in `public/images/` and add an `image: { src, alt, width, height }` to the relevant entry (`hero.portrait`, a project, or an interest). Until then a labelled neutral placeholder shows what should go there. Next.js serves them as optimised AVIF/WebP automatically.

**Contact:** set `site.contact.email`. Every "Let's talk" / "Talk about this" link becomes a `mailto:` with a pre-filled subject. Until set, the contact section says the address is coming soon (nothing is invented).

**CV:** add `public/cv/emma-clark-cv.pdf`. A download link then appears in the footer and on the About page automatically; it stays hidden while the file is missing.

## Before launch — TODO checklist

Assets
- [ ] Portrait of Emma → `content/profile.ts` `hero.portrait` (no generated or stock portraits)
- [ ] About page photograph → `app/about/page.tsx` (`EditorialImage`)
- [ ] Three project images → `content/projects.ts` (`image`)
- [ ] Seven "Beyond the work" images → `content/profile.ts` `beyondWork.interests[].image`
- [ ] CV PDF → `public/cv/emma-clark-cv.pdf`

Contact and links
- [ ] Approved email address → `content/site.ts`
- [ ] LinkedIn URL (optional) → `content/site.ts`
- [ ] Production URL → `NEXT_PUBLIC_SITE_URL` in Vercel

Copy to approve (all currently marked `status: "draft"` or `TODO(Emma)`)
- [ ] Case studies: challenge, approach, my role, team outcomes and reflection for all three projects
- [ ] Verified, publishable team outcomes (project 2 has none yet; project 1's are placeholders)
- [ ] Whether to name the sports and community venture and link to it
- [ ] About page story, founder section and working principles
- [ ] Capability descriptions and interest captions
- [ ] Work With Me offerings, engagement types and process
- [ ] "Currently" entries and the notebook picks on `/currently` (Reading / Listening are placeholders)
- [ ] Optional: project timeframes (`timeframe`)

Then set `NEXT_PUBLIC_SHOW_REVIEW_NOTES=false` and set each approved project's `status` to `"approved"`.

## Structure

```
app/
  layout.tsx            fonts, metadata, nav, contact section, footer
  template.tsx          soft page transition
  page.tsx              Home (hero → about → capabilities → work → beyond → currently)
  about/ work/ work/[slug]/ work-with-me/ currently/
  opengraph-image.tsx   typographic social card
  sitemap.ts robots.ts not-found.tsx
components/
  Navbar MobileMenu Footer Hero SectionHeading CapabilityCard ProjectCard
  CaseStudyTemplate ContactCTA EditorialImage InterestsCollage CurrentlyList
  Reveal TextLink ReviewNote
content/                all editable copy and configuration
lib/                    mailto helper, CV detection, review-note flag
```

## Design notes

- Palette: ivory `#F7F4EF`, charcoal `#252525`, burgundy `#713E4B` (accent only), stone `#EAE5DE`, white.
  The brief's muted grey `#77716D` measures 4.38:1 on ivory, just under WCAG AA for small text, so it is used for
  large type and numerals; small muted text uses `#67615D` (5.56:1).
- Type: Instrument Serif (display) and Inter (body), self-hosted at build time via `next/font`.
- Layout: 12-column grid on desktop, 4 on mobile; asymmetric compositions, fine rules, oversized numerals.
- Motion: gentle reveal-on-scroll, image hover zoom and page fade. All disabled under `prefers-reduced-motion`,
  and content is never hidden when JavaScript is off.
- Accessibility: semantic landmarks, skip link, visible focus styles, keyboard-operable mobile menu
  (focus trap, Escape to close), descriptive placeholder labels.
