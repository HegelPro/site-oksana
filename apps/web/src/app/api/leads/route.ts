import { NextResponse } from "next/server";
import { isIP } from "node:net";
import { logDatabaseError } from "@/lib/db";
import { parseLead } from "@/lib/lead";
import { MailConfigurationError, sendLeadNotification } from "@/lib/mail";
import { markLeadMailFailed, markLeadMailSent, saveLead } from "@/lib/lead-store";
import { readLeadRequest, takeLeadSlot, tooLarge } from "@/lib/lead-request";
import { publicLeadSettings, usesPublicSettings } from "@/lib/site-settings";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const production = usesPublicSettings();
  const settings = production ? publicLeadSettings() : undefined;
  if (production && !settings) {
    return NextResponse.json({ error: "Приём заявок пока закрыт." }, { status: 503 });
  }

  if (
    request.headers.get("content-type")?.split(";")[0]?.trim().toLowerCase() !== "application/json"
  ) {
    return NextResponse.json({ error: "Неверный формат запроса." }, { status: 415 });
  }

  if (settings) {
    const ip = request.headers.get("x-site-client-ip") ?? "";
    if (request.headers.get("origin") !== settings.origin || !isIP(ip)) {
      return NextResponse.json({ error: "Отправьте заявку со страницы курса." }, { status: 403 });
    }
    const retry = takeLeadSlot(ip);
    if (retry) {
      return NextResponse.json(
        { error: "Слишком много заявок. Попробуйте позже." },
        {
          status: 429,
          headers: { "Retry-After": String(retry) },
        },
      );
    }
  }

  let input: unknown;
  try {
    input = await readLeadRequest(request);
  } catch {
    return NextResponse.json({ error: "Не удалось прочитать заявку." }, { status: 400 });
  }

  if (input === tooLarge) {
    return NextResponse.json({ error: "Слишком большой запрос." }, { status: 413 });
  }

  const result = parseLead(input);
  if (!result.success) {
    return NextResponse.json(
      { error: "Проверьте поля формы и попробуйте ещё раз." },
      { status: 400 },
    );
  }

  // Скрытое поле затрудняет автоматическую отправку. Ответ одинаковый, чтобы бот не мог проверить ловушку.
  if (result.data.website) return NextResponse.json({ ok: true });

  if (settings && result.data.privacyVersion !== settings.privacyVersion) {
    return NextResponse.json(
      {
        error: "Политика обработки данных обновилась. Обновите страницу и заполните форму заново.",
      },
      { status: 409 },
    );
  }

  const sendEmail =
    process.env.LEAD_EMAIL_ENABLED === undefined
      ? process.env.NODE_ENV !== "development"
      : process.env.LEAD_EMAIL_ENABLED === "true";
  let saved: Awaited<ReturnType<typeof saveLead>>;
  try {
    saved = await saveLead(result.data, sendEmail, settings?.privacyVersion);
  } catch (error) {
    logDatabaseError("Failed to save lead", error);
    return NextResponse.json(
      { error: "Не удалось сохранить заявку. Попробуйте ещё раз позже." },
      { status: 503 },
    );
  }

  if (!sendEmail || !saved.created) return NextResponse.json({ ok: true });
  const { id } = saved;

  try {
    await sendLeadNotification(result.data, id);
  } catch (error) {
    try {
      await markLeadMailFailed(id);
    } catch (statusError) {
      logDatabaseError("Failed to update lead mail status", statusError);
    }
    if (error instanceof MailConfigurationError)
      console.error("Lead mail is not configured", { id });
    else console.error("Failed to send lead notification", { id });
    return NextResponse.json({ ok: true });
  }

  try {
    await markLeadMailSent(id);
  } catch (error) {
    logDatabaseError("Failed to update lead mail status", error);
  }

  return NextResponse.json({ ok: true });
}
