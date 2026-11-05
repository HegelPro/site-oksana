import { getCoursePricing, type Course } from "@oksana/catalog";
import Link from "next/link";
import Image from "next/image";
import { PracticeArt } from "./practice-art";
import { cn } from "@/lib/cn";

// Keep complete class names so Tailwind discovers every catalogue variant.
export const courseArtStyles = {
  peach: "bg-[#e8dfee] text-[#825c94]",
  lilac: "bg-[#e6e8db] text-[#7e8667]",
  mint: "bg-[#eedfdf] text-[#a77981]",
} satisfies Record<Course["accent"], string>;

export function CourseCard({ course }: { course: Course }) {
  const pricing = getCoursePricing(course);
  return (
    <article
      className={cn(
        "min-w-0 overflow-hidden rounded-[7px] border border-[#e5dfe6] bg-paper transition-[box-shadow,translate] duration-[250ms] hover:-translate-y-1 hover:shadow-[0_15px_40px_#4b285d0c] motion-reduce:transition-none motion-reduce:hover:translate-y-0",
        course.image && "md:grid md:grid-cols-[minmax(240px,.8fr)_1.4fr] xl:grid-cols-[330px_1fr]",
      )}
    >
      {course.image ? (
        <Link href={`/courses/${course.slug}`} className="block bg-[#eee5d6]">
          <Image
            className="block h-auto w-full"
            {...course.image}
            alt={course.image.alt}
            sizes="(max-width: 699px) 90vw, 340px"
          />
        </Link>
      ) : (
        <div
          className={cn("relative h-[235px] 2xl:h-[255px]", courseArtStyles[course.accent])}
          aria-hidden="true"
        >
          <PracticeArt variant={course.number} />
          <span className="absolute bottom-[17px] left-[19px] text-[9px] font-[650] tracking-[.12em]">
            ПРОГРАММА {course.number}
          </span>
          <span className="absolute top-[17px] right-[17px] rounded-full border border-current px-3 py-[5px] text-xs-small">
            Скоро
          </span>
        </div>
      )}
      <div
        className={cn(
          "p-[25px]",
          course.image && "md:self-center md:p-[38px] xl:px-15 xl:py-[45px]",
        )}
      >
        <span className="block text-[9px] leading-[1.6] font-bold tracking-[.13em] text-muted">
          {course.schedule ? `${course.schedule} · ОНЛАЙН` : "ВРЕМЯ ДЛЯ ПРАКТИКИ"}
        </span>
        <h3
          className={cn(
            "my-3 text-4xl leading-[1.1]",
            course.image && "text-balance md:text-[40px] xl:max-w-[650px] xl:text-5xl",
          )}
        >
          {course.title}
        </h3>
        <p
          className={cn(
            "mb-[15px] min-h-20 text-[15px] leading-[1.8] text-muted md:text-sm 2xl:min-h-21",
            course.image && "min-h-0 md:text-[15px] xl:max-w-[590px] xl:text-base 2xl:min-h-0",
          )}
        >
          {course.summary}
        </p>
        {pricing.current !== undefined && (
          <div className="mt-[23px] mb-[13px] text-2xl font-semibold text-plum">
            {new Intl.NumberFormat("ru-RU").format(pricing.current)} ₽{" "}
            <span className="text-xs font-[450] text-muted">за курс</span>
          </div>
        )}
        <Link
          className="inline-flex min-h-11 items-center gap-4 border-b border-[#ac8fba] py-[5px] text-[13px] font-[650] text-violet hover:text-[#9e587e]"
          href={`/courses/${course.slug}`}
        >
          Подробнее о курсе{" "}
          <span className="text-[22px]" aria-hidden="true">
            ↗
          </span>
        </Link>
      </div>
    </article>
  );
}
