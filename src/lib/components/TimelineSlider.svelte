<script lang="ts">
	import { timelineRange } from '$lib/stores';

	const MIN_YEAR = 2017;
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
</script>

<div class="absolute bottom-6 left-1/2 -translate-x-1/2 z-[1000] bg-[var(--color-surface)]/95 backdrop-blur border border-[var(--color-border)] rounded-xl px-4 py-3 shadow-lg">
	<div class="flex items-center gap-3">
		<span class="text-[0.6875rem] text-[var(--color-text-muted)] uppercase tracking-wider">Timeline</span>
		<span class="text-xs font-mono font-bold text-[var(--color-accent)]">{startYear}</span>
		<div class="relative w-48 h-6 flex items-center">
			<input
				type="range"
				min={MIN_YEAR}
				max={MAX_YEAR}
				bind:value={startYear}
				oninput={updateRange}
				class="absolute w-full appearance-none bg-transparent cursor-pointer z-10 timeline-range"
			/>
			<input
				type="range"
				min={MIN_YEAR}
				max={MAX_YEAR}
				bind:value={endYear}
				oninput={updateRange}
				class="absolute w-full appearance-none bg-transparent cursor-pointer z-20 timeline-range"
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
		z-index: 30;
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
