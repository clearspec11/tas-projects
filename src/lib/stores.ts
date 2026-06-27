import { writable } from 'svelte/store';
import type { Project, ProjectCategory, ProjectStatus, FundingType, GovernmentLevel } from './types';
import type { SortKey } from './metrics';

export const projects = writable<Project[]>([]);
export const selectedProject = writable<Project | null>(null);
export const filterCategory = writable<ProjectCategory | 'all'>('all');
export const filterStatus = writable<ProjectStatus | 'all'>('all');
export const filterFunding = writable<FundingType | 'all'>('all');
export const filterGovernmentLevel = writable<GovernmentLevel | 'all'>('all');
export const filterFlagged = writable(false);
// Set from the contractor scorecard, not the filter UI; shown as a dismissible chip
export const filterContractor = writable<string | null>(null);
export const searchQuery = writable('');
export const sortKey = writable<SortKey>('variance');
export const timelineRange = writable<[number, number]>([2008, 2036]);
export const showHeatmap = writable(false);
export const showConnections = writable(false);
export const mapStyle = writable<'dark' | 'satellite'>('dark');
// Current Leaflet zoom level, mirrored so overlays can react (e.g. the sea
// readout fades as the user zooms past the whole-island view).
export const mapZoom = writable<number>(7);
// Mobile-only: which full-height view is showing (ignored at md+)
export const mobileView = writable<'map' | 'list'>('map');
// Desktop sidebar slide state — shared so map controls can offset themselves
export const sidebarOpen = writable(false);
// Screen position (px, relative to the map container) of the Bass Strait sea
// anchor, projected by Leaflet each move/zoom so the overrun readout stays
// pinned to open water instead of floating over the island. `shown` is false
// during the zoom animation and when zoomed in past the whole-island view.
export const seaAnchor = writable<{ x: number; y: number; shown: boolean }>({
	x: 0,
	y: 0,
	shown: false
});
