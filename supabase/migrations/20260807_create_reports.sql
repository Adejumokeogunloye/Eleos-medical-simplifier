-- Explicitly requested saved-report storage. This table contains sensitive medical text.
create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  report_type text not null,
  original_filename text not null,
  extracted_text text not null,
  simplified_summary_json jsonb not null,
  created_at timestamptz not null default now()
);

alter table public.reports enable row level security;

create policy "Users can view their own reports" on public.reports
  for select using (auth.uid() = user_id);
create policy "Users can create their own reports" on public.reports
  for insert with check (auth.uid() = user_id);
create policy "Users can delete their own reports" on public.reports
  for delete using (auth.uid() = user_id);
