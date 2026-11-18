---
target: map UI (VIB-60 overhaul lens)
total_score: 32
p0_count: 0
p1_count: 3
timestamp: 2026-06-25T06-02-35Z
slug: src-routes-page-svelte
---
# Critique: Map UI (src/routes/+page.svelte) — VIB-60 UI overhaul lens

Scored against the VIB-60 brief: de-AI'ify, make it more approachable and
informative, add easy-to-read stats + basic projections/graphs, use the ocean
around Tasmania. Same UI as the 34/40 run; the dip to 32 is a tighter rubric
under the overhaul brief, not a regression.

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 4 | Selection ring, active-filter counts, URL state, banner, cost sparkline |
| 2 | Match System / Real World | 2 | PPP / Gov-Contracted / variance / tier undefined for a public audience |
| 3 | Consistency and Standards | 3 | Emoji icon set renders differently per OS; sidebar 4-tile vs contractors 3-tile diverge |
| 4 | User Control and Freedom | 4 | Clear-all, dismissible banner, Esc, mobile drill-down back |
| 5 | Error Prevention | 3 | Read-only app; little to get wrong |
| 6 | Recognition Rather Than Recall | 3 | Legend is a wall: 6 status colours + 3 tier borders + size, decoded on first load |
| 7 | Flexibility and Efficiency | 3 | Keyboard markers, shareable URL, CSV/JSON, sort; no shortcuts |
| 8 | Aesthetic and Minimalist Design | 3 | Clean, but emoji + dense legend + 4 stat tiles + banner compete; ocean sits empty |
| 9 | Error Recovery | 4 | Empty state names the problem and one-click clears filters |
| 10 | Help and Documentation | 3 | Banner + legend orient; no term definitions, no synthesis of what figures mean |
| **Total** | | **32/40** | **Good — but the overhaul brief targets exactly the weak rows (2,3,6,8)** |

## Anti-Patterns Verdict
Deterministic scan: clean (0 findings). The app is NOT generic SaaS — Island-at-Night
teal, bespoke map encoding, civic voice carry real identity. The remaining AI tells
are three, and they are exactly what "de-AI'ify" means here:
1. **Emoji as the icon system** (🚩 flags, category glyphs, 🔥 Heatmap, 🛰 Satellite,
   📡 Transport). The fastest-build, most-recognisable AI tell; inconsistent across
   platforms. The issue links Lucide for precisely this.
2. **Stat-tile card reflex** — contractors' 3 equal big-number cards is the
   hero-metric template; sidebar's 4-up echoes it.
3. **Data dump, not synthesis** — rows + one per-project sparkline; nothing
   aggregates or projects, so it reads as a generic table-on-a-map.

## What's Working
- **Map encoding** — status fill + tier border + budget size is a genuine, original
  visual language, not a default marker dropped on tiles.
- **Provenance honesty** — verified vs "· illustrative" tagging and the source link
  build trust most civic trackers skip.
- **Detail panel** — budget bar, variance, cost-over-time sparkline, who-pays split,
  plain-language funding line. The most informative surface in the app.

## Priority Issues

- **[P1] Emoji icon system reads as AI-built and renders inconsistently.**
  Why: it's the headline "de-AI'ify" lever; emoji shift glyph per OS/browser and
  undercut the otherwise-bespoke visual language. Fix: adopt Lucide (per the issue)
  across nav, controls, categories, flags, table. Command: /impeccable polish (icon system).

- **[P1] No synthesis: charts and projections are absent.**
  Why: the brief asks for "easy-to-understand stats and basic projections and graphs";
  today only one per-project sparkline exists. Fix: a charts layer (LayerChart/LayerCake
  per the issue) — spend by category, completions timeline, over-budget leaderboard —
  plus a per-project final-cost projection from burn rate / budget_history trend.
  Command: /impeccable shape (chart + projection system).

- **[P1] Public-facing jargon blocks approachability.**
  Why: "more approachable"; PPP, variance, tier, Gov-Contracted are undefined for a
  ratepayer. Fix: inline plain-language definitions (tooltip/popover), one-line "what
  am I looking at" orientation. Command: /impeccable clarify.

- **[P2] The ocean around Tasmania is dead space.**
  Why: the issue explicitly suggests overlaying onto it; Bass Strait + the surrounding
  sea is pure black. Opportunity: float aggregate stats / a small projection chart /
  "state of play" readout anchored in the water. Command: /impeccable shape (sea overlay).

- **[P2] Stat-tile card reflex.**
  Why: contractors' 3 equal cards = hero-metric template; mild but it's the second
  de-AI'ify tell. Fix: differentiate weight, or reframe as an inline leaderboard.
  Command: /impeccable layout.

## Persona Red Flags

**Pat (curious ratepayer — project-specific, public audience):** lands on a dark map
of coloured bubbles; must decode a 10-row legend and 4 abbreviations before anything
means something. No "final cost likely to be $X" projection that a non-expert wants.
Bounces before the detail panel.

**Alex (power user / analyst):** no keyboard shortcuts beyond "/" and Esc; can't see
totals-by-category or a leaderboard without clicking row by row; export exists (good)
but there's no chart to read trends at a glance.

**Sam (accessibility):** emoji convey meaning that screen readers announce
inconsistently ("triangular flag"); colour-coded status leans on hue, though tier
border + label backstop it. Legend is visual-only.

## Minor Observations
- Legend could collapse to a single "what the marks mean" affordance.
- "BIGGEST OVERRUN +36% McConnell Dowell" tile competes with the two neutral tiles for
  the same weight; the outlier deserves more.
- Sparkline is the right idea; it just needs siblings at the aggregate level.

## Questions to Consider
- What if the empty sea showed the one number that matters (total over budget) and a
  projection, so the headline lands before any clicking?
- Could one Lucide set + one chart primitive replace both the emoji and the data-dump
  feel in a single pass?
- What does a confident, non-expert-friendly first 5 seconds look like here?
