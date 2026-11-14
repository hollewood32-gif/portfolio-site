import { describe, expect, it } from "vitest";
import html from "../index.html?raw";
import { emailAddress } from "./contact";

describe("emailAddress", () => {
  it("joins the two halves", () => {
    expect(emailAddress("jeff", "jeffreydoughty.com")).toBe("jeff@jeffreydoughty.com");
  });
});

describe("index.html", () => {
  it("never contains a whole email address (spam bots read the raw HTML)", () => {
    expect(html).not.toMatch(/[\w.+-]+@[\w-]+\.[\w.]+/);
  });

  it("has the email link halves for the Contact section", () => {
    expect(html).toContain('data-user="jeff"');
    expect(html).toContain('data-domain="jeffreydoughty.com"');
  });
});
