import { Container } from "@/components/ui/container";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import "@fontsource-variable/manrope";
import "@fontsource/cormorant-garamond/cyrillic-500.css";
import "@fontsource/cormorant-garamond/cyrillic-500-italic.css";
import "@fontsource/cormorant-garamond/latin-500.css";
import "@fontsource/cormorant-garamond/latin-500-italic.css";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Оксана Палкина — центр йоги и аюрведы", template: "%s | Оксана Палкина" },
  description:
    "Йога, аюрведа и бережное внимание к себе. Познакомьтесь с Оксаной Палкиной и выберите свою практику.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" data-scroll-behavior="smooth">
      <body>
        <a
          className="absolute -top-25 left-[15px] z-99 bg-violet px-5 py-3.5 text-white focus:top-[15px]"
          href="#main"
        >
          Перейти к содержимому
        </a>
        <div className="overflow-clip">
          <header className="relative z-20 border-b border-b-line bg-cream">
            <Container className="flex min-h-24 items-center justify-between gap-5 md:min-h-27.5 2xl:min-h-28">
              <Link
                className="flex flex-none items-center"
                href="/"
                aria-label="Оксана — на главную"
              >
                <Image
                  src="/images/oksana-logo.png"
                  alt="Центр йоги и аюрведы Оксаны Палкиной"
                  width={1361}
                  height={629}
                  className="block h-auto w-41.5 max-xs:w-[155px] md:w-47.5 2xl:w-52"
                  priority
                />
              </Link>
              <nav
                className="hidden md:ml-auto md:flex md:gap-[23px] md:text-xs md:font-[550] 2xl:gap-[33px] 2xl:text-[13px]"
                aria-label="Основная навигация"
              >
                <Link className="md:flex md:min-h-11 md:items-center md:hover:text-accent" href="/">
                  Главная
                </Link>
                <Link
                  className="md:flex md:min-h-11 md:items-center md:hover:text-accent"
                  href="/courses"
                >
                  Курсы
                </Link>
                <Link
                  className="md:flex md:min-h-11 md:items-center md:hover:text-accent"
                  href="/#instructor"
                >
                  Об инструкторе
                </Link>
              </nav>
              <Link
                className="hidden 2xl:ml-[35px] 2xl:flex 2xl:min-h-12 2xl:items-center 2xl:justify-center 2xl:gap-5.5 2xl:rounded 2xl:border 2xl:border-[#b6a2c1] 2xl:px-5.5 2xl:py-2.5 2xl:text-xs 2xl:font-[650] 2xl:text-violet"
                href="/courses"
              >
                Выбрать курс <span aria-hidden="true">↗</span>
              </Link>
              <details data-testid="mobile-menu" className="group relative ml-auto md:hidden">
                <summary
                  className="flex h-12 w-12 cursor-pointer list-none flex-col items-center justify-center gap-1.5 rounded-full border border-line [&::-webkit-details-marker]:hidden"
                  aria-label="Открыть меню"
                >
                  <span className="h-[1px] w-[19px] bg-plum"></span>
                  <span className="h-[1px] w-[19px] bg-plum"></span>
                  <span className="h-[1px] w-[19px] bg-plum"></span>
                </summary>
                <nav
                  className="absolute top-15 right-0 w-57.5 rounded-xl border border-line bg-paper px-5 py-2.5 shadow-[0_12px_40px_#4b285d18]"
                  aria-label="Мобильная навигация"
                >
                  <Link
                    className="flex min-h-13 items-center text-[15px] not-first:border-t not-first:border-line"
                    href="/"
                  >
                    Главная
                  </Link>
                  <Link
                    className="flex min-h-13 items-center text-[15px] not-first:border-t not-first:border-line"
                    href="/courses"
                  >
                    Курсы
                  </Link>
                  <Link
                    className="flex min-h-13 items-center text-[15px] not-first:border-t not-first:border-line"
                    href="/#instructor"
                  >
                    Об инструкторе
                  </Link>
                </nav>
              </details>
            </Container>
          </header>
          <main id="main">{children}</main>
          <footer className="bg-[#eee8ee] pt-12">
            <Container className="flex flex-col gap-7 pb-9.5 md:flex-row md:justify-between">
              <div>
                <span className="font-serif text-[length:33px]">Оксана Палкина</span>
                <p className="mx-0 mt-3 mb-0 text-[13px] leading-[1.8] text-muted">
                  Центр йоги и аюрведы.
                  <br />С вниманием к телу. С теплом к себе.
                </p>
              </div>
              <div className="flex flex-col items-start gap-[3px] text-[13px] md:min-w-62.5">
                <Link className="flex min-h-11 items-center" href="/courses">
                  Все курсы
                </Link>
                <Link className="flex min-h-11 items-center" href="/privacy">
                  Обработка данных
                </Link>
              </div>
            </Container>
            <Container className="flex flex-wrap justify-between gap-3 border-t border-t-[#d9cedc] py-5.5 text-xs-small text-muted md:text-[11px]">
              <span>© {new Date().getFullYear()} Оксана Палкина</span>
              <span>Йога · Аюрведа · Внимание к себе</span>
            </Container>
          </footer>
        </div>
      </body>
    </html>
  );
}
