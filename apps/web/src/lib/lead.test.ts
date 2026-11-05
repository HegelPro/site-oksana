import { describe, expect, it } from "vitest";
import { parseLead } from "./lead";

const validLead = {
  name: "Анна",
  phone: "+7 999 123-45-67",
  email: "anna@example.com",
  courseSlug: "course-01",
  consent: true,
  website: "",
};

describe("parseLead", () => {
  it("accepts a complete application", () => {
    expect(parseLead(validLead).success).toBe(true);
  });

  it.each([
    ["missing name", { name: "" }],
    ["invalid phone", { phone: "abc" }],
    ["invalid email", { email: "not-an-email" }],
    ["unknown course", { courseSlug: "missing" }],
    ["missing consent", { consent: false }],
  ])("rejects %s", (_label, change) => {
    expect(parseLead({ ...validLead, ...change }).success).toBe(false);
  });
});
