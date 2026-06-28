<script lang="ts">
	import { Tooltip } from 'melt/builders';
	import { Info } from '@lucide/svelte';

	// Inline plain-language definition. Pass `term` to underline a word as the
	// trigger, or omit it for a small info icon. Content uses Melt's native
	// popover, so it escapes scroll containers (e.g. the project detail panel)
	// instead of being clipped, and is keyboard- and screen-reader-accessible.
	let {
		text,
		term = '',
		iconSize = 13
	}: { text: string; term?: string; iconSize?: number } = $props();

	const tip = new Tooltip({ openDelay: 120, closeDelay: 120 });
</script>

{#if term}
	<button
		type="button"
		{...tip.trigger}
		class="underline decoration-dotted underline-offset-2 cursor-help text-inherit"
	>{term}</button>
{:else}
	<button
		type="button"
		{...tip.trigger}
		aria-label="What does this mean?"
		class="inline-flex align-middle text-[var(--color-text-muted)] hover:text-[var(--color-text)] cursor-help"
	><Info size={iconSize} /></button>
{/if}

<div
	{...tip.content}
	class="m-0 z-[3000] max-w-[17rem] normal-case tracking-normal font-normal rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-[0.75rem] leading-snug text-[var(--color-text)] shadow-xl"
>
	{text}
</div>
