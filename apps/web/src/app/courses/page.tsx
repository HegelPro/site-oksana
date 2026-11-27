import { CourseGrid } from "@/components/course-grid";
import { Container } from "@/components/ui/container";
import { getPublishedCourses } from "@/lib/courses";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Курсы",
  description: "Курсы йоги и аюрведы Оксаны Палкиной.",
};

export default function CoursesPage() {
  return (
    <Container className="py-12 md:py-17">
      <h1 className="mb-8 text-[length:clamp(46px,9vw,77px)] text-plum">Курсы</h1>
      <CourseGrid courses={getPublishedCourses()} />
    </Container>
  );
}
