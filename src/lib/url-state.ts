// The shareable view: every filter, the sort, the timeline range and the open
// project, encoded in the query string. Pure functions so the page can stay
// thin and the round trip can be tested.

import {
	CATEGORY_CONFIG,
	STATUS_CONFIG,
	FUNDING_CONFIG,
	GOVERNMENT_LEVEL_CONFIG,
	type ProjectCategory,
	type ProjectStatus,
	type FundingType,
	type GovernmentLevel
} from './types';
import { SORT_OPTIONS, type SortKey } from './metrics';

export interface ViewState {
	category: ProjectCategory | 'all';
	status: ProjectStatus | 'all';
	funding: FundingType | 'all';
	governmentLevel: GovernmentLevel | 'all';
	query: string;
	flagged: boolean;
	contractor: string | null;
	sort: SortKey;
	range: [number, number];
	projectId: string | null;
}

export const DEFAULT_VIEW: ViewState = {
	category: 'all',
	status: 'all',
	funding: 'all',
	governmentLevel: 'all',
	query: '',
	flagged: false,
	contractor: null,
	sort: 'variance',
	range: [2008, 2036],
	projectId: null
};

// A value from the URL is only accepted if it names a real option; anything
// else (a typo, an old link, a tampered parameter) is dropped rather than
// applied as a filter that silently matches nothing.
function oneOf<T extends string>(value: string | null, allowed: readonly string[]): T | undefined {
	return value !== null && allowed.includes(value) ? (value as T) : undefined;
}

const year = (v: string | null): number | undefined => {
	if (v === null || !/^\d{4}$/.test(v)) return undefined;
	return Number(v);
};

// Reads a query string into the parts of the view it specifies. Keys that are
// absent or invalid are left out, so the caller keeps its current value.
export function parseViewState(search: string): Partial<ViewState> {
	const sp = new URLSearchParams(search);
	const out: Partial<ViewState> = {};

	const category = oneOf<ProjectCategory>(sp.get('cat'), Object.keys(CATEGORY_CONFIG));
	if (category) out.category = category;
	const status = oneOf<ProjectStatus>(sp.get('status'), Object.keys(STATUS_CONFIG));
	if (status) out.status = status;
	const funding = oneOf<FundingType>(sp.get('funding'), Object.keys(FUNDING_CONFIG));
	if (funding) out.funding = funding;
	const gov = oneOf<GovernmentLevel>(sp.get('gov'), Object.keys(GOVERNMENT_LEVEL_CONFIG));
	if (gov) out.governmentLevel = gov;
	const sort = oneOf<SortKey>(sp.get('sort'), SORT_OPTIONS.map((o) => o.value));
	if (sort) out.sort = sort;

	const q = sp.get('q');
	if (q) out.query = q;
	if (sp.get('flag') === '1') out.flagged = true;
	const contractor = sp.get('contractor');
	if (contractor) out.contractor = contractor;

	// A link may carry one end of the range; the other keeps its default.
	const from = year(sp.get('y0'));
	const to = year(sp.get('y1'));
	if (from !== undefined || to !== undefined) {
		const y0 = from ?? DEFAULT_VIEW.range[0];
		const y1 = to ?? DEFAULT_VIEW.range[1];
		if (y0 <= y1) out.range = [y0, y1];
	}

	const p = sp.get('p');
	if (p) out.projectId = p;

	return out;
}

// Writes the view as a query string (no leading "?"), omitting anything still
// at its default so a fresh view has a clean URL.
export function serializeViewState(s: ViewState): string {
	const sp = new URLSearchParams();
	if (s.category !== DEFAULT_VIEW.category) sp.set('cat', s.category);
	if (s.status !== DEFAULT_VIEW.status) sp.set('status', s.status);
	if (s.funding !== DEFAULT_VIEW.funding) sp.set('funding', s.funding);
	if (s.governmentLevel !== DEFAULT_VIEW.governmentLevel) sp.set('gov', s.governmentLevel);
	if (s.query) sp.set('q', s.query);
	if (s.flagged) sp.set('flag', '1');
	if (s.contractor) sp.set('contractor', s.contractor);
	if (s.sort !== DEFAULT_VIEW.sort) sp.set('sort', s.sort);
	if (s.range[0] !== DEFAULT_VIEW.range[0]) sp.set('y0', String(s.range[0]));
	if (s.range[1] !== DEFAULT_VIEW.range[1]) sp.set('y1', String(s.range[1]));
	if (s.projectId) sp.set('p', s.projectId);
	return sp.toString();
}
