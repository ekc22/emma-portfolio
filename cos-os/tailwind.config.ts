import type { Config } from "tailwindcss";

/**
 * CoS OS design tokens.
 * Warm off-white ground, charcoal and deep navy type, sage / stone / soft grey accents.
 * Semantic RAG colours are kept separate from the accent palette.
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#F7F5F0",
        surface: "#FCFBF8",
        foreground: "#23262B",
        navy: { DEFAULT: "#1C2B3F", soft: "#2E4058" },
        sage: { DEFAULT: "#6F8570", soft: "#E4EAE1", deep: "#4F6551" },
        stone: { DEFAULT: "#A89D88", soft: "#EDE8DE", deep: "#7D725F" },
        muted: { DEFAULT: "#EFEBE3", foreground: "#62666D" },
        border: "#E2DDD2",
        input: "#D9D3C6",
        ring: "#1C2B3F",
        primary: { DEFAULT: "#1C2B3F", foreground: "#F7F5F0" },
        secondary: { DEFAULT: "#EDE8DE", foreground: "#23262B" },
        accent: { DEFAULT: "#E4EAE1", foreground: "#23262B" },
        destructive: { DEFAULT: "#A6463B", foreground: "#FCFBF8" },
        rag: { green: "#4E7D57", amber: "#B07A22", red: "#A6463B", grey: "#8B8F95" },
        ai: { DEFAULT: "#6B5B8C", soft: "#F1EEF6", border: "#C9BFDB" },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
        serif: ["Newsreader", "Georgia", "serif"],
      },
      fontSize: { "2xs": ["0.6875rem", { lineHeight: "1rem" }] },
      borderRadius: { lg: "8px", md: "6px", sm: "4px" },
      boxShadow: { subtle: "0 1px 2px rgba(35,38,43,0.04), 0 1px 1px rgba(35,38,43,0.03)", pop: "0 8px 30px rgba(28,43,63,0.12)" },
      keyframes: { "fade-in": { from: { opacity: "0" }, to: { opacity: "1" } } },
      animation: { "fade-in": "fade-in .15s ease-out" },
    },
  },
  plugins: [],
};
export default config;
