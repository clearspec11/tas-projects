<script lang="ts">
	import { selectedProject } from '$lib/stores';
	import { STATUS_CONFIG, CATEGORY_CONFIG, FUNDING_CONFIG, GOVERNMENT_LEVEL_CONFIG, FUNDER_CONFIG, type FundingBreakdown } from '$lib/types';
	import { formatCurrencyPrecise as formatCurrency, formatDate, budgetPercent, variance, variancePct, delayMonths, isRedFlag, resolveFundingBreakdown } from '$lib/metrics';

	const FUNDER_KEYS: (keyof FundingBreakdown)[] = ['federal', 'state', 'local', 'private'];

	function hostname(url: string): string {
		try {
			return new URL(url).hostname.replace(/^www\./, '');
		} catch {
			return url;
		}
	}

	function close() {
		selectedProject.set(null);
	}
</script>

{#if $selectedProject}
	{@const p = $selectedProject}
	{@const cfg = STATUS_CONFIG[p.status]}
	{@const catCfg = CATEGORY_CONFIG[p.category]}
	{@const fundCfg = FUNDING_CONFIG[p.funding_type]}
	{@const govCfg = GOVERNMENT_LEVEL_CONFIG[p.government_level]}
	{@const pct = budgetPercent(p)}
	{@const v = variance(p)}
	{@const late = delayMonths(p)}
	{@const flagged = isRedFlag(p)}
	{@const funding = resolveFundingBreakdown(p)}

	<div class="absolute top-14 right-4 w-96 max-h-[calc(100vh-5rem)] max-md:inset-x-2 max-md:top-2 max-md:w-auto max-md:max-h-[46dvh] overflow-y-auto bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-2xl z-[1000]">
		<!-- Header -->
		<div class="p-4 border-b border-[var(--color-border)]">
			<div class="flex items-start justify-between">
				<div>
					<div class="text-xs text-[var(--color-text-muted)] uppercase tracking-wider mb-1">{catCfg.icon} {catCfg.label}</div>
					<h2 class="text-xl font-bold leading-tight [text-wrap:balance]">{#if flagged}🚩 {/if}{p.name}</h2>
					<div class="text-xs text-[var(--color-text-muted)] mt-1">
					{p.council ? `${p.council} · ` : ''}{p.location_name}
				</div>
				</div>
				<button
					onclick={close}
					class="text-[var(--color-text-muted)] hover:text-[var(--color-text)] text-lg leading-none cursor-pointer"
				>✕</button>
			</div>
			<div class="flex flex-wrap gap-1.5 mt-2">
				<span class="text-xs px-2 py-0.5 rounded-full font-medium {cfg.bgClass}">
					{cfg.label}
				</span>
				<span title={govCfg.description} class="text-xs px-2 py-0.5 rounded-full font-medium" style="background: {govCfg.color}20; color: {govCfg.color};">
					{govCfg.shortLabel}
				</span>
				<span title={fundCfg.description} class="text-xs px-2 py-0.5 rounded-full font-medium bg-slate-500/20 text-slate-400">
					{fundCfg.label}
				</span>
			</div>
			<p class="text-[0.6875rem] text-[var(--color-text-muted)] mt-1.5 leading-snug">
				{fundCfg.description}.
			</p>
		</div>

		<!-- Budget breakdown -->
		<div class="p-4 space-y-3">
			<div>
				<div class="flex justify-between text-xs mb-1">
					<span class="text-[var(--color-text-muted)]">Budget Usage</span>
					<span class="font-mono font-bold" style="color: {cfg.color}">{pct}%</span>
				</div>
				<div class="bg-[var(--color-bg)] rounded-full h-3">
					<div
						class="h-full rounded-full transition-all"
						style="width: {Math.min(100, pct)}%; background: {cfg.color};"
					></div>
				</div>
			</div>

			<div class="grid grid-cols-2 gap-3">
				<div class="bg-[var(--color-bg)] rounded-lg p-3">
					<div class="text-[0.6875rem] text-[var(--color-text-muted)] uppercase tracking-wider">Budget</div>
					<div class="text-xl font-bold tabular-nums mt-0.5">{formatCurrency(p.budget)}</div>
				</div>
				<div class="bg-[var(--color-bg)] rounded-lg p-3">
					<div class="text-[0.6875rem] text-[var(--color-text-muted)] uppercase tracking-wider">Spent</div>
					<div class="text-xl font-bold tabular-nums mt-0.5" style="color: {cfg.color}">{formatCurrency(p.spent)}</div>
				</div>
			</div>

			<div class="grid {late ? 'grid-cols-2' : 'grid-cols-1'} gap-3">
				{#if v !== 0}
					<div class="bg-[var(--color-bg)] rounded-lg p-3 text-center">
						<div title="How far spending is above or below the budget" class="text-[0.6875rem] text-[var(--color-text-muted)] uppercase tracking-wider">Variance</div>
						<div class="text-xl font-bold tabular-nums mt-0.5" style="color: {v > 0 ? 'var(--color-danger)' : 'var(--color-success)'}">
							{v > 0 ? '+' : ''}{formatCurrency(Math.abs(v))}
						</div>
						<div class="text-[0.6875rem] font-mono mt-0.5" style="color: {v > 0 ? '#f87171' : 'var(--color-success)'}">
							{v > 0 ? '+' : ''}{Math.round(variancePct(p) * 100)}%
						</div>
					</div>
				{/if}
				{#if late}
					<div class="bg-[var(--color-bg)] rounded-lg p-3 text-center">
						<div class="text-[0.6875rem] text-[var(--color-text-muted)] uppercase tracking-wider">Schedule</div>
						<div class="text-xl font-bold mt-0.5 text-[var(--color-warning)]">{late}mo late</div>
						<div class="text-[0.6875rem] mt-0.5 text-[var(--color-warning)]">past due date</div>
					</div>
				{/if}
			</div>

			<!-- Funding split: who pays -->
			<div>
				<div class="flex justify-between items-baseline mb-1.5">
					<span class="text-[0.6875rem] text-[var(--color-text-muted)] uppercase tracking-wider">
						Who pays {funding.estimated ? '· est.' : ''}
					</span>
				</div>
				<div class="flex h-3 rounded-full overflow-hidden bg-[var(--color-bg)]">
					{#each FUNDER_KEYS as key}
						{@const amount = funding.breakdown[key]}
						{#if amount > 0}
							<div
								style="width: {(amount / p.budget) * 100}%; background: {FUNDER_CONFIG[key].color};"
								title="{FUNDER_CONFIG[key].label}: {formatCurrency(amount)}"
							></div>
						{/if}
					{/each}
				</div>
				<div class="flex flex-wrap gap-x-3 gap-y-1 mt-2">
					{#each FUNDER_KEYS as key}
						{@const amount = funding.breakdown[key]}
						{#if amount > 0}
							<div class="flex items-center gap-1 text-[0.6875rem]">
								<span class="w-2 h-2 rounded-full inline-block" style="background: {FUNDER_CONFIG[key].color};"></span>
								<span class="text-[var(--color-text)]">{FUNDER_CONFIG[key].label}</span>
								<span class="text-[var(--color-text-muted)]">{formatCurrency(amount)} ({Math.round((amount / p.budget) * 100)}%)</span>
							</div>
						{/if}
					{/each}
				</div>
				{#if funding.estimated}
					<p class="text-[0.625rem] text-[var(--color-text-muted)] mt-1.5 italic">Estimated from governing tier and delivery model. See source for actual figures.</p>
				{/if}
			</div>
		</div>

		<!-- Details -->
		<div class="px-4 pb-4 space-y-2 text-[0.8125rem]">
			<p class="text-[var(--color-text)]/85 leading-relaxed [text-wrap:pretty]">{p.description}</p>

			<div class="grid grid-cols-2 gap-x-4 gap-y-1 pt-2 border-t border-[var(--color-border)]">
				<div>
					<span class="text-[var(--color-text-muted)]">Started</span>
					<span class="ml-1 font-medium">{formatDate(p.start_date)}</span>
				</div>
				{#if p.expected_end_date}
					<div>
						<span class="text-[var(--color-text-muted)]">Expected</span>
						<span class="ml-1 font-medium">{formatDate(p.expected_end_date)}</span>
					</div>
				{/if}
				{#if p.contractor}
					<div class="col-span-2">
						<span class="text-[var(--color-text-muted)]">Contractor</span>
						<span class="ml-1 font-medium">{p.contractor}</span>
					</div>
				{/if}
			</div>

			{#if p.source_url}
				<a
					href={p.source_url}
					target="_blank"
					rel="noopener noreferrer"
					class="flex items-center justify-between mt-2 px-3 py-2 rounded-lg bg-[var(--color-bg)] border border-[var(--color-border)] hover:border-[var(--color-accent)] transition-colors group"
				>
					<span class="text-[var(--color-text-muted)] group-hover:text-[var(--color-text)]">
						Source: <span class="font-medium">{hostname(p.source_url)}</span>
					</span>
					<span class="text-[var(--color-accent)]">↗</span>
				</a>
			{/if}
		</div>
	</div>
{/if}
