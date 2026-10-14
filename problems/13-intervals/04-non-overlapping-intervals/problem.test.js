import { describe, it, expect } from 'vitest';
import { eraseOverlapIntervals } from './problem.js';
import { createRng, randomInt, shuffle, measure } from '../../../lib/test-utils.js';

/**
 * Exhaustive reference: try every subset to keep, accept the ones with no
 * overlapping pair, and return n − (largest accepted subset). Tiny n only.
 */
function bruteForce(intervals) {
  const n = intervals.length;
  let bestKeep = 0;
  for (let mask = 0; mask < 1 << n; mask++) {
    const kept = intervals.filter((_, i) => mask & (1 << i));
    if (kept.length <= bestKeep) continue;
    let ok = true;
    for (let i = 0; i < kept.length && ok; i++) {
      for (let j = i + 1; j < kept.length && ok; j++) {
        if (kept[i][0] < kept[j][1] && kept[j][0] < kept[i][1]) ok = false;
      }
    }
    if (ok) bestKeep = kept.length;
  }
  return n - bestKeep;
}

const copy = (intervals) => intervals.map((iv) => [...iv]);

describe('Non-overlapping Intervals', () => {
  describe('examples from the problem', () => {
    it('[[1, 2], [2, 3], [3, 4], [1, 3]] → 1 (remove [1, 3]; the rest only touch)', () => {
      expect(eraseOverlapIntervals([[1, 2], [2, 3], [3, 4], [1, 3]])).toBe(1);
    });

    it('[[1, 2], [1, 2], [1, 2]] → 2 (only one copy of identical intervals can stay)', () => {
      expect(eraseOverlapIntervals([[1, 2], [1, 2], [1, 2]])).toBe(2);
    });

    it('[[1, 100], [11, 22], [1, 11], [2, 12]] → 2 (keep [1, 11] and [11, 22])', () => {
      expect(eraseOverlapIntervals([[1, 100], [11, 22], [1, 11], [2, 12]])).toBe(2);
    });
  });

  describe('edge cases', () => {
    it('a single interval → 0', () => {
      expect(eraseOverlapIntervals([[3, 7]])).toBe(0);
    });

    it('already disjoint → 0', () => {
      expect(eraseOverlapIntervals([[5, 6], [1, 2], [3, 4]])).toBe(0);
    });

    it('touching intervals are NOT overlapping: [[1, 2], [2, 3]] → 0', () => {
      expect(eraseOverlapIntervals([[1, 2], [2, 3]])).toBe(0);
    });

    it('all intervals share one point in time → n − 1', () => {
      expect(eraseOverlapIntervals([[0, 10], [4, 6], [5, 9], [1, 6], [3, 8]])).toBe(4);
    });

    it('negative coordinates: [[-5, -3], [-4, -1], [-1, 2]] → 1 (lastEnd must not start at 0)', () => {
      expect(eraseOverlapIntervals([[-5, -3], [-4, -1], [-1, 2]])).toBe(1);
    });

    it('coordinates at the limits ±5·10^4', () => {
      expect(eraseOverlapIntervals([[-50_000, 50_000], [-50_000, 0], [0, 50_000]])).toBe(1);
    });
  });

  describe('tricky cases', () => {
    it('one long interval blocking many short ones: [[1, 100], [2, 3], [4, 5], [6, 7]] → 1 (sorting by start and keeping the first is wrong)', () => {
      expect(eraseOverlapIntervals([[1, 100], [2, 3], [4, 5], [6, 7]])).toBe(1);
    });

    it('nested intervals: [[1, 10], [2, 9], [3, 8], [4, 7]] → 3', () => {
      expect(eraseOverlapIntervals([[1, 10], [2, 9], [3, 8], [4, 7]])).toBe(3);
    });

    it('a chain where each interval overlaps only its neighbours: [[1, 3], [2, 4], [3, 5], [4, 6]] → 2', () => {
      expect(eraseOverlapIntervals([[1, 3], [2, 4], [3, 5], [4, 6]])).toBe(2);
    });

    it('same end, different starts: [[1, 5], [3, 5], [4, 5], [5, 6]] → 2', () => {
      expect(eraseOverlapIntervals([[1, 5], [3, 5], [4, 5], [5, 6]])).toBe(2);
    });

    it('numeric sort, not string sort: [[10, 20], [2, 11], [19, 30], [9, 10]] → 2', () => {
      expect(eraseOverlapIntervals([[10, 20], [2, 11], [19, 30], [9, 10]])).toBe(2);
    });
  });

  describe('randomized (seeded) against an exhaustive subset search', () => {
    it('matches the brute force on 300 random lists of up to 10 intervals', () => {
      const rng = createRng(435);
      for (let t = 0; t < 300; t++) {
        const n = randomInt(rng, 1, 10);
        const intervals = [];
        for (let i = 0; i < n; i++) {
          const s = randomInt(rng, -10, 20);
          intervals.push([s, s + randomInt(rng, 1, 8)]);
        }
        const expected = bruteForce(intervals);
        expect(eraseOverlapIntervals(copy(intervals)), JSON.stringify(intervals)).toBe(expected);
      }
    });
  });

  describe('performance', () => {
    it('50,000 shuffled intervals finish quickly (an O(n²) longest-chain DP is too slow)', () => {
      const rng = createRng(11);
      const n = 50_000;
      // 25,000 back-to-back unit slots [2i, 2i+2) plus 25,000 overlapping [2i+1, 2i+3).
      const intervals = [];
      for (let i = 0; i < n / 2; i++) intervals.push([2 * i - 50_000, 2 * i - 50_000 + 2]);
      for (let i = 0; i < n / 2; i++) intervals.push([2 * i - 50_000 + 1, 2 * i - 50_000 + 3]);
      shuffle(rng, intervals);
      const { result, ms } = measure(() => eraseOverlapIntervals(intervals));
      expect(result).toBe(n / 2);
      expect(ms, `took ${ms.toFixed(0)}ms — sort by end, then one greedy pass`).toBeLessThan(500);
    });
  });
});
