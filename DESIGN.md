---
name: TAS Project Tracker
description: A map-led accountability tracker for Tasmanian public infrastructure, themed as wilderness after dark.
colors:
  bg: "#0c1410"
  surface: "#14201a"
  surface-hover: "#1f2d24"
  border: "#2c3f34"
  ink: "#edf3ea"
  muted: "#9fb1a1"
  accent: "#d7a25c"
  success: "#5aa84f"
  warning: "#e0933a"
  danger: "#df5a39"
  status-on-budget: "#5aa84f"
  status-over-budget: "#df5a39"
  status-under-budget: "#3fa39e"
  status-completed: "#ab8ad6"
  status-cancelled: "#889085"
  tier-federal: "#9a8ad6"
  tier-state: "#3fa39e"
  tier-local: "#5aa84f"
  fund-private: "#e0933a"
typography:
  stat:
    fontFamily: "'IBM Plex Mono', ui-monospace, SFMono-Regular, monospace"
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
  md: "6px"
  lg: "8px"
  xl: "12px"
  full: "9999px"
spacing:
  xs: "6px"
  sm: "8px"
  md: "12px"
  lg: "16px"
components:
  panel-floating:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
    padding: "12px"
  stat-tile:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.accent}"
    rounded: "{rounded.lg}"
    padding: "8px"
  input-filter:
    backgroundColor: "{colors.bg}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "6px 12px"
  button-ghost:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.muted}"
    rounded: "{rounded.md}"
    padding: "6px 10px"
  button-ghost-hover:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "6px 10px"
  button-cta:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.accent}"
    rounded: "{rounded.lg}"
    padding: "6px 12px"
  nav-link:
    textColor: "{colors.muted}"
    rounded: "{rounded.lg}"
    padding: "6px 12px"
  nav-link-active:
    textColor: "{colors.accent}"
    rounded: "{rounded.lg}"
    padding: "6px 12px"
  chip-status:
    rounded: "{rounded.full}"
    padding: "2px 8px"
  list-item:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    padding: "12px"
  list-item-hover:
    backgroundColor: "{colors.surface-hover}"
    textColor: "{colors.ink}"
    padding: "12px"
---

# Design System: TAS Project Tracker

## 1. Overview

**Creative North Star: "Peat and Myrtle After Dark"**

The interface is a Tasmanian wilderness seen after sundown: green peat-and-myrtle neutrals instead of the generic blue-slate of every dashboard, a warm huon-pine and sandstone accent where a SaaS tool would reach for sky-cyan, and an ember red reserved for the things that are on fire (over budget, overdue). The map is the hearth at the centre; everything else is read off it. The mood is calm and approachable on the surface, investigative underneath, exactly as a public-interest instrument for a curious Tasmanian should feel: usable without a finance background, but never shy about naming a blowout.

Depth is built from tone, not decoration. A four-step neutral ramp (`bg` to `surface` to `surface-hover` to `border`) carries every layer; the only shadows in the system belong to the panels that genuinely float over the Leaflet map. Type is one family in two cuts: IBM Plex Sans for everything you read, IBM Plex Mono for every figure you compare, so money reads as data and never as prose. Colour is rationed: the huon-pine accent marks the live thing (current selection, primary action, active nav) and nothing else.

This system explicitly rejects four things named in PRODUCT.md. It is not a **dry government website** (dense bureaucratic tables, blue underlined links, a PDF budget paper rendered to HTML). It is not **crypto/fintech dark glass** (neon-on-black, decorative glassmorphism, gradient text, trader-dashboard flourishes), a real risk for any dark civic tool and the reason the palette went peat-green rather than slate-and-cyan. It avoids the **generic SaaS look** (identical card grids, the hero-metric template) and **style-over-substance data-viz** where motion and gradients bury the figures.

**Key Characteristics:**
- Map-led; the whole-island view is the home state, panels orbit it.
- Tonal depth, near-zero shadow; flat by default.
- One typeface family, two cuts (sans for reading, mono for figures).
- Accountability colour vocabulary: ember = over/overdue, never decorative.
- Restrained accent: huon-pine marks the live thing only.

## 2. Colors

