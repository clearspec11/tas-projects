// Concrete colour values for the places a CSS custom property cannot reach:
// Leaflet path options, HTML strings handed to Leaflet, and hex+alpha chips.
// The same values live in DESIGN.md's frontmatter and in app.css's :root;
// tokens.test.ts fails if any of the three drift apart.
export const TOKENS = {
	bg: '#0c1410',
	surface: '#14201a',
	surfaceHover: '#1f2d24',
	border: '#2c3f34',
	ink: '#edf3ea',
	muted: '#9fb1a1',
	accent: '#d7a25c',
	success: '#5aa84f',
	warning: '#e0933a',
	danger: '#df5a39',
	statusOnBudget: '#5aa84f',
	statusOverBudget: '#df5a39',
	statusUnderBudget: '#3fa39e',
	statusCompleted: '#ab8ad6',
	statusCancelled: '#889085',
	tierFederal: '#9a8ad6',
	tierState: '#3fa39e',
	tierLocal: '#5aa84f',
	fundPrivate: '#e0933a',
	// Map atmosphere only: the lit shoreline and the aurora wash. Never data.
	coastGlow: '#34b893',
	coastLine: '#86e3c0'
} as const;

export type TokenName = keyof typeof TOKENS;
