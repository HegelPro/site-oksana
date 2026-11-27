import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fileURLToPath } from "node:url";
import { MailConfigurationError, sendLeadNotification } from "@/lib/mail";
import { markLeadMailFailed, markLeadMailSent, saveLead } from "@/lib/lead-store";
import { POST } from "./route";

vi.mock("@/lib/mail", () => ({
  MailConfigurationError: class MailConfigurationError extends Error {},
  sendLeadNotification: vi.fn(),
}));
vi.mock("@/lib/lead-store", () => ({
  saveLead: vi.fn(),
  markLeadMailSent: vi.fn(),
  markLeadMailFailed: vi.fn(),
}));

const payload = {
  name: "Анна",
  phone: "+7 999 123-45-67",
  email: "anna@example.com",
  message: "Можно заниматься с нуля?",
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
    vi.stubEnv("LEAD_EMAIL_ENABLED", "true");
    vi.mocked(sendLeadNotification).mockReset();
    vi.mocked(saveLead).mockReset().mockResolvedValue({ id: "lead-1", created: true });
    vi.mocked(markLeadMailSent).mockReset();
    vi.mocked(markLeadMailFailed).mockReset();
    vi.spyOn(console, "error").mockImplementation(() => {});
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("sends a valid application", async () => {
    vi.mocked(sendLeadNotification).mockResolvedValue(undefined);
    const response = await POST(request(payload));
    expect(response.status).toBe(200);
    expect(saveLead).toHaveBeenCalledWith(
      expect.objectContaining({ message: payload.message }),
      true,
      undefined,
    );
    expect(sendLeadNotification).toHaveBeenCalledWith(expect.any(Object), "lead-1");
    expect(markLeadMailSent).toHaveBeenCalledWith("lead-1");
  });

  it("stores a local application without notification mail", async () => {
    vi.stubEnv("LEAD_EMAIL_ENABLED", "false");
    const response = await POST(request(payload));
    expect(response.status).toBe(200);
    expect(saveLead).toHaveBeenCalledWith(
      expect.objectContaining({ message: payload.message }),
      false,
      undefined,
    );
    expect(sendLeadNotification).not.toHaveBeenCalled();
  });

  it("acknowledges a retried submission without sending another notification", async () => {
    vi.mocked(saveLead).mockResolvedValue({ id: "lead-1", created: false });
    const response = await POST(request(payload));
    expect(response.status).toBe(200);
    expect(sendLeadNotification).not.toHaveBeenCalled();
  });

  it("rejects invalid data without sending mail", async () => {
    const response = await POST(request({ ...payload, consent: false }));
    expect(response.status).toBe(400);
    expect(saveLead).not.toHaveBeenCalled();
    expect(sendLeadNotification).not.toHaveBeenCalled();
  });

  it("does not store honeypot submissions", async () => {
    const response = await POST(request({ ...payload, website: "https://spam.example" }));
    expect(response.status).toBe(200);
    expect(saveLead).not.toHaveBeenCalled();
    expect(sendLeadNotification).not.toHaveBeenCalled();
  });

  it("reports a storage failure without sending mail", async () => {
    vi.mocked(saveLead).mockRejectedValue(new Error("database unavailable"));
    const response = await POST(request(payload));
    expect(response.status).toBe(503);
    expect(sendLeadNotification).not.toHaveBeenCalled();
  });

  it("retains the application when SMTP is not configured", async () => {
    vi.mocked(sendLeadNotification).mockRejectedValue(new MailConfigurationError());
    const response = await POST(request(payload));
    expect(response.status).toBe(200);
    expect(markLeadMailFailed).toHaveBeenCalledWith("lead-1");
  });

  it("retains the application when SMTP delivery fails", async () => {
    vi.mocked(sendLeadNotification).mockRejectedValue(new Error("SMTP failed"));
    const response = await POST(request(payload));
    expect(response.status).toBe(200);
    expect(markLeadMailFailed).toHaveBeenCalledWith("lead-1");
  });

  it("rejects an oversized streamed request without relying on Content-Length", async () => {
    const response = await POST(request({ message: "я".repeat(4500) }));
    expect(response.status).toBe(413);
    expect(saveLead).not.toHaveBeenCalled();
  });

  function enableProduction() {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("PUBLIC_LEADS_ENABLED", "true");
    vi.stubEnv("SITE_ORIGIN", "https://example.com");
    vi.stubEnv("PRIVACY_POLICY_PATH", fileURLToPath(import.meta.url));
    vi.stubEnv("PRIVACY_VERSION", "approval-1");
  }

  function publicRequest(ip: string, change = {}, origin = "https://example.com") {
    return new Request("https://example.com/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json", Origin: origin, "X-Site-Client-IP": ip },
      body: JSON.stringify({
        ...payload,
        courseSlug: "yoga-ayurveda-inner-calm",
        privacyVersion: "approval-1",
        ...change,
      }),
    });
  }

  it("keeps production submissions closed until the policy file is installed", async () => {
    enableProduction();
    vi.stubEnv("PRIVACY_POLICY_PATH", "");
    expect((await POST(publicRequest("192.0.2.1"))).status).toBe(503);
    expect(saveLead).not.toHaveBeenCalled();
  });

  it("requires the configured origin, a published course and the current consent revision", async () => {
    enableProduction();
    expect((await POST(publicRequest("192.0.2.2", {}, "https://other.example"))).status).toBe(403);
    expect((await POST(publicRequest("192.0.2.2", { courseSlug: "course-01" }))).status).toBe(400);
    expect((await POST(publicRequest("192.0.2.2", { privacyVersion: "old" }))).status).toBe(409);
    expect(saveLead).not.toHaveBeenCalled();
    expect((await POST(publicRequest("192.0.2.2"))).status).toBe(200);
    expect(saveLead).toHaveBeenCalledWith(expect.any(Object), true, "approval-1");
  });

  it("limits a production client to five attempts in one window", async () => {
    enableProduction();
    for (let attempt = 0; attempt < 5; attempt++) {
      expect((await POST(publicRequest("192.0.2.3"))).status).toBe(200);
    }
    const response = await POST(publicRequest("192.0.2.3"));
    expect(response.status).toBe(429);
    expect(Number(response.headers.get("retry-after"))).toBeGreaterThan(0);
    expect(saveLead).toHaveBeenCalledTimes(5);
  });
});
