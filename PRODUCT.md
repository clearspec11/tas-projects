# Product

## Register

product

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
  over-styled trader-dashboard flourishes. The current dark-slate + cyan theme
  must be watched here; legibility and civic calm beat dashboard slickness.
- Also avoid the generic SaaS look (identical card grids, hero-metric template)
  and style-over-substance data-viz where motion and gradients bury the figures.

## Design Principles

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
surfaces must meet ≥4.5:1 (a known risk in the current palette). Status is never
encoded by colour alone (red/green budget state pairs with a label and, for red
flags, an icon) to stay usable for colour-blind users. Honour
`prefers-reduced-motion` for every map and panel transition. Map content has
non-map fallbacks: the sidebar list, search, and project detail convey the same
information without requiring the map.
