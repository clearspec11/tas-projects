import { describe, it, expect } from 'vitest';
import { SEED_PROJECTS } from './seed-data';

// Guards on the data itself: the things that are easy to break when a project
// is added or edited by hand.
describe('seed data integrity', () => {
	const ids = new Set(SEED_PROJECTS.map((p) => p.id));

	it('has unique ids', () => {
		expect(ids.size).toBe(SEED_PROJECTS.length);
	});

	it('only links to projects that exist', () => {
		for (const p of SEED_PROJECTS) {
			for (const related of p.related_project_ids) {
				expect(ids.has(related), `${p.id} links to missing project ${related}`).toBe(true);
			}
		}
	});

	it('gives every project a source and a last-checked date', () => {
		for (const p of SEED_PROJECTS) {
			expect(p.source_url, `${p.id} has no source`).toMatch(/^https:\/\//);
			expect(p.last_verified, `${p.id} has no last_verified`).toMatch(/^\d{4}-\d{2}-\d{2}$/);
		}
	});

	it('has funding splits that add up to the cost, or explains the gap', () => {
		for (const p of SEED_PROJECTS) {
			if (!p.funding_breakdown) continue;
			const { federal, state, local, private: priv } = p.funding_breakdown;
			const total = federal + state + local + priv;
			if (total !== p.budget) {
				expect(p.funding_note, `${p.id} split is ${total} against ${p.budget} with no note`).toBeTruthy();
				// A gap this large is a data-entry error, not a rounding difference.
				expect(Math.abs(total - p.budget) / p.budget).toBeLessThan(0.02);
			}
		}
	});

	it('never records spend above zero without a positive cost', () => {
		for (const p of SEED_PROJECTS) {
			expect(p.budget, `${p.id} has no cost`).toBeGreaterThan(0);
			if (p.spent != null) expect(p.spent).toBeGreaterThanOrEqual(0);
		}
	});

	it('keeps dates in order', () => {
		for (const p of SEED_PROJECTS) {
			const end = p.actual_end_date ?? p.expected_end_date;
			if (p.start_date && end) {
				expect(p.start_date <= end, `${p.id} ends before it starts`).toBe(true);
			}
			if (p.actual_end_date) {
				expect(p.status, `${p.id} has an end date but is not completed`).toBe('completed');
			}
		}
	});

	it('places every project inside Tasmania', () => {
		for (const p of SEED_PROJECTS) {
			expect(p.lat, `${p.id} latitude`).toBeGreaterThan(-43.8);
			expect(p.lat, `${p.id} latitude`).toBeLessThan(-39.5);
			expect(p.lng, `${p.id} longitude`).toBeGreaterThan(143.5);
			expect(p.lng, `${p.id} longitude`).toBeLessThan(148.6);
		}
	});
});
