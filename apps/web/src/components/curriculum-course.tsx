import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import Image from "next/image";
import Link from "next/link";
import type { Course } from "@oksana/catalog";
import { LeadForm } from "./lead-form";

export function CurriculumCourse({ course }: { course: Course }) {
  if (!course.curriculum) return null;
  return (
    <div>
      <section className="pt-5.5 pb-[55px] [background:radial-gradient(ellipse_at_100%_0,#e7deea88,transparent_65%),var(--color-cream)] md:pt-9.5 md:pb-[65px]">
        <Container className="grid items-center gap-[35px] md:grid-cols-[1.15fr_1fr] md:gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-15">
          <div className="min-w-0">
            <Link
              href="/courses"
              className="mb-5 table min-h-11 content-center text-[13px] text-violet xl:mb-6.5"
            >
              ← Все курсы
            </Link>
            <span className="block text-xs-small leading-[1.6] font-bold tracking-[.17em] text-violet">
              ОНЛАЙН-КУРС · ПОДРОБНАЯ ПРОГРАММА
            </span>
            <p className="mx-0 mt-[23px] mb-4 font-serif text-2xl leading-[1.25] text-accent italic md:text-[length:23px] xl:text-[length:26px]">
              14 дней заботы о себе,
              <br />
              наполненных мудростью Востока.
            </p>
            <h1 className="mx-0 mt-0 mb-6 text-[length:clamp(40px,10vw,64px)] leading-[1.02] text-balance text-plum md:text-5xl xl:text-[length:64px]">
              {course.title}
            </h1>
            <p className="max-w-140 text-base leading-[1.8] text-muted">
              Йога, дыхательные техники, аюрведа и даосские практики. Знакомимся со своим
              состоянием, учимся замечать эмоции и возвращаться к внутреннему балансу.
            </p>
            <ul
              data-testid="enrollment-facts"
              className="mx-0 my-6 flex list-none flex-wrap gap-[9px] p-0"
              aria-label="Коротко о курсе"
            >
              <li className="rounded-3xl border border-[#d6c8dc] px-3 py-[7px] text-xs text-plum">
                {course.schedule}
              </li>
              <li className="rounded-3xl border border-[#d6c8dc] px-3 py-[7px] text-xs text-plum">
                14 дней
              </li>
              <li className="rounded-3xl border border-[#d6c8dc] px-3 py-[7px] text-xs text-plum">
                Онлайн
              </li>
            </ul>
            <div className="flex flex-wrap items-center gap-5 xl:gap-7.5">
              <ButtonLink href="#apply">
                Присоединиться к курсу{" "}
                <span className="text-[length:21px] leading-none font-normal" aria-hidden="true">
                  ↗
                </span>
              </ButtonLink>
            </div>
            <a
              href="#program"
              className="mt-[17px] flex min-h-11 w-fit items-center gap-3.5 border-b border-b-[#c6b7cb] text-[13px] font-semibold hover:text-violet"
            >
              Посмотреть все 14 дней <span aria-hidden="true">↓</span>
            </a>
          </div>
          {course.image && (
            <figure
              data-testid="enrollment-poster"
              className="mx-auto my-0 w-full max-w-125 rounded-lg border-[7px] border-paper bg-paper shadow-[0_18px_50px_#48394e13] md:mt-5 md:self-start xl:mt-0 xl:self-center"
            >
              <Image
                className="block h-auto w-full rounded-[3px]"
                {...course.image}
                alt={course.image.alt}
                priority
                sizes="(max-width: 699px) 90vw, 500px"
              />
              <figcaption className="px-[5px] pt-[13px] pb-[7px] text-center text-xs-small tracking-[.07em] text-muted">
                С любовью к практике. С вниманием к себе.
              </figcaption>
            </figure>
          )}
        </Container>
      </section>
      <nav
        className="border-t border-b border-t-line border-b-line bg-paper"
        aria-label="Разделы курса"
      >
        <Container className="flex flex-wrap items-center justify-center gap-x-5.5 gap-y-0 py-[9px]">
          <a
            className="flex min-h-11 items-center text-xs font-semibold text-violet hover:underline hover:underline-offset-[5px]"
            href="#program"
          >
            Программа по дням
          </a>
          <a
            className="flex min-h-11 items-center text-xs font-semibold text-violet hover:underline hover:underline-offset-[5px]"
            href="#outcomes"
          >
            Что вы получите
          </a>
          <a
            className="flex min-h-11 items-center text-xs font-semibold text-violet hover:underline hover:underline-offset-[5px]"
            href="#teacher"
          >
            Инструктор
          </a>
          <a
            className="flex min-h-11 items-center text-xs font-semibold text-violet hover:underline hover:underline-offset-[5px]"
            href="#apply"
          >
            Записаться
          </a>
        </Container>
      </nav>
      <section
        className="scroll-mt-[25px] bg-lavender-soft py-19.5 md:py-24"
        id="program"
        aria-labelledby="curriculum-title"
      >
        <Container className="grid gap-7.5 lg:grid-cols-[.85fr_1.15fr] lg:items-start lg:gap-[85px]">
          <div className="lg:sticky lg:top-7.5">
            <span className="block text-xs-small leading-[1.6] font-bold tracking-[.17em] text-violet">
              ОТ ЗНАКОМСТВА — К СВОЕЙ ПРАКТИКЕ
            </span>
            <h2
              className="mx-0 mt-4 mb-6 text-[length:clamp(40px,9vw,62px)] text-balance"
              id="curriculum-title"
            >
              Каждый день —<br />
              <em>новый шаг к себе.</em>
            </h2>
            <p className="max-w-110 text-[15px] leading-[1.8] text-muted">
              Все 14 дней программы по порядку. Откройте день, чтобы посмотреть практики и тему
              лекции.
            </p>
            <span className="mt-6 block text-xs text-violet">
              14 дней ·{" "}
              {course.curriculum.days.reduce((total, day) => total + day.activities.length, 0)}{" "}
              пункта программы
            </span>
          </div>
          <div className="min-w-0">
            {course.curriculum.days.map((day, index) => (
              <details
                data-testid="curriculum-day"
                className="group border-t border-t-[#d1c3d9] last:border-b last:border-b-[#d1c3d9]"
                key={day.title}
                open={index === 0}
              >
                <summary className="grid min-h-17.5 cursor-pointer list-none grid-cols-[minmax(0,1fr)_30px] items-center gap-x-[15px] gap-y-2.5 px-0 py-6 [&::-webkit-details-marker]:hidden">
                  <span className="col-start-1 text-xs-small font-bold tracking-[.13em] text-violet">
                    ДЕНЬ {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="col-start-1 m-0 text-[length:27px] leading-[1.15] lg:text-[length:31px]">
                    {day.title}
                  </h3>
                  <span
                    className="col-start-2 row-[1/3] text-center text-[length:28px] font-normal text-violet group-open:rotate-45"
                    aria-hidden="true"
                  >
                    +
                  </span>
                </summary>
                <ul className="mx-0 mt-0 mb-[27px] list-[circle] pl-[23px]">
                  {day.activities.map((activity) => (
                    <li
                      className="mx-0 mt-0 mb-3 pl-1.5 text-[15px] leading-[1.8] text-ink marker:text-accent"
                      key={activity}
                    >
                      {activity}
                    </li>
                  ))}
                </ul>
              </details>
            ))}
          </div>
        </Container>
      </section>
      <section
        className="scroll-mt-[25px] py-19.5 md:py-24"
        id="outcomes"
        aria-labelledby="outcomes-title"
      >
        <Container>
          <div className="mx-auto max-w-162.5 text-center">
            <span className="block text-xs-small leading-[1.6] font-bold tracking-[.17em] text-violet">
              ЧТО ВЫ ПОЛУЧИТЕ ПОСЛЕ КУРСА
            </span>
            <h2
              className="mx-0 mt-4 mb-6 text-[length:clamp(40px,9vw,62px)] text-balance"
              id="outcomes-title"
            >
              Практики для жизни.
              <br />
              <em>Опора внутри.</em>
            </h2>
            <p className="mx-auto my-0 max-w-130 text-base leading-[1.8] text-muted">
              Знакомимся с техниками и знаниями, к которым можно обращаться в повседневной жизни.
            </p>
          </div>
          <ol data-testid="outcomes-list" className="mx-auto mt-10.5 mb-0 max-w-225 list-none p-0">
            {course.curriculum.outcomes.map((outcome, index) => (
              <li
                className="flex items-baseline gap-[25px] border-t border-t-line px-0 py-6 last:border-b last:border-b-line"
                key={outcome}
              >
                <span className="font-serif text-3xl text-accent" aria-hidden="true">
                  0{index + 1}
                </span>
                <p className="m-0 text-[17px] leading-[1.75]">{outcome}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>
      <section
        className="scroll-mt-[25px] bg-sand py-19.5 md:py-24"
        id="teacher"
        aria-labelledby="teacher-title"
      >
        <Container className="grid gap-10 md:grid-cols-[.88fr_1fr] md:items-center md:gap-15 2xl:grid-cols-[440px_1fr] 2xl:gap-[105px]">
          <div className="relative aspect-[720/1122] overflow-hidden rounded-[160px_160px_5px_5px] bg-[#d7d0c9]">
            <Image
              className="object-cover object-[50%_35%]"
              src="/images/oksana-balance.png"
              alt="Оксана Палкина — инструктор курса"
              fill
              sizes="(max-width: 699px) 90vw, 440px"
            />
          </div>
          <div>
            <span className="block text-xs-small leading-[1.6] font-bold tracking-[.17em] text-violet">
              ВАШ ПРОВОДНИК В ПРАКТИКЕ
            </span>
            <h2
              className="mx-0 mt-4 mb-6 text-[length:clamp(40px,9vw,62px)] text-balance"
              id="teacher-title"
            >
              Оксана <em>Палкина</em>
            </h2>
            <p className="mb-4.5 font-serif text-[length:28px] leading-[1.35] text-ink 2xl:max-w-[485px] 2xl:text-[length:31px]">
              Приглашаю вас подарить себе 14 дней заботы о себе.
            </p>
            <p className="mb-4.5 text-base leading-[1.8] text-muted md:text-[15px] 2xl:max-w-[485px] 2xl:text-base">
              Будем знакомиться с йогой, дыханием, медитацией, аюрведой и даосскими практиками —
              день за днём, в атмосфере внимания к себе.
            </p>
            <a
              className="inline-flex min-h-11 items-center gap-4 border-b border-b-[#ac8fba] px-0 py-[5px] text-[13px] font-[650] text-violet hover:text-[#9e587e]"
              href="#apply"
            >
              Присоединиться к практике{" "}
              <span className="text-[length:22px]" aria-hidden="true">
                ↗
              </span>
            </a>
          </div>
        </Container>
      </section>
      <section
        className="scroll-mt-[25px] bg-[#eee7ec] py-19.5 md:py-24"
        id="apply"
        aria-labelledby="apply-title"
      >
        <Container className="grid gap-7 md:grid-cols-[1fr_1fr] md:gap-[55px] 2xl:grid-cols-[1fr_500px]">
          <div>
            <span className="block text-xs-small leading-[1.6] font-bold tracking-[.17em] text-violet">
              ЗАПИСЬ НА КУРС ОТКРЫТА
            </span>
            <h2
              className="mx-0 mt-4 mb-6 text-[length:clamp(40px,9vw,62px)] text-balance"
              id="apply-title"
            >
              Стартуем <em>11 ноября.</em>
            </h2>
            <p className="max-w-117.5 text-base leading-[1.8] text-muted">
              11–25 ноября 2026 года. Оставьте контакты — мы свяжемся с вами, ответим на вопросы и
              расскажем об условиях участия и стоимости.
            </p>
            <p className="max-w-117.5 text-base leading-[1.8] text-muted">
              Можно записаться по телефону или в личных сообщениях в ВК.
            </p>
            <a
              className="inline-flex min-h-11 items-center gap-4 border-b border-b-[#ac8fba] px-0 py-[5px] text-[13px] font-[650] text-violet hover:text-[#9e587e]"
              href="tel:+79053068428"
            >
              +7 (905) 306-84-28{" "}
              <span className="text-[length:22px]" aria-hidden="true">
                ↗
              </span>
            </a>
            <div className="mt-5">
              <a
                className="inline-flex min-h-11 items-center gap-4 border-b border-b-[#ac8fba] px-0 py-[5px] text-[13px] font-[650] text-violet hover:text-[#9e587e]"
                href="https://vk.ru/ayurvedicpro"
                target="_blank"
                rel="noopener noreferrer"
              >
                Группа йоги и аюрведы в ВК{" "}
                <span className="text-[length:22px]" aria-hidden="true">
                  ↗
                </span>
              </a>
            </div>
          </div>
          <LeadForm courseSlug={course.slug} courseTitle={course.title} />
        </Container>
      </section>
      <section className="bg-[#f8f4ed] py-17 text-center md:py-[85px]">
        <Container>
          <span className="block text-xs-small leading-[1.6] font-bold tracking-[.17em] text-violet">
            14 ДНЕЙ ВНИМАНИЯ К СЕБЕ
          </span>
          <h2 className="mx-0 mt-4 mb-6 text-[length:clamp(40px,9vw,62px)] text-balance">
            Больше тишины.
            <br />
            <em>Больше гармонии с собой.</em>
          </h2>
          <p className="mx-0 mt-0 mb-4 text-base leading-[1.8] text-muted">
            Присоединяйтесь к нашей практике.
          </p>
          <span className="font-serif text-[length:28px] text-accent italic">
            С любовью, Оксана!
          </span>
        </Container>
      </section>
    </div>
  );
}
