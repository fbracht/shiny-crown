import { describe, expect, it } from "vitest";
import { applicableCopy, phaseCopy } from "./phases";

describe("localization-ready foundation content", () => {
  it("switches the Family action count by mode", () => {
    expect(applicableCopy("round.family", "solo")).toContain(
      "The Crown takes two normal Family actions.",
    );
    expect(applicableCopy("round.family", "two-player")).toContain(
      "The Crown takes one normal Family action.",
    );
  });

  it("provides mode replacements for Parliament, Refresh, and scoring", () => {
    expect(applicableCopy("round.parliament", "two-player").join(" ")).toMatch(
      /clockwise voting rounds/u,
    );
    expect(applicableCopy("round.upkeep-refresh", "two-player").join(" ")).toMatch(/Do not apply/u);
    expect(applicableCopy("game.scoring", "two-player").join(" ")).toMatch(
      /first and second Power/u,
    );
  });

  it("retains provenance for every phase", () => {
    for (const copy of Object.values(phaseCopy)) {
      expect(copy.sources.length).toBeGreaterThan(0);
      expect(copy.sources.every((source) => source.pages.length > 0)).toBe(true);
    }
  });
});
