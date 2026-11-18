import { describe, it, expect } from 'vitest';
import { DEFAULT_VIEW, parseViewState, serializeViewState, type ViewState } from './url-state';

const view = (overrides: Partial<ViewState> = {}): ViewState => ({ ...DEFAULT_VIEW, ...overrides });

describe('serializeViewState', () => {
	it('gives an empty query string for the default view', () => {
		expect(serializeViewState(view())).toBe('');
	});

	it('writes only what differs from the default', () => {
		const qs = serializeViewState(view({ status: 'over_budget', flagged: true }));
		expect(qs).toBe('status=over_budget&flag=1');
	});

	it('writes each end of the timeline range independently', () => {
		expect(serializeViewState(view({ range: [2015, 2036] }))).toBe('y0=2015');
		expect(serializeViewState(view({ range: [2008, 2030] }))).toBe('y1=2030');
	});

	it('encodes free text safely', () => {
		const qs = serializeViewState(view({ query: 'hospital & health', contractor: 'R&T Rosier' }));
		expect(new URLSearchParams(qs).get('q')).toBe('hospital & health');
		expect(new URLSearchParams(qs).get('contractor')).toBe('R&T Rosier');
	});
});

describe('parseViewState', () => {
	it('returns nothing for an empty query string', () => {
		expect(parseViewState('')).toEqual({});
	});

	it('reads every supported parameter', () => {
		const parsed = parseViewState(
			'?cat=health&status=completed&funding=public&gov=local&q=pool&flag=1&contractor=Genus&sort=budget&y0=2012&y1=2020&p=c15'
		);
		expect(parsed).toEqual({
			category: 'health',
			status: 'completed',
			funding: 'public',
			governmentLevel: 'local',
			query: 'pool',
			flagged: true,
			contractor: 'Genus',
			sort: 'budget',
			range: [2012, 2020],
			projectId: 'c15'
		});
	});

	it('drops values that are not real options', () => {
		const parsed = parseViewState('?cat=nonsense&status=late&funding=free&gov=galactic&sort=random');
		expect(parsed).toEqual({});
	});

	it('applies a range when the link carries only one end', () => {
		expect(parseViewState('?y0=2015').range).toEqual([2015, DEFAULT_VIEW.range[1]]);
		expect(parseViewState('?y1=2030').range).toEqual([DEFAULT_VIEW.range[0], 2030]);
	});

	it('ignores a malformed or inverted range', () => {
		expect(parseViewState('?y0=abc&y1=2030').range).toEqual([DEFAULT_VIEW.range[0], 2030]);
		expect(parseViewState('?y0=2030&y1=2010').range).toBeUndefined();
		expect(parseViewState('?y0=20155').range).toBeUndefined();
	});

	it('only treats flag=1 as flagged', () => {
		expect(parseViewState('?flag=1').flagged).toBe(true);
		expect(parseViewState('?flag=0').flagged).toBeUndefined();
		expect(parseViewState('?flag=true').flagged).toBeUndefined();
	});
});

describe('round trip', () => {
	it('restores a fully customised view from its own link', () => {
		const original = view({
			category: 'transport',
			status: 'over_budget',
			funding: 'gov_contracted',
			governmentLevel: 'state',
			query: 'bridge',
			flagged: true,
			contractor: 'McConnell Dowell',
			sort: 'delay',
			range: [2019, 2028],
			projectId: '1'
		});
		const restored = { ...DEFAULT_VIEW, ...parseViewState('?' + serializeViewState(original)) };
		expect(restored).toEqual(original);
	});

	it('restores a view that moved only one end of the timeline', () => {
		const original = view({ range: [2015, 2036] });
		const restored = { ...DEFAULT_VIEW, ...parseViewState('?' + serializeViewState(original)) };
		expect(restored).toEqual(original);
	});
});
