<script lang="ts">
	import { STATUS_CONFIG, FUNDING_CONFIG } from '$lib/types';

	let expanded = $state(true);
</script>

<div class="absolute bottom-6 left-4 z-[1000]">
	<button
		class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg px-3 py-1.5 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)] cursor-pointer mb-1 {expanded ? 'hidden' : ''}"
		onclick={() => expanded = true}
	>Legend</button>

	{#if expanded}
		<div class="bg-[var(--color-surface)]/95 backdrop-blur border border-[var(--color-border)] rounded-xl p-3 shadow-lg min-w-[180px]">
			<div class="flex items-center justify-between mb-2">
				<span class="text-xs font-semibold text-[var(--color-text)]">Legend</span>
				<button
					class="text-[var(--color-text-muted)] hover:text-[var(--color-text)] text-xs cursor-pointer"
					onclick={() => expanded = false}
				>_</button>
			</div>

			<!-- Status colors -->
			<div class="mb-2">
				<div class="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Status</div>
				{#each Object.entries(STATUS_CONFIG) as [, cfg]}
					<div class="flex items-center gap-2 py-0.5">
						<span class="w-3 h-3 rounded-full inline-block" style="background: {cfg.color};"></span>
						<span class="text-[11px] text-[var(--color-text)]">{cfg.label}</span>
					</div>
				{/each}
			</div>

			<!-- Funding type borders -->
			<div class="mb-2">
				<div class="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Funding</div>
				{#each Object.entries(FUNDING_CONFIG) as [, cfg]}
					<div class="flex items-center gap-2 py-0.5">
						<span class="w-3 h-3 rounded-full inline-block border-2 border-[var(--color-text)]" style="border-style: {cfg.borderStyle};"></span>
						<span class="text-[11px] text-[var(--color-text)]">{cfg.shortLabel}</span>
					</div>
				{/each}
			</div>

			<!-- Size -->
			<div>
				<div class="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Size = Budget</div>
				<div class="flex items-end gap-2 px-1">
					<span class="w-2 h-2 rounded-full bg-[var(--color-text-muted)] inline-block"></span>
					<span class="w-3.5 h-3.5 rounded-full bg-[var(--color-text-muted)] inline-block"></span>
					<span class="w-5 h-5 rounded-full bg-[var(--color-text-muted)] inline-block"></span>
					<span class="text-[10px] text-[var(--color-text-muted)] ml-1">Small → Large</span>
				</div>
			</div>
		</div>
	{/if}
</div>
