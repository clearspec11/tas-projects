<script lang="ts">
	import { projects, mapZoom } from '$lib/stores';
	import { formatCurrency, projectFinalCost } from '$lib/metrics';

	const live = $derived($projects.filter((p) => p.status !== 'completed' && p.status !== 'cancelled'));
	const trackingOver = $derived(
		live
			.map((p) => projectFinalCost(p))
			.filter((x): x is NonNullable<typeof x> => x !== null && x.overBy > 0)
	);
	const projectedOverrun = $derived(trackingOver.reduce((s, p) => s + p.overBy, 0));

	// Fade out as the user zooms in past the whole-island view — at zoom 9+ Bass
	// Strait is off-screen and the readout has no context.
	const opacity = $derived(
		$mapZoom <= 7.5 ? 1 :
		$mapZoom >= 9   ? 0 :
		1 - ($mapZoom - 7.5) / 1.5
	);
</script>

{#if projectedOverrun > 0 && opacity > 0}
	<div
		class="max-md:hidden absolute select-none pointer-events-none"
		style="top: 38%; left: 20%; opacity: {opacity}; transition: opacity 400ms ease; z-index: 750;"
		aria-hidden="true"
	>
		<div class="text-[0.6875rem] text-[var(--color-text-muted)] [text-shadow:0_1px_6px_rgba(12,20,16,0.95)]">
			If current trends hold
		</div>
		<div class="mt-1 text-[1.875rem] leading-none font-bold tabular-nums text-[var(--color-danger)] [text-shadow:0_1px_8px_rgba(12,20,16,0.95)]">
			{formatCurrency(projectedOverrun)}
		</div>
		<div class="mt-1 text-[0.75rem] leading-snug text-[var(--color-text)] [text-shadow:0_1px_6px_rgba(12,20,16,0.98)]">
			projected overrun across {trackingOver.length} live projects
		</div>
		<a
			href="/insights"
			class="pointer-events-auto inline-block mt-1.5 text-[0.6875rem] font-medium text-[var(--color-accent)] hover:underline [text-shadow:0_1px_6px_rgba(12,20,16,0.95)]"
		>See the full forecast →</a>
	</div>
{/if}
