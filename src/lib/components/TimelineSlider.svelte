<script lang="ts">
	import { timelineRange, sidebarShown, selectedProject, timelineFits } from '$lib/stores';

	const MIN_YEAR = 2008;
	const MAX_YEAR = 2036;

	let startYear = $state($timelineRange[0]);
	let endYear = $state($timelineRange[1]);

	// Follow external resets (e.g. "Clear all filters") without fighting a drag.
	$effect(() => {
		const [s, e] = $timelineRange;
		if (s !== startYear) startYear = s;
		if (e !== endYear) endYear = e;
	});

	const pct = (year: number) => ((year - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * 100;
	function commit() {
		timelineRange.set([startYear, endYear]);
	}

	// Custom thumbs (two divs) instead of overlapping native range inputs, which
	// relied on pointer-events trickery that left the handles unreliable to grab.
	// The thumb captures its pointer for the length of the drag, so the gesture
	// follows that one pointer anywhere on screen and ends with it: on release,
	// on a cancelled touch, or when capture or focus is lost. Nothing listens on
	// `window`, so a drag can never be left running for some later pointer.
	let trackEl: HTMLDivElement;
	let dragging = $state<'start' | 'end' | null>(null);

	function yearAt(clientX: number): number {
		const rect = trackEl.getBoundingClientRect();
		const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
		return Math.round(MIN_YEAR + ratio * (MAX_YEAR - MIN_YEAR));
	}

	function setYear(which: 'start' | 'end', year: number) {
		// Clamp at the ends and at the other thumb so the two never cross.
		if (which === 'start') startYear = Math.max(MIN_YEAR, Math.min(year, endYear));
		else endYear = Math.min(MAX_YEAR, Math.max(year, startYear));
		commit();
	}

	function grab(which: 'start' | 'end', e: PointerEvent) {
		if (e.pointerType === 'mouse' && e.button !== 0) return;
		const thumb = e.currentTarget as HTMLElement;
		dragging = which;
		thumb.setPointerCapture(e.pointerId);
		thumb.focus({ preventScroll: true });
		e.preventDefault();
	}
	function move(which: 'start' | 'end', e: PointerEvent) {
		if (dragging !== which) return;
		setYear(which, yearAt(e.clientX));
	}
	function release(which: 'start' | 'end') {
		if (dragging === which) dragging = null;
	}

	const PAGE = 5;
	function key(which: 'start' | 'end', e: KeyboardEvent) {
		const year = which === 'start' ? startYear : endYear;
		let next: number;
		switch (e.key) {
			case 'ArrowLeft':
			case 'ArrowDown': next = year - 1; break;
			case 'ArrowRight':
			case 'ArrowUp': next = year + 1; break;
			case 'PageDown': next = year - PAGE; break;
			case 'PageUp': next = year + PAGE; break;
			// Home and End run to the limit of this thumb's travel.
			case 'Home': next = MIN_YEAR; break;
			case 'End': next = MAX_YEAR; break;
			default: return;
		}
		e.preventDefault();
		setYear(which, next);
	}

	// When the side panels leave less open map than the timeline is wide, it
	// steps out until one of them closes.
	const tucked = $derived(!$timelineFits);
</script>

<!-- Stays centred in the open strip of map: it shifts right by half the projects
     panel when that is open, and left by half the detail panel's lane when a
     project is open, in step with both. -->
<div
	class="absolute bottom-6 z-[1000] bg-[var(--color-surface)]/95 backdrop-blur border border-[var(--color-border)] rounded-xl px-4 py-3 shadow-lg"
	style="left: 50%; transform: translateX(calc(-50% + {$sidebarShown ? '12rem' : '0rem'} - {$selectedProject ? '12.5rem' : '0rem'})); opacity: {tucked ? 0 : 1}; visibility: {tucked ? 'hidden' : 'visible'}; transition: transform 280ms cubic-bezier(0.4,0,0.2,1), opacity 200ms ease, visibility 200ms;"
>
	<div class="flex items-center gap-3">
		<span class="text-[0.6875rem] text-[var(--color-text-muted)]">Timeline</span>
		<span class="text-xs font-mono font-bold text-[var(--color-accent)]">{startYear}</span>
		<div bind:this={trackEl} class="relative w-48 h-6 flex items-center">
			<!-- Rail -->
			<div class="absolute w-full h-1 bg-[var(--color-border)] rounded-full"></div>
			<!-- Selected span -->
			<div
				class="absolute h-1 bg-[var(--color-accent)] rounded-full"
				style="left: {pct(startYear)}%; right: {100 - pct(endYear)}%;"
			></div>
			<!-- Start handle -->
			<div
				role="slider"
				tabindex="0"
				aria-label="Start year"
				aria-valuemin={MIN_YEAR}
				aria-valuemax={endYear}
				aria-valuenow={startYear}
				aria-valuetext="From {startYear}, up to {endYear}"
				class="timeline-thumb"
				style="left: {pct(startYear)}%; z-index: {dragging === 'start' ? 31 : 30};"
				onpointerdown={(e) => grab('start', e)}
				onpointermove={(e) => move('start', e)}
				onpointerup={() => release('start')}
				onpointercancel={() => release('start')}
				onlostpointercapture={() => release('start')}
				onblur={() => release('start')}
				onkeydown={(e) => key('start', e)}
			></div>
			<!-- End handle -->
			<div
				role="slider"
				tabindex="0"
				aria-label="End year"
				aria-valuemin={startYear}
				aria-valuemax={MAX_YEAR}
				aria-valuenow={endYear}
				aria-valuetext="From {startYear}, up to {endYear}"
				class="timeline-thumb"
				style="left: {pct(endYear)}%; z-index: {dragging === 'end' ? 31 : 30};"
				onpointerdown={(e) => grab('end', e)}
				onpointermove={(e) => move('end', e)}
				onpointerup={() => release('end')}
				onpointercancel={() => release('end')}
				onlostpointercapture={() => release('end')}
				onblur={() => release('end')}
				onkeydown={(e) => key('end', e)}
			></div>
		</div>
		<span class="text-xs font-mono font-bold text-[var(--color-accent)]">{endYear}</span>
	</div>
</div>

<style>
	.timeline-thumb {
		position: absolute;
		top: 50%;
		width: 20px;
		height: 20px;
		transform: translate(-50%, -50%);
		border-radius: 50%;
		background: var(--color-accent);
		border: 3px solid var(--color-text);
		cursor: grab;
		touch-action: none;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
	}
	/* A finger gets a 44px target around the 20px thumb */
	@media (pointer: coarse) {
		.timeline-thumb::after {
			content: '';
			position: absolute;
			inset: -15px;
		}
	}
	.timeline-thumb:active {
		cursor: grabbing;
	}
	.timeline-thumb:focus-visible {
		outline: 2px solid var(--color-accent);
		outline-offset: 3px;
	}
</style>
