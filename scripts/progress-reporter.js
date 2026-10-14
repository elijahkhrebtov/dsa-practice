/**
 * Vitest reporter that records each problem's result in progress.json and
 * regenerates INDEX.md. Enabled only for `npm run solve` / `npm run watch`
 * (via DSA_TRACK=1 in vitest.config.js), so whole-suite runs never touch
 * your progress.
 *
 *   all tests pass  → ✅ completed
 *   anything fails  → 🟨 attempted
 */
import path from 'node:path';
import { loadProblems, problemForFile, readProgress, writeProgress, recordRun } from './lib/problems.js';
import { writeIndex } from './lib/index-md.js';

export default class ProgressReporter {
  /**
   * Called by Vitest after every run (including each re-run in watch mode).
   *
   * @param {ReadonlyArray<import('vitest/node').TestModule>} testModules
   * @param {ReadonlyArray<unknown>} unhandledErrors
   * @param {'passed' | 'interrupted' | 'failed'} reason
   */
  onTestRunEnd(testModules, unhandledErrors, reason) {
    if (reason === 'interrupted') return;

    const problems = loadProblems();
    const progress = readProgress();
    const results = [];

    for (const mod of testModules) {
      const problem = problemForFile(problems, mod.moduleId);
      if (!problem) continue;
      const state = mod.state();
      if (state === 'skipped' || state === 'pending' || state === 'queued') continue;
      const passed = state === 'passed' && unhandledErrors.length === 0;
      recordRun(progress, problem.slug, passed);
      results.push({ problem, passed });
    }

    if (results.length === 0) return;
    writeProgress(progress);
    writeIndex();

    for (const { problem, passed } of results) {
      if (passed) {
        console.log(`\n✅ ${problem.title} — completed! Marked ✅ in INDEX.md.`);
        console.log(`   Compare with the reference: ${problem.relDir}/solution.js\n`);
      } else {
        console.log(`\n🟨 ${problem.title} — not passing yet. Marked 🟨 attempted in INDEX.md.`);
        if (problem.hints.length) {
          const hints = problem.hints.map((h) => path.posix.join(problem.relDir, h)).join('  ·  ');
          console.log(`   Stuck? Hints: ${hints}\n`);
        }
      }
    }
  }
}
