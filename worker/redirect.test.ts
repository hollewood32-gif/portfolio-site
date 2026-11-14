import { describe, expect, it } from "vitest";
import { wwwRedirect } from "./redirect";

describe("wwwRedirect", () => {
  it("sends www to the main domain, keeping the path and query", () => {
    expect(wwwRedirect("https://www.jeffreydoughty.com/resume.pdf?v=2")).toBe(
      "https://jeffreydoughty.com/resume.pdf?v=2",
    );
  });

  it("upgrades plain http to https", () => {
    expect(wwwRedirect("http://www.jeffreydoughty.com/")).toBe("https://jeffreydoughty.com/");
  });

  it("leaves the main domain alone", () => {
    expect(wwwRedirect("https://jeffreydoughty.com/")).toBeNull();
  });

  it("leaves staging alone", () => {
    expect(wwwRedirect("https://staging.jeffreydoughty.com/")).toBeNull();
  });
});
