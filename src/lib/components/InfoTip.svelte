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

	// Melt's tooltip is hover-and-focus only: it ignores touch pointers, and by
	// default a press on the trigger closes it and blocks the focus that follows.
	// That left phones with no way to read a definition, so presses are handled
	// here instead: a tap toggles it, a tap anywhere else puts it away.
	const tip = new Tooltip({ openDelay: 120, closeDelay: 120, closeOnPointerDown: false });

	let pointer = '';
	let wasOpen = false;

	function press(e: PointerEvent) {
		pointer = e.pointerType;
		wasOpen = tip.open;
	}

	function tap(e: MouseEvent) {
		// Mouse and keyboard already open it through hover and focus.
		if (e.detail === 0 || pointer === 'mouse' || pointer === '') return;
		tip.open = !wasOpen;
	}

	$effect(() => {
		if (!tip.open) return;
		const away = (e: PointerEvent) => {
			const target = e.target as Node | null;
			const inside = [tip.ids.trigger, tip.ids.content].some((id) =>
				document.getElementById(id)?.contains(target)
			);
			if (!inside) tip.open = false;
		};
		document.addEventListener('pointerdown', away, true);
		return () => document.removeEventListener('pointerdown', away, true);
	});
</script>

{#if term}
	<button
		type="button"
		{...tip.trigger}
		onpointerdown={press}
		onclick={tap}
		class="hit-area underline decoration-dotted underline-offset-2 cursor-help text-inherit"
	>{term}</button>
{:else}
	<button
		type="button"
		{...tip.trigger}
		onpointerdown={press}
		onclick={tap}
		aria-label="What does this mean?"
		class="hit-area inline-flex align-middle text-[var(--color-text-muted)] hover:text-[var(--color-text)] cursor-help"
	><Info size={iconSize} /></button>
{/if}

<div
	{...tip.content}
	class="m-0 z-[3000] max-w-[17rem] normal-case tracking-normal font-normal rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-[0.75rem] leading-snug text-[var(--color-text)] shadow-lg"
>
	{text}
</div>
