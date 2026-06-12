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
export function budgetPercent(p: Project): number {
	return p.budget ? Math.round((p.spent / p.budget) * 100) : 0;
}

export function variance(p: Project): number {
	return p.spent - p.budget;
}

export function variancePct(p: Project): number {
	return p.budget ? (p.spent - p.budget) / p.budget : 0;
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

// ---- Filtering (shared by sidebar + map so they never diverge) ----
export interface FilterCriteria {
	category: ProjectCategory | 'all';
	status: ProjectStatus | 'all';
	funding: FundingType | 'all';
	governmentLevel: GovernmentLevel | 'all';
	query: string;
	range: [number, number];
	flaggedOnly?: boolean;
}

export function filterProjects(list: Project[], f: FilterCriteria): Project[] {
	return list.filter((p) => {
		if (f.category !== 'all' && p.category !== f.category) return false;
		if (f.status !== 'all' && p.status !== f.status) return false;
		if (f.funding !== 'all' && p.funding_type !== f.funding) return false;
		if (f.governmentLevel !== 'all' && p.government_level !== f.governmentLevel) return false;
		if (f.flaggedOnly && !isRedFlag(p)) return false;
		if (f.query && !p.name.toLowerCase().includes(f.query.toLowerCase())) return false;
		const startYear = new Date(p.start_date).getFullYear();
		if (startYear < f.range[0] || startYear > f.range[1]) return false;
		return true;
	});
}

// ---- Sorting ----
export type SortKey = 'variance' | 'budget' | 'delay' | 'name';

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
	{ value: 'variance', label: 'Most over budget' },
	{ value: 'budget', label: 'Largest budget' },
	{ value: 'delay', label: 'Most delayed' },
	{ value: 'name', label: 'Name (A–Z)' }
];

export function sortProjects(list: Project[], key: SortKey): Project[] {
	const copy = [...list];
	switch (key) {
		case 'variance':
			return copy.sort((a, b) => variancePct(b) - variancePct(a));
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
		'council', 'location_name', 'budget', 'spent', 'contractor',
		'start_date', 'expected_end_date', 'lat', 'lng', 'source_url'
	];
	const esc = (v: unknown) => {
		const s = v == null ? '' : String(v);
		return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
	};
	const header = [
		...cols, 'variance', 'variance_pct', 'delay_months',
		'fund_federal', 'fund_state', 'fund_local', 'fund_private'
	].join(',');
	const rows = list.map((p) => {
		const fb = resolveFundingBreakdown(p).breakdown;
		return [
			...cols.map((c) => esc(p[c])),
			esc(variance(p)),
			esc((variancePct(p) * 100).toFixed(1)),
			esc(delayMonths(p) ?? ''),
			esc(fb.federal), esc(fb.state), esc(fb.local), esc(fb.private)
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
