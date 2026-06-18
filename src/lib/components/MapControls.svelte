<script lang="ts">
	import { showHeatmap, showConnections, mapStyle } from '$lib/stores';
</script>

<div class="absolute top-4 right-4 z-[1000] flex flex-col gap-1.5">
	<!-- Map style toggle -->
	<button
		class="bg-[var(--color-surface)]/95 backdrop-blur border border-[var(--color-border)] rounded-lg px-3 py-2 text-xs cursor-pointer hover:bg-[var(--color-surface-hover)] transition-colors {$mapStyle === 'satellite' ? 'text-[var(--color-accent)] border-[var(--color-accent)]' : 'text-[var(--color-text)]'}"
		onclick={() => mapStyle.update(s => s === 'dark' ? 'satellite' : 'dark')}
	>
		{$mapStyle === 'dark' ? '🛰️ Satellite' : '🌑 Dark'}
	</button>

	<!-- Heatmap toggle -->
	<button
		class="bg-[var(--color-surface)]/95 backdrop-blur border border-[var(--color-border)] rounded-lg px-3 py-2 text-xs cursor-pointer hover:bg-[var(--color-surface-hover)] transition-colors {$showHeatmap ? 'text-[var(--color-accent)] border-[var(--color-accent)]' : 'text-[var(--color-text)]'}"
		onclick={() => showHeatmap.update(v => !v)}
	>
		🔥 Heatmap
	</button>

	<!-- Connections toggle -->
	<button
		aria-label="Toggle connections"
		class="bg-[var(--color-surface)]/95 backdrop-blur border border-[var(--color-border)] rounded-lg px-3 py-2 text-xs cursor-pointer hover:bg-[var(--color-surface-hover)] transition-colors {$showConnections ? 'text-[var(--color-accent)] border-[var(--color-accent)]' : 'text-[var(--color-text)]'}"
		onclick={() => showConnections.update(v => !v)}
	>
		🔗 Connections
	</button>
</div>
