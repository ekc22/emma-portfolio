/**
 * Case studies. Each entry generates a page at /work/[slug].
 * Order matters: the first three are featured on the homepage.
 *
 * Every case study tells the story through: the situation, the problem,
 * what Emma personally did, what changed, and what it taught her.
 *
 * Editorial rules (please keep):
 *  - `myRole` is what Emma personally did. Each `whatChanged` item says what KIND
 *    of result it is, so personal delivery, team outcomes, pipeline progress and
 *    company milestones are never confused.
 *  - Figures come from Emma's portfolio. TODO(Emma): confirm each one is current and
 *    can be shared publicly before setting status to "approved".
 *  - Never invent lessons, clients, testimonials or numbers. If `lesson` is empty
 *    the page shows a placeholder while review notes are on.
 *  - House style: no em dashes in visible copy.
 */

export type ProjectImage = { src: string; alt: string; width: number; height: number };

export type OutcomeKind = "personal" | "team" | "pipeline" | "company";

export const outcomeLabels: Record<OutcomeKind, string> = {
  personal: "What I delivered",
  team: "Team outcome",
  pipeline: "Pipeline progress, not revenue",
  company: "Company milestone I supported",
};

export type Project = {
  slug: string;
  /** Editorial headline. */
  title: string;
  category: string;
  summary: string;
  /** The setting, described without confidential detail. */
  context: string;
  /** Emma's role, where it had a title. */
  role?: string;
  timeframe?: string; // TODO(Emma): add if you want dates shown.
  situation: string;
  problem: string;
  myRole: string[];
  /** Leave empty until outcomes are confirmed; the page shows a placeholder. */
  whatChanged: { text: string; kind: OutcomeKind }[];
  /** What it taught Emma, in her words only. */
  lesson?: string;
  image?: ProjectImage;
  /** Describes the image that should go here, shown on the placeholder until a real one is added. */
  imageBrief: string;
  status: "draft" | "approved";
};

