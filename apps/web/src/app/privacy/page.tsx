import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Обработка персональных данных" };

export default function PrivacyPage() {
  return (
    <section className="mx-auto min-h-[60vh] w-[min(100%_-_40px,1200px)] py-[75px] max-xs:w-[calc(100%_-_32px)] md:w-[min(100%_-_72px,1200px)]">
      <span className="block text-xs-small leading-[1.6] font-bold tracking-[.17em] text-violet">
        ИНФОРМАЦИЯ О ДАННЫХ
      </span>
      <h1 className="mx-0 mt-5 mb-7.5 text-[length:clamp(40px,9vw,68px)] [overflow-wrap:break-word]">
        Обработка персональных данных
      </h1>
      <div className="max-w-187.5 border-l-[3px] border-l-violet bg-white p-[25px] text-[15px] leading-[1.8]">
        <strong>Демонстрационная страница.</strong>
        <p className="mx-0 mt-2.5 mb-0 leading-[1.8] text-muted">
          Перед публикацией сайта здесь необходимо указать оператора персональных данных, цели и
          сроки обработки, способы связи и остальные сведения в соответствии с применимым
          законодательством. Сейчас форма используется только для проверки работы сайта.
        </p>
      </div>
      <p className="mt-[25px] leading-[1.8]">
        <Link
          className="inline-flex min-h-11 items-center gap-4 border-b border-b-[#ac8fba] px-0 py-[5px] text-[13px] font-[650] text-violet hover:text-[#9e587e]"
          href="/courses"
        >
          ← Вернуться к курсам
        </Link>
      </p>
    </section>
  );
}
