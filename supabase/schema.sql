-- TAS Project Tracker — projects table
-- Mirrors the Project type in src/lib/types.ts. Run in the Supabase SQL editor.
-- Text id (not uuid) so the seed data's stable ids ("1", "c05") round-trip and
-- related_project_ids keep referring to them.

create table if not exists projects (
  id text primary key,
  name text not null,
  description text not null default '',
  category text not null check (category in
    ('transport','health','education','utilities','housing','environment','community','other')),
  status text not null check (status in
    ('on_budget','over_budget','under_budget','completed','cancelled')),
  funding_type text not null check (funding_type in
    ('public','ppp','gov_funded_private','gov_contracted')),
  government_level text not null check (government_level in ('federal','state','local')),
  council text,
  budget bigint not null,
  spent bigint not null default 0,
  lat double precision not null,
  lng double precision not null,
  location_name text not null,
  start_date date not null,
  expected_end_date date,
  contractor text,
  related_project_ids text[] not null default '{}',
  source_url text,
  funding_breakdown jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Public read-only access (anon key); writes require the service role.
alter table projects enable row level security;

drop policy if exists "Public read access" on projects;
create policy "Public read access" on projects for select using (true);
