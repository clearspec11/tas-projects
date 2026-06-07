create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  category text not null check (category in ('transport','health','education','utilities','housing','environment','other')),
  status text not null check (status in ('on_budget','over_budget','under_budget','completed','cancelled')),
  budget bigint not null,
  spent bigint not null default 0,
  lat double precision not null,
  lng double precision not null,
  location_name text not null,
  start_date date not null,
  expected_end_date date,
  contractor text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table projects enable row level security;

create policy "Public read access" on projects for select using (true);
