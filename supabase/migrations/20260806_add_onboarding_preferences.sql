alter table public.users
  add column if not exists report_preference text check (report_preference in ('X-ray', 'Lab Report', 'Discharge Summary', 'Imaging')),
  add column if not exists onboarding_completed boolean not null default false;
