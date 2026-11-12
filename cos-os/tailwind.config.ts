import type { Config } from "tailwindcss";

/**
 * CoS OS design tokens, from Emma Clark Brand Guidelines v1.0 (November 2026).
 * Paper ground ~70%, oxblood type ~20%, cherry accent ~10%. Butter is the warm
 * alternate ground, linen the rules and borders. Sharp edges, no shadows.
 *
 * Token names are role-based so components never hard-code the palette:
 * `navy` is the accent role (cherry), `sage` positive, `stone` neutral warm.
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#FBF6EC",
        butter: { DEFAULT: "#F6EBC8", deep: "#EEDDAA" },
        oxblood: "#3A0E16",
        cherry: { DEFAULT: "#9B1C2E", deep: "#7E1424" },
        linen: { DEFAULT: "#EFE6D8", deep: "#E4DACB" },

        background: "#FBF6EC",
        surface: "#FFFCF5",
        foreground: "#3A0E16",
        navy: { DEFAULT: "#9B1C2E", soft: "#7E1424" },
        sage: { DEFAULT: "#6E7448", soft: "#ECEAD3", deep: "#4F5530" },
        stone: { DEFAULT: "#B59C86", soft: "#EFE6D8", deep: "#7A6467" },
        muted: { DEFAULT: "#EFE6D8", foreground: "#6E5659" },
        border: "#E4DACB",
        input: "#D8CAB5",
        ring: "#3A0E16",
        primary: { DEFAULT: "#9B1C2E", foreground: "#FBF6EC" },
        secondary: { DEFAULT: "#F6EBC8", foreground: "#3A0E16" },
        accent: { DEFAULT: "#F6EBC8", foreground: "#3A0E16" },
        destructive: { DEFAULT: "#7E1424", foreground: "#FBF6EC" },
        rag: { green: "#5B6B32", amber: "#A86A12", red: "#B8432C", grey: "#9A8A86" },
        ai: { DEFAULT: "#6A2F55", soft: "#F5EAEF", border: "#D9B9CB" },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        serif: ["'Instrument Serif'", "Georgia", "'Times New Roman'", "serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      fontSize: {
        "2xs": ["0.6875rem", { lineHeight: "1rem" }],
        "display-md": ["clamp(2.4rem, 4.2vw, 3.6rem)", { lineHeight: "1", letterSpacing: "-0.015em" }],
        numeral: ["2.5rem", { lineHeight: "1", letterSpacing: "-0.02em" }],
      },
      letterSpacing: { label: "0.14em", wordmark: "-0.008em" },
      borderRadius: { DEFAULT: "0px", lg: "0px", md: "0px", sm: "0px", xl: "0px" },
      boxShadow: { subtle: "none", pop: "0 18px 50px rgba(58,14,22,0.16)" },
      transitionTimingFunction: { editorial: "cubic-bezier(0.22, 0.61, 0.36, 1)" },
      keyframes: {
        "fade-in": { from: { opacity: "0" }, to: { opacity: "1" } },
        "letter-in": { from: { opacity: "0", transform: "translateY(0.35em)" }, to: { opacity: "1", transform: "none" } },
      },
      animation: { "fade-in": "fade-in .2s cubic-bezier(0.22, 0.61, 0.36, 1)" },
    },
  },
  plugins: [],
};
export default config;
