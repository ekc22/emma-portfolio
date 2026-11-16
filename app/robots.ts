import type { MetadataRoute } from "next";

/**
 * The site is shared by link only. Search engines may fetch pages so they can read the
 * "noindex" tag on each one (blocking them here would hide that tag), but the CV and images
 * are off limits, and AI crawlers and AI search tools are refused entirely. No sitemap.
 */
const aiBots = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "anthropic-ai",
  "CCBot",
  "Google-Extended",
  "PerplexityBot",
  "Perplexity-User",
  "Bytespider",
  "Amazonbot",
  "Applebot-Extended",
  "meta-externalagent",
  "cohere-ai",
  "Diffbot",
  "YouBot",
];

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: aiBots, disallow: "/" },
      { userAgent: "*", allow: "/", disallow: ["/cv/", "/images/"] },
    ],
  };
}
