<script lang="ts">
	import { STATUS_CONFIG, GOVERNMENT_LEVEL_CONFIG } from '$lib/types';
	import { Flag, Minus } from '@lucide/svelte';
	import InfoTip from './InfoTip.svelte';
	import { GLOSSARY, MAP_ORIENTATION } from '$lib/glossary';

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
				<span class="flex items-center gap-1 text-xs font-semibold text-[var(--color-text)]">Legend <InfoTip text={MAP_ORIENTATION} iconSize={12} /></span>
				<button
					aria-label="Collapse legend"
					class="text-[var(--color-text-muted)] hover:text-[var(--color-text)] cursor-pointer"
					onclick={() => expanded = false}
				><Minus size={14} /></button>
			</div>

			<!-- Status colors -->
			<div class="mb-2">
				<div class="text-[0.6875rem] text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Status</div>
				{#each Object.entries(STATUS_CONFIG) as [, cfg]}
					<div class="flex items-center gap-2 py-0.5">
						<span class="w-3 h-3 rounded-full inline-block" style="background: {cfg.color};"></span>
						<span class="text-[11px] text-[var(--color-text)]">{cfg.label}</span>
					</div>
				{/each}
				<div class="flex items-center gap-2 py-0.5">
					<span class="w-3 h-3 rounded-full inline-block border-2 border-dashed border-[var(--color-danger)]"></span>
					<span class="inline-flex items-center gap-1 text-[11px] text-[var(--color-text)]"><Flag size={11} class="text-[var(--color-danger)]" /> Over budget or overdue</span>
				</div>
			</div>

			<!-- Governing tier (marker border colour) -->
			<div class="mb-2">
				<div class="flex items-center gap-1 text-[0.6875rem] text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Border = Tier <InfoTip text={GLOSSARY.tier} iconSize={11} /></div>
				{#each Object.entries(GOVERNMENT_LEVEL_CONFIG) as [, cfg]}
					<div class="flex items-center gap-2 py-0.5">
						<span class="w-3 h-3 rounded-full inline-block border-2" style="border-color: {cfg.color};"></span>
						<span class="text-[11px] text-[var(--color-text)]">{cfg.shortLabel}</span>
					</div>
				{/each}
			</div>

			<!-- Size -->
			<div>
				<div class="text-[0.6875rem] text-[var(--color-text-muted)] uppercase tracking-wider mb-1">Size = Budget</div>
				<div class="flex items-end gap-2 px-1">
					<span class="w-2 h-2 rounded-full bg-[var(--color-text-muted)] inline-block"></span>
					<span class="w-3.5 h-3.5 rounded-full bg-[var(--color-text-muted)] inline-block"></span>
					<span class="w-5 h-5 rounded-full bg-[var(--color-text-muted)] inline-block"></span>
					<span class="text-[0.6875rem] text-[var(--color-text-muted)] ml-1">Small → Large</span>
				</div>
			</div>
		</div>
	{/if}
</div>
