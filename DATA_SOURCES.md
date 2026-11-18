# Data Sources

All project data lives in [`src/lib/seed-data.ts`](src/lib/seed-data.ts) as the
`SEED_PROJECTS` array, mirrored to Supabase by
[`supabase/seed.sql`](supabase/seed.sql). Every project is real and every dollar
figure is taken from the source cited on that project. Last full check:
18 November 2026.

It is not a live feed. Figures change, so each row carries a `last_verified`
date and a `source_url`.

## What the money fields mean

| Field | Meaning |
|-------|---------|
| `original_budget` | The first publicly announced total cost. |
| `budget` | The latest official estimated total cost. |
| `spent` | Money actually paid out. `null` when no source publishes it, which is most projects. An estimate is never stored here. |
| `funding_breakdown` | Dollars by funder (federal, state, local, private), only where a source gives them. |
| `funding_note` | A caveat shown with the split: a proposed share, a remainder worked out by subtraction, or an explanation of why dollars are not shown. |
| `budget_history` | The estimated total cost in successive Tasmanian Budget Papers. |

Variance is measured from `original_budget` to the current cost, so it shows how
far a project has moved from what was first announced.

## Source quality

- **Primary**: Tasmanian Budget Papers, Federation Funding Agreement schedules,
  the Tasmanian Audit Office, and the responsible agency, council or company's
  own pages and releases.
- **Republished official release**: a government media release read on a
  republishing site because the original was unreachable.
- **Secondary**: reputable news or an industry tracker. Used only where marked.

## State and federal projects

| ID | Project | Cost source | Notes |
|----|---------|-------------|-------|
| 1 | New Bridgewater Bridge | Budget Papers 2019-20 to 2026-27 (primary) | Funding split from 2026-27 BP1 Table 7.5 and the federal land transport schedule. Opening date from a republished government release. |
| 2 | Royal Hobart Hospital Redevelopment (K-Block) | Auditor-General Report No. 5 of 2019-20 (primary) | Report predates completion; no final cost found. Completion date seen only as a search-result quote of the government announcement. |
| 3 | Launceston General Hospital Redevelopment - Stage 2 | Budget Papers 2022-23 to 2026-27 (primary) | No federal contribution found. |
| 4 | Cradle Mountain Experience (cableway) | Budget Papers 2019-20 to 2026-27 (primary) | Not built. The $190M figure and its split are contingent on federal funding. |
| 5 | Tasman Highway - Great Eastern Drive upgrades | Tasmanian Government releases, Feb and Nov 2025 (republished) | Program-level figure; no cost is published for individual packages. |
| 6 | Devonport Living City - Stage 1 | Devonport City Council; Prime Minister's release, 23 Jul 2018 (primary) | Council share is the remainder. Completion year only. |
| 7 | UTAS southern campus move | ABC News, Nov 2024 and Oct 2026 (secondary) | Abandoned in November 2024. |
| 8 | Greater South East Irrigation Scheme | Tasmanian Irrigation fact sheet, May 2026 (primary) | Shares add to $300M against a $301M cost. |
| 9 | Cooee to Wynyard Coastal Pathway | Burnie City and Waratah-Wynyard councils (primary) | The rise from $3.7M reflects $12M added for coastal erosion works. |
| 10 | Greater Hobart Rapid Bus Network - planning | Federal land transport schedule, 2025-26 (primary) | Planning money only. The $860M network estimate is unfunded. |
| 11 | West Coast Wilderness Railway funding | 2026-27 BP1 (primary) | Covers capital and operating costs together. |
| 13 | Marinus Link - Stage 1 | Marinus Link, Jul and Sep 2025 (primary) | Earlier $2.9B estimate is from an industry tracker (secondary) and is not used as the baseline. |
| 14 | Tarraleah Hydropower Redevelopment | Hydro Tasmania, 2023 and Mar 2026 (primary) | The two estimates are in 2023 and 2024 dollars respectively. No investment decision yet. |
| 15 | Hobart Airport Runway Upgrade | Hobart Airport release, 1 May 2024 (primary) | |
| 16 | Macquarie Point Multipurpose Stadium | 2026-27 BP1 and BP4 (primary) | First-announced $715M is from Pulse Tasmania (secondary). Borrowings are the remainder, not a published figure. A fixed-price contract was expected by the end of 2026 and may change the cost. |
| 17 | North West Transmission Developments - Stage 1 | TasNetworks releases, May and Aug 2026 (primary) | Loan, equity and grant overlap, so no split is shown. |
| 18 | UTAS Stadium Redevelopment | City of Launceston (primary); Pulse Tasmania (secondary) for split, contractor and dates | |
| 19 | Northern Suburbs Community Recreation Hub | Budget Papers 2023-24 and 2026-27 (primary) | Federal amount not stated. |

