<script lang="ts">
	import { onMount } from 'svelte';
	import {
		projects, selectedProject, filterCategory, filterStatus,
		filterFunding, filterGovernmentLevel, searchQuery, timelineRange, showHeatmap,
		showConnections, mapStyle
	} from '$lib/stores';
	import { STATUS_CONFIG, CATEGORY_CONFIG, FUNDING_CONFIG, GOVERNMENT_LEVEL_CONFIG, type Project } from '$lib/types';
	import { TASMANIA_CENTER, TASMANIA_ZOOM } from '$lib/tasmania-geo';
	import { formatCurrency, budgetPercent, filterProjects, isRedFlag, delayMonths } from '$lib/metrics';
	import tasmaniaGeoJson from '$lib/tasmania-boundary.json';

	let mapContainer: HTMLDivElement;
	let map: any;
	let markersLayer: any;
	let flagsLayer: any;
	let selectionLayer: any;
	let heatLayer: any;
	let connectionsLayer: any;
	let darkTiles: any;
	let satTiles: any;
	let L: any;

	// Accent ring marking the currently selected project on the map
	function drawSelection(p: Project | null) {
		if (!selectionLayer || !L) return;
		selectionLayer.clearLayers();
		if (!p) return;
		L.circleMarker([p.lat, p.lng], {
			radius: markerRadius(p) + 8,
			fill: false,
			color: '#38bdf8',
			weight: 3,
			opacity: 0.95,
			className: 'tas-selected-ring'
		}).addTo(selectionLayer);
	}

	function markerRadius(p: Project): number {
		return Math.max(8, Math.min(20, Math.sqrt(p.budget / 1_000_000) * 1.8));
	}

	function createMarker(p: Project) {
		const cfg = STATUS_CONFIG[p.status];
		const fundCfg = FUNDING_CONFIG[p.funding_type];
		const catCfg = CATEGORY_CONFIG[p.category];

		const govCfg = GOVERNMENT_LEVEL_CONFIG[p.government_level];
		const late = delayMonths(p);

		const marker = L.circleMarker([p.lat, p.lng], {
			radius: markerRadius(p),
			fillColor: cfg.color,
			fillOpacity: 0.8,
			color: govCfg.color,
			weight: 2.5,
			opacity: 0.9,
			dashArray: fundCfg.dashArray
		});

		// Hover tooltip
		marker.bindTooltip(`
			<div style="font-family: 'IBM Plex Sans', system-ui; font-size: 12px; line-height: 1.4;">
				<strong>${isRedFlag(p) ? '🚩 ' : ''}${p.name}</strong><br/>
				<span style="color: ${cfg.color};">${cfg.label}</span> · ${fundCfg.shortLabel}<br/>
				${formatCurrency(p.spent)} / ${formatCurrency(p.budget)} (${budgetPercent(p)}%)${late ? ` · <span style="color:#f59e0b;">${late}mo late</span>` : ''}
			</div>
		`, {
			direction: 'top',
			offset: [0, -10],
			className: 'tas-tooltip'
		});

		// Click popup
		marker.bindPopup(`
			<div style="font-family: 'IBM Plex Sans', system-ui; min-width: 220px; color: #1e293b;">
				<div style="font-size: 14px; font-weight: 700; margin-bottom: 4px;">${catCfg.icon} ${p.name}</div>
				<div style="font-size: 12px; color: #64748b; margin-bottom: 2px;">${p.council ?? p.location_name}</div>
				${p.council ? `<div style="font-size: 11px; color: #94a3b8; margin-bottom: 4px;">${p.location_name}</div>` : ''}
				<div style="display: flex; gap: 6px; margin-bottom: 8px;">
					<span style="font-size: 10px; padding: 1px 6px; border-radius: 9999px; background: ${cfg.color}20; color: ${cfg.color}; font-weight: 600;">${cfg.label}</span>
					<span style="font-size: 10px; padding: 1px 6px; border-radius: 9999px; background: #64748b20; color: #64748b; font-weight: 600;">${fundCfg.shortLabel}</span>
				</div>
				<div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 4px;">
					<span>Budget: <strong>${formatCurrency(p.budget)}</strong></span>
					<span>Spent: <strong>${formatCurrency(p.spent)}</strong></span>
				</div>
				<div style="background: #e2e8f0; border-radius: 4px; height: 6px; margin-bottom: 6px;">
					<div style="background: ${cfg.color}; height: 100%; border-radius: 4px; width: ${Math.min(100, budgetPercent(p))}%;"></div>
				</div>
				<div style="text-align: center;">
					<span style="font-size: 11px; font-weight: 600; color: ${cfg.color};">${budgetPercent(p)}%</span>
				</div>
			</div>
		`, { closeButton: false });

		marker.on('click', () => selectedProject.set(p));

		// Keyboard access: circle markers aren't focusable by default
		marker.on('add', () => {
			const el = marker.getElement?.();
			if (!el) return;
			el.setAttribute('tabindex', '0');
			el.setAttribute('role', 'button');
			el.setAttribute('aria-label', `${p.name}, ${cfg.label}, ${formatCurrency(p.spent)} of ${formatCurrency(p.budget)}`);
			el.addEventListener('keydown', (e: KeyboardEvent) => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					selectedProject.set(p);
				}
			});
		});

		return marker;
	}

	function updateMap(
		all: Project[], cat: string, status: string, funding: string,
		govLevel: string, query: string, range: [number, number], heatmap: boolean,
		connections: boolean
	) {
		if (!markersLayer || !L) return;
		markersLayer.clearLayers();
		if (flagsLayer) flagsLayer.clearLayers();
		if (heatLayer) map.removeLayer(heatLayer);
		if (connectionsLayer) connectionsLayer.clearLayers();

		const filtered = filterProjects(all, {
			category: cat as any, status: status as any, funding: funding as any,
			governmentLevel: govLevel as any, query, range
		});

		if (heatmap) {
			const heatData = filtered.map((p) => [p.lat, p.lng, p.spent / 1_000_000]);
			try {
				heatLayer = (L as any).heatLayer(heatData, {
					radius: 35,
					blur: 25,
					maxZoom: 12,
					gradient: { 0.2: '#38bdf8', 0.4: '#22c55e', 0.6: '#f59e0b', 0.8: '#ef4444', 1.0: '#dc2626' }
				}).addTo(map);
			} catch {
				// leaflet.heat not loaded
			}
		}

		filtered.forEach((p) => {
			// Red-flag halo behind the marker (own layer so it doesn't affect cluster counts)
			if (flagsLayer && isRedFlag(p)) {
				L.circleMarker([p.lat, p.lng], {
					radius: markerRadius(p) + 5,
					fill: false,
					color: '#ef4444',
					weight: 2,
					opacity: 0.75,
					dashArray: '2 3'
				}).addTo(flagsLayer);
			}
			const marker = createMarker(p);
			markersLayer.addLayer(marker);
		});

		if (connections && connectionsLayer) {
			const projectMap = new Map(all.map((p) => [p.id, p]));
			const drawnPairs = new Set<string>();
			filtered.forEach((p) => {
				p.related_project_ids.forEach((rid) => {
					const pairKey = [p.id, rid].sort().join('-');
					if (drawnPairs.has(pairKey)) return;
					drawnPairs.add(pairKey);
					const related = projectMap.get(rid);
					if (!related) return;
					if (!filtered.some((f) => f.id === rid)) return;
					L.polyline([[p.lat, p.lng], [related.lat, related.lng]], {
						color: '#f59e0b',
						weight: 1.5,
						opacity: 0.5,
						dashArray: '6 6'
					}).addTo(connectionsLayer);
				});
			});
		}
	}

	function switchTiles(style: 'dark' | 'satellite') {
		if (!map || !darkTiles || !satTiles) return;
		if (style === 'satellite') {
			map.removeLayer(darkTiles);
			satTiles.addTo(map);
		} else {
			map.removeLayer(satTiles);
			darkTiles.addTo(map);
		}
	}

	onMount(async () => {
		await import('leaflet/dist/leaflet.css');
		L = (await import('leaflet')).default;

		// Try loading plugins
		try { await import('leaflet.markercluster'); await import('leaflet.markercluster/dist/MarkerCluster.css'); await import('leaflet.markercluster/dist/MarkerCluster.Default.css'); } catch {}
		try { await import('leaflet.heat'); } catch {}

		map = L.map(mapContainer, {
			center: TASMANIA_CENTER,
			zoom: TASMANIA_ZOOM,
			zoomControl: true,
			attributionControl: true,
			maxBounds: [[-38, 142], [-45, 150]],
			minZoom: 6,
			maxZoom: 14
		});

		darkTiles = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
			attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
			subdomains: 'abcd'
		}).addTo(map);

		satTiles = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
			attribution: '&copy; Esri'
		});

		L.geoJSON(tasmaniaGeoJson, {
			style: {
				color: '#38bdf8',
				weight: 2,
				fillColor: '#38bdf8',
				fillOpacity: 0.06,
				dashArray: '6 4'
			}
		}).addTo(map);

		// Red-flag halos sit beneath the markers
		flagsLayer = L.layerGroup().addTo(map);

		// Use MarkerClusterGroup if available, else plain LayerGroup
		try {
			markersLayer = (L as any).markerClusterGroup({
				maxClusterRadius: 40,
				spiderfyOnMaxZoom: true,
				showCoverageOnHover: false,
				iconCreateFunction: (cluster: any) => {
					const count = cluster.getChildCount();
					const size = count > 10 ? 44 : count > 5 ? 36 : 30;
					return L.divIcon({
						html: `<div style="
							display:flex;align-items:center;justify-content:center;
							width:${size}px;height:${size}px;border-radius:50%;
							background:rgba(56,189,248,0.25);border:2px solid #38bdf8;
							color:#f1f5f9;font-weight:700;font-size:13px;font-family:'IBM Plex Sans',system-ui;
						">${count}</div>`,
						className: '',
						iconSize: [size, size]
					});
				}
			}).addTo(map);
		} catch {
			markersLayer = L.layerGroup().addTo(map);
		}

		connectionsLayer = L.layerGroup().addTo(map);
		selectionLayer = L.layerGroup().addTo(map);

		// Keep Leaflet's internal size in sync with the container (stacked
		// mobile layout, window resizes) so panes never render at stale sizes.
		const resizeObserver = new ResizeObserver(() => map?.invalidateSize());
		resizeObserver.observe(mapContainer);

		function redraw() {
			updateMap($projects, $filterCategory, $filterStatus, $filterFunding, $filterGovernmentLevel, $searchQuery, $timelineRange, $showHeatmap, $showConnections);
		}

		const unsubs = [
			projects.subscribe(redraw),
			filterCategory.subscribe(redraw),
			filterStatus.subscribe(redraw),
			filterFunding.subscribe(redraw),
			filterGovernmentLevel.subscribe(redraw),
			searchQuery.subscribe(redraw),
			timelineRange.subscribe(redraw),
			showHeatmap.subscribe(redraw),
			showConnections.subscribe(redraw),
			mapStyle.subscribe((s) => switchTiles(s)),
			selectedProject.subscribe((p) => drawSelection(p))
		];

		return () => {
			unsubs.forEach((u) => u());
			resizeObserver.disconnect();
			map.remove();
		};
	});

	export function flyTo(lat: number, lng: number) {
		map?.flyTo([lat, lng], 11, { duration: 0.8 });
	}
</script>

<div bind:this={mapContainer} class="w-full h-full"></div>

<style>
	:global(.tas-tooltip) {
		background: rgba(15, 23, 42, 0.95) !important;
		color: #f1f5f9 !important;
		border: 1px solid #334155 !important;
		border-radius: 8px !important;
		padding: 8px 12px !important;
		box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important;
	}
	:global(.tas-tooltip::before) {
		border-top-color: rgba(15, 23, 42, 0.95) !important;
	}
	:global(.leaflet-popup-content-wrapper) {
		border-radius: 12px !important;
	}
	:global(.tas-selected-ring) {
		animation: tas-ring-pulse 1.6s ease-out infinite;
	}
	@keyframes tas-ring-pulse {
		0%, 100% { stroke-opacity: 0.95; }
		50% { stroke-opacity: 0.35; }
	}
	@media (prefers-reduced-motion: reduce) {
		:global(.tas-selected-ring) {
			animation: none;
		}
	}
	:global(.leaflet-interactive:focus-visible) {
		outline: 2px solid var(--color-accent);
		outline-offset: 2px;
	}
</style>
