-- Opt-in saved summaries. Uploaded files and extracted report text are never stored here.
create table if not exists public.saved_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  report_type text not null,
  result jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.saved_reports enable row level security;

create policy "Users can view their own saved reports" on public.saved_reports
  for select using (auth.uid() = user_id);

create policy "Users can save their own reports" on public.saved_reports
  for insert with check (auth.uid() = user_id);
