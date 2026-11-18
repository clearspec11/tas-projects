// Extracts a project's "Estimated Total Cost" across Tasmanian Budget Papers
// (BP1 Chapter 6 — Infrastructure Investment) to build a budget_history trail.
//
// Usage:
//   node scripts/scrape-budget-papers.mjs "Bridgewater"
//   node scripts/scrape-budget-papers.mjs "Royal Hobart Hospital"
//
// Prints the matching Table 6.3 rows per budget year and a budget_history JSON
// array. Figures are in $m in the papers; output is scaled to whole dollars.
// Source data: Tasmanian Government, CC-BY — attribute the budget papers.

import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'node:fs';

const YEARS = [
	{ fy: '2019-20', dir: '2019' },
	{ fy: '2020-21', dir: '2020' },
	{ fy: '2021-22', dir: '2021' },
	{ fy: '2022-23', dir: '2022' },
	{ fy: '2023-24', dir: '2023' },
	{ fy: '2024-25', dir: '2024' }
];

const CACHE = '.bp-tmp';

function url({ fy, dir }) {
	return `https://www.treasury.tas.gov.au/BudgetPapersHTML/Budget${dir}/BP1/${fy}-BP1-6-Infrastructure-Investment.htm`;
}

async function getHtml(year) {
	if (!existsSync(CACHE)) mkdirSync(CACHE);
	const path = `${CACHE}/${year.fy}.htm`;
	if (existsSync(path)) return readFileSync(path, 'utf8');
	const res = await fetch(url(year));
	if (!res.ok) return null;
	const html = await res.text();
	writeFileSync(path, html);
	return html;
}

function cellsOf(rowHtml) {
	return [...rowHtml.matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)].map((m) =>
		m[1]
			.replace(/<[^>]+>/g, ' ')
			.replace(/&#?[a-z0-9]+;/gi, ' ')
			.replace(/\s+/g, ' ')
			.trim()
	);
}

const isYear = (c) => /^(19|20)\d\d$/.test(c);
const toDollars = (c) => {
	const n = parseFloat(c.replace(/[^0-9.]/g, ''));
	return Number.isFinite(n) ? Math.round(n * 1_000_000) : null;
};

// Estimated Total Cost is the cell immediately after the two consecutive
// start/complete year cells, regardless of whether a New/Existing column exists.
function estimatedTotalCost(cells) {
	for (let i = 1; i < cells.length - 1; i++) {
		if (isYear(cells[i]) && isYear(cells[i + 1])) {
			return { etc: toDollars(cells[i + 2]), start: cells[i], complete: cells[i + 1] };
		}
	}
	return null;
}

const needle = (process.argv[2] || 'Bridgewater').toLowerCase();

const history = [];
for (const year of YEARS) {
	const html = await getHtml(year);
	if (!html) {
		console.log(`${year.fy}: (no page)`);
		continue;
	}
	for (const row of html.split(/<tr[ >]/i)) {
		const cells = cellsOf(row);
		if (cells.length < 4) continue;
		if (!cells[0].toLowerCase().includes(needle)) continue;
		const etc = estimatedTotalCost(cells);
		if (!etc?.etc) continue;
		console.log(`${year.fy}: ${cells[0]} — $${(etc.etc / 1e6).toFixed(1)}M (start ${etc.start}, complete ${etc.complete})`);
		// keep the largest match per year (sub-rows sometimes repeat the project)
		const existing = history.find((h) => h.fiscal_year === year.fy);
		if (!existing) history.push({ fiscal_year: year.fy, estimated_total_cost: etc.etc });
		else existing.estimated_total_cost = Math.max(existing.estimated_total_cost, etc.etc);
	}
}

console.log('\nbudget_history:');
console.log(JSON.stringify(history));
