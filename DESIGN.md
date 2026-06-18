---
name: TAS Project Tracker
description: A map-led accountability tracker for Tasmanian public infrastructure.
colors:
  bg: "#0a181d"
  surface: "#102329"
  surface-hover: "#173138"
  border: "#22424c"
  ink: "#eef6f6"
  muted: "#9bb8bc"
  accent: "#38bdf8"
  on-budget: "#22c55e"
  over-budget: "#ef4444"
  under-budget: "#38bdf8"
  completed: "#a78bfa"
  cancelled: "#6b7280"
  fund-federal: "#6366f1"
  fund-state: "#38bdf8"
  fund-local: "#34d399"
  fund-private: "#f59e0b"
typography:
  stat:
    fontFamily: "'IBM Plex Mono', ui-monospace, monospace"
    fontSize: "1.375rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.01em"
  display:
    fontFamily: "'IBM Plex Sans', system-ui, -apple-system, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  title:
    fontFamily: "'IBM Plex Sans', system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: "'IBM Plex Sans', system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "'IBM Plex Sans', system-ui, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.06em"
  mono:
    fontFamily: "'IBM Plex Mono', ui-monospace, SFMono-Regular, monospace"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.2
rounded:
  sm: "6px"
  md: "8px"
  lg: "12px"
  full: "9999px"
spacing:
  xs: "6px"
  sm: "8px"
  md: "12px"
  lg: "16px"
components:
  panel:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "16px"
  input-filter:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "6px 12px"
  toggle-map:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "8px 12px"
  toggle-map-active:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.accent}"
    rounded: "{rounded.md}"
    padding: "8px 12px"
  list-row:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    padding: "12px"
  list-row-selected:
    backgroundColor: "{colors.surface-hover}"
    textColor: "{colors.ink}"
    padding: "12px"
  chip-status:
    textColor: "{colors.on-budget}"
    rounded: "{rounded.full}"
    padding: "2px 8px"
---

# Design System: TAS Project Tracker

## 1. Overview

**Creative North Star: "The Quiet Auditor"**

The interface is calm and legible on the surface and rigorous underneath. A
Tasmanian with no finance background should land on the map and, within seconds,
read which projects are over budget or overdue, who funds them, and follow any
figure to its source. The auditor does not shout; it lays the record out
plainly and lets the red flags be the loud moments. Density is high (this is a
working instrument, not a brochure) but never cramped: the data leads, the chrome
recedes.

The system is "The Island at Night": a dark workspace whose neutrals are tinted
toward the Tasman sea rather than generic blue-slate, with a luminous teal
coastline, a faint aurora australis over the Southern Ocean, and the island
silhouette as the brand mark. The map and its coloured markers carry the
signal. Colour is functional, never decorative: green/red/blue/violet
encode budget state, four distinct hues encode who pays, and a single sky accent
marks interactive and selected elements. Everything that isn't data is a quiet
neutral. The one place the auditor raises its voice is accountability: red-flag
rings, over-budget reds, and plain "+$172M (30%)" overruns are allowed to be
visually loud because that is the product's whole point.

This system explicitly rejects two looks. It is **not a dry government website**:
no dense bureaucratic tables, no blue underlined links, no flat hierarchy or
portal coldness. It is **not crypto/fintech dark glass**: no neon-on-black, no
decorative glassmorphism, no gradient text, no trader-dashboard flourishes. The
dark slate theme is watched closely against that second trap; legibility and
civic calm beat dashboard slickness every time.

**Key Characteristics:**
- Dark slate workspace; map and markers carry the colour signal.
- Colour is encoding, not decoration. Neutrals everywhere else.
- High information density, generous within it (clear rows, real spacing rhythm).
- Accountability is allowed to be loud; everything else stays quiet.
- Every figure is traceable; estimates are visibly marked as estimates.

## 2. Colors

A dark slate neutral ramp carries the entire shell; saturated hues are reserved
strictly for data encoding.

### Primary
- **Sky Accent** (`#38bdf8`): The single interactive voice. Focus borders on
  inputs, active map-control toggles, selected/hover affordances, the Tasmania
  coastline outline, source links, and stat headline numbers. Doubles as the
  "under budget" status and the "State" funder, because both are legitimately
  the same civic-blue signal.

### Secondary (status encoding)
- **On-Budget Green** (`#22c55e`): Projects tracking at or under budget.
- **Over-Budget Red** (`#ef4444`): Projects over budget; also the red-flag halo
  ring on the map and the "+variance" overrun text.
