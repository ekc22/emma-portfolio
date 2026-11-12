/**
 * Case studies. Each entry generates a page at /work/[slug].
 * Order matters: this is the order on the Work page. The homepage features
 * Turnout (spotlight), CoS OS and the AI venture, and highlights Canaccord further down.
 *
 * Each case study opens with the headline, Emma's role and the primary result, then:
 * the challenge, my contribution, the impact and what it taught me.
 *
 * Editorial rules (please keep):
 *  - `myRole` is what Emma personally did. Each `whatChanged` item says what KIND
 *    of result it is, so personal delivery, team outcomes, pipeline progress and
 *    company milestones are never confused.
 *  - Never invent revenue, customers, investment secured, reports or deployment results.
 *  - Keep employers clearly separated; use only information approved for public disclosure.
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

export type ContributionItem = string | { title: string; body: string; link?: { href: string; label: string } };

export type Project = {
  slug: string;
  /** Editorial headline. */
  title: string;
  category: string;
  /** Short opening summary (shown on cards and at the top of the case study). */
  summary: string;
  /** The primary result, shown prominently in the first screen. */
  result?: string;
  /** The setting, described without confidential detail. */
  context: string;
  /** Emma's role, shown under the headline. */
  role?: string;
  timeframe?: string;
  /** Optional extra context before the challenge. */
  situation?: string;
  /** "The challenge". Separate paragraphs with a blank line. */
  problem?: string;
  /** Emma's contribution: plain lines, or titled items. */
  myRole: ContributionItem[];
  /** "The impact". */
  whatChanged: { title?: string; text: string; kind: OutcomeKind }[];
  /** Qualifier shown under the impact (e.g. what was a team achievement). */
  impactNote?: string;
  /** What it taught Emma, in her words only. */
  lesson?: string;
  /** Optional small-print note shown after "My contribution". */
  note?: string;
  image?: ProjectImage;
  /** Typographic panel shown until a real image exists: the headline fact, set large. */
  motif: { figure: string; caption: string };
  /** A wide exhibit (e.g. product screens) shown at its natural shape instead of the hero panel. */
  exhibit?: ProjectImage & { caption: string };
  /** An external, working demo (opens in a new tab), shown under the result. */
  demo?: { href: string; label: string; note: string };
  /** Further screens shown as "Selected screens" on the case study. */
  gallery?: (ProjectImage & { caption: string; wide?: boolean })[];
  /** One line on what the project shows about Emma, for the homepage cards. */
  demonstrates?: string;
  /** Optional sequence of steps, shown at the start of "The impact". */
  progression?: string[];
  /** Use a venture's own colour (Turnout blue). */
  accent?: "turnout";
  status: "draft" | "approved";
};

