/**
 * Problem discovery and metadata parsing.
 *
 * Layout:  problems/<NN-topic>/<NN-slug>/problem.js
 * Topic title comes from the first "# " heading of problems/<NN-topic>/README.md.
 * Problem metadata comes from the header comment of problem.js:
 *
 *   * Title:      Two Sum
 *   * Difficulty: Easy
 *   * Patterns:   Hash Map, Sorting
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
export const PROBLEMS_DIR = path.join(ROOT, 'problems');
export const PROGRESS_FILE = path.join(ROOT, 'progress.json');
export const INDEX_FILE = path.join(ROOT, 'INDEX.md');

/**
 * @typedef {object} Problem
 * @property {string} slug        Folder name without the number prefix, e.g. "two-sum".
 * @property {string} title       Human title, e.g. "Two Sum".
 * @property {'Easy'|'Medium'|'Hard'} difficulty
 * @property {string[]} patterns  Pattern names (see patterns.js).
 * @property {string} topicDir    e.g. "03-hash-tables".
 * @property {string} topicTitle  e.g. "Hash Tables".
 * @property {number} number      Position within the topic (from the folder prefix).
 * @property {string} dir         Absolute path of the problem folder.
 * @property {string} relDir      Path relative to the repo root, with forward slashes.
 * @property {string[]} hints     Hint file names, sorted.
 * @property {boolean} hasSolution
 * @property {boolean} hasTests
 */

const stripPrefix = (name) => name.replace(/^\d+-/, '');
const prefixNumber = (name) => Number.parseInt(name, 10) || 0;

/**
 * @param {string} topicDir - Absolute topic folder path.
 * @returns {string} Topic title.
 */
