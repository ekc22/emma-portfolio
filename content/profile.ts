/**
 * Biography, homepage copy, interests and "Currently".
 *
 * Copy approved by Emma. House style: no em dashes in visible copy.
 * Do not add metrics, employer names or client names without Emma's confirmation.
 */

export type ImageAsset = { src: string; alt: string; width: number; height: number };

export const hero = {
  eyebrow: "Founder / Strategic Operator / Chief of Staff",
  headline: "From the boardroom to the blank sheet.",
  intro: [
    "I’ve spent a decade working alongside executives and founders, from listed businesses and venture-backed technology companies to early-stage ventures.",
    "My work sits where commercial strategy meets execution: building growth propositions, creating the systems businesses run on and turning ambitious ideas into something tangible.",
    "Today, I combine financial discipline, a founder’s perspective and hands-on technical capability to help ambitious businesses build, operate and grow.",
  ],
  // Add a portrait at public/images/emma-portrait.jpg and set it here; the hero shows it automatically.
  portrait: undefined as undefined | ImageAsset,
};

/** Shown at the top of the homepage. */
export const openTo = "Open to Chief of Staff, Founder’s Office and strategy & operations roles";

/** Professional identity, shown beside the hero. */
export const identity = {
  title: "Founder & Strategic Operator",
  positioning: "Chief of Staff · Founder’s Office · Strategy & Operations",
  statement: ["I can build.", "I can operate.", "I bring commercial and financial judgement."],
};

/** Where Emma has worked. Approved for publication. Names as text only; no company logos. */
export const workedWith = ["Hastings Direct", "Paddle", "RBC Brewin Dolphin", "Canaccord", "Circus Capital", "Founder-led ventures"];

export const aboutTeaser = {
  label: "A little about me",
  body: [
    "My career has taken me from the financial and operational foundations of listed businesses to venture-backed technology, investment management and building something of my own.",
    "I’ve worked directly with executive teams on commercial strategy, growth initiatives, fundraising, financial planning and business operations. More recently, I’ve co-founded a venture, developed early-stage go-to-market strategies and built AI-powered tools to make small teams more effective.",
    "What connects the experience is a willingness to move between strategy and execution, understand the detail and take responsibility for getting things done.",
  ],
  pullQuote:
    "I’m particularly drawn to ambitious, founder-led environments where commercial thinking, ownership and execution matter.",
};

/** Homepage spotlight on Turnout. Turnout keeps its own brand: its figures on its own blue. */
export const turnout = {
  label: "Currently building",
  name: "Turnout",
  line: "A sports and wellness community platform I co-founded.",
  what:
    "Turnout connects clubs and people, bringing together a sports and wellness market that’s fragmented. Clubs get a backend for collecting money and organising events, and Poppy, our AI agent, supports the coordination.",
  body:
    "From the initial concept through company formation and product testing, I’ve led commercial strategy, product and UX direction, monetisation and go-to-market. I conceived Poppy, our AI agent, and work with our fractional CTO, who builds the technical implementation.",
  facts: [
    { label: "My role", value: "Co-founder" },
    { label: "I lead", value: "Commercial & product" },
    { label: "My concept", value: "Poppy, our AI agent" },
  ],
};

/**
 * Credibility strip. Qualifying wording is part of each fact: keep it, so being part of a
 * fundraise isn’t read as raising the capital, and pilots aren’t read as revenue.
 * Figures confirmed by Emma as current and shareable.
 */
export const facts: { figure: string; label: string; href?: string }[] = [
  { figure: "10 years", label: "Across finance, strategy, growth and operations" },
  { figure: "~2 weeks", label: "Cut from leadership reporting time by the CEO dashboard I built at Canaccord", href: "/work/making-strategy-everyones-business" },
  { figure: "30 metrics", label: "On that one-page executive dashboard, from client outcomes to retention", href: "/work/making-strategy-everyones-business" },
  { figure: "6 pilots", label: "Businesses progressed to pilot stage at a seed-stage AI venture. Pipeline, not revenue", href: "/work/finding-a-market-before-the-playbook" },
];

/** Homepage: what Emma brings. Four areas, kept short. */
export const whatIBring = {
  label: "What I bring",
  headline: "I can see the bigger picture. I can also build what’s missing.",
  intro: [
    "I’ve worked in environments where decisions require financial discipline, regulatory awareness and executive alignment, and in early-stage businesses where the challenge is creating momentum with limited resources.",
    "I bring both perspectives to the table.",
  ],
  items: [
    { title: "Strategic Execution", body: "Turning leadership priorities into clear plans, accountable delivery and measurable progress." },
    { title: "Commercial Growth", body: "Building propositions, understanding markets, developing partnerships and moving opportunities forward." },
    { title: "Business Operations", body: "Creating the reporting, systems and operating rhythms that help ambitious teams execute." },
    { title: "AI-Enabled Building", body: "Using practical AI tools, automation and software development workflows to turn operational problems into usable solutions." },
  ],
};

