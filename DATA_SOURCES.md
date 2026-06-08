# Data Sources

All project data lives in [`src/lib/seed-data.ts`](src/lib/seed-data.ts) as the
`SEED_PROJECTS` array. It is **seed / demonstration data** — not a live feed and
not an authoritative budget register. Figures (budget, spent, dates) are
approximate or illustrative and should not be cited as official.

There is no API ingestion or scraper. To change the data, edit `seed-data.ts`
directly (or load from Supabase — see [`src/lib/supabase.ts`](src/lib/supabase.ts)).

## What's real vs illustrative

| Group | IDs | Basis |
|-------|-----|-------|
| State / federal projects | `1`–`17` | Real Tasmanian infrastructure projects. Names, locations, contractors are real; **dollar figures and dates are approximate/illustrative**. |
| Tamar Valley local council projects | `c01`–`c12` | **Illustrative.** Plausible council-scale projects across Launceston City, West Tamar, George Town, and Northern Midlands councils. Names, budgets, and dates are invented for the demo. Added in commit `38ea4fa`. |

## Reference links for the real (1–17) projects

| ID | Project | Source |
|----|---------|--------|
| 1 | Bridgewater Bridge Replacement | Tas Dept of State Growth — newbridgewaterbridge.com.au |
| 2 | Royal Hobart Hospital Redevelopment | Tasmanian Health Service |
| 3 | Launceston General Hospital Masterplan | Tasmanian Health Service |
| 4 | Cradle Mountain Visitor Experience | Tas Parks & Wildlife / RACT |
| 5 | Tasman Highway – Orford to Spring Bay | Tas Dept of State Growth |
| 6 | Devonport Living City | Devonport City Council — livingcity.com.au |
| 7 | Hobart City Deal – UTAS Relocation | University of Tasmania / Hobart City Deal |
| 8 | South East Irrigation Scheme – Tranche 3 | Tasmanian Irrigation |
| 9 | Burnie to Wynyard Coastal Pathway | Cradle Coast Authority / councils |
| 10 | Hobart Bus Rapid Transit | Tas Dept of State Growth |
| 11 | Queenstown Heritage Railway (West Coast Wilderness Rly) | West Coast Council |
| 12 | Northern Suburbs Housing Development | Homes Tasmania |
| 13 | Marinus Link – Bass Strait Cable | marinuslink.com.au |
| 14 | Battery of the Nation – Hydro Expansion | Hydro Tasmania |
| 15 | Hobart Airport Terminal Expansion | Hobart Airport |
| 16 | Macquarie Point Precinct | macquariepoint.com |
| 17 | TasNetworks Grid Modernisation | TasNetworks |

### Authoritative sources to verify real figures

- Tasmanian Budget papers — treasury.tas.gov.au/budget
- Dept of State Growth (transport/roads) — stategrowth.tas.gov.au
- Infrastructure Tasmania — infrastructure.tas.gov.au
- Project-specific official sites listed above

## Schema

Project shape defined in [`src/lib/types.ts`](src/lib/types.ts). Geographic
constants (Tasmania centre/zoom, boundary GeoJSON) in
[`src/lib/tasmania-geo.ts`](src/lib/tasmania-geo.ts) and
[`src/lib/tasmania-boundary.json`](src/lib/tasmania-boundary.json).
