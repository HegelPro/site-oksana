import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import Image from "next/image";
import Link from "next/link";
import { getCoursePricing, type Course, type CourseProgram } from "@oksana/catalog";
import { LeadForm } from "./lead-form";

function rubles(value: number) {
  return `${new Intl.NumberFormat("ru-RU").format(value)} ₽`;
}

export function CourseLanding({ course, program }: { course: Course; program: CourseProgram }) {
  const pricing = getCoursePricing(course);

  return (
    <div>
      <section className="pt-5.5 pb-[55px] [background:radial-gradient(ellipse_at_100%_0,#e7deea88,transparent_65%),var(--color-cream)] md:pt-9.5 md:pb-[65px]">
        <Container className="grid items-center gap-[35px] md:grid-cols-[1.15fr_1fr] md:gap-10 xl:grid-cols-[1.15fr_.85fr] xl:gap-[75px]">
          <div className="min-w-0">
            <Link
              href="/courses"
              className="mb-5 table min-h-11 content-center text-[13px] text-violet xl:mb-6.5"
            >
              ← Все курсы
            </Link>
            <span className="block text-xs-small leading-[1.6] font-bold tracking-[.17em] text-violet">
              ОНЛАЙН-КУРС С ОКСАНОЙ ПАЛКИНОЙ
            </span>
            <p className="mx-0 mt-[23px] mb-4 font-serif text-2xl leading-[1.25] text-accent italic md:text-[length:23px] xl:text-[length:26px]">
              «Я устала от напряжения.
              <br />
              Хочу почувствовать себя спокойнее».
            </p>
            <h1 className="mx-0 mt-0 mb-6 text-[length:clamp(40px,10vw,64px)] leading-[1.02] text-balance text-plum md:text-5xl xl:text-[length:64px]">
              {course.title}
            </h1>
            <p className="max-w-140 text-base leading-[1.8] text-muted">
              Знакомо? Приглашаю вас на 14 дней практики — чтобы выдохнуть, услышать себя и уделить
              время своему состоянию.
            </p>
            <ul
              data-testid="enrollment-facts"
              className="mx-0 my-6 flex list-none flex-wrap gap-[9px] p-0"
              aria-label="Коротко о курсе"
            >
              <li className="rounded-3xl border border-[#d6c8dc] px-3 py-[7px] text-xs text-plum">
                14 дней
              </li>
              <li className="rounded-3xl border border-[#d6c8dc] px-3 py-[7px] text-xs text-plum">
                {course.schedule}
              </li>
              <li className="rounded-3xl border border-[#d6c8dc] px-3 py-[7px] text-xs text-plum">
                Telegram или ВК
              </li>
            </ul>
            <div className="flex flex-wrap items-center gap-5 xl:gap-7.5">
              <ButtonLink href="#apply">
                Хочу на курс{" "}
                <span className="text-[length:21px] leading-none font-normal" aria-hidden="true">
                  ↗
                </span>
              </ButtonLink>
              <span className="text-2xl font-semibold whitespace-nowrap xl:text-3xl">
                {pricing.current !== undefined && rubles(pricing.current)}
                <small className="mt-[3px] block text-xs-small font-[450] text-muted">
                  стоимость участия
                </small>
              </span>
            </div>
            <a
              href="#program"
              className="mt-[17px] flex min-h-11 w-fit items-center gap-3.5 border-b border-b-[#c6b7cb] text-[13px] font-semibold hover:text-violet"
            >
              Что будет на курсе <span aria-hidden="true">↓</span>
            </a>
          </div>
          {course.image && (
            <figure
              data-testid="enrollment-poster"
              className="mx-auto my-0 w-full max-w-107.5 rounded-lg border-[7px] border-paper bg-paper shadow-[0_18px_50px_#48394e13] md:mt-5 md:self-start xl:mt-0 xl:self-center"
            >
              <Image
                className="block h-auto w-full rounded-[3px]"
                {...course.image}
                alt={course.image.alt}
                priority
                sizes="(max-width: 699px) 90vw, 430px"
              />
              <figcaption className="px-[5px] pt-[13px] pb-[7px] text-center text-xs-small tracking-[.07em] text-muted">
                Йога · Аюрведа · Внутренний баланс
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
            href="#for-whom"
          >
            Для кого
          </a>
          <a
            className="flex min-h-11 items-center text-xs font-semibold text-violet hover:underline hover:underline-offset-[5px]"
            href="#program"
          >
            Программа
          </a>
          <a
            className="flex min-h-11 items-center text-xs font-semibold text-violet hover:underline hover:underline-offset-[5px]"
            href="#gifts"
          >
            Подарки
          </a>
          <a
            className="flex min-h-11 items-center text-xs font-semibold text-violet hover:underline hover:underline-offset-[5px]"
            href="#course-instructor"
          >
            Инструктор
          </a>
          <a
            className="flex min-h-11 items-center text-xs font-semibold text-violet hover:underline hover:underline-offset-[5px]"
            href="#conditions"
          >
            Условия участия
          </a>
        </Container>
      </nav>

      <section
        className="scroll-mt-[25px] py-19.5 md:py-24"
        id="for-whom"
        aria-labelledby="audience-title"
      >
        <Container>
          <div className="mx-auto max-w-162.5 text-center">
            <span className="block text-xs-small leading-[1.6] font-bold tracking-[.17em] text-violet">
              ЕСЛИ СЕЙЧАС ВАМ НЕЛЕГКО
            </span>
            <h2
              className="mx-0 mt-4 mb-6 text-[length:clamp(40px,9vw,62px)] text-balance"
              id="audience-title"
            >
              Можно просто <em>выдохнуть.</em>
            </h2>
            <p className="mx-auto my-0 max-w-130 text-base leading-[1.8] text-muted">
              Этот курс для вас, если вы узнаёте себя в этих словах.
            </p>
          </div>
          <ol className="mx-0 mt-9 mb-0 grid list-none gap-5 p-0 md:grid-cols-[repeat(3,minmax(0,1fr))] md:gap-7">
            {program.audience.map((text, index) => (
              <li className="border-t border-t-[#d8cddd] px-0 pt-[25px] pb-0" key={text}>
                <span className="font-serif text-3xl text-accent" aria-hidden="true">
                  0{index + 1}
                </span>
                <p className="mx-0 mt-[13px] mb-0 text-base leading-[1.8] md:text-[15px]">{text}</p>
              </li>
            ))}
          </ol>
          <p className="mx-auto mt-10 mb-0 max-w-202.5 text-center font-serif text-[length:28px] leading-[1.35] text-violet xl:mt-12.5 xl:text-[length:35px]">
            Если вам просто нужно выдохнуть и почувствовать, что с вами всё в порядке, — этот курс
            для вас.
          </p>
        </Container>
      </section>

      <section
        className="scroll-mt-[25px] bg-lavender-soft py-19.5 md:py-24"
        id="program"
        aria-labelledby="program-title"
      >
        <Container>
          <div className="mb-8 grid gap-3 md:mb-[43px] md:grid-cols-[1.1fr_1fr] md:items-end md:gap-17.5">
            <div>
              <span className="block text-xs-small leading-[1.6] font-bold tracking-[.17em] text-violet">
                ЧТО ВЫ ПОЛУЧИТЕ
              </span>
              <h2
                className="mx-0 mt-4 mb-6 text-[length:clamp(40px,9vw,62px)] text-balance"
                id="program-title"
              >
                Практика, вписанная
                <br />
                <em>в ритм вашего дня.</em>
              </h2>
            </div>
            <p className="m-0 max-w-[385px] text-[15px] leading-[1.8] text-muted md:mb-3">
              Утром, днём и вечером — время, которое принадлежит вам. Каждый день новая практика и
              знакомство с собой.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-[repeat(2,minmax(0,1fr))] md:gap-5">
            {program.practices.map((practice, index) => (
              <article
                data-testid="daily-practice"
                className="relative min-w-0 rounded-[7px] border border-[#e3d9e8] bg-paper px-5.5 py-[25px] md:p-7.5"
                key={practice.title}
              >
                <div className="flex flex-wrap items-center justify-between gap-2.5">
                  <span className="block text-xs-small leading-[1.6] font-bold tracking-[.17em] text-violet">
                    {practice.time}
                  </span>
                  {practice.duration && (
                    <span className="rounded-[20px] bg-[#eee7f1] px-3 py-1.5 text-[11px] whitespace-nowrap text-plum">
                      {practice.duration}
                    </span>
                  )}
                </div>
                <span
                  className="mx-0 mt-[25px] mb-3 block font-serif text-[length:27px] text-[#9e7caa]"
                  aria-hidden="true"
                >
                  0{index + 1}
                </span>
                <h3 className="mx-0 mt-0 mb-[15px] text-[length:32px] leading-[1.12] md:text-4xl">
                  {practice.title}
                </h3>
                <p className="m-0 max-w-120 text-[15px] leading-[1.8] text-muted">
                  {practice.description}
                </p>
              </article>
            ))}
          </div>
          <div className="mt-10 grid gap-2.5 border-t border-t-[#d6cadd] pt-7.5 md:grid-cols-[1fr_1fr] md:gap-[35px]">
            <div>
              <span className="block text-xs-small leading-[1.6] font-bold tracking-[.17em] text-violet">
                ТЕМЫ АЮРВЕДИЧЕСКИХ ЛЕКЦИЙ
              </span>
              <h3 className="mx-0 my-[15px] text-[length:33px] leading-[1.12] text-plum">
                Забота о себе — <em className="font-medium text-accent">в деталях.</em>
              </h3>
            </div>
            <ul className="m-0 flex list-none flex-wrap content-center gap-2.5 p-0">
              {program.topics.map((topic) => (
                <li
                  className="rounded-3xl border border-[#cfc1d6] px-[15px] py-[9px] text-[13px] text-plum"
                  key={topic}
                >
                  {topic}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <section className="bg-plum py-[55px] text-center text-cream">
        <Container>
          <span className="text-[length:42px] leading-none text-[#ccaccd]" aria-hidden="true">
            ✳
          </span>
          <p className="mx-0 mt-5 mb-0 font-serif text-[length:clamp(32px,7vw,48px)] leading-[1.16] text-balance">
            Каждый день — новый шаг к себе.
            <br />К покою. <em className="text-[#e0bfd5]">К опоре внутри.</em>
          </p>
        </Container>
      </section>

      <section
        className="scroll-mt-[25px] py-19.5 md:py-24"
        id="gifts"
        aria-labelledby="gifts-title"
      >
        <Container>
          <div className="mb-8 grid gap-3 md:mb-[43px] md:grid-cols-[1.1fr_1fr] md:items-end md:gap-17.5">
            <div>
              <span className="block text-xs-small leading-[1.6] font-bold tracking-[.17em] text-violet">
                ПО ОКОНЧАНИИ КУРСА
              </span>
              <h2
                className="mx-0 mt-4 mb-6 text-[length:clamp(40px,9vw,62px)] text-balance"
                id="gifts-title"
              >
                Практика продолжается.
                <br />
                <em>И подарки — для вас.</em>
              </h2>
            </div>
            <p className="m-0 max-w-[385px] text-[15px] leading-[1.8] text-muted md:mb-3">
              Три дополнительных материала, которые вы получите после завершения курса.
            </p>
          </div>
          <div
            data-testid="course-gifts"
            className="grid gap-4.5 xl:grid-cols-[repeat(3,minmax(0,1fr))]"
          >
            {program.gifts.map((gift, index) => (
              <article
                className="flex flex-col rounded-[6px] border border-[#e3dae8] bg-lavender px-6 py-7 xl:px-[27px] xl:py-8"
                key={gift.title}
              >
                <span className="text-xs-small font-bold tracking-[.14em] text-violet">
                  ПОДАРОК / 0{index + 1}
                </span>
                <h3 className="mx-0 mt-[23px] mb-4 text-3xl leading-[1.12]">{gift.title}</h3>
                <p className="mx-0 mt-0 mb-[15px] text-[15px] leading-[1.8] text-muted">
                  {gift.description}
                </p>
                {gift.href && (
                  <a
                    className="mt-auto inline-flex min-h-11 items-center gap-4 self-start border-b border-b-[#ac8fba] px-0 py-[5px] text-xs font-[650] text-violet hover:text-[#9e587e]"
                    href={gift.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Посмотреть подарок в ВК{" "}
                    <span className="text-[length:22px]" aria-hidden="true">
                      ↗
                    </span>
                  </a>
                )}
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section
        className="scroll-mt-[25px] bg-sand py-19.5 md:py-24"
        id="course-instructor"
        aria-labelledby="course-instructor-title"
      >
        <Container className="grid gap-10 md:grid-cols-[.88fr_1fr] md:items-center md:gap-15 2xl:grid-cols-[440px_1fr] 2xl:gap-[105px]">
          <div className="relative aspect-[720/1122] overflow-hidden rounded-[160px_160px_5px_5px] bg-[#d7d0c9]">
            <Image
              className="object-cover object-[50%_35%]"
              src="/images/oksana-balance.png"
              alt="Оксана Палкина, преподаватель курса, в асане"
              fill
              sizes="(max-width: 699px) 90vw, 440px"
            />
          </div>
          <div>
            <span className="block text-xs-small leading-[1.6] font-bold tracking-[.17em] text-violet">
              КТО БУДЕТ РЯДОМ
            </span>
            <h2
              className="mx-0 mt-4 mb-6 text-[length:clamp(40px,9vw,62px)] text-balance"
              id="course-instructor-title"
            >
              Оксана <em>Палкина</em>
            </h2>
            <div className="mb-5.5 flex items-center gap-4.5 text-violet">
              <strong className="font-serif text-[length:52px] leading-none font-medium whitespace-nowrap">
                35 лет
              </strong>
              <span className="border-l border-l-[#c8b7ce] pl-4.5 text-xs leading-[1.6]">
                опыта в йоге
                <br />и аюрведе
              </span>
            </div>
            <p className="mb-4.5 text-base leading-[1.8] text-muted md:text-[15px] 2xl:max-w-[485px] 2xl:text-base">
              Специалист по йоге и аюрведе, автор и ведущая курса.
            </p>
            <span className="block text-xs-small leading-[1.6] font-bold tracking-[.17em] text-violet">
              ИЗ ЛИЧНОЙ ИСТОРИИ ОКСАНЫ
            </span>
            <blockquote className="mx-0 mt-4.5 mb-0 border-l-[2px] border-l-[#c8a8cc] pl-5.5">
              <p className="mb-4.5 font-serif text-[length:26px] leading-[1.4] text-ink 2xl:max-w-[485px]">
                «Благодаря этим практикам я восстановила женское здоровье, стала мамой, несмотря на
                бесплодие, и сохранила внутренний свет. И делаю это для вас, мои дорогие».
              </p>
              <cite className="text-xs text-accent not-italic">Оксана Палкина</cite>
            </blockquote>
          </div>
        </Container>
      </section>

      <section
        className="scroll-mt-[25px] py-19.5 md:py-24"
        id="conditions"
        aria-labelledby="conditions-title"
      >
        <Container className="grid gap-[35px] md:grid-cols-[1.15fr_1fr] md:gap-[55px] xl:grid-cols-[1fr_430px] xl:gap-25">
          <div>
            <span className="block text-xs-small leading-[1.6] font-bold tracking-[.17em] text-violet">
              УСЛОВИЯ УЧАСТИЯ
            </span>
            <h2
              className="mx-0 mt-4 mb-6 text-[length:clamp(40px,9vw,62px)] text-balance"
              id="conditions-title"
            >
              Выделите время
              <br />
              <em>для себя.</em>
            </h2>
            <p className="max-w-135 text-base leading-[1.8] text-muted">
              14 дней в закрытом пространстве для практики. Выберите удобную площадку — Telegram или
              ВК.
            </p>
            <dl className="mx-0 mt-7.5 mb-0 border-t border-t-line">
              <div className="grid grid-cols-[100px_minmax(0,1fr)] gap-[15px] border-b border-b-line px-0 py-5 text-[13px] leading-[1.75]">
                <dt className="text-muted">Когда</dt>
                <dd className="m-0 font-semibold">{course.schedule}</dd>
              </div>
              <div className="grid grid-cols-[100px_minmax(0,1fr)] gap-[15px] border-b border-b-line px-0 py-5 text-[13px] leading-[1.75]">
                <dt className="text-muted">Длительность</dt>
                <dd className="m-0 font-semibold">14 дней</dd>
              </div>
              <div className="grid grid-cols-[100px_minmax(0,1fr)] gap-[15px] border-b border-b-line px-0 py-5 text-[13px] leading-[1.75]">
                <dt className="text-muted">Где</dt>
                <dd className="m-0 font-semibold">Закрытый Telegram-чат или ВК</dd>
              </div>
              <div className="grid grid-cols-[100px_minmax(0,1fr)] gap-[15px] border-b border-b-line px-0 py-5 text-[13px] leading-[1.75]">
                <dt className="text-muted">Что включено</dt>
                <dd className="m-0 font-semibold">
                  Все практики, лекции и подарки по окончании курса
                </dd>
              </div>
            </dl>
          </div>
          <div className="self-start rounded-lg border border-[#d6c6df] bg-lavender px-6 py-7.5 md:px-7.5 md:py-[35px]">
            <span className="block text-xs-small leading-[1.6] font-bold tracking-[.17em] text-violet">
              СТОИМОСТЬ УЧАСТИЯ
            </span>
            <p
              data-testid="course-current-price"
              className="mx-0 my-5 max-w-135 text-[length:52px] leading-[1.2] font-semibold tracking-[-.05em] text-plum"
            >
              {pricing.current !== undefined && rubles(pricing.current)}
            </p>
            {course.earlyOffer && (
              <div
                data-testid="course-early-offer"
                className="mb-[25px] border-t border-t-[#dacfe0] pt-4.5 text-xs leading-[1.8] text-muted"
              >
                <strong className="block">
                  {pricing.earlyActive ? "Ранняя запись · скидка 50%" : "Ранняя запись завершена"}
                </strong>
                <span className="block">
                  {pricing.earlyActive ? rubles(course.price!) : rubles(course.earlyOffer.price)} ·{" "}
                  {course.earlyOffer.label}
                  {!pricing.earlyActive && " · скидка 50%"}
                </span>
              </div>
            )}
            <ButtonLink href="#apply" className="w-full">
              Оставить заявку{" "}
              <span className="text-[length:21px] leading-none font-normal" aria-hidden="true">
                ↗
              </span>
            </ButtonLink>
            <p className="mx-0 mt-4 mb-5.5 max-w-135 text-center text-[11px] leading-[1.7] text-muted">
              Заявка не обязывает к покупке.
              <br />
              Мы свяжемся и расскажем подробности.
            </p>
            <div
              data-testid="course-phone"
              className="border-t border-t-[#dacfe0] pt-4.5 text-center"
            >
              <span className="text-[11px] text-muted">Или запишитесь по телефону</span>
              <a
                className="mt-1.5 block min-h-11 content-center text-xl font-semibold text-plum"
                href="tel:+79053068428"
              >
                +7 (905) 306-84-28
              </a>
            </div>
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
              ПЕРВЫЙ ШАГ К ПРАКТИКЕ
            </span>
            <h2
              className="mx-0 mt-4 mb-6 text-[length:clamp(40px,9vw,62px)] text-balance"
              id="apply-title"
            >
              Давайте <em>начнём.</em>
            </h2>
            <p className="max-w-117.5 text-base leading-[1.8] text-muted">
              Оставьте контакты, чтобы записаться на курс «Йога и аюрведа для внутреннего
              спокойствия». Мы свяжемся с вами и ответим на вопросы.
            </p>
            <p className="max-w-117.5 text-base leading-[1.8] text-muted">
              Также можно записаться по телефону или обратиться в личные сообщения в ВК.
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
          </div>
          <LeadForm courseSlug={course.slug} courseTitle={course.title} />
        </Container>
      </section>

      <section className="bg-[#f8f4ed] py-17 text-center md:py-[85px]">
        <Container>
          <span className="block text-xs-small leading-[1.6] font-bold tracking-[.17em] text-violet">
            С ТЕПЛОМ К ВАМ
          </span>
          <h2 className="mx-0 mt-4 mb-6 text-[length:clamp(40px,9vw,62px)] text-balance">
            Тишина. Лёгкость.
            <br />
            <em>Радость внутри.</em>
          </h2>
          <p className="mx-0 mt-0 mb-4 text-base leading-[1.8] text-muted">
            Вы заслуживаете времени для себя.
            <br />Я буду рядом на этом пути.
          </p>
          <span className="font-serif text-[length:28px] text-accent italic">Оксана Палкина</span>
          <div className="mt-7.5 flex flex-wrap justify-center gap-3.5">
            <ButtonLink
              variant="outline"
              className="max-w-full gap-3.5 text-xs"
              href="https://t.me/oksayoga144"
              target="_blank"
              rel="noopener noreferrer"
            >
              Telegram-канал{" "}
              <span className="text-[length:21px] leading-none font-normal" aria-hidden="true">
                ↗
              </span>
            </ButtonLink>
            <ButtonLink
              variant="outline"
              className="max-w-full gap-3.5 text-xs"
              href="https://vk.ru/ayurvedicpro"
              target="_blank"
              rel="noopener noreferrer"
            >
              Группа йоги и аюрведы в ВК{" "}
              <span className="text-[length:21px] leading-none font-normal" aria-hidden="true">
                ↗
              </span>
            </ButtonLink>
          </div>
        </Container>
      </section>
    </div>
  );
}
