import type { Metadata } from "next";
import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "./globals.css";

export const viewport = { themeColor: "#FBF6EC" };

export const metadata: Metadata = {
  title: { default: "CoS OS", template: "%s · CoS OS" },
  description: "CoS OS: an AI Chief of Staff operating system. Less reporting. More thinking.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB">
      <body>{children}</body>
    </html>
  );
}