A dark green wilderness palette: peat-and-myrtle neutrals carrying the surface, one warm huon-pine accent, and a small set of semantic data colours for status, governing tier, and funder.

### Primary
- **Huon Pine** (`#d7a25c`): the single brand accent, a warm sandstone-gold. Current map selection ring, primary/active nav state, CTA text and borders, the brand "TAS" wordmark, focus rings, timeline thumbs, sidebar stat figures. Marks the one live thing on a screen; never a fill for large areas.

### Secondary (semantic status)
- **Myrtle Green / On Budget** (`#5aa84f`): healthy budget state; doubles as the Local-council tier colour.
- **Ember / Over Budget** (`#df5a39`): the system's alarm. Over-budget markers and figures, red-flag halos and dashed rings, variance overruns. Always paired with a label or flag icon, never colour alone.
- **Tarn Teal / Under Budget** (`#3fa39e`): under-budget state; doubles as the State-government tier colour.
- **Dusk Mauve / Completed** (`#ab8ad6`): finished projects, on the map and in chips.
- **Lichen Grey / Cancelled** (`#889085`): cancelled or inactive projects; a desaturated green-grey that reads as "switched off".

### Tertiary (tier + funder)
- **Federal Iris** (`#9a8ad6`): federal-government tier (marker border) and the federal slice of funding breakdowns.
- **Tarn Teal** (`#3fa39e`) / **Myrtle Green** (`#5aa84f`): state and local tiers respectively (shared with the status hues above by design, so tier and budget state stay within one family).
- **Ochre / Private** (`#e0933a`): the private-funding slice; shared with the `warning` role.

### Neutral
- **Peat** (`#0c1410`): app background, the deepest layer; also the Leaflet canvas behind the basemap.
- **Myrtle Surface** (`#14201a`): panels, nav, sidebar, cards.
- **Surface Hover** (`#1f2d24`): hovered rows, raised hover state of surface elements.
- **Moss Border** (`#2c3f34`): borders, dividers, input strokes.
- **Snowgum** (`#edf3ea`): primary text/ink, near-white with a faint green cast.
- **Muted Sage** (`#9fb1a1`): secondary text, labels, captions; holds at least 4.5:1 on `surface`.

### Named Rules
**The Ember Rule.** `#df5a39` means one thing: over budget or overdue. It is never used decoratively, never for a hover, never for a generic "primary". If something is ember, it is on fire.

**The One Voice Rule.** The huon-pine accent marks the live thing (current selection, primary action, active nav, focus) and appears on a small fraction of any screen. Its rarity is what makes the selected project legible at a glance.

**The Tier-Within-Family Rule.** Status and governing-tier share hues on purpose (state = under-budget teal, local = on-budget green). Form, not hue, separates them: status is the marker *fill*, tier is the marker *border*.

## 3. Typography

**Display & Body Font:** IBM Plex Sans (with `system-ui, -apple-system, sans-serif`)
**Figure / Mono Font:** IBM Plex Mono (with `ui-monospace, SFMono-Regular, monospace`)

**Character:** One humanist-grotesque family doing all the reading, paired with its monospace sibling for all the counting. The pairing is deliberately within one type family so the interface never looks typeset for marketing; the contrast that matters is sans-for-words versus mono-for-money, not serif-versus-sans flourish. Figures are set with `tabular-nums` so columns of dollars and percentages align as data.

### Hierarchy
- **Stat** (mono, 700, 1.375rem / 22px, line-height 1, -0.01em): the headline accountability figures, sidebar stat tiles, the over-budget count. Mono so the digits align and read as data.
- **Display** (sans, 700, 1.25rem / 20px, line-height 1.2, -0.01em): page and panel headlines, the brand wordmark. The largest sans on the screen; product-scale, not hero-scale.
- **Title** (sans, 600, 0.9375rem / 15px, line-height 1.3): project names in the list, panel section headers.
- **Body** (sans, 400, 0.8125rem / 13px, line-height 1.5): descriptions, prose, secondary detail. Cap prose at 65 to 75ch; data rows may run denser.
- **Label** (sans, 600, 0.6875rem / 11px, line-height 1.2, letter-spacing 0.06em): field labels, legend captions, chip text, eyebrow microcopy. The only place tracked small text is sanctioned.
- **Mono** (mono, 500, 0.75rem / 12px, line-height 1.2): inline figures inside tooltips and rows, percentages, the timeline year readout.

