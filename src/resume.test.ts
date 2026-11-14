import { describe, expect, it } from "vitest";
import { resume } from "./resume-data";
import { escapeHtml, resumeHtml } from "./resume-html";
import { resumePdf } from "./resume-pdf";

describe("resume data", () => {
  it("never contains a phone number", () => {
    // Catches things like 714-555-0100, (714) 555 0100 or 714.555.0100.
    expect(JSON.stringify(resume)).not.toMatch(/\(?\d{3}\)?[-. ]\d{3}[-. ]\d{4}/);
  });
});

describe("resumeHtml", () => {
  it("escapes characters that would break the page", () => {
    expect(escapeHtml('<b>"Tom & Jerry"</b>')).toBe("&lt;b&gt;&quot;Tom &amp; Jerry&quot;&lt;/b&gt;");
  });

  it("includes every job and project", () => {
    const html = resumeHtml(resume);
    for (const e of [...resume.experience, ...resume.projects]) {
      expect(html).toContain(escapeHtml(e.title));
    }
  });
});

describe("resumePdf", () => {
  it("makes a real PDF file", async () => {
    const bytes = await resumePdf(resume);
    // Every PDF file starts with the characters "%PDF-".
    expect(new TextDecoder().decode(bytes.slice(0, 5))).toBe("%PDF-");
    expect(bytes.length).toBeGreaterThan(1000);
  });
});
