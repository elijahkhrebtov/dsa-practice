import { describe, it, expect } from 'vitest';
import { insert } from './problem.js';
import { createRng, randomInt, measure, withoutBuiltinSort } from '../../../lib/test-utils.js';

/** Calls insert() with the built-in sort disabled — the input is already sorted. */
const run = (intervals, newInterval) => withoutBuiltinSort(() => insert(intervals, newInterval));

/**
 * Independent reference: paint all covered points on a doubled number line
 * (so touching intervals connect) and read off the maximal runs.
 */
function bruteForce(intervals, newInterval) {
  const covered = new Uint8Array(2 * 200 + 2);
  for (const [s, e] of [...intervals, newInterval]) for (let x = 2 * s; x <= 2 * e; x++) covered[x] = 1;
  const out = [];
  for (let x = 0; x < covered.length; x++) {
    if (covered[x] && (x === 0 || !covered[x - 1])) out.push([x / 2, x / 2]);
    if (covered[x]) out[out.length - 1][1] = x / 2;
  }
  return out;
}

describe('Insert Interval', () => {
  describe('examples from the problem', () => {
    it('[[1, 3], [6, 9]] + [2, 5] → [[1, 5], [6, 9]]', () => {
      expect(run([[1, 3], [6, 9]], [2, 5])).toEqual([[1, 5], [6, 9]]);
    });

    it('[[1, 2], [3, 5], [6, 7], [8, 10], [12, 16]] + [4, 8] → [[1, 2], [3, 10], [12, 16]] (absorbs three, touching [8, 10])', () => {
      expect(run([[1, 2], [3, 5], [6, 7], [8, 10], [12, 16]], [4, 8])).toEqual([[1, 2], [3, 10], [12, 16]]);
    });

    it('[[1, 2], [10, 12]] + [4, 6] → [[1, 2], [4, 6], [10, 12]] (fits in a gap, nothing merges)', () => {
      expect(run([[1, 2], [10, 12]], [4, 6])).toEqual([[1, 2], [4, 6], [10, 12]]);
    });
  });

  describe('edge cases', () => {
    it('empty list → [newInterval]', () => {
      expect(run([], [5, 7])).toEqual([[5, 7]]);
    });

    it('goes at the very beginning: [[3, 5]] + [0, 1] → [[0, 1], [3, 5]]', () => {
      expect(run([[3, 5]], [0, 1])).toEqual([[0, 1], [3, 5]]);
    });

    it('goes at the very end: [[1, 2], [3, 5]] + [6, 8] → [[1, 2], [3, 5], [6, 8]]', () => {
      expect(run([[1, 2], [3, 5]], [6, 8])).toEqual([[1, 2], [3, 5], [6, 8]]);
    });

    it('swallows everything: [[1, 2], [4, 5], [7, 9]] + [0, 10] → [[0, 10]]', () => {
      expect(run([[1, 2], [4, 5], [7, 9]], [0, 10])).toEqual([[0, 10]]);
    });

    it('lies entirely inside an existing interval: [[1, 10]] + [3, 4] → [[1, 10]]', () => {
      expect(run([[1, 10]], [3, 4])).toEqual([[1, 10]]);
    });

    it('a single-point new interval [5, 5] in a gap', () => {
      expect(run([[1, 2], [8, 9]], [5, 5])).toEqual([[1, 2], [5, 5], [8, 9]]);
    });

    it('identical to an existing interval', () => {
      expect(run([[1, 2], [4, 6]], [4, 6])).toEqual([[1, 2], [4, 6]]);
    });
  });

  describe('touching endpoints (closed intervals merge)', () => {
    it('touches the end of the previous interval: [[1, 5]] + [5, 7] → [[1, 7]]', () => {
      expect(run([[1, 5]], [5, 7])).toEqual([[1, 7]]);
    });

    it('touches the start of the next interval: [[6, 9]] + [2, 6] → [[2, 9]]', () => {
      expect(run([[6, 9]], [2, 6])).toEqual([[2, 9]]);
    });

    it('bridges two intervals exactly: [[1, 3], [6, 9]] + [3, 6] → [[1, 9]]', () => {
      expect(run([[1, 3], [6, 9]], [3, 6])).toEqual([[1, 9]]);
    });

    it('one unit short of touching does not merge: [[1, 3], [7, 9]] + [4, 6] → three intervals', () => {
      expect(run([[1, 3], [7, 9]], [4, 6])).toEqual([[1, 3], [4, 6], [7, 9]]);
    });
  });

  describe('tricky cases', () => {
    it('extends only to the left: [[1, 2], [5, 9]] + [4, 6] → [[1, 2], [4, 9]]', () => {
      expect(run([[1, 2], [5, 9]], [4, 6])).toEqual([[1, 2], [4, 9]]);
    });

    it('the new start is inside one interval and the new end inside another: [[1, 4], [6, 8], [10, 12]] + [3, 11] → [[1, 12]]', () => {
      expect(run([[1, 4], [6, 8], [10, 12]], [3, 11])).toEqual([[1, 12]]);
    });

    it('does not modify the input list, its inner arrays, or newInterval', () => {
      const intervals = [[1, 3], [6, 9]];
      const newInterval = [2, 5];
      const result = run(intervals, newInterval);
      expect(result).toEqual([[1, 5], [6, 9]]);
      expect(intervals).toEqual([[1, 3], [6, 9]]);
      expect(newInterval).toEqual([2, 5]);
      result[1][0] = 99; // the untouched [6, 9] in the result must be a copy, too
      expect(intervals[1]).toEqual([6, 9]);
    });

    it('returns a new array even when nothing merges', () => {
      const intervals = [[1, 2]];
      const newInterval = [5, 6];
      const result = run(intervals, newInterval);
      expect(result).not.toBe(intervals);
      expect(intervals).toEqual([[1, 2]]);
      result[1][0] = 0;
      expect(newInterval).toEqual([5, 6]);
    });
  });

  describe('randomized (seeded) against a number-line painting reference', () => {
    it('matches the reference on 400 random inputs', () => {
      const rng = createRng(57);
      for (let t = 0; t < 400; t++) {
        // Build a sorted list of disjoint, non-touching intervals.
        const intervals = [];
        let x = randomInt(rng, 0, 4);
        const n = randomInt(rng, 0, 8);
        for (let i = 0; i < n; i++) {
          const s = x;
          const e = s + randomInt(rng, 0, 5);
          intervals.push([s, e]);
          x = e + randomInt(rng, 1, 6); // at least 1 apart: never touching
        }
        const s = randomInt(rng, 0, x + 3);
        const newInterval = [s, s + randomInt(rng, 0, 15)];
        const before = JSON.stringify([intervals, newInterval]);
        expect(run(intervals, newInterval), before).toEqual(bruteForce(intervals, newInterval));
        expect(JSON.stringify([intervals, newInterval]), 'input was modified').toBe(before);
      }
    });
  });

  describe('performance', () => {
    it('200,000 intervals with 10,000 absorbed in the middle finish quickly (removing them one splice at a time is O(n) each)', () => {
      const n = 200_000;
      const intervals = Array.from({ length: n }, (_, i) => [10 * i, 10 * i + 5]);
      // Starts inside interval 95,000 and ends just before interval 105,000 → absorbs 95,000 … 104,999.
      const newInterval = [10 * 95_000 + 3, 10 * 105_000 - 1];
      const { result, ms } = measure(() => run(intervals, newInterval));
      expect(result.length).toBe(n - 10_000 + 1);
      expect(result[94_999]).toEqual([10 * 94_999, 10 * 94_999 + 5]);
      expect(result[95_000]).toEqual([10 * 95_000, 10 * 105_000 - 1]);
      expect(result[95_001]).toEqual([10 * 105_000, 10 * 105_000 + 5]);
      expect(ms, `took ${ms.toFixed(0)}ms — one linear pass is enough`).toBeLessThan(500);
    });
  });
});
