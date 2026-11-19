import { defineConfig } from 'vitest/config';

// The tested modules are pure TS (data.ts has its Supabase client mocked), so
// a plain node environment
// is enough and avoids pulling the SvelteKit plugin into the test run.
export default defineConfig({
	test: {
		environment: 'node',
		include: ['src/**/*.{test,spec}.ts']
	}
});
