<script lang="ts">
	import { onMount } from 'svelte';
	import { projects } from '$lib/stores';
	import { SEED_PROJECTS } from '$lib/seed-data';
	import { loadProjects } from '$lib/data';
	import { CATEGORY_CONFIG, FUNDER_CONFIG } from '$lib/types';
	import BarList from '$lib/components/BarList.svelte';
	import {
		formatCurrency, spendByCategory, overBudgetLeaderboard,
		completionsByYear, projectFinalCost, spendByFunder, spendByRegion,
		portfolioAverages
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
	const funderData = $derived(
		spendByFunder($projects).map((r) => ({
			label: FUNDER_CONFIG[r.funder].label,
			value: r.total,
			color: FUNDER_CONFIG[r.funder].color
		}))
	);
	const regionData = $derived(
		spendByRegion($projects).map((r) => ({ label: r.region, value: r.total }))
	);
	const averages = $derived(portfolioAverages($projects));
</script>

<svelte:head>
	<title>Insights: TAS Project Tracker</title>
</svelte:head>

<div class="h-full overflow-y-auto bg-[var(--color-bg)]">
	<main class="max-w-5xl mx-auto p-4 md:p-6">
		<h1 class="text-xl font-bold tracking-tight">Insights</h1>
		<p class="text-[0.8125rem] text-[var(--color-text-muted)] mt-1 max-w-[65ch]">
			The whole book at a glance: where the money sits, which projects are running over, and
			when the pipeline delivers. Figures aggregate every project currently on the tracker.
		</p>

		<!-- The size of the book, stated once in a line rather than boxed up -->
		<dl class="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-[0.8125rem]">
			<div class="flex items-baseline gap-2">
				<dt class="text-[var(--color-text-muted)]">Total budget</dt>
				<dd class="font-mono font-semibold">{formatCurrency(averages.totalBudget)}</dd>
			</div>
			<div class="flex items-baseline gap-2">
				<dt class="text-[var(--color-text-muted)]">Average project</dt>
				<dd class="font-mono font-semibold">{formatCurrency(averages.avgBudget)}</dd>
			</div>
		</dl>

		<!-- Lead: the page's one finding. Where the live book is heading on the
		     left, the projects taking it there on the right; one panel, one rule
		     between them. -->
		<div class="mt-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)]">
			<section class="p-4 md:p-5">
				<h2 class="text-sm font-semibold">Projected overrun, live projects</h2>
				{#if projectedOverrun > 0}
					<div class="mt-3 text-[1.375rem] leading-none font-mono font-bold text-[var(--color-danger)]">{formatCurrency(projectedOverrun)}</div>
					<p class="mt-2 text-[0.8125rem] text-[var(--color-text)]">
						across <strong class="font-mono font-semibold">{trackingOver.length}</strong> of
						<span class="font-mono">{projections.length}</span> live projects
					</p>
					<p class="text-[0.6875rem] leading-relaxed text-[var(--color-text-muted)] mt-2 max-w-[60ch]">
						Estimated, not promised: each project is forecast from its latest revised budget paper or its
						spend-to-date burn rate, whichever runs higher. Finished and cancelled projects are excluded.
					</p>
				{:else}
					<div class="mt-3 text-[1.375rem] leading-none font-bold text-[var(--color-success)]">On track</div>
					<p class="text-[0.6875rem] text-[var(--color-text-muted)] mt-2">No live project is currently forecast to exceed its budget.</p>
				{/if}

				<dl class="mt-4 pt-4 border-t border-[var(--color-border)] grid grid-cols-2 gap-4">
					<div class="flex flex-col-reverse gap-1">
						<dt class="text-[0.6875rem] text-[var(--color-text-muted)]">Overrun on the {averages.overCount} over budget</dt>
						<dd class="text-[0.9375rem] leading-none font-mono font-semibold text-[var(--color-danger)]">+{Math.round(averages.overrunPct * 100)}%</dd>
					</div>
					<div class="flex flex-col-reverse gap-1">
						<dt class="text-[0.6875rem] text-[var(--color-text-muted)]">Over budget or late</dt>
						<dd class="text-[0.9375rem] leading-none font-mono font-semibold">{Math.round(averages.flaggedPct * 100)}%</dd>
					</div>
				</dl>
			</section>

			<section class="p-4 md:p-5 border-t md:border-t-0 md:border-l border-[var(--color-border)]">
				<h2 class="text-sm font-semibold">Biggest overruns</h2>
				<p class="text-[0.6875rem] text-[var(--color-text-muted)] mt-0.5 mb-3">Spend above budget, top projects.</p>
				{#if leaderboardData.length}
					<BarList data={leaderboardData} color="var(--color-danger)" valueColor="var(--color-danger)" format={formatCurrency} labelWidth="8.5rem" />
				{:else}
					<div class="py-10 text-center text-sm text-[var(--color-text-muted)]">No projects are over budget.</div>
				{/if}
			</section>
		</div>

		<!-- Where the money sits: by sector on the left, by place and by payer on
		     the right. Bars are neutral; only the funders carry their own colours. -->
		<div class="mt-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl grid md:grid-cols-2">
			<section class="p-4 md:p-5">
				<h2 class="text-sm font-semibold">Budget by category</h2>
				<p class="text-[0.6875rem] text-[var(--color-text-muted)] mt-0.5 mb-3">Total committed budget per sector.</p>
				<BarList data={categoryData} format={formatCurrency} />
			</section>

			<div class="border-t md:border-t-0 md:border-l border-[var(--color-border)]">
				<section class="p-4 md:p-5">
					<h2 class="text-sm font-semibold">Budget by region</h2>
					<p class="text-[0.6875rem] text-[var(--color-text-muted)] mt-0.5 mb-3">
						Committed budget across Tasmania's three regions, grouped from each project's location.
					</p>
					<BarList data={regionData} format={formatCurrency} labelWidth="5.5rem" />
				</section>

				<section class="p-4 md:p-5 border-t border-[var(--color-border)]">
					<h2 class="text-sm font-semibold">Who pays</h2>
					<p class="text-[0.6875rem] text-[var(--color-text-muted)] mt-0.5 mb-3">
						Budget by funding source. Estimated from governing tier and delivery model where a project
						publishes no split.
					</p>
					<BarList data={funderData} format={formatCurrency} labelWidth="5.5rem" />
				</section>
			</div>
		</div>

		<section class="mt-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-4 md:p-5">
			<h2 class="text-sm font-semibold">Delivery pipeline</h2>
			<p class="text-[0.6875rem] text-[var(--color-text-muted)] mt-0.5 mb-3">Projects due to finish each year.</p>
			<BarList data={completionsData} format={(n) => `${n}`} labelWidth="3.5rem" />
		</section>

		<p class="mt-3 text-[0.6875rem] text-[var(--color-text-muted)] italic">
			Figures come from the source cited on each project. Funder totals include estimated splits for older projects whose funding split is not published.
		</p>
	</main>
</div>
