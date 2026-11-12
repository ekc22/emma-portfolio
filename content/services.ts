/**
 * Work With Me content.
 * Deliberately excludes rates, availability claims and testimonials.
 * House style: no em dashes in visible copy.
 */
import { site } from "./site";

export const workWithMe = {
  headline: "From ambitious ideas to meaningful progress.",
  intro: [
    "I work alongside founders and leadership teams on the commercial, strategic and operational priorities that move a business forward.",
    "My experience combines the discipline of established businesses with the adaptability required in early-stage ventures.",
    "I enjoy working across the big picture and the detail: shaping priorities, building systems and taking ownership of execution.",
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

/** Three areas of support. */
export const offerings: Offering[] = [
  {
    id: "growth-go-to-market",
    title: "Growth & Go-to-Market",
    description: "Helping businesses move from commercial ideas to tangible market opportunities.",
    areas: [
      "Market research and segmentation",
      "Commercial positioning",
      "Go-to-market planning",
      "Pricing and proposition development",
      "Strategic partnerships",
      "Customer pipeline and opportunity progression",
      "Early commercial traction",
    ],
    caseStudies: ["finding-a-market-before-the-playbook", "when-youre-the-one-building-it"],
    subject: site.contact.subjects.project,
  },
  {
    id: "founders-office",
    title: "Founder’s Office & Strategic Execution",
    description: "Helping founders and leadership teams turn priorities into accountable execution.",
    areas: [
      "Strategic planning and prioritisation",
      "Executive operating cadence",
      "Cross-functional initiatives",
      "Founder and CEO special projects",
      "Investor and Board materials",
      "Management reporting",
      "Project delivery and follow-through",
    ],
    caseStudies: ["making-strategy-everyones-business", "circus-capital"],
    subject: site.contact.subjects.fractional,
  },
  {
    id: "ai-business-operations",
    title: "AI & Business Operations",
    description: "Building practical systems that help businesses operate more intelligently.",
    areas: [
      "Executive dashboards",
      "Reporting automation",
      "AI-assisted workflows",
      "Claude agents and operational tools",
      "Performance visibility",
      "Business process improvement",
      "Project and decision tracking",
    ],
    caseStudies: ["cos-os", "circus-capital"],
    subject: site.contact.subjects.project,
  },
];

export const waysToWork = {
  emphasis: "I’m particularly drawn to founder-led businesses where I can combine commercial thinking with hands-on ownership.",
  types: [
    { title: "Fractional engagements", subject: site.contact.subjects.fractional },
    { title: "Defined commercial or operational projects", subject: site.contact.subjects.project },
    { title: "Permanent Chief of Staff, Founder’s Office, strategy and operations roles", subject: site.contact.subjects.permanent },
    { title: "Collaborations with ambitious founders and teams", subject: site.contact.subjects.general },
  ],
};
