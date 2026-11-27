import type { Course } from "@oksana/catalog";
import Image from "next/image";
import Link from "next/link";

export function CourseCard({ course, heading: Heading }: { course: Course; heading: "h2" | "h3" }) {
  const facts = [course.duration, course.schedule].filter(Boolean).join(" · ");

  return (
    <article className="flex h-full min-w-0 flex-col overflow-hidden rounded-xl border border-line bg-paper">
      {course.cover && (
        <div className="relative aspect-[5/3] bg-lavender">
          <Image
            src={course.cover.src}
            alt={course.cover.alt}
            fill
            sizes="(max-width: 699px) 92vw, (max-width: 1240px) 46vw, 585px"
            className="object-contain"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col items-start px-5 py-6 md:p-7">
        {facts && <p className="mb-2 text-sm text-muted">{facts}</p>}
        <Heading className="mt-0 mb-3 text-[length:clamp(29px,4vw,43px)] leading-[1.08] text-balance text-plum">
          {course.title}
        </Heading>
        {course.summary && (
          <p id={`summary-${course.slug}`} className="mb-4 text-[15px] text-muted">
            {course.summary}
          </p>
        )}
        <Link
          className="mt-auto inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-violet underline underline-offset-4"
          aria-describedby={course.summary ? `summary-${course.slug}` : undefined}
          href={`/courses/${course.slug}`}
        >
          Подробнее о курсе <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </article>
  );
}
