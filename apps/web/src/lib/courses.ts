import { parseCourse } from "@oksana/catalog";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const directory = join(process.cwd(), "content", "courses");

function readCatalog() {
  return readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map(({ name }) => parseCourse(name.slice(0, -3), readFileSync(join(directory, name), "utf8")))
    .sort(
      (a, b) =>
        (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER) ||
        a.slug.localeCompare(b.slug),
    );
}

const productionCatalog = process.env.NODE_ENV === "production" ? readCatalog() : undefined;

export function getPublishedCourses() {
  return (productionCatalog ?? readCatalog()).filter((course) => !course.draft);
}

export function getCourse(slug: string) {
  return (productionCatalog ?? readCatalog()).find((course) => course.slug === slug);
}

export function getVisibleCourse(slug: string) {
  const course = getCourse(slug);
  if (process.env.NODE_ENV === "production" && course?.draft) return undefined;
  return course;
}