/** Homepage: corporate experience meets founding. */
export const founderPerspective = {
  label: "Founder perspective",
  headline: "I’ve sat on both sides of the table.",
  body: [
    "I’ve spent years helping leadership teams make decisions and execute their priorities.",
    "Building a venture of my own has given me a different perspective: on uncertainty, trade-offs, commercial reality and the responsibility that comes with ownership.",
    "It’s changed how I approach problems, how I prioritise and how I work alongside founders.",
  ],
};

/** Target roles and environments. Used on the homepage and Work With Me. */
export const opportunities = {
  label: "Opportunities",
  headline: "Where I want to make an impact.",
  body: [
    "I’m particularly interested in Chief of Staff, Founder’s Office, Founding Operator and Strategy & Operations roles within ambitious, founder-led businesses.",
    "I enjoy environments where there’s ownership, pace, trust and an opportunity to build.",
    "I’m also open to selected fractional engagements and defined projects where my experience can be useful.",
  ],
  roles: ["Chief of Staff to a Founder or CEO", "Founding Operator", "Founder’s Office", "Strategy & Operations Lead", "Business Operations & Strategic Initiatives"],
  environments: ["AI-native start-ups", "Venture-backed technology, seed to Series C", "Founder-led scale-ups", "Fintech and financial infrastructure"],
};

/** Separate journeys for the three kinds of visitor. */
export const journeys = [
  { audience: "Founders", title: "Looking for fractional or project support?", href: "/work-with-me", cta: "How I can help" },
  { audience: "Hiring", title: "Hiring a Chief of Staff, Founder’s Office or strategy and operations lead?", href: "/work", cta: "See how I work" },
  { audience: "Investors & collaborators", title: "Curious about my background?", href: "/about", cta: "My story" },
];

export type Interest = {
  title: string;
  caption: string;
  image?: ImageAsset;
};

export const beyondWork = {
  label: "Beyond the boardroom",
  headline: "A curious mind rarely stays in one place.",
  intro:
    "Outside work, I’m interested in art, economics, technology, travel, music, wellness and the people and ideas that connect different worlds. I’m usually learning something new, exploring an idea or finding another project to get involved in.",
  // TODO(Emma): add your own photos (image) and a line of personal reflection for each.
  interests: [
    { title: "Art & collecting", caption: "Developing my eye and discovering artists and ideas." },
    { title: "Reading & learning", caption: "Economics, technology, business and whatever catches my curiosity." },
    { title: "AI & experimentation", caption: "Building practical tools and agents, mostly to see what’s possible." },
    { title: "Movement & wellness", caption: "Tennis, Pilates and finding time to move." },
    { title: "Travel & culture", caption: "New places, music, different cultures and interesting conversations." },
  ] as Interest[],
};

export type CurrentlyEntry = { label: string; title: string; body: string; href?: string };

export const currently = {
  label: "Currently",
  headline: "A few things on my mind.",
  // TODO(Emma): update these whenever you like. Keep them specific.
  updated: "November 2026",
  entries: [
    {
      label: "Currently building",
      title: "Turnout and selected AI-enabled operational tools, including CoS OS.",
      body: "Leading go-to-market and monetisation for Turnout and shaping Poppy, our AI agent, plus the Claude tools I use to run my own work.",
      href: "/work/when-youre-the-one-building-it",
    },
    {
      label: "Currently exploring",
      title: "Agentic AI and the commercial applications of emerging technology.",
      body: "And how small teams can use it to operate more effectively.",
    },
    {
      label: "Currently learning",
      title: "Economics and Management.",
      body: "Alongside professional development and practical experimentation with modern technology.",
    },
    {
      label: "Currently interested in",
      title: "Ambitious founders, venture-backed businesses, fintech and AI-native companies.",
      body: "And high-ownership operating roles where commercial thinking meets execution.",
    },
  ] as CurrentlyEntry[],
  // Optional extras for the /currently page. Items starting "TODO" are hidden on the live site.
  notebook: [
    { label: "Reading", items: ["TODO: a book you’re reading", "TODO: another book or long read"] },
    { label: "Listening", items: ["TODO: a podcast, album or playlist"] },
    { label: "Experimenting with", items: ["Claude agents for research and reporting", "TODO: another experiment"] },
  ],
};

