import type { Course } from "@oksana/catalog";
import { cn } from "@/lib/cn";
import { CourseCard } from "./course-card";

export function CourseGrid({ courses }: { courses: readonly Course[] }) {
  return (
    <div
      className={cn(
        "grid gap-5.5",
        courses.length > 1 &&
          !courses.some((course) => course.image) &&
          "md:grid-cols-2 2xl:grid-cols-3",
      )}
    >
      {courses.map((course) => (
        <CourseCard key={course.slug} course={course} />
      ))}
    </div>
  );
}
