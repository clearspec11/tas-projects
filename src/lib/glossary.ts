// Plain-language definitions for the terms a non-expert visitor won't know.
// One place so the wording stays consistent wherever a term is explained.
export const GLOSSARY = {
	variance:
		'How far the cost now sits above or below the first announced figure. A positive figure means the project is over.',
	tier:
		'Which level of government funds the project — federal, state, or local council. The marker ring shows it.',
	overrun:
		"How far the combined cost of a contractor's projects has grown past their first announced cost, money-weighted so one large blowout counts for more than several small on-budget jobs.",
	budget_usage: 'Share of the current cost estimate paid out so far. Shown only where a spend figure has been published.',
	funding_model:
		'How the project is paid for and delivered — fully public, built under contract by a private firm, or a public-private partnership.',
	flagged: 'Over budget by more than 15%, or past its expected finish date (and not yet complete).'
} as const;

export type GlossaryTerm = keyof typeof GLOSSARY;

// One-paragraph orientation for someone seeing the map for the first time.
export const MAP_ORIENTATION =
	'Each circle is a public project. The fill colour shows its budget status, the ring shows which level of government funds it, and the size reflects the budget. A red dashed halo marks a project that is over budget or running late.';
