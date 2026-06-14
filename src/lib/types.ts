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
	federal: { label: 'Federal', color: '#6366f1' },
	state: { label: 'State', color: '#38bdf8' },
	local: { label: 'Local', color: '#34d399' },
	private: { label: 'Private', color: '#f59e0b' }
};

export const STATUS_CONFIG: Record<ProjectStatus, { label: string; color: string; bgClass: string }> = {
	on_budget: { label: 'On Budget', color: '#22c55e', bgClass: 'bg-green-500/20 text-green-400' },
	over_budget: { label: 'Over Budget', color: '#ef4444', bgClass: 'bg-red-500/20 text-red-400' },
	under_budget: { label: 'Under Budget', color: '#38bdf8', bgClass: 'bg-sky-500/20 text-sky-400' },
	completed: { label: 'Completed', color: '#a78bfa', bgClass: 'bg-violet-500/20 text-violet-400' },
	cancelled: { label: 'Cancelled', color: '#6b7280', bgClass: 'bg-gray-500/20 text-gray-400' }
};

export const CATEGORY_CONFIG: Record<ProjectCategory, { label: string; icon: string }> = {
	transport: { label: 'Transport', icon: '🛣️' },
	health: { label: 'Health', icon: '🏥' },
	education: { label: 'Education', icon: '🎓' },
	utilities: { label: 'Utilities', icon: '⚡' },
	housing: { label: 'Housing', icon: '🏘️' },
	environment: { label: 'Environment', icon: '🌿' },
	community: { label: 'Community', icon: '🏛️' },
	other: { label: 'Other', icon: '📋' }
};

export const GOVERNMENT_LEVEL_CONFIG: Record<GovernmentLevel, { label: string; shortLabel: string; color: string; description: string }> = {
	federal: { label: 'Federal Government', shortLabel: 'Federal', color: '#818cf8', description: 'Led and mainly funded by the Australian Government' },
	state: { label: 'State Government', shortLabel: 'State', color: '#38bdf8', description: 'Led by the Tasmanian state government' },
	local: { label: 'Local Council', shortLabel: 'Council', color: '#34d399', description: 'Led by a local council' }
};

export const FUNDING_CONFIG: Record<FundingType, { label: string; shortLabel: string; dashArray: string; borderStyle: string; description: string }> = {
	public: { label: 'Fully Public', shortLabel: 'Public', dashArray: '', borderStyle: 'solid', description: 'Paid for and delivered by government' },
	ppp: { label: 'Public-Private Partnership', shortLabel: 'PPP', dashArray: '8 4', borderStyle: 'dashed', description: 'Government and private investors share the cost and the risk' },
	gov_funded_private: { label: 'Government-Funded Private', shortLabel: 'Gov Funded', dashArray: '3 3', borderStyle: 'dotted', description: 'A privately owned project built with public money' },
	gov_contracted: { label: 'Government-Contracted', shortLabel: 'Contracted', dashArray: '12 4 3 4', borderStyle: 'dashed', description: 'Paid for by government, built by a private contractor' }
};
