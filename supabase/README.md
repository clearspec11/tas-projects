# Supabase setup

The app runs on bundled seed data out of the box. Point it at Supabase to make
the data live; if the project isn't configured or a query fails, it falls back
to seed data automatically (`src/lib/data.ts`).

## 1. Create the table

In the Supabase SQL editor, run [`schema.sql`](schema.sql), then
[`seed.sql`](seed.sql) to populate it with the 29 demo projects.

`seed.sql` is generated from `src/lib/seed-data.ts` — regenerate it after
editing the seed data with the one-off node script in the project history, or
just edit rows directly in Supabase once it's live.

## 2. Configure the app

Copy the URL and anon (public) key from Supabase → Project Settings → API into
`.env`:

```
PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
```

Restart the dev server. The map and contractor pages now read from Supabase;
open the console to see a warning if a load fails and it falls back to seed.

## Notes

- Row Level Security is on with a public **read-only** policy. The anon key can
  only `select`; inserts/updates need the service role (server-side or the SQL
  editor), so the public site can't be written to.
- `id` is `text` (not `uuid`) so the seed ids (`"1"`, `"c05"`) and the
  `related_project_ids` references round-trip unchanged.
- `funding_breakdown` is `jsonb`; when null, the app derives an estimated split.
