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
npm run build      # writes the static site to out/
```

`npm run check` runs all three in order. `npm start` serves the built `out/` folder locally.

## Live site — GitHub Pages

The site is published at **https://ekc22.github.io/emma-portfolio/**.

Every push to `main` runs `.github/workflows/deploy.yml`, which lints, type-checks, builds a static
export and publishes it. Progress shows under the repository's **Actions** tab (about 2 minutes).

One-time setup (already needed once per repository): **Settings → Pages → Build and deployment → Source: GitHub Actions**.

Notes
- The workflow sets `NEXT_PUBLIC_BASE_PATH=/emma-portfolio` and `NEXT_PUBLIC_SITE_URL` automatically.
- To hide the "Draft — awaiting Emma's approval" badges at launch, add `NEXT_PUBLIC_SHOW_REVIEW_NOTES: "false"`
  under `env:` in the workflow.
- Custom domain: add it under Settings → Pages, then in the workflow set `NEXT_PUBLIC_BASE_PATH: ""` and
  `NEXT_PUBLIC_SITE_URL` to the domain.
- GitHub Pages has no image server, so photos are not resized automatically. Export them at a sensible size
  (about 2000px on the long edge, JPEG or WebP, under ~400 KB) before adding them to `public/images/`.
- The site is a plain static build, so it can also be hosted on Vercel, Netlify or Cloudflare Pages with no code changes.

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

**Images:** put files in `public/images/` and add an `image: { src, alt, width, height }` to the relevant entry (`hero.portrait`, a project, or an interest). Until then a labelled neutral placeholder shows what should go there. Resize them before adding (see the GitHub Pages notes above).

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
- [x] Email address → `content/site.ts` (published; phone number intentionally not shown)
- [ ] Turnout figures logo → `public/images/` for the founder credit (keep its own red; never merge with the EMMA CLARK mark)
- [ ] LinkedIn URL (optional) → `content/site.ts`

Copy to approve (all currently marked `status: "draft"` or `TODO(Emma)`)
- [ ] Case studies: challenge, approach, my role, team outcomes and reflection for all three projects
- [ ] Verified, publishable team outcomes (project 2 has none yet; project 1's are placeholders)
- [ ] Whether to name the sports and community venture and link to it
- [ ] About page story, founder section and working principles
- [ ] Capability descriptions and interest captions
- [ ] Work With Me offerings, engagement types and process
- [ ] "Currently" entries and the notebook picks on `/currently` (Reading / Listening are placeholders)
- [ ] Optional: project timeframes (`timeframe`)

Then set `NEXT_PUBLIC_SHOW_REVIEW_NOTES: "false"` in the deploy workflow and set each approved project's `status` to `"approved"`.

## Structure

```
app/
  layout.tsx            fonts, metadata, nav, contact section, footer
  template.tsx          soft page transition
  page.tsx              Home (hero → about → capabilities → work → beyond → currently)
  about/ work/ work/[slug]/ work-with-me/ currently/
  og.png/route.tsx      typographic social card (built to /og.png)
  sitemap.ts robots.ts not-found.tsx
components/
  Navbar MobileMenu Footer Hero SectionHeading CapabilityCard ProjectCard
  CaseStudyTemplate ContactCTA EditorialImage InterestsCollage CurrentlyList
  Reveal TextLink ReviewNote
content/                all editable copy and configuration
lib/                    mailto, base-path, CV detection, SEO and review-note helpers
assets/fonts/           Instrument Serif (OFL) for the social card
.github/workflows/      GitHub Pages deployment
```

## Design notes

- Brand: follows *Emma Clark Brand Guidelines v1.0* (Nov 2026) — palette, wordmark, "E." monogram, logo
  animation, masthead nav and "the four desks" — while keeping the site's original editorial tone and headline.
- Palette: paper `#FBF6EC`, oxblood `#3A0E16` (text), cherry `#9B1C2E` (accent, ~10%), butter `#F6EBC8`
  (warm alternate ground), linen `#E4DACB` (borders). Muted text `#6E5659` (6.2:1 on paper).
- Type: Instrument Serif (display, wordmark) and Inter (body), self-hosted via `next/font`. The guidelines specify
  Instrument Sans for body; Inter is kept by choice — swap it in `app/layout.tsx` if preferred.
- Layout: 12-column grid on desktop, 4 on mobile; asymmetric compositions, fine rules, oversized numerals.
- Motion: logo intro once per session (brand spec: 70 ms stagger, 1.4 s), gentle reveal-on-scroll, image hover zoom and page fade. All disabled under `prefers-reduced-motion`,
  and content is never hidden when JavaScript is off.
- Accessibility: semantic landmarks, skip link, visible focus styles, keyboard-operable mobile menu
  (focus trap, Escape to close), descriptive placeholder labels.
