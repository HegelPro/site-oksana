import { NextResponse } from "next/server";
import { parseLead } from "@/lib/lead";
import { MailConfigurationError, sendLeadNotification } from "@/lib/mail";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return NextResponse.json({ error: "Неверный формат запроса." }, { status: 415 });
  }

  if (Number(request.headers.get("content-length") ?? 0) > 8192) {
    return NextResponse.json({ error: "Слишком большой запрос." }, { status: 413 });
  }

  let input: unknown;
  try {
    const body = await request.text();
    if (body.length > 8192)
      return NextResponse.json({ error: "Слишком большой запрос." }, { status: 413 });
    input = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Не удалось прочитать заявку." }, { status: 400 });
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

  try {
    await sendLeadNotification(result.data);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof MailConfigurationError) {
      console.error("Lead mail is not configured");
      return NextResponse.json(
        { error: "Отправка заявок пока недоступна. Попробуйте позже." },
        { status: 503 },
      );
    }
    console.error("Failed to send lead notification", error);
    return NextResponse.json(
      { error: "Не удалось отправить заявку. Попробуйте ещё раз позже." },
      { status: 502 },
    );
  }
}
