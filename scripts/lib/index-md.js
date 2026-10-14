/**
 * Renders INDEX.md — the table of contents with progress tracking.
 */
import fs from 'node:fs';
import { INDEX_FILE, loadProblems, readProgress } from './problems.js';
import { PATTERNS } from './patterns.js';

const STATUS_ICON = { completed: '✅', attempted: '🟨', todo: '⬜' };
const DIFFICULTY_ICON = { Easy: '🟢', Medium: '🟡', Hard: '🔴' };

/**
 * GitHub / VS Code compatible heading anchor.
 * @param {string} heading - Heading text.
 * @returns {string} Anchor without the leading '#'.
 */
export function slugify(heading) {
  return heading
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{M}\p{N}\p{Pc}\- ]/gu, '')
    .replace(/ /g, '-');
}

/**
 * @param {number} done - Completed count.
 * @param {number} total - Total count.
 * @returns {string} A 20-character progress bar.
 */
function bar(done, total) {
  const width = 20;
  const filled = total === 0 ? 0 : Math.round((done / total) * width);
  return '█'.repeat(filled) + '░'.repeat(width - filled);
}

const pct = (done, total) => (total === 0 ? 0 : Math.round((done / total) * 100));

/**
 * @param {import('./problems.js').Problem[]} problems
 * @param {Record<string, import('./problems.js').ProgressEntry>} progress
 * @returns {string} Markdown.
 */
export function renderIndex(problems, progress) {
  const statusOf = (p) => progress[p.slug]?.status ?? 'todo';
  const completed = problems.filter((p) => statusOf(p) === 'completed').length;
  const attempted = problems.filter((p) => statusOf(p) === 'attempted').length;

  const lines = [];
  lines.push('# DSA Practice — Index', '');
  lines.push(
    '> Auto-generated. Updated every time you run `npm run solve <problem>` (or `npm run index`). Edits by hand will be overwritten.',
    '',
  );
  lines.push(
    `**Progress:** \`${bar(completed, problems.length)}\` ${completed} / ${problems.length} completed (${pct(completed, problems.length)}%) · ${attempted} attempted`,
    '',
  );
  lines.push(`Legend: ${STATUS_ICON.todo} not started · ${STATUS_ICON.attempted} attempted (tests failing) · ${STATUS_ICON.completed} completed (all tests pass)`, '');

  // Difficulty summary
  lines.push('| Difficulty | Completed | Attempted | Total |', '| --- | ---: | ---: | ---: |');
  for (const d of ['Easy', 'Medium', 'Hard']) {
    const ps = problems.filter((p) => p.difficulty === d);
    lines.push(
      `| ${DIFFICULTY_ICON[d]} ${d} | ${ps.filter((p) => statusOf(p) === 'completed').length} | ${ps.filter((p) => statusOf(p) === 'attempted').length} | ${ps.length} |`,
    );
  }
  lines.push('');

  // Topics in folder order
  const topics = [];
  for (const p of problems) {
    let t = topics.find((x) => x.dir === p.topicDir);
    if (!t) topics.push((t = { dir: p.topicDir, title: p.topicTitle, problems: [] }));
    t.problems.push(p);
  }

  lines.push('## Contents', '');
  for (const t of topics) {
    const done = t.problems.filter((p) => statusOf(p) === 'completed').length;
    lines.push(`- [${t.title}](#${slugify(t.title)}) — ${done} / ${t.problems.length}`);
  }
  lines.push(`- [By pattern](#by-pattern)`, '');

  const usedPatterns = new Set(problems.flatMap((p) => p.patterns));
  const patternLink = (name) => (usedPatterns.has(name) ? `[${name}](#${slugify(name)})` : name);

  for (const t of topics) {
    lines.push(`## ${t.title}`, '');
    lines.push(`📘 [Topic primer](problems/${t.dir}/README.md)`, '');
    lines.push('| | # | Problem | Difficulty | Patterns | Hints | Solution |', '| :-: | --: | --- | --- | --- | --- | --- |');
    for (const p of t.problems) {
      const hints = p.hints.map((h, i) => `[${i + 1}](${p.relDir}/${h})`).join(' · ') || '—';
      const solution = p.hasSolution ? `[solution](${p.relDir}/solution.js)` : '—';
      lines.push(
        `| ${STATUS_ICON[statusOf(p)]} | ${p.number} | [${p.title}](${p.relDir}/problem.js) | ${DIFFICULTY_ICON[p.difficulty] ?? ''} ${p.difficulty} | ${p.patterns.map(patternLink).join(', ')} | ${hints} | ${solution} |`,
      );
    }
    lines.push('');
  }

  lines.push('## By pattern', '');
  const ordered = [...PATTERNS.filter((x) => usedPatterns.has(x)), ...[...usedPatterns].filter((x) => !PATTERNS.includes(x)).sort()];
  lines.push(ordered.map((name) => `[${name}](#${slugify(name)})`).join(' · '), '');
  for (const name of ordered) {
    const ps = problems.filter((p) => p.patterns.includes(name));
    lines.push(`### ${name}`, '');
    for (const p of ps) {
      lines.push(`- ${STATUS_ICON[statusOf(p)]} [${p.title}](${p.relDir}/problem.js) — ${DIFFICULTY_ICON[p.difficulty] ?? ''} ${p.difficulty} · _${p.topicTitle}_`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

/**
 * Re-reads problems and progress, then rewrites INDEX.md.
 * @returns {{ problems: import('./problems.js').Problem[], progress: Record<string, import('./problems.js').ProgressEntry> }}
 */
export function writeIndex() {
  const problems = loadProblems();
  const progress = readProgress();
  fs.writeFileSync(INDEX_FILE, renderIndex(problems, progress));
  return { problems, progress };
}
