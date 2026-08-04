import { describe, it, expect } from 'vitest';
import type { Project } from './types';
import {
	formatCurrency,
	budgetPercent,
	variance,
	variancePct,
	delayMonths,
	isRedFlag,
	filterProjects,
	sortProjects,
	resolveFundingBreakdown,
	contractorStats,
	projectsToCsv,
	budgetGrowth,
	isVerified,
	projectFinalCost,
	spendByCategory,
	overBudgetLeaderboard,
	completionsByYear,
	spendByFunder,
	spendByRegion,
	regionOf,
	portfolioAverages,
	type FilterCriteria
} from './metrics';

function makeProject(overrides: Partial<Project> = {}): Project {
	return {
		id: 'x',
		name: 'Test Project',
		description: '',
		category: 'transport',
		status: 'on_budget',
		funding_type: 'public',
		government_level: 'state',
		budget: 100_000_000,
		spent: 100_000_000,
		lat: -42,
		lng: 147,
		location_name: 'Hobart',
		start_date: '2023-01-01',
		expected_end_date: '2030-01-01',
		contractor: null,
		related_project_ids: [],
		created_at: '2024-01-01T00:00:00Z',
		updated_at: '2024-01-01T00:00:00Z',
		...overrides
	};
}

const NOW = new Date('2026-06-01T00:00:00Z');

const ALL_FILTERS: FilterCriteria = {
	category: 'all',
	status: 'all',
	funding: 'all',
	governmentLevel: 'all',
	query: '',
	range: [2000, 2100]
};

describe('formatCurrency', () => {
	it('formats billions, millions, thousands', () => {
		expect(formatCurrency(3_500_000_000)).toBe('$3.5B');
		expect(formatCurrency(265_000_000)).toBe('$265M');
		expect(formatCurrency(28_000)).toBe('$28K');
	});
	it('keeps the sign for negatives', () => {
		expect(formatCurrency(-65_000_000)).toBe('-$65M');
	});
});

describe('budget metrics', () => {
	it('computes percent, variance and variance %', () => {
		const p = makeProject({ budget: 200_000_000, spent: 265_000_000 });
		expect(budgetPercent(p)).toBe(133);
		expect(variance(p)).toBe(65_000_000);
		expect(variancePct(p)).toBeCloseTo(0.325, 3);
	});
	it('never divides by a zero budget', () => {
		const p = makeProject({ budget: 0, spent: 0 });
		expect(budgetPercent(p)).toBe(0);
		expect(variancePct(p)).toBe(0);
	});
});

describe('delayMonths', () => {
	it('is null for completed or cancelled projects', () => {
		expect(delayMonths(makeProject({ status: 'completed', expected_end_date: '2020-01-01' }), NOW)).toBeNull();
		expect(delayMonths(makeProject({ status: 'cancelled', expected_end_date: '2020-01-01' }), NOW)).toBeNull();
	});
	it('is null when there is no end date or the date is in the future', () => {
		expect(delayMonths(makeProject({ expected_end_date: null }), NOW)).toBeNull();
		expect(delayMonths(makeProject({ expected_end_date: '2030-01-01' }), NOW)).toBeNull();
	});
	it('counts whole months past an overdue end date', () => {
		expect(delayMonths(makeProject({ expected_end_date: '2026-03-01' }), NOW)).toBe(3);
	});
});

describe('isRedFlag', () => {
	it('flags materially over budget', () => {
		expect(isRedFlag(makeProject({ budget: 100, spent: 116 }), NOW)).toBe(true);
		expect(isRedFlag(makeProject({ budget: 100, spent: 114 }), NOW)).toBe(false);
	});
	it('flags overdue active projects', () => {
		expect(isRedFlag(makeProject({ expected_end_date: '2026-03-01' }), NOW)).toBe(true);
	});
	it('never flags cancelled projects', () => {
		expect(isRedFlag(makeProject({ status: 'cancelled', budget: 100, spent: 300 }), NOW)).toBe(false);
	});
});

