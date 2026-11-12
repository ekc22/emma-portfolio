# CoS OS: launch checklist

Work through these in order. Each step says who does it: **You** means it needs your accounts or decisions; **Claude** means I can do it in a session once the step before it is done.

## 1. Decide what "live" means (You, 10 minutes)

- [ ] **Public demo, private product, or both?**
  - A *public demo* lets anyone open CoS OS with the fictional Fernhill data. It is good for the portfolio, but AI calls cost you money per visitor.
  - A *private product* is your own workspace with real data, behind a login.
  - Most people start with a private workspace, then add a demo with AI switched off or capped.
- [ ] **Domain.** For example `cos.yourdomain.com`. Buy or choose the domain if you don't have one.

## 2. Test the AI features (You, then Claude: 30 minutes)

None of the Claude features has made a live call yet.

- [ ] **You:** create an Anthropic API key at console.anthropic.com. Set a monthly spend limit there, which protects you from surprise bills.
- [ ] **You:** add the key to the Claude Code environment through the secure form (ask me in a session), or set `ANTHROPIC_API_KEY` in `cos-os/.env.local` on your own machine.
- [ ] **Claude:** run the four AI features end to end: the agent, the daily briefing, report drafts and meeting extraction. Fix anything that breaks, and check the answers cite real records.

## 3. Set up the database (You, then Claude: 45 minutes)

- [ ] **You:** create a Supabase project (supabase.com). Choose the London (eu-west-2) region if your users are in the UK.
- [ ] **You:** under *Authentication → Providers*, keep Email on and turn **off** "Allow new users to sign up", so only people you add can get in.
- [ ] **Claude or You:** apply the two migrations in `cos-os/supabase/migrations/`, either with `supabase db push` or by pasting them into the SQL editor in order.
- [ ] **For a demo:** also run `supabase/seed.sql`, which loads the fictional company.
- [ ] **You:** create your own login under *Authentication → Users → Add user*, then add a membership for it. The SQL snippet is in the README (owner role).
- [ ] **You:** sign in once locally against Supabase to confirm the login works. This has not been tested against a real project yet.

## 4. Deploy (You, then Claude: 30 minutes)

CoS OS needs a server, so it can't go on GitHub Pages like the portfolio. Vercel is the simplest option.

- [ ] **You:** create a Vercel account and import the `emma-portfolio` repository. Set the **Root Directory** to `cos-os`.
- [ ] **You:** add these environment variables in Vercel:
  - `ANTHROPIC_API_KEY`
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `NEXT_PUBLIC_APP_URL` (your live address)
- [ ] **You:** connect your domain in Vercel (*Settings → Domains*).
- [ ] **Claude:** check the live site: sign in, each of the nine desks, approving a proposal, and generating a briefing.
- [ ] **Don't** run demo mode on Vercel without Supabase. The local demo store writes to a file, and Vercel's file system doesn't keep it.

## 5. Make a public demo safe, if you want one (Claude, 1–2 hours)

- [ ] **Demo login:** a read-only demo login, or a "reset nightly" demo organisation.
- [ ] **AI limits:** rate limits for the AI endpoints, for example a few requests per visitor per hour. Alternatively, turn AI off in the demo and show a recorded example briefing instead.
- [ ] **Labelling:** a clear "Demo with fictional data" banner.

## 6. Before real data goes in (You and Claude)

- [ ] **Data protection.** Confirm what data you will store (investor names and contacts, financials) and that your privacy notice covers it. Supabase and Anthropic both offer data processing agreements; sign them.
- [ ] **Backups.** Turn on backups in Supabase (daily backups come with the Pro plan).
- [ ] **Security review:** **Claude** runs one before go-live.
- [ ] **Keys.** Keep keys only in Vercel and Supabase, never in the repository. `.env.local` is already ignored by git.

## 7. Portfolio case study (You: 15 minutes)

The case study is added at `/work/cos-os` as a draft.

- [ ] **Check the wording** in `content/projects.ts` (the `cos-os` entry), especially the line linking it to the tools you built for your Chief of Staff work.
- [ ] **Add your lesson**, a sentence or two in your own words, in the `lesson` field. Until then the page simply has no lesson section.
- [ ] **Approve:** set `status: "approved"`.
- [ ] **Publish:** merge this branch into `main`. Note this publishes the whole portfolio, and the CoS OS case study with it.
- [ ] **When CoS OS is live,** add a link to the demo in the case study.

## Later

- [ ] **Connectors.** These are the Phase 3 integrations listed in Settings: calendar, email, HubSpot, Notion and so on. Pick the one or two you would use first.
- [ ] **Scheduled jobs:** a daily briefing generated each morning, and a weekly IR briefing emailed to you for approval.
