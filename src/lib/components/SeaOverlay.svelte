<script lang="ts">
	import { projects } from '$lib/stores';
	import { formatCurrency, projectFinalCost } from '$lib/metrics';

	// Forward-looking readout. Mounted by TasMap into a Leaflet marker anchored
	// in open water, so Leaflet keeps it locked to that sea coordinate through
	// pan and zoom — exactly like the coastline. It naturally leaves view when the
	// user zooms in past Bass Strait, so it needs no separate fade.
	const live = $derived($projects.filter((p) => p.status !== 'completed' && p.status !== 'cancelled'));
	const trackingOver = $derived(
		live
			.map((p) => projectFinalCost(p))
			.filter((x): x is NonNullable<typeof x> => x !== null && x.overBy > 0)
	);
	const projectedOverrun = $derived(trackingOver.reduce((s, p) => s + p.overBy, 0));
</script>

{#if projectedOverrun > 0}
	<div class="max-md:hidden w-[15rem] select-none pointer-events-none">
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
