import { CourseContent } from "@/components/course-content";
import { LeadForm } from "@/components/lead-form";
import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { getVisibleCourse } from "@/lib/courses";
import { publicLeadSettings, usesPublicSettings } from "@/lib/site-settings";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

const currency = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 0,
});

type CoursePageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: CoursePageProps): Promise<Metadata> {
  const course = getVisibleCourse((await params).slug);
  if (!course) return { title: "Курс не найден", robots: { index: false, follow: false } };

  return {
    title: course.title,
    description: course.summary,
    ...(course.draft && { robots: { index: false, follow: false } }),
  };
}

export default async function CoursePage({ params }: CoursePageProps) {
  const course = getVisibleCourse((await params).slug);
  if (!course) notFound();
  const settings = publicLeadSettings();
  const formAvailable = !usesPublicSettings() || Boolean(settings);

  const facts = [
    ["Формат", course.format],
    ["Длительность", course.duration],
    ["Даты программы", course.schedule],
    ["Стоимость", course.price === undefined ? undefined : currency.format(course.price)],
  ].filter(([, value]) => value !== undefined);

  return (
    <>
      <header className="border-b border-line bg-lavender py-9 md:py-13">
        <Container
          className={
            course.cover
              ? "grid items-center gap-7 md:grid-cols-[1.12fr_0.88fr] lg:gap-14"
              : undefined
          }
        >
          <div>
            <Link
              href="/courses"
              className="mb-4 inline-flex min-h-11 items-center text-sm font-semibold text-violet hover:underline"
            >
              ← Все курсы
            </Link>
            <h1 className="mb-6 max-w-190 text-[length:clamp(43px,7vw,76px)] text-balance text-plum">
              {course.title}
            </h1>
            {facts.length > 0 && (
              <dl aria-label="Детали курса" className="mb-6 flex flex-wrap gap-x-7 gap-y-3.5">
                {facts.map(([label, value]) => (
                  <div key={label} className="min-w-26">
                    <dt className="mb-1 text-xs text-muted">{label}</dt>
                    <dd className="m-0 text-sm font-semibold">{value}</dd>
                  </div>
                ))}
              </dl>
            )}
            <ButtonLink href="#apply">Узнать о следующем наборе</ButtonLink>
          </div>
          {course.cover && (
            <div className="relative aspect-[5/6] max-h-115 overflow-hidden rounded-xl bg-paper">
              <Image
                src={course.cover.src}
                alt={course.cover.alt}
                fill
                preload
                sizes="(max-width: 699px) 92vw, 42vw"
                className="object-contain"
              />
            </div>
          )}
        </Container>
      </header>

      <CourseContent source={course.body} />

      <section
        id="apply"
        className="border-t border-line bg-sand py-12 md:py-16"
        aria-labelledby="apply-title"
      >
        <Container className="max-w-170">
          <h2 id="apply-title" className="mb-3 text-[length:clamp(36px,5vw,55px)] text-plum">
            Заявка на курс
          </h2>
          {formAvailable ? (
            <>
              <p className="mb-6 text-muted">
                Оставьте контакты, чтобы узнать даты и условия следующего набора.
              </p>
              <LeadForm courseSlug={course.slug} privacyVersion={settings?.privacyVersion} />
            </>
          ) : (
            <p className="mb-0 text-muted">Приём заявок пока закрыт.</p>
          )}
        </Container>
      </section>
    </>
  );
}
