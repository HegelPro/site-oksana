import { CourseGrid } from "@/components/course-grid";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { getPublishedCourses } from "@/lib/courses";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <>
      <section className="bg-lavender py-10 md:py-16">
        <Container className="grid items-center gap-8 md:grid-cols-2 lg:gap-16">
          <div>
            <h1 className="mb-5 max-w-160 text-[length:clamp(46px,7.5vw,88px)] text-balance text-plum">
              Йога и аюрведа с Оксаной Палкиной
            </h1>
            <p className="mb-7 max-w-105 text-muted">
              Онлайн-курсы с йогой, дыхательными упражнениями и медитацией.
            </p>
            <ButtonLink href="#courses">Смотреть курсы</ButtonLink>
          </div>
          <div className="relative aspect-square w-full overflow-hidden rounded-t-[38%] rounded-b-xl bg-sand md:aspect-[7/8] md:max-w-120 md:justify-self-end">
            <Image
              src="/images/oksana-meditation.png"
              alt="Оксана Палкина в позе для медитации"
              data-testid="hero-photo"
              className="object-cover object-[50%_16%] md:object-[50%_26%]"
              fill
              preload
              sizes="(max-width: 699px) 92vw, (max-width: 1040px) 46vw, 480px"
            />
          </div>
        </Container>
      </section>

      <section id="courses" aria-labelledby="courses-title" className="py-14 md:py-20">
        <Container>
          <h2 id="courses-title" className="mb-7 text-[length:clamp(39px,6vw,63px)] text-plum">
            Курсы
          </h2>
          <CourseGrid courses={getPublishedCourses()} heading="h3" />
        </Container>
      </section>

      <section
        id="instructor"
        aria-labelledby="instructor-title"
        className="border-t border-line bg-sand py-12 md:py-15"
      >
        <Container className="flex flex-col items-start gap-6 md:flex-row md:items-center md:gap-9">
          <div className="relative size-32 shrink-0 overflow-hidden rounded-full bg-lavender md:size-39">
            <Image
              src="/images/oksana-balance.png"
              alt="Оксана Палкина показывает асану"
              className="object-cover object-[50%_32%]"
              fill
              sizes="156px"
            />
          </div>
          <div>
            <h2 id="instructor-title" className="mb-3 text-[length:clamp(36px,5vw,53px)] text-plum">
              Об Оксане
            </h2>
            <p className="m-0 max-w-145 text-muted">
              Оксана Палкина — специалист по йоге и аюрведе с 35-летним опытом.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
