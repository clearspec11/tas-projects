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
export const searchQuery = writable('');
export const sortKey = writable<SortKey>('variance');
export const timelineRange = writable<[number, number]>([2017, 2036]);
export const showHeatmap = writable(false);
export const showConnections = writable(false);
export const mapStyle = writable<'dark' | 'satellite'>('dark');
