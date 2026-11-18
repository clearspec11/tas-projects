import { Route, Hospital, GraduationCap, Zap, House, Leaf, Users, Shapes } from '@lucide/svelte';
import type { ProjectCategory } from './types';

// One Lucide glyph per project category. Native <select> options stay text-only
// (you can't drop a component into an <option>); these render wherever a category
// appears in real markup — list rows, the detail header, future legends.
export const CATEGORY_ICONS: Record<ProjectCategory, typeof Route> = {
	transport: Route,
	health: Hospital,
	education: GraduationCap,
	utilities: Zap,
	housing: House,
	environment: Leaf,
	community: Users,
	other: Shapes
};

// Inline SVG flag (Lucide `flag`) for contexts that take an HTML string rather
// than a component — chiefly the Leaflet tooltip, which is built from raw HTML.
export const FLAG_SVG_DANGER =
	'<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#ef4444" ' +
	'stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" ' +
	'style="display:inline-block;vertical-align:-1px;margin-right:2px">' +
	'<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/>' +
	'<line x1="4" x2="4" y1="22" y2="15"/></svg>';
