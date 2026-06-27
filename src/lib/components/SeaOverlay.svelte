<script lang="ts">
	import { projects, mapZoom, sidebarOpen } from '$lib/stores';
	import { formatCurrency, projectFinalCost } from '$lib/metrics';

	const live = $derived($projects.filter((p) => p.status !== 'completed' && p.status !== 'cancelled'));
	const trackingOver = $derived(
		live
			.map((p) => projectFinalCost(p))
			.filter((x): x is NonNullable<typeof x> => x !== null && x.overBy > 0)
	);
	const projectedOverrun = $derived(trackingOver.reduce((s, p) => s + p.overBy, 0));

	// This is a whole-island summary, so it only makes sense at the overview
	// zooms. Fade it out as the user zooms in to inspect individual projects.
	const shown = $derived($mapZoom <= 8);
</script>

{#if projectedOverrun > 0}
	<!-- Docked to the map's top-left rather than floated over the geography:
	     markers and the coastline never reach this corner, so it stays legible at
	     every zoom and pan instead of colliding with the island. Sits below the
	     zoom control and slides clear of the sidebar when the panel opens. -->
	<div
		class="max-md:hidden absolute top-20 left-4 w-[14rem] select-none pointer-events-none rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/80 backdrop-blur-sm px-3.5 py-3"
		style="z-index: 750; opacity: {shown ? 1 : 0}; transform: translateX({$sidebarOpen ? '24rem' : '0'}); transition: opacity 220ms ease, transform 280ms cubic-bezier(0.4,0,0.2,1);"
		aria-hidden={!shown}
	>
		<div class="text-[0.6875rem] text-[var(--color-text-muted)]">If current trends hold</div>
		<div class="mt-1 text-[1.75rem] leading-none font-bold tabular-nums text-[var(--color-danger)]">
			{formatCurrency(projectedOverrun)}
		</div>
		<div class="mt-1.5 text-[0.75rem] leading-snug text-[var(--color-text)]">
			projected overrun across {trackingOver.length} live projects
		</div>
		<a
			href="/insights"
			class="pointer-events-auto inline-block mt-2 text-[0.6875rem] font-medium text-[var(--color-accent)] hover:underline"
		>See the full forecast →</a>
	</div>
{/if}
