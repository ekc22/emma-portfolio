import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "@fontsource/newsreader/400.css";
import "@fontsource/newsreader/500.css";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "CoS OS", template: "%s · CoS OS" },
  description: "CoS OS: an AI Chief of Staff operating system. Less reporting. More thinking.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
