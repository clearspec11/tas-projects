import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SEED_PROJECTS } from './seed-data';

// data.ts reaches Supabase through ./supabase, which needs SvelteKit's $env.
// Replacing it lets these tests drive every outcome of the query.
const getSupabase = vi.fn();
vi.mock('./supabase', () => ({ getSupabase: () => getSupabase() }));

const { loadProjects } = await import('./data');

// A stand-in client whose `from('projects').select('*')` resolves to `result`.
function clientReturning(result: unknown) {
	return { from: () => ({ select: () => Promise.resolve(result) }) };
}

const ROW = {
	id: 7,
	name: 'Test Bridge',
	description: 'A bridge.',
	category: 'transport',
	status: 'over_budget',
	funding_type: 'gov_contracted',
	government_level: 'state',
	council: null,
	// Postgres bigint columns can arrive as strings.
	budget: '786000000',
	spent: null,
	original_budget: '576000000',
	lat: '-42.73',
	lng: '147.23',
	location_name: 'Bridgewater',
	start_date: null,
	expected_end_date: '2025-12-31',
	actual_end_date: null,
	contractor: null,
	related_project_ids: null,
	source_url: null,
	funding_breakdown: null,
	funding_note: null,
	budget_history: null,
	last_verified: null,
	created_at: '2026-01-01T00:00:00Z',
	updated_at: '2026-01-02T00:00:00Z'
};

beforeEach(() => getSupabase.mockReset());

describe('loadProjects fallback', () => {
	it('uses the bundled data when Supabase is not configured', async () => {
		getSupabase.mockReturnValue(null);
		const out = await loadProjects();
		expect(out).toEqual({ projects: SEED_PROJECTS, source: 'seed' });
	});

	it('falls back and reports the message when the query returns an error', async () => {
		getSupabase.mockReturnValue(clientReturning({ data: null, error: { message: 'permission denied' } }));
		const out = await loadProjects();
		expect(out.source).toBe('seed');
		expect(out.projects).toBe(SEED_PROJECTS);
		expect(out.error).toBe('permission denied');
	});

	it('falls back when the table is empty', async () => {
		getSupabase.mockReturnValue(clientReturning({ data: [], error: null }));
		const out = await loadProjects();
		expect(out.source).toBe('seed');
		expect(out.error).toBeUndefined();
	});

	it('falls back when the request throws, as it does for a paused project', async () => {
		getSupabase.mockReturnValue({
			from: () => ({ select: () => Promise.reject(new Error('fetch failed')) })
		});
		const out = await loadProjects();
		expect(out.source).toBe('seed');
		expect(out.error).toBe('fetch failed');
	});
});

describe('loadProjects row mapping', () => {
	async function load(row: Record<string, unknown>) {
		getSupabase.mockReturnValue(clientReturning({ data: [row], error: null }));
		const out = await loadProjects();
		expect(out.source).toBe('supabase');
		return out.projects[0];
	}

	it('converts ids to strings and numeric strings to numbers', async () => {
		const p = await load(ROW);
		expect(p.id).toBe('7');
		expect(p.budget).toBe(786_000_000);
		expect(p.original_budget).toBe(576_000_000);
		expect(p.lat).toBe(-42.73);
		expect(p.lng).toBe(147.23);
	});

	it('keeps unpublished spend as null rather than zero', async () => {
		expect((await load(ROW)).spent).toBeNull();
		expect((await load({ ...ROW, spent: '0' })).spent).toBe(0);
		expect((await load({ ...ROW, spent: '15720000' })).spent).toBe(15_720_000);
	});

	it('keeps an unknown start date as null', async () => {
		expect((await load(ROW)).start_date).toBeNull();
		expect((await load({ ...ROW, start_date: '2022-10-01' })).start_date).toBe('2022-10-01');
	});

	it('turns null optional columns into the defaults the app expects', async () => {
		const p = await load(ROW);
		expect(p.related_project_ids).toEqual([]);
		expect(p.contractor).toBeNull();
		expect(p.expected_end_date).toBe('2025-12-31');
		expect(p.actual_end_date).toBeNull();
		expect(p.council).toBeUndefined();
		expect(p.source_url).toBeUndefined();
		expect(p.funding_breakdown).toBeUndefined();
		expect(p.funding_note).toBeUndefined();
		expect(p.budget_history).toBeUndefined();
		expect(p.last_verified).toBeUndefined();
	});

	it('passes structured columns through unchanged', async () => {
		const funding_breakdown = { federal: 628_800_000, state: 157_200_000, local: 0, private: 0 };
		const budget_history = [{ fiscal_year: '2019-20', estimated_total_cost: 576_000_000 }];
		const p = await load({
			...ROW,
			funding_breakdown,
			budget_history,
			funding_note: 'Proposed split.',
			related_project_ids: ['10'],
			last_verified: '2026-11-18'
		});
		expect(p.funding_breakdown).toEqual(funding_breakdown);
		expect(p.budget_history).toEqual(budget_history);
		expect(p.funding_note).toBe('Proposed split.');
		expect(p.related_project_ids).toEqual(['10']);
		expect(p.last_verified).toBe('2026-11-18');
	});
});
