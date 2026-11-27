import type { Metadata } from "next";
import Link from "next/link";
import { CourseContent } from "@/components/course-content";
import { getPrivacyPolicy } from "@/lib/site-settings";

export const metadata: Metadata = { title: "Обработка персональных данных" };

export default function PrivacyPage() {
  const policy = getPrivacyPolicy();
  return (
    <section className="mx-auto min-h-[60vh] w-[min(100%_-_40px,1200px)] py-[75px] max-xs:w-[calc(100%_-_32px)] md:w-[min(100%_-_72px,1200px)]">
      <span className="block text-xs-small leading-[1.6] font-bold tracking-[.17em] text-violet">
        ИНФОРМАЦИЯ О ДАННЫХ
      </span>
      <h1 className="mx-0 mt-5 mb-7.5 text-[length:clamp(40px,9vw,68px)] [overflow-wrap:break-word]">
        Обработка персональных данных
      </h1>
      {policy ? (
        <>
          <p className="text-sm text-muted">Редакция {policy.version}</p>
          <CourseContent source={policy.text} />
        </>
      ) : (
        <p className="text-muted">Политика будет опубликована перед открытием формы заявок.</p>
      )}
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
