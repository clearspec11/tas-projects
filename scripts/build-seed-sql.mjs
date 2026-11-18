// Regenerates supabase/seed.sql from src/lib/seed-data.ts so the database
// mirror never drifts from the bundled data.
//
// Usage (Node 22.18+, which strips TypeScript types natively):
//   node scripts/build-seed-sql.mjs
//
// The output upserts every project and removes rows whose ids are no longer in
// the seed data, so running it in the Supabase SQL editor brings the table
// fully in line with the app.

import { writeFileSync } from 'node:fs';
import { SEED_PROJECTS } from '../src/lib/seed-data.ts';

const COLUMNS = [
	'id', 'name', 'description', 'category', 'status', 'funding_type', 'government_level',
	'council', 'budget', 'spent', 'original_budget', 'lat', 'lng', 'location_name',
	'start_date', 'expected_end_date', 'actual_end_date', 'contractor',
	'related_project_ids', 'source_url', 'funding_breakdown', 'budget_history', 'last_verified'
];

const str = (v) => (v == null ? 'null' : `'${String(v).replace(/'/g, "''")}'`);
const num = (v) => (v == null ? 'null' : String(v));
const json = (v) => (v == null ? 'null' : `${str(JSON.stringify(v))}::jsonb`);
const textArray = (v) => `ARRAY[${(v ?? []).map(str).join(', ')}]::text[]`;

const FORMAT = {
	budget: num, spent: num, original_budget: num, lat: num, lng: num,
	related_project_ids: textArray, funding_breakdown: json, budget_history: json
};

const rows = SEED_PROJECTS.map(
	(p) => `(${COLUMNS.map((c) => (FORMAT[c] ?? str)(p[c])).join(', ')})`
);

const updates = COLUMNS.filter((c) => c !== 'id').map((c) => `  ${c} = excluded.${c}`);

const sql = `-- Generated from src/lib/seed-data.ts by scripts/build-seed-sql.mjs. Do not edit by hand.
-- Run after schema.sql. Safe to re-run: it upserts every project and removes
-- rows that are no longer in the seed data.
insert into projects (${COLUMNS.join(', ')}) values
${rows.join(',\n')}
on conflict (id) do update set
${updates.join(',\n')},
  updated_at = now();

delete from projects where id not in (${SEED_PROJECTS.map((p) => str(p.id)).join(', ')});
`;

writeFileSync(new URL('../supabase/seed.sql', import.meta.url), sql);
console.log(`Wrote supabase/seed.sql (${SEED_PROJECTS.length} projects).`);
