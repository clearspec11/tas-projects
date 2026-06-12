<script lang="ts">
	import { projects, selectedProject, filterCategory, filterStatus, filterFunding, filterGovernmentLevel, filterFlagged, filterContractor, searchQuery, sortKey } from '$lib/stores';
	import { STATUS_CONFIG, CATEGORY_CONFIG, FUNDING_CONFIG, GOVERNMENT_LEVEL_CONFIG, type Project, type ProjectCategory, type ProjectStatus, type FundingType, type GovernmentLevel } from '$lib/types';
	import { timelineRange } from '$lib/stores';
	import {
		formatCurrency, budgetPercent, variance, variancePct, delayMonths, isRedFlag,
		filterProjects, sortProjects, projectsToCsv, downloadFile, SORT_OPTIONS, type SortKey
	} from '$lib/metrics';

	let { onFlyTo }: { onFlyTo: (lat: number, lng: number) => void } = $props();

	// Advanced filters (category/funding/level/sort) collapse on every width;
	// search + status stay in view as the primary accountability controls.
	let showAdvanced = $state(false);

	const DEFAULT_RANGE: [number, number] = [2017, 2036];

	const list = $derived(
		sortProjects(
			filterProjects($projects, {
				category: $filterCategory,
				status: $filterStatus,
				funding: $filterFunding,
				governmentLevel: $filterGovernmentLevel,
				query: $searchQuery,
				range: $timelineRange,
				flaggedOnly: $filterFlagged,
				contractor: $filterContractor
			}),
			$sortKey
		)
	);

	const rangeChanged = $derived(
		$timelineRange[0] !== DEFAULT_RANGE[0] || $timelineRange[1] !== DEFAULT_RANGE[1]
	);

	const advancedCount = $derived(
		($filterCategory !== 'all' ? 1 : 0) + ($filterFunding !== 'all' ? 1 : 0) +
		($filterGovernmentLevel !== 'all' ? 1 : 0) + (rangeChanged ? 1 : 0)
	);

	const hasActiveFilters = $derived(
		advancedCount > 0 || $filterStatus !== 'all' || $searchQuery !== '' || $filterFlagged ||
		$filterContractor !== null
	);

	function clearFilters() {
		filterCategory.set('all');
		filterStatus.set('all');
		filterFunding.set('all');
		filterGovernmentLevel.set('all');
		filterFlagged.set(false);
		filterContractor.set(null);
		searchQuery.set('');
		timelineRange.set([...DEFAULT_RANGE]);
	}

	function toggleOver() {
		filterStatus.set($filterStatus === 'over_budget' ? 'all' : 'over_budget');
	}
	function toggleFlagged() {
		filterFlagged.set(!$filterFlagged);
	}

	// Drop the selection when filtering removes it from the visible set,
	// so the detail panel never shows a project the list/map no longer do.
	$effect(() => {
		const sel = $selectedProject;
		if (sel && $projects.length > 0 && !list.some((p) => p.id === sel.id)) {
			selectedProject.set(null);
		}
	});

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

