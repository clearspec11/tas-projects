<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import NavBar from '$lib/components/NavBar.svelte';
	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="h-screen w-screen overflow-hidden flex flex-col">
	<NavBar />
	<div class="flex-1 min-h-0">
		{@render children()}
	</div>
</div>
