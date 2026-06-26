<script lang="ts">
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { replaceState } from '$app/navigation';
	import {
		projects, selectedProject, filterCategory, filterStatus, filterFunding,
		filterGovernmentLevel, filterFlagged, filterContractor, searchQuery, sortKey, timelineRange, mobileView
	} from '$lib/stores';
	import { SEED_PROJECTS } from '$lib/seed-data';
	import { loadProjects } from '$lib/data';
	import type { SortKey } from '$lib/metrics';
	import TasMap from '$lib/components/TasMap.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import ProjectDetail from '$lib/components/ProjectDetail.svelte';
	import MapLegend from '$lib/components/MapLegend.svelte';
	import MapControls from '$lib/components/MapControls.svelte';
	import TimelineSlider from '$lib/components/TimelineSlider.svelte';
	import StoryBanner from '$lib/components/StoryBanner.svelte';
	import { ChevronRight, ChevronLeft } from '@lucide/svelte';

	let mapComponent: TasMap;
	let sidebarOpen = $state(false);

	const activeFilterCount = $derived(
		($filterCategory !== 'all' ? 1 : 0) +
		($filterStatus !== 'all' ? 1 : 0) +
		($filterFunding !== 'all' ? 1 : 0) +
		($filterGovernmentLevel !== 'all' ? 1 : 0) +
		($filterFlagged ? 1 : 0) +
		($filterContractor !== null ? 1 : 0) +
		($searchQuery !== '' ? 1 : 0)
	);

	const DEFAULTS = {
		cat: 'all', status: 'all', funding: 'all', gov: 'all',
		q: '', sort: 'variance', y0: 2008, y1: 2036
	};

	function applyFromUrl() {
		const sp = new URLSearchParams(window.location.search);
		if (sp.get('cat')) filterCategory.set(sp.get('cat') as any);
		if (sp.get('status')) filterStatus.set(sp.get('status') as any);
		if (sp.get('funding')) filterFunding.set(sp.get('funding') as any);
		if (sp.get('gov')) filterGovernmentLevel.set(sp.get('gov') as any);
		if (sp.get('q')) searchQuery.set(sp.get('q')!);
		if (sp.get('flag') === '1') filterFlagged.set(true);
		if (sp.get('contractor')) filterContractor.set(sp.get('contractor'));
		if (sp.get('sort')) sortKey.set(sp.get('sort') as SortKey);
		const y0 = Number(sp.get('y0')), y1 = Number(sp.get('y1'));
		if (y0 && y1) timelineRange.set([y0, y1]);
		const pid = sp.get('p');
		if (pid) {
			const proj = get(projects).find((p) => p.id === pid);
			if (proj) {
				selectedProject.set(proj);
				setTimeout(() => mapComponent?.flyTo(proj.lat, proj.lng), 300);
			}
		}
	}

	function syncUrl() {
		const sp = new URLSearchParams();
		const set = (k: string, v: string | number, def: string | number) => {
			if (String(v) !== String(def)) sp.set(k, String(v));
		};
		set('cat', get(filterCategory), DEFAULTS.cat);
		set('status', get(filterStatus), DEFAULTS.status);
		set('funding', get(filterFunding), DEFAULTS.funding);
		set('gov', get(filterGovernmentLevel), DEFAULTS.gov);
		set('q', get(searchQuery), DEFAULTS.q);
		if (get(filterFlagged)) sp.set('flag', '1');
		const contractor = get(filterContractor);
		if (contractor) sp.set('contractor', contractor);
		set('sort', get(sortKey), DEFAULTS.sort);
		const range = get(timelineRange);
		set('y0', range[0], DEFAULTS.y0);
		set('y1', range[1], DEFAULTS.y1);
		const sel = get(selectedProject);
		if (sel) sp.set('p', sel.id);
		const qs = sp.toString();
		const url = qs ? `?${qs}` : window.location.pathname;
		// Router may not be initialized on the very first call (during mount); ignore until it is.
		try {
			replaceState(url, {});
		} catch {
			/* router not ready yet — URL will sync on the next state change */
		}
	}

	onMount(() => {
		// Seed immediately so the UI renders, then swap in Supabase data if a
		// project is configured (falls back to seed on any failure).
		if (get(projects).length === 0) projects.set(SEED_PROJECTS);
		loadProjects().then(({ projects: rows, source, error }) => {
			if (source === 'supabase') projects.set(rows);
			if (error) console.warn('[tas] Supabase load failed, using seed data:', error);
		});
		applyFromUrl();

		// Write URL on any state change (replaceState — no navigation/reload)
		let ready = false;
		const stores = [
			filterCategory, filterStatus, filterFunding, filterGovernmentLevel,
			filterFlagged, filterContractor, searchQuery, sortKey, timelineRange, selectedProject
		];
		const unsubs = stores.map((s) => s.subscribe(() => ready && syncUrl()));
		ready = true;
		syncUrl();

		return () => unsubs.forEach((u) => u());
	});

	function handleFlyTo(lat: number, lng: number) {
		mapComponent?.flyTo(lat, lng);
	}

	// "/" focuses search, Escape closes the detail panel
	function handleKeydown(e: KeyboardEvent) {
		const target = e.target as HTMLElement;
		const typing = ['INPUT', 'SELECT', 'TEXTAREA'].includes(target?.tagName);
		if (e.key === '/' && !typing) {
			e.preventDefault();
			document.getElementById('project-search')?.focus();
		} else if (e.key === 'Escape' && !typing) {
			selectedProject.set(null);
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<svelte:head>
	<title>TAS Project Tracker — Tasmanian Public Infrastructure</title>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500;600&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
</svelte:head>

<div class="flex flex-col h-full">
	<!-- Mobile-only Map/List switch: each view gets the full screen instead of
	     two cramped stacked halves. Hidden at md+ where both sit side by side.
	     Also hidden while a project is open — that detail sheet is a drill-down,
	     so its close button is the way back, not a dead tab behind the overlay. -->
	<div class="md:hidden flex shrink-0 bg-[var(--color-surface)] border-b border-[var(--color-border)] {$selectedProject ? 'hidden' : ''}">
		{#each [['map', 'Map'], ['list', 'List']] as [v, label]}
			<button
				onclick={() => mobileView.set(v as 'map' | 'list')}
				aria-pressed={$mobileView === v}
				class="flex-1 py-2.5 text-sm font-medium transition-colors cursor-pointer border-b-2 {$mobileView === v ? 'text-[var(--color-accent)] border-[var(--color-accent)]' : 'text-[var(--color-text-muted)] border-transparent'}"
			>{label}</button>
		{/each}
	</div>

	<div class="flex flex-1 min-h-0 relative">
		<!-- Mobile: full-screen sidebar in list view -->
		<div class="md:hidden flex flex-col flex-1 min-h-0 {$mobileView === 'map' ? 'hidden' : ''}">
			<Sidebar onFlyTo={handleFlyTo} />
		</div>

		<!-- Desktop: sidebar slides in from left as an overlay (doesn't squeeze the map).
		     z-[800] clears Leaflet's highest internal pane (z-index 700). -->
		<div
			class="hidden md:block absolute inset-y-0 left-0 w-96"
			style="z-index:800; transform: translateX({sidebarOpen ? '0%' : '-100%'}); transition: transform 280ms cubic-bezier(0.4,0,0.2,1); will-change: transform; box-shadow: 4px 0 28px rgba(0,0,0,0.45);"
		>
			<Sidebar onFlyTo={handleFlyTo} />
		</div>

		<!-- Desktop tab: rides the sidebar's right edge, acts as toggle in both states -->
		<button
			class="hidden md:flex flex-col items-center justify-center gap-1.5 absolute left-0 top-1/2 cursor-pointer select-none"
			style="z-index:810; transform: translate({sidebarOpen ? '24rem' : '0'}, -50%); transition: transform 280ms cubic-bezier(0.4,0,0.2,1); will-change: transform;"
			onclick={() => (sidebarOpen = !sidebarOpen)}
			aria-label={sidebarOpen ? 'Collapse projects panel' : 'Show projects panel'}
			aria-expanded={sidebarOpen}
		>
			<div
				class="flex flex-col items-center justify-center gap-2 py-3 px-1.5 rounded-r-lg transition-colors hover:bg-[var(--color-surface-hover)]"
				style="min-height:5.5rem; background:var(--color-surface); border:1px solid var(--color-border); border-left:2px solid var(--color-accent); border-radius:0 8px 8px 0;"
			>
				{#if sidebarOpen}
					<ChevronLeft size={12} class="text-[var(--color-text-muted)]" />
				{:else}
					<ChevronRight size={12} class="text-[var(--color-accent)]" />
					<span class="text-[0.5625rem] font-semibold text-[var(--color-text)]" style="writing-mode:vertical-rl;transform:rotate(180deg);letter-spacing:0.08em;">Projects</span>
					{#if activeFilterCount > 0}
						<span class="inline-flex items-center justify-center w-4 h-4 rounded-full text-[0.5rem] font-bold tabular-nums bg-[var(--color-accent)] text-[var(--color-bg)]">{activeFilterCount}</span>
					{/if}
				{/if}
			</div>
		</button>

		<!-- Map: always full-width on desktop (sidebar overlays); on mobile only in map view -->
		<main class="flex-1 relative {$mobileView === 'list' ? 'max-md:hidden' : ''}">
			<TasMap bind:this={mapComponent} />
			<StoryBanner />
			<MapControls />
			<!-- Legend and timeline are desktop affordances; they'd bury a phone map.
			     The sea readout is mounted inside the map itself (TasMap), anchored
			     to a coordinate, so it lives with the markers, not as an overlay. -->
			<div class="contents max-md:hidden">
				<MapLegend />
				<TimelineSlider />
			</div>
		</main>
		<!-- Detail panel overlays whichever view; full-screen sheet on mobile -->
		<ProjectDetail />
	</div>
</div>
