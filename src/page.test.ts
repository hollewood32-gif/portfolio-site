import { describe, expect, it } from "vitest";
// "?raw" asks Vite for the file's text instead of treating it as a web page.
import html from "../index.html?raw";

describe("index.html", () => {
  it("every in-page link (#something) points to a section that exists", () => {
    const targets = [...html.matchAll(/href="#([^"]+)"/g)].map((m) => m[1]);
    expect(targets.length).toBeGreaterThan(0);
    for (const id of targets) {
      expect(html, `missing id="${id}"`).toContain(`id="${id}"`);
    }
  });

  it("every link that opens another site uses https", () => {
    const external = [...html.matchAll(/href="(http[^"]*)"/g)].map((m) => m[1]);
    for (const url of external) {
      expect(url).toMatch(/^https:\/\//);
    }
  });
});