describe('filterProjects', () => {
	const list = [
		makeProject({ id: 'a', category: 'health', status: 'over_budget', budget: 100, spent: 150, name: 'Hospital', contractor: 'Acme' }),
		makeProject({ id: 'b', category: 'transport', status: 'on_budget', name: 'Bridge', contractor: 'Bolt', government_level: 'local', funding_type: 'ppp' }),
		makeProject({ id: 'c', category: 'transport', status: 'completed', name: 'Path', start_date: '2010-01-01' })
	];

	it('matches everything with the all-filters baseline', () => {
		expect(filterProjects(list, ALL_FILTERS)).toHaveLength(3);
	});
	it('filters by category, status, funding and tier', () => {
		expect(filterProjects(list, { ...ALL_FILTERS, category: 'transport' }).map((p) => p.id)).toEqual(['b', 'c']);
		expect(filterProjects(list, { ...ALL_FILTERS, status: 'over_budget' }).map((p) => p.id)).toEqual(['a']);
		expect(filterProjects(list, { ...ALL_FILTERS, funding: 'ppp' }).map((p) => p.id)).toEqual(['b']);
		expect(filterProjects(list, { ...ALL_FILTERS, governmentLevel: 'local' }).map((p) => p.id)).toEqual(['b']);
	});
	it('matches the search query case-insensitively on name', () => {
		expect(filterProjects(list, { ...ALL_FILTERS, query: 'brid' }).map((p) => p.id)).toEqual(['b']);
	});
	it('filters by start-year range', () => {
		expect(filterProjects(list, { ...ALL_FILTERS, range: [2015, 2100] }).map((p) => p.id)).toEqual(['a', 'b']);
	});
	it('applies flaggedOnly and contractor', () => {
		expect(filterProjects(list, { ...ALL_FILTERS, flaggedOnly: true }).map((p) => p.id)).toEqual(['a']);
		expect(filterProjects(list, { ...ALL_FILTERS, contractor: 'Bolt' }).map((p) => p.id)).toEqual(['b']);
	});
});

describe('sortProjects', () => {
	const list = [
		makeProject({ id: 'low', name: 'Zeta', budget: 100, spent: 100 }),
		makeProject({ id: 'over', name: 'Alpha', budget: 100, spent: 200 }),
		makeProject({ id: 'big', name: 'Mid', budget: 999, spent: 999 })
	];
	it('sorts most-over-budget first', () => {
		expect(sortProjects(list, 'variance')[0].id).toBe('over');
	});
	it('sorts largest budget first', () => {
		expect(sortProjects(list, 'budget')[0].id).toBe('big');
	});
	it('sorts by name A-Z', () => {
		expect(sortProjects(list, 'name').map((p) => p.name)).toEqual(['Alpha', 'Mid', 'Zeta']);
	});
	it('does not mutate the input array', () => {
		const before = list.map((p) => p.id);
		sortProjects(list, 'budget');
		expect(list.map((p) => p.id)).toEqual(before);
	});
	it('sorts most cost growth first, history-less projects last', () => {
		const grown = makeProject({
			id: 'grown',
			budget_history: [
				{ fiscal_year: '2019-20', estimated_total_cost: 100 },
				{ fiscal_year: '2020-21', estimated_total_cost: 200 }
			]
		});
		const flat = makeProject({ id: 'flat' });
		const ordered = sortProjects([flat, grown], 'growth');
		expect(ordered.map((p) => p.id)).toEqual(['grown', 'flat']);
	});
});

describe('resolveFundingBreakdown', () => {
	it('returns the explicit breakdown when present', () => {
		const fb = { federal: 10, state: 20, local: 30, private: 40 };
		const r = resolveFundingBreakdown(makeProject({ budget: 100, funding_breakdown: fb }));
		expect(r.estimated).toBe(false);
		expect(r.breakdown).toEqual(fb);
	});
	it('derives a split that sums to the budget and flags it estimated', () => {
		const p = makeProject({ budget: 1000, funding_type: 'ppp', government_level: 'federal' });
		const { breakdown, estimated } = resolveFundingBreakdown(p);
		expect(estimated).toBe(true);
		expect(breakdown.private).toBe(450); // ppp = 45% private
		const sum = breakdown.federal + breakdown.state + breakdown.local + breakdown.private;
		expect(sum).toBe(1000);
	});
	it('puts no private money on fully public projects', () => {
		const { breakdown } = resolveFundingBreakdown(makeProject({ budget: 1000, funding_type: 'public', government_level: 'local' }));
		expect(breakdown.private).toBe(0);
		expect(breakdown.local).toBeGreaterThan(breakdown.federal);
	});
});

describe('contractorStats', () => {
	const list = [
		makeProject({ contractor: 'Acme', budget: 100, spent: 150 }),
		makeProject({ contractor: 'Acme', budget: 100, spent: 90 }),
		makeProject({ contractor: 'Bolt', budget: 100, spent: 100 }),
		makeProject({ contractor: null, budget: 100, spent: 100 })
	];
	it('groups by contractor and counts the unattributed', () => {
		const { ranked, unattributed } = contractorStats(list);
		expect(unattributed).toBe(1);
		expect(ranked).toHaveLength(2);
	});
	it('uses a money-weighted overrun', () => {
		const acme = contractorStats(list).ranked.find((c) => c.name === 'Acme')!;
		// (150 + 90) vs (100 + 100) = 240/200 = +20%
		expect(acme.overrunPct).toBeCloseTo(0.2, 5);
		expect(acme.projects).toBe(2);
	});
	it('ranks the worst overrun first', () => {
		expect(contractorStats(list).ranked[0].name).toBe('Acme');
	});
});

