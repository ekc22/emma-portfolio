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
  myRole: (string | { title: string; body: string; link?: { href: string; label: string } })[];
  /** "The impact". Leave empty until outcomes are confirmed; the page shows a placeholder. */
  whatChanged: { title?: string; text: string; kind: OutcomeKind }[];
  /** What it taught Emma, in her words only. */
  lesson?: string;
  /** Optional small-print note shown after "My contribution" (e.g. the fundraising disclaimer). */
  note?: string;
  image?: ProjectImage;
  /** Typographic panel shown until a real image exists: the headline fact, set large. */
  motif: { figure: string; caption: string };
  /** A wide exhibit (e.g. product screens) shown at its natural shape instead of the hero panel. */
  exhibit?: ProjectImage & { caption: string };
  /** Use a venture's own colour for its placeholders (Turnout blue). */
  accent?: "turnout";
  status: "draft" | "approved";
};

export const projects: Project[] = [
  {
    slug: "when-youre-the-one-building-it",
    title: "Building something from scratch.",
    category: "Founding & Product",
    summary:
      "Co-founding Turnout, a sports and wellness community platform that connects clubs and people: leading go-to-market, monetisation and product, shaping the concept for Poppy, our AI agent, and owning the outcome.",
    context: "Turnout, a sports and wellness community platform",
    role: "Co-founder · Go-to-market, monetisation & product",
    motif: { figure: "Turnout", caption: "Co-founded" },
    accent: "turnout",
    exhibit: {
      src: "/images/turnout-concept-screens.jpg",
      alt: "Three Turnout concept screens. Home: an open place on Saturday's long slow distance run sits at the top with one tap to take it. A place opened up: the place is offered with a 9:41 clock before it passes to the next person. You're on the sheet: twelve of twelve places filled.",
      width: 2400,
      height: 1483,
      caption: "Turnout concept direction, 2026. Product and UX by me; brand and moodboard by A Plus M Studio.",
    },
    situation:
      "Sports and wellness is a fragmented market. Turnout is a community platform that brings it together, connecting clubs and people in one place. Clubs get a backend for collecting money and organising events, and Poppy, our AI agent, supports the coordination.",
    problem:
      "As a co-founder there’s no one else to hand things to. Every decision, whether commercial, product or technical, is a trade-off between ambition and what can realistically get done this week.\n\nIn a small team, time is the scarcest resource. Every hour spent on manual work is an hour later to market.",
    myRole: [
      {
        title: "Founder accountability",
        body: "Co-founded the company and have taken it from formation and initial concept, through product development, into testing.",
      },
      {
        title: "Product and UX",
        body: "Led product and UX for the concept direction. The thing that needs you next sits at the top of the home screen; when someone drops out, their place is offered to the next person with a clock, and passes on if they don’t want it; and an invite link gets you onto the sheet in four screens, with no cold sign-up.",
      },
      {
        title: "Go-to-market and monetisation",
        body: "Lead go-to-market and monetisation: I developed the go-to-market strategy and the monetisation model, and make the commercial calls on positioning, pricing, priorities and launch.",
      },
      {
        title: "Product and technical trade-offs",
        body: "Work closely with a fractional CTO I’ve worked with before, a Forward Deployed Engineer in AI, balancing what we want to build with what gets us to market sooner.",
      },
      {
        title: "Poppy: my vision, built with our CTO",
        body: "Came up with the concept for Poppy, Turnout’s AI agent, which supports coordination for clubs and members. Our fractional CTO built it; my role was channelling the vision, working with him to turn it into the product.",
      },
      {
        title: "Brand and launch",
        body: "Shaped the brand and worked on website development and preparing the platform for launch.",
      },
    ],
    // Describes what was built; no performance claims unless evidenced.
    whatChanged: [
      { title: "From idea to product testing", text: "Taken from company formation and initial concept into product testing.", kind: "team" },
      { title: "Go-to-market and monetisation", text: "The go-to-market strategy and monetisation model, developed and owned by me.", kind: "personal" },
      { title: "A product concept", text: "Product and UX for the 2026 concept direction, designed by me, with brand by A Plus M Studio.", kind: "personal" },
      { title: "Poppy, from vision to product", text: "Our AI agent, which supports coordination for clubs and members: conceived by me, built by our fractional CTO.", kind: "team" },
    ],
    lesson:
      "There’s a difference between helping run a business and building one. Turnout has taught me to think commercially, move without certainty, make difficult trade-offs and take ownership of the outcome, not just the work.",
    status: "approved",
  },
  {
    slug: "finding-a-market-before-the-playbook",
    title: "Finding a market before there’s a playbook.",
    category: "Growth & Go-to-Market",
    summary:
      "Creating commercial direction and traction at a seed-stage AI venture with no established go-to-market playbook.",
    context: "Seed-stage AI venture",
    role: "Founding growth team member · Go-to-market",
    motif: { figure: "6", caption: "Businesses progressed to pilot stage" },
    situation:
      "A seed-stage AI venture had a promising product and no established route to market.",
    problem:
      "There was no playbook. Who to sell to, what to charge and how to frame a first commercial engagement all had to be worked out from scratch.",
    myRole: [
      {
        title: "Market mapping and segmentation",
        body: "Mapped the market, built the segmentation and identified the target accounts worth pursuing first.",
      },
      {
        title: "Pricing and propositions",
        body: "Shaped pricing and pilot propositions that prospective customers could understand and say yes to.",
      },
      {
        title: "Progressing opportunities",
        body: "Supported prospective customers from first conversations through to pilot stage.",
      },
      {
        title: "Go-to-market, with a technical team",
        body: "Joined as a founding member of the growth team, leading the go-to-market strategy alongside a technical founding team that includes former Amazon employees.",
      },
    ],
    whatChanged: [
      { title: "Six businesses at pilot stage", text: "Six businesses progressed to pilot stage.", kind: "pipeline" },
      { title: "Traction against a target", text: "Commercial traction against a £150k pilot revenue target: a target, not recognised revenue.", kind: "pipeline" },
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
      "Fractional Chief of Staff support for Circus Capital, combining investor relationships, fundraising preparation and Claude-powered operational systems.",
    context: "Circus Capital",
    role: "Fractional Chief of Staff · Fundraising, Investor Relations & Strategic Operations",
    motif: { figure: "Family offices", caption: "Introduced as part of the fundraise" },
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
        body: "Built a Claude-powered system to improve visibility, track priorities and coordinate execution: a Chief of Staff dashboard, an agentic Chief of Staff, a pipeline tracker, an investor finder and a project management system. That work grew into CoS OS, a live AI Chief of Staff tool we now use day to day.",
        link: { href: "/work/cos-os", label: "See CoS OS" },
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
    // TODO(Emma): an approved screenshot of the Claude Chief of Staff system.
    status: "approved",
  },
  {
    slug: "making-strategy-everyones-business",
    title: "Making strategy everyone’s business.",
    category: "Strategy & Execution",
    summary:
      "Turning leadership priorities into coordinated, accountable execution across product, distribution, finance, technology and data.",
    context: "Canaccord",
    role: "Canaccord · Strategy & Executive Execution",
    motif: { figure: "Growth Committee", caption: "Established to connect priorities, owners and decisions" },
    situation:
      "Growth priorities were spread across product, distribution, finance, technology and data, each with its own owners and pace.",
    problem:
      "Coordinating that many cross-functional initiatives needs a shared rhythm. Without one, priorities, owners and decisions weren’t connected to the reporting the executive team relied on, so progress and accountability were hard to see.",
    myRole: [
      {
        title: "A Growth Committee",
        body: "Established a Growth Committee to bring the growth priorities, and the people who owned them, into one forum.",
      },
      {
        title: "An operating cadence",
        body: "Set the rhythm for reviewing priorities, risks and actions, and coordinated the cross-functional initiatives between meetings.",
      },
      {
        title: "Executive visibility",
        body: "Connected priorities, owners and decisions to executive reporting, so leadership could see progress and decide with confidence.",
      },
    ],
    whatChanged: [
      { title: "Accountable delivery", text: "A repeatable system for turning leadership priorities into accountable delivery.", kind: "personal" },
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
      "Around two weeks of recurring reporting preparation saved per cycle, through a 30-metric executive dashboard and AI-assisted workflows.",
    context: "Executive reporting and AI-assisted workflows",
    role: "AI, Automation & Executive Reporting",
    motif: { figure: "≈2 weeks", caption: "Reporting preparation saved per cycle" },
    situation:
      "Executive reporting depended on a recurring, largely manual preparation cycle.",
    problem:
      "Time spent assembling numbers was time not spent thinking about them, and the leadership team needed a clearer view of performance to make decisions.",
    myRole: [
      {
        title: "Reporting infrastructure",
        body: "Built the reporting infrastructure behind an executive dashboard covering 30 metrics. This was conventional automation: getting the right data flowing into one place, reliably, every cycle.",
      },
      {
        title: "AI-assisted workflows",
        body: "Separately, developed AI-assisted workflows for the recurring reporting and research tasks that automation alone couldn’t handle, keeping a human check on the output.",
      },
      {
        title: "Decision-ready reporting",
        body: "Designed the reporting around the decisions it needed to support, so the time saved went into thinking rather than assembling.",
      },
    ],
    whatChanged: [
      { title: "Around two weeks back, every cycle", text: "Recurring reporting preparation reduced by approximately two weeks per cycle.", kind: "personal" },
      { title: "30 metrics in one view", text: "An executive dashboard covering 30 metrics.", kind: "personal" },
    ],
    lesson:
      "It taught me to question how work gets done, not just how to do it faster. The real opportunity with technology isn’t simply automating tasks. It’s giving people back the time and clarity to think, make better decisions and focus on work that actually moves the business forward.",
    // TODO(Emma): approved, anonymised dashboard screenshots.
    status: "approved",
  },
  {
    slug: "the-discipline-behind-the-ambition",
    title: "The discipline behind the ambition.",
    category: "Finance & Leadership",
    summary:
      "Part of Paddle during its $200m Series D and unicorn valuation, with exposure to acquisition integration, Board reporting, capital planning and investor relations.",
    context: "Paddle, then investment management and private equity-backed businesses",
    role: "Paddle · Series D Fundraising & Acquisition",
    motif: { figure: "$200m", caption: "Series D at a unicorn valuation" },
    situation:
      "Paddle, a scaling SaaS business, was raising a $200m Series D at a unicorn valuation and integrating an acquisition. Later roles in investment management and private equity-backed firms brought the same kind of scrutiny.",
    problem:
      "Big moments like a funding round or an acquisition depend on rigorous analysis and clear reporting, delivered while the business keeps running.",
    myRole: [
      {
        title: "Inside a major fundraise",
        body: "Part of the business during Paddle’s $200m Series D and unicorn valuation.",
      },
      {
        title: "Acquisition integration",
        body: "Supported the integration of an acquisition.",
      },
      {
        title: "Financial and Board reporting",
        body: "Prepared executive and Board reporting, and contributed to capital planning and investor relations.",
      },
    ],
    whatChanged: [
      { text: "Paddle raised a $200m Series D at a unicorn valuation while I was part of the business.", kind: "company" },
    ],
    lesson:
      "It taught me that behind every ambitious growth story is a business that needs to stand up to scrutiny. Supporting a major fundraise and acquisition gave me an appreciation for the financial discipline, commercial understanding and operational detail required to turn ambition into something investors can believe in.",
    status: "approved",
  },
  {
    slug: "cos-os",
    title: "An operating system for the Chief of Staff role.",
    category: "AI & Product",
    summary:
      "CoS OS, a live AI Chief of Staff tool we use day to day: strategy, delivery, pipeline and investor relations in one workspace, with a Claude agent that proposes and a person who approves.",
    context: "CoS OS, a live tool we use day to day",
    role: "Founder · Product, design and build",
    motif: { figure: "9", caption: "Desks in one workspace" },
    situation:
      "My Chief of Staff work runs on Claude-powered tools I built: a dashboard, an agentic Chief of Staff, a pipeline tracker, an investor finder and a project system. CoS OS brings that thinking together into one product.",
    problem:
      "Leadership information lives in decks, trackers, CRMs and inboxes, so a Chief of Staff spends time assembling it rather than thinking about it.\n\nAI can help, but only if leaders can trust it. Every answer has to trace back to a record, and nothing should change without a person approving it.",
    myRole: [
      {
        title: "Product definition",
        body: "Wrote the product specification: nine desks, from an executive command centre to an investor relations desk, the data model that connects them, and the rules the AI has to follow.",
      },
      {
        title: "Trust by design",
        body: "Designed the AI to separate facts, assumptions and recommendations, cite the records behind each point, and propose changes into an approval queue rather than make them. It cannot touch financial records or commitments, or mark work complete without evidence.",
      },
      {
        title: "Building it",
        body: "Built the working version with Claude Code on Next.js, Supabase and the Claude API, with role-based permissions enforced in the database and my own brand identity throughout.",
      },
    ],
    whatChanged: [
      { title: "Live and in use", text: "A live tool we use day to day: nine desks, with creating, editing and approval flows.", kind: "personal" },
      { title: "Indicative is never committed", text: "An investor relations desk that keeps indicative interest, soft commitments, legal commitments and cash received apart.", kind: "personal" },
    ],
    // TODO(Emma): add what building it taught you, in your own words.
    note: "Screens are shown with a fictional demo company, so no client data appears here.",
    exhibit: {
      src: "/images/cos-os-command-centre.jpg",
      alt: "The CoS OS Executive Command Centre: headline figures for objectives, projects, overdue actions, pipeline, forecast and runway, a list of issues needing attention and decisions awaiting approval.",
      width: 2016,
      height: 1428,
      caption: "The Executive Command Centre, shown with a fictional demo company.",
    },
    status: "approved",
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
export const featuredProjects = projects.slice(0, 3);
