#!/usr/bin/env node
/**
 * Runs the tests of a single problem and records the result in progress.json
 * and INDEX.md.
 *
 *   npm run solve <problem>       run once (status: attempted / completed)
 *   npm run watch <problem>       re-run on every save, status updated each run
 *   npm run solution <problem>    run the tests against the reference solution (no tracking)
 *   npm run verify                run every problem's tests against its reference solution
 *   npm run solve                 show progress and suggest what to do next
 *
 * <problem> can be a slug ("two-sum"), "topic/slug", a folder path, a path to
 * any file inside the problem folder, or a unique part of the name.
 */
import { spawn } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';
import { ROOT, loadProblems, findProblems } from './lib/problems.js';
import { writeIndex } from './lib/index-md.js';

const args = process.argv.slice(2);
const flags = new Set(args.filter((a) => a.startsWith('--')));
const positional = args.filter((a) => !a.startsWith('--'));

const watch = flags.has('--watch');
const useSolution = flags.has('--solution');
const all = flags.has('--all');

const problems = loadProblems();
const vitestBin = path.join(ROOT, 'node_modules', 'vitest', 'vitest.mjs');

if (!fs.existsSync(vitestBin)) {
  console.error('Vitest is not installed. Run `npm install` first.');
  process.exit(1);
}

/**
 * @param {string[]} filters - Test file paths relative to the repo root (empty = all).
 * @param {Record<string, string>} env - Extra environment variables.
 */
function runVitest(filters, env) {
  const child = spawn(process.execPath, [vitestBin, watch ? 'watch' : 'run', ...filters], {
    cwd: ROOT,
    stdio: 'inherit',
    env: { ...process.env, ...env },
  });
  child.on('exit', (code, signal) => process.exit(signal ? 1 : (code ?? 1)));
}

if (all) {
  // Whole-suite runs never touch progress — they'd flood it with "attempted".
  runVitest([], useSolution ? { DSA_SOLUTION: '1' } : {});
} else if (positional.length === 0) {
  printOverview();
} else {
  const query = positional.join(' ');
  const matches = findProblems(problems, query);

  if (matches.length === 0) {
    console.error(`No problem matches "${query}". Try a slug like "two-sum" — see INDEX.md for the full list.`);
    process.exit(1);
  }
  if (matches.length > 1) {
    console.error(`"${query}" matches ${matches.length} problems — be more specific:\n`);
    for (const p of matches.slice(0, 20)) console.error(`  npm run solve ${p.slug.padEnd(48)} ${p.difficulty.padEnd(6)}  ${p.title}`);
    if (matches.length > 20) console.error(`  … and ${matches.length - 20} more`);
    process.exit(1);
  }

  const problem = matches[0];
  if (!problem.hasTests) {
    console.error(`${problem.relDir} has no problem.test.js.`);
    process.exit(1);
  }

  const mode = useSolution ? '  (reference solution)' : watch ? '  (watch mode — Ctrl+C to stop)' : '';
  console.log(`\n▶ ${problem.title}  ·  ${problem.difficulty}  ·  ${problem.relDir}${mode}\n`);

  runVitest([`${problem.relDir}/problem.test.js`], useSolution ? { DSA_SOLUTION: '1' } : { DSA_TRACK: '1' });
}

function printOverview() {
  const { progress } = writeIndex();
  const statusOf = (p) => progress[p.slug]?.status ?? 'todo';
  const done = problems.filter((p) => statusOf(p) === 'completed').length;
  const attempted = problems.filter((p) => statusOf(p) === 'attempted');

  console.log(`\nDSA Practice — ${done} / ${problems.length} completed, ${attempted.length} attempted. Full list: INDEX.md\n`);
  console.log('Usage:');
  console.log('  npm run solve <problem>      run the tests for a problem (updates INDEX.md)');
  console.log('  npm run watch <problem>      re-run the tests on every save');
  console.log('  npm run solution <problem>   run the tests against the reference solution');
  console.log('  npm run index                rebuild INDEX.md\n');

  if (attempted.length > 0) {
    console.log('In progress:');
    for (const p of attempted.slice(0, 5)) console.log(`  npm run solve ${p.slug}`);
    console.log('');
  }
  const next = problems.find((p) => statusOf(p) === 'todo');
  if (next) console.log(`Next up: ${next.title} (${next.difficulty}) → ${next.relDir}/problem.js\n  npm run solve ${next.slug}\n`);
}
