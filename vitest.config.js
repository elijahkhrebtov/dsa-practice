import path from 'node:path';
import { defineConfig } from 'vitest/config';

/**
 * When DSA_SOLUTION=1 (set by `npm run solution` / `npm run verify`), every
 * test's `import ... from './problem.js'` is redirected to the sibling
 * `solution.js`, so the same tests run against the reference solution.
 */
function useReferenceSolution() {
  return {
    name: 'dsa-use-reference-solution',
    enforce: /** @type {const} */ ('pre'),
    resolveId(source, importer) {
      if (process.env.DSA_SOLUTION !== '1' || !importer) return null;
      const importerPath = importer.split('?')[0];
      if (importerPath.endsWith('.test.js') && /^\.\/problem\.js$/.test(source)) {
        return path.join(path.dirname(importerPath), 'solution.js');
      }
      return null;
    },
  };
}

const reporters = ['tree'];
// `npm run solve` / `npm run watch` set DSA_TRACK=1 so results land in progress.json + INDEX.md.
if (process.env.DSA_TRACK === '1') reporters.push('./scripts/progress-reporter.js');

export default defineConfig({
  plugins: [useReferenceSolution()],
  test: {
    include: ['problems/**/*.test.js'],
    reporters,
    testTimeout: 30_000,
    // Only diff the first lines of a failed comparison. Without this, a wrong
    // answer on a 100k-element performance input makes Vitest spend minutes
    // computing a diff before it reports the failure.
    diff: { truncateThreshold: 500 },
    // The transformed-module cache doesn't know about the redirect above, so
    // keep a separate cache per mode (otherwise one mode reuses the other's imports).
    fsModuleCachePath: process.env.DSA_SOLUTION === '1' ? 'node_modules/.vitest-cache-solution' : 'node_modules/.vitest-cache',
  },
});
