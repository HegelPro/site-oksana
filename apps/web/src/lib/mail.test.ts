import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import nodemailer from "nodemailer";
import { MailConfigurationError, sendLeadNotification } from "./mail";

vi.mock("nodemailer", () => ({ default: { createTransport: vi.fn() } }));

const lead = {
  name: "Анна",
  phone: "+7 999 123-45-67",
  email: "anna@example.com",
  courseSlug: "course-01",
  consent: true as const,
  website: "",
};

const keys = [
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASSWORD",
  "SMTP_FROM",
  "LEAD_TO",
] as const;
const previous = Object.fromEntries(keys.map((key) => [key, process.env[key]]));

describe("sendLeadNotification", () => {
  beforeEach(() => {
    process.env.SMTP_HOST = "smtp.example.com";
    process.env.SMTP_PORT = "465";
    process.env.SMTP_USER = "mailer@example.com";
    process.env.SMTP_PASSWORD = "test-password";
    process.env.SMTP_FROM = "mailer@example.com";
    process.env.LEAD_TO = "owner@example.com";
    vi.mocked(nodemailer.createTransport).mockReset();
  });

  afterEach(() => {
    for (const key of keys) {
      const value = previous[key];
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
  });

  it("sends the selected course and contact details to the configured address", async () => {
    const sendMail = vi.fn().mockResolvedValue({});
    vi.mocked(nodemailer.createTransport).mockReturnValue({ sendMail } as never);

    await sendLeadNotification(lead);

    expect(nodemailer.createTransport).toHaveBeenCalledWith(
      expect.objectContaining({ host: "smtp.example.com", secure: true }),
    );
    expect(sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        from: "mailer@example.com",
        to: "owner@example.com",
        replyTo: "anna@example.com",
        subject: expect.stringContaining("Курс 01"),
        text: expect.stringContaining("+7 999 123-45-67"),
      }),
    );
  });

  it("does not attempt delivery without SMTP configuration", async () => {
    delete process.env.SMTP_HOST;
    await expect(sendLeadNotification(lead)).rejects.toBeInstanceOf(MailConfigurationError);
    expect(nodemailer.createTransport).not.toHaveBeenCalled();
  });
});
