/**
 * Biography, homepage copy, interests and "Currently".
 *
 * Copy approved by Emma. House style: no em dashes in visible copy.
 * Do not add metrics, employer names or client names without Emma's confirmation.
 */

export type ImageAsset = { src: string; alt: string; width: number; height: number };

export const hero = {
  eyebrow: "Strategy / Growth / Building",
  headline: "From the boardroom to the blank sheet.",
  intro: [
    "I’ve spent a decade working at the intersection of strategy, growth and execution, from listed businesses and venture-backed technology companies to founder-led ventures.",
    "I’ve supported major fundraising processes, built commercial propositions, created operating systems and co-founded a business of my own.",
    "Today, I bring together financial discipline, a founder’s perspective and hands-on execution to help ambitious businesses move forward.",
  ],
  // Add a portrait at public/images/emma-portrait.jpg and set it here; the hero shows it automatically.
  portrait: undefined as undefined | ImageAsset,
};

/** Professional identity, shown beside the hero. */
export const identity = {
  title: "Founder & Strategic Operator",
  positioning: "Strategy, growth and operations, from established businesses to the earliest stages of building.",
  statement: ["Commercial thinking.", "Hands-on execution.", "A founder’s perspective."],
};

/** Where Emma has worked. Approved for publication. Names as text only; no company logos. */
export const workedWith = ["Hastings Direct", "Paddle", "RBC Brewin Dolphin", "Canaccord", "Circus Capital", "Founder-led ventures"];

export const aboutTeaser = {
  label: "A little about me",
  body: [
    "I’ve spent my career working across businesses at very different stages of growth, from established financial institutions to venture-backed technology companies and early-stage ventures.",
    "What connects those experiences is an interest in how businesses work, how ideas become commercially viable and what it takes to execute when there isn’t an obvious answer.",
    "I’ve worked alongside executives, founders and technical teams, supported fundraising and growth initiatives, developed operating systems and built a venture of my own.",
  ],
  pullQuote:
    "I’m particularly drawn to ambitious, founder-led environments where commercial thinking, ownership and execution matter.",
};

/** Homepage spotlight on Turnout. Turnout keeps its own brand: its figures on its own blue. */
export const turnout = {
  label: "Currently building",
  name: "Turnout",
  line: "A sports and wellness platform I co-founded.",
  body:
    "Building Turnout has given me a founder’s perspective on commercial strategy, product development, technical trade-offs and execution. I lead go-to-market, built Poppy, our AI agent, and work with a fractional CTO to get to market sooner.",
  facts: [
    { label: "My role", value: "Co-founder" },
    { label: "I lead", value: "Go-to-market" },
    { label: "I built", value: "Poppy, our AI agent" },
  ],
};

/**
 * Credibility strip. Qualifying wording is part of each fact: keep it, so being part of a
 * fundraise isn’t read as raising the capital, and pilots aren’t read as revenue.
 * Figures confirmed by Emma as current and shareable.
 */
export const facts = [
  { figure: "10 years", label: "Across finance, strategy, operations and growth" },
  { figure: "≈2 weeks", label: "Recurring reporting preparation saved per cycle" },
  { figure: "30", label: "Executive metrics in the reporting dashboards I built" },
  { figure: "6", label: "Businesses progressed to pilot stage at a seed-stage AI venture" },
  { figure: "$200m", label: "Series D at Paddle, at a unicorn valuation, while I was part of the business" },
];

/** Separate journeys for the three kinds of visitor. */
export const journeys = [
  { audience: "Founders", title: "Looking for fractional or project support?", href: "/work-with-me", cta: "How I can help" },
  { audience: "Hiring managers", title: "Exploring a permanent role?", href: "/work", cta: "Case studies and CV" },
  { audience: "Investors & collaborators", title: "Curious about my background?", href: "/about", cta: "My story" },
];

export type Interest = {
  title: string;
  caption: string;
  image?: ImageAsset;
};

export const beyondWork = {
  label: "Beyond the boardroom",
  headline: "There’s more to life than a job title.",
  intro:
    "When I’m not working, I’m usually learning something new, finding a new place to explore, getting lost in a book or convincing myself I have time for another project.",
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
      title: "Turnout, alongside selected AI experiments and practical tools.",
      body: "Leading go-to-market for Turnout and building Poppy, our AI agent, plus the Claude tools I use to run my own work.",
      href: "/work/when-youre-the-one-building-it",
    },
    {
      label: "Currently exploring",
      title: "Agentic AI, emerging technologies and new business models.",
      body: "And the early-stage commercial opportunities they open up for small, ambitious teams.",
    },
    {
      label: "Currently learning",
      title: "Economics and Management.",
      body: "Alongside professional development and hands-on experimentation with new technology.",
    },
    {
      label: "Currently interested in",
      title: "Founder-led businesses, venture capital and growth-stage companies.",
      body: "Especially opportunities that combine commercial thinking with execution.",
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
    "I’m always interested in meeting ambitious founders, thoughtful operators and people building interesting things.",
    "Whether it’s a business challenge, a collaboration or simply a conversation, I’d love to hear from you.",
  ],
  cta: "Let’s talk",
};

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
        "I co-founded Turnout, a sports and wellness platform, and have taken it from an idea through company formation and product development into testing. I lead its go-to-market and built Poppy, our AI agent.",
        "I’ve also worked fractionally with founders. At a seed-stage AI venture I’m a founding member of the growth team, leading go-to-market. For Circus Capital, I support fundraising and investor relationships, and built the Claude-powered systems behind their day-to-day operations.",
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
    "If you’re hiring: I’m open to selected permanent opportunities with ambitious businesses, particularly roles that sit across strategy, growth and operations.",
};
