/**
 * Work With Me content.
 * Deliberately excludes rates, availability claims and testimonials.
 * House style: no em dashes in visible copy.
 */
import { site } from "./site";

export const workWithMe = {
  headline: "Good ideas need people who make them happen.",
  intro: [
    "I work best alongside ambitious founders and leadership teams, bringing together commercial judgement, strategic thinking and hands-on execution.",
    "I’m comfortable moving between the big picture and the detail, from helping shape priorities and commercial opportunities to building the systems and processes that make execution possible.",
    "I’m particularly interested in high-ownership roles where I can operate across functions, solve ambiguous problems and help a business move faster.",
  ],
};

export type Offering = {
  id: string;
  title: string;
  description: string;
  areas: string[];
  /** Related case studies (slugs), shown as proof. */
  caseStudies: string[];
  subject: string;
};

/** Three areas Emma can own. */
export const offerings: Offering[] = [
  {
    id: "founders-office",
    title: "Founder’s Office & Strategic Execution",
    description: "Helping founders and leadership teams turn priorities into accountable execution.",
    areas: [
      "Strategic priorities",
      "Company operating cadence",
      "Cross-functional delivery",
      "Special projects",
      "Executive and Board materials",
      "Performance visibility",
      "Decision-making and follow-through",
    ],
    caseStudies: ["making-strategy-everyones-business", "circus-capital"],
    subject: site.contact.subjects.permanent,
  },
  {
    id: "commercial-growth",
    title: "Commercial Strategy & Growth",
    description: "Moving from commercial ideas to tangible market opportunities.",
    areas: [
      "Market analysis",
      "Commercial positioning",
      "Go-to-market strategy",
      "Partnerships",
      "Pipeline development",
      "Pricing and propositions",
      "Growth initiatives",
    ],
    caseStudies: ["finding-a-market-before-the-playbook", "when-youre-the-one-building-it"],
    subject: site.contact.subjects.permanent,
  },
  {
    id: "ai-business-operations",
    title: "AI & Business Operations",
    description: "Building practical infrastructure that helps a business operate more intelligently.",
    areas: [
      "Executive dashboards",
      "Reporting automation",
      "Operational workflows",
      "AI-assisted systems",
      "Project tracking",
      "Internal tools",
      "Business performance visibility",
    ],
    caseStudies: ["cos-os", "making-strategy-everyones-business"],
    subject: site.contact.subjects.permanent,
  },
];
