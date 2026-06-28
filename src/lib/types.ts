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
	budget: number;
	spent: number;
	// First publicly announced total cost, for original-vs-current comparison.
	original_budget?: number;
	lat: number;
	lng: number;
	location_name: string;
	start_date: string;
	expected_end_date: string | null;
	// When a completed project actually finished (vs the promised expected_end_date).
	actual_end_date?: string | null;
	contractor: string | null;
	related_project_ids: string[];
	source_url?: string;
	funding_breakdown?: FundingBreakdown;
	// Cost-escalation trail from successive budget papers, oldest first.
	budget_history?: BudgetSnapshot[];
	// Date this row's figures were last checked against the cited source.
	last_verified?: string;
	created_at: string;
	updated_at: string;
}

export const FUNDER_CONFIG: Record<keyof FundingBreakdown, { label: string; color: string }> = {
	federal: { label: 'Federal', color: '#9a8ad6' },
	state: { label: 'State', color: '#3fa39e' },
	local: { label: 'Local', color: '#5aa84f' },
	private: { label: 'Private', color: '#e0933a' }
};

export const STATUS_CONFIG: Record<ProjectStatus, { label: string; color: string; bgClass: string }> = {
	on_budget: { label: 'On Budget', color: '#5aa84f', bgClass: 'bg-[#5aa84f]/15 text-[#7cc070]' },
	over_budget: { label: 'Over Budget', color: '#df5a39', bgClass: 'bg-[#df5a39]/15 text-[#ec8366]' },
	under_budget: { label: 'Under Budget', color: '#3fa39e', bgClass: 'bg-[#3fa39e]/15 text-[#63c0bb]' },
	completed: { label: 'Completed', color: '#ab8ad6', bgClass: 'bg-[#ab8ad6]/15 text-[#c2a8e3]' },
	cancelled: { label: 'Cancelled', color: '#889085', bgClass: 'bg-[#889085]/15 text-[#a8b0a4]' }
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
	federal: { label: 'Federal Government', shortLabel: 'Federal', color: '#9a8ad6', description: 'Led and mainly funded by the Australian Government' },
	state: { label: 'State Government', shortLabel: 'State', color: '#3fa39e', description: 'Led by the Tasmanian state government' },
	local: { label: 'Local Council', shortLabel: 'Council', color: '#5aa84f', description: 'Led by a local council' }
};

export const FUNDING_CONFIG: Record<FundingType, { label: string; shortLabel: string; dashArray: string; borderStyle: string; description: string }> = {
	public: { label: 'Fully Public', shortLabel: 'Public', dashArray: '', borderStyle: 'solid', description: 'Paid for and delivered by government' },
	ppp: { label: 'Public-Private Partnership', shortLabel: 'PPP', dashArray: '8 4', borderStyle: 'dashed', description: 'Government and private investors share the cost and the risk' },
	gov_funded_private: { label: 'Government-Funded Private', shortLabel: 'Gov Funded', dashArray: '3 3', borderStyle: 'dotted', description: 'A privately owned project built with public money' },
	gov_contracted: { label: 'Government-Contracted', shortLabel: 'Contracted', dashArray: '12 4 3 4', borderStyle: 'dashed', description: 'Paid for by government, built by a private contractor' }
};
