/**
 * Biography, home-page copy, capabilities, interests and "Currently".
 *
 * REVIEW STATUS: draft. Copy marked TODO(Emma) was written for this MVP and
 * needs Emma's approval. Do not add metrics, employer names or client names
 * until Emma has confirmed they can be published.
 */

export const hero = {
  eyebrow: "Strategy / Growth / Building",
  headline: "From the boardroom to the blank sheet.",
  intro: [
    "I’ve spent the last decade working inside businesses of all shapes and sizes, from listed companies and private equity-backed firms to venture-backed startups and ideas that barely existed beyond a conversation.",
    "Somewhere along the way, I discovered that what I enjoy most isn’t simply shaping strategy. It’s figuring out how to make things happen.",
    "Today, I work across growth, commercial strategy, operations and technology, alongside the people building what’s next.",
  ],
  // TODO(Emma): add a portrait at public/images/emma-portrait.jpg and set `portrait` below.
  portrait: undefined as undefined | { src: string; alt: string; width: number; height: number },
};

/** Where Emma has worked — approved for publication. Names as text only; no company logos. */
export const workedWith = ["Hastings Direct", "Paddle", "RBC Brewin Dolphin", "Canaccord", "Circus Capital", "Founder-led ventures"];

export const aboutTeaser = {
  label: "A little about me",
  body: [
    "My experience spans FTSE 250, private equity-backed and venture-backed businesses, from financial services and fintech to high-growth technology.",
    "I’ve worked closely with executives and founders across strategy, commercial growth, operations and complex projects.",
    "Alongside my professional work, I’ve supported founders fractionally, co-founded Turnout, a sports and wellness platform where I own the full go-to-market, and built practical AI-powered tools.",
  ],
  pullQuote:
    "I’m particularly drawn to environments where there’s ambiguity, momentum and something interesting to build.",
};

/** Homepage spotlight on Turnout. Turnout keeps its own brand: text credit only, no logo merged with EMMA CLARK. */
export const turnout = {
  label: "Currently building",
  name: "Turnout",
  line: "A sports and wellness platform I co-founded.",
  body: [
    "I’m responsible for Turnout’s full go-to-market. I developed the go-to-market strategy, and I move between commercial planning, product decisions, brand and the website.",
    "Together we’ve taken it from company formation and initial concept into product testing.",
  ],
  facts: [
    { label: "My role", value: "Co-founder" },
    { label: "I own", value: "Go-to-market" },
    { label: "Stage", value: "Product testing" },
  ],
};

/**
 * Credibility strip. Qualifying wording is part of each fact — keep it, so supporting a
 * fundraise isn’t read as raising the capital, and pilots aren’t read as revenue.
 * Figures confirmed by Emma as current and shareable.
 */
export const facts = [
  { figure: "10 years", label: "Across finance, strategy, operations and growth" },
  { figure: "$200m", label: "Part of the business during a Series D and unicorn valuation" },
  { figure: "30 metrics", label: "Executive dashboard and reporting infrastructure built" },
  { figure: "6 pilots", label: "Businesses progressed to pilot stage at a seed-stage AI venture" },
];

/** Separate journeys for the three kinds of visitor. */
export const journeys = [
  {
    audience: "Founders",
    title: "Looking for fractional or project support?",
    href: "/work-with-me",
    cta: "How I can help",
  },
  {
    audience: "Hiring managers",
    title: "Exploring a permanent role?",
    href: "/about",
    cta: "My story",
  },
  {
    audience: "Investors & collaborators",
    title: "Curious about my background?",
    href: "/work",
    cta: "Selected work",
  },
];

export type Capability = { title: string; description: string; points: string[] };