- **Completed Violet** (`#a78bfa`): Delivered projects.
- **Cancelled Grey** (`#6b7280`): Shelved or cancelled projects.

### Tertiary (funder encoding)
- **Federal Indigo** (`#6366f1`), **State Sky** (`#38bdf8`), **Local Emerald**
  (`#34d399`), **Private Amber** (`#f59e0b`): The four segments of the "Who pays"
  stacked bar and the governing-tier chips. Chosen to stay distinct from the
  green/red budget-status hues so funding and budget never read as the same axis.

### Neutral (The Island at Night)
The neutrals are tinted toward the Tasman sea (hue ~200), not generic
blue-slate: the workspace is the Southern Ocean after dark, and the basemap is
cast the same way (`sepia + hue-rotate` on the tile pane).
- **Southern Ocean** (`#0a181d`): The base canvas and map background.
- **Sea Surface** (`#102329`): Sidebar, panels, legend, controls.
- **Shallows** (`#173138`): Row hover and selected-row tone.
- **Kelp Line** (`#22424c`): All 1px borders/dividers.
- **Ink** (`#eef6f6`): Primary text.
- **Sea Mist** (`#9bb8bc`, 7.7:1 on Sea Surface): Secondary text, labels.

### Named Rules
**The Encoding-Only Rule.** Saturated colour is forbidden as decoration. Every
green, red, blue, violet, indigo, emerald, or amber on screen must mean
something a reader can decode from the legend. If a colour isn't carrying data,
it is a neutral.

**The Southern Sky Exception.** Exactly one non-encoding colour moment exists:
the aurora australis wash over the Southern Ocean at the bottom of the map
(layered teal/green/violet radial gradients, each ≤10% opacity, 26s breathe,
static under reduced motion). It is geography-anchored atmosphere, never UI
chrome, and it does not grow. The luminous teal coastline (`#2dd4bf` glow +
`#7ee8da` line) is part of the same identity: it marks the island itself, the
one geographic constant.

**The Contrast Floor Rule.** Body and muted text must clear 4.5:1 against their
surface. `--color-muted` (`#94a3b8`) on `--color-surface` (`#1e293b`) is the
known risk; never drop secondary text below this value "for elegance," and never
push captions to a lighter grey than muted.

**The Status-Plus-Label Rule.** Budget state is never encoded by colour alone. A
red dot always travels with the word "Over Budget" and, when flagged, a 🚩 icon,
so the signal survives colour blindness and greyscale.

## 3. Typography

**Display / Body Font:** IBM Plex Sans (with system-ui, -apple-system fallback)
**Mono Font:** IBM Plex Mono (stat numbers, figures, and percentages)

**Character:** The IBM Plex superfamily carries the whole product: Plex Sans for
UI and prose, Plex Mono for every figure. Plex is a civic, institutional
grotesque with quiet personality that fits a public-accountability instrument
and deliberately steps away from the Inter/Geist monoculture. One coherent
family; hierarchy comes from weight and size contrast, and the matching mono
makes numbers read unmistakably as data.

### Hierarchy
Five deliberate steps (~1.2-1.25 ratio), fixed `rem` for spatial predictability:
- **Stat** (Plex Sans, 700, 1.375rem/22px, `tabular-nums`): The loud elements.
  Sidebar stat numbers and the detail panel's Budget / Spent / Variance figures,
  where the screen raises its voice. Proportional (not mono) so big KPI figures
  like "$9.3B" read cleanly; `tabular-nums` keeps digit widths consistent.
- **Display** (Plex Sans, 700, 1.25rem/20px, -0.01em): App wordmark and the
  detail-panel project headline.
- **Title** (600, 0.9375rem/15px): Project names in the sidebar list; the row
  anchor.
- **Body** (400, 0.8125rem/13px, 1.5): Descriptions and detail prose at >=85%
  ink (not muted) so passages stay readable. Cap measure at ~65ch.
- **Label** (600, 0.6875rem/11px, 0.06em, uppercase): Micro section labels
  ("BUDGET", "WHO PAYS"). Reserved for short labels only.

### Named Rules
**The Numbers-Are-Mono Rule.** Small in-row figures that align across rows
(per-row variance, budget-usage %, the funding-split legend) render in IBM Plex
Mono so they read unmistakably as data. Big KPI stats use proportional Plex Sans
with `tabular-nums` instead, to avoid the centred-decimal gap mono gives
abbreviated currency.

