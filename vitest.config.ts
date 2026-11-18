import { defineConfig } from 'vitest/config';

// metrics.ts is pure TS (no Svelte/$app/$env), so a plain node environment
// is enough and avoids pulling the SvelteKit plugin into the test run.
export default defineConfig({
	test: {
		environment: 'node',
		include: ['src/**/*.{test,spec}.ts']
	}
});