describe('isVerified', () => {
	it('is true only when last_verified is set', () => {
		expect(isVerified(makeProject({ last_verified: '2026-06-14' }))).toBe(true);
		expect(isVerified(makeProject())).toBe(false);
	});
});

describe('budgetGrowth', () => {
	it('is null without at least two snapshots', () => {
		expect(budgetGrowth(makeProject())).toBeNull();
		expect(budgetGrowth(makeProject({ budget_history: [{ fiscal_year: '2020-21', estimated_total_cost: 100 }] }))).toBeNull();
	});
	it('measures first-to-last escalation', () => {
		const p = makeProject({
			budget_history: [
				{ fiscal_year: '2019-20', estimated_total_cost: 576_000_000 },
				{ fiscal_year: '2021-22', estimated_total_cost: 576_000_000 },
				{ fiscal_year: '2023-24', estimated_total_cost: 786_000_000 }
			]
		});
		const g = budgetGrowth(p)!;
		expect(g.first).toBe(576_000_000);
		expect(g.last).toBe(786_000_000);
		expect(g.pct).toBeCloseTo(0.3646, 3);
	});
	it('is null when the cost never moved', () => {
		const flat = makeProject({
			budget_history: [
				{ fiscal_year: '2019-20', estimated_total_cost: 100 },
				{ fiscal_year: '2020-21', estimated_total_cost: 100 }
			]
		});
		expect(budgetGrowth(flat)).toBeNull();
	});
});

describe('projectsToCsv', () => {
	it('emits a header with funder columns and one row per project', () => {
		const csv = projectsToCsv([makeProject({ id: '1', name: 'Bridge' })]);
		const lines = csv.split('\n');
		expect(lines[0]).toContain('fund_federal');
		expect(lines[0]).toContain('source_url');
		expect(lines).toHaveLength(2);
	});
	it('quotes fields that contain commas', () => {
		const csv = projectsToCsv([makeProject({ name: 'Road, Stage 2' })]);
		expect(csv).toContain('"Road, Stage 2"');
	});
});

describe('projectFinalCost', () => {
	it('returns null for completed or cancelled projects', () => {
		expect(projectFinalCost(makeProject({ status: 'completed' }), NOW)).toBeNull();
		expect(projectFinalCost(makeProject({ status: 'cancelled' }), NOW)).toBeNull();
	});

	it('projects above budget by burn rate when spend outpaces the schedule', () => {
		// 50% of schedule elapsed (2023→2029, now 2026), but 80% spent → ~160% final.
		const p = makeProject({
			status: 'over_budget',
			budget: 100_000_000,
			spent: 80_000_000,
			start_date: '2023-01-01',
			expected_end_date: '2029-01-01'
		});
		const proj = projectFinalCost(p, NOW)!;
		expect(proj.method).toBe('burn-rate');
		expect(proj.estimate).toBeGreaterThan(100_000_000);
		expect(proj.overBy).toBeGreaterThan(0);
	});

	it('uses the latest revised estimate when it is the strongest signal', () => {
		const p = makeProject({
			status: 'on_budget',
			budget: 100_000_000,
			spent: 1_000_000,
			start_date: '2025-01-01',
			expected_end_date: '2035-01-01',
			budget_history: [
				{ fiscal_year: '2024-25', estimated_total_cost: 100_000_000 },
				{ fiscal_year: '2025-26', estimated_total_cost: 130_000_000 }
			]
		});
		const proj = projectFinalCost(p, NOW)!;
		expect(proj.method).toBe('revised-estimate');
		expect(proj.estimate).toBe(130_000_000);
	});

	it('reports on-budget when no signal exceeds the budget', () => {
		const p = makeProject({
			status: 'on_budget',
			budget: 100_000_000,
			spent: 1_000_000,
			start_date: '2025-01-01',
			expected_end_date: '2035-01-01'
		});
		const proj = projectFinalCost(p, NOW)!;
		expect(proj.method).toBe('on-budget');
		expect(proj.overBy).toBe(0);
	});

	it('ignores burn rate before 15% of the schedule has elapsed', () => {
		// Started a month before NOW on a 10-year job → barely any time elapsed.
		const p = makeProject({
			status: 'on_budget',
			budget: 100_000_000,
			spent: 5_000_000,
			start_date: '2026-05-01',
			expected_end_date: '2036-05-01'
		});
		const proj = projectFinalCost(p, NOW)!;
		expect(proj.method).toBe('on-budget');
	});
});