function readTopicTitle(topicDir) {
  const readme = path.join(topicDir, 'README.md');
  if (fs.existsSync(readme)) {
    const heading = fs.readFileSync(readme, 'utf8').match(/^#\s+(.+)$/m);
    if (heading) return heading[1].trim();
  }
  return stripPrefix(path.basename(topicDir))
    .split('-')
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(' ');
}

/**
 * Reads `Title:`, `Difficulty:` and `Patterns:` from a problem.js header.
 *
 * @param {string} source - Contents of problem.js.
 * @returns {{ title?: string, difficulty?: string, patterns: string[] }}
 */
export function parseHeader(source) {
  const field = (name) => source.match(new RegExp(`^\\s*\\*\\s*${name}:\\s*(.+?)\\s*$`, 'm'))?.[1];
  const patterns = field('Patterns');
  return {
    title: field('Title'),
    difficulty: field('Difficulty'),
    patterns: patterns ? patterns.split(',').map((p) => p.trim()).filter(Boolean) : [],
  };
}

/**
 * Scans the problems folder.
 *
 * @returns {Problem[]} All problems, ordered by topic then number.
 */
export function loadProblems() {
  if (!fs.existsSync(PROBLEMS_DIR)) return [];
  const problems = [];
  const topics = fs
    .readdirSync(PROBLEMS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();

  for (const topic of topics) {
    const topicPath = path.join(PROBLEMS_DIR, topic);
    const topicTitle = readTopicTitle(topicPath);
    const folders = fs
      .readdirSync(topicPath, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name)
      .sort();

    for (const folder of folders) {
      const dir = path.join(topicPath, folder);
      const problemFile = path.join(dir, 'problem.js');
      if (!fs.existsSync(problemFile)) continue;
      const files = fs.readdirSync(dir);
      // problem.js is the user's file and its header might get mangled while
      // they work, so fall back to the identical header in solution.js.
      let header = parseHeader(fs.readFileSync(problemFile, 'utf8'));
      const solutionFile = path.join(dir, 'solution.js');
      if ((!header.title || !header.difficulty || header.patterns.length === 0) && fs.existsSync(solutionFile)) {
        const fallback = parseHeader(fs.readFileSync(solutionFile, 'utf8'));
        header = {
          title: header.title ?? fallback.title,
          difficulty: header.difficulty ?? fallback.difficulty,
          patterns: header.patterns.length ? header.patterns : fallback.patterns,
        };
      }
      problems.push({
        slug: stripPrefix(folder),
        title: header.title ?? stripPrefix(folder),
        difficulty: /** @type {any} */ (header.difficulty ?? 'Medium'),
        patterns: header.patterns,
        topicDir: topic,
        topicTitle,
        number: prefixNumber(folder),
        dir,
        relDir: path.relative(ROOT, dir).split(path.sep).join('/'),
        hints: files.filter((f) => /^hint-\d+\.md$/.test(f)).sort(),
        hasSolution: files.includes('solution.js'),
        hasTests: files.includes('problem.test.js'),
      });
    }
  }
  return problems;
}

/**
 * Finds the problem that owns a file path (e.g. a test file reported by Vitest).
 *
 * @param {Problem[]} problems - From `loadProblems()`.
 * @param {string} filePath - Absolute path of any file inside a problem folder.
 * @returns {Problem | undefined}
 */
export function problemForFile(problems, filePath) {
  const normalized = path.resolve(filePath.split('?')[0]);
  return problems.find((p) => normalized === p.dir || normalized.startsWith(p.dir + path.sep));
}

/**
 * Resolves a user query to problems. Accepts a slug ("two-sum"), a folder
 * name ("01-two-sum"), "topic/slug", a path to the folder or any file in it,
 * or a unique substring of the slug.
 *
 * @param {Problem[]} problems - From `loadProblems()`.
 * @param {string} query - What the user typed.
 * @returns {Problem[]} Exact match as a single-item array, otherwise all fuzzy matches.
 */
export function findProblems(problems, query) {
  const q = query.trim().replace(/\\/g, '/').replace(/\/+$/, '');

  const asPath = path.resolve(process.cwd(), q);
  if (fs.existsSync(asPath)) {
    const owner = problemForFile(problems, asPath);
    if (owner) return [owner];
  }

  const lower = q.toLowerCase();
  const exact = problems.filter((p) => {
    const folder = path.basename(p.dir);
    const topicSlug = stripPrefix(p.topicDir);
    return (
      p.slug === lower ||
      folder === lower ||
      p.relDir === lower ||
      `${topicSlug}/${p.slug}` === lower ||
      `${p.topicDir}/${folder}` === lower
    );
  });
  if (exact.length > 0) return exact;

  return problems.filter(
    (p) => p.slug.includes(lower) || p.title.toLowerCase().includes(lower) || p.relDir.includes(lower),
  );
}

/**
 * @typedef {object} ProgressEntry
 * @property {'attempted'|'completed'} status
 * @property {number} runs           How many tracked test runs so far.
 * @property {string} firstRun       ISO timestamp of the first tracked run.
 * @property {string} lastRun        ISO timestamp of the latest tracked run.
 * @property {string} [completedAt]  ISO timestamp of the latest passing run.
 */

/** @returns {Record<string, ProgressEntry>} Progress keyed by slug. */
export function readProgress() {
  if (!fs.existsSync(PROGRESS_FILE)) return {};
  try {
    return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8'));
  } catch {
    console.warn(`⚠️  Could not parse ${path.basename(PROGRESS_FILE)} — starting from empty progress.`);
    return {};
  }
}

/** @param {Record<string, ProgressEntry>} progress - Progress keyed by slug. */
export function writeProgress(progress) {
  const sorted = Object.fromEntries(Object.entries(progress).sort(([a], [b]) => a.localeCompare(b)));
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(sorted, null, 2) + '\n');
}

/**
 * Records the outcome of a test run.
 *
 * @param {Record<string, ProgressEntry>} progress - Mutated in place.
 * @param {string} slug - Problem slug.
 * @param {boolean} passed - Whether every test passed.
 * @returns {ProgressEntry} The updated entry.
 */
export function recordRun(progress, slug, passed) {
  const now = new Date().toISOString();
  const prev = progress[slug];
  const entry = {
    status: passed ? 'completed' : 'attempted',
    runs: (prev?.runs ?? 0) + 1,
    firstRun: prev?.firstRun ?? now,
    lastRun: now,
    ...(passed ? { completedAt: now } : prev?.completedAt ? { completedAt: prev.completedAt } : {}),
  };
  progress[slug] = /** @type {ProgressEntry} */ (entry);
  return progress[slug];
}
