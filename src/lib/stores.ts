import { derived, writable } from 'svelte/store';
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

// --- Map lanes -------------------------------------------------------------
// The map page floats several panels over the map. Rather than each one
// guessing where the others are, they all read the same picture: how wide the
// window is, which side panels are showing, and so how much open map is left.
// Widths are in rem so they track the panels' own rem-based sizes.
export const PANEL_REM = 24; // projects panel
export const DETAIL_LANE_REM = 25; // project detail panel plus its 1rem margin
export const MD_REM = 48;
const ROOMY_REM = 75;

// Window width in rem. Starts at a desktop width so the prerendered page lays
// out as desktop; the map page sets the real value once it mounts.
export const viewportRem = writable(90);

// Desktop widths too narrow to hold the projects panel, a usable strip of map
// and the detail panel side by side.
export const tightDesktop = derived(viewportRem, ($w) => $w >= MD_REM && $w < ROOMY_REM);

// What is actually on screen: at tight widths an open project takes the
// projects panel's place, and the panel comes back when the project closes.
export const sidebarShown = derived(
	[sidebarOpen, selectedProject, tightDesktop],
	([$open, $selected, $tight]) => $open && !($tight && $selected !== null)
);

// Open map between the side panels, in rem.
export const mapStripRem = derived(
	[viewportRem, sidebarShown, selectedProject],
	([$w, $shown, $selected]) =>
		$w - ($shown ? PANEL_REM : 0) - ($selected !== null && $w >= MD_REM ? DETAIL_LANE_REM : 0)
);

// The timeline sits centred in that strip. When the strip is narrower than the
// timeline it steps out until there is room again.
export const TIMELINE_REM = 22.5;
export const timelineFits = derived(
	[mapStripRem, viewportRem],
	([$strip, $w]) => $w >= MD_REM && $strip >= TIMELINE_REM + 2
);