### Named Rules
**The Money-Is-Mono Rule.** Every dollar amount, percentage, and count is set in IBM Plex Mono with `tabular-nums`. If a figure is in the sans body font, it's a bug. Prose is sans; money is mono.

**The Product-Scale Rule.** Headings use a fixed rem scale, never `clamp()` fluid type. The largest type on any screen is the 22px stat. This is an instrument, not a landing page; nothing shouts.

## 4. Elevation

Flat by default. Depth is carried by the tonal ramp, not by shadow: `bg` (`#0c1410`) sits behind `surface` (`#14201a`), which raises to `surface-hover` (`#1f2d24`) on interaction, all separated by the `border` (`#2c3f34`) hairline. In-panel content (the sidebar, nav, project detail, stat tiles, list rows) casts no shadow at all; layering is read from tone and the 1px border alone.

The single exception is the set of panels that genuinely float over the Leaflet map: the legend, the timeline, the over-budget readout, and the map-control cluster. These earn a soft shadow plus a light backdrop-blur because they sit above live, moving map tiles and need to detach from them. Shadow here is structural (it says "this hovers over the map"), never ambient decoration.

### Shadow Vocabulary
- **Map-float** (`box-shadow: 0 10px 15px -3px rgba(0,0,0,0.3)` via `shadow-lg`, with `backdrop-filter: blur` on a `surface/95` fill): the only sanctioned shadow. Legend, timeline, sea readout, map controls.
- **Sidebar edge** (`box-shadow: 4px 0 28px rgba(0,0,0,0.45)`): the desktop sidebar's right edge when it slides in over the map, so the overlay reads as lifted above the tiles.

### Named Rules
**The Flat-In-Panel Rule.** Nothing inside a panel casts a shadow. If a sidebar card, list row, or stat tile has a `box-shadow`, remove it; it should be defined by tone and border. Shadow is reserved for things that float over the map.

## 5. Components

### Buttons
- **Shape:** gently rounded. Small controls (export, filter toggles) use 6px (`rounded-md`); nav links and CTAs use 8px (`rounded-lg`).
- **There is no filled-accent primary button.** Actions are bordered/ghost. The accent appears as text plus border colour, not as a fill, keeping with the One Voice Rule.
- **Ghost (default action):** `surface` background, `muted` text, 1px `border`. Hover lifts text to `ink` and the border to `accent`. Used for CSV/JSON export, "More filters", "Clear".
- **CTA (call to action):** `surface` background, `accent` text, 1px `accent` border; hover fills with `accent` at 10%. Used for "See them", "Clear all filters", "See the full forecast".
- **Hover / Focus:** colour transitions only (~150ms). Every focusable control gets the global focus ring: `2px solid accent`, `2px` offset.

### Chips / Badges
- **Status chip:** pill (`rounded-full`), 2px by 8px padding, label text. Background is the status colour at 15% opacity with a lightened text tint (e.g. on-budget `#5aa84f` at 15% plus `#7cc070` text). Always carries the status word; colour never stands alone.
- **Tier chip:** pill, tier colour at ~12 to 20% opacity background with the tier colour as text (`Federal` / `State` / `Council`).
- **Filter chip (contractor):** `accent` at 15% background, `accent` text, with an inline dismiss (X) button.

### Cards / Containers
- **Floating panel (over map):** 12px corners (`rounded-xl`), `surface/95` plus backdrop-blur, 1px `border`, `shadow-lg`, 12px padding. Legend, timeline, sea readout.
- **Flat panel (sidebar / nav / detail):** `surface` fill, 1px `border`, no radius on full-height edges, no shadow.
- **Stat tile:** `bg` fill, 8px corners (`rounded-lg`), 8px padding, centred; the figure in the Stat (mono) role, accent or semantic colour, with a Muted Sage label beneath. Never nest a card inside a card.
- **Internal padding:** 12px (`md`) is the default panel padding; 8px (`sm`) for compact tiles; 16px (`lg`) for roomier sections.

