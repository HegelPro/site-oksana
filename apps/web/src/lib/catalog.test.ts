import { describe, expect, it } from "vitest";
import { getCourse, getCoursePricing } from "@oksana/catalog";
import { parseLead } from "./lead";

const course = getCourse("yoga-ayurveda-inner-calm")!;

describe("course enrollment", () => {
  it("uses early price until the stated deadline", () => {
    expect(getCoursePricing(course, new Date("2026-10-31T23:59:59+04:00"))).toEqual({
      earlyActive: true,
      current: 2999,
    });
  });

  it("does not advertise the expired discount as the current price", () => {
    expect(getCoursePricing(course, new Date("2026-11-01T00:00:00+04:00"))).toEqual({
      earlyActive: false,
      current: 5999,
    });
  });

  it("accepts an application for the published course", () => {
    expect(
      parseLead({
        name: "Анна",
        phone: "+7 999 123-45-67",
        email: "anna@example.com",
        courseSlug: course.slug,
        consent: true,
      }).success,
    ).toBe(true);
  });
});
