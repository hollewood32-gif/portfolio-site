import { describe, expect, it } from "vitest";
import { footerText } from "./footer";

describe("footerText", () => {
  it("shows the given year and the owner's name", () => {
    expect(footerText(2026)).toBe("© 2026 Jeffrey Doughty");
  });
});