export const contact = {
  label: "Contact",
  headline: "Have something interesting in mind?",
  body: [
    "I’m always interested in meeting ambitious founders, thoughtful operators and people building businesses worth being part of.",
    "Whether you’re hiring for a high-ownership role, exploring a collaboration or simply think we should connect, I’d love to hear from you.",
  ],
  cta: "Get in touch",
};

/** Career timeline and education, taken from Emma's CV. */
export type TimelineEntry = { when: string; kind: "employment" | "founder"; org: string; role: string };

export const timeline: TimelineEntry[] = [
  { when: "2026 to present", kind: "founder", org: "Turnout (Good Turnout Ltd)", role: "Co-Founder & Chief Strategy Officer" },
  { when: "2026 to present", kind: "founder", org: "Seed-stage AI start-up (stealth)", role: "Founding growth team, part time" },
  { when: "2025 to present", kind: "founder", org: "Circus Capital", role: "Chief of Staff (fractional)" },
  { when: "2024 to present", kind: "employment", org: "Canaccord Genuity Wealth Management", role: "Business Initiatives Lead, Commercial Office · Chief of Staff remit to the Group CCO" },
  { when: "2022 to 2024", kind: "employment", org: "RBC Brewin Dolphin", role: "Associate, Funds (Associate Director cover)" },
  { when: "2022", kind: "employment", org: "Paddle", role: "Management Accountant, FP&A" },
  { when: "2016 to 2022", kind: "employment", org: "Hastings Direct", role: "A variety of foundational roles in finance, including commercial finance, investor relations, workforce planning and procurement" },
];

export const education = [
  "BSc Economics & Management, University of London (LSE academic direction), part time, 2026 to present",
  "Investment Management Certificate, CISI Level 4",
  "ACCA, Practical Experience Requirement complete",
  "Anthropic Academy, 2026: Claude Code in Action; Building Effective Human-Agent Teams; AI Fluency",
];

/** About page: "your story, not your CV". */
export const about = {
  headline: "I’ve never been particularly interested in staying in one lane.",
  chapters: [
    {
      label: "Learning how businesses work",
      paragraphs: [
        "I started my career in finance, learning how businesses really work: the numbers, the decisions, the people behind them and what it takes to keep everything moving.",
        "I joined Hastings Direct as a FTSE 250 insurer and stayed through its move into private ownership.",
        "Over the next decade, that curiosity took me on to a venture-backed SaaS business, through investment management and into the commercial office of a private equity-backed wealth manager.",
      ],
    },
    {
      label: "Between functions",
      paragraphs: [
        "Different industries, different challenges, different stages of growth. But a common thread: I’ve always gravitated towards the work that sits between functions, where the answer isn’t obvious and someone needs to connect the dots.",
        "I’ve worked alongside CFOs, commercial leaders, executives and founders. I’ve supported fundraising, helped navigate acquisitions, built executive reporting systems, translated commercial strategies into delivery plans and worked on everything from regulatory programmes to growth initiatives.",
        "That includes the line between commercial and technical. I’m at home working with CTOs, engineers and technical founders: I build AI tools myself, so I understand enough of how things are made to ask the right questions, and I can translate commercial goals into technical priorities and back again.",
      ],
    },
    {
      label: "The other side of the table",
      paragraphs: [
        "More recently, I’ve found myself increasingly drawn to the other side of the table: building.",
        "I co-founded Turnout, a sports and wellness community platform that connects clubs and people in a fragmented market, and have taken it from an idea through company formation and product development into testing. I lead its go-to-market, monetisation and product and UX, and came up with the concept for Poppy, our AI agent, which supports the coordination behind it all. Our fractional CTO builds it; I work with him to channel the vision into the product.",
        "I’ve also worked fractionally with founders. At a seed-stage AI venture I’m part of the founding growth team, leading go-to-market. At Circus Capital, I work alongside the Principal as a fractional Chief of Staff, across strategic priorities, stakeholder communications, research and internal execution.",
        "Across all of it, I build and experiment with agents, automations and reporting systems that make work simpler, faster and more intelligent.",
      ],
    },
  ],
  connects:
    "What connects all of it is curiosity, ownership and a genuine enjoyment of making things happen. I like understanding the big picture, but I’m equally happy getting into the detail.",
  pullQuote: "A strategy is only interesting to me if someone is prepared to execute it.",
  outside:
    "I’m interested in art, economics, technology, travel, music, wellness and just about anything that teaches me something new.",
  closing: "I’m always looking for interesting people to learn from, ideas to explore and things worth building.",
  permanent:
    "If you’re hiring: I’m looking for a permanent Chief of Staff, Founder’s Office, strategy or operations role, ideally at a founder-led seed or Series A business, where I can bring a founder’s perspective and take real ownership.",
};
