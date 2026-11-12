import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Inter } from "next/font/google";
import ContactCTA from "@/components/ContactCTA";
import Footer from "@/components/Footer";
import LogoIntro from "@/components/LogoIntro";
import { hasCv } from "@/lib/cv";
import Navbar from "@/components/Navbar";
import { site } from "@/content/site";
import { withBase } from "@/lib/paths";
import { ogImage } from "@/lib/seo";
import "./globals.css";

const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-serif", display: "swap" });
const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

const description = `${site.tagline} ${site.valueProposition}`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} | ${site.title}`, template: `%s | ${site.name}` },
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_GB",
    siteName: site.name,
    title: `${site.name} | ${site.title}`,
    description,
    url: "/",
    images: [ogImage],
  },
  twitter: { card: "summary_large_image", title: site.name, description, images: [ogImage.url] },
  robots: { index: true, follow: true },
  icons: { icon: withBase("/icon.png"), apple: withBase("/icon.png") },
};

/**
 * Marks JS as available (so scroll reveals can hide content until shown) and,
 * on the first page view of a session, plays the logo intro unless reduced motion is set.
 */
const introScript = `(function(){var d=document.documentElement;d.classList.add('js');try{if(!sessionStorage.getItem('ec-intro')&&!matchMedia('(prefers-reduced-motion: reduce)').matches){d.classList.add('intro');}sessionStorage.setItem('ec-intro','1');}catch(e){}})();`;

export const viewport: Viewport = { themeColor: "#FBF6EC" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${serif.variable} ${sans.variable}`} suppressHydrationWarning>
      <head>
        {/* Lets CSS know JS is running, so scroll reveals never hide content for no-JS visitors. */}
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
      </head>
      <body>
        <LogoIntro />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-oxblood focus:px-4 focus:py-2 focus:text-paper"
        >
          Skip to content
        </a>
        <Navbar cv={hasCv()} />
        <main id="main" tabIndex={-1} className="focus:outline-none">
          {children}
        </main>
        <ContactCTA />
        <Footer />
      </body>
    </html>
  );
}
