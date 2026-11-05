import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { publishedCourses as courses } from "@oksana/catalog";
import Image from "next/image";
import Link from "next/link";
import { CourseGrid } from "@/components/course-grid";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <>
      <section className="relative [background:radial-gradient(ellipse_at_95%_10%,#eee6ef88,transparent_60%),var(--color-cream)]">
        <Container className="grid gap-10 pt-11.5 md:grid-cols-[1.1fr_1fr] md:items-center md:gap-11 md:pt-15.5 md:pb-[35px] 2xl:grid-cols-[1.15fr_1fr] 2xl:gap-[77px] 2xl:pt-[57px]">
          <div>
            <span className="flex items-center gap-3 text-xs-small leading-[1.6] font-bold tracking-[.17em] text-violet">
              <span className="h-[7px] w-[7px] rounded-full bg-[#ae729e]" /> ЦЕНТР ЙОГИ И АЮРВЕДЫ
            </span>
            <h1 className="mx-0 mt-[25px] mb-[23px] text-[length:clamp(42px,10.8vw,64px)] leading-[1.04] max-xs:text-[length:39px] md:text-[length:clamp(44px,5.7vw,76px)] 2xl:text-[length:76px]">
              Время замедлиться.
              <br />И <em>услышать себя.</em>
            </h1>
            <p className="mb-0 max-w-125 text-base leading-[1.8] text-muted max-xs:text-[15px] md:text-[15px] 2xl:text-base">
              Йога, аюрведа и бережное внимание к себе.
              <br className="hidden 2xl:block" /> Пространство, где можно выдохнуть и найти свой
              ритм.
            </p>
            <div className="mt-7 flex flex-col items-start gap-3 md:gap-2.5 2xl:mt-[31px] 2xl:gap-[15px]">
              <ButtonLink href="/courses">
                Найти свою практику{" "}
                <span className="text-[length:21px] leading-none font-normal" aria-hidden="true">
                  ↗
                </span>
              </ButtonLink>
              <a
                className="flex min-h-11 items-center gap-3.5 border-b border-b-[#c6b7cb] text-[13px] font-semibold hover:text-violet"
                href="#instructor"
              >
                Познакомиться с Оксаной <span aria-hidden="true">↓</span>
              </a>
            </div>
            <div className="hidden 2xl:mt-8.5 2xl:flex 2xl:items-center 2xl:gap-[15px] 2xl:text-[11px] 2xl:leading-[1.8] 2xl:text-muted">
              <span className="2xl:h-[1px] 2xl:w-9.5 2xl:bg-[#bc9bc7]" />
              <span>
                С вниманием к телу.
                <br />С теплом к себе.
              </span>
            </div>
          </div>
          <div className="relative mx-auto w-[calc(100%_-_12px)] pb-[35px] md:w-full">
            <span
              className="absolute [inset:-15px_-13px_23px_13px] rotate-5 rounded-[49%_49%_8px_8px] border border-[#c4aacd]"
              aria-hidden="true"
            />
            <div className="relative z-1 aspect-[.79] overflow-hidden rounded-[48%_48%_4px_4px] bg-[#ded8d2] max-xs:aspect-[.75] 2xl:aspect-[.85]">
              <Image
                data-testid="hero-photo"
                src="/images/oksana-meditation.png"
                alt="Оксана Палкина сидит в позе для медитации"
                fill
                priority
                sizes="(max-width: 699px) 92vw, 46vw"
                className="object-cover object-[50%_45%]"
              />
            </div>
            <span
              className="absolute top-[15px] left-0.5 z-2 [font-family:Georgia,serif] text-6xl leading-none text-violet md:top-4 md:left-[-12px] md:text-[length:62px] 2xl:left-[-20px] 2xl:text-[length:75px]"
              aria-hidden="true"
            >
              ✳
            </span>
            <div className="absolute bottom-3 left-[-6px] z-2 rounded border border-[#e9e1e8] bg-paper px-[23px] py-[17px] shadow-[0_10px_25px_#34213b09] max-xs:px-4.5 max-xs:py-[15px] md:left-[-22px] md:px-[25px] md:py-5">
              <span className="block text-2xs font-bold tracking-[.13em] text-muted">
                ВАШ ПРОВОДНИК В ПРАКТИКЕ
              </span>
              <strong className="mt-0.5 block font-serif text-[length:28px] font-medium max-xs:text-[length:26px] md:text-[length:31px]">
                Оксана Палкина
              </strong>
            </div>
            <span
              className="hidden 2xl:absolute 2xl:top-37.5 2xl:right-[-32px] 2xl:block 2xl:text-2xs 2xl:tracking-[.17em] 2xl:text-muted 2xl:[writing-mode:vertical-rl]"
              aria-hidden="true"
            >
              ГАРМОНИЯ НАЧИНАЕТСЯ ВНУТРИ
            </span>
          </div>
        </Container>
        <Container className="flex items-center justify-between gap-3 pt-5.5 pb-7 text-2xs font-[650] tracking-[.07em] text-muted max-xs:text-[length:7px] max-xs:tracking-[0] md:pt-4.5 md:pb-[27px] md:text-[9px] md:tracking-[.13em]">
          <span>ЙОГА · АЮРВЕДА · ОСОЗНАННОСТЬ</span>
          <a className="flex min-h-11 items-center gap-3 whitespace-nowrap" href="#approach">
            Место для себя{" "}
            <span className="text-lg" aria-hidden="true">
              ↓
            </span>
          </a>
        </Container>
      </section>
      <section
        className="bg-lavender py-18.5 md:py-24"
        id="approach"
        aria-labelledby="approach-title"
      >
        <Container>
          <div className="mx-auto max-w-162.5 text-center">
            <span className="block text-xs-small leading-[1.6] font-bold tracking-[.17em] text-violet">
              БЛИЖЕ К СЕБЕ
            </span>
            <h2
              className="mx-0 mt-4 mb-5.5 text-[length:clamp(39px,9.4vw,60px)]"
              id="approach-title"
            >
              Маленькие шаги.
              <br />
              <em>Больше внимания к себе.</em>
            </h2>
            <p className="mx-auto my-0 max-w-130 text-base leading-[1.8] text-muted">
              В повседневных делах так легко забыть о себе. Пусть практика станет временем, которое
              принадлежит только вам.
            </p>
          </div>
          <div className="mt-[37px] grid gap-6.5 md:mt-12 md:grid-cols-[repeat(3,1fr)] md:gap-7 2xl:gap-12.5">
            <article className="border-t border-t-[#d8cddd] px-0 pt-[25px] pb-0">
              <span className="text-xs-small font-bold tracking-[.13em] text-violet">
                01 / ТЕЛО
              </span>
              <h3 className="mx-0 mt-4 mb-[13px] text-[length:29px] leading-[1.15] tracking-[-.02em] md:text-[length:28px]">
                Почувствовать движение
              </h3>
              <p className="m-0 text-[15px] leading-[1.8] text-muted md:text-sm">
                Знакомиться с телом через йогу, замечать ощущения и выбирать комфортный темп.
              </p>
            </article>
            <article className="border-t border-t-[#d8cddd] px-0 pt-[25px] pb-0">
              <span className="text-xs-small font-bold tracking-[.13em] text-violet">
                02 / РИТМ
              </span>
              <h3 className="mx-0 mt-4 mb-[13px] text-[length:29px] leading-[1.15] tracking-[-.02em] md:text-[length:28px]">
                Обратиться к традициям
              </h3>
              <p className="m-0 text-[15px] leading-[1.8] text-muted md:text-sm">
                Изучать аюрведу и открывать для себя её взгляд на повседневную заботу о себе.
              </p>
            </article>
            <article className="border-t border-t-[#d8cddd] px-0 pt-[25px] pb-0">
              <span className="text-xs-small font-bold tracking-[.13em] text-violet">
                03 / ВНИМАНИЕ
              </span>
              <h3 className="mx-0 mt-4 mb-[13px] text-[length:29px] leading-[1.15] tracking-[-.02em] md:text-[length:28px]">
                Побыть в моменте
              </h3>
              <p className="m-0 text-[15px] leading-[1.8] text-muted md:text-sm">
                Остановиться, прислушаться к дыханию и оставить немного пространства для себя.
              </p>
            </article>
          </div>
        </Container>
      </section>
      <section
        className="bg-sand py-19.5 md:py-24"
        id="instructor"
        aria-labelledby="instructor-title"
      >
        <Container className="grid gap-10 md:grid-cols-[.88fr_1fr] md:items-center md:gap-15 2xl:grid-cols-[440px_1fr] 2xl:gap-[105px]">
          <div className="relative aspect-[720/1122] overflow-hidden rounded-[160px_160px_5px_5px] bg-[#d7d0c9]">
            <Image
              className="object-cover object-[50%_35%]"
              src="/images/oksana-balance.png"
              alt="Оксана Палкина показывает асану с ладонями у груди"
              fill
              sizes="(max-width: 699px) 90vw, 40vw"
            />
            <span className="absolute right-0 bottom-0 left-0 px-2.5 pt-[23px] pb-[17px] text-center text-2xs font-bold tracking-[.17em] text-[#574b5b] [background:linear-gradient(transparent,#f3efeaec)]">
              ДВИЖЕНИЕ. ДЫХАНИЕ. ПРИСУТСТВИЕ.
            </span>
          </div>
          <div>
            <span className="block text-xs-small leading-[1.6] font-bold tracking-[.17em] text-violet">
              ДАВАЙТЕ ПОЗНАКОМИМСЯ
            </span>
            <h2
              className="mx-0 mt-4 mb-3 text-[length:clamp(39px,9.4vw,60px)] max-xs:text-[length:43px] md:text-[length:54px] 2xl:text-[length:66px]"
              id="instructor-title"
            >
              Оксана <em>Палкина</em>
            </h2>
            <span className="mb-7 block text-xs text-violet">
              Инструктор · центр йоги и аюрведы
            </span>
            <p className="mb-4.5 font-serif text-[length:28px] leading-[1.35] text-ink 2xl:max-w-[485px] 2xl:text-[length:31px]">
              Практика начинается со встречи с собой — в том состоянии, в котором вы сегодня.
            </p>
            <p className="mb-4.5 text-base leading-[1.8] text-muted md:text-[15px] 2xl:max-w-[485px] 2xl:text-base">
              Здесь мы знакомимся с йогой и аюрведой, исследуем движение и находим время для
              внимательного отношения к себе.
            </p>
            <p className="mb-4.5 text-base leading-[1.8] text-muted md:text-[15px] 2xl:max-w-[485px] 2xl:text-base">
              Вы можете посмотреть направления обучения и оставить заявку. Мы обсудим ваш интерес к
              практике и поможем с выбором.
            </p>
            <Link
              className="inline-flex min-h-11 items-center gap-4 border-b border-b-[#ac8fba] px-0 py-[5px] text-[13px] font-[650] text-violet hover:text-[#9e587e]"
              href="/courses"
            >
              Познакомиться с программами{" "}
              <span className="text-[length:22px]" aria-hidden="true">
                ↗
              </span>
            </Link>
          </div>
        </Container>
      </section>
      <section className="py-19.5 md:py-24" aria-labelledby="courses-title">
        <Container>
          <div className="mb-8 grid gap-3 md:mb-[43px] md:grid-cols-[1.1fr_1fr] md:items-end md:gap-17.5">
            <div>
              <span className="block text-xs-small leading-[1.6] font-bold tracking-[.17em] text-violet">
                ВАША ПРАКТИКА
              </span>
              <h2
                className="mx-0 mt-4 mb-2 text-[length:clamp(39px,9.4vw,60px)]"
                id="courses-title"
              >
                Найдите то, что
                <br />
                <em>откликается вам.</em>
              </h2>
            </div>
            <p className="m-0 max-w-[385px] text-[15px] leading-[1.8] text-muted md:mb-3">
              Выберите программу и узнайте о ней больше. Если пока сложно определиться, начните с
              разговора с нами.
            </p>
          </div>
          <CourseGrid courses={courses} />
          <div className="mt-8.5 text-center">
            <ButtonLink variant="outline" href="/courses">
              Посмотреть все курсы{" "}
              <span className="text-[length:21px] leading-none font-normal" aria-hidden="true">
                ↗
              </span>
            </ButtonLink>
          </div>
        </Container>
      </section>
      <section className="bg-lavender-soft py-19.5 md:py-24" aria-labelledby="steps-title">
        <Container className="grid gap-7 md:grid-cols-[1fr_1fr] md:gap-15">
          <div>
            <span className="block text-xs-small leading-[1.6] font-bold tracking-[.17em] text-violet">
              БЕЗ СПЕШКИ, В СВОЁМ ТЕМПЕ
            </span>
            <h2 className="mx-0 mt-4 mb-5.5 text-[length:clamp(39px,9.4vw,60px)]" id="steps-title">
              Первый шаг —<br />
              <em>ваш интерес.</em>
            </h2>
            <p className="m-0 max-w-90 text-[15px] leading-[1.8] text-muted">
              Для начала достаточно желания познакомиться с практикой. Обо всём остальном поговорим.
            </p>
          </div>
          <ol className="m-0 list-none p-0">
            <li className="grid grid-cols-[43px_1fr] gap-3.5 border-t border-t-[#d9cfdf] px-0 py-[25px] last:border-b last:border-b-[#d9cfdf] md:py-[27px]">
              <span className="font-serif text-[length:27px] text-accent">01</span>
              <div>
                <h3 className="mx-0 mt-0 mb-[7px] font-sans text-[15px] leading-[1.55] font-[650]">
                  Присмотритесь к программам
                </h3>
                <p className="m-0 text-sm leading-[1.8] text-muted">
                  Выберите направление, которое вам интересно.
                </p>
              </div>
            </li>
            <li className="grid grid-cols-[43px_1fr] gap-3.5 border-t border-t-[#d9cfdf] px-0 py-[25px] last:border-b last:border-b-[#d9cfdf] md:py-[27px]">
              <span className="font-serif text-[length:27px] text-accent">02</span>
              <div>
                <h3 className="mx-0 mt-0 mb-[7px] font-sans text-[15px] leading-[1.55] font-[650]">
                  Оставьте свои контакты
                </h3>
                <p className="m-0 text-sm leading-[1.8] text-muted">
                  Заполните короткую форму на странице курса.
                </p>
              </div>
            </li>
            <li className="grid grid-cols-[43px_1fr] gap-3.5 border-t border-t-[#d9cfdf] px-0 py-[25px] last:border-b last:border-b-[#d9cfdf] md:py-[27px]">
              <span className="font-serif text-[length:27px] text-accent">03</span>
              <div>
                <h3 className="mx-0 mt-0 mb-[7px] font-sans text-[15px] leading-[1.55] font-[650]">
                  Давайте познакомимся
                </h3>
                <p className="m-0 text-sm leading-[1.8] text-muted">
                  Мы свяжемся с вами и ответим на вопросы.
                </p>
              </div>
            </li>
          </ol>
        </Container>
      </section>
      <section className="py-19.5 md:py-24">
        <Container className="grid gap-4 md:grid-cols-[1fr_1fr] md:gap-15">
          <div>
            <span className="block text-xs-small leading-[1.6] font-bold tracking-[.17em] text-violet">
              ВОЗМОЖНО, ВЫ ДУМАЕТЕ ОБ ЭТОМ
            </span>
            <h2 className="mx-0 mt-4 mb-5.5 text-[length:clamp(39px,9.4vw,60px)]">
              Перед <em>началом.</em>
            </h2>
          </div>
          <div>
            <details className="group border-b border-b-line">
              <summary className="flex min-h-20.5 cursor-pointer list-none items-center justify-between gap-5 px-0 py-5 text-[15px] leading-[1.6] font-semibold md:text-sm [&::-webkit-details-marker]:hidden">
                Я только знакомлюсь с йогой. С чего начать?
                <span
                  className="text-[length:25px] font-normal text-violet group-open:rotate-45"
                  aria-hidden="true"
                >
                  +
                </span>
              </summary>
              <p className="mt-0 mr-5.5 mb-[25px] ml-0 text-[15px] leading-[1.8] text-muted">
                Посмотрите программы и оставьте заявку на ту, которая вам интересна. Во время
                знакомства расскажите о своём опыте — мы обсудим, какой формат может вам подойти.
              </p>
            </details>
            <details className="group border-b border-b-line">
              <summary className="flex min-h-20.5 cursor-pointer list-none items-center justify-between gap-5 px-0 py-5 text-[15px] leading-[1.6] font-semibold md:text-sm [&::-webkit-details-marker]:hidden">
                Как выбрать подходящий курс?
                <span
                  className="text-[length:25px] font-normal text-violet group-open:rotate-45"
                  aria-hidden="true"
                >
                  +
                </span>
              </summary>
              <p className="mt-0 mr-5.5 mb-[25px] ml-0 text-[15px] leading-[1.8] text-muted">
                В заявке укажите контакты. Мы свяжемся с вами, расскажем о содержании курса и
                ответим на вопросы до записи.
              </p>
            </details>
            <details className="group border-b border-b-line">
              <summary className="flex min-h-20.5 cursor-pointer list-none items-center justify-between gap-5 px-0 py-5 text-[15px] leading-[1.6] font-semibold md:text-sm [&::-webkit-details-marker]:hidden">
                Заявка обязывает меня к покупке?
                <span
                  className="text-[length:25px] font-normal text-violet group-open:rotate-45"
                  aria-hidden="true"
                >
                  +
                </span>
              </summary>
              <p className="mt-0 mr-5.5 mb-[25px] ml-0 text-[15px] leading-[1.8] text-muted">
                Нет. Заявка — возможность познакомиться и узнать подробности. Решение об участии вы
                принимаете после разговора.
              </p>
            </details>
          </div>
        </Container>
      </section>
      <section className="relative bg-plum py-17.5 text-center text-[#fffaf3] md:py-[87px]">
        <Container className="relative flex flex-col items-center gap-6">
          <span
            className="[font-family:Georgia,serif] text-[length:50px] leading-none text-[#b790c0]"
            aria-hidden="true"
          >
            ✳
          </span>
          <span className="block text-xs-small leading-[1.6] font-bold tracking-[.17em] text-[#d9bddf]">
            РАЗРЕШИТЕ СЕБЕ ЭТО ВРЕМЯ
          </span>
          <h2 className="m-0 max-w-212.5 text-[length:clamp(39px,9vw,64px)]">
            Пусть забота о себе
            <br />
            станет <em className="text-[#e1c5d8]">частью вашей жизни.</em>
          </h2>
          <ButtonLink variant="light" href="/courses">
            Сделать первый шаг{" "}
            <span className="text-[length:21px] leading-none font-normal" aria-hidden="true">
              ↗
            </span>
          </ButtonLink>
        </Container>
      </section>
    </>
  );
}