export const projects: Project[] = [
  {
    slug: "cos-os",
    title: "Building the Chief of Staff system I wanted to use.",
    category: "AI · Product · Business Operations",
    summary:
      "I built CoS OS to bring strategy, project delivery, commercial pipeline management and investor relations into one AI-enabled operating workspace. Rather than creating another dashboard, I wanted to connect the information executives rely on with the decisions and actions that follow.",
    result: "A working AI-enabled Chief of Staff product connecting leadership priorities with operational execution.",
    context: "CoS OS, an AI-enabled operating workspace",
    role: "Founder · Product, Design & Build",
    demonstrates:
      "Identifying an operational problem, translating it into product requirements and building a working solution with modern AI development tools.",
    demo: {
      href: "https://claude.ai/artifact/DQvy82cn3jjqciRPsra1ua",
      label: "Try the AI Chief of Staff demo",
      note: "Opens on claude.ai with a fictional company’s desk. Sign in to chat; nothing of yours is read or shared.",
    },
    motif: { figure: "9", caption: "Operating desks in one workspace" },
    exhibit: {
      src: "/images/cos-os-investors.jpg",
      alt: "The CoS OS Investor Relations Desk for a fictional company raising an £8m Series A: indicative interest, soft commitments, legally committed and funds received shown separately, a capital ladder against the target, and investor conversion by stage.",
      width: 2000,
      height: 1333,
      caption: "The Investor Relations Desk. Indicative interest is never shown as committed capital. Fictional demo company.",
    },
    gallery: [
      {
        src: "/images/cos-os-command-centre.jpg",
        alt: "The CoS OS Executive Command Centre: headline figures for objectives, projects, overdue actions, pipeline, forecast and runway, issues needing attention and decisions awaiting approval.",
        width: 2016,
        height: 1428,
        caption: "Executive Command Centre: what needs attention today, and the decisions waiting for approval.",
        wide: true,
      },
      {
        src: "/images/cos-os-pipeline.jpg",
        alt: "The CoS OS Commercial Pipeline: open and weighted pipeline, win rate, opportunities by stage and stage conversion.",
        width: 2000,
        height: 1333,
        caption: "Commercial Pipeline: weighted forecast, stage conversion and deals that need intervention.",
      },
      {
        src: "/images/cos-os-projects.jpg",
        alt: "The CoS OS Projects and Delivery desk: portfolio status, overdue milestones and actions, budget used, open risks and delivery signals.",
        width: 2000,
        height: 1333,
        caption: "Projects & Delivery: the portfolio, overdue work and delivery signals in one view.",
      },
    ],
    problem:
      "Leadership information is often scattered across presentations, spreadsheets, project trackers and inboxes.\n\nA Chief of Staff can spend a disproportionate amount of time assembling information, reconciling priorities and chasing updates rather than helping leadership make decisions and execute.",
    myRole: [
      "Defined the product architecture and nine operating desks.",
      "Designed an executive command centre covering priorities, projects, decisions, risks and commercial performance.",
      "Developed connected workflows for project management, commercial pipeline visibility and investor relations.",
      "Built the working product using Claude Code, Next.js, Supabase and the Claude API.",
      "Designed an AI workflow that distinguishes facts, assumptions and recommendations and routes proposed changes through human approval.",
      "Built role-based access controls and an auditable approach to decision-making and task completion.",
    ],
    whatChanged: [
      {
        title: "A working product",
        text: "A working AI-enabled Chief of Staff product that connects leadership priorities with operational execution.",
        kind: "personal",
      },
    ],
    impactNote: "The product demonstrates how I approach both executive operations and practical technology development.",
    lesson:
      "Building with AI has made me think differently about business operations. The real opportunity isn’t replacing judgement. It’s removing the friction around information, coordination and follow-through so people can spend more time making decisions and creating value.",
    note: "Screens are shown with a fictional demo company, so no client data appears here.",
    status: "approved",
  },
  {
    slug: "when-youre-the-one-building-it",
    title: "What it means to be the one building it.",
    category: "Founding · Product · Go-to-Market",
    summary:
      "I co-founded Turnout, a sports and wellness community platform connecting clubs and members. From the initial concept through company formation and product testing, I’ve led commercial strategy, product and UX direction, monetisation and go-to-market.",
    result: "From an idea to a defined commercial model, product direction and a platform in testing.",
    context: "Turnout, a sports and wellness community platform",
    role: "Co-Founder · Commercial & Product Lead",
    demonstrates:
      "A founder’s understanding of uncertainty, commercial decisions, technical trade-offs and the responsibility of building something from scratch.",
    timeframe: "2026 to present",
    motif: { figure: "Turnout", caption: "Co-founded" },
    accent: "turnout",
    exhibit: {
      src: "/images/turnout-concept-screens.jpg",
      alt: "Three Turnout concept screens. Home: an open place on Saturday’s long slow distance run sits at the top with one tap to take it. A place opened up: the place is offered with a 9:41 clock before it passes to the next person. You’re on the sheet: twelve of twelve places filled.",
      width: 2400,
      height: 1483,
      caption:
        "Turnout concept direction, 2026. Product and UX direction by me; brand and moodboard by A Plus M Studio; technical implementation by our fractional CTO.",
    },
    problem:
      "Starting a business means working without an established playbook. Every product decision has a commercial consequence, every priority competes for limited resources, and progress depends on knowing what to build now versus what can wait.\n\nWe needed to develop a product that solved genuine problems for clubs and members while creating a commercially viable business.",
    myRole: [
      "Co-founded the business and helped take it from concept and formation into product testing.",
      "Developed the commercial framework, target market, monetisation approach and go-to-market strategy.",
      "Led product and UX direction, translating user and business requirements into product priorities.",
      "Worked closely with our fractional CTO on technical feasibility, feature prioritisation and development trade-offs.",
      "Conceived Poppy, our AI agent for supporting coordination across the platform, and worked with our CTO, who built the technical implementation.",
      "Shaped partnerships, brand and launch planning.",
    ],
    whatChanged: [
      {
        title: "From idea to platform in testing",
        text: "Progressed Turnout from an idea into a business with a defined commercial model, product direction and a platform in testing.",
        kind: "team",
      },
    ],
    impactNote:
      "The technical development is a team achievement. My ownership has been across commercial strategy, product and UX direction, monetisation and founder-level decisions.",
    lesson:
      "Founding has changed the way I think about execution. When it’s your business, there is no separating strategy from delivery. You make decisions with incomplete information, prioritise what matters and take responsibility for moving things forward.",
    status: "approved",
  },
  {
    slug: "finding-a-market-before-the-playbook",
    title: "Finding the market before there’s a playbook.",
    category: "Zero-to-One Growth · Go-to-Market",
    summary:
      "As part of the founding growth team at a seed-stage AI venture, I defined the target customer and pricing with the founder and built the go-to-market approach, progressing six businesses to pilot stage.",
    result: "Six businesses progressed to pilot stage.",
    context: "Seed-stage AI venture",
    role: "Founding Growth Team · Go-to-Market",
    demonstrates:
      "Creating commercial direction, developing propositions and moving opportunities forward in an early-stage environment.",
    progression: ["Market opportunity", "Segmentation", "Proposition", "Pricing", "Pipeline", "Pilot stage"],
    timeframe: "2026 to present",
    motif: { figure: "6", caption: "Businesses progressed to pilot stage" },
    problem:
      "The business needed to establish who its most valuable customers were, how to position its product and what an initial commercial engagement should look like.\n\nThere was no existing sales playbook or established pricing framework.",
    myRole: [
      "Built a market map and segmented prospective customers according to commercial fit and potential demand.",
      "Identified and prioritised target accounts.",
      "Developed the initial go-to-market strategy and supported positioning.",
      "Shaped pricing and pilot propositions.",
      "Supported business development conversations and opportunity progression.",
      "Worked with technical founders to connect product capabilities with real customer requirements.",
    ],
    whatChanged: [
      {
        title: "Six businesses at pilot stage",
        text: "Six businesses progressed to pilot stage against a £150k pilot revenue ambition.",
        kind: "pipeline",
      },
    ],
    impactNote: "This represents pipeline progression, not £150k in closed or recognised revenue.",
    lesson:
      "Building a market starts with understanding the customer, not perfecting the pitch. It taught me how to translate technical capabilities into a commercial proposition, test assumptions quickly and create momentum before the traditional sales infrastructure exists.",
    status: "approved",
  },
  {
    slug: "making-strategy-everyones-business",
    title: "Making strategy executable.",
    category: "Commercial Strategy · Executive Operations",
    summary:
      "Working directly with the Group Chief Commercial Officer of a major wealth management business, I developed an organic growth strategy adopted by the Executive Committee and established the governance and operating rhythm to turn leadership priorities into coordinated delivery.",
    result: "An organic growth strategy adopted by the Executive Committee.",
    context: "Canaccord, Commercial Office",
    role: "Business Initiatives Lead · Commercial Office",
    timeframe: "2024 to present",
    motif: { figure: "ExCo", caption: "Organic growth strategy adopted" },
    problem:
      "Commercial growth spans multiple interdependent functions, from distribution and propositions to finance, technology, data and client experience.\n\nLeadership needed a consistent framework for prioritisation, accountability, performance visibility and decision-making.",
    myRole: [
      "Established and ran a Growth Committee to coordinate priorities and decisions.",
      "Built the executive operating cadence, including governance, risk escalation and delivery reporting.",
      "Built a 30-metric, one-page CEO dashboard covering client outcomes, fair value, growth, outflows, regulatory risk and retention, cutting leadership reporting time by around two weeks.",
      "Developed the organic growth strategy, including client-segment and channel opportunity sizing, commercial analysis and proposition priorities.",
      "Translated strategy into commercial objectives, KPIs and delivery plans.",
      "Supported strategic partnerships and commercial enablement through external materials, opportunity analysis and pipeline-conversion reporting.",
      "Worked across commercial, financial, technology, operations and compliance stakeholders.",
      "Coordinated eight Consumer Duty workstreams and Fair Value Assessment activity through senior governance and Board sign-off.",
    ],
    whatChanged: [
      {
        title: "Strategy adopted, and made executable",
        text: "An organic growth strategy adopted by ExCo, with a repeatable leadership forum and operating cadence connecting strategic priorities to accountable execution.",
        kind: "personal",
      },
      {
        title: "Around two weeks back for leadership",
        text: "The one-page dashboard I built cut leadership reporting preparation by around two weeks.",
        kind: "personal",
      },
      {
        title: "Eight workstreams to Board sign-off",
        text: "Separately, eight cross-functional regulatory workstreams were coordinated through Board sign-off.",
        kind: "personal",
      },
    ],
    lesson:
      "Strategy becomes valuable when it changes what people do. I’ve learned that effective execution needs commercial judgement, clear ownership and the ability to connect different teams around a shared outcome. Leadership needs both the big picture and confidence that the details are being delivered.",
    status: "approved",
  },
  {
    slug: "circus-capital",
    title: "Building the infrastructure behind strategic decisions.",
    category: "Founder Support · Strategic Operations",
    summary:
      "Working alongside the Principal of Circus Capital, I provide strategic and operational support across business priorities, stakeholder communications, research and internal execution.",
    result: "Practical systems supporting the Principal’s decision-making.",
    context: "Circus Capital",
    role: "Fractional Chief of Staff · Strategic Operations & Investor Communications",
    timeframe: "2025 to present",
    motif: { figure: "Principal", caption: "Working alongside, day to day" },
    situation:
      "My work focuses on preparing business materials, organising information, coordinating projects and developing practical systems that support the Principal’s decision-making.",
    myRole: [
      "Support the preparation and organisation of business presentations, research and stakeholder communications.",
      "Develop internal project trackers, action logs and reporting workflows to improve visibility and follow-through.",
      "Conduct market and business research to inform strategic planning.",
      {
        title: "AI-assisted workflows",
        body: "Build AI-assisted workflows to support information management, research and executive administration. That thinking also shaped CoS OS, the Chief of Staff product I built.",
        link: { href: "/work/cos-os", label: "See CoS OS" },
      },
      "Coordinate operational priorities and follow-up activity under the Principal’s direction.",
    ],
    whatChanged: [],
    lesson:
      "Working closely with a Principal has reinforced how valuable good judgement, discretion and execution are in a lean business. Effective support isn’t about adding process. It’s about creating clarity, protecting leadership time and making sure important work moves forward.",
    status: "approved",
  },
  {
    slug: "the-discipline-behind-the-ambition",
    title: "The commercial discipline behind growth.",
    category: "Finance · Transactions · Executive Reporting",
    summary:
      "Before moving further into commercial strategy and founder-led businesses, I developed a financial and operational foundation across a FTSE 250 insurer, a venture-backed SaaS company and an investment management business. That experience shaped how I assess commercial opportunities, understand business performance and support executive decisions.",
    result: "Public-company reporting, fundraising support, acquisition work and investment governance.",
    context: "Hastings Direct, Paddle and RBC Brewin Dolphin",
    role: "Finance, Strategy & Executive Reporting",
    timeframe: "2016 to 2024",
    motif: { figure: "3", caption: "Businesses, three stages of growth" },
    myRole: [
      {
        title: "Hastings Direct · Foundational roles in finance · 2016 to 2022",
        body: "Around six years in a variety of foundational roles in finance, including commercial finance, investor relations, workforce planning and procurement: financial and management reporting, business planning, capital and workforce planning, commercial analysis, supplier and procurement activity, and supporting half-year and full-year results. I worked through the transition from listed to private ownership, developing an understanding of financial scrutiny, stakeholder expectations and the relationship between strategic ambition and operating performance.",
      },
      {
        title: "Paddle · Series D SaaS and acquisition integration · 2022",
        body: "Supported financial analysis during the period of Paddle’s $200m+ Series D fundraising, and contributed to reporting and integration work associated with the ProfitWell acquisition.",
      },
      {
        title: "RBC Brewin Dolphin · Investment management and executive reporting · 2022 to 2024",
        body: "Supported executive and Investment Committee reporting through the RBC acquisition. After joining, I stepped into Associate Director cover, holding the remit for around 15 months, and worked on reporting improvements, automation and credit-rating monitoring.",
      },
    ],
    whatChanged: [
      {
        title: "A foundation across stages",
        text: "Public-company reporting, financial planning, fundraising support, acquisition-related work, investment governance and executive decision-making.",
        kind: "personal",
      },
      {
        title: "Paddle’s Series D",
        text: "The $200m+ Series D belongs to Paddle. My contribution was the supporting finance and reporting work, not raising the capital.",
        kind: "company",
      },
    ],
    lesson:
      "Commercial ambition needs financial discipline behind it. Working across businesses at very different stages taught me how to look beyond the headline opportunity, understand the financial and operational implications, and give leadership the information it needs to make sound decisions.",
    status: "approved",
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
