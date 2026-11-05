import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MailConfigurationError, sendLeadNotification } from "@/lib/mail";
import { POST } from "./route";

vi.mock("@/lib/mail", () => ({
  MailConfigurationError: class MailConfigurationError extends Error {},
  sendLeadNotification: vi.fn(),
}));

const payload = {
  name: "Анна",
  phone: "+7 999 123-45-67",
  email: "anna@example.com",
  courseSlug: "course-01",
  consent: true,
  website: "",
};

function request(body: unknown) {
  return new Request("http://localhost/api/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/leads", () => {
  beforeEach(() => {
    vi.mocked(sendLeadNotification).mockReset();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });
  afterEach(() => vi.restoreAllMocks());

  it("sends a valid application", async () => {
    vi.mocked(sendLeadNotification).mockResolvedValue(undefined);
    const response = await POST(request(payload));
    expect(response.status).toBe(200);
    expect(sendLeadNotification).toHaveBeenCalledOnce();
  });

  it("rejects invalid data without sending mail", async () => {
    const response = await POST(request({ ...payload, consent: false }));
    expect(response.status).toBe(400);
    expect(sendLeadNotification).not.toHaveBeenCalled();
  });

  it("reports unavailable SMTP configuration", async () => {
    vi.mocked(sendLeadNotification).mockRejectedValue(new MailConfigurationError());
    const response = await POST(request(payload));
    expect(response.status).toBe(503);
    expect((await response.json()).ok).not.toBe(true);
  });

  it("reports SMTP delivery failure", async () => {
    vi.mocked(sendLeadNotification).mockRejectedValue(new Error("SMTP failed"));
    const response = await POST(request(payload));
    expect(response.status).toBe(502);
    expect((await response.json()).ok).not.toBe(true);
  });
});
