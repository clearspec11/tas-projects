<script lang="ts">
	import type { BudgetSnapshot } from '$lib/types';
	import { formatCurrency, budgetGrowth } from '$lib/metrics';

	let { history, original }: { history: BudgetSnapshot[]; original?: number } = $props();

	const W = 300;
	const H = 44;
	const PAD = 4;

	const costs = $derived(history.map((h) => h.estimated_total_cost));
	const min = $derived(Math.min(...costs));
	const max = $derived(Math.max(...costs));
	const rising = $derived(costs[costs.length - 1] > costs[0]);
	const stroke = $derived(rising ? 'var(--color-danger)' : 'var(--color-success)');

	// Map each snapshot to an SVG point; a flat series sits on the mid-line.
	const pts = $derived(
		history.map((h, i) => {
			const x = history.length === 1 ? W / 2 : PAD + (i / (history.length - 1)) * (W - 2 * PAD);
			const span = max - min || 1;
			const y = H - PAD - ((h.estimated_total_cost - min) / span) * (H - 2 * PAD);
			return { x, y, ...h };
		})
	);
	const line = $derived(pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' '));
	const area = $derived(`${PAD},${H - PAD} ${line} ${W - PAD},${H - PAD}`);

	const growth = $derived(budgetGrowth({ budget_history: history } as any));
	const first = $derived(history[0]);
	const last = $derived(history[history.length - 1]);
</script>

<div>
	<div class="flex items-baseline justify-between mb-1.5">
		<span class="text-[0.6875rem] text-[var(--color-text-muted)]">
			Estimated cost over time
		</span>
		{#if growth}
			<span class="text-[0.6875rem] font-mono font-semibold" style="color: {stroke}">
				{growth.pct > 0 ? '+' : ''}{Math.round(growth.pct * 100)}% since {first.fiscal_year}
			</span>
		{/if}
	</div>

	<svg viewBox="0 0 {W} {H}" class="w-full" style="height: {H}px" role="img"
		aria-label="Estimated total cost from {formatCurrency(first.estimated_total_cost)} in {first.fiscal_year} to {formatCurrency(last.estimated_total_cost)} in {last.fiscal_year}">
		<polygon points={area} fill={stroke} fill-opacity="0.08" />
		<polyline points={line} pathLength="1" class="tas-spark-line" fill="none" stroke={stroke}
			stroke-width="2" stroke-linejoin="round" stroke-linecap="round" />
		{#each pts as p}
			<circle cx={p.x} cy={p.y} r="2.5" fill="var(--color-surface)" stroke={stroke} stroke-width="1.5">
				<title>{p.fiscal_year}: {formatCurrency(p.estimated_total_cost)}</title>
			</circle>
		{/each}
	</svg>

	<div class="flex justify-between mt-1 text-[0.625rem] text-[var(--color-text-muted)]">
		<span>{first.fiscal_year} · <span class="font-mono">{formatCurrency(first.estimated_total_cost)}</span></span>
		<span>{last.fiscal_year} · <span class="font-mono" style="color: {stroke}">{formatCurrency(last.estimated_total_cost)}</span></span>
	</div>

	{#if original && original !== first.estimated_total_cost}
		<p class="text-[0.625rem] text-[var(--color-text-muted)] mt-1">
			Originally announced at {formatCurrency(original)}.
		</p>
	{/if}
</div>

<style>
	/* Draw the trend line in when the panel opens. pathLength="1" normalises
	   the dash maths regardless of the line's real length. */
	.tas-spark-line {
		stroke-dasharray: 1;
		stroke-dashoffset: 1;
		animation: tas-spark-draw 0.6s var(--ease, cubic-bezier(0.22, 1, 0.36, 1)) forwards;
	}
	@keyframes tas-spark-draw {
		to {
			stroke-dashoffset: 0;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.tas-spark-line {
			animation: none;
			stroke-dashoffset: 0;
		}
	}
</style>
