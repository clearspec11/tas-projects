<script lang="ts">
	import { projects, selectedProject, filterCategory, filterStatus, filterFunding, filterGovernmentLevel, searchQuery, timelineRange } from '$lib/stores';
	import { STATUS_CONFIG, CATEGORY_CONFIG, FUNDING_CONFIG, GOVERNMENT_LEVEL_CONFIG, type Project, type ProjectCategory, type ProjectStatus, type FundingType, type GovernmentLevel } from '$lib/types';

	let { onFlyTo }: { onFlyTo: (lat: number, lng: number) => void } = $props();

	function formatCurrency(n: number): string {
		if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(1)}B`;
		if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(0)}M`;
		return `$${(n / 1_000).toFixed(0)}K`;
	}

	function budgetPercent(p: Project): number {
		return Math.round((p.spent / p.budget) * 100);
	}

	function filtered(): Project[] {
		return $projects.filter((p) => {
			if ($filterCategory !== 'all' && p.category !== $filterCategory) return false;
			if ($filterStatus !== 'all' && p.status !== $filterStatus) return false;
			if ($filterFunding !== 'all' && p.funding_type !== $filterFunding) return false;
			if ($filterGovernmentLevel !== 'all' && p.government_level !== $filterGovernmentLevel) return false;
			if ($searchQuery && !p.name.toLowerCase().includes($searchQuery.toLowerCase())) return false;
			const startYear = new Date(p.start_date).getFullYear();
			if (startYear < $timelineRange[0] || startYear > $timelineRange[1]) return false;
			return true;
		});
	}

	function totalBudget(): number {
		return filtered().reduce((s, p) => s + p.budget, 0);
	}
	function totalSpent(): number {
		return filtered().reduce((s, p) => s + p.spent, 0);
	}
	function overBudgetCount(): number {
		return filtered().filter((p) => p.status === 'over_budget').length;
	}
	function pppCount(): number {
		return filtered().filter((p) => p.funding_type !== 'public').length;
	}

	function selectProject(p: Project) {
		selectedProject.set(p);
		onFlyTo(p.lat, p.lng);
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
	<div class="p-4 border-b border-[var(--color-border)]">
		<h1 class="text-lg font-bold tracking-tight">
			<span class="text-[var(--color-accent)]">TAS</span> Project Tracker
		</h1>
		<p class="text-xs text-[var(--color-text-muted)] mt-0.5">Tasmanian Public Infrastructure Monitor</p>
	</div>

	<!-- Stats -->
	<div class="grid grid-cols-4 gap-1.5 p-3 border-b border-[var(--color-border)]">
		<div class="bg-[var(--color-bg)] rounded-lg p-2 text-center">
			<div class="text-base font-bold text-[var(--color-accent)]">{filtered().length}</div>
			<div class="text-[9px] text-[var(--color-text-muted)] uppercase tracking-wider">Projects</div>
		</div>
		<div class="bg-[var(--color-bg)] rounded-lg p-2 text-center">
			<div class="text-base font-bold text-[var(--color-text)]">{formatCurrency(totalBudget())}</div>
			<div class="text-[9px] text-[var(--color-text-muted)] uppercase tracking-wider">Budget</div>
		</div>
		<div class="bg-[var(--color-bg)] rounded-lg p-2 text-center">
			<div class="text-base font-bold text-[var(--color-danger)]">{overBudgetCount()}</div>
			<div class="text-[9px] text-[var(--color-text-muted)] uppercase tracking-wider">Over</div>
		</div>
		<div class="bg-[var(--color-bg)] rounded-lg p-2 text-center">
			<div class="text-base font-bold text-[var(--color-warning)]">{pppCount()}</div>
			<div class="text-[9px] text-[var(--color-text-muted)] uppercase tracking-wider">Private</div>
		</div>
	</div>

	<!-- Filters -->
	<div class="p-3 space-y-2 border-b border-[var(--color-border)]">
		<input
			type="text"
			placeholder="Search projects..."
			class="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg px-3 py-1.5 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent)]"
			oninput={(e) => searchQuery.set((e.target as HTMLInputElement).value)}
		/>
		<div class="flex gap-2">
			<select
				class="flex-1 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg px-2 py-1.5 text-xs text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]"
				onchange={(e) => filterCategory.set((e.target as HTMLSelectElement).value as ProjectCategory | 'all')}
			>
				{#each categories as c}
					<option value={c.value}>{c.label}</option>
				{/each}
			</select>
			<select
				class="flex-1 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg px-2 py-1.5 text-xs text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]"
				onchange={(e) => filterStatus.set((e.target as HTMLSelectElement).value as ProjectStatus | 'all')}
			>
				{#each statuses as s}
					<option value={s.value}>{s.label}</option>
				{/each}
			</select>
		</div>
		<select
			class="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg px-2 py-1.5 text-xs text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]"
			onchange={(e) => filterFunding.set((e.target as HTMLSelectElement).value as FundingType | 'all')}
		>
			{#each fundingTypes as f}
				<option value={f.value}>{f.label}</option>
			{/each}
		</select>
		<select
			class="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg px-2 py-1.5 text-xs text-[var(--color-text)] focus:outline-none focus:border-[var(--color-accent)]"
			onchange={(e) => filterGovernmentLevel.set((e.target as HTMLSelectElement).value as GovernmentLevel | 'all')}
		>
			{#each governmentLevels as g}
				<option value={g.value}>{g.label}</option>
			{/each}
		</select>
	</div>

	<!-- Project List -->
	<div class="flex-1 overflow-y-auto">
		{#each filtered() as project (project.id)}
			{@const cfg = STATUS_CONFIG[project.status]}
			{@const catCfg = CATEGORY_CONFIG[project.category]}
			{@const fundCfg = FUNDING_CONFIG[project.funding_type]}
			{@const govCfg = GOVERNMENT_LEVEL_CONFIG[project.government_level]}
			{@const pct = budgetPercent(project)}
			<button
				class="w-full text-left p-3 border-b border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] transition-colors cursor-pointer {$selectedProject?.id === project.id ? 'bg-[var(--color-surface-hover)]' : ''}"
				onclick={() => selectProject(project)}
			>
				<div class="flex items-start justify-between gap-2">
					<div class="flex-1 min-w-0">
						<div class="text-sm font-semibold truncate">{catCfg.icon} {project.name}</div>
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
			</button>
		{:else}
			<div class="p-6 text-center text-sm text-[var(--color-text-muted)]">No projects match filters</div>
		{/each}
	</div>
</aside>
