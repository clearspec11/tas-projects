<script lang="ts">
	import { projects, mapZoom, seaOverlayPos } from '$lib/stores';
	import { TASMANIA_ZOOM } from '$lib/tasmania-geo';
	import { formatCurrency, projectFinalCost } from '$lib/metrics';

	// Forward-looking readout pinned to a fixed open-water coordinate (TasMap
	// publishes its container-pixel position), so it rides the sea as the user
	// pans and zooms. Fades out past the whole-island view; it speaks to the
	// island as a whole, not to any street.
	const live = $derived($projects.filter((p) => p.status !== 'completed' && p.status !== 'cancelled'));
	const trackingOver = $derived(
		live
			.map((p) => projectFinalCost(p))
			.filter((x): x is NonNullable<typeof x> => x !== null && x.overBy > 0)
	);
	const projectedOverrun = $derived(trackingOver.reduce((s, p) => s + p.overBy, 0));

	// 1 at the whole-island zoom, fading to 0 two levels in.
	const fade = $derived(Math.max(0, Math.min(1, 1 - ($mapZoom - TASMANIA_ZOOM) / 2)));
	const pos = $derived($seaOverlayPos);
</script>

{#if projectedOverrun > 0 && pos}
	<div
		class="absolute top-0 left-0 z-[600] w-[15rem] select-none transition-opacity duration-200"
		class:pointer-events-none={fade < 0.5}
		style="transform: translate3d({pos.x}px, {pos.y}px, 0); opacity: {fade}; will-change: transform;"
		aria-hidden={fade < 0.5}
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
