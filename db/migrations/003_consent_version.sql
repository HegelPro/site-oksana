ALTER TABLE public.leads
  ADD COLUMN consent_version text CHECK (consent_version ~ '^[a-zA-Z0-9._-]{1,64}$');

GRANT INSERT (consent_version) ON public.leads TO oksana_app;
