import { cn } from "@/lib/cn";
import { courseArtStyles } from "@/components/course-card";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import type { Metadata } from "next";
import { getCourse } from "@oksana/catalog";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LeadForm } from "@/components/lead-form";
import { PracticeArt } from "@/components/practice-art";
import { CourseLanding } from "@/components/course-landing";
import { CurriculumCourse } from "@/components/curriculum-course";

export const dynamic = "force-dynamic";

type CoursePageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: CoursePageProps): Promise<Metadata> {
  const course = getCourse((await params).slug);
  return course
    ? { title: course.title, description: course.summary }
    : { title: "Курс не найден" };
}

export default async function CoursePage({ params }: CoursePageProps) {
  const course = getCourse((await params).slug);
  if (!course) notFound();
  if (course.curriculum) return <CurriculumCourse course={course} />;
  if (course.program) return <CourseLanding course={course} program={course.program} />;

  return (
    <>
      <section className="bg-[#f0ebf3] pt-9 pb-15 md:py-[85px]">
        <Container className="grid gap-8.5 md:grid-cols-[1.1fr_1fr] md:items-center md:gap-[55px]">
          <div>
            <Link
              className="mb-7.5 table min-h-11 content-center text-[13px] text-violet"
              href="/courses"
            >
              ← Все курсы
            </Link>
            <span className="block text-xs-small leading-[1.6] font-bold tracking-[.17em] text-violet">
              КУРС / {course.number}
            </span>
            <h1 className="mx-0 my-5 text-[length:clamp(46px,10vw,78px)]">
              {course.title}
              <span className="text-accent">.</span>
            </h1>
            <p className="m-0 max-w-147.5 text-base leading-[1.8] text-muted">{course.summary}</p>
            <ButtonLink className="mt-[25px]" href="#apply">
              Оставить заявку{" "}
              <span className="text-[length:21px] leading-none font-normal" aria-hidden="true">
                ↗
              </span>
            </ButtonLink>
          </div>
          <div
            className={cn(
              "relative h-80 overflow-hidden rounded-[150px_150px_5px_5px] md:h-97.5 2xl:h-110",
              courseArtStyles[course.accent],
            )}
            aria-hidden="true"
          >
            <PracticeArt variant={course.number} />
            <span className="absolute bottom-6 left-6 text-2xs font-[650] tracking-[.15em]">
              ПРАКТИКА С ОКСАНОЙ ПАЛКИНОЙ
            </span>
          </div>
        </Container>
      </section>
      <section className="py-19.5 md:py-24">
        <Container className="grid gap-[15px] md:grid-cols-[1fr_1fr] md:gap-17.5">
          <div>
            <span className="block text-xs-small leading-[1.6] font-bold tracking-[.17em] text-violet">
              О ПРОГРАММЕ
            </span>
            <h2 className="mx-0 mt-4 mb-5.5 text-[length:clamp(39px,9.4vw,60px)]">
              Что вас <em>ждёт.</em>
            </h2>
          </div>
          <div>
            <p className="text-[17px] leading-[1.8] text-muted">{course.description}</p>
            <div className="mt-7 border-t border-t-line">
              <div className="grid grid-cols-[112px_1fr] gap-[13px] border-b border-b-line px-0 py-5">
                <span className="text-[9px] font-bold tracking-[.1em] text-violet">ФОРМАТ</span>
                <strong className="text-[13px] leading-[1.7] font-[550]">{course.format}</strong>
              </div>
              <div className="grid grid-cols-[112px_1fr] gap-[13px] border-b border-b-line px-0 py-5">
                <span className="text-[9px] font-bold tracking-[.1em] text-violet">
                  ДЛИТЕЛЬНОСТЬ
                </span>
                <strong className="text-[13px] leading-[1.7] font-[550]">{course.duration}</strong>
              </div>
              <div className="grid grid-cols-[112px_1fr] gap-[13px] border-b border-b-line px-0 py-5">
                <span className="text-[9px] font-bold tracking-[.1em] text-violet">ДЛЯ КОГО</span>
                <strong className="text-[13px] leading-[1.7] font-[550]">{course.audience}</strong>
              </div>
            </div>
          </div>
        </Container>
      </section>
      <section className="bg-lavender-soft py-19.5 md:py-24">
        <Container>
          <span className="block text-xs-small leading-[1.6] font-bold tracking-[.17em] text-violet">
            ПОДРОБНЕЕ
          </span>
          <h2 className="mx-0 mt-4 mb-5.5 text-[length:clamp(39px,9.4vw,60px)]">
            Внутри <em>курса.</em>
          </h2>
          <div className="mt-7 grid gap-[15px] md:grid-cols-[repeat(3,1fr)]">
            {course.highlights.map((highlight, index) => (
              <div className="rounded-[5px] bg-[#faf8fb] p-[23px]" key={highlight}>
                <span className="font-serif text-[length:29px] text-accent">0{index + 1}</span>
                <p className="mx-0 mt-5.5 mb-0 text-base leading-[1.8]">{highlight}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>
      <section className="scroll-mt-5 bg-[#eee7ec] py-19.5 md:py-24" id="apply">
        <Container className="grid gap-7 md:grid-cols-[1fr_1fr] md:gap-[55px] 2xl:grid-cols-[1fr_500px]">
          <div>
            <span className="block text-xs-small leading-[1.6] font-bold tracking-[.17em] text-violet">
              СДЕЛАЙТЕ ПЕРВЫЙ ШАГ
            </span>
            <h2 className="mx-0 mt-4 mb-5.5 text-[length:clamp(39px,9.4vw,60px)]">
              Давайте <em>начнём.</em>
            </h2>
            <p className="max-w-92.5 text-base leading-[1.8] text-muted">
              Оставьте контакты, и мы свяжемся с вами, чтобы рассказать о курсе подробнее.
            </p>
            <div
              className="hidden 2xl:mt-10 2xl:block 2xl:[font-family:Georgia,serif] 2xl:text-[length:95px] 2xl:leading-none 2xl:text-[#ab82b3]"
              aria-hidden="true"
            >
              ✳
            </div>
          </div>
          <LeadForm courseSlug={course.slug} courseTitle={course.title} />
        </Container>
      </section>
    </>
  );
}
