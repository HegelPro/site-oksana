"use client";

import { Button } from "@/components/ui/button";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";

type SubmitState = "idle" | "sending" | "success" | "error";

export function LeadForm({ courseSlug, courseTitle }: { courseSlug: string; courseTitle: string }) {
  const [state, setState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "sending") return;

    const form = event.currentTarget;
    const data = new FormData(form);
    setState("sending");
    setMessage("");

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          phone: data.get("phone"),
          email: data.get("email"),
          courseSlug,
          consent: data.get("consent") === "on",
          website: data.get("website"),
        }),
      });
      const result: { ok?: boolean; error?: string } = await response.json();
      if (!response.ok || !result.ok)
        throw new Error(result.error ?? "Не удалось отправить заявку.");
      form.reset();
      setState("success");
      setMessage("Заявка отправлена. Мы свяжемся с вами по указанным контактам.");
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "Не удалось отправить заявку.");
    }
  }

  return (
    <form
      data-testid="lead-form"
      className="rounded-lg border border-[#dfd5e2] bg-paper px-5 pt-[25px] pb-4 shadow-[0_20px_50px_#4b285d07] md:px-7.5 md:pt-8.5 md:pb-5"
      onSubmit={handleSubmit}
    >
      <div
        data-testid="form-header"
        className="mb-[23px] flex flex-col items-start gap-[13px] border-b border-line pb-5.5"
      >
        <span className="text-xs-small font-bold tracking-[.12em] text-violet">ЗАЯВКА НА КУРС</span>
        <strong className="max-w-full font-serif text-[26px] leading-[1.2] font-medium">
          {courseTitle}
        </strong>
      </div>
      <div className="mb-[21px]">
        <label className="mb-[9px] block text-[13px] font-semibold" htmlFor="lead-name">
          Ваше имя
        </label>
        <input
          className="h-13.5 w-full rounded border border-[#cbbfd0] bg-white px-3.5 py-3 text-base text-ink placeholder:text-[#8d8491]"
          id="lead-name"
          name="name"
          type="text"
          autoComplete="name"
          minLength={2}
          maxLength={100}
          placeholder="Как к вам обращаться"
          required
        />
      </div>
      <div className="mb-[21px]">
        <label className="mb-[9px] block text-[13px] font-semibold" htmlFor="lead-phone">
          Телефон
        </label>
        <input
          className="h-13.5 w-full rounded border border-[#cbbfd0] bg-white px-3.5 py-3 text-base text-ink placeholder:text-[#8d8491]"
          id="lead-phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          minLength={7}
          maxLength={25}
          placeholder="+7 999 123-45-67"
          required
        />
      </div>
      <div className="mb-[21px]">
        <label className="mb-[9px] block text-[13px] font-semibold" htmlFor="lead-email">
          Email
        </label>
        <input
          className="h-13.5 w-full rounded border border-[#cbbfd0] bg-white px-3.5 py-3 text-base text-ink placeholder:text-[#8d8491]"
          id="lead-email"
          name="email"
          type="email"
          autoComplete="email"
          maxLength={254}
          placeholder="name@example.com"
          required
        />
      </div>
      <div className="absolute -left-2500 h-[1px] w-[1px] overflow-hidden" aria-hidden="true">
        <label htmlFor="lead-website">Не заполняйте это поле</label>
        <input id="lead-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <label className="flex min-h-11 cursor-pointer items-start gap-[11px] text-xs leading-[1.75] text-muted">
        <input
          className="mx-0 mt-0.5 mb-0 h-[19px] w-[19px] flex-none accent-violet"
          name="consent"
          type="checkbox"
          required
        />
        <span>
          Я согласен(на) на обработку персональных данных.{" "}
          <Link
            className="text-violet underline underline-offset-[3px]"
            href="/privacy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Подробнее
          </Link>
        </span>
      </label>
      <Button className="mt-5.5 w-full" type="submit" disabled={state === "sending"}>
        {state === "sending" ? "Отправляем…" : "Отправить заявку"}
        <span className="text-[length:21px] leading-none font-normal" aria-hidden="true">
          ↗
        </span>
      </Button>
      <p
        className={cn(
          "mx-0 mt-[15px] mb-0 min-h-5 text-[13px] leading-[1.6]",
          state === "success" && "text-success",
          state === "error" && "text-error",
        )}
        role="status"
        aria-live="polite"
      >
        {message}
      </p>
    </form>
  );
}
