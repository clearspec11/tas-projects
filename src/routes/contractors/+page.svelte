<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { projects, filterContractor } from '$lib/stores';
	import { SEED_PROJECTS } from '$lib/seed-data';
	import { loadProjects } from '$lib/data';
	import { contractorStats, formatCurrency, type ContractorStats } from '$lib/metrics';
	import { Flag } from '@lucide/svelte';

	onMount(() => {
		// Direct-load support: the map page normally seeds the store
		if ($projects.length === 0) projects.set(SEED_PROJECTS);
		loadProjects().then(({ projects: rows, source }) => {
			if (source === 'supabase') projects.set(rows);
		});
	});

	type Col = 'name' | 'projects' | 'budget' | 'overrun' | 'flagged' | 'clean';
	let sortCol = $state<Col>('overrun');
	let sortDesc = $state(true);

	const stats = $derived(contractorStats($projects));

	const rows = $derived.by(() => {
		const r = [...stats.ranked];
		// Ascending comparator per column; sortDesc flips it
		const cmp = (a: ContractorStats, b: ContractorStats): number => {
			switch (sortCol) {
				case 'name': return a.name.localeCompare(b.name);
				case 'projects': return a.projects - b.projects;
				case 'budget': return a.totalBudget - b.totalBudget;
				case 'overrun': return a.overrunPct - b.overrunPct;
				case 'flagged': return a.flagged - b.flagged;
				case 'clean': return a.cleanPct - b.cleanPct;
			}
		};
		r.sort((a, b) => (sortDesc ? -cmp(a, b) : cmp(a, b)));
		return r;
	});

	const combinedBudget = $derived(stats.ranked.reduce((s, c) => s + c.totalBudget, 0));
	const worst = $derived(
		stats.ranked.length ? stats.ranked.reduce((w, c) => (c.overrunPct > w.overrunPct ? c : w)) : null
	);

	function setSort(col: Col) {
		if (sortCol === col) {
			sortDesc = !sortDesc;
		} else {
			sortCol = col;
			sortDesc = col !== 'name';
		}
	}

	function openOnMap(c: ContractorStats) {
		filterContractor.set(c.name);
		goto(`/?contractor=${encodeURIComponent(c.name)}`);
	}

	function pct(n: number): string {
		const v = Math.round(n * 100);
		return `${v > 0 ? '+' : ''}${v}%`;
	}

	// Scale the overrun mini-bar against the worst overrun on the board.
	// Negative values aren't shown as numbers: spend-to-date below budget on an
	// in-progress project isn't an achievement, just earliness.
	const barMax = $derived(Math.max(0.01, ...stats.ranked.map((c) => c.overrunPct)));

	const columns: { key: Col; label: string; align: string; title?: string }[] = [
		{ key: 'name', label: 'Contractor', align: 'text-left' },
		{ key: 'projects', label: 'Projects', align: 'text-right' },
		{ key: 'budget', label: 'Budget', align: 'text-right' },
		{ key: 'overrun', label: 'Overrun', align: 'text-right', title: 'Money-weighted: total spent vs total budget across their projects' },
		{ key: 'flagged', label: 'Flags', align: 'text-right', title: 'Projects over budget or overdue' },
		{ key: 'clean', label: 'Clean record', align: 'text-right', title: 'Share of their projects with no flag' }
	];
</script>

<svelte:head>
	<title>Contractors — TAS Project Tracker</title>
</svelte:head>

