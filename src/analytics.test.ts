import { describe, expect, it } from "vitest";
import { shouldTrack } from "./analytics";

describe("shouldTrack", () => {
  it("counts visits on the real site", () => {
    expect(shouldTrack("jeffreydoughty.com")).toBe(true);
  });

  it("ignores staging, PR previews and local testing", () => {
    expect(shouldTrack("staging.jeffreydoughty.com")).toBe(false);
    expect(shouldTrack("pr-14-portfolio-staging.ragdoll-fling.workers.dev")).toBe(false);
    expect(shouldTrack("portfolio.ragdoll-fling.workers.dev")).toBe(false);
    expect(shouldTrack("localhost")).toBe(false);
  });
});
