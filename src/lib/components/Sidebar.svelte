<script lang="ts">
	import { projects, selectedProject, filterCategory, filterStatus, filterFunding, filterGovernmentLevel, searchQuery, sortKey } from '$lib/stores';
	import { STATUS_CONFIG, CATEGORY_CONFIG, FUNDING_CONFIG, GOVERNMENT_LEVEL_CONFIG, type Project, type ProjectCategory, type ProjectStatus, type FundingType, type GovernmentLevel } from '$lib/types';
	import { timelineRange } from '$lib/stores';
	import {
		formatCurrency, budgetPercent, variance, variancePct, delayMonths, isRedFlag,
		filterProjects, sortProjects, projectsToCsv, downloadFile, SORT_OPTIONS, type SortKey
	} from '$lib/metrics';

	let { onFlyTo }: { onFlyTo: (lat: number, lng: number) => void } = $props();

	const list = $derived(
		sortProjects(
			filterProjects($projects, {
				category: $filterCategory,
				status: $filterStatus,
				funding: $filterFunding,
				governmentLevel: $filterGovernmentLevel,
				query: $searchQuery,
				range: $timelineRange
			}),
			$sortKey
		)
	);

	function totalBudget(list: Project[]): number {
		return list.reduce((s, p) => s + p.budget, 0);
	}
	function overBudgetCount(list: Project[]): number {
		return list.filter((p) => p.status === 'over_budget').length;
	}
	function redFlagCount(list: Project[]): number {
		return list.filter((p) => isRedFlag(p)).length;
	}

	function selectProject(p: Project) {
		selectedProject.set(p);
		onFlyTo(p.lat, p.lng);
	}

	function exportCsv() {
		downloadFile('tas-projects.csv', projectsToCsv(list), 'text/csv');
	}
	function exportJson() {
		downloadFile('tas-projects.json', JSON.stringify(list, null, 2), 'application/json');
	}

	const categories: { value: ProjectCategory | 'all'; label: string }[] = [
		{ value: 'all', label: 'All Categories' },
		...Object.entries(CATEGORY_CONFIG).map(([k, v]) => ({ value: k as ProjectCategory, label: `${v.icon} ${v.label}` }))
	];

	const statuses: { value: ProjectStatus | 'all'; label: string }[] = [
		{ value: 'all', label: 'All Statuses' },
		...Object.entries(STATUS_CONFIG).map(([k, v]) => ({ value: k as ProjectStatus, label: v.label }))
	];

	const fundingTypes: { value: FundingType | 'all'; label: string }[] = [
		{ value: 'all', label: 'All Funding' },
		...Object.entries(FUNDING_CONFIG).map(([k, v]) => ({ value: k as FundingType, label: v.shortLabel }))
	];

	const governmentLevels: { value: GovernmentLevel | 'all'; label: string }[] = [
		{ value: 'all', label: 'All Levels' },
		...Object.entries(GOVERNMENT_LEVEL_CONFIG).map(([k, v]) => ({ value: k as GovernmentLevel, label: v.label }))
	];
</script>

