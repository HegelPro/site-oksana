import type { Course } from "@oksana/catalog";
import { CourseCard } from "./course-card";

export function CourseGrid({
  courses,
  heading = "h2",
}: {
  courses: readonly Course[];
  heading?: "h2" | "h3";
}) {
  if (!courses.length) return <p className="text-muted">Сейчас нет опубликованных курсов.</p>;

  return (
    <ul className="grid list-none gap-6 p-0 md:grid-cols-2">
      {courses.map((course) => (
        <li key={course.slug}>
          <CourseCard course={course} heading={heading} />
        </li>
      ))}
    </ul>
  );
}
