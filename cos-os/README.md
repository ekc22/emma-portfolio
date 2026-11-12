# CoS OS: an AI Chief of Staff operating system

**Less reporting. More thinking.**

CoS OS is one workspace for founders, CEOs, Chief of Staff teams and investment professionals. It combines strategy, project delivery, a commercial CRM, an investor relations desk, meeting intelligence and reporting. On top of them sits a Claude-powered Chief of Staff that reads the same records, connects them across functions and proposes changes for a person to approve.

This folder is a self-contained Next.js app. It has its own `package.json` and is independent of the portfolio site in the repository root.

---

## What is in this build (Phase 1, plus parts of Phase 2)

| # | Module | What works |
|---|---|---|
| 01 | Executive Command Centre | The AI daily briefing answers five questions, and every item links to its evidence. Also: objectives on track, RAG counts, overdue work, pipeline and weighted forecast, fundraising position, runway, decisions awaiting approval, upcoming milestones, material risks, upcoming meetings and investor engagement. Calculated signals expand to show the records behind them. |
| 02 | Strategy & Objectives | Annual objectives with their quarterly priorities nested beneath, and KPIs tracked against target (respecting whether higher or lower is better). An alignment check flags objectives with no owner, no measurable outcome or no delivery plan, and projects not linked to strategy. |
| 03 | Projects & Delivery | Portfolio, Kanban, timeline (Gantt) and table views. Also an action tracker with overdue and escalation views and a "done without evidence" check, milestones, a risk heat map and dependencies. Delivery signals cover overdue milestones, deadline clashes for one owner, cross-project dependencies at risk and projects over budget. |
| 04 | Commercial Pipeline | Dashboard: total, weighted, 90-day weighted and win rate, each showing its method; stage chart; stage conversion; and lists of stalled deals, deals with no next step, deals past close date and commitments due in the next 7 days. Views: board, opportunities, partnerships, organisations, contacts and activity. |
| 05 | Investor Relations Desk | Dashboard with a capital ladder that keeps indicative interest, soft commitments, legal commitments and cash received apart. Investor CRM, fundraising pipeline (11 stages plus Passed), commitments and receipts. Due-diligence tracker with repeated-question detection. Board and investor reporting. Capital and runway with stated assumptions, and a scenario modeller. |
| 06 | Meetings & Decisions | Paste notes or load a text transcript (.txt, .md, .vtt, .srt). AI extraction proposes a summary, actions with owners and dates, decisions and risks, which you approve or reject. Searchable decision register. |
| 07 | Intelligence & Reporting | Nine report types drafted by AI from structured data, with sources. Edit in Markdown with preview, submit for review, approve, and export as Markdown. All calculated signals in one place. |
| 08 | AI Chief of Staff | Conversational agent with tools over the workspace. It cites records, keeps facts, assumptions and recommendations distinguishable, drafts reports and proposes changes into an approval queue. |
| 09 | Settings & Integrations | People, teams, documents, a roles and permissions matrix, an audit log (admins), the status of each planned integration, and a demo reset. |

Every record type supports create, edit, delete, search and filter through one registry-driven table and form. Each record also has its own page showing every linked record and its change history.

### How AI output is kept separate from verified data

- Figures are tagged **Verified** (recorded data), **Calculated** (computed from records; hover to see the method), **Indicative** (pipeline or stated interest, not committed) or **AI-generated**.
- AI content uses a dashed violet treatment and stays a draft until a person approves it.
- The AI cannot write to records. Every change it suggests becomes a proposal (`ai_recommendations`), which a person approves (owner and due date can be corrected first) or rejects. Proposals are applied with the approver's permissions, and the audit log records both the AI origin and who approved.
- The AI can never propose changes to commitments, capital receipts, financial snapshots, people or permissions. It cannot mark an action or milestone complete without evidence, and it cannot send anything externally.
- Briefing and report references are checked against records the user can see; unknown ids are dropped.

---

## Run it

Requires Node 20+.

```bash
cd cos-os
npm install
cp .env.example .env.local     # add ANTHROPIC_API_KEY to switch on the AI features
npm run dev                    # http://localhost:3000
```

With no Supabase variables set, the app runs in **demo mode**. Data is saved to `.data/cos-os.json`, seeded from a fictional company (Fernhill Systems, raising an £8m Series A). You sign in by choosing one of four personas:

| Persona | Role | Sees |
|---|---|---|
| Alex Morgan, CEO | Owner | Everything |
| Priya Shah, Chief of Staff | Admin | Everything, plus settings and the audit log |
| Grace Liu, Head of Delivery | Member | Core records; no investor or financial data |
| Ruth Adeyemi, Board observer | Viewer | Core records, read-only |

Seed dates are relative to today, so there are always overdue, upcoming and stalled items. Reset with **Settings → Reset demo data** or `npm run demo:reset`.

Quality checks:

```bash
npm run lint && npm run typecheck && npm run build    # or: npm run check
```

## Production: Supabase