<aside class="w-96 h-full max-md:w-full max-md:h-auto max-md:flex-1 max-md:min-h-0 flex flex-col bg-[var(--color-surface)] border-r max-md:border-r-0 max-md:border-t border-[var(--color-border)] overflow-hidden">
	<!-- Header row: brand lives in the top nav; this keeps the export actions -->
	<div class="px-3 pt-3 flex items-center justify-between">
		<span class="text-[0.6875rem] text-[var(--color-text-muted)] uppercase tracking-wider">Projects</span>
		<div class="flex gap-1">
			<button
				onclick={exportCsv}
				title="Export filtered projects as CSV"
				class="text-[0.6875rem] px-2.5 py-1.5 rounded-md border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:border-[var(--color-accent)] transition-colors cursor-pointer"
			>CSV</button>
			<button
				onclick={exportJson}
				title="Export filtered projects as JSON"
				class="text-[0.6875rem] px-2.5 py-1.5 rounded-md border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:border-[var(--color-accent)] transition-colors cursor-pointer"
			>JSON</button>
		</div>
	</div>

	<!-- Stats -->
	<div class="grid grid-cols-4 gap-1.5 p-3 border-b border-[var(--color-border)]">
		<div class="bg-[var(--color-bg)] rounded-lg p-2 text-center">
			<div class="text-[1.375rem] leading-none font-bold tabular-nums text-[var(--color-accent)]">{list.length}</div>
			<div class="text-[0.6875rem] text-[var(--color-text-muted)] uppercase tracking-wider mt-1">Projects</div>
		</div>
		<div class="bg-[var(--color-bg)] rounded-lg p-2 text-center">
			<div class="text-[1.375rem] leading-none font-bold tabular-nums text-[var(--color-text)]">{formatCurrency(totalBudget(list))}</div>
			<div class="text-[0.6875rem] text-[var(--color-text-muted)] uppercase tracking-wider mt-1">Budget</div>
		</div>
		<button
			onclick={toggleOver}
			aria-pressed={$filterStatus === 'over_budget'}
			title="Show only over-budget projects"
			class="bg-[var(--color-bg)] rounded-lg p-2 text-center cursor-pointer border transition-colors {$filterStatus === 'over_budget' ? 'border-[var(--color-danger)]' : 'border-transparent hover:border-[var(--color-border)]'}"
		>
			<div class="text-[1.375rem] leading-none font-bold tabular-nums text-[var(--color-danger)]">{overBudgetCount(list)}</div>
			<div class="text-[0.6875rem] text-[var(--color-text-muted)] uppercase tracking-wider mt-1">Over</div>
		</button>
		<button
			onclick={toggleFlagged}
			aria-pressed={$filterFlagged}
			title="Show only flagged projects (over budget or overdue)"
			class="bg-[var(--color-bg)] rounded-lg p-2 text-center cursor-pointer border transition-colors {$filterFlagged ? 'border-[var(--color-warning)]' : 'border-transparent hover:border-[var(--color-border)]'}"
		>
			<div class="text-[1.375rem] leading-none font-bold text-[var(--color-warning)]">🚩{redFlagCount(list)}</div>
			<div class="text-[0.6875rem] text-[var(--color-text-muted)] uppercase tracking-wider mt-1">Flags</div>
		</button>
	</div>

	<!-- Filters: search + status always in view; the rest behind More filters -->
	<div class="p-3 space-y-2 border-b border-[var(--color-border)]">
		<input
			id="project-search"
			type="text"
			placeholder="Search projects...  ( / )"
			value={$searchQuery}
			class="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg px-3 py-1.5 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent)]"
			oninput={(e) => searchQuery.set((e.target as HTMLInputElement).value)}
		/>
		<div class="flex gap-2">
			<select
				class="flex-1 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg px-2 py-1.5 text-xs text-[var(--color-text)] focus:border-[var(--color-accent)]"
				value={$filterStatus}
				onchange={(e) => filterStatus.set((e.target as HTMLSelectElement).value as ProjectStatus | 'all')}
			>
				{#each statuses as s}
					<option value={s.value}>{s.label}</option>
				{/each}
			</select>
			<button
				onclick={() => (showAdvanced = !showAdvanced)}
				aria-expanded={showAdvanced}
				class="text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors cursor-pointer whitespace-nowrap {showAdvanced || advancedCount > 0 ? 'border-[var(--color-accent)] text-[var(--color-accent)]' : 'border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-accent)]'}"
			>
				More filters{advancedCount > 0 ? ` (${advancedCount})` : ''}
			</button>
			{#if hasActiveFilters}
				<button
					onclick={clearFilters}
					title="Reset all filters, search and timeline"
					class="text-xs font-medium px-3 py-1.5 rounded-lg border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:border-[var(--color-accent)] transition-colors cursor-pointer whitespace-nowrap"
				>Clear</button>
			{/if}
		</div>

		{#if $filterContractor}
			<div class="flex items-center gap-2 text-xs">
				<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[var(--color-accent)]/15 text-[var(--color-accent)] font-medium">
					Contractor: {$filterContractor}
					<button
						onclick={() => filterContractor.set(null)}
						aria-label="Remove contractor filter"
						class="hover:text-[var(--color-text)] leading-none cursor-pointer"
					>✕</button>
				</span>
			</div>
		{/if}

		{#if showAdvanced}
			<div class="space-y-2 pt-1">
				<div class="flex gap-2">
					<select
						class="flex-1 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg px-2 py-1.5 text-xs text-[var(--color-text)] focus:border-[var(--color-accent)]"
						value={$filterCategory}
						onchange={(e) => filterCategory.set((e.target as HTMLSelectElement).value as ProjectCategory | 'all')}
					>
						{#each categories as c}
							<option value={c.value}>{c.label}</option>
						{/each}
					</select>
					<select
						class="flex-1 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg px-2 py-1.5 text-xs text-[var(--color-text)] focus:border-[var(--color-accent)]"
						value={$filterFunding}
						onchange={(e) => filterFunding.set((e.target as HTMLSelectElement).value as FundingType | 'all')}
					>
						{#each fundingTypes as f}
							<option value={f.value}>{f.label}</option>
						{/each}
					</select>
				</div>
				<div class="flex gap-2">
					<select
						class="flex-1 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg px-2 py-1.5 text-xs text-[var(--color-text)] focus:border-[var(--color-accent)]"
						value={$filterGovernmentLevel}
						onchange={(e) => filterGovernmentLevel.set((e.target as HTMLSelectElement).value as GovernmentLevel | 'all')}
					>
						{#each governmentLevels as g}
							<option value={g.value}>{g.label}</option>
						{/each}
					</select>
					<select
						title="Sort projects"
						class="flex-1 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg px-2 py-1.5 text-xs text-[var(--color-text)] focus:border-[var(--color-accent)]"
						value={$sortKey}
						onchange={(e) => sortKey.set((e.target as HTMLSelectElement).value as SortKey)}
					>
						{#each SORT_OPTIONS as o}
							<option value={o.value}>Sort: {o.label}</option>
						{/each}
					</select>
				</div>
			</div>
		{/if}
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
						<div class="text-[0.9375rem] font-semibold truncate">
							{#if flagged}<span title="Over budget or overdue">🚩</span> {/if}{catCfg.icon} {project.name}
						</div>
						<div class="text-xs text-[var(--color-text-muted)] mt-0.5">
							{project.council ?? project.location_name}
						</div>
					</div>
					<div class="flex flex-col items-end gap-0.5">
						<span class="text-[0.6875rem] px-2 py-0.5 rounded-full font-medium whitespace-nowrap {cfg.bgClass}">
							{cfg.label}
						</span>
						<span class="text-[0.6875rem] px-1.5 py-0.5 rounded-full font-medium whitespace-nowrap" style="background: {govCfg.color}20; color: {govCfg.color};">
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
					<div class="mt-1 flex items-center gap-2 text-[0.6875rem]">
						{#if v > 0}
							<span class="text-red-400 font-medium">+{formatCurrency(v)} ({Math.round(variancePct(project) * 100)}%)</span>
						{/if}
						{#if late}
							<span class="text-[var(--color-warning)] font-medium">{late}mo late</span>
						{/if}
					</div>
				{/if}
			</button>
		{:else}
			<div class="p-6 text-center space-y-3">
				<p class="text-sm text-[var(--color-text-muted)]">No projects match your filters.</p>
				<button
					onclick={clearFilters}
					class="text-sm font-medium px-4 py-2 rounded-lg border border-[var(--color-accent)] text-[var(--color-accent)] hover:bg-[var(--color-accent)]/10 transition-colors cursor-pointer"
				>Clear all filters</button>
			</div>
		{/each}
	</div>
</aside>
