<script lang="ts">
	// A horizontal bar list: label · track · value. Themeable, responsive, and
	// accessible. Kept deliberately simple (CSS bars, no charting dep) so it
	// matches the hand-rolled sparkline and never fights the dark embed.
	let {
		data,
		color = 'var(--color-accent)',
		format = (n: number) => String(n),
		labelWidth = '7rem'
	}: {
		// A per-row `color` wins over the shared one, so a chart whose categories
		// already have semantic colours (funders, statuses) can carry them through.
		data: { label: string; value: number; color?: string }[];
		color?: string;
		format?: (n: number) => string;
		labelWidth?: string;
	} = $props();

	const max = $derived(Math.max(1, ...data.map((d) => d.value)));
</script>

<div class="flex flex-col gap-2">
	{#each data as d (d.label)}
		<div
			class="grid items-center gap-3 text-xs"
			style="grid-template-columns: {labelWidth} 1fr auto"
		>
			<span class="truncate text-[var(--color-text-muted)]" title={d.label}>{d.label}</span>
			<div class="h-5 rounded bg-[var(--color-bg)] overflow-hidden">
				<div
					class="h-full rounded tas-bar"
					style="width: {(d.value / max) * 100}%; background: {d.color ?? color};"
				></div>
			</div>
			<span class="tabular-nums font-medium w-16 text-right" style="color: {d.color ?? color}">{format(d.value)}</span>
		</div>
	{/each}
</div>

<style>
	/* Grow the bar in from the left on mount; static under reduced motion. */
	.tas-bar {
		transform-origin: left;
		animation: tas-bar-grow 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
	}
	@keyframes tas-bar-grow {
		from {
			transform: scaleX(0);
		}
		to {
			transform: scaleX(1);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.tas-bar {
			animation: none;
		}
	}
</style>
