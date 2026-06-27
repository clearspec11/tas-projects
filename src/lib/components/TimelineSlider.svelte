<script lang="ts">
	import { timelineRange, sidebarOpen } from '$lib/stores';

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

	// Custom thumbs (two divs) instead of overlapping native range inputs: the
	// native dual-range pattern relies on pointer-events trickery that left the
	// handles unreliable to grab. Here each thumb owns its own drag via pointer
	// capture, so the gesture follows the pointer anywhere once started.
	let trackEl: HTMLDivElement;
	let dragging: 'start' | 'end' | null = null;

	function yearAt(clientX: number): number {
		const rect = trackEl.getBoundingClientRect();
		const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
		return Math.round(MIN_YEAR + ratio * (MAX_YEAR - MIN_YEAR));
	}

	function grab(which: 'start' | 'end', e: PointerEvent) {
		dragging = which;
		(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
		e.preventDefault();
	}
	function move(e: PointerEvent) {
		if (!dragging) return;
		const year = yearAt(e.clientX);
		// Clamp at the other thumb so the two never cross.
		if (dragging === 'start') startYear = Math.min(year, endYear);
		else endYear = Math.max(year, startYear);
		commit();
	}
	function release(e: PointerEvent) {
		if (!dragging) return;
		dragging = null;
		try {
			(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
		} catch {
			/* already released */
		}
	}

	function key(which: 'start' | 'end', e: KeyboardEvent) {
		const step = e.key === 'ArrowLeft' || e.key === 'ArrowDown' ? -1
			: e.key === 'ArrowRight' || e.key === 'ArrowUp' ? 1 : 0;
		if (!step) return;
		e.preventDefault();
		if (which === 'start') startYear = Math.max(MIN_YEAR, Math.min(startYear + step, endYear));
		else endYear = Math.min(MAX_YEAR, Math.max(endYear + step, startYear));
		commit();
	}
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
				class="timeline-thumb"
				style="left: {pct(startYear)}%; z-index: {dragging === 'start' ? 31 : 30};"
				onpointerdown={(e) => grab('start', e)}
				onpointermove={move}
				onpointerup={release}
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
				class="timeline-thumb"
				style="left: {pct(endYear)}%; z-index: {dragging === 'end' ? 31 : 30};"
				onpointerdown={(e) => grab('end', e)}
				onpointermove={move}
				onpointerup={release}
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
		border: 3px solid #fff;
		cursor: grab;
		touch-action: none;
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.4);
	}
	.timeline-thumb:active {
		cursor: grabbing;
	}
	.timeline-thumb:focus-visible {
		outline: 2px solid var(--color-accent);
		outline-offset: 3px;
	}
</style>