1. Create a Supabase project, then set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`.
2. Apply the migrations in `supabase/migrations/`. With the Supabase CLI, run `supabase link` then `supabase db push`. Alternatively, paste both files into the SQL editor in order.
3. Optional demo data: run `supabase/seed.sql`. Its header lists the organisation id and the person ids of the demo personas.
4. Create users in Supabase Auth (Dashboard → Authentication → Add user), then give each a membership:

```sql
insert into public.memberships (auth_user_id, person_id, organisation_id, role)
values ('<auth user id>', '<person id from public.users, optional>', '<organisation id>', 'owner');
-- roles: owner | admin | executive | member | viewer
```

Users sign in with email and password. Row-level security enforces the same rules as the app:

| Records | Owner | Admin | Executive | Member | Viewer |
|---|---|---|---|---|---|
| Core (strategy, projects, pipeline, meetings, reports) | read/write | read/write | read/write | read/write | read |
| Investor (investors, fundraising, diligence) | read/write | read/write | read/write | none | none |
| Financial (commitments, receipts, snapshots) | read/write | read/write | read | none | none |
| Admin (workspace, audit log) | read/write | read/write | none | none | none |

The audit log is append-only: there are no update or delete policies.

The SQL is generated from `lib/schema.ts`, so the database and the app share one definition. After changing a record type, run `npm run db:generate` and add a new migration for the difference.

## Environment variables

| Variable | Needed for | Notes |
|---|---|---|
| `ANTHROPIC_API_KEY` | AI briefing, agent, report drafts, meeting extraction | Without it, AI features say they are off; everything else works. |
| `ANTHROPIC_MODEL` | Optional | Defaults to `claude-opus-5-5`. |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production mode | Leave empty for demo mode. |
| `NEXT_PUBLIC_APP_URL` | Optional | Makes record links in exported Markdown absolute. |

---

## Design

CoS OS follows the *Emma Clark Brand Guidelines v1.0*, the same system as the portfolio site in this repository:

- **Palette:** paper `#FBF6EC` ground, oxblood `#3A0E16` type, cherry `#9B1C2E` accent (about 10%), butter `#F6EBC8` as the warm alternate ground, linen `#E4DACB` rules. The tokens live in `tailwind.config.ts` under role names, so components never hard-code colours.
- **Type:** Instrument Serif for headlines, names, figures and long-form AI and report text. Inter for small uppercase labels, tables and controls.
- **Brand marks:** the "E." monogram and a CoS OS wordmark in brand style. The masthead navigation has place and time on the left, the name in the centre and the person on the right, with the nine numbered desks beneath. On phones there is a full-screen serif menu.
- **Shape:** sharp edges, fine rules and no shadows. The logo animation (70 ms letter stagger over 1.4 s) plays on the sign-in screen and respects reduced motion.
- **Status colours:** red, amber and green are kept separate from the cherry accent. AI content uses a dashed plum treatment so it is never mistaken for recorded data.

## Architecture

```
app/(app)/                 one route per module, plus records/[table]/[id] for any record
app/api/agent              streaming agent (newline-delimited JSON events)
app/api/briefing           daily executive briefing (structured output)
app/api/reports/generate   report drafts; app/api/reports/[id]/export for Markdown export
app/api/meetings/extract   meeting extraction into proposals
lib/schema.ts              the entity registry: every record type, field, option set and access group
lib/data/                  Store interface; LocalStore (demo) and SupabaseStore (RLS); fictional seed
lib/auth/                  session (demo cookie or Supabase Auth) and role permissions
lib/actions/               server actions: records CRUD with validation and audit, proposals, reports
lib/analytics/             deterministic calculations and signals with record references
lib/ai/                    Claude client, system prompt, tools, agent loop, briefing, reports, meetings
lib/integrations/          connector interface and registry (none implemented yet)
components/ui/             shadcn-style primitives (Radix dialog, CVA buttons and badges)
components/app/            registry-driven table, form, Kanban, charts, signals and provenance tags
supabase/                  generated migrations and seed
scripts/                   SQL generator, demo reset
```

**One definition per record type.** `lib/schema.ts` drives forms, tables, validation (`lib/validate.ts`), search, the AI's tools and the SQL. To add a record type, add it to the registry, run `npm run db:generate`, and it gets a table, a form and a record page.

**AI design.** The agent is a manual tool-use loop on the Messages API (`claude-opus-5-5`, adaptive thinking, server-side refusal fallback). It has ten tools:

- Workspace overview, search, record detail
- Delivery health, pipeline forecast, fundraising position, investor intelligence, strategy alignment
- `propose_update` (creates a pending proposal)
- `save_report_draft`

Tools see only what the signed-in user's role can see. Briefings and meeting extraction use structured outputs (Zod schemas), so their results can be validated before anything is stored. Calculations are done in code (`lib/analytics`), not by the model, so figures are reproducible.

## What has and has not been tested

Tested in this build:
- **Builds:** lint, typecheck and production build pass.
- **Pages:** every page loads as owner, member and viewer.
- **Restricted roles:** investor pages show a restricted state to the member and viewer roles.
- **Browser:** approving an AI proposal creates the record and writes an audit entry; creating a decision through the form works; required-field validation appears; no page scrolls sideways at 390px.
- **AI tools:** run directly against demo data. Covered: the permission refusal for members, the refusal to touch commitments, the refusal to mark work done without evidence, and a valid proposal and report draft being saved.
- **Database:** the generated migrations and seed load into PostgreSQL 16. Row-level security was checked for owner, member, viewer and a non-member: reads, cross-group writes and audit immutability. This used a local stand-in for Supabase's `auth` schema, not a hosted Supabase project.

Not yet tested:
- Live Claude calls (agent answers, briefing, report drafts, meeting extraction). The code paths are built and type-checked, but no API key was available while building. Run them once with your key before relying on them.
- Supabase Auth sign-in against a real project.
- External integrations. None are implemented. Settings lists them as planned, with the records each would map to.

## Roadmap

- **Phase 2, remaining:** scheduled briefings, and risk detection on a schedule rather than on request.
- **Phase 3:** connectors from `lib/integrations` (Google Workspace, Microsoft 365, Slack, Notion, monday.com, HubSpot, Salesforce, Linear, calendar, document storage, finance). Imports would arrive as proposals. Also planned: workflow automation, document intelligence, field-level permissions and multi-company workspaces (the schema is already organisation-scoped).
