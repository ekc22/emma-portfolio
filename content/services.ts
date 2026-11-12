/**
 * Work With Me content.
 * Deliberately excludes rates, availability claims and testimonials.
 * REVIEW STATUS: draft — needs Emma's approval.
 */
import { site } from "./site";

export const workWithMe = {
  headline: "Good ideas need people who make them happen.",
  intro: [
    "Sometimes the challenge is growth. Sometimes it’s building the right systems. Sometimes it’s simply that the founder has twenty priorities and not enough hours in the day.",
    "I work with founders and leadership teams to bring commercial thinking, structure and hands-on execution to the things that matter most.",
    "I’ve spent ten years working across finance, strategy, growth and operations, from established businesses to early-stage ventures. I understand the importance of the big picture, but I’m most useful when there’s something tangible to deliver.",
  ],
};

export type Offering = {
  id: string;
  from: string;
  to: string;
  description: string;
  /** Related case study, if any. */
  caseStudy?: string;
  subject: string;
};

/** "Where I can help" — sell the outcome, not the job title. */
export const offerings: Offering[] = [
  {
    id: "ambition-to-execution",
    from: "From ambition",
    to: "to execution",
    description: "Turning strategic priorities into clear plans, operating rhythms, measurable progress and accountable delivery.",
    caseStudy: "making-strategy-everyones-business",
    subject: site.contact.subjects.project,
  },
  {
    id: "product-to-traction",
    from: "From product",
    to: "to commercial traction",
    description: "Owning go-to-market end to end: building the go-to-market strategy, shaping propositions, understanding markets, prioritising customers and moving commercial opportunities forward.",
    caseStudy: "finding-a-market-before-the-playbook",
    subject: site.contact.subjects.project,
  },
  {
    id: "manual-to-systems",
    from: "From manual work",
    to: "to better systems",
    description: "Building dashboards, reporting processes, practical AI workflows and operational infrastructure that give teams more time to focus on what matters.",
    caseStudy: "less-reporting-more-thinking",
    subject: site.contact.subjects.project,
  },
  {
    id: "bottleneck-to-momentum",
    from: "From founder bottleneck",
    to: "to forward momentum",
    description: "Working alongside founders on the projects, decisions, investor materials and cross-functional priorities that need a trusted pair of hands, including an agentic Chief of Staff, pipeline tracking, investor finding and project management systems built in Claude.",
    caseStudy: "circus-capital",
    subject: site.contact.subjects.fractional,
  },
];

/** Brand system graphic, "The four desks" — from the brand guidelines. */
export const desks = [
  {
    numeral: "I",
    title: "Raise",
    label: "Fundraising support",
    body: "Investor readiness, pitch narrative and deck, data room and the investor process, so the founder can focus on the meetings.",
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
    body: "Warm, considered introductions to investors, operators, advisers and partners, made only when they help both sides.",
  },
];

/** Required wording from the brand guidelines whenever fundraising support is mentioned. */
export const fundraisingNote =
  "Fundraising support covers preparation and process management. It is not investment advice or arranging deals; any regulated activity stays with authorised firms.";

export const waysToWork = {
  intro:
    "I’m interested in fractional Chief of Staff and growth engagements, defined strategic or operational projects, and the right permanent opportunities with ambitious businesses.",
  emphasis: "I’m particularly drawn to founder-led teams where there’s ownership, pace and an opportunity to build.",
  types: [
    { title: "Fractional", body: "Chief of Staff and growth engagements: ongoing, part-time and embedded in your team.", subject: site.contact.subjects.fractional },
    { title: "Defined projects", body: "Strategic or operational work with a clear scope and an agreed finish line.", subject: site.contact.subjects.project },
    { title: "Permanent", body: "The right permanent opportunity with an ambitious business.", subject: site.contact.subjects.permanent },
  ],
};

export const process = [
  {
    title: "A conversation",
    body: "Tell me what you're working on and where you're stuck. No pitch, just a useful discussion.",
  },
  {
    title: "A clear scope",
    body: "If there's a fit, I'll suggest how I could help: what, how and over what timeframe.",
  },
  {
    title: "Getting it done",
    body: "We agree the cadence and I get started, keeping progress visible from the first week.",
  },
];