<div class="h-full overflow-y-auto bg-[var(--color-bg)]">
	<div class="max-w-4xl mx-auto p-4 md:p-6">
		<h1 class="text-xl font-bold tracking-tight">Contractor scorecards</h1>
		<p class="text-[0.8125rem] text-[var(--color-text-muted)] mt-1 max-w-[65ch]">
			Who delivers on budget and who doesn't, across every named contractor on the board.
			Overrun is money-weighted, so one large blowout counts for more than several small
			on-budget jobs.
		</p>

		<!-- Summary: the worst overrun is the headline; the two counts ride along
		     in a quieter strip so the board reads as one finding, not three tiles. -->
		<div class="flex max-md:flex-col items-stretch gap-3 mt-4">
			<div class="flex-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-4">
				<div class="text-[0.6875rem] text-[var(--color-text-muted)] uppercase tracking-wider">Biggest overrun</div>
				{#if worst && worst.overrunPct > 0}
					<div class="flex items-baseline gap-2 mt-1.5">
						<span class="text-[2rem] leading-none font-bold tabular-nums text-red-400">{pct(worst.overrunPct)}</span>
						<span class="text-sm font-semibold text-[var(--color-text)]">{worst.name}</span>
					</div>
					<p class="text-[0.6875rem] text-[var(--color-text-muted)] mt-2">Money-weighted across that contractor's projects.</p>
				{:else}
					<div class="text-[2rem] leading-none font-bold mt-1.5 text-[var(--color-success)]">None</div>
					<p class="text-[0.6875rem] text-[var(--color-text-muted)] mt-2">No contractor is spending over budget so far.</p>
				{/if}
			</div>
			<div class="flex md:flex-col md:w-44 justify-around md:justify-center gap-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl px-4 py-3">
				<div class="flex items-baseline gap-1.5">
					<span class="text-lg font-bold tabular-nums">{stats.ranked.length}</span>
					<span class="text-xs text-[var(--color-text-muted)]">contractors</span>
				</div>
				<div class="flex items-baseline gap-1.5">
					<span class="text-lg font-bold tabular-nums">{formatCurrency(combinedBudget)}</span>
					<span class="text-xs text-[var(--color-text-muted)]">combined budget</span>
				</div>
			</div>
		</div>

		<!-- Scorecard table -->
		<div class="mt-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl overflow-x-auto">
			<table class="w-full min-w-[640px] text-[0.8125rem] border-collapse">
				<thead>
					<tr>
						{#each columns as col}
							<th class="px-3 py-2.5 border-b border-[var(--color-border)] {col.align}">
								<button
									onclick={() => setSort(col.key)}
									title={col.title}
									aria-sort={sortCol === col.key ? (sortDesc ? 'descending' : 'ascending') : undefined}
									class="text-[0.6875rem] uppercase tracking-wider font-semibold cursor-pointer transition-colors {sortCol === col.key ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'}"
								>
									{col.label}{sortCol === col.key ? (sortDesc ? ' ↓' : ' ↑') : ''}
								</button>
							</th>
						{/each}
					</tr>
				</thead>
				<tbody>
					{#each rows as c (c.name)}
						<tr
							onclick={() => openOnMap(c)}
							onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openOnMap(c); } }}
							tabindex="0"
							role="link"
							aria-label="Show {c.name} projects on the map"
							class="border-b border-[var(--color-border)] last:border-b-0 hover:bg-[var(--color-surface-hover)] transition-colors cursor-pointer"
						>
							<td class="px-3 py-2.5 font-semibold">{c.name}</td>
							<td class="px-3 py-2.5 text-right tabular-nums">{c.projects}</td>
							<td class="px-3 py-2.5 text-right tabular-nums">{formatCurrency(c.totalBudget)}</td>
							<td class="px-3 py-2.5 text-right">
								{#if c.overrunPct > 0}
									<span class="inline-flex items-center justify-end gap-2">
										<span class="w-14 h-1.5 rounded-full bg-[var(--color-bg)] overflow-hidden">
											<span
												class="block h-full rounded-full bg-[var(--color-danger)]"
												style="width: {Math.round((c.overrunPct / barMax) * 100)}%;"
											></span>
										</span>
										<span class="font-mono font-medium w-12 text-red-400">{pct(c.overrunPct)}</span>
									</span>
								{:else}
									<span class="text-[var(--color-text-muted)]" title="Spending is at or below budget so far">none</span>
								{/if}
							</td>
							<td class="px-3 py-2.5 text-right tabular-nums {c.flagged > 0 ? 'text-[var(--color-warning)] font-semibold' : 'text-[var(--color-text-muted)]'}">
								{#if c.flagged > 0}
									<span class="inline-flex items-center justify-end gap-1"><Flag size={13} />{c.flagged}</span>
								{:else}0{/if}
							</td>
							<td class="px-3 py-2.5 text-right font-mono tabular-nums">{Math.round(c.cleanPct * 100)}%</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>

		<div class="mt-3 space-y-1 text-[0.6875rem] text-[var(--color-text-muted)]">
			<p>Click a contractor to see their projects on the map.</p>
			{#if stats.unattributed > 0}
				<p>{stats.unattributed} projects have no named contractor and are not ranked.</p>
			{/if}
			<p class="italic">Figures are illustrative seed data. Follow each project's source for official numbers.</p>
		</div>
	</div>
</div>
