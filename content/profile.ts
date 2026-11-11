/**
 * Biography, home-page copy, capabilities, interests and "Currently".
 *
 * REVIEW STATUS: draft. Copy marked TODO(Emma) was written for this MVP and
 * needs Emma's approval. Do not add metrics, employer names or client names
 * until Emma has confirmed they can be published.
 */

export const hero = {
  headline: ["A little bit of everything.", "A lot of getting things done."],
  intro: [
    "I’m Emma — a strategic operator, founder and commercial generalist working across growth, strategy, operations and technology.",
    "I’ve spent my career working alongside leadership teams, solving complex business challenges and turning ideas into things that actually happen.",
  ],
  // TODO(Emma): add a portrait at public/images/emma-portrait.jpg and set `portrait` below.
  portrait: undefined as undefined | { src: string; alt: string; width: number; height: number },
};

export const aboutTeaser = {
  label: "A little about me",
  headline: "Business-minded. Curious by nature.",
  body: [
    "My experience spans FTSE 250, private equity-backed and venture-backed businesses, from financial services and fintech to high-growth technology.",
    "I’ve worked closely with executives and founders across strategy, commercial growth, operations and complex projects.",
    "Alongside my professional work, I’ve supported founders fractionally, built a sports and community venture and experimented with practical AI-powered tools.",
  ],
  pullQuote:
    "I’m particularly drawn to environments where there’s ambiguity, momentum and something interesting to build.",
};

export type Capability = { title: string; description: string; points: string[] };

export const capabilities: Capability[] = [
  {
    title: "Strategy & Execution",
    description: "Turning leadership priorities into plans people can follow — and the rhythm that keeps them moving.",
    points: ["Strategic priorities", "Executive reporting", "Cross-functional delivery", "Operating cadence"],
  },
  {
    title: "Growth & Commercial",
    description: "Sharper commercial plans, clearer pipeline and the material teams need to sell.",
    points: ["Commercial planning", "Partnerships", "Sales enablement", "Pipeline analysis"],
  },
  {
    title: "Operations & Systems",
    description: "The reporting and processes that let a business see how it’s really performing.",
    points: ["Dashboards", "Reporting", "Processes", "Performance visibility"],
  },
  {
    title: "AI & Automation",
    description: "Practical, low-risk experiments that take repetitive work off people’s plates.",
    points: ["Claude agents", "Reporting automation", "Workflow improvements"],
  },
];

export type Interest = {
  title: string;
  caption: string; // TODO(Emma): approve or rewrite each caption in your own words.
  imageBrief: string;
  image?: { src: string; alt: string; width: number; height: number };
};

export const beyondWork = {
  label: "Beyond the work",
  headline: "There’s more to life than a job title.",
  intro:
    "The things I do outside work shape how I think inside it — curiosity, taste and a healthy respect for practice.",
  interests: [
    { title: "Art & collecting", caption: "Galleries, studio visits and the occasional piece that comes home.", imageBrief: "A favourite artwork or gallery visit" },
    { title: "Technology & AI", caption: "Building small things to understand big shifts.", imageBrief: "Desk, notebook or a side-project screen" },
    { title: "Economics & business", caption: "How markets, incentives and companies really work.", imageBrief: "Books or a newspaper spread" },
    { title: "Travel & culture", caption: "New cities, good food and seeing how other places do things.", imageBrief: "A travel photograph" },
    { title: "Reading & learning", caption: "Always mid-way through at least two books.", imageBrief: "Current reading pile" },
    { title: "Wellness, tennis & Pilates", caption: "Staying strong, staying sane, chasing a better backhand.", imageBrief: "Tennis court or racquet" },
    { title: "Music & community", caption: "Live music, shared tables and bringing people together.", imageBrief: "Gig, concert or a community event" },
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
      body: "What happens when agents move from demos into the everyday work of small teams — and where a human still needs to be in the loop.",
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

export const about = {
  // TODO(Emma): approve. Kept deliberately general — add employer names only if you’re happy to publish them.
  headline: "A generalist, on purpose.",
  lead: "My work sits where strategy meets day-to-day delivery — the space where good ideas usually get stuck.",
  career: [
    "I’ve worked across FTSE 250, private equity-backed and venture-backed businesses, mostly in financial services, insurance, fintech and technology. The settings have varied a lot; the job has usually been similar — sit close to the leadership team, understand what matters most, and make sure it actually gets done.",
    "That has meant supporting executives and founders directly: shaping priorities, building the reporting that keeps a leadership team honest, coordinating work across functions, and picking up the commercial and operational problems that don’t fit neatly in anyone’s job description.",
    "More recently I’ve worked fractionally, which suits the way I like to work: getting close to a business quickly, being useful early, and leaving behind things that keep working after I’ve gone.",
  ],
  founder: [
    "I’ve also founded a sports and community venture. Building something from scratch is humbling in the best way — there’s no team to delegate to, and every decision is a trade-off between ambition and what you can realistically get done this week.",
    "It changed how I work inside larger businesses too. I’m quicker to test an idea cheaply, more comfortable with ambiguity, and much more sympathetic to founders juggling everything at once.",
  ],
  principles: [
    { title: "Clarity before activity", body: "Agree what matters and what good looks like before anyone starts building decks or dashboards." },
    { title: "Make it visible", body: "Priorities, risks and progress should be easy for anyone to see. Most problems get smaller once they’re written down." },
    { title: "Small steps, shipped", body: "A working first version beats a perfect plan. Test, learn, then scale what works." },
    { title: "Leave it better", body: "Good support should outlast the engagement — clearer processes, better tools, more confident teams." },
  ],
  outside:
    "I’m interested in how things work — economies, organisations, technology and people. I read widely, spend as much time as I can around art, music and culture, and play tennis or get to Pilates whenever the calendar allows. Travel keeps me curious; wellness keeps me grounded.",
};
