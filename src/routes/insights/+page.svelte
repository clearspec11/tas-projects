<script lang="ts">
	import { onMount } from 'svelte';
	import { reducedMotion } from '$lib/motion';
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
	// Every year from the first completion to the last, gaps filled with zero, so
	// an empty year reads as empty instead of silently disappearing.
	const thisYear = new Date().getFullYear();
	const PIPELINE_BAR = 'color-mix(in srgb, var(--color-text-muted) 55%, var(--color-bg))';
	const pipeline = $derived.by(() => {
		const rows = completionsByYear($projects);
		if (!rows.length) return [];
		const counts = new Map(rows.map((r) => [r.year, r.count]));
		const first = rows[0].year;
		const last = rows[rows.length - 1].year;
		return Array.from({ length: last - first + 1 }, (_, i) => ({
			year: first + i,
			count: counts.get(first + i) ?? 0
		}));
	});
	const pipelineMax = $derived(Math.max(1, ...pipeline.map((y) => y.count)));
	// The columns rise left to right, so the entrance reads as time passing. The
	// sweep is capped at 320ms however many years there are.
	// The pipeline usually sits below the fold, so hold its rise until it is
	// actually on screen. Without this script the chart simply renders in place.
	function riseWhenSeen(node: HTMLElement) {
		if (reducedMotion || !('IntersectionObserver' in window)) return;
		node.dataset.wait = '';
		const io = new IntersectionObserver(
			(entries) => {
				if (entries.some((e) => e.isIntersecting)) {
					delete node.dataset.wait;
					io.disconnect();
				}
			},
			// Release only once the baseline the columns grow from is on screen.
			{ threshold: 0.95 }
		);
		io.observe(node);
		return { destroy: () => io.disconnect() };
	}
	const colDelay = (i: number) => (pipeline.length > 1 ? Math.round((i / (pipeline.length - 1)) * 320) : 0);
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

		<!-- Where the money sits: by sector, by place, by payer. Three equal
		     readings side by side on wide screens; at tablet width the category
		     list holds the left column and the other two stack beside it. Bars are
		     neutral; only the funders carry their own colours. -->
		<div class="mt-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl grid md:grid-cols-2 lg:grid-cols-3">
			<section class="p-4 md:p-5 md:row-span-2 lg:row-span-1 md:border-r border-[var(--color-border)]">
				<h2 class="text-sm font-semibold">Budget by category</h2>
				<p class="text-[0.6875rem] text-[var(--color-text-muted)] mt-0.5 mb-3">Total committed budget per sector.</p>
				<BarList data={categoryData} format={formatCurrency} labelWidth="6rem" />
			</section>

			<section class="p-4 md:p-5 max-md:border-t lg:border-r border-[var(--color-border)]">
				<h2 class="text-sm font-semibold">Budget by region</h2>
				<p class="text-[0.6875rem] text-[var(--color-text-muted)] mt-0.5 mb-3">
					Committed budget across Tasmania's three regions, grouped from each project's location.
				</p>
				<BarList data={regionData} format={formatCurrency} labelWidth="5rem" />
			</section>

			<section class="p-4 md:p-5 border-t lg:border-t-0 border-[var(--color-border)]">
				<h2 class="text-sm font-semibold">Who pays</h2>
				<p class="text-[0.6875rem] text-[var(--color-text-muted)] mt-0.5 mb-3">
					Budget by funding source. Estimated from governing tier and delivery model where a project
					publishes no split.
				</p>
				<BarList data={funderData} format={formatCurrency} labelWidth="4rem" />
			</section>
		</div>

		<!-- The pipeline is a time series, so it reads left to right as columns,
		     one per year with empty years kept, rather than as a long ranked list. -->
		<section class="mt-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-4 md:p-5">
			<h2 class="text-sm font-semibold">Delivery pipeline</h2>
			<p class="text-[0.6875rem] text-[var(--color-text-muted)] mt-0.5 mb-4">Projects finished or due to finish each year.</p>
			{#if pipeline.length}
				<ol use:riseWhenSeen class="flex items-end gap-px md:gap-1 h-32" aria-label="Projects finished or due to finish, by year">
					{#each pipeline as y, i (y.year)}
						<li class="flex-1 min-w-0 h-full flex flex-col justify-end items-center" aria-label="{y.year}: {y.count} {y.count === 1 ? 'project' : 'projects'}">
							{#if y.count > 0}
								<span style="--d: {colDelay(i)}ms" class="tas-col-figure font-mono text-[0.6875rem] leading-none mb-1 {y.year === thisYear ? 'text-[var(--color-accent)]' : 'text-[var(--color-text)]'}" aria-hidden="true">{y.count}</span>
							{/if}
							<span
								class="tas-col w-full max-w-8 rounded-t-sm {y.year === thisYear ? 'bg-[var(--color-accent)]' : ''}"
								style="--d: {colDelay(i)}ms; height: {y.count ? Math.max(4, (y.count / pipelineMax) * 100) : 0}%; {y.year === thisYear ? '' : `background: ${PIPELINE_BAR};`}"
							></span>
						</li>
					{/each}
				</ol>
				<div class="flex gap-px md:gap-1 border-t border-[var(--color-border)] pt-1.5" aria-hidden="true">
					{#each pipeline as y (y.year)}
						<span class="flex-1 min-w-0 text-center font-mono text-[0.6875rem] leading-none whitespace-nowrap {y.year === thisYear ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-muted)]'}">
							{#if y.year === thisYear || y.year % 5 === 0 || y === pipeline[0] || y === pipeline[pipeline.length - 1]}
								<span class="max-md:hidden">{y.year}</span>{#if y.year === thisYear || Math.abs(y.year - thisYear) > 1}<span class="md:hidden">’{String(y.year).slice(2)}</span>{/if}
							{:else}
								<span class="max-md:hidden text-[var(--color-text-muted)]/70">{String(y.year).slice(2)}</span>
							{/if}
						</span>
					{/each}
				</div>
				<p class="mt-3 text-[0.6875rem] text-[var(--color-text-muted)]">
					<span class="inline-block w-2 h-2 rounded-sm bg-[var(--color-accent)] align-middle mr-1"></span>{thisYear}, this year
				</p>
			{:else}
				<div class="py-10 text-center text-sm text-[var(--color-text-muted)]">No completion dates on record.</div>
			{/if}
		</section>

		<p class="mt-3 text-[0.6875rem] text-[var(--color-text-muted)] italic">
			Figures come from the source cited on each project. Funder totals include estimated splits for older projects whose funding split is not published.
		</p>
	</main>
</div>

<style>
	/* Each column grows up from the baseline, its figure arriving with it.
	   Under reduced motion both are switched off below and simply render. */
	.tas-col {
		transform-origin: bottom;
		animation: tas-col-rise 480ms cubic-bezier(0.16, 1, 0.3, 1) var(--d, 0ms) both;
	}
	.tas-col-figure {
		animation: tas-col-figure 240ms ease-out calc(var(--d, 0ms) + 160ms) both;
	}
	:global(ol[data-wait]) .tas-col,
	:global(ol[data-wait]) .tas-col-figure {
		animation-play-state: paused;
	}
	/* The global reduced-motion rule shortens durations but not delays, which
	   would still pop the columns in one by one. Here they simply render. */
	@media (prefers-reduced-motion: reduce) {
		.tas-col,
		.tas-col-figure {
			animation: none;
		}
	}
	@keyframes tas-col-rise {
		from {
			transform: scaleY(0);
		}
	}
	@keyframes tas-col-figure {
		from {
			opacity: 0;
			transform: translateY(3px);
		}
	}
</style>
