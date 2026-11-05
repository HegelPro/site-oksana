import nodemailer from "nodemailer";
import { getCourse } from "@oksana/catalog";
import type { Lead } from "./lead";

export class MailConfigurationError extends Error {}

function getMailConfig() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM, LEAD_TO } = process.env;
  const port = Number(SMTP_PORT);

  if (
    !SMTP_HOST ||
    !SMTP_PORT ||
    !Number.isInteger(port) ||
    port < 1 ||
    port > 65535 ||
    !SMTP_USER ||
    !SMTP_PASSWORD ||
    !SMTP_FROM ||
    !LEAD_TO
  ) {
    throw new MailConfigurationError("SMTP configuration is incomplete");
  }

  return {
    host: SMTP_HOST,
    port,
    user: SMTP_USER,
    password: SMTP_PASSWORD,
    from: SMTP_FROM,
    to: LEAD_TO,
  };
}

export async function sendLeadNotification(lead: Lead) {
  const config = getMailConfig();
  const course = getCourse(lead.courseSlug);
  if (!course) throw new Error("Unknown course");

  const transport = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.port === 465,
    requireTLS: config.port !== 465,
    auth: { user: config.user, pass: config.password },
  });

  await transport.sendMail({
    from: config.from,
    to: config.to,
    replyTo: lead.email,
    subject: `Новая заявка на курс: ${course.title}`,
    text: [
      "Новая заявка с сайта Оксаны",
      "",
      `Курс: ${course.title} (${course.slug})`,
      `Имя: ${lead.name}`,
      `Телефон: ${lead.phone}`,
      `Email: ${lead.email}`,
      `Согласие на обработку данных: да`,
      `Дата: ${new Date().toISOString()}`,
    ].join("\n"),
  });
}
