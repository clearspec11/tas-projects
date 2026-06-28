---
target: map UI (post VIB-60 overhaul)
total_score: 36
p0_count: 0
p1_count: 0
timestamp: 2026-06-26T01-20-33Z
slug: src-routes-page-svelte
---
# Critique: Map UI (src/routes/+page.svelte) — post VIB-60 overhaul

Re-score after the four-phase overhaul (Lucide icons + card reflex, insights +
projections, sea overlay, plain-language definitions). Prior run was 32/40 under
the overhaul lens; the weak rows it named were the exact targets.

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 4 | Selection ring, filter counts, URL state, banner, sparkline, zoom-aware sea readout |
| 2 | Match System / Real World | 3 | Variance/tier/overrun/budget-usage now defined inline; funding chips (PPP, Gov-Funded-Private) still bare |
| 3 | Consistency and Standards | 4 | Emoji gone, one Lucide vocabulary; InfoTip + BarList are consistent reusable patterns |
| 4 | User Control and Freedom | 4 | Clear-all, Esc, dismissible banner, mobile drill-down, tooltip dismiss |
| 5 | Error Prevention | 3 | Read-only app; little to get wrong |
| 6 | Recognition Rather Than Recall | 4 | Definitions + map orientation + the Insights aggregates remove the click-every-row recall load |
| 7 | Flexibility and Efficiency | 3 | Insights, projection, export, shareable URL; still no keyboard shortcuts or bulk actions |
| 8 | Aesthetic and Minimalist Design | 3 | Components are clean, but the default map view now juggles banner + sea readout + legend + controls + timeline at once |
| 9 | Error Recovery | 4 | Empty state names the problem, one-click clear |
| 10 | Help and Documentation | 4 | InfoTips, first-timer map orientation, glossary, honest provenance |
| **Total** | | **36/40** | **Excellent — but at the floor of the band; three real holds remain** |

36 sits at the bottom of the Excellent band, not a victory lap. The climb is earned
(the four phases hit rows 2, 3, 6, 10 directly), but aesthetic density, power-user
flexibility, and the last of the funding jargon keep it off the top.

## Anti-Patterns Verdict
Deterministic scan: clean (0 findings across map, insights, contractors, components).
LLM: no AI-slop tells. The three the last run named are resolved — emoji icon system
replaced by Lucide, the contractor card-trio reflex broken into a weighted headline,
and the data-dump feel answered by the Insights aggregates + honest projection. The
identity (Island-at-Night teal, bespoke marker language, civic voice) is intact and
now better supported. Charts are hand-rolled SVG/CSS in the sparkline idiom, not a
dropped-in library look.

## What's Working
- **Honest projection** — the "$1.2B if current trends hold" readout and per-project
  forecast label their method and exclude finished work. A civic tool that resists
  false precision builds trust most trackers throw away.
- **De-jargoning via Melt tooltips** — definitions escape the detail panel's scroll
  clip (native popover), work on keyboard and screen reader, and read in plain English.
- **Insights synthesis** — budget-by-category, overrun leaderboard, and delivery
  pipeline give the analyst the at-a-glance read the row list never could.

## Priority Issues

- **[P2] Map default view is overlay-dense.**
  Why: at the whole-island zoom the banner, sea readout, legend, map controls and
  timeline all show at once; the sea readout (new) adds to a frame that was already
  busy. It fades on zoom, which helps, but the first impression competes with itself.
  Fix: let the sea readout and story banner not co-occupy the top; collapse the legend
  to a single affordance by default, or stagger what shows at the island zoom.
  Command: /impeccable layout (or distill).

- **[P2] Funding labels are the last bare jargon.**
  Why: Variance, Tier, Overrun and Budget usage now have InfoTips; the funding chips
  (PPP, Gov-Funded-Private, Government-Contracted) still rely on a prose line. A casual
  visitor reading "PPP" gets no inline definition the way the other terms now give one.
  Fix: extend the InfoTip/glossary treatment to the funding chips. Command: /impeccable clarify.

- **[P2] No power-user accelerators.**
  Why: "/" and Esc exist, but an analyst has no keyboard shortcuts, no bulk actions, no
  saved views beyond the shareable URL. Holds heuristic 7 at 3.
  Fix: a small shortcut set (filter focus, toggle heatmap, jump to insights). Command: /impeccable craft (later).

## Persona Red Flags

**Pat (curious ratepayer):** now lands far better — the "what am I looking at?" legend
tooltip and the projected-overrun readout orient them, and terms define on hover. Still
hits "PPP" undefined, and on mobile the legend (and its orientation tooltip) is hidden,
so a phone-first ratepayer misses the primer.

**Alex (analyst):** the Insights page is the win they wanted; projection + leaderboard +
export cover the read. Still no keyboard accelerators or saved views.

**Casey (mobile):** Insights and the detail tooltips work on phone; the sea readout and
legend orientation are desktop-only, so the map primer doesn't reach them.

## Minor Observations
- Delivery-pipeline chart is a long run of single-count years; grouping or a denser
  timeline would read better.
- The pre-existing TasMap async-`onMount` type error is still on the books (harden/audit).
- Sea readout danger text leans on a text-shadow for legibility over tiles; fine at the
  default basemap, worth re-checking over the satellite layer.

## Questions to Consider
- What is the one thing the map should say at the island zoom, and can the other four
  overlays defer until the user engages?
- Should the map primer (orientation) follow the user to mobile, where they arguably
  need it more?
- Is "PPP" worth spelling out once in the chip itself rather than behind a tooltip?
