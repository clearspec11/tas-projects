---
target: map UI (src/routes/+page.svelte)
total_score: 34
p0_count: 0
p1_count: 0
timestamp: 2026-06-11T07-16-04Z
slug: src-routes-page-svelte
---
# Critique re-run: Map UI (src/routes/+page.svelte) — post usability fixes

Baseline 29/40 (2026-06-08 first run). Changes since: IBM Plex typeset + hierarchy,
11px floor, selection ring, clear-all filters, stale-selection guard, global
focus-visible, keyboard-reachable markers, #f87171 small danger text, 24px slider
thumbs, mobile stacked layout, marker encoding distilled to two codes, honest
legend (flag halo + tier borders), over-budget story banner with See-them filter.

## Design Health Score

| # | Heuristic | Score | Notes |
|---|-----------|-------|-------|
| 1 | Visibility of System Status | 4 | Selection ring on map; active-filter indicators; URL mirrors state; banner frames headline numbers |
| 2 | Match System / Real World | 2 | PPP / Gov Funded / variance still undefined for a public audience |
| 3 | User Control and Freedom | 4 | Clear-all in empty state, filter row, mobile bar; selection auto-clears; banner dismissible |
| 4 | Consistency and Standards | 4 | Unchanged; new components follow the system |
| 5 | Error Prevention | 3 | Read-only app; unchanged |
| 6 | Recognition Rather Than Recall | 4 | Markers down to status fill + tier border; legend lists exactly what marks encode incl. flag halo; rest one hover away |
| 7 | Flexibility and Efficiency | 3 | Keyboard markers added; still no shortcuts or bulk actions |
| 8 | Aesthetic and Minimalist Design | 3 | Simpler marks; desktop filter wall remains (6 controls) |
| 9 | Error Recovery | 4 | Empty state names the problem and offers one-click recovery |
| 10 | Help and Documentation | 3 | Honest legend + banner orientation; no term definitions yet |
| **Total** | | **34/40** | **Good — top of band; ship-ready desktop + usable mobile** |

## Anti-Patterns Verdict
Deterministic scan: clean (0 findings; the 4 overused-font warnings resolved by
the IBM Plex swap). LLM: no AI-slop tells; original marker system, bespoke
timeline, civic voice. Banner copy is plain-sentence, no slogan.

## Evidence (this session, production build :4173)
- Desktop walkthrough: banner -> See them -> 6 over-budget projects, shareable
  ?status=over_budget URL, banner retires. Selection ring verified among
  same-coloured markers. zzz search -> empty state -> one-click full recovery.
- Mobile 375x812: stacked layout, full-bleed map, filter disclosure, banner at
  bottom of map pane clear of controls.
- Contrast: small danger text now #f87171 (5.29:1); other pairs pass (5.7-13.4:1).
- Console: no errors.

## Remaining (all P2)
- Jargon: PPP / Gov Funded / Contracted / variance need inline plain-language
  definitions (clarify).
- Desktop filter wall: 6 always-visible controls; consider progressive
  disclosure like mobile (layout/distill).
- Source links land on top-level domains, not project pages (data work).
- No keyboard shortcuts; flag stat tile could act as a filter (flexibility).
