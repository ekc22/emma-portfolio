import fs from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const dynamic = "force-static";

const size = { width: 1200, height: 630 };

/**
 * Typographic social card, written to /og.png at build time — no photography required.
 * (A real .png file, so GitHub Pages serves it with the right content type.)
 * Fonts: Instrument Serif, SIL Open Font License, bundled in assets/fonts.
 */
export async function GET() {
  const dir = path.join(process.cwd(), "assets", "fonts");
  const [regular, italic] = await Promise.all([
    fs.readFile(path.join(dir, "InstrumentSerif-Regular.ttf")),
    fs.readFile(path.join(dir, "InstrumentSerif-Italic.ttf")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#FBF6EC",
          color: "#3A0E16",
          padding: "64px 80px",
          fontFamily: "Instrument Serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 44, color: "#9B1C2E", textTransform: "uppercase", letterSpacing: -0.5 }}>{site.name}</div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 92, lineHeight: 0.98, letterSpacing: -2 }}>
          <span>A little bit of</span>
          <span style={{ color: "#9B1C2E", fontStyle: "italic" }}>everything.</span>
          <span style={{ paddingLeft: 140 }}>A lot of getting</span>
          <span style={{ paddingLeft: 140 }}>things done.</span>
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#6E5659" }}>{site.tagline} — {site.roles.join(" · ")}</div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Instrument Serif", data: regular, style: "normal", weight: 400 },
        { name: "Instrument Serif", data: italic, style: "italic", weight: 400 },
      ],
    },
  );
}
