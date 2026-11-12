import fs from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

export const dynamic = "force-static";

/**
 * Monogram "E." — paper on a cherry tile (brand guidelines §01/§05).
 * Built to /icon.png; used as favicon and Apple touch icon.
 */
export async function GET() {
  const font = await fs.readFile(path.join(process.cwd(), "assets", "fonts", "InstrumentSerif-Regular.ttf"));
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#9B1C2E",
          color: "#FBF6EC",
          fontFamily: "Instrument Serif",
          fontSize: 330,
          paddingTop: 30,
          letterSpacing: -6,
        }}
      >
        E.
      </div>
    ),
    { width: 512, height: 512, fonts: [{ name: "Instrument Serif", data: font, style: "normal", weight: 400 }] },
  );
}
