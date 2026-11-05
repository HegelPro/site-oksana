import { Container } from "@/components/ui/container";
import type { Metadata } from "next";
import { publishedCourses as courses } from "@oksana/catalog";
import { CourseGrid } from "@/components/course-grid";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Курсы",
  description: "Посмотрите доступные курсы и выберите подходящую программу.",
};

export default function CoursesPage() {
  return (
    <>
      <section className="bg-[#eee8f0] py-[65px] md:py-[85px]">
        <Container>
          <span className="block text-xs-small leading-[1.6] font-bold tracking-[.17em] text-violet">
            ПРОСТРАНСТВО ВАШЕЙ ПРАКТИКИ
          </span>
          <h1 className="mx-0 my-5 text-[length:clamp(46px,10vw,78px)]">
            Курсы для вашего
            <br />
            <em>знакомства с собой.</em>
          </h1>
          <p className="m-0 max-w-147.5 text-base leading-[1.8] text-muted">
            Йога и аюрведа в вашем ритме. Познакомьтесь с программами и оставьте заявку — мы поможем
            с выбором.
          </p>
        </Container>
      </section>
      <section className="py-19.5 md:py-24">
        <Container>
          <div className="mb-7 flex justify-between border-b border-b-line pb-5 text-xs-small font-[650] tracking-[.12em]">
            <span>ВСЕ КУРСЫ</span>
            <span>ДОСТУПНО: {courses.length}</span>
          </div>
          <CourseGrid courses={courses} />
        </Container>
      </section>
    </>
  );
}
