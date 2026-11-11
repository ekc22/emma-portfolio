import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Inter } from "next/font/google";
import ContactCTA from "@/components/ContactCTA";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { site } from "@/content/site";
import "./globals.css";

const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-serif", display: "swap" });
const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

const description = `${site.title}. ${site.valueProposition}`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} — ${site.title}`, template: `%s — ${site.name}` },
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: site.name,
    title: `${site.name} — ${site.title}`,
    description,
    url: "/",
  },
  twitter: { card: "summary_large_image", title: site.name, description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { themeColor: "#F7F4EF" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${serif.variable} ${sans.variable}`} suppressHydrationWarning>
      <head>
        {/* Lets CSS know JS is running, so scroll reveals never hide content for no-JS visitors. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-charcoal focus:px-4 focus:py-2 focus:text-ivory"
        >
          Skip to content
        </a>
        <Navbar />
        <main id="main" tabIndex={-1} className="focus:outline-none">
          {children}
        </main>
        <ContactCTA />
        <Footer />
      </body>
    </html>
  );
}