export const projects: Project[] = [
  {
    slug: "when-youre-the-one-building-it",
    title: "What happens when you’re the one building it?",
    category: "Founding & Go-to-market",
    summary:
      "Co-founding Turnout, a sports and wellness platform, and owning its full go-to-market: from company formation and initial concept to product testing.",
    context: "Turnout, a sports and wellness platform",
    role: "Co-founder, responsible for go-to-market",
    imageBrief: "Turnout: a real photograph from a sports or wellness session",
    situation:
      "Turnout started as an idea: a sports and wellness platform that brings people together.",
    problem:
      "As a co-founder there’s no one else to hand things to. Every decision, whether commercial, product or brand, is a trade-off between ambition and what can realistically get done this week. And a great product still needs a clear route to the people it’s for.",
    myRole: [
      "Co-founded the company, from formation and initial concept onwards",
      "Own the full go-to-market and developed the go-to-market strategy",
      "Move between commercial planning, product decisions and brand",
      "Worked on website development and preparing the platform for launch",
    ],
    whatChanged: [
      { text: "A full go-to-market strategy, developed and owned by me.", kind: "personal" },
      { text: "Taken from company formation and initial concept into product testing.", kind: "team" },
    ],
    // TODO(Emma): add what founding has taught you, in your own words.
    // Turnout keeps its own brand: shown as a credit, never merged into the EMMA CLARK mark.
    status: "draft",
  },
  {
    slug: "finding-a-market-before-the-playbook",
    title: "Finding a market before there’s a playbook.",
    category: "Go-to-market & Growth",
    summary:
      "A founding member of the growth team at a seed-stage AI venture, alongside colleagues including former Amazon employees, responsible for the full go-to-market.",
    context: "Seed-stage AI venture",
    role: "Founding growth team member, responsible for go-to-market",
    imageBrief: "Material detail: cherry lacquer, oxblood leather and linen paper edges",
    situation:
      "A seed-stage AI venture, with a founding team that includes former Amazon employees, had a promising product and no established route to market.",
    problem:
      "There was no playbook. Who to sell to, what to charge and how to frame a first commercial engagement all had to be worked out from scratch.",
    myRole: [
      "Joined as a founding member of the growth team, responsible for the full go-to-market",
      "Developed the go-to-market strategy",
      "Built market segmentation and target accounts",
      "Shaped pricing and pilot propositions, and supported businesses through to pilot stage",
    ],
    whatChanged: [
      { text: "Six businesses progressed to pilot stage.", kind: "pipeline" },
      { text: "Commercial traction against a £150k pilot revenue target: a target, not recognised revenue.", kind: "pipeline" },
    ],
    // TODO(Emma): add what this taught you, in your own words.
    status: "draft",
  },
  {
    slug: "circus-capital",
    title: "A founder’s office, built in Claude.",
    category: "Fractional Support",
    summary:
      "Fractional support for Circus Capital: a Chief of Staff dashboard and project management system built in Claude, and investor materials for investor readiness.",
    context: "Circus Capital",
    role: "Fractional support",
    imageBrief: "The quiet room: empty meeting room, morning light, paper-toned walls",
    situation:
      "Circus Capital needed fractional support across day-to-day visibility, project management and investor readiness.",
    problem:
      "Keeping priorities, projects and investor preparation moving at the same time takes structure, without the cost of a full-time Chief of Staff.",
    myRole: [
      "Built a Chief of Staff dashboard in Claude",
      "Built a project management system in Claude",
      "Supported investor materials to strengthen investor readiness",
    ],
    // TODO(Emma): add confirmed, shareable outcomes.
    whatChanged: [],
    // TODO(Emma): add what this taught you, in your own words.
    status: "draft",
  },
  {
    slug: "making-strategy-everyones-business",
    title: "Making strategy everyone’s business.",
    category: "Strategy & Execution",
    summary:
      "Growth priorities spanning product, distribution, finance, technology and data needed a common execution rhythm.",
    context: "Private equity-backed wealth manager",
    imageBrief: "Desk still life: paper, fountain pen, a cherry-lacquer cup, a folded agenda",
    situation:
      "A private equity-backed business had ambitious growth priorities spread across product, distribution, finance, technology and data.",
    problem:
      "Each area was moving, but not to a common rhythm. Priorities, owners and decisions weren’t connected to the reporting the executive team relied on, so accountability was hard to see.",
    myRole: [
      "Established a Growth Committee to bring the priorities together",
      "Connected priorities, owners and decisions to executive reporting",
      "Coordinated cross-functional initiatives and tracked priorities, risks and actions",
    ],
    whatChanged: [
      { text: "A repeatable system for turning leadership priorities into accountable delivery.", kind: "personal" },
    ],
    // TODO(Emma): add what this taught you, in your own words.
    status: "draft",
  },
  {
    slug: "less-reporting-more-thinking",
    title: "Less reporting. More thinking.",
    category: "AI & Operations",
    summary:
      "Reporting infrastructure, AI-assisted workflows and a Claude Chief of Staff agent: using technology to create capacity, not just another dashboard.",
    context: "Executive reporting and AI-assisted workflows",
    imageBrief: "Material detail: linen paper edges and a notebook, top-down at 30°",
    situation:
      "Executive reporting depended on a recurring, largely manual preparation cycle.",
    problem:
      "Time spent assembling numbers was time not spent thinking about them. Getting a clear view of actions and pipeline meant chasing people for updates.",
    myRole: [
      "Built reporting infrastructure covering 30 executive metrics",
      "Developed AI-assisted workflows for recurring reporting and research tasks",
      "Built a Claude Chief of Staff agent for action and pipeline visibility",
    ],
    whatChanged: [
      { text: "Recurring reporting preparation reduced by approximately two weeks per cycle.", kind: "personal" },
      { text: "Clearer visibility of actions and pipeline, without another dashboard to maintain.", kind: "personal" },
    ],
    // TODO(Emma): add what this taught you, in your own words.
    status: "draft",
  },
  {
    slug: "the-discipline-behind-the-ambition",
    title: "The discipline behind the ambition.",
    category: "Finance & Leadership",
    summary:
      "From supporting analysis for Paddle’s $200m+ Series D and acquisition integration to Board reporting, capital planning and investor relations.",
    context: "Venture-backed SaaS, investment management and private equity-backed businesses",
    imageBrief: "Desk still life: ledger, linen paper and a fountain pen, top-down at 30°",
    situation:
      "Businesses at different stages, from scaling SaaS to investment management and private equity-backed firms, each facing significant financial and operational decisions.",
    problem:
      "Big moments like a funding round or an acquisition depend on rigorous analysis and clear reporting, delivered while the business keeps running.",
    myRole: [
      "Supported financial analysis for Paddle’s $200m+ Series D",
      "Supported acquisition integration",
      "Prepared executive and Board reporting",
      "Contributed to capital planning and investor relations",
    ],
    whatChanged: [
      { text: "Paddle raised a $200m+ Series D. I supported the financial analysis; I did not raise the capital.", kind: "company" },
    ],
    // TODO(Emma): add what this taught you, in your own words.
    status: "draft",
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
export const featuredProjects = projects.slice(0, 3);