## Council projects

All from the lead council's own pages and media releases.

| ID | Project | Council | Notes |
|----|---------|---------|-------|
| c11 | Longford Recreation Ground Redevelopment | Northern Midlands | Council share is the remainder. Start date not found. |
| c13 | Albert Hall Redevelopment | City of Launceston | Exact completion date not found. |
| c14 | Princess Theatre and Earl Arts Centre Redevelopment | City of Launceston | Council share is the remainder. |
| c15 | George Town Aquatic, Health and Wellbeing Centre | George Town | Builder named by Pulse Tasmania (secondary). Opening not confirmed from a council source. |
| c16 | Legana Sports Oval | West Tamar | Council share is the remainder. |
| c18 | Perth Early Learning Centre | Northern Midlands | Completion is not confirmed from a primary source. |
| c19 | Launceston City Heart - Stage 1 | City of Launceston | Council gave $19.1M in Aug 2018; listed contributions add to $20.3M. |
| c20 | Newstead Flood Levee | City of Launceston | Council share is the remainder. |

## Historical projects (h01 to h11)

Completed before 2017. Names, estimated total costs and years come from the
2015-16 and 2016-17 Budget Papers, except Brighton Bypass and Kingston Bypass
(Wikipedia) and the Tasmanian Museum and Art Gallery redevelopment (TMAG). No
funding split is published for these, so the app shows an **estimated** split
derived from governing tier and delivery model, labelled "est." (see
`resolveFundingBreakdown` in [`src/lib/metrics.ts`](src/lib/metrics.ts)).

## What was removed

An earlier version of this data included entries that could not be matched to a
real, costed project. They were removed or replaced on 18 November 2026:

- Eleven Tamar Valley council projects that had been written as demonstration
  entries. Only the Longford Recreation Ground matched a real project.
- "Northern Suburbs Housing Development": no project of that name exists.
- "TasNetworks Grid Modernisation", "Battery of the Nation", "Hobart Bus Rapid
  Transit", "Tasman Highway - Orford to Spring Bay" and "Hobart Airport Terminal
  Expansion" were replaced by the real, costed projects closest to them (17, 14,
  10, 5 and 15 above).

## Known gaps

- Actual spend to date is published for almost none of these projects.
- Several official sites could not be reached during the check
  (premier.tas.gov.au, transport.tas.gov.au, parliament.tas.gov.au, aer.gov.au,
  utas.edu.au), so some figures rest on republished releases or secondary reports.
- Head contractors are recorded only where a source names them.
- Coordinates are approximate, at site or town level.

## Budget Paper scripts

- [`scripts/build-budget-history.mjs`](scripts/build-budget-history.mjs) and
  [`scripts/scrape-budget-papers.mjs`](scripts/scrape-budget-papers.mjs) read
  the "Estimated Total Cost" column from BP1 Chapter 6 for 2019-20 to 2023-24,
  the years published as HTML. Later papers are PDF only and are read by hand.
- [`scripts/build-seed-sql.mjs`](scripts/build-seed-sql.mjs) regenerates
  `supabase/seed.sql` from the seed data.

Budget Paper data: Tasmanian Government, CC BY.

## Schema

Project shape is defined in [`src/lib/types.ts`](src/lib/types.ts) and mirrored
in [`supabase/schema.sql`](supabase/schema.sql).
