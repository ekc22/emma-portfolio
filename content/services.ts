/**
 * Work With Me content.
 * Deliberately excludes rates, availability claims and testimonials.
 * REVIEW STATUS: draft — needs Emma's approval.
 */
import { site } from "./site";

export type Offering = {
  id: string;
  title: string;
  forWhom: string;
  description: string;
  problems: string[];
  examples: string[];
  subject: string;
};

export const offerings: Offering[] = [
  {
    id: "chief-of-staff",
    title: "Fractional Chief of Staff / Founder’s Office",
    forWhom: "For founders and CEOs",
    description:
      "Hands-on support for a founder or CEO who needs a trusted operator alongside them — without hiring a full-time Chief of Staff yet.",
    problems: [
      "Too many priorities, not enough follow-through",
      "Leadership meetings that don't lead to decisions",
      "No single view of how the business is performing",
      "The founder is the bottleneck for everything",
    ],
    examples: [
      "Setting priorities and an operating cadence",
      "Executive and board reporting",
      "Running cross-functional initiatives",
      "Investor and leadership preparation",
    ],
    subject: site.contact.subjects.fractional,
  },
  {
    id: "growth-commercial",
    title: "Commercial Strategy & Growth Projects",
    forWhom: "For leadership and commercial teams",
    description:
      "A defined piece of commercial work with a clear scope and finish line, delivered by someone who can do the thinking and the doing.",
    problems: [
      "A growth plan that hasn't been turned into actions",
      "Pipeline that's hard to read or forecast",
      "A new partnership or market that needs exploring",
      "Sales teams without the material they need",
    ],
    examples: [
      "Commercial planning",
      "Partnership exploration",
      "Pipeline analysis",
      "Sales enablement",
    ],
    subject: site.contact.subjects.project,
  },
  {
    id: "operations-ai",
    title: "Business Operations & AI Workflows",
    forWhom: "For teams drowning in manual work",
    description:
      "Practical improvements to reporting, processes and workflows — including careful, useful experiments with AI.",
    problems: [
      "Reporting that eats hours every week",
      "Processes that live in one person's head",
      "Curiosity about AI, but no idea where to start safely",
      "Data that exists but nobody can easily see",
    ],
    examples: [
      "Dashboards and reporting",
      "Process design and documentation",
      "AI-assisted workflow pilots",
      "Performance visibility",
    ],
    subject: site.contact.subjects.project,
  },
];

/** Brand system graphic, "The four desks" — from the brand guidelines. */
export const desks = [
  {
    numeral: "I",
    title: "Raise",
    label: "Fundraising support",
    body: "Investor readiness, pitch narrative and deck, data room and the investor process — so the founder can focus on the meetings.",
  },
  {
    numeral: "II",
    title: "Hire",
    label: "Talent & human capital",
    body: "Org design, role scoping, executive and early-team hiring, onboarding.",
  },
  {
    numeral: "III",
    title: "Run",
    label: "Fractional Chief of Staff",
    body: "Operating cadence, board and investor updates, OKRs and the special projects that fall between roles.",
  },
  {
    numeral: "IV",
    title: "Connect",
    label: "Introductions & network",
    body: "Warm, considered introductions to investors, operators, advisers and partners — made only when they help both sides.",
  },
];

/** Required wording from the brand guidelines whenever fundraising support is mentioned. */
export const fundraisingNote =
  "Fundraising support covers preparation and process management. It is not investment advice or arranging deals; any regulated activity stays with authorised firms.";

export const engagementTypes = [
  {
    title: "Fractional",
    body: "Ongoing, part-time support — typically a set number of days a month, working as part of your team.",
  },
  {
    title: "Defined projects",
    body: "A scoped piece of work with clear outcomes and an agreed finish line.",
  },
  {
    title: "Permanent roles",
    body: "I'm open to conversations about the right permanent opportunity — particularly Chief of Staff, strategy, operations and commercial roles in ambitious businesses.",
  },
];

export const process = [
  {
    title: "A conversation",
    body: "Tell me what you're working on and where you're stuck. No pitch, just a useful discussion.",
  },
  {
    title: "A clear scope",
    body: "If there's a fit, I'll suggest how I could help — what, how and over what timeframe.",
  },
  {
    title: "Getting it done",
    body: "We agree the cadence and I get started, keeping progress visible from the first week.",
  },
];
