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
  title: "Strategic Operator | Founder | Commercial Generalist",
  eyebrow: "Strategy / Growth / Operations / Everything in between",
  roles: ["Strategic Operator", "Founder", "Commercial Generalist"],
  valueProposition:
    "Working across strategy, growth, operations and technology to help ambitious businesses turn ideas into execution.",

  /** Public URL, used for canonical links, sitemap and Open Graph. Set NEXT_PUBLIC_SITE_URL in Vercel. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",

  contact: {
    // TODO(Emma): add the email address you want enquiries sent to. Mailto links activate once set.
    email: "",
    // Pre-filled subject lines for the mailto links.
    subjects: {
      general: "Hello from your website",
      fractional: "Fractional support enquiry",
      project: "Project enquiry",
      permanent: "Permanent opportunity",
    },
  },

  links: {
    // TODO(Emma): add your LinkedIn profile URL. Hidden until set.
    linkedin: "",
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
