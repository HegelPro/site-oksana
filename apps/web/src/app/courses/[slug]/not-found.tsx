import { ButtonLink } from "@/components/ui/button";

export default function CourseNotFound() {
  return (
    <section className="mx-auto min-h-[60vh] w-[min(100%_-_40px,1200px)] py-[75px] max-xs:w-[calc(100%_-_32px)] md:w-[min(100%_-_72px,1200px)]">
      <span className="block text-xs-small leading-[1.6] font-bold tracking-[.17em] text-violet">
        404 / КУРС НЕ НАЙДЕН
      </span>
      <h1 className="mx-0 mt-5 mb-7.5 text-[length:clamp(40px,9vw,68px)] [overflow-wrap:break-word]">
        Такого курса пока нет.
      </h1>
      <p className="leading-[1.8] text-muted">
        Вернитесь в каталог, чтобы посмотреть доступные программы.
      </p>
      <ButtonLink href="/courses">
        Ко всем курсам{" "}
        <span className="text-[length:21px] leading-none font-normal" aria-hidden="true">
          ↗
        </span>
      </ButtonLink>
    </section>
  );
}
