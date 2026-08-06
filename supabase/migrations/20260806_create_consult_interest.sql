-- This stores opt-in contact details for the future consultation feature only.
-- It does not store report text, report files, or medical information.
create table if not exists public.consult_interest (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 100),
  email text not null unique,
  created_at timestamptz not null default now()
);

alter table public.consult_interest enable row level security;
-- No client policies: writes use the server-only service role in /api/consult-interest.
