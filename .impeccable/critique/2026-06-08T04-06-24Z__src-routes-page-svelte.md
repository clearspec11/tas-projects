---
target: map UI (src/routes/+page.svelte)
total_score: 29
p0_count: 0
p1_count: 3
timestamp: 2026-06-08T04-06-24Z
slug: src-routes-page-svelte
---
# Critique: Map UI (src/routes/+page.svelte)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Filters/sort/URL all reflect state; no "showing N of M" beyond stat tile |
| 2 | Match System / Real World | 2 | PPP / Gov Funded / Contracted / "variance" unexplained for a public-first audience |
| 3 | User Control and Freedom | 3 | Detail close + URL back work; no clear-all / reset filters |
| 4 | Consistency and Standards | 4 | Shared tokens, chips, rows; highly cohesive |
| 5 | Error Prevention | 3 | Read-only app, few error paths; export safe |
| 6 | Recognition Rather Than Recall | 3 | Legend present, but marker triple-encoding leans on memory |
| 7 | Flexibility and Efficiency | 3 | Deep-link URL, export, sort; no keyboard shortcuts/map a11y |
| 8 | Aesthetic and Minimalist Design | 3 | Clean and restrained; filter block slightly heavy |
| 9 | Error Recovery | 3 | "No projects match filters" empty state exists; no source-link failure handling |
| 10 | Help and Documentation | 2 | Legend is the only help; no term definitions, no orientation |
| **Total** | | **29/40** | **Good (28-35): solid foundation, address weak areas** |

## Anti-Patterns Verdict

**LLM assessment:** Does NOT read as AI-generated. Real domain data, a genuinely custom triple-encoded marker system, a bespoke dual-range timeline slider, and a map-led layout that's executed with intent. The one tell is Inter (everywhere). The 4-stat-tile row is the nearest cliche but it's small and functional, not the big-number hero-metric template.

**Deterministic scan:** detect.mjs returned 4 warnings, all `overused-font` (Inter) in +page.svelte and TasMap.svelte. No gradient text, no side-stripe borders, no flagged glassmorphism, no identical-card-grid.

## Overall Impression

A confident, data-first instrument that mostly honours its "Quiet Auditor" brief. The biggest gap between intent and execution is hierarchy: the type scale is so flat (almost everything 9-14px) that a first-time visitor has no clear entry point, which undercuts the "legible to a stranger" principle. The single highest-value move is to give the screen a visual spine.

## What's Working

- **Marker system is genuinely original** - status fill + tier border + funding dash encode three dimensions on one mark; nothing about it reads as templated.
- **The detail panel is the peak moment** - variance %, schedule delay, who-pays split, and a real source link land exactly the accountability payload the product promises.
- **Restraint holds** - colour is used as encoding, not decoration; the dark theme has not drifted into the fintech-glass anti-reference (yet).

## Priority Issues

- **[P1] Flat type hierarchy**: Project name (14px) barely outranks its meta (12px) and labels (10px); stat numbers (16px) are the only step up. No clear entry point. Hurts the "legible to a stranger" principle most.
  - Fix: widen the scale - bigger/heavier project titles, make the over-budget % the loud element in a flagged row, give the sidebar a real heading step. Keep the no-hero ceiling but earn 3 clear tiers.
  - Command: /impeccable typeset
- **[P1] Micro-text legibility**: 9-10px muted-grey labels and location names (#94a3b8 on #1e293b) sit at the edge of AA and below comfortable reading for a public audience.
  - Fix: floor label sizes at ~11px, bump secondary text toward ink, verify every text/bg pair at >=4.5:1.
  - Command: /impeccable audit (contrast) then /impeccable typeset
- **[P1] Marker triple-encoding overloads working memory**: fill + border-colour + dash require constant legend reference; tier is encoded by border colour alone (no label on the mark).
  - Fix: default to two codes (status fill + flag), move tier/funding to hover or filter emphasis; or make the legend persistently glanceable.
  - Command: /impeccable distill
- **[P2] Filter wall, no reset**: search + 4 selects + sort = 6 controls always visible before the data; no clear-all.
  - Fix: progressive disclosure (primary filters visible, advanced collapsed) and a reset-filters affordance.
  - Command: /impeccable layout
- **[P2] Jargon for a public-first audience**: PPP, Gov Funded, Contracted, "variance" are unexplained.
  - Fix: inline definitions / tooltips on funding terms; plain-language gloss.
  - Command: /impeccable clarify
- **[P2] No orientation for newcomers**: a citizen landing cold gets no one-line "what this is / how to read it / click a marker".
  - Fix: a brief framing line or first-run hint; teach the marker encoding in context.
  - Command: /impeccable onboard

## Persona Red Flags

**Pat (public-first citizen, no finance background)**: Hits "PPP" and "variance" with no definition; sees a triple-encoded marker field with no idea the dots are clickable; no sentence tells them what they're looking at. Likely bounces before clicking a project.

**Sam (accessibility-dependent)**: Governing tier is encoded by marker border colour alone (no text on the mark). 9-10px muted labels are hard at AA. Map interaction and toggle focus rings are unverified for keyboard-only use.

**Alex (power user)**: No keyboard shortcuts, no clear-all filters, map is mouse-only. Deep-link URLs and CSV/JSON export are the wins that keep Alex around.

## Minor Observations

- No "showing N of M projects" affordance when filters narrow the list (the stat tile updates but isn't framed as a count).
- Heatmap mode pushes orange/red glow that flirts with the dark-glass anti-reference; keep an eye on it.
- Source links all point to top-level domains; fine, but a citizen may expect the specific project page.
- Inter is the lone slop tell; a more distinctive face would sharpen the identity.

## Questions to Consider

- What would orient a first-time citizen in the first 5 seconds without adding chrome?
- Does every marker need three simultaneous encodings, or is that richness the power-user's and clutter for everyone else?
- What's the confident version of the sidebar header - could the stat row itself be the headline?
