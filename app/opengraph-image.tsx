import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const alt = `${site.name} — ${site.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Typographic social card — no photography required. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#F7F4EF",
          color: "#252525",
          padding: "72px 80px",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 22, letterSpacing: 6, textTransform: "uppercase", fontFamily: "sans-serif" }}>
          {site.name}
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 84, lineHeight: 1 }}>
          <span>A little bit of</span>
          <span style={{ color: "#713E4B", fontStyle: "italic" }}>everything.</span>
          <span>A lot of getting things done.</span>
        </div>
        <div style={{ display: "flex", fontSize: 24, color: "#67615D", fontFamily: "sans-serif" }}>{site.title}</div>
      </div>
    ),
    size,
  );
}
