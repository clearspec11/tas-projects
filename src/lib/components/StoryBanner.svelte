<script lang="ts">
	import { onMount } from 'svelte';
	import { projects, selectedProject, filterStatus } from '$lib/stores';
	import { formatCurrency, variance } from '$lib/metrics';

	let dismissed = $state(false);

	onMount(() => {
		dismissed = sessionStorage.getItem('tas-story-dismissed') === '1';
	});

	function dismiss() {
		dismissed = true;
		try {
			sessionStorage.setItem('tas-story-dismissed', '1');
		} catch {
			// storage unavailable; banner stays dismissed for this view only
		}
	}

	const overList = $derived($projects.filter((p) => p.status === 'over_budget'));
	const totalOver = $derived(overList.reduce((s, p) => s + Math.max(0, variance(p)), 0));

	function seeThem() {
		filterStatus.set('over_budget');
		dismiss();
	}
</script>

<!-- One-line orientation for first-time visitors; retires once they engage -->
{#if !dismissed && !$selectedProject && overList.length > 0}
	<div
		class="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] max-w-[calc(100%-7rem)] max-md:top-auto max-md:bottom-2 max-md:left-2 max-md:right-2 max-md:translate-x-0 max-md:max-w-none flex items-center gap-3 max-md:gap-2 px-4 py-2.5 max-md:px-3 max-md:py-2 rounded-xl bg-[var(--color-surface)]/95 backdrop-blur border border-[var(--color-border)] shadow-lg"
	>
		<p class="text-[0.8125rem] max-md:text-xs leading-snug">
			<strong class="text-red-400 font-semibold">{overList.length} projects</strong>
			are a combined
			<strong class="text-red-400 font-semibold tabular-nums">{formatCurrency(totalOver)}</strong>
			over budget.
		</p>
		<button
			onclick={seeThem}
			class="text-xs font-semibold px-3 py-1.5 rounded-lg border border-[var(--color-accent)] text-[var(--color-accent)] hover:bg-[var(--color-accent)]/10 transition-colors cursor-pointer whitespace-nowrap"
		>See them</button>
		<button
			onclick={dismiss}
			aria-label="Dismiss this message"
			class="text-[var(--color-text-muted)] hover:text-[var(--color-text)] leading-none cursor-pointer"
		>✕</button>
	</div>
{/if}
