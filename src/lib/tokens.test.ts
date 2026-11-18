import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { TOKENS } from './tokens';
import { STATUS_CONFIG, GOVERNMENT_LEVEL_CONFIG, FUNDER_CONFIG } from './types';

const kebab = (s: string) => s.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);

// DESIGN.md says ink/muted; the stylesheet calls the same two roles text/text-muted.
const CSS_NAME: Record<string, string> = { ink: 'text', muted: 'text-muted' };

const design = readFileSync('DESIGN.md', 'utf8');
const css = readFileSync('src/app.css', 'utf8');

describe('colour tokens', () => {
	it.each(Object.entries(TOKENS))('%s matches DESIGN.md', (name, hex) => {
		const m = design.match(new RegExp(`^  ${kebab(name)}: "(#[0-9a-f]{6})"$`, 'm'));
		expect(m?.[1]).toBe(hex);
	});

	it.each(Object.entries(TOKENS))('%s matches app.css', (name, hex) => {
		const prop = `--color-${CSS_NAME[name] ?? kebab(name)}`;
		const m = css.match(new RegExp(`${prop}: (#[0-9a-f]{6});`));
		expect(m?.[1]).toBe(hex);
	});

	it('status, tier and funder configs read from the tokens', () => {
		expect(STATUS_CONFIG.on_budget.color).toBe(TOKENS.statusOnBudget);
		expect(STATUS_CONFIG.over_budget.color).toBe(TOKENS.statusOverBudget);
		expect(STATUS_CONFIG.under_budget.color).toBe(TOKENS.statusUnderBudget);
		expect(STATUS_CONFIG.completed.color).toBe(TOKENS.statusCompleted);
		expect(STATUS_CONFIG.cancelled.color).toBe(TOKENS.statusCancelled);
		expect(GOVERNMENT_LEVEL_CONFIG.federal.color).toBe(TOKENS.tierFederal);
		expect(GOVERNMENT_LEVEL_CONFIG.state.color).toBe(TOKENS.tierState);
		expect(GOVERNMENT_LEVEL_CONFIG.local.color).toBe(TOKENS.tierLocal);
		expect(FUNDER_CONFIG.private.color).toBe(TOKENS.fundPrivate);
	});
});
