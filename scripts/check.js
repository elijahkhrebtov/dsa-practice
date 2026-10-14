#!/usr/bin/env node
/**
 * Structural lint for the problem collection (for maintainers / agents).
 *   npm run check
 *
 * Verifies that every problem folder has the expected files and that the
 * problem.js header, run commands and patterns follow the conventions in
 * AGENTS.md. Pair it with `npm run verify` (tests vs. reference solutions).
 */
import fs from 'node:fs';
import path from 'node:path';
import { PROBLEMS_DIR, loadProblems, parseHeader } from './lib/problems.js';
import { PATTERNS } from './lib/patterns.js';

const problems = loadProblems();
const errors = [];
const err = (p, msg) => errors.push(`${p.relDir}: ${msg}`);

const seen = new Map();
for (const p of problems) {
  if (seen.has(p.slug)) err(p, `duplicate slug "${p.slug}" (also ${seen.get(p.slug)})`);
  seen.set(p.slug, p.relDir);

  const src = fs.readFileSync(path.join(p.dir, 'problem.js'), 'utf8');
  if (!/^\s*\*\s*Title:/m.test(src)) err(p, 'missing "Title:" header line');
  if (!['Easy', 'Medium', 'Hard'].includes(p.difficulty)) err(p, `bad Difficulty "${p.difficulty}"`);
  if (p.patterns.length === 0) err(p, 'missing "Patterns:" header line');
  for (const pat of p.patterns) if (!PATTERNS.includes(pat)) err(p, `unknown pattern "${pat}" (see scripts/lib/patterns.js)`);
  if (!src.includes(`// ▶ Run tests:   npm run solve ${p.slug}\n`)) err(p, `missing "// ▶ Run tests:   npm run solve ${p.slug}" line`);
  if (!src.includes(`// ⟳ Watch mode:  npm run watch ${p.slug}\n`)) err(p, `missing "// ⟳ Watch mode:  npm run watch ${p.slug}" line`);
  if (!/@returns/.test(src)) err(p, 'no @returns in JSDoc');
  if (!/^export (function|class) /m.test(src)) err(p, 'no exported function/class');
  if (!p.hasTests) err(p, 'missing problem.test.js');
  if (!p.hasSolution) err(p, 'missing solution.js');
  if (p.hints.length < 1 || p.hints.length > 3) err(p, `expected 1-3 hint files, found ${p.hints.length}`);
  p.hints.forEach((h, i) => {
    if (h !== `hint-${i + 1}.md`) err(p, `hint files must be hint-1.md … hint-N.md without gaps (found ${h})`);
  });

  if (p.hasTests) {
    const test = fs.readFileSync(path.join(p.dir, 'problem.test.js'), 'utf8');
    if (!test.includes("from './problem.js'")) err(p, "problem.test.js must import from './problem.js'");
    if (test.includes('solution.js')) err(p, 'problem.test.js must not import solution.js');
  }

  if (p.hasSolution) {
    const sol = fs.readFileSync(path.join(p.dir, 'solution.js'), 'utf8');
    const exportsOf = (s) => [...s.matchAll(/^export (?:function|class) (\w+)/gm)].map((m) => m[1]).sort().join(',');
    if (exportsOf(sol) !== exportsOf(src)) err(p, `solution.js exports (${exportsOf(sol)}) differ from problem.js (${exportsOf(src)})`);
    if (!/Complexity/i.test(sol)) err(p, 'solution.js explanation should include a Complexity section');
    const a = parseHeader(src);
    const b = parseHeader(sol);
    if (a.title !== b.title || a.difficulty !== b.difficulty || a.patterns.join() !== b.patterns.join()) {
      err(p, 'solution.js must start with the same Title/Difficulty/Patterns lines as problem.js');
    }
  }
}

for (const topic of fs.readdirSync(PROBLEMS_DIR)) {
  const dir = path.join(PROBLEMS_DIR, topic);
  if (fs.statSync(dir).isDirectory() && !fs.existsSync(path.join(dir, 'README.md'))) {
    errors.push(`problems/${topic}: missing topic README.md`);
  }
}

if (errors.length) {
  console.error(errors.map((e) => `✗ ${e}`).join('\n'));
  console.error(`\n${errors.length} problem(s) found across ${problems.length} problems.`);
  process.exit(1);
}
const byDiff = (d) => problems.filter((p) => p.difficulty === d).length;
console.log(`✓ ${problems.length} problems look good (Easy ${byDiff('Easy')} · Medium ${byDiff('Medium')} · Hard ${byDiff('Hard')}).`);
