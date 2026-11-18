import type { Project, ProjectCategory, ProjectStatus, FundingType, GovernmentLevel, FundingBreakdown } from './types';

// ---- Money / dates ----
export function formatCurrency(n: number): string {
	const abs = Math.abs(n);
	const sign = n < 0 ? '-' : '';
	if (abs >= 1_000_000_000) return `${sign}$${(abs / 1_000_000_000).toFixed(1)}B`;
	if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(0)}M`;
	return `${sign}$${(abs / 1_000).toFixed(0)}K`;
}

export function formatCurrencyPrecise(n: number): string {
	const abs = Math.abs(n);
	const sign = n < 0 ? '-' : '';
	if (abs >= 1_000_000_000) return `${sign}$${(abs / 1_000_000_000).toFixed(2)}B`;
	if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(1)}M`;
	return `${sign}$${(abs / 1_000).toFixed(0)}K`;
}

export function formatDate(d: string): string {
	return new Date(d).toLocaleDateString('en-AU', { year: 'numeric', month: 'short', day: 'numeric' });
}

// ---- Budget metrics ----
// Three separate money figures, kept apart on purpose:
//   original_budget  the first publicly announced total cost (the promise)
//   budget           the latest official estimated total cost
//   spent            money actually paid out so far; null when no source publishes it
// An estimate is never recorded as spend.

// The first announced cost; falls back to the current estimate when no earlier
// figure is on record.
export function baselineCost(p: Project): number {
	return p.original_budget ?? p.budget;
}

// Where the cost stands now: the final cost of a finished project when it is
// known, otherwise the latest estimate (or actual spend, if that has passed it).
export function currentCost(p: Project): number {
	if (p.status === 'completed' && p.spent != null) return p.spent;
	return Math.max(p.budget, p.spent ?? 0);
}

// Share of the current estimate paid out so far. null when spend isn't published.
export function budgetPercent(p: Project): number | null {
	if (p.spent == null) return null;
	return p.budget ? Math.round((p.spent / p.budget) * 100) : 0;
}

// Cost movement against the first announced figure. Unspent money on a live
// project is not a saving, so this is never negative until a project finishes.
export function variance(p: Project): number {
	return currentCost(p) - baselineCost(p);
}

export function variancePct(p: Project): number {
	const base = baselineCost(p);
	return base ? variance(p) / base : 0;
}

// Months a project is running past its expected end date.
// null when not applicable (completed/cancelled, no end date, or not yet late).
export function delayMonths(p: Project, now: Date = new Date()): number | null {
	if (p.status === 'completed' || p.status === 'cancelled') return null;
	if (!p.expected_end_date) return null;
	const end = new Date(p.expected_end_date);
	const months = (now.getFullYear() - end.getFullYear()) * 12 + (now.getMonth() - end.getMonth());
	return months > 0 ? months : null;
}

// A project is a red flag if materially over budget OR overdue (and still active).
export function isRedFlag(p: Project, now: Date = new Date()): boolean {
	if (p.status === 'cancelled') return false;
	if (variancePct(p) > 0.15) return true;
	if (delayMonths(p, now) !== null) return true;
	return false;
}

// ---- Funding breakdown ----
// Share of project cost carried by the private sector, by delivery model.
const PRIVATE_SHARE: Record<FundingType, number> = {
	public: 0,
	gov_contracted: 0, // privately built, but publicly funded
	gov_funded_private: 0.35,
	ppp: 0.45
};

// Returns the funding split. Uses an explicit `funding_breakdown` when the
// project provides one; otherwise derives a plausible split from the governing
// tier and delivery model (flagged `estimated: true` so the UI can label it).
export function resolveFundingBreakdown(p: Project): { breakdown: FundingBreakdown; estimated: boolean } {
	if (p.funding_breakdown) return { breakdown: p.funding_breakdown, estimated: false };

	const priv = PRIVATE_SHARE[p.funding_type] * p.budget;
	const gov = p.budget - priv;

	let federal = 0, state = 0, local = 0;
	if (p.government_level === 'federal') {
		federal = gov * 0.7;
		state = gov * 0.3;
	} else if (p.government_level === 'state') {
		federal = gov * 0.2;
		state = gov * 0.8;
	} else {
		federal = gov * 0.1;
		state = gov * 0.3;
		local = gov * 0.6;
	}
	return {
		breakdown: {
			federal: Math.round(federal),
			state: Math.round(state),
			local: Math.round(local),
			private: Math.round(priv)
		},
		estimated: true
	};
}

