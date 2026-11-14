// Turns the SVG artwork into the PNG files that need to be PNGs:
//   art/og-image.svg   -> public/og-image.png          (1200x630 link preview card)
//   public/favicon.svg -> public/apple-touch-icon.png  (180x180 iPhone home-screen icon)
//
// Run with:  npm run images   (npm.cmd run images in Windows PowerShell)
// Only needed after changing the artwork; the PNGs are committed to the repo.

import { readFileSync, writeFileSync } from "node:fs";
import { Resvg } from "@resvg/resvg-js";

const jobs = [
  { from: "art/og-image.svg", to: "public/og-image.png", width: 1200 },
  { from: "public/favicon.svg", to: "public/apple-touch-icon.png", width: 180 },
];

for (const { from, to, width } of jobs) {
  const svg = readFileSync(from, "utf8");
  const png = new Resvg(svg, {
    fitTo: { mode: "width", value: width },
    // Uses this computer's installed fonts for any text in the artwork.
    font: { loadSystemFonts: true, defaultFontFamily: "Segoe UI" },
  })
    .render()
    .asPng();
  writeFileSync(to, png);
  console.log(`${from} -> ${to} (${png.length.toLocaleString()} bytes)`);
}
