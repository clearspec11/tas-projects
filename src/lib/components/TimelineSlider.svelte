<script lang="ts">
	import { timelineRange, sidebarOpen } from '$lib/stores';

	const MIN_YEAR = 2008;
	const MAX_YEAR = 2036;

	let startYear = $state($timelineRange[0]);
	let endYear = $state($timelineRange[1]);

	// Follow external resets (e.g. "Clear all filters") without fighting drags:
	// after updateRange the store equals local state, so this no-ops mid-drag.
	$effect(() => {
		const [s, e] = $timelineRange;
		if (s !== startYear) startYear = s;
		if (e !== endYear) endYear = e;
	});

	function updateRange() {
		if (startYear > endYear) {
			const tmp = startYear;
			startYear = endYear;
			endYear = tmp;
		}
		timelineRange.set([startYear, endYear]);
	}

	// Clicking/tapping anywhere on the track jumps the nearer thumb to that
	// year. Without this only the 24px thumbs are interactive (the inputs are
	// pointer-events:none so the track itself swallows nothing), which made the
	// slider feel dead — especially at the extremes where the thumbs sit clipped
	// at the container edge.
	let trackEl: HTMLDivElement;
	function jumpToClick(e: PointerEvent) {
		const rect = trackEl.getBoundingClientRect();
		const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
		const year = Math.round(MIN_YEAR + ratio * (MAX_YEAR - MIN_YEAR));
		// Move whichever thumb is closer; ties go to whichever side the click fell on.
		if (Math.abs(year - startYear) <= Math.abs(year - endYear)) {
			startYear = year;
		} else {
			endYear = year;
		}
		updateRange();
	}

	// When start thumb is in the upper half, bring it to front so it can be
	// dragged even when endYear thumb is nearby.
	const startZ = $derived(startYear > (MIN_YEAR + MAX_YEAR) / 2 ? 30 : 10);
	const endZ = $derived(startYear > (MIN_YEAR + MAX_YEAR) / 2 ? 10 : 30);
</script>

<!-- Shifts right by half the sidebar width when panel is open, keeping it
     centred in the unobstructed portion of the map and clear of the legend. -->
<div
	class="absolute bottom-6 z-[1000] bg-[var(--color-surface)]/95 backdrop-blur border border-[var(--color-border)] rounded-xl px-4 py-3 shadow-lg"
	style="left: 50%; transform: translateX(calc(-50% + {$sidebarOpen ? '12rem' : '0rem'})); transition: transform 280ms cubic-bezier(0.4,0,0.2,1);"
>
	<div class="flex items-center gap-3">
		<span class="text-[0.6875rem] text-[var(--color-text-muted)]">Timeline</span>
		<span class="text-xs font-mono font-bold text-[var(--color-accent)]">{startYear}</span>
		<div
			class="relative w-48 h-6 flex items-center cursor-pointer"
			bind:this={trackEl}
			onpointerdown={jumpToClick}
		>
			<input
				type="range"
				min={MIN_YEAR}
				max={MAX_YEAR}
				bind:value={startYear}
				oninput={updateRange}
				class="absolute w-full appearance-none bg-transparent cursor-pointer timeline-range"
				style="z-index: {startZ};"
			/>
			<input
				type="range"
				min={MIN_YEAR}
				max={MAX_YEAR}
				bind:value={endYear}
				oninput={updateRange}
				class="absolute w-full appearance-none bg-transparent cursor-pointer timeline-range"
				style="z-index: {endZ};"
			/>
			<div class="absolute w-full h-1 bg-[var(--color-border)] rounded-full">
				<div
					class="absolute h-full bg-[var(--color-accent)] rounded-full"
					style="left: {((startYear - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * 100}%; right: {(1 - (endYear - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * 100}%;"
				></div>
			</div>
		</div>
		<span class="text-xs font-mono font-bold text-[var(--color-accent)]">{endYear}</span>
	</div>
</div>

<style>
	.timeline-range {
		-webkit-appearance: none;
		appearance: none;
		pointer-events: none;
	}
	.timeline-range::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 24px;
		height: 24px;
		border-radius: 50%;
		background: var(--color-accent);
		border: 3px solid #fff;
		cursor: pointer;
		pointer-events: all;
		position: relative;
	}
	.timeline-range::-moz-range-thumb {
		width: 24px;
		height: 24px;
		border-radius: 50%;
		background: var(--color-accent);
		border: 3px solid #fff;
		cursor: pointer;
		pointer-events: all;
	}
</style>
