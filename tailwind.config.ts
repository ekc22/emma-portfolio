import type { Config } from "tailwindcss";

/**
 * Design tokens — from Emma Clark Brand Guidelines v1.0 (November 2026).
 * Proportions: paper ~70%, oxblood text ~20%, cherry ~10%.
 * Cherry is the accent: the name, links, buttons, selected words.
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#FBF6EC", // ground: pages, cards
        butter: "#F6EBC8", // warm alternate ground
        oxblood: "#3A0E16", // text, headlines, dark sections
        cherry: { DEFAULT: "#9B1C2E", deep: "#7E1424" }, // accent (7.5:1 on paper)
        linen: { DEFAULT: "#EFE6D8", deep: "#E4DACB" }, // borders, placeholders, faded numerals
        muted: { DEFAULT: "#7A6467", ink: "#6E5659" }, // secondary text: 5.1:1 and 6.2:1 on paper
        // Turnout's own blue: used only for Turnout references. Oxblood text 12.3:1, cherry 5.9:1.
        turnout: { DEFAULT: "#C5E3EC", deep: "#A8D2DF" },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "Times New Roman", "serif"],
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "sans-serif"],
      },
      fontSize: {
        "display-xl": ["clamp(3.25rem, 9.2vw, 9.5rem)", { lineHeight: "0.92", letterSpacing: "-0.025em" }],
        "display-lg": ["clamp(2.6rem, 6vw, 6rem)", { lineHeight: "0.98", letterSpacing: "-0.02em" }],
        "display-md": ["clamp(2.1rem, 4vw, 3.75rem)", { lineHeight: "1.04", letterSpacing: "-0.015em" }],
        "display-sm": ["clamp(1.6rem, 2.4vw, 2.25rem)", { lineHeight: "1.12", letterSpacing: "-0.01em" }],
        numeral: ["clamp(5rem, 13vw, 12rem)", { lineHeight: "0.8", letterSpacing: "-0.04em" }],
      },
      maxWidth: { page: "90rem", measure: "36rem" },
      letterSpacing: { label: "0.14em", wordmark: "-0.008em" },
      transitionTimingFunction: { editorial: "cubic-bezier(0.22, 0.61, 0.36, 1)" },
      keyframes: {
        "page-in": { from: { opacity: "0", transform: "translateY(8px)" }, to: { opacity: "1", transform: "none" } },
        "fade-in": { from: { opacity: "0" }, to: { opacity: "1" } },
      },
      animation: { "page-in": "page-in 0.7s cubic-bezier(0.22, 0.61, 0.36, 1) both" },
    },
  },
  plugins: [],
};
export default config;