**The 11px Floor Rule.** No text renders below 0.6875rem (11px). Micro labels
that were 9-10px are illegible for a public audience; 11px uppercase labels are
the floor, and only the estimate disclaimer (10px) sits beneath it.

**The No-Hero Rule.** Nothing exceeds ~24px. The stat figure (22px) is the
ceiling; a true display headline would be the brochure this product refuses to
be. Hierarchy is earned through weight, the mono/sans split, and placement, not
scale theatrics.

## 4. Elevation

Tonal-first, shadow-sparing. Depth comes primarily from the slate tonal ladder
(bg → surface → surface-hover), and 1px `--color-border` strokes separate
regions. Shadows appear only on elements that genuinely float above the map: the
detail panel, the legend, and the map controls. There is no ambient shadow on
in-flow surfaces like sidebar rows or stat tiles.

### Shadow Vocabulary
- **Floating panel** (`box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5)`,
  Tailwind `shadow-2xl`): The project detail card, which overlays the map.
- **Overlay control** (`box-shadow: 0 10px 15px -3px rgba(0,0,0,0.3)`,
  `shadow-lg`): Legend and map-control clusters resting on the map.

### Named Rules
**The Floats-Over-Map Rule.** A shadow is permitted only when an element
literally floats above the Leaflet canvas (panel, legend, controls). In-flow
surfaces (rows, tiles, chips) stay flat and rely on tone and border. If a shadow
is doing decoration rather than separating from the map, delete it.

## 5. Components

### Buttons
- **Shape:** Gently curved (6px, `rounded-md`); export chips and toggles share it.
- **Export (ghost):** Transparent fill, 1px border (`#334155`), muted text at
  10px. Hover lifts text to ink and border to accent. Used for CSV / JSON export.
- **Map toggle:** Surface fill at 95% with a light backdrop blur (it rests on the
  map), border + ink text at rest; **active** state swaps text and border to the
  sky accent. Used for Satellite / Heatmap / Links.
- **Hover / Focus:** Border-colour and text-colour shift only; no scale bounce.
  Focus-visible must show a visible accent ring (a known gap to harden).

### Chips
- **Status chip:** Tinted-translucent background of the status hue at ~20% over
  matching text (e.g. red-500/20 on red-400). Rounded-full, 10px, 2px 8px pad.
- **Funder / tier chip:** Same translucent-tint formula in the funder hue.
- **State:** Read-only encoders, not interactive. They label; they don't toggle.

### Cards / Containers (panels)
- **Corner Style:** 12px (`rounded-lg`) for the detail panel and legend.
- **Background:** Surface (`#1e293b`) on the BG canvas (`#0f172a`).
- **Shadow Strategy:** `shadow-2xl` for the floating detail panel only (see
  Elevation). The sidebar itself is flat, separated by a 1px right border.
- **Border:** 1px `#334155`.
- **Internal Padding:** 16px (`lg`); compact sub-blocks at 12px.
- **Nesting:** Stat tiles and the funding bar sit inside the panel on the BG
  tone, never as cards-within-cards with their own shadow.

### Inputs / Fields
- **Style:** BG-toned fill (`#0f172a`), 1px `#334155` border, 8px radius, ink
  text, muted placeholder.
- **Focus:** Border shifts to sky accent; no glow. Placeholder must meet the
  same 4.5:1 floor as body text.
- **Selects:** Category / status / funding / level / sort filters share this
  treatment.

### Navigation
- A slim 48px top bar carries the brand (island mark + wordmark) and the route
  links (Map / Contractors): Sea Surface fill, 1px Kelp Line bottom border,
  accent text + accent border on the active route, muted-to-ink hover on the
  rest. Any new route joins this bar; do not introduce a second nav idiom.
- Within the map route the sidebar remains the working nav surface (stats,
  filters, scrollable list); row selection drives the map, detail panel and URL.

### Contractor scorecard (signature component)
- A sortable accountability table at `/contractors`: contractor, project count,
  total budget, money-weighted overrun, flags, clean-record share. Default sort
  is overrun descending so repeat offenders lead. Overrun cells pair a red mini
  bar with the mono figure; **negative spend-to-date is shown as "none", never
  as a green number** (earliness is not an achievement). Rows are links back to
  the map filtered to that contractor (`?contractor=`), surfaced there as a
  dismissible accent chip. Unattributed projects are footnoted, not ranked.

