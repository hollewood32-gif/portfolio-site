// Color contrast check: reads the color variables straight from style.css
// (dark mode, and the light-mode overrides) and checks every text/background
// pair the site uses against WCAG AA: at least 4.5 : 1 for normal text.
// Change a color to something hard to read, and this test fails.
import { describe, expect, it } from "vitest";
import css from "./style.css?raw";

// Collects the --name: #hex; variables from the first `:root { ... }` block in the text.
function variables(text: string): Record<string, string> {
  const block = text.match(/:root\s*\{([^}]*)\}/)?.[1] ?? "";
  return Object.fromEntries([...block.matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{6})/g)].map((m) => [m[1], m[2]]));
}

const dark = variables(css);
const lightBlock = css.slice(css.indexOf("@media (prefers-color-scheme: light)"));
const light = { ...dark, ...variables(lightBlock) };

// WCAG's formula for how bright a color looks, then the contrast between two colors.
function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrast(a: string, b: string): number {
  const hi = Math.max(luminance(a), luminance(b));
  const lo = Math.min(luminance(a), luminance(b));
  return (hi + 0.05) / (lo + 0.05);
}

// Every text color on every background it appears on: [text, background].
const pairs: [string, string][] = [
  ["text", "bg"],
  ["muted", "bg"],
  ["muted", "surface"],
  ["text", "surface"],
  ["accent", "bg"],
  ["accent", "surface"],
  ["accent-hover", "bg"],
  ["on-accent", "accent"],
  ["on-accent", "accent-hover"],
];

describe("color contrast (WCAG AA, 4.5 : 1)", () => {
  it("finds the colors in style.css", () => {
    expect(Object.keys(dark).length).toBeGreaterThan(5);
    expect(light.bg).not.toBe(dark.bg);
  });

  for (const [mode, colors] of [["dark", dark], ["light", light]] as const) {
    for (const [fg, bg] of pairs) {
      it(`${mode} mode: --${fg} on --${bg}`, () => {
        const ratio = contrast(colors[fg], colors[bg]);
        expect(ratio, `${colors[fg]} on ${colors[bg]} is only ${ratio.toFixed(2)} : 1`).toBeGreaterThanOrEqual(4.5);
      });
    }
  }
});