// A project is "verified" once its figures have been checked against a cited
// source (last_verified is set). The rest are illustrative seed data.
export function isVerified(p: Project): boolean {
	return Boolean(p.last_verified);
}

// Growth in announced total cost from the first recorded budget paper to the
// latest. null when there's no usable history. This is the original-vs-revised
// accountability signal, distinct from spend-vs-budget.
export function budgetGrowth(p: Project): { first: number; last: number; pct: number } | null {
	const h = p.budget_history;
	if (!h || h.length < 2) return null;
	const first = h[0].estimated_total_cost;
	const last = h[h.length - 1].estimated_total_cost;
	if (!first || first === last) return null;
	return { first, last, pct: (last - first) / first };
}

// ---- Projection ----
// A deliberately simple, honest forecast of a live project's final cost. Not a
// promise: it takes the strongest available "where this lands" signal and labels
// which one it used so the UI can show its working.
//   - revised-estimate: the latest official estimate sits above the first announced cost
//   - burn-rate: spend-to-date extrapolated over the full schedule
//   - on-budget: no signal points above the first announced cost
// Returns null for finished/cancelled projects and where there's nothing to model.
export interface Projection {
	estimate: number; // projected final cost
	overBy: number; // estimate - first announced cost
	pct: number; // overBy / first announced cost
	method: 'revised-estimate' | 'burn-rate' | 'on-budget';
	elapsedPct: number; // share of the schedule elapsed, 0..1
}

export function projectFinalCost(p: Project, now: Date = new Date()): Projection | null {
	if (p.status === 'completed' || p.status === 'cancelled') return null;
	if (!p.budget) return null;

	// How far through the planned schedule are we?
	let elapsed = NaN;
	if (p.start_date && p.expected_end_date) {
		const s = new Date(p.start_date).getTime();
		const e = new Date(p.expected_end_date).getTime();
		const n = now.getTime();
		if (e > s) elapsed = Math.min(1, Math.max(0, (n - s) / (e - s)));
	}

	const baseline = baselineCost(p);
	let estimate = currentCost(p);
	let method: Projection['method'] = estimate > baseline ? 'revised-estimate' : 'on-budget';

	// Latest revised total cost from the budget-paper trail, if any.
	const revised = p.budget_history?.length
		? p.budget_history[p.budget_history.length - 1].estimated_total_cost
		: null;
	if (revised && revised > estimate) {
		estimate = revised;
		method = 'revised-estimate';
	}

	// Burn-rate extrapolation, but only once enough schedule has passed that the
	// rate means something (avoids wild forecasts from a single early invoice).
	const spent = p.spent ?? 0;
	const burn = Number.isFinite(elapsed) && elapsed >= 0.15 && spent > 0 ? spent / elapsed : null;
	if (burn && burn > estimate) {
		estimate = burn;
		method = 'burn-rate';
	}

	estimate = Math.round(estimate);
	return {
		estimate,
		overBy: estimate - baseline,
		pct: baseline ? (estimate - baseline) / baseline : 0,
		method,
		elapsedPct: Number.isFinite(elapsed) ? elapsed : 0
	};
}

// Aggregate budget grouped by category, largest first — feeds the spend chart.
export function spendByCategory(list: Project[]): { category: ProjectCategory; total: number }[] {
	const totals = new Map<ProjectCategory, number>();
	for (const p of list) totals.set(p.category, (totals.get(p.category) ?? 0) + p.budget);
	return [...totals.entries()]
		.map(([category, total]) => ({ category, total }))
		.sort((a, b) => b.total - a.total);
}

// Aggregate budget by who pays, largest first. Uses each project's explicit
// funding_breakdown where present and the derived split otherwise, so the totals
// answer "whose money is this" across the whole book rather than per project.
export function spendByFunder(list: Project[]): { funder: keyof FundingBreakdown; total: number }[] {
	const totals: FundingBreakdown = { federal: 0, state: 0, local: 0, private: 0 };
	for (const p of list) {
		const { breakdown } = resolveFundingBreakdown(p);
		totals.federal += breakdown.federal;
		totals.state += breakdown.state;
		totals.local += breakdown.local;
		totals.private += breakdown.private;
	}
	return (Object.keys(totals) as (keyof FundingBreakdown)[])
		.map((funder) => ({ funder, total: Math.round(totals[funder]) }))
		.filter((r) => r.total > 0)
		.sort((a, b) => b.total - a.total);
}