<aside class="w-96 h-full flex flex-col bg-[var(--color-surface)] border-r border-[var(--color-border)] overflow-hidden">
	<!-- Header -->
	<div class="p-4 border-b border-[var(--color-border)] flex items-start justify-between">
		<div>
			<h1 class="text-lg font-bold tracking-tight">
				<span class="text-[var(--color-accent)]">TAS</span> Project Tracker
			</h1>
			<p class="text-xs text-[var(--color-text-muted)] mt-0.5">Tasmanian Public Infrastructure Monitor</p>
		</div>
		<div class="flex gap-1">
			<button
				onclick={exportCsv}
				title="Export filtered projects as CSV"
				class="text-[10px] px-2 py-1 rounded-md border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:border-[var(--color-accent)] transition-colors cursor-pointer"
			>CSV</button>
			<button
				onclick={exportJson}
				title="Export filtered projects as JSON"
				class="text-[10px] px-2 py-1 rounded-md border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:border-[var(--color-accent)] transition-colors cursor-pointer"
			>JSON</button>
		</div>
	</div>

	<!-- Stats -->
	<div class="grid grid-cols-4 gap-1.5 p-3 border-b border-[var(--color-border)]">
		<div class="bg-[var(--color-bg)] rounded-lg p-2 text-center">
			<div class="text-base font-bold text-[var(--color-accent)]">{list.length}</div>
			<div class="text-[9px] text-[var(--color-text-muted)] uppercase tracking-wider">Projects</div>
		</div>
		<div class="bg-[var(--color-bg)] rounded-lg p-2 text-center">
			<div class="text-base font-bold text-[var(--color-text)]">{formatCurrency(totalBudget(list))}</div>
			<div class="text-[9px] text-[var(--color-text-muted)] uppercase tracking-wider">Budget</div>
		</div>
		<div class="bg-[var(--color-bg)] rounded-lg p-2 text-center">
			<div class="text-base font-bold text-[var(--color-danger)]">{overBudgetCount(list)}</div>
			<div class="text-[9px] text-[var(--color-text-muted)] uppercase tracking-wider">Over</div>
		</div>
		<div class="bg-[var(--color-bg)] rounded-lg p-2 text-center">
			<div class="text-base font-bold text-[var(--color-warning)]">🚩 {redFlagCount(list)}</div>
			<div class="text-[9px] text-[var(--color-text-muted)] uppercase tracking-wider">Flags</div>
		</div>
	</div>

	<!-- Filters -->
	<div class="p-3 space-y-2 border-b border-[var(--color-border)]">
		<input
			type="text"
			placeholder="Search projects..."
			value={$searchQuery}
			class="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg px-3 py-1.5 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent)]"
			oninput={(e) => searchQuery.set((e.target as HTMLInputElement).value)}
		/>
		<div class="flex gap-2">
			<select
				class="flex-1 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg px-2 py-1.5 text-xs text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]"
				value={$filterCategory}
				onchange={(e) => filterCategory.set((e.target as HTMLSelectElement).value as ProjectCategory | 'all')}
			>
				{#each categories as c}
					<option value={c.value}>{c.label}</option>
				{/each}
			</select>
			<select
				class="flex-1 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg px-2 py-1.5 text-xs text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]"
				value={$filterStatus}
				onchange={(e) => filterStatus.set((e.target as HTMLSelectElement).value as ProjectStatus | 'all')}
			>
				{#each statuses as s}
					<option value={s.value}>{s.label}</option>
				{/each}
			</select>
		</div>
		<div class="flex gap-2">
			<select
				class="flex-1 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg px-2 py-1.5 text-xs text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]"
				value={$filterFunding}
				onchange={(e) => filterFunding.set((e.target as HTMLSelectElement).value as FundingType | 'all')}
			>
				{#each fundingTypes as f}
					<option value={f.value}>{f.label}</option>
				{/each}
			</select>
			<select
				class="flex-1 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg px-2 py-1.5 text-xs text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]"
				value={$filterGovernmentLevel}
				onchange={(e) => filterGovernmentLevel.set((e.target as HTMLSelectElement).value as GovernmentLevel | 'all')}
			>
				{#each governmentLevels as g}
					<option value={g.value}>{g.label}</option>
				{/each}
			</select>
		</div>
		<div class="flex items-center gap-2">
			<span class="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider whitespace-nowrap">Sort</span>
			<select
				class="flex-1 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg px-2 py-1.5 text-xs text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]"
				value={$sortKey}
				onchange={(e) => sortKey.set((e.target as HTMLSelectElement).value as SortKey)}
			>
				{#each SORT_OPTIONS as o}
					<option value={o.value}>{o.label}</option>
				{/each}
			</select>
		</div>
	</div>

	<!-- Project List -->
	<div class="flex-1 overflow-y-auto">
		{#each list as project (project.id)}
			{@const cfg = STATUS_CONFIG[project.status]}
			{@const catCfg = CATEGORY_CONFIG[project.category]}
			{@const govCfg = GOVERNMENT_LEVEL_CONFIG[project.government_level]}
			{@const pct = budgetPercent(project)}
			{@const v = variance(project)}
			{@const late = delayMonths(project)}
			{@const flagged = isRedFlag(project)}
			<button
				class="w-full text-left p-3 border-b border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] transition-colors cursor-pointer {$selectedProject?.id === project.id ? 'bg-[var(--color-surface-hover)]' : ''}"
				onclick={() => selectProject(project)}
			>
				<div class="flex items-start justify-between gap-2">
					<div class="flex-1 min-w-0">
						<div class="text-sm font-semibold truncate">
							{#if flagged}<span title="Over budget or overdue">🚩</span> {/if}{catCfg.icon} {project.name}
						</div>
						<div class="text-xs text-[var(--color-text-muted)] mt-0.5">
							{project.council ?? project.location_name}
						</div>
					</div>
					<div class="flex flex-col items-end gap-0.5">
						<span class="text-[10px] px-2 py-0.5 rounded-full font-medium whitespace-nowrap {cfg.bgClass}">
							{cfg.label}
						</span>
						<span class="text-[9px] px-1.5 py-0.5 rounded-full font-medium whitespace-nowrap" style="background: {govCfg.color}20; color: {govCfg.color};">
							{govCfg.shortLabel}
						</span>
					</div>
				</div>
				<div class="mt-2 flex items-center gap-2 text-xs text-[var(--color-text-muted)]">
					<span>{formatCurrency(project.spent)} / {formatCurrency(project.budget)}</span>
					<div class="flex-1 bg-[var(--color-bg)] rounded-full h-1.5">
						<div
							class="h-full rounded-full transition-all"
							style="width: {Math.min(100, pct)}%; background: {cfg.color};"
						></div>
					</div>
					<span class="font-mono">{pct}%</span>
				</div>
				{#if v > 0 || late}
					<div class="mt-1 flex items-center gap-2 text-[10px]">
						{#if v > 0}
							<span class="text-[var(--color-danger)] font-medium">+{formatCurrency(v)} ({Math.round(variancePct(project) * 100)}%)</span>
						{/if}
						{#if late}
							<span class="text-[var(--color-warning)] font-medium">{late}mo late</span>
						{/if}
					</div>
				{/if}
			</button>
		{:else}
			<div class="p-6 text-center text-sm text-[var(--color-text-muted)]">No projects match filters</div>
		{/each}
	</div>
</aside>
