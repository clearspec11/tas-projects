import { browser } from '$app/environment';

// Read once on the client. Svelte transitions can't query a media query
// themselves, so gate their durations through dur().
export const reducedMotion =
	browser && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const dur = (ms: number): number => (reducedMotion ? 0 : ms);