// Tasmania's three standard regional groupings, derived from each project's
// coordinates (no region column exists). The split follows the Cradle Coast /
// North / South LGA groupings: everything below the Midlands reads as South, and
// the north is divided at the Tamar. Projects marked "Statewide" aren't regional.
export type Region = 'Statewide' | 'South' | 'North' | 'North West';

export function regionOf(p: Project): Region {
	if (/statewide/i.test(p.location_name)) return 'Statewide';
	if (p.lat <= -42.3) return 'South';
	return p.lng >= 146.7 ? 'North' : 'North West';
}

// Aggregate budget grouped by region, largest first.
export function spendByRegion(list: Project[]): { region: Region; total: number }[] {
	const totals = new Map<Region, number>();
	for (const p of list) totals.set(regionOf(p), (totals.get(regionOf(p)) ?? 0) + p.budget);
	return [...totals.entries()]
		.map(([region, total]) => ({ region, total }))
		.sort((a, b) => b.total - a.total);
}

// Headline figures across the book.
//
// `overrunPct` is deliberately measured only across projects that have actually
// run over, money-weighted (their cost growth / their first announced cost).
//
// `spentPct` is spend progress, measured only across projects whose spend is
// published, so missing figures don't read as money unspent.
export function portfolioAverages(list: Project[]): {
	count: number;
	totalBudget: number;
	avgBudget: number;
	spentPct: number;
	overrunPct: number;
	overCount: number;
	flaggedPct: number;
} {
	const count = list.length;
	const totalBudget = list.reduce((s, p) => s + p.budget, 0);
	const withSpend = list.filter((p) => p.spent != null);
	const totalSpent = withSpend.reduce((s, p) => s + (p.spent ?? 0), 0);
	const spendBudget = withSpend.reduce((s, p) => s + p.budget, 0);

	const over = list.filter((p) => variance(p) > 0);
	const overBudgetTotal = over.reduce((s, p) => s + baselineCost(p), 0);
	const overspend = over.reduce((s, p) => s + variance(p), 0);

	return {
		count,
		totalBudget,
		avgBudget: count ? Math.round(totalBudget / count) : 0,
		spentPct: spendBudget ? totalSpent / spendBudget : 0,
		overrunPct: overBudgetTotal ? overspend / overBudgetTotal : 0,
		overCount: over.length,
		flaggedPct: count ? flagged(list) / count : 0
	};
}

function flagged(list: Project[]): number {
	return list.filter((p) => isRedFlag(p)).length;
}

// Projects ranked by how far cost has grown past the first announced figure, biggest first.
// Only those actually over (variance > 0); caller decides how many to show.
export function overBudgetLeaderboard(list: Project[]): { project: Project; over: number }[] {
	return list
		.map((project) => ({ project, over: variance(project) }))
		.filter((r) => r.over > 0)
		.sort((a, b) => b.over - a.over);
}

// Count of projects due to finish in each year, oldest first — the delivery
// pipeline. Uses actual end where known, else the expected date.
export function completionsByYear(list: Project[]): { year: number; count: number }[] {
	const counts = new Map<number, number>();
	for (const p of list) {
		const d = p.actual_end_date ?? p.expected_end_date;
		if (!d) continue;
		const year = new Date(d).getFullYear();
		if (!Number.isFinite(year)) continue;
		counts.set(year, (counts.get(year) ?? 0) + 1);
	}
	return [...counts.entries()]
		.map(([year, count]) => ({ year, count }))
		.sort((a, b) => a.year - b.year);
}

// ---- Filtering (shared by sidebar + map so they never diverge) ----
export interface FilterCriteria {
	category: ProjectCategory | 'all';
	status: ProjectStatus | 'all';
	funding: FundingType | 'all';
	governmentLevel: GovernmentLevel | 'all';
	query: string;
	range: [number, number];
	flaggedOnly?: boolean;
	contractor?: string | null;
}

export function filterProjects(list: Project[], f: FilterCriteria): Project[] {
	return list.filter((p) => {
		if (f.category !== 'all' && p.category !== f.category) return false;
		if (f.status !== 'all' && p.status !== f.status) return false;
		if (f.funding !== 'all' && p.funding_type !== f.funding) return false;
		if (f.governmentLevel !== 'all' && p.government_level !== f.governmentLevel) return false;
		if (f.flaggedOnly && !isRedFlag(p)) return false;
		if (f.contractor && p.contractor !== f.contractor) return false;
		if (f.query && !p.name.toLowerCase().includes(f.query.toLowerCase())) return false;
		const startYear = new Date(p.start_date).getFullYear();
		if (startYear < f.range[0] || startYear > f.range[1]) return false;
		return true;
	});
}

