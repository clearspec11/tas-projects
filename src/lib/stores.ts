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
