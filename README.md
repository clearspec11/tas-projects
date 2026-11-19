# TAS Project Tracker

A map-led tracker of Tasmanian public infrastructure projects (federal, state
and local council). For each project it shows who pays, who delivers it, how far
the cost has moved from what was first announced, and whether it is on time,
with a link to the source for every figure.

- Product intent and audience: [`PRODUCT.md`](PRODUCT.md)
- Visual design system: [`DESIGN.md`](DESIGN.md)
- Where the data comes from and its gaps: [`DATA_SOURCES.md`](DATA_SOURCES.md)

## Stack

SvelteKit 2 (Svelte 5 runes) built as a static single-page app, TypeScript,
Tailwind 4, Leaflet for the map, Vitest for tests. Data is bundled in
`src/lib/seed-data.ts` and can optionally be served from Supabase.

## Developing

```sh
npm install
npm run dev
```

| Command | What it does |
|---------|--------------|
| `npm run dev` | Start the dev server on port 5173 |
| `npm run build` | Build the static site into `build/` |
| `npm run preview` | Serve the production build |
| `npm run check` | Type-check with `svelte-check` |
| `npm test` | Run the unit tests |

## Layout

| Path | Contents |
|------|----------|
| `src/routes/` | Map (`/`), contractor scorecards (`/contractors`), insights (`/insights`) |
| `src/lib/metrics.ts` | All calculations: variance, delay, flags, funding, filtering, export |
| `src/lib/seed-data.ts` | The project data |
| `src/lib/data.ts` | Loads from Supabase when configured, otherwise the bundled data |
| `scripts/` | Budget Paper scrapers and the `seed.sql` generator |
| `supabase/` | Table schema, seed SQL and setup notes |

## Data

To change a project, edit `src/lib/seed-data.ts`, then regenerate the database
mirror:

```sh
node scripts/build-seed-sql.mjs
```

Supabase is optional. Copy `.env.example` to `.env` and follow
[`supabase/README.md`](supabase/README.md) to use it; without it the app runs on
the bundled data.

## Deploying

Pushing to `master` runs `.github/workflows/deploy.yml`, which builds the site
and publishes it to the `hostinger` branch for the host to pull. Day-to-day work
happens on `dev`.