// ---- Contractor scorecards ----
export interface ContractorStats {
	name: string;
	projects: number;
	totalBudget: number; // sum of current estimates
	// Money-weighted: total cost growth / total first announced cost, so one
	// large blowout outweighs several small on-budget jobs.
	overrunPct: number;
	flagged: number;
	cleanPct: number; // share of their projects not red-flagged
}

export function contractorStats(list: Project[]): { ranked: ContractorStats[]; unattributed: number } {
	const groups = new Map<string, Project[]>();
	let unattributed = 0;
	for (const p of list) {
		if (!p.contractor) {
			unattributed++;
			continue;
		}
		const arr = groups.get(p.contractor) ?? [];
		arr.push(p);
		groups.set(p.contractor, arr);
	}
	const ranked = [...groups.entries()]
		.map(([name, ps]) => {
			const totalBudget = ps.reduce((s, p) => s + p.budget, 0);
			const totalBaseline = ps.reduce((s, p) => s + baselineCost(p), 0);
			const totalCurrent = ps.reduce((s, p) => s + currentCost(p), 0);
			const flagged = ps.filter((p) => isRedFlag(p)).length;
			return {
				name,
				projects: ps.length,
				totalBudget,
				overrunPct: totalBaseline ? (totalCurrent - totalBaseline) / totalBaseline : 0,
				flagged,
				cleanPct: ps.length ? (ps.length - flagged) / ps.length : 0
			};
		})
		.sort((a, b) => b.overrunPct - a.overrunPct);
	return { ranked, unattributed };
}

// ---- Sorting ----
export type SortKey = 'variance' | 'growth' | 'budget' | 'delay' | 'name';

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
	{ value: 'variance', label: 'Most over budget' },
	{ value: 'growth', label: 'Most cost growth' },
	{ value: 'budget', label: 'Largest budget' },
	{ value: 'delay', label: 'Most delayed' },
	{ value: 'name', label: 'Name (A–Z)' }
];

export function sortProjects(list: Project[], key: SortKey): Project[] {
	const copy = [...list];
	switch (key) {
		case 'variance':
			return copy.sort((a, b) => variancePct(b) - variancePct(a));
		case 'growth': {
			// Projects with a verified cost-growth trail first, biggest growth on
			// top; those without history sink to the bottom.
			const g = (p: Project) => budgetGrowth(p)?.pct ?? -Infinity;
			return copy.sort((a, b) => g(b) - g(a));
		}
		case 'budget':
			return copy.sort((a, b) => b.budget - a.budget);
		case 'delay':
			return copy.sort((a, b) => (delayMonths(b) ?? -1) - (delayMonths(a) ?? -1));
		case 'name':
			return copy.sort((a, b) => a.name.localeCompare(b.name));
	}
}

// ---- Export ----
export function projectsToCsv(list: Project[]): string {
	const cols: (keyof Project)[] = [
		'id', 'name', 'category', 'status', 'funding_type', 'government_level',
		'council', 'location_name', 'original_budget', 'budget', 'spent', 'contractor',
		'start_date', 'expected_end_date', 'actual_end_date', 'lat', 'lng', 'source_url', 'last_verified'
	];
	const esc = (v: unknown) => {
		const s = v == null ? '' : String(v);
		return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
	};
	const header = [
		...cols, 'variance', 'variance_pct', 'delay_months',
		'fund_federal', 'fund_state', 'fund_local', 'fund_private', 'funding_split_basis'
	].join(',');
	const rows = list.map((p) => {
		const { breakdown: fb, estimated } = resolveFundingBreakdown(p);
		return [
			...cols.map((c) => esc(p[c])),
			esc(variance(p)),
			esc((variancePct(p) * 100).toFixed(1)),
			esc(delayMonths(p) ?? ''),
			esc(fb.federal), esc(fb.state), esc(fb.local), esc(fb.private),
			esc(estimated ? 'estimated' : 'sourced')
		].join(',');
	});
	return [header, ...rows].join('\n');
}

export function downloadFile(filename: string, content: string, mime: string) {
	const blob = new Blob([content], { type: mime });
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = filename;
	a.click();
	URL.revokeObjectURL(url);
}
