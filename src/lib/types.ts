import { TOKENS } from './tokens';

export type ProjectStatus = 'on_budget' | 'over_budget' | 'under_budget' | 'completed' | 'cancelled';
export type ProjectCategory = 'transport' | 'health' | 'education' | 'utilities' | 'housing' | 'environment' | 'community' | 'other';
export type FundingType = 'public' | 'ppp' | 'gov_funded_private' | 'gov_contracted';
export type GovernmentLevel = 'federal' | 'state' | 'local';

export interface FundingBreakdown {
	federal: number;
	state: number;
	local: number;
	private: number;
}

// One announced estimated total cost as recorded in a given budget paper / source.
export interface BudgetSnapshot {
	fiscal_year: string; // e.g. "2023-24"
	estimated_total_cost: number;
}

export interface Project {
	government_level: GovernmentLevel;
	council?: string;
	id: string;
	name: string;
	description: string;
	category: ProjectCategory;
	status: ProjectStatus;
	funding_type: FundingType;
	// Latest official estimated total cost.
	budget: number;
	// Money actually paid out so far. null when no source publishes it; an
	// estimate must never be stored here.
	spent: number | null;
	// First publicly announced total cost, for original-vs-current comparison.
	original_budget?: number;
	lat: number;
	lng: number;
	location_name: string;
	// null when no source gives a start date.
	start_date: string | null;
	expected_end_date: string | null;
	// When a completed project actually finished (vs the promised expected_end_date).
	actual_end_date?: string | null;
	contractor: string | null;
	related_project_ids: string[];
	source_url?: string;
	funding_breakdown?: FundingBreakdown;
	// Plain-language caveat or explanation shown with the funding split, e.g.
	// when a share is proposed rather than committed, or dollars aren't published.
	funding_note?: string;
	// Cost-escalation trail from successive budget papers, oldest first.
	budget_history?: BudgetSnapshot[];
	// Date this row's figures were last checked against the cited source.
	last_verified?: string;
	created_at: string;
	updated_at: string;
}

export const FUNDER_CONFIG: Record<keyof FundingBreakdown, { label: string; color: string }> = {
	federal: { label: 'Federal', color: TOKENS.tierFederal },
	state: { label: 'State', color: TOKENS.tierState },
	local: { label: 'Local', color: TOKENS.tierLocal },
	private: { label: 'Private', color: TOKENS.fundPrivate }
};

// Chip text uses a lighter tint of each status hue so it holds 4.5:1 on the
// 15% wash; the fills themselves come from the tokens.
export const STATUS_CONFIG: Record<ProjectStatus, { label: string; color: string; bgClass: string }> = {
	on_budget: { label: 'On Budget', color: TOKENS.statusOnBudget, bgClass: 'bg-[var(--color-status-on-budget)]/15 text-[#7cc070]' },
	over_budget: { label: 'Over Budget', color: TOKENS.statusOverBudget, bgClass: 'bg-[var(--color-status-over-budget)]/15 text-[#ec8366]' },
	under_budget: { label: 'Under Budget', color: TOKENS.statusUnderBudget, bgClass: 'bg-[var(--color-status-under-budget)]/15 text-[#63c0bb]' },
	completed: { label: 'Completed', color: TOKENS.statusCompleted, bgClass: 'bg-[var(--color-status-completed)]/15 text-[#c2a8e3]' },
	cancelled: { label: 'Cancelled', color: TOKENS.statusCancelled, bgClass: 'bg-[var(--color-status-cancelled)]/15 text-[#a8b0a4]' }
};

export const CATEGORY_CONFIG: Record<ProjectCategory, { label: string }> = {
	transport: { label: 'Transport' },
	health: { label: 'Health' },
	education: { label: 'Education' },
	utilities: { label: 'Utilities' },
	housing: { label: 'Housing' },
	environment: { label: 'Environment' },
	community: { label: 'Community' },
	other: { label: 'Other' }
};

export const GOVERNMENT_LEVEL_CONFIG: Record<GovernmentLevel, { label: string; shortLabel: string; color: string; description: string }> = {
	federal: { label: 'Federal Government', shortLabel: 'Federal', color: TOKENS.tierFederal, description: 'Led and mainly funded by the Australian Government' },
	state: { label: 'State Government', shortLabel: 'State', color: TOKENS.tierState, description: 'Led by the Tasmanian state government' },
	local: { label: 'Local Council', shortLabel: 'Council', color: TOKENS.tierLocal, description: 'Led by a local council' }
};

export const FUNDING_CONFIG: Record<FundingType, { label: string; shortLabel: string; dashArray: string; borderStyle: string; description: string }> = {
	public: { label: 'Fully Public', shortLabel: 'Public', dashArray: '', borderStyle: 'solid', description: 'Paid for and delivered by government' },
	ppp: { label: 'Public-Private Partnership', shortLabel: 'PPP', dashArray: '8 4', borderStyle: 'dashed', description: 'Government and private investors share the cost and the risk' },
	gov_funded_private: { label: 'Government-Funded Private', shortLabel: 'Gov Funded', dashArray: '3 3', borderStyle: 'dotted', description: 'A privately owned project built with public money' },
	gov_contracted: { label: 'Government-Contracted', shortLabel: 'Contracted', dashArray: '12 4 3 4', borderStyle: 'dashed', description: 'Paid for by government, built by a private contractor' }
};
