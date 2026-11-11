/**
 * Case studies. Each entry generates a page at /work/[slug].
 *
 * Editorial rules (please keep):
 *  - Qualitative copy only until Emma approves verified metrics.
 *  - `myRole` is what Emma personally did. `teamOutcomes` is what the wider
 *    team achieved together. Never merge the two.
 *  - No employer or client names unless Emma confirms they can be published.
 *  - `status: "draft"` shows an "awaiting approval" note in `npm run dev` only.
 */

export type ProjectImage = { src: string; alt: string; width: number; height: number };

export type Project = {
  slug: string;
  title: string;
  category: string;
  summary: string;
  /** Short descriptor of the setting, without naming the business. */
  context: string;
  timeframe?: string; // TODO(Emma): add if you want dates shown.
  challenge: string;
  approach: string[];
  /** Emma's personal contribution. */
  myRole: string[];
  /** Results delivered by the wider team (qualitative until verified). */
  teamOutcomes?: string[];
  reflection?: string;
  image?: ProjectImage;
  /** Describes the image that should go here, shown on the placeholder until a real one is added. */
  imageBrief: string;
  featured: boolean;
  status: "draft" | "approved";
};

export const projects: Project[] = [
  {
    slug: "executive-operating-rhythm",
    imageBrief: "Working session, whiteboard or planning materials (no confidential content)",
    title: "Turning strategy into execution",
    category: "Strategy & Operations",
    summary:
      "Executive priorities, commercial initiatives and operating rhythms within a PE-backed business.",
    context: "PE-backed wealth management business",
    challenge:
      "A growing, investor-backed business needed its strategic priorities to connect more clearly with reporting, governance and day-to-day execution — so the leadership team could see progress, spot risks early and make decisions with confidence.",
    approach: [
      "Mapped leadership priorities into a single, trackable set of initiatives with clear owners.",
      "Set up a regular operating cadence so priorities, risks and actions were reviewed consistently.",
      "Designed executive reporting that brought commercial and operational information into one view.",
    ],
    myRole: [
      "Coordinated cross-functional initiatives on behalf of the executive team",
      "Built executive reporting and dashboards",
      "Tracked priorities, risks and actions through the operating cadence",
    ],
    teamOutcomes: [
      // TODO(Emma): replace with verified, publishable outcomes — or remove.
      "Clearer line of sight from strategic priorities to delivery",
      "A more consistent rhythm for leadership reviews and decisions",
    ],
    reflection:
      "Most of the value came from making things visible. Once priorities and risks were written down in one place, conversations got shorter and decisions got easier.",
    featured: true,
    status: "draft",
  },
  {
    slug: "ai-assisted-reporting",
    imageBrief: "Screenshot of an anonymised dashboard or agent workflow",
    title: "Making reporting more intelligent",
    category: "AI & Automation",
    summary:
      "Dashboards, AI agents and workflow automation designed to improve how businesses operate.",
    context: "Reporting and operations workflows",
    challenge:
      "Reporting took too much manual effort, and getting a straight answer from business information often meant waiting on someone to pull it together.",
    approach: [
      "Started with the dashboards people already relied on and simplified what they needed to see.",
      "Ran small, contained experiments with Claude agents on repetitive reporting and research tasks.",
      "Kept the workflows that saved real time and documented them so they could be repeated.",
    ],
    myRole: [
      "Developed reporting dashboards",
      "Built and experimented with Claude agents",
      "Explored repeatable automation workflows",
    ],
    teamOutcomes: [
      // TODO(Emma): add verified outcomes, e.g. time saved, once you're happy to publish them.
    ],
    reflection:
      "The best AI experiments were the boring ones: a clear, repetitive task, a human checking the output, and a simple way to measure whether it helped.",
    featured: true,
    status: "draft",
  },
  {
    slug: "sports-community-venture",
    imageBrief: "Photograph from a community or sports event",
    title: "Building something from scratch",
    category: "Founder Projects",
    summary:
      "Founding a sports and community platform and exploring what it takes to turn an idea into a venture.",
    context: "Early-stage founder project",
    challenge:
      "Exploring how to bring people together through sport and shared interests — and whether that could become a sustainable business.",
    approach: [
      "Developed the concept and tested the proposition with potential members.",
      "Shaped the community model: who it is for, why they would join, and why they would stay.",
      "Prioritised ruthlessly across product, partnerships and operations with very limited resources.",
    ],
    myRole: [
      "Founded the venture and developed the concept",
      "Explored the proposition and community model",
      "Worked across early-stage business priorities",
    ],
    reflection:
      "Founding taught me to test cheaply, decide quickly and stay honest about what's working. I bring that mindset to every business I work with.",
    // TODO(Emma): add the venture's name and a link only if you'd like them public.
    featured: true,
    status: "draft",
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
export const featuredProjects = projects.filter((p) => p.featured).slice(0, 3);
