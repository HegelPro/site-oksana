import { beforeEach, describe, expect, it, vi } from "vitest";
import { markLeadMailFailed, markLeadMailSent, saveLead } from "./lead-store";

const { query } = vi.hoisted(() => ({ query: vi.fn() }));

vi.mock("./db", () => ({ getDatabase: () => ({ query }) }));

const lead = {
  name: "Анна",
  phone: "+7 999 123-45-67",
  email: "anna@example.com",
  message: "Можно заниматься с нуля?",
  courseSlug: "course-01",
  consent: true as const,
  website: "",
};

describe("PostgreSQL lead store", () => {
  beforeEach(() => {
    query.mockReset().mockResolvedValue({ rowCount: 1 });
  });

  it("inserts the form fields and updates the mail status", async () => {
    const { id, created } = await saveLead(lead, true, "2026-11-27");
    expect(created).toBe(true);
    expect(id).toMatch(/^[0-9a-f-]{36}$/);
    expect(query).toHaveBeenNthCalledWith(1, expect.stringContaining("INSERT INTO public.leads"), [
      id,
      "course-01",
      "Анна",
      "+7 999 123-45-67",
      "anna@example.com",
      "Можно заниматься с нуля?",
      "pending",
      "2026-11-27",
    ]);

    await markLeadMailFailed(id);
    await markLeadMailSent(id);
    expect(query).toHaveBeenNthCalledWith(2, expect.stringContaining("mail_status = 'failed'"), [
      id,
    ]);
    expect(query).toHaveBeenNthCalledWith(3, expect.stringContaining("mail_status = 'sent'"), [id]);
  });

  it("reuses the submission id and stores an empty message as null when email is disabled", async () => {
    const submissionId = "fc552f79-34fc-4e14-b631-28d00186ddb1";
    query.mockResolvedValueOnce({ rowCount: 0 });
    await expect(saveLead({ ...lead, message: "", submissionId }, false)).resolves.toEqual({
      id: submissionId,
      created: false,
    });
    expect(query).toHaveBeenCalledWith(expect.stringContaining("ON CONFLICT (id) DO NOTHING"), [
      submissionId,
      lead.courseSlug,
      lead.name,
      lead.phone,
      lead.email,
      null,
      "skipped",
      null,
    ]);
  });

  it("rejects a failed insert", async () => {
    query.mockRejectedValueOnce(new Error("database unavailable"));
    await expect(saveLead(lead, false)).rejects.toThrow("database unavailable");
  });
});