### Map markers (signature component)
- **Circle marker:** Two codes on the mark, no more. Fill encodes budget
  **status**; the 2.5px border colour encodes **governing tier**
  (federal/state/local). Radius scales with budget. Funding/delivery model is
  deliberately NOT marker-encoded (dash patterns proved illegible at marker
  sizes); it lives one hover away in the tooltip and fully in the chips and
  detail panel. The legend is mandatory and must list exactly what the marks
  encode: status colours, the flag halo, tier borders, and the size scale.
- **Red-flag halo:** A separate dashed red (`#ef4444`) ring drawn beneath flagged
  markers, on its own layer so it never inflates cluster counts.
- **Cluster badge:** Translucent sky (`rgba(56,189,248,0.25)`) disc with a 2px
  accent border and ink count. Sized in three steps by child count.

### Stat tiles (header)
- Four tiles; Projects and Budget are read-only, **Over and Flags are filter
  toggles** (aria-pressed, active state = status-coloured border). Clicking
  Flags applies the flagged-only cut, which catches late-but-under-budget
  projects the plain Over filter misses.

### Story banner (signature component)
- A dismissible one-line orientation pinned top-centre over the map:
  "**N projects** are a combined **$X** over budget." with a ghost-accent
  "See them" action that applies the over-budget filter. It retires when
  dismissed (per session) or as soon as a project is selected; once the
  visitor is engaged, its job is done. Plain sentence, red figures, no slogan.

### Provenance indicator (Honest about uncertainty)
- A project is "verified" once `last_verified` is set (figures checked against a
  cited source). Verified rows read plainly; **unverified rows carry a quiet
  muted "· illustrative" tag** after their location in the list, and the detail
  panel shows an amber "Illustrative figures — not yet verified" callout. Verified
  projects instead get a green "✓ Figures verified … last checked DATE" line by
  the source link. The default is honest disclosure of the illustrative majority,
  not a badge of pride on the few.

### Cost-over-time sparkline (signature component)
- In the detail panel, when a project has a `budget_history` of 2+ snapshots: a
  small inline SVG sparkline of the announced Estimated Total Cost across budget
  papers, with the rising segment in over-budget red (flat/down in on-budget
  green), end labels (fiscal year + $), and a "+N% since YYYY-YY" growth chip.
  This carries the original-vs-revised accountability story (e.g. Bridgewater
  $576M → $786M, +36%) that spend-vs-budget alone can't. Renders only when the
  data is verified; absent for illustrative rows.

### Funding split bar (signature component)
- A single flat stacked bar (federal/state/local/private), full-width, 12px tall,
  `rounded-full`, with a legend of `$amount (percent)` below. Marked "· est."
  with an italic disclaimer when the split is derived rather than sourced.

## 6. Do's and Don'ts

### Do:
- **Do** keep saturated colour strictly for data encoding (status, funder, flag);
  everything else is slate neutral.
- **Do** pair every status colour with a text label, and every red flag with the
  🚩 icon, so meaning survives greyscale and colour blindness.
- **Do** render figures (%, $ variance, budget usage) in the mono face.
- **Do** keep `--color-muted` (`#94a3b8`) text at ≥4.5:1 on its surface; bump
  toward ink if a caption sits on a lighter tone.
- **Do** reserve shadows for elements that float above the map (panel, legend,
  controls); keep in-flow rows and tiles flat.
- **Do** mark estimated funding splits as estimates, with a path to the source.

### Don't:
- **Don't** build a **dry government website**: no dense bureaucratic tables, no
  blue underlined links, no flat hierarchy or portal coldness.
- **Don't** drift into **crypto/fintech dark glass**: no neon-on-black, no
  decorative glassmorphism, no gradient text (`background-clip: text` is
  forbidden), no trader-dashboard flourishes. Backdrop blur is allowed only on
  the map-overlay controls where it aids legibility over moving tiles, never as
  surface decoration.
- **Don't** use the generic SaaS look: identical card grids, the big-number
  hero-metric template, or icon-heading-text cards repeated endlessly.
- **Don't** let motion or gradients bury the figures (style-over-substance
  data-viz). Motion is feedback, not choreography here.
- **Don't** add a display/hero type scale; nothing exceeds ~24px (the 22px stat
  figure is the ceiling).
- **Don't** nest cards inside cards, or give an in-flow surface its own shadow.
- **Don't** use a colored `border-left`/`border-right` stripe as an accent on
  rows, panels, or callouts.
