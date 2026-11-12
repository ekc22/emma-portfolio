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
 *  - Figures come from Emma's portfolio. Confirmed by Emma as current and
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
  /** "The challenge". Separate paragraphs with a blank line. */
  problem: string;
  /** Emma's contribution: plain lines, or titled items. */
  myRole: (string | { title: string; body: string })[];
  /** "The impact". Leave empty until outcomes are confirmed; the page shows a placeholder. */
  whatChanged: { title?: string; text: string; kind: OutcomeKind }[];
  /** What it taught Emma, in her words only. */
  lesson?: string;
  /** Optional small-print note shown after "My contribution" (e.g. the fundraising disclaimer). */
  note?: string;
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
    lesson:
      "There’s a difference between helping run a business and building one. Turnout has taught me to think commercially, move without certainty, make difficult trade-offs and take ownership of the outcome, not just the work.",
    // Turnout keeps its own brand: shown as a credit, never merged into the EMMA CLARK mark.
    status: "approved",
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
    lesson:
      "It taught me that early-stage growth is as much about listening and testing assumptions as it is about selling. When there’s no established market or playbook, you have to find the opportunity, shape a proposition people understand and turn uncertainty into commercial momentum.",
    status: "approved",
  },
  {
    slug: "circus-capital",
    title: "Building the relationships and infrastructure behind capital raising.",
    category: "Fundraising & Investor Relations",
    summary:
      "Fractional Chief of Staff support for Circus Capital: fundraising, investor introductions, investor readiness and Claude-powered operational infrastructure.",
    context: "Circus Capital",
    role: "Fractional Chief of Staff · Fundraising, Investor Relations & Strategic Operations",
    imageBrief: "The quiet room: empty meeting room, morning light, paper-toned walls",
    situation:
      "Circus Capital required fractional Chief of Staff support to strengthen fundraising activity, investor engagement and the coordination of strategic and operational priorities.",
    problem:
      "Capital raising requires more than investor introductions. It demands a coordinated approach to relationship management, compelling investor materials and disciplined execution across multiple workstreams.\n\nThe challenge was to establish this structure and maintain momentum without the overhead of a full-time Chief of Staff.",
    myRole: [
      {
        title: "Fundraising support",
        body: "Supported fundraising preparation and execution, helping coordinate investor-facing activities and priorities.",
      },
      {
        title: "Investor introductions",
        body: "Facilitated introductions between Circus Capital and family offices, expanding access to prospective capital partners.",
      },
      {
        title: "Investor readiness",
        body: "Supported the development and refinement of investor materials, strengthening the firm’s investment narrative and fundraising preparation.",
      },
      {
        title: "Operational infrastructure",
        body: "Developed a Claude-powered Chief of Staff dashboard and project management system to improve visibility, track priorities and coordinate execution, and built an agentic Chief of Staff, a pipeline tracker and an investor finder.",
      },
    ],
    // Keep "introduced", never "secured investment" or "raised capital", unless substantiated.
    whatChanged: [
      {
        title: "Expanded investor access",
        text: "Introduced family offices to Circus Capital as part of its fundraising activities, creating opportunities for prospective investor engagement.",
        kind: "personal",
      },
      {
        title: "Stronger fundraising readiness",
        text: "Supported the preparation of investor materials and established operational systems to improve coordination, visibility and follow-through across priorities.",
        kind: "personal",
      },
    ],
    lesson:
      "In capital raising, relationships open doors. Preparation, credibility and consistent execution create the conditions for progress.",
    note: "Fundraising support covers preparation, process management and introductions. It is not investment advice or arranging deals; any regulated activity stays with authorised firms.",
    status: "approved",
  },
  {
    slug: "making-strategy-everyones-business",
    title: "Making strategy everyone’s business.",
    category: "Strategy & Execution",
    summary:
      "Growth priorities spanning product, distribution, finance, technology and data needed a common execution rhythm.",
    context: "Canaccord",
    role: "Canaccord · Strategy & Executive Execution",
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
    lesson:
      "It taught me that strategy only works when people understand what they’re working towards and how their contribution fits into the bigger picture. The real value isn’t in creating the plan, but in bringing people together, establishing accountability and turning ambition into collective progress.",
    status: "approved",
  },
  {
    slug: "less-reporting-more-thinking",
    title: "Less reporting. More thinking.",
    category: "AI & Operations",
    summary:
      "Reporting infrastructure and AI-assisted workflows: using technology to create capacity, not just another dashboard.",
    context: "Executive reporting and AI-assisted workflows",
    role: "AI, Automation & Executive Reporting",
    imageBrief: "Material detail: linen paper edges and a notebook, top-down at 30°",
    situation:
      "Executive reporting depended on a recurring, largely manual preparation cycle.",
    problem:
      "Time spent assembling numbers was time not spent thinking about them.",
    myRole: [
      "Built reporting infrastructure covering 30 executive metrics",
      "Developed AI-assisted workflows for recurring reporting and research tasks",
    ],
    whatChanged: [
      { text: "Recurring reporting preparation reduced by approximately two weeks per cycle.", kind: "personal" },
    ],
    lesson:
      "It taught me to question how work gets done, not just how to do it faster. The real opportunity with technology isn’t simply automating tasks. It’s giving people back the time and clarity to think, make better decisions and focus on work that actually moves the business forward.",
    status: "approved",
  },
  {
    slug: "the-discipline-behind-the-ambition",
    title: "The discipline behind the ambition.",
    category: "Finance & Leadership",
    summary:
      "Part of Paddle during its $200m Series D and unicorn valuation, then acquisition integration, Board reporting, capital planning and investor relations.",
    context: "Paddle, then investment management and private equity-backed businesses",
    role: "Paddle · Series D Fundraising & Acquisition",
    imageBrief: "Desk still life: ledger, linen paper and a fountain pen, top-down at 30°",
    situation:
      "Businesses at different stages, from scaling SaaS to investment management and private equity-backed firms, each facing significant financial and operational decisions.",
    problem:
      "Big moments like a funding round or an acquisition depend on rigorous analysis and clear reporting, delivered while the business keeps running.",
    myRole: [
      "Part of the business during Paddle’s $200m Series D and unicorn valuation",
      "Supported acquisition integration",
      "Prepared executive and Board reporting",
      "Contributed to capital planning and investor relations",
    ],
    whatChanged: [
      { text: "Paddle raised a $200m Series D at a unicorn valuation while I was part of the business.", kind: "company" },
    ],
    lesson:
      "It taught me that behind every ambitious growth story is a business that needs to stand up to scrutiny. Supporting a major fundraise and acquisition gave me an appreciation for the financial discipline, commercial understanding and operational detail required to turn ambition into something investors can believe in.",
    status: "approved",
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
export const featuredProjects = projects.slice(0, 3);