export const capabilities: Capability[] = [
  {
    title: "Strategy & Execution",
    description: "Turning leadership priorities into plans people can follow, and the rhythm that keeps them moving.",
    points: ["Strategic priorities", "Executive reporting", "Investor readiness", "Operating cadence"],
  },
  {
    title: "Growth & Commercial",
    description: "Sharper commercial plans, clearer pipeline and the material teams need to sell.",
    points: ["Go-to-market strategy", "Commercial planning", "Pricing & propositions", "Pipeline analysis"],
  },
  {
    title: "Operations & Systems",
    description: "The reporting and processes that let a business see how it’s really performing.",
    points: ["Dashboards", "Reporting", "Processes", "Performance visibility"],
  },
  {
    title: "AI & Automation",
    description: "Practical, low-risk experiments that take repetitive work off people’s plates.",
    points: ["Agentic Chief of Staff", "Pipeline tracker", "Investor finder", "Reporting automation"],
  },
];

export type Interest = {
  title: string;
  caption: string;
  imageBrief: string;
  image?: { src: string; alt: string; width: number; height: number };
};

export const beyondWork = {
  label: "Beyond the boardroom",
  headline: "A curious mind rarely stays in one place.",
  intro:
    "When I’m not working, I’m usually learning something new, finding a new place to explore, getting lost in a book or convincing myself I have time for another project.",
  // TODO(Emma): replace placeholders with your own photography.
  interests: [
    { title: "Art & collecting", caption: "Developing my eye and discovering artists and ideas.", imageBrief: "Your own photo: a favourite artwork, gallery or studio visit" },
    { title: "Always learning", caption: "Economics, technology, business and whatever catches my curiosity.", imageBrief: "Your own photo: current reading pile or notebook" },
    { title: "Movement & wellness", caption: "Tennis, Pilates and finding time to move.", imageBrief: "Your own photo: tennis court, racquet or studio" },
    { title: "People & places", caption: "Travel, music, different cultures and interesting conversations.", imageBrief: "Your own photo: a place you’ve travelled to" },
  ] as Interest[],
};

export type CurrentlyEntry = { label: string; title: string; body: string };

export const currently = {
  label: "Currently",
  headline: "A few things on my mind.",
  // TODO(Emma): update these whenever you like — they also power /currently.
  updated: "November 2026",
  entries: [
    {
      label: "Currently exploring",
      title: "Agentic AI and practical business automation.",
      body: "What happens when agents move from demos into the everyday work of small teams, and where a human still needs to be in the loop.",
    },
    {
      label: "Currently interested in",
      title: "Founders, emerging technologies and interesting business models.",
      body: "Particularly businesses that are rethinking an old industry, and the operating choices that make them work.",
    },
    {
      label: "Currently learning",
      title: "New tools, ideas and ways to build better businesses.",
      body: "Trying things hands-on, keeping what proves useful and writing down what I learn along the way.",
    },
  ] as CurrentlyEntry[],
  // Optional extras for the /currently page. TODO(Emma): replace with your real picks or delete.
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

/** About page — "your story, not your CV". */
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
      ],
    },
    {
      label: "The other side of the table",
      paragraphs: [
        "More recently, I’ve found myself increasingly drawn to the other side of the table: building.",
        "I’ve co-founded Turnout, a sports and wellness platform, taking it from an idea through company formation, product development and into testing. I’m responsible for its full go-to-market, and I developed the go-to-market strategy.",
        "I’ve also worked fractionally with founders, helping turn early-stage ideas into commercial propositions and execution plans. At a seed-stage AI venture I’m a founding member of the growth team, alongside colleagues including former Amazon employees, and I own the full go-to-market there too. For Circus Capital, I support fundraising, connect them with family offices and support their investor materials, and I built an agentic Chief of Staff, a pipeline tracker, an investor finder and a project management system in Claude. It taught me the importance of relationship building.",
        "I’ve also become fascinated by what AI makes possible for small, ambitious teams. I build and experiment with agents, automations and reporting systems that make work simpler, faster and more intelligent.",
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
    "If you’re hiring: I’m open to the right permanent opportunity with an ambitious business, particularly roles that sit across strategy, growth and operations.",
};
