import { describe, expect, it } from "vitest";
// "?raw" asks Vite for the file's text instead of treating it as a web page.
import home from "../index.html?raw";
import flingCaseStudy from "../projects/ragdoll-fling/index.html?raw";
import notFound from "../404.html?raw";

// Every page of the site, by the address it's served at. Keep in sync with vite.config.ts.
const pages: Record<string, string> = {
  "/": home,
  "/projects/ragdoll-fling/": flingCaseStudy,
  "/404.html": notFound,
};

describe("404 page", () => {
  // It's served at any wrong address (e.g. /a/b/c), so relative links would break.
  it("only uses links and files that start from the site root or another site", () => {
    for (const url of [...attr(notFound, "href"), ...attr(notFound, "src")]) {
      expect(url, url).toMatch(/^(\/|#|https:\/\/)/);
    }
  });

  it("asks search engines not to list it", () => {
    expect(notFound).toContain('<meta name="robots" content="noindex" />');
  });
});

// Files in public/ are served as-is from the site root (e.g. public/favicon.svg -> /favicon.svg).
const publicFiles = Object.keys(import.meta.glob("../public/*")).map((p) => p.replace("../public", ""));
// Files the build generates (see vite.config.ts).
const generatedFiles = ["/Jeffrey-Doughty-Resume.pdf"];

const attr = (html: string, name: string) =>
  [...html.matchAll(new RegExp(`${name}="([^"]+)"`, "g"))].map((m) => m[1]);

for (const [address, html] of Object.entries(pages)) {
  describe(`page ${address}`, () => {
    it("every same-page link (#something) points to a section that exists", () => {
      for (const id of attr(html, "href").filter((h) => h.startsWith("#")).map((h) => h.slice(1))) {
        expect(html, `missing id="${id}"`).toContain(`id="${id}"`);
      }
    });

    it("every link to another site uses https", () => {
      for (const url of attr(html, "href").filter((h) => h.startsWith("http"))) {
        expect(url).toMatch(/^https:\/\//);
      }
    });

    it("every link and image inside the site points to something that exists", () => {
      const internal = [...attr(html, "href"), ...attr(html, "src")].filter(
        (u) => u.startsWith("/") && !u.startsWith("/src/"),
      );
      for (const url of internal) {
        const [path, hash] = url.split("#");
        if (pages[path] !== undefined) {
          if (hash) expect(pages[path], `${url}: missing id="${hash}"`).toContain(`id="${hash}"`);
        } else {
          expect([...publicFiles, ...generatedFiles], `${url} doesn't exist`).toContain(path);
        }
      }
    });

    it("has exactly one main heading", () => {
      expect(html.match(/<h1[\s>]/g)?.length).toBe(1);
    });
  });
}
