import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/public';

// Lazily created so a missing / placeholder config simply means "use seed data"
// rather than throwing at import time.
let client: SupabaseClient | null | undefined;

export function getSupabase(): SupabaseClient | null {
	if (client !== undefined) return client;
	const url = env.PUBLIC_SUPABASE_URL;
	const key = env.PUBLIC_SUPABASE_ANON_KEY;
	client = url && key && !url.includes('your-project') ? createClient(url, key) : null;
	return client;
}

export const isSupabaseConfigured = (): boolean => getSupabase() !== null;
