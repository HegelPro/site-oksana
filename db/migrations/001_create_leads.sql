-- An existing installation can already have the original table and indexes.
CREATE TABLE IF NOT EXISTS public.leads (
  id uuid PRIMARY KEY,
  created_at timestamptz NOT NULL DEFAULT now(),
  course_slug text NOT NULL,
  name text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  consent_at timestamptz NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'new'
    CHECK (status IN ('new', 'contacted', 'closed')),
  mail_status text NOT NULL DEFAULT 'pending'
    CHECK (mail_status IN ('pending', 'sent', 'failed')),
  mail_sent_at timestamptz
);

CREATE INDEX IF NOT EXISTS leads_created_at_idx ON public.leads (created_at);
CREATE INDEX IF NOT EXISTS leads_mail_status_idx ON public.leads (mail_status);
