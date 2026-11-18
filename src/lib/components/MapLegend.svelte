<script lang="ts">
	import { STATUS_CONFIG, GOVERNMENT_LEVEL_CONFIG } from '$lib/types';
	import { onMount, tick } from 'svelte';
	import { Flag, Minus, Info } from '@lucide/svelte';
	import InfoTip from './InfoTip.svelte';
	import { GLOSSARY, MAP_ORIENTATION } from '$lib/glossary';
	import { sidebarOpen } from '$lib/stores';

	// Collapsed by default so the first view of the map isn't crowded; the
	// choice is remembered for returning visitors.
	const KEY = 'tas-legend-open';
	let expanded = $state(false);
	let openButton: HTMLButtonElement | undefined = $state();
	let closeButton: HTMLButtonElement | undefined = $state();

	onMount(() => {
		try {
			expanded = localStorage.getItem(KEY) === '1';
		} catch {
			// storage unavailable; stay collapsed
		}
	});

	async function setExpanded(open: boolean) {
		expanded = open;
		try {
			localStorage.setItem(KEY, open ? '1' : '0');
		} catch {
			// storage unavailable; the choice just won't persist
		}
		// The button that was pressed is swapped out for its counterpart, so
		// carry focus across instead of letting it fall back to the page.
		await tick();
		(open ? closeButton : openButton)?.focus();
	}
</script>

<!-- Desktop: bottom-left. Phones: under the zoom control, clear of the banner
     at the bottom of the map. -->
<div
	class="absolute z-[1000] md:bottom-6 md:left-4 max-md:top-[5.5rem] max-md:left-2.5"
	style="transform: translateX({$sidebarOpen ? '24rem' : '0'}); transition: transform 280ms cubic-bezier(0.4,0,0.2,1);"
>
	{#if !expanded}
	<button
		class="inline-flex items-center gap-1.5 bg-[var(--color-surface)]/95 backdrop-blur border border-[var(--color-border)] rounded-lg px-3 py-2 text-xs text-[var(--color-text)] hover:bg-[var(--color-surface-hover)] cursor-pointer"
		bind:this={openButton}
		aria-expanded="false"
		onclick={() => setExpanded(true)}
	><Info size={14} class="text-[var(--color-accent)]" /> Legend</button>
	{:else}
		<div class="bg-[var(--color-surface)]/95 backdrop-blur border border-[var(--color-border)] rounded-xl p-3 shadow-lg w-[15rem] max-h-[calc(100vh-14rem)] overflow-y-auto">
			<div class="flex items-center justify-between mb-2">
				<span class="text-xs font-semibold text-[var(--color-text)]">Legend</span>
				<button
					bind:this={closeButton}
					aria-label="Collapse legend"
					aria-expanded="true"
					class="text-[var(--color-text-muted)] hover:text-[var(--color-text)] cursor-pointer"
					onclick={() => setExpanded(false)}
				><Minus size={14} /></button>
			</div>

			<!-- The orientation is plain text, not a hover tip, so touch users get it. -->
			<p class="text-[0.6875rem] leading-snug text-[var(--color-text-muted)] mb-2.5">{MAP_ORIENTATION}</p>

			<!-- Status colors -->
			<div class="mb-2">
				<div class="text-[0.6875rem] text-[var(--color-text-muted)] mb-1">Status</div>
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
				<div class="flex items-center gap-1 text-[0.6875rem] text-[var(--color-text-muted)] mb-1">Border = Tier <InfoTip text={GLOSSARY.tier} iconSize={11} /></div>
				{#each Object.entries(GOVERNMENT_LEVEL_CONFIG) as [, cfg]}
					<div class="flex items-center gap-2 py-0.5">
						<span class="w-3 h-3 rounded-full inline-block border-2" style="border-color: {cfg.color};"></span>
						<span class="text-[11px] text-[var(--color-text)]">{cfg.shortLabel}</span>
					</div>
				{/each}
			</div>

			<!-- Size -->
			<div>
				<div class="text-[0.6875rem] text-[var(--color-text-muted)] mb-1">Size = Budget</div>
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
