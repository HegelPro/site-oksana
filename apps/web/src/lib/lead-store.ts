import { randomUUID } from "node:crypto";
import { getDatabase } from "./db";
import type { Lead } from "./lead";

export async function saveLead(lead: Lead, sendEmail: boolean, consentVersion?: string) {
  const id = lead.submissionId ?? randomUUID();
  const result = await getDatabase().query(
    `INSERT INTO public.leads (id, course_slug, name, phone, email, message, mail_status, consent_version)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     ON CONFLICT (id) DO NOTHING`,
    [
      id,
      lead.courseSlug,
      lead.name,
      lead.phone,
      lead.email,
      lead.message || null,
      sendEmail ? "pending" : "skipped",
      consentVersion ?? null,
    ],
  );
  return { id, created: result.rowCount === 1 };
}

export async function markLeadMailSent(id: string): Promise<void> {
  await getDatabase().query(
    "UPDATE public.leads SET mail_status = 'sent', mail_sent_at = now() WHERE id = $1",
    [id],
  );
}

export async function markLeadMailFailed(id: string): Promise<void> {
  await getDatabase().query("UPDATE public.leads SET mail_status = 'failed' WHERE id = $1", [id]);
}
