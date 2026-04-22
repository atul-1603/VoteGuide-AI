import { journeySteps } from "@/data/journey-steps";

describe("Journey Steps Data", () => {
  it("should have exactly 6 steps", () => {
    expect(journeySteps.length).toBe(6);
  });

  it("should be ordered sequentially", () => {
    journeySteps.forEach((step, index) => {
      expect(step.order).toBe(index + 1);
    });
  });

  it("should contain unique IDs", () => {
    const ids = journeySteps.map(step => step.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });
});
