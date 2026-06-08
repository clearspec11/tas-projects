<script lang="ts">
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { replaceState } from '$app/navigation';
	import {
		projects, selectedProject, filterCategory, filterStatus, filterFunding,
		filterGovernmentLevel, searchQuery, sortKey, timelineRange
	} from '$lib/stores';
	import { SEED_PROJECTS } from '$lib/seed-data';
	import type { SortKey } from '$lib/metrics';
	import TasMap from '$lib/components/TasMap.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import ProjectDetail from '$lib/components/ProjectDetail.svelte';
	import MapLegend from '$lib/components/MapLegend.svelte';
	import MapControls from '$lib/components/MapControls.svelte';
	import TimelineSlider from '$lib/components/TimelineSlider.svelte';

	let mapComponent: TasMap;

	const DEFAULTS = {
		cat: 'all', status: 'all', funding: 'all', gov: 'all',
		q: '', sort: 'variance', y0: 2017, y1: 2036
	};

	function applyFromUrl() {
		const sp = new URLSearchParams(window.location.search);
		if (sp.get('cat')) filterCategory.set(sp.get('cat') as any);
		if (sp.get('status')) filterStatus.set(sp.get('status') as any);
		if (sp.get('funding')) filterFunding.set(sp.get('funding') as any);
		if (sp.get('gov')) filterGovernmentLevel.set(sp.get('gov') as any);
		if (sp.get('q')) searchQuery.set(sp.get('q')!);
		if (sp.get('sort')) sortKey.set(sp.get('sort') as SortKey);
		const y0 = Number(sp.get('y0')), y1 = Number(sp.get('y1'));
		if (y0 && y1) timelineRange.set([y0, y1]);
		const pid = sp.get('p');
		if (pid) {
			const proj = SEED_PROJECTS.find((p) => p.id === pid);
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
		projects.set(SEED_PROJECTS);
		applyFromUrl();

		// Write URL on any state change (replaceState — no navigation/reload)
		let ready = false;
		const stores = [
			filterCategory, filterStatus, filterFunding, filterGovernmentLevel,
			searchQuery, sortKey, timelineRange, selectedProject
		];
		const unsubs = stores.map((s) => s.subscribe(() => ready && syncUrl()));
		ready = true;
		syncUrl();

		return () => unsubs.forEach((u) => u());
	});

	function handleFlyTo(lat: number, lng: number) {
		mapComponent?.flyTo(lat, lng);
	}
</script>

<svelte:head>
	<title>TAS Project Tracker — Tasmanian Public Infrastructure</title>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500;600&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
</svelte:head>

<div class="flex h-full">
	<Sidebar onFlyTo={handleFlyTo} />
	<main class="flex-1 relative">
		<TasMap bind:this={mapComponent} />
		<MapControls />
		<MapLegend />
		<TimelineSlider />
		<ProjectDetail />
	</main>
</div>
