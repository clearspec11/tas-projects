<script lang="ts">
	import { showHeatmap, showConnections, mapStyle, selectedProject } from '$lib/stores';
	import { Satellite, Moon, Flame, Link2 } from '@lucide/svelte';

	const btn =
		'inline-flex items-center gap-1.5 bg-[var(--color-surface)]/95 backdrop-blur border ' +
		'border-[var(--color-border)] rounded-lg px-3 py-2 max-md:min-h-11 text-xs cursor-pointer ' +
		'hover:bg-[var(--color-surface-hover)] transition-colors';
</script>

<!-- Steps left into the open map when a project's detail panel takes the
     right-hand lane, in step with the other map panels. -->
<div class="map-controls absolute top-4 right-4 z-[1000] flex flex-col gap-1.5 items-end" class:aside={$selectedProject !== null}>
	<!-- Map style toggle -->
	<button
		class="{btn} {$mapStyle === 'satellite' ? 'text-[var(--color-accent)] border-[var(--color-accent)]' : 'text-[var(--color-text)]'}"
		aria-label={$mapStyle === 'dark' ? 'Switch to satellite map' : 'Switch to dark map'}
		onclick={() => mapStyle.update(s => s === 'dark' ? 'satellite' : 'dark')}
	>
		{#if $mapStyle === 'dark'}<Satellite size={14} /> Satellite{:else}<Moon size={14} /> Dark{/if}
	</button>

	<!-- Heatmap toggle -->
	<button
		class="{btn} {$showHeatmap ? 'text-[var(--color-accent)] border-[var(--color-accent)]' : 'text-[var(--color-text)]'}"
		aria-pressed={$showHeatmap}
		onclick={() => showHeatmap.update(v => !v)}
	>
		<Flame size={14} /> Heatmap
	</button>

	<!-- Connections toggle -->
	<button
		class="{btn} {$showConnections ? 'text-[var(--color-accent)] border-[var(--color-accent)]' : 'text-[var(--color-text)]'}"
		aria-pressed={$showConnections}
		onclick={() => showConnections.update(v => !v)}
	>
		<Link2 size={14} /> Connections
	</button>
</div>

<style>
	/* 25rem is the detail panel (24rem) plus its 1rem margin. Desktop only: on
	   phones the detail is a full-screen sheet and nothing needs to move. */
	@media (min-width: 48rem) {
		.map-controls {
			transition: transform 280ms cubic-bezier(0.4, 0, 0.2, 1);
		}
		.map-controls.aside {
			transform: translateX(-25rem);
		}
	}
</style>
