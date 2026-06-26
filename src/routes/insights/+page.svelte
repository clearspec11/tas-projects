<script lang="ts">
	import { onMount } from 'svelte';
	import { projects } from '$lib/stores';
	import { SEED_PROJECTS } from '$lib/seed-data';
	import { loadProjects } from '$lib/data';
	import { CATEGORY_CONFIG } from '$lib/types';
	import BarList from '$lib/components/BarList.svelte';
	import {
		formatCurrency, spendByCategory, overBudgetLeaderboard,
		completionsByYear, projectFinalCost
	} from '$lib/metrics';

	onMount(() => {
		if ($projects.length === 0) projects.set(SEED_PROJECTS);
		loadProjects().then(({ projects: rows, source }) => {
			if (source === 'supabase') projects.set(rows);
		});
	});

	// ---- Aggregate projection: where the live book is heading ----
	const live = $derived($projects.filter((p) => p.status !== 'completed' && p.status !== 'cancelled'));
	const projections = $derived(
		live.map((p) => projectFinalCost(p)).filter((x): x is NonNullable<typeof x> => x !== null)
	);
	const trackingOver = $derived(projections.filter((p) => p.overBy > 0));
	const projectedOverrun = $derived(trackingOver.reduce((s, p) => s + p.overBy, 0));

	// ---- Chart data ----
	const categoryData = $derived(
		spendByCategory($projects).map((r) => ({ label: CATEGORY_CONFIG[r.category].label, value: r.total }))
	);
	const leaderboardData = $derived(
		overBudgetLeaderboard($projects)
			.slice(0, 8)
			.map((r) => ({ label: r.project.name.replace(/ [–-] .*$/, ''), value: r.over }))
	);
	const completionsData = $derived(
		completionsByYear($projects).map((r) => ({ label: String(r.year), value: r.count }))
	);
</script>

<svelte:head>
	<title>Insights — TAS Project Tracker</title>
</svelte:head>

<div class="h-full overflow-y-auto bg-[var(--color-bg)]">
	<div class="max-w-5xl mx-auto p-4 md:p-6">
		<h1 class="text-xl font-bold tracking-tight">Insights</h1>
		<p class="text-[0.8125rem] text-[var(--color-text-muted)] mt-1 max-w-[65ch]">
			The whole book at a glance: where the money sits, which projects are running over, and
			when the pipeline delivers. Figures aggregate every project currently on the tracker.
		</p>

		<!-- Headline projection -->
		<div class="mt-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-4 md:p-5">
			<div class="text-[0.6875rem] text-[var(--color-text-muted)] uppercase tracking-wider">Projected overrun, live projects</div>
			{#if projectedOverrun > 0}
				<div class="flex flex-wrap items-baseline gap-x-3 gap-y-1 mt-1.5">
					<span class="text-[2.25rem] leading-none font-bold tabular-nums text-[var(--color-danger)]">{formatCurrency(projectedOverrun)}</span>
					<span class="text-sm text-[var(--color-text)]">
						across <strong class="tabular-nums">{trackingOver.length}</strong> of {projections.length} live projects
					</span>
				</div>
				<p class="text-[0.6875rem] text-[var(--color-text-muted)] mt-2 max-w-[60ch]">
					Estimated, not promised: each project is forecast from its latest revised budget paper or its
					spend-to-date burn rate, whichever runs higher. Finished and cancelled projects are excluded.
				</p>
			{:else}
				<div class="text-[2.25rem] leading-none font-bold mt-1.5 text-[var(--color-success)]">On track</div>
				<p class="text-[0.6875rem] text-[var(--color-text-muted)] mt-2">No live project is currently forecast to exceed its budget.</p>
			{/if}
		</div>

		<!-- Charts -->
		<div class="mt-4 grid grid-cols-2 max-md:grid-cols-1 gap-4">
			<section class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-4">
				<h2 class="text-sm font-semibold">Budget by category</h2>
				<p class="text-[0.6875rem] text-[var(--color-text-muted)] mt-0.5 mb-3">Total committed budget per sector.</p>
				<BarList data={categoryData} color="var(--color-accent)" format={formatCurrency} />
			</section>

			<section class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-4">
				<h2 class="text-sm font-semibold">Biggest overruns</h2>
				<p class="text-[0.6875rem] text-[var(--color-text-muted)] mt-0.5 mb-3">Spend above budget, top projects.</p>
				{#if leaderboardData.length}
					<BarList data={leaderboardData} color="var(--color-danger)" format={formatCurrency} labelWidth="8.5rem" />
				{:else}
					<div class="py-10 text-center text-sm text-[var(--color-text-muted)]">No projects are over budget.</div>
				{/if}
			</section>

			<section class="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-4 col-span-2 max-md:col-span-1">
				<h2 class="text-sm font-semibold">Delivery pipeline</h2>
				<p class="text-[0.6875rem] text-[var(--color-text-muted)] mt-0.5 mb-3">Projects due to finish each year.</p>
				<BarList data={completionsData} color="#a78bfa" format={(n) => `${n}`} labelWidth="3.5rem" />
			</section>
		</div>

		<p class="mt-3 text-[0.6875rem] text-[var(--color-text-muted)] italic">
			Many figures are illustrative seed data. Follow each project's source for official numbers.
		</p>
	</div>
</div>
