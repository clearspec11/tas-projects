# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Public-facing first: everyday Tasmanians who want to see where public money
goes, with no assumed finance or planning background. Secondary users are
journalists and researchers chasing accountability stories (budget blowouts,
delays, contractor patterns) and government/policy staff monitoring the
pipeline. The shared context: someone arrives wanting to understand whether a
specific project, region, or funder is on track, and leaves with a clear,
sourced answer.

## Product Purpose

A map-led tracker of Tasmanian public infrastructure projects (federal, state,
and local council) that makes funding and accountability legible at a glance.
It answers: who is paying for this, who is delivering it, is it on budget, and
is it on time. Success is a stranger landing on the page and, within seconds,
seeing which projects are over budget or overdue, who funds them, and being
able to follow any figure back to its official source. The accountability lens
(funding split, variance, delay, red flags, contractor records) is the spine of
the product, not an add-on.

## Positioning

The one place where federal, state and local council projects in Tasmania sit
together on a single map, each with who pays for it. Budget Papers, the state
pipeline and council pages each cover one tier; none shows all three side by
side. The supporting mechanism is the sourced money trail: cost is followed
from the first public announcement to the latest official estimate, and every
figure links to where it came from.

## Operating Context

- An independent, personal public-interest project. It is not affiliated with
  any government, party, media outlet or contractor.
- Published as a static site at tas.beetoff.xyz. Day-to-day work happens on
  `dev`; `master` deploys.
- Used on phones and desktops. On phones the map and the project list are
  separate full-screen views; on desktop the list overlays the map.
- The data is maintained by hand, not fed live. Each project carries a source
  link and the date its figures were last checked. Sources are ranked primary
  (Budget Papers, federal funding schedules, the Tasmanian Audit Office, the
  responsible agency, council or company), republished official release, and
  secondary (reputable news or an industry tracker, used only where marked).
- Views are shareable: filters, timeline and the open project are carried in
  the URL.

## Capabilities and Constraints

- Three screens: the map with its project list and detail panel, contractor
  scorecards, and insights (funder and region breakdowns, overrun forecast).
- Per project: status, tier of government, funding model, funding split by
  funder where a source gives one, estimated cost over successive Budget
  Papers, variance, delay, flags, contractor and source.
- Filters by status, category, funding model, tier, flagged and contractor;
  search; sort; a timeline range; heatmap and connection overlays; CSV and
  JSON export.
- Terminology: "estimated cost" is the latest official estimate; "spent" is
  money actually paid out; "variance" is measured from the first announced
  cost to the current one; a "flag" marks a project that is over budget or
  overdue.
- Spend is unpublished for most projects. An estimate is never shown as spend,
  and a missing figure is shown as not published.
- Coverage: the goal is every significant Tasmanian public project. The
  current set is a starting point and is not yet complete.
- Supabase is optional; without it the site runs on the bundled data.

## Evidence on Hand

- 37 real projects with cited figures in `src/lib/seed-data.ts`, mirrored in
  `supabase/seed.sql`.
- Per-project sources, source quality and known gaps in `DATA_SOURCES.md`
  (last full check 18 November 2026).
- Budget Paper cost histories built by the scrapers in `scripts/`.
- No testimonials, usage figures, press coverage, endorsements or partner
  logos exist. Future work must not invent them.

## Brand Personality

Calm and approachable on the surface, investigative and bold underneath.
Three words: trustworthy, legible, candid. It should feel like a public-interest
instrument a curious citizen can use without intimidation, while still having a
point of view about accountability: red flags are not buried, blowouts are named
plainly, the money trail is visible. Confident, never cold; clear, never flashy.

## Anti-references

- **Dry government website**: dense bureaucratic tables, blue underlined links,
  flat hierarchy, portal coldness. The data must feel human and navigable, not
  like a PDF budget paper rendered to HTML.
- **Crypto / fintech dark glass**: neon-on-black, glassmorphism, gradient text,
  over-styled trader-dashboard flourishes. Legibility and civic calm beat
  dashboard slickness.
- Also avoid the generic SaaS look (identical card grids, hero-metric template)
  and style-over-substance data-viz where motion and gradients bury the figures.

## Product Principles

- **Accountability leads.** The over-budget / overdue / who-pays signal is the
  first thing a screen communicates. Data and its meaning come before chrome.
- **Legible to a stranger.** Any screen is understandable in seconds by a
  Tasmanian with no finance background. Plain language, clear units, no jargon.
- **Show the money trail.** Funding sources and contractors are first-class, and
  every figure is traceable to an official source, not a footnote.
- **Confident, not cold.** Investigative clarity without bureaucratic dryness or
  trader-dashboard flash. A point of view, expressed through hierarchy and
  honesty rather than decoration.
- **Honest about uncertainty.** Real figures and estimates are visibly
  distinct; the interface never implies precision it doesn't have.

## Accessibility & Inclusion

Target WCAG 2.1 AA. Body text and the muted "secondary" greys on tinted dark
surfaces must meet ≥4.5:1. Status is never
encoded by colour alone (red/green budget state pairs with a label and, for red
flags, an icon) to stay usable for colour-blind users. Honour
`prefers-reduced-motion` for every map and panel transition. Map content has
non-map fallbacks: the sidebar list, search, and project detail convey the same
information without requiring the map.
