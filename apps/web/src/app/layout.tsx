import { Container } from "@/components/ui/container";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getIndexableOrigin } from "@/lib/site-settings";
import "@fontsource-variable/manrope";
import "@fontsource/cormorant-garamond/cyrillic-500.css";
import "@fontsource/cormorant-garamond/cyrillic-500-italic.css";
import "@fontsource/cormorant-garamond/latin-500.css";
import "@fontsource/cormorant-garamond/latin-500-italic.css";
import "./globals.css";

export const dynamic = "force-dynamic";

export function generateMetadata(): Metadata {
  const origin = getIndexableOrigin();
  return {
    title: { default: "Оксана Палкина — йога и аюрведа", template: "%s | Оксана Палкина" },
    description: "Онлайн-курсы йоги и аюрведы Оксаны Палкиной.",
    metadataBase: origin ? new URL(origin) : undefined,
    robots: origin ? { index: true, follow: true } : { index: false, follow: false },
  };
}

const contacts = [
  { label: "+7 905 306-84-28", href: "tel:+79053068428" },
  { label: "Telegram", href: "https://t.me/oksayoga144" },
  { label: "ВКонтакте", href: "https://vk.ru/ayurvedicpro" },
];

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" data-scroll-behavior="smooth">
      <body>
        <a
          className="absolute -top-25 left-4 z-20 bg-violet px-5 py-3.5 text-white focus:top-4"
          href="#main"
        >
          Перейти к содержимому
        </a>
        <header className="border-b border-line bg-cream">
          <Container className="flex min-h-18 items-center justify-between gap-3 py-2 md:min-h-21">
            <Link href="/" aria-label="Оксана Палкина — на главную" className="shrink-0">
              <Image
                src="/images/oksana-logo.png"
                alt=""
                width={1361}
                height={629}
                className="h-auto w-28 md:w-36"
              />
            </Link>
            <nav
              aria-label="Основная навигация"
              className="flex flex-wrap items-center justify-end gap-x-4 md:gap-x-8"
            >
              <Link
                className="inline-flex min-h-11 items-center text-sm font-semibold hover:text-violet"
                href="/courses"
              >
                Курсы
              </Link>
              <Link
                className="inline-flex min-h-11 items-center text-sm font-semibold hover:text-violet"
                href="/#instructor"
              >
                Об Оксане
              </Link>
            </nav>
          </Container>
        </header>

        <main id="main">{children}</main>

        <footer className="border-t border-line bg-lavender py-5">
          <Container className="flex flex-col gap-x-8 gap-y-2 md:flex-row md:flex-wrap md:items-center md:justify-between">
            <address className="flex flex-wrap gap-x-5 text-sm not-italic">
              {contacts.map(({ label, href }) => (
                <a
                  key={href}
                  href={href}
                  className="inline-flex min-h-11 items-center text-violet hover:underline"
                >
                  {label}
                </a>
              ))}
            </address>
            <Link
              href="/privacy"
              className="inline-flex min-h-11 items-center text-sm text-violet hover:underline"
            >
              Обработка данных
            </Link>
          </Container>
        </footer>
      </body>
    </html>
  );
}
