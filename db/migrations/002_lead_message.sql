ALTER TABLE public.leads
  ADD COLUMN message text CHECK (char_length(message) BETWEEN 1 AND 2000),
  DROP CONSTRAINT leads_mail_status_check,
  ADD CONSTRAINT leads_mail_status_check
    CHECK (mail_status IN ('pending', 'sent', 'failed', 'skipped'));

CREATE INDEX leads_course_created_at_idx ON public.leads (course_slug, created_at DESC);

GRANT USAGE ON SCHEMA public TO oksana_app;
REVOKE SELECT, INSERT ON TABLE public.leads FROM oksana_app;
GRANT SELECT (id) ON public.leads TO oksana_app;
GRANT INSERT (id, course_slug, name, phone, email, message, mail_status)
  ON public.leads TO oksana_app;
GRANT UPDATE (mail_status, mail_sent_at) ON public.leads TO oksana_app;
