import type { Project } from './types';
import { SEED_PROJECTS } from './seed-data';
import { getSupabase } from './supabase';

export type ProjectSource = 'supabase' | 'seed';

export interface ProjectLoad {
	projects: Project[];
	source: ProjectSource;
	error?: string;
}

// Map a Supabase row (snake_case, nullable columns) to the app's Project type.
function rowToProject(r: Record<string, unknown>): Project {
	return {
		id: String(r.id),
		name: String(r.name ?? ''),
		description: String(r.description ?? ''),
		category: r.category as Project['category'],
		status: r.status as Project['status'],
		funding_type: r.funding_type as Project['funding_type'],
		government_level: r.government_level as Project['government_level'],
		council: (r.council as string) ?? undefined,
		budget: Number(r.budget ?? 0),
		spent: Number(r.spent ?? 0),
		lat: Number(r.lat),
		lng: Number(r.lng),
		location_name: String(r.location_name ?? ''),
		start_date: String(r.start_date),
		expected_end_date: (r.expected_end_date as string) ?? null,
		contractor: (r.contractor as string) ?? null,
		related_project_ids: (r.related_project_ids as string[]) ?? [],
		source_url: (r.source_url as string) ?? undefined,
		funding_breakdown: (r.funding_breakdown as Project['funding_breakdown']) ?? undefined,
		created_at: String(r.created_at ?? ''),
		updated_at: String(r.updated_at ?? '')
	};
}

// Returns Supabase data when a project is configured and the query succeeds;
// otherwise falls back to the bundled seed data so the app always renders.
export async function loadProjects(): Promise<ProjectLoad> {
	const supabase = getSupabase();
	if (!supabase) return { projects: SEED_PROJECTS, source: 'seed' };

	try {
		const { data, error } = await supabase.from('projects').select('*');
		if (error) return { projects: SEED_PROJECTS, source: 'seed', error: error.message };
		if (!data || data.length === 0) return { projects: SEED_PROJECTS, source: 'seed' };
		return { projects: data.map(rowToProject), source: 'supabase' };
	} catch (e) {
		return { projects: SEED_PROJECTS, source: 'seed', error: e instanceof Error ? e.message : 'unknown error' };
	}
}
