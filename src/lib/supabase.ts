import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let supabase: SupabaseClient | null = null;

try {
	const url = import.meta.env.PUBLIC_SUPABASE_URL;
	const key = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
	if (url && key && !url.includes('your-project')) {
		supabase = createClient(url, key);
	}
} catch {
	// Supabase not configured — use seed data
}

export { supabase };