describe('aggregate helpers', () => {
	it('spendByCategory sums budgets per category, largest first', () => {
		const out = spendByCategory([
			makeProject({ category: 'transport', budget: 300 }),
			makeProject({ category: 'health', budget: 600 }),
			makeProject({ category: 'transport', budget: 200 })
		]);
		expect(out[0]).toEqual({ category: 'health', total: 600 });
		expect(out[1]).toEqual({ category: 'transport', total: 500 });
	});

	it('overBudgetLeaderboard ranks only over-budget projects by overrun', () => {
		const out = overBudgetLeaderboard([
			makeProject({ id: 'a', budget: 100, spent: 150 }),
			makeProject({ id: 'b', budget: 100, spent: 90 }),
			makeProject({ id: 'c', budget: 100, spent: 130 })
		]);
		expect(out.map((r) => r.project.id)).toEqual(['a', 'c']);
		expect(out[0].over).toBe(50);
	});

	it('completionsByYear counts by end year, oldest first', () => {
		const out = completionsByYear([
			makeProject({ expected_end_date: '2027-06-01' }),
			makeProject({ expected_end_date: '2025-03-01' }),
			makeProject({ expected_end_date: '2027-11-01' }),
			makeProject({ expected_end_date: null })
		]);
		expect(out).toEqual([
			{ year: 2025, count: 1 },
			{ year: 2027, count: 2 }
		]);
	});

	it('spendByFunder sums each funder across the book, largest first', () => {
		const out = spendByFunder([
			makeProject({ budget: 100, funding_type: 'public', government_level: 'state' }),
			makeProject({ budget: 100, funding_type: 'public', government_level: 'state' })
		]);
		// state-led + fully public: 80/20 state/federal, no private or local
		expect(out).toEqual([
			{ funder: 'state', total: 160 },
			{ funder: 'federal', total: 40 }
		]);
		expect(out.map((r) => r.total).reduce((a, b) => a + b, 0)).toBe(200);
	});

	it('spendByFunder honours an explicit breakdown over the derived split', () => {
		const out = spendByFunder([
			makeProject({ budget: 100, funding_breakdown: { federal: 100, state: 0, local: 0, private: 0 } })
		]);
		expect(out).toEqual([{ funder: 'federal', total: 100 }]);
	});

	it('regionOf splits Tasmania south / north / north west', () => {
		expect(regionOf(makeProject({ lat: -42.88, lng: 147.33 }))).toBe('South'); // Hobart
		expect(regionOf(makeProject({ lat: -41.44, lng: 147.14 }))).toBe('North'); // Launceston
		expect(regionOf(makeProject({ lat: -41.18, lng: 146.35 }))).toBe('North West'); // Devonport
		expect(regionOf(makeProject({ lat: -42.08, lng: 145.55 }))).toBe('North West'); // Queenstown
		expect(regionOf(makeProject({ location_name: 'Statewide' }))).toBe('Statewide');
	});

	it('spendByRegion aggregates budget per region, largest first', () => {
		const out = spendByRegion([
			makeProject({ budget: 10, lat: -42.88, lng: 147.33 }),
			makeProject({ budget: 50, lat: -41.44, lng: 147.14 }),
			makeProject({ budget: 5, lat: -41.44, lng: 147.14 })
		]);
		expect(out).toEqual([
			{ region: 'North', total: 55 },
			{ region: 'South', total: 10 }
		]);
	});

	it('portfolioAverages reports totals, spend progress and flagged share', () => {
		const out = portfolioAverages([
			makeProject({ budget: 100, spent: 150, expected_end_date: '2030-01-01' }), // over -> flagged
			makeProject({ budget: 300, spent: 300, expected_end_date: '2030-01-01' })
		]);
		expect(out.count).toBe(2);
		expect(out.totalBudget).toBe(400);
		expect(out.avgBudget).toBe(200);
		expect(out.spentPct).toBeCloseTo(450 / 400);
		expect(out.flaggedPct).toBe(0.5);
	});

	it('portfolioAverages measures overrun only across projects actually over', () => {
		const out = portfolioAverages([
			makeProject({ budget: 100, spent: 150 }), // 50% over
			// Barely-started project: spend well under budget because the work is
			// unfinished. It must not dilute the overrun figure into "under budget".
			makeProject({ budget: 900, spent: 10 })
		]);
		expect(out.overCount).toBe(1);
		expect(out.overrunPct).toBeCloseTo(0.5);
		expect(out.spentPct).toBeCloseTo(160 / 1000);
	});

	it('portfolioAverages is safe on an empty book', () => {
		expect(portfolioAverages([])).toEqual({
			count: 0,
			totalBudget: 0,
			avgBudget: 0,
			spentPct: 0,
			overrunPct: 0,
			overCount: 0,
			flaggedPct: 0
		});
	});
});
