#!/usr/bin/env node
/**
 * Rebuilds INDEX.md from the problems folder and progress.json.
 *   npm run index
 */
import { writeIndex } from './lib/index-md.js';

const { problems, progress } = writeIndex();
const done = problems.filter((p) => progress[p.slug]?.status === 'completed').length;
const attempted = problems.filter((p) => progress[p.slug]?.status === 'attempted').length;
console.log(`INDEX.md rebuilt — ${problems.length} problems · ${done} completed · ${attempted} attempted.`);
