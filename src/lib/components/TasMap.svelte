<script lang="ts">
	import { onMount } from 'svelte';
	import {
		projects, selectedProject, filterCategory, filterStatus,
		filterFunding, filterGovernmentLevel, searchQuery, timelineRange, showHeatmap,
		showConnections, mapStyle
	} from '$lib/stores';
	import { STATUS_CONFIG, CATEGORY_CONFIG, FUNDING_CONFIG, GOVERNMENT_LEVEL_CONFIG, type Project } from '$lib/types';
	import { TASMANIA_CENTER, TASMANIA_ZOOM } from '$lib/tasmania-geo';
	import tasmaniaGeoJson from '$lib/tasmania-boundary.json';

	let mapContainer: HTMLDivElement;
	let map: any;
	let markersLayer: any;
	let heatLayer: any;
	let connectionsLayer: any;
	let darkTiles: any;
	let satTiles: any;
	let L: any;

	function formatCurrency(n: number): string {
		if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(1)}B`;
		if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(0)}M`;
		return `$${(n / 1_000).toFixed(0)}K`;
	}

	function budgetPercent(p: Project): number {
		return Math.round((p.spent / p.budget) * 100);
	}

	function getFilteredProjects(
		all: Project[], cat: string, status: string, funding: string,
		govLevel: string, query: string, range: [number, number]
	): Project[] {
		return all.filter((p) => {
			if (cat !== 'all' && p.category !== cat) return false;
			if (status !== 'all' && p.status !== status) return false;
			if (funding !== 'all' && p.funding_type !== funding) return false;
			if (govLevel !== 'all' && p.government_level !== govLevel) return false;
			if (query && !p.name.toLowerCase().includes(query.toLowerCase())) return false;
			const startYear = new Date(p.start_date).getFullYear();
			if (startYear < range[0] || startYear > range[1]) return false;
			return true;
		});
	}

	function createMarker(p: Project) {
		const cfg = STATUS_CONFIG[p.status];
		const fundCfg = FUNDING_CONFIG[p.funding_type];
		const catCfg = CATEGORY_CONFIG[p.category];

		const govCfg = GOVERNMENT_LEVEL_CONFIG[p.government_level];

		const marker = L.circleMarker([p.lat, p.lng], {
			radius: Math.max(8, Math.min(20, Math.sqrt(p.budget / 1_000_000) * 1.8)),
			fillColor: cfg.color,
			fillOpacity: 0.8,
			color: govCfg.color,
			weight: 2.5,
			opacity: 0.9,
			dashArray: fundCfg.dashArray
		});

		// Hover tooltip
		marker.bindTooltip(`
			<div style="font-family: Inter, system-ui; font-size: 12px; line-height: 1.4;">
				<strong>${p.name}</strong><br/>
				<span style="color: ${cfg.color};">${cfg.label}</span> · ${fundCfg.shortLabel}<br/>
				${formatCurrency(p.spent)} / ${formatCurrency(p.budget)} (${budgetPercent(p)}%)
			</div>
		`, {
			direction: 'top',
			offset: [0, -10],
			className: 'tas-tooltip'
		});

		marker.on('click', () => selectedProject.set(p));

		return marker;
	}

	function updateMap(
		all: Project[], cat: string, status: string, funding: string,
		govLevel: string, query: string, range: [number, number], heatmap: boolean,
		connections: boolean
	) {
		if (!markersLayer || !L) return;
		markersLayer.clearLayers();
		if (heatLayer) map.removeLayer(heatLayer);
		if (connectionsLayer) connectionsLayer.clearLayers();

		const filtered = getFilteredProjects(all, cat, status, funding, govLevel, query, range);

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
							color:#f1f5f9;font-weight:700;font-size:13px;font-family:Inter,system-ui;
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
			mapStyle.subscribe((s) => switchTiles(s))
		];

		return () => {
			unsubs.forEach((u) => u());
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
</style>
