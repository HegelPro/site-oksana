import { describe, expect, it } from "vitest";
import { parseCourse } from "@oksana/catalog";
import { getCourse, getPublishedCourses } from "./courses";
import { parseLead } from "./lead";

describe("course files", () => {
  it("renders a course with just a title and Markdown", () => {
    const body = "## Занятия\r\n\r\nПрограмма курса.\r\n";
    const source = ["---", "title: Утренняя йога", "---", body].join("\r\n");

    expect(parseCourse("morning-yoga", `\uFEFF${source}`)).toEqual({
      slug: "morning-yoga",
      title: "Утренняя йога",
      draft: false,
      body,
    });
  });

  it("names the file when its fields are invalid", () => {
    expect(() => parseCourse("morning-yoga", "---\nprice: бесплатно\n---\n")).toThrow(
      "Ошибка в файле курса morning-yoga.md",
    );
  });

  it("lists the existing courses in order and hides drafts", () => {
    const expected = ["yoga-ayurveda-inner-calm", "yoga-ayurveda-14-days"];
    const courses = getPublishedCourses();
    expect(courses.map((course) => course.slug).filter((slug) => expected.includes(slug))).toEqual(
      expected,
    );
    expect(courses.some((course) => course.draft)).toBe(false);
    expect(getCourse("course-01")?.draft).toBe(true);
  });
});

describe("course enrollment", () => {
  it.each(["yoga-ayurveda-inner-calm", "yoga-ayurveda-14-days"])(
    "accepts an application for %s",
    (courseSlug) => {
      expect(
        parseLead({
          name: "Анна",
          phone: "+7 999 123-45-67",
          email: "anna@example.com",
          courseSlug,
          consent: true,
        }).success,
      ).toBe(true);
    },
  );
});
