// Accessibility check: runs axe-core (the industry-standard accessibility
// checker) on every page of the site, and fails if it finds any problem, such as
// an image without a text alternative, a link with no name, a skipped heading
// level, a missing page language or a form field without a label.
//
// Pages are loaded into jsdom, a lightweight fake browser. jsdom doesn't draw
// anything, so axe can't measure color contrast here; contrast.test.ts covers that.
import axe from "axe-core";
import { JSDOM } from "jsdom";
import { describe, expect, it } from "vitest";
import home from "../index.html?raw";
import flingCaseStudy from "../projects/ragdoll-fling/index.html?raw";
import notFound from "../404.html?raw";
import { resume } from "./resume-data";
import { resumeHtml } from "./resume-html";

const pages: Record<string, string> = {
  // The build fills in the resume section, so check the page as visitors get it.
  "/": home.replace("<!-- resume:content -->", resumeHtml(resume)),
  "/projects/ragdoll-fling/": flingCaseStudy,
  "/404.html": notFound,
};

async function axeViolations(html: string) {
  const dom = new JSDOM(html, { runScripts: "outside-only", pretendToBeVisual: true });
  // Load axe into the fake page, then run it there.
  dom.window.eval(axe.source);
  const result: axe.AxeResults = await (dom.window as unknown as { axe: typeof axe }).axe.run(
    dom.window.document,
    {
      // jsdom can't render colors; contrast.test.ts checks contrast instead.
      rules: { "color-contrast": { enabled: false } },
      // WCAG 2.2 A and AA, plus axe's best-practice rules (e.g. landmarks, one h1).
      runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"] },
    },
  );
  dom.window.close();
  // A short, readable summary of each problem, for the test failure message.
  return result.violations.map(
    (v) => `${v.id} (${v.impact}): ${v.help}\n    at ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`,
  );
}

describe("accessibility (axe-core)", () => {
  for (const [address, html] of Object.entries(pages)) {
    it(`page ${address} has no accessibility problems`, async () => {
      expect(await axeViolations(html)).toEqual([]);
    });
  }
});
