<script lang="ts">
	import { page } from '$app/state';

	const links = [
		{ href: '/', label: 'Map' },
		{ href: '/contractors', label: 'Contractors' }
	];

	function isActive(href: string): boolean {
		return href === '/' ? page.url.pathname === '/' : page.url.pathname.startsWith(href);
	}
</script>

<nav class="h-12 shrink-0 flex items-center justify-between gap-3 px-4 max-md:px-3 bg-[var(--color-surface)] border-b border-[var(--color-border)]">
	<a href="/" class="flex items-center gap-2 font-bold text-base tracking-tight">
		<!-- Tasmania silhouette, generated from the live boundary data -->
		<svg viewBox="0 0 20.1 24" class="h-5 w-auto shrink-0" aria-hidden="true">
			<path
				d="M0.0 1.7L0.5 2.0L0.6 3.6L0.1 4.8L0.8 7.7L1.7 9.8L3.4 12.1L3.4 12.6L2.9 13.0L3.5 16.0L4.0 16.4L4.7 18.6L5.5 19.1L7.5 22.7L9.6 24.0L9.8 23.4L14.4 22.5L18.2 20.4L20.1 12.8L19.6 10.3L19.9 8.9L19.6 7.9L20.1 6.7L19.6 5.5L20.1 4.6L19.5 3.3L18.8 3.1L18.8 2.5L17.6 2.4L17.0 3.5L15.9 2.8L15.0 4.3L14.0 3.2L13.8 3.5L14.0 3.9L13.5 4.3L12.6 3.9L12.3 4.5L9.5 5.4L6.8 4.5L5.3 3.2L4.3 3.2L2.3 0.1L1.0 0.4L0.5 0.0L0.5 0.7L0.0 1.7Z"
				fill="var(--color-accent)" fill-opacity="0.22"
				stroke="var(--color-accent)" stroke-width="1" stroke-linejoin="round"
			/>
		</svg>
		<span><span class="text-[var(--color-accent)]">TAS</span> Project Tracker</span>
		<span class="max-md:hidden text-[0.6875rem] font-normal text-[var(--color-text-muted)] ml-1 mt-0.5">Tasmanian Public Infrastructure Monitor</span>
	</a>
	<div class="flex gap-1">
		{#each links as link}
			<a
				href={link.href}
				aria-current={isActive(link.href) ? 'page' : undefined}
				class="text-sm font-medium px-3 py-1.5 rounded-lg border transition-colors {isActive(link.href)
					? 'border-[var(--color-accent)] text-[var(--color-accent)]'
					: 'border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:border-[var(--color-border)]'}"
			>{link.label}</a>
		{/each}
	</div>
</nav>
