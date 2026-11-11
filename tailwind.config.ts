import type { Config } from "tailwindcss";

/**
 * Design tokens — "The World of Emma Clark".
 * Burgundy is an accent: links, hover states, selected typography. Use sparingly.
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ivory: "#F7F4EF",
        charcoal: "#252525",
        burgundy: { DEFAULT: "#713E4B", deep: "#5A303B" },
        stone: { DEFAULT: "#EAE5DE", deep: "#DDD6CC" },
        // #77716D (brief) is 4.38:1 on ivory — fine for large text and rules, not small text.
        muted: { DEFAULT: "#77716D", ink: "#67615D" },
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
      letterSpacing: { label: "0.18em" },
      transitionTimingFunction: { editorial: "cubic-bezier(0.22, 1, 0.36, 1)" },
      keyframes: {
        "page-in": { from: { opacity: "0", transform: "translateY(8px)" }, to: { opacity: "1", transform: "none" } },
      },
      animation: { "page-in": "page-in 0.7s cubic-bezier(0.22, 1, 0.36, 1) both" },
    },
  },
  plugins: [],
};
export default config;
