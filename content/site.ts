/**
 * Site-wide configuration: identity, contact and links.
 * This is the one file to edit for name, email, LinkedIn and CV.
 *
 * Nothing here is invented. Empty strings mean "not supplied yet": the related
 * link is hidden, and the contact section says the address is coming soon.
 */
export const site = {
  name: "Emma Clark",
  shortName: "Emma",
  title: "Founder & Strategic Operator",
  tagline: "A little bit of everything. A lot of getting things done.",
  location: "London",
  roles: ["Founder", "Strategic Operator"],
  valueProposition:
    "I work alongside founders and executives to turn ambitious ideas into commercial opportunities, operating systems and measurable execution.",

  /** Public URL, used for canonical links, sitemap and Open Graph. Set NEXT_PUBLIC_SITE_URL in Vercel. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",

  contact: {
    // From the brand guidelines; approved for publication. Phone number deliberately not published.
    email: "emmakatiec@gmail.com",
    // Pre-filled subject lines for the mailto links.
    subjects: {
      general: "Hello from your website",
      fractional: "Fractional support enquiry",
      project: "Project enquiry",
      permanent: "Permanent opportunity",
    },
  },

  links: {
    // Shown in the footer and contact section.
    linkedin: "https://www.linkedin.com/in/emmakclark11",
  },

  /**
   * CV download. Put the file at /public/<path> and the download link appears
   * automatically. Until the file exists the link is not rendered.
   * TODO(Emma): add public/cv/emma-clark-cv.pdf
   */
  cv: { path: "/cv/emma-clark-cv.pdf", label: "Download CV (PDF)" },
} as const;

export const nav = [
  { href: "/about", label: "About" },
  { href: "/work", label: "Work" },
  { href: "/work-with-me", label: "Work With Me" },
  { href: "/currently", label: "Currently" },
  { href: "#contact", label: "Contact" },
] as const;
