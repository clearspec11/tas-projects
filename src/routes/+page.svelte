<script lang="ts">
	import { onMount } from 'svelte';
	import { projects } from '$lib/stores';
	import { SEED_PROJECTS } from '$lib/seed-data';
	import TasMap from '$lib/components/TasMap.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import ProjectDetail from '$lib/components/ProjectDetail.svelte';
	import MapLegend from '$lib/components/MapLegend.svelte';
	import MapControls from '$lib/components/MapControls.svelte';
	import TimelineSlider from '$lib/components/TimelineSlider.svelte';

	let mapComponent: TasMap;

	onMount(() => {
		projects.set(SEED_PROJECTS);
	});

	function handleFlyTo(lat: number, lng: number) {
		mapComponent?.flyTo(lat, lng);
	}
</script>

<svelte:head>
	<title>TAS Project Tracker — Tasmanian Public Infrastructure</title>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
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
