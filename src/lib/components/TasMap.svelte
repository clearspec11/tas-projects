<script lang="ts">
	import { onMount } from 'svelte';
	import {
		projects, selectedProject, filterCategory, filterStatus,
		filterFunding, filterGovernmentLevel, filterFlagged, filterContractor, searchQuery, timelineRange, showHeatmap,
		showConnections, mapStyle, mapZoom, seaOverlayPos
	} from '$lib/stores';
	import { STATUS_CONFIG, CATEGORY_CONFIG, FUNDING_CONFIG, GOVERNMENT_LEVEL_CONFIG, type Project } from '$lib/types';
	import { TASMANIA_CENTER, TASMANIA_ZOOM } from '$lib/tasmania-geo';
	import { formatCurrency, budgetPercent, filterProjects, isRedFlag, delayMonths } from '$lib/metrics';
	import { FLAG_SVG_DANGER } from '$lib/icons';
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

		// Two codes on the mark (status fill, tier border) plus the flag halo;
		// funding/delivery model lives in the tooltip, chips and detail panel.
		const marker = L.circleMarker([p.lat, p.lng], {
			radius: markerRadius(p),
			fillColor: cfg.color,
			fillOpacity: 0.8,
			color: govCfg.color,
			weight: 2.5,
			opacity: 0.9
		});

		// Hover tooltip
		marker.bindTooltip(`
			<div style="font-family: 'IBM Plex Sans', system-ui; font-size: 12px; line-height: 1.4;">
				<strong>${isRedFlag(p) ? FLAG_SVG_DANGER : ''}${p.name}</strong><br/>
				<span style="color: ${cfg.color};">${cfg.label}</span> · ${govCfg.shortLabel} · ${fundCfg.shortLabel}<br/>
				${formatCurrency(p.spent)} / ${formatCurrency(p.budget)} (${budgetPercent(p)}%)${late ? ` · <span style="color:#f59e0b;">${late}mo late</span>` : ''}
			</div>
		`, {
			direction: 'top',
			offset: [0, -10],
			className: 'tas-tooltip'
		});

		// Tapping/clicking a marker opens the themed detail panel — the single
		// affordance. (No bindPopup: the old white popup duplicated the panel
		// and clashed with the dark theme, badly on mobile.)
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
		connections: boolean, flagged: boolean
	) {
		if (!markersLayer || !L) return;
		markersLayer.clearLayers();
		if (flagsLayer) flagsLayer.clearLayers();
		if (heatLayer) map.removeLayer(heatLayer);
		if (connectionsLayer) connectionsLayer.clearLayers();

		const filtered = filterProjects(all, {
			category: cat as any, status: status as any, funding: funding as any,
			governmentLevel: govLevel as any, query, range,
			flaggedOnly: flagged, contractor: $filterContractor
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

		// Mirror zoom so the sea overlay can fade past the whole-island view.
		mapZoom.set(map.getZoom());
		map.on('zoomend', () => mapZoom.set(map.getZoom()));

		// Anchor the sea readout to a fixed open-water coordinate in Bass Strait
		// (NW of Tasmania) so it pans and zooms with the map instead of floating
		// over the screen. Recompute its container-pixel position on every move.
		const SEA_POINT: [number, number] = [-39.55, 144.4];
		const updateSeaPos = () => {
			if (!map) return;
			const pt = map.latLngToContainerPoint(SEA_POINT);
			seaOverlayPos.set({ x: pt.x, y: pt.y });
		};
		map.on('move zoom viewreset resize', updateSeaPos);
		updateSeaPos();

		darkTiles = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
			attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
			subdomains: 'abcd'
		}).addTo(map);

		satTiles = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
			attribution: '&copy; Esri'
		});

		// Luminous coastline: a wide soft glow under a thin bright stroke,
		// so the island reads as a lit shoreline rather than a CAD outline.
		L.geoJSON(tasmaniaGeoJson, {
			style: {
				color: '#2dd4bf',
				weight: 7,
				opacity: 0.14,
				fillColor: '#2dd4bf',
				fillOpacity: 0.05
			}
		}).addTo(map);
		L.geoJSON(tasmaniaGeoJson, {
			style: {
				color: '#7ee8da',
				weight: 1.25,
				opacity: 0.85,
				fill: false
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
			updateMap($projects, $filterCategory, $filterStatus, $filterFunding, $filterGovernmentLevel, $searchQuery, $timelineRange, $showHeatmap, $showConnections, $filterFlagged);
		}

		const unsubs = [
			projects.subscribe(redraw),
			filterCategory.subscribe(redraw),
			filterStatus.subscribe(redraw),
			filterFunding.subscribe(redraw),
			filterGovernmentLevel.subscribe(redraw),
			filterFlagged.subscribe(redraw),
			filterContractor.subscribe(redraw),
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

<div class="relative w-full h-full">
	<div bind:this={mapContainer} class="w-full h-full"></div>
	<!-- Aurora australis over the Southern Ocean: atmosphere, not data -->
	<div class="tas-aurora" aria-hidden="true"></div>
</div>

<style>
	.tas-aurora {
		position: absolute;
		inset: auto 0 0 0;
		height: 42%;
		pointer-events: none;
		z-index: 1;
		background:
			radial-gradient(120% 90% at 35% 115%, rgba(45, 212, 191, 0.10), transparent 55%),
			radial-gradient(90% 80% at 70% 120%, rgba(74, 222, 128, 0.07), transparent 50%),
			radial-gradient(70% 60% at 55% 125%, rgba(167, 139, 250, 0.05), transparent 55%);
		animation: tas-aurora-breathe 26s ease-in-out infinite;
	}
	@keyframes tas-aurora-breathe {
		0%, 100% { opacity: 0.65; }
		50% { opacity: 1; }
	}
	@media (prefers-reduced-motion: reduce) {
		.tas-aurora {
			animation: none;
		}
	}
	:global(.tas-tooltip) {
		background: rgba(10, 24, 29, 0.95) !important;
		color: #eef6f6 !important;
		border: 1px solid #22424c !important;
		border-radius: 8px !important;
		padding: 8px 12px !important;
		box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important;
	}
	:global(.tas-tooltip::before) {
		border-top-color: rgba(10, 24, 29, 0.95) !important;
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