### Inputs / Fields
- **Style:** `bg` (the deep peat, one step below the surrounding `surface`), 1px `border`, 8px corners (`rounded-lg`), 6px by 12px padding, `ink` text.
- **Placeholder:** Muted Sage, meeting the same 4.5:1 contrast as body text (no faint grey placeholders).
- **Focus:** border shifts to `accent` (plus the global focus-visible ring). No glow.
- **Select / range:** same treatment; the timeline uses custom huon-pine thumbs (20px, white ring) on a `border` rail with an `accent` selected span.

### Navigation
- **Top bar:** 48px tall, `surface` fill, 1px bottom `border`. Brand wordmark left (Tasmania silhouette in `accent` plus "TAS" in `accent`), nav links right.
- **Nav link:** `muted` text, 8px corners, transparent border at rest. Hover lifts to `ink` text plus `border`. Active: `accent` text plus `accent` border, with `aria-current="page"`.
- **Mobile:** a Map/List segmented switch replaces the side-by-side layout; each view gets the full screen.

### Map Markers (signature component)
- **Project marker:** Leaflet `circleMarker`, radius scaled by budget (8 to 20px). **Fill = status** colour at 0.8 opacity; **border = governing tier** colour at 2.5px. Two codes on one mark, decoded by the legend.
- **Red-flag halo:** a dashed ember (`#df5a39`) ring behind any over-budget/overdue marker, on its own layer.
- **Selection ring:** a pulsing 3px huon-pine ring (`tas-selected-ring`), honouring `prefers-reduced-motion` by holding still.
- **Cluster:** circular `accent` at 22% fill with a 2px `accent` border and the count in `ink`.

### Sidebar Slide Tab (signature component)
- The desktop projects panel is hidden by default and slides in from the left over the map; a vertical tab handle rides its right edge as the toggle, carrying a rotated "Projects" label and an active-filter count badge. The tab and panel animate together (280ms, `cubic-bezier(0.4,0,0.2,1)`); the legend and timeline shift right in lockstep so nothing hides behind the panel.

## 6. Do's and Don'ts

### Do:
- **Do** keep the map the centre of gravity. The whole-island view is home; panels orbit it and slide clear of each other.
- **Do** set every figure in IBM Plex Mono with `tabular-nums` (the Money-Is-Mono Rule). Prose in IBM Plex Sans.
- **Do** reserve `#df5a39` ember for over-budget/overdue only (the Ember Rule), always paired with a label or flag icon so status is never colour-alone (WCAG, colour-blind users).
- **Do** build depth from the `bg` to `surface` to `surface-hover` to `border` tonal ramp; keep in-panel content flat (the Flat-In-Panel Rule).
- **Do** mark the live thing with huon-pine `#d7a25c` and almost nothing else (the One Voice Rule).
- **Do** keep `muted` (`#9fb1a1`) text at 4.5:1 or better on `surface`; placeholders get the same contrast as body text, never a faint grey.
- **Do** honour `prefers-reduced-motion` on every map and panel transition; keep transitions 150 to 250ms.
- **Do** distinguish real figures from estimates visibly (the "illustrative" tag), never implying precision the data lacks.

### Don't:
- **Don't** drift back toward a **dry government website**: dense bureaucratic tables, blue underlined links, flat hierarchy, PDF-budget-paper coldness.
- **Don't** reach for **crypto/fintech dark glass**: neon-on-black, decorative glassmorphism, gradient text, trader-dashboard flourishes. Backdrop-blur is permitted only on panels floating over the map, nowhere else.
- **Don't** ship the **generic SaaS look**: identical card grids or the hero-metric template (big number plus gradient accent plus supporting stats).
- **Don't** let motion or gradients bury the figures (no **style-over-substance data-viz**); the number is the point.
- **Don't** use `border-left` or `border-right` greater than 1px as a coloured accent stripe on cards, list items, or callouts. (The sidebar slide-tab's accent edge is the one grab-handle exception and should not be copied to content.)
- **Don't** put a dollar amount in the sans body font, or set headings with fluid `clamp()`; this is a fixed-scale instrument.
- **Don't** nest a card inside a card, or add a shadow to anything that isn't floating over the map.
