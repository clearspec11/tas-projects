<script lang="ts">
	import { showHeatmap, showConnections, mapStyle } from '$lib/stores';
	import { Satellite, Moon, Flame, Link2 } from '@lucide/svelte';

	const btn =
		'inline-flex items-center gap-1.5 bg-[var(--color-surface)]/95 backdrop-blur border ' +
		'border-[var(--color-border)] rounded-lg px-3 py-2 text-xs cursor-pointer ' +
		'hover:bg-[var(--color-surface-hover)] transition-colors';
</script>

<div class="absolute top-4 right-4 z-[1000] flex flex-col gap-1.5 items-end">
	<!-- Map style toggle -->
	<button
		class="{btn} {$mapStyle === 'satellite' ? 'text-[var(--color-accent)] border-[var(--color-accent)]' : 'text-[var(--color-text)]'}"
		onclick={() => mapStyle.update(s => s === 'dark' ? 'satellite' : 'dark')}
	>
		{#if $mapStyle === 'dark'}<Satellite size={14} /> Satellite{:else}<Moon size={14} /> Dark{/if}
	</button>

	<!-- Heatmap toggle -->
	<button
		class="{btn} {$showHeatmap ? 'text-[var(--color-accent)] border-[var(--color-accent)]' : 'text-[var(--color-text)]'}"
		onclick={() => showHeatmap.update(v => !v)}
	>
		<Flame size={14} /> Heatmap
	</button>

	<!-- Connections toggle -->
	<button
		class="{btn} {$showConnections ? 'text-[var(--color-accent)] border-[var(--color-accent)]' : 'text-[var(--color-text)]'}"
		onclick={() => showConnections.update(v => !v)}
	>
		<Link2 size={14} /> Links
	</button>
</div>
