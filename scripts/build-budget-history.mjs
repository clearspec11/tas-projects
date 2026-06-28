// Builds budget_history trails for the app's state-tier projects from the
// Tasmanian Budget Papers (BP1 Chapter 6 — Infrastructure Investment).
//
// The HTML chapter pages exist for 2019-20 through 2023-24. The 2024-25 and
// 2025-26 papers are PDF-only, so the newest figures are hand-added elsewhere.
//
// Modes:
//   node scripts/build-budget-history.mjs --dump        List every infra row
//                                                       (name + Estimated Total
//                                                       Cost) per budget year,
//                                                       to author the match map.
//   node scripts/build-budget-history.mjs               Match the MATCH config
//                                                       and write
//                                                       scripts/budget-history.json
//                                                       plus a match report.
//
// Source data: Tasmanian Government, CC-BY — attribute the budget papers.

import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'node:fs';

const YEARS = [
	{ fy: '2019-20', dir: '2019' },
	{ fy: '2020-21', dir: '2020' },
	{ fy: '2021-22', dir: '2021' },
	{ fy: '2022-23', dir: '2022' },
	{ fy: '2023-24', dir: '2023' }
];

const CACHE = '.bp-tmp';
const SOURCE_URL = (y) =>
	`https://www.treasury.tas.gov.au/BudgetPapersHTML/Budget${y.dir}/BP1/${y.fy}-BP1-6-Infrastructure-Investment.htm`;
const LATEST_SOURCE = SOURCE_URL(YEARS[YEARS.length - 1]);

// id → { aliases } for the app's state-tier projects. `aliases` are matched as
// substrings of the paper's (lower-cased, footnote-stripped) project-name cell.
//
// Only projects that map cleanly onto a SINGLE BP1 line item are listed. Loose
// matching across the whole table produces false trails (e.g. mixing LGH Stage 1
// and Stage 2, or catching "Devonport High" for "Devonport Living City"), so the
// rest of the app's projects are verified by hand or left illustrative. Use
// `--dump` to inspect the raw rows before adding a project here. Aliases must be
// specific enough to select one line item, not a family of them.
const MATCH = [
	{ id: '1', aliases: ['new bridgewater bridge'] },
	{ id: '3', aliases: ['launceston general hospital redevelopment - stage 2'] },
	{ id: '4', aliases: ['cradle mountain experience'] }
];

function getHtml(year) {
	if (!existsSync(CACHE)) mkdirSync(CACHE);
	const path = `${CACHE}/${year.fy}.htm`;
	if (existsSync(path)) return Promise.resolve(readFileSync(path, 'utf8'));
	return fetch(SOURCE_URL(year)).then((res) => {
		if (!res.ok) return null;
		return res.text().then((html) => {
			writeFileSync(path, html);
			return html;
		});
	});
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

// Strip a trailing run of footnote markers ("Bridge 1,2,3,7" -> "Bridge").
const cleanName = (c) => c.replace(/[\s,0-9]+$/, '').trim().toLowerCase();

// Estimated Total Cost is the cell immediately after the two consecutive
// start/complete year cells, regardless of any leading New/Existing column.
function estimatedTotalCost(cells) {
	for (let i = 1; i < cells.length - 1; i++) {
		if (isYear(cells[i]) && isYear(cells[i + 1])) {
			return { etc: toDollars(cells[i + 2]), start: cells[i], complete: cells[i + 1] };
		}
	}
	return null;
}

// Pull every (name, etc, start, complete) infra row from one year's HTML.
async function rowsFor(year) {
	const html = await getHtml(year);
	if (!html) return null;
	const out = [];
	for (const row of html.split(/<tr[ >]/i)) {
		const cells = cellsOf(row);
		if (cells.length < 4 || !cells[0]) continue;
		const etc = estimatedTotalCost(cells);
		if (!etc?.etc) continue;
		out.push({ name: cells[0], clean: cleanName(cells[0]), ...etc });
	}
	return out;
}

const mode = process.argv[2];

if (mode === '--dump') {
	for (const year of YEARS) {
		const rows = await rowsFor(year);
		console.log(`\n===== ${year.fy} =====`);
		if (!rows) {
			console.log('(no page)');
			continue;
		}
		for (const r of rows) {
			console.log(`  $${(r.etc / 1e6).toFixed(1).padStart(7)}M  ${r.start}->${r.complete}  ${r.name}`);
		}
	}
	process.exit(0);
}

// Match mode: build a budget_history per configured project.
const result = [];
const report = [];
for (const cfg of MATCH) {
	const history = [];
	const matchedNames = new Set();
	for (const year of YEARS) {
		const rows = await rowsFor(year);
		if (!rows) continue;
		// Largest ETC among rows whose cleaned name contains any alias.
		let best = null;
		for (const r of rows) {
			if (!cfg.aliases.some((a) => r.clean.includes(a))) continue;
			matchedNames.add(r.name);
			if (!best || r.etc > best) best = r.etc;
		}
		if (best != null) history.push({ fiscal_year: year.fy, estimated_total_cost: best });
	}
	if (history.length) {
		const original = history[0].estimated_total_cost;
		const current = history[history.length - 1].estimated_total_cost;
		result.push({ id: cfg.id, original_budget: original, budget: current, budget_history: history, source_url: LATEST_SOURCE });
		report.push(`id ${cfg.id}: ${history.length}yr  ${(original / 1e6).toFixed(0)}M -> ${(current / 1e6).toFixed(0)}M  [${[...matchedNames].join(' | ')}]`);
	} else {
		report.push(`id ${cfg.id}: NO MATCH (aliases: ${cfg.aliases.join(', ')})`);
	}
}

writeFileSync('scripts/budget-history.json', JSON.stringify(result, null, '\t') + '\n');
console.log('Match report:');
for (const line of report) console.log('  ' + line);
console.log(`\nWrote scripts/budget-history.json (${result.length} projects with history).`);
