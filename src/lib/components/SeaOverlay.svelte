<script lang="ts">
	import { projects, mapZoom } from '$lib/stores';
	import { TASMANIA_ZOOM } from '$lib/tasmania-geo';
	import { formatCurrency, projectFinalCost } from '$lib/metrics';

	// Forward-looking readout floated into the open sea: where the whole book is
	// heading if current trends hold. Belongs to the island-wide view, so it
	// fades out as the user zooms in to street level.
	const live = $derived($projects.filter((p) => p.status !== 'completed' && p.status !== 'cancelled'));
	const trackingOver = $derived(
		live
			.map((p) => projectFinalCost(p))
			.filter((x): x is NonNullable<typeof x> => x !== null && x.overBy > 0)
	);
	const projectedOverrun = $derived(trackingOver.reduce((s, p) => s + p.overBy, 0));

	// 1 at the whole-island zoom, fading to 0 two levels in.
	const fade = $derived(Math.max(0, Math.min(1, 1 - ($mapZoom - TASMANIA_ZOOM) / 2)));
</script>

{#if projectedOverrun > 0}
	<div
		class="absolute top-20 left-5 z-[600] max-w-[15rem] pointer-events-none select-none transition-opacity duration-300"
		style="opacity: {fade}"
		aria-hidden={fade < 0.5}
	>
		<div class="text-[0.625rem] uppercase tracking-[0.18em] text-[var(--color-text-muted)]">
			If current trends hold
		</div>
		<div class="mt-1 text-[1.875rem] leading-none font-bold tabular-nums text-[var(--color-danger)] [text-shadow:0_1px_8px_rgba(10,24,29,0.9)]">
			{formatCurrency(projectedOverrun)}
		</div>
		<div class="mt-1 text-[0.75rem] leading-snug text-[var(--color-text)] [text-shadow:0_1px_6px_rgba(10,24,29,0.95)]">
			projected overrun across {trackingOver.length} live projects
		</div>
		<a
			href="/insights"
			class="pointer-events-auto inline-block mt-1.5 text-[0.6875rem] font-medium text-[var(--color-accent)] hover:underline"
		>See the full forecast →</a>
	</div>
{/if}
