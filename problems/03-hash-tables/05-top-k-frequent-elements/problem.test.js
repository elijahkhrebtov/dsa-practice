import { describe, it, expect } from 'vitest';
import { topKFrequent } from './problem.js';
import { createRng, randomInt, shuffle, measure, withoutBuiltinSort } from '../../../lib/test-utils.js';

/** Results may come back in any order, so sort a copy numerically before comparing. */
const sorted = (arr) => {
  expect(Array.isArray(arr), 'should return an array').toBe(true);
  return [...arr].sort((a, b) => a - b);
};

/** Brute-force oracle: count with a Map, sort the distinct values by count, take k. */
function oracle(nums, k) {
  const counts = new Map();
  for (const x of nums) counts.set(x, (counts.get(x) ?? 0) + 1);
  return [...counts.keys()].sort((a, b) => counts.get(b) - counts.get(a)).slice(0, k);
}

/** Returns every k for which the top-k answer is unique (no tie at the boundary). */
function validKs(nums) {
  const counts = new Map();
  for (const x of nums) counts.set(x, (counts.get(x) ?? 0) + 1);
  const freqs = [...counts.values()].sort((a, b) => b - a);
  const ks = [];
  for (let k = 1; k <= freqs.length; k++) if (k === freqs.length || freqs[k - 1] > freqs[k]) ks.push(k);
  return ks;
}

describe('Top K Frequent Elements', () => {
  describe('examples from the problem', () => {
    it('[1, 1, 1, 2, 2, 3], k = 2 → [1, 2] (any order)', () => {
      expect(sorted(topKFrequent([1, 1, 1, 2, 2, 3], 2))).toEqual([1, 2]);
    });

    it('[1], k = 1 → [1]', () => {
      expect(topKFrequent([1], 1)).toEqual([1]);
    });

    it('[4, -1, -1, 4, 7, -1], k = 1 → [-1] (negative values count like any other)', () => {
      expect(topKFrequent([4, -1, -1, 4, 7, -1], 1)).toEqual([-1]);
    });
  });

  describe('edge cases', () => {
    it('k equals the number of distinct values: return every distinct value once', () => {
      expect(sorted(topKFrequent([5, 3, 5, 9, 3, 5], 3))).toEqual([3, 5, 9]);
    });

    it('all elements equal: [7, 7, 7, 7], k = 1 → [7] (no duplicates in the result)', () => {
      expect(topKFrequent([7, 7, 7, 7], 1)).toEqual([7]);
    });

    it('all values distinct and k = n → every value', () => {
      expect(sorted(topKFrequent([3, -2, 10, 0], 4))).toEqual([-2, 0, 3, 10]);
    });

    it('zero is a value like any other: [0, 0, 1], k = 1 → [0]', () => {
      expect(topKFrequent([0, 0, 1], 1)).toEqual([0]);
    });

    it('handles the extremes ±10^5', () => {
      expect(sorted(topKFrequent([100_000, -100_000, 100_000, -100_000, 1], 2))).toEqual([-100_000, 100_000]);
    });

    it('returns exactly k elements', () => {
      const result = topKFrequent([1, 1, 1, 1, 2, 2, 2, 3, 3, 4], 3);
      expect(result).toHaveLength(3);
      expect(sorted(result)).toEqual([1, 2, 3]);
    });

    it('does not modify the input array', () => {
      const nums = [3, 1, 3, 2, 3, 1];
      topKFrequent(nums, 2);
      expect(nums).toEqual([3, 1, 3, 2, 3, 1]);
    });
  });

  describe('tricky cases', () => {
    it('returns values, not counts: [5, 5, 5, 9], k = 1 → [5] (not [3])', () => {
      expect(topKFrequent([5, 5, 5, 9], 1)).toEqual([5]);
    });

    it('values that equal some frequency do not confuse it: [3, 3, 3, 1, 2, 2], k = 2 → [2, 3]', () => {
      expect(sorted(topKFrequent([3, 3, 3, 1, 2, 2], 2))).toEqual([2, 3]);
    });

    it('frequency ties below the cut are fine: [1, 1, 1, 2, 3, 4], k = 1 → [1]', () => {
      expect(topKFrequent([1, 1, 1, 2, 3, 4], 1)).toEqual([1]);
    });

    it('frequency ties inside the answer are fine: [1, 1, 2, 2, 3], k = 2 → [1, 2]', () => {
      expect(sorted(topKFrequent([1, 1, 2, 2, 3], 2))).toEqual([1, 2]);
    });

    it('the most frequent value is not the first one seen: [1, 2, 2, 3, 3, 3], k = 1 → [3]', () => {
      expect(topKFrequent([1, 2, 2, 3, 3, 3], 1)).toEqual([3]);
    });

    it('a value occurring in every position (frequency = n) lands in the highest bucket', () => {
      // With bucket sort, buckets must go up to index n (not n - 1).
      expect(topKFrequent([2, 2, 2], 1)).toEqual([2]);
    });

    it('works without the built-in sort (the goal is better than O(n log n): bucket sort or a heap)', () => {
      const nums = [4, 4, 4, 4, 1, 1, 1, 2, 2, 3, 6, 6, 6, 6, 6];
      const result = withoutBuiltinSort(() => topKFrequent(nums, 3));
      expect(sorted(result)).toEqual([1, 4, 6]);
    });
  });

  describe('randomized (seeded, reproducible)', () => {
    it('matches a sort-by-count oracle on 300 random arrays (every k with a unique answer)', () => {
      const rng = createRng(55);
      for (let t = 0; t < 300; t++) {
        const nums = Array.from({ length: randomInt(rng, 1, 60) }, () => randomInt(rng, -8, 8));
        for (const k of validKs(nums)) {
          expect(sorted(topKFrequent(nums, k)), `nums=${JSON.stringify(nums)}, k=${k}`).toEqual(
            sorted(oracle(nums, k)),
          );
        }
      }
    });
  });

  describe('performance', () => {
    it('100,000 numbers with 45,500 distinct values (re-scanning the array for each value is O(n·u), too slow)', () => {
      const rng = createRng(808);
      // 500 "heavy" values appear 20 times each, 45,000 "light" values appear twice each.
      const labels = shuffle(rng, Array.from({ length: 200_001 }, (_, i) => i - 100_000)).slice(0, 45_500);
      const heavy = labels.slice(0, 500);
      const nums = [];
      labels.forEach((v, i) => {
        const times = i < 500 ? 20 : 2;
        for (let j = 0; j < times; j++) nums.push(v);
      });
      shuffle(rng, nums);

      const { result, ms } = measure(() => topKFrequent(nums, 500));
      expect(sorted(result)).toEqual(sorted(heavy));
      expect(ms, `took ${ms.toFixed(0)}ms. Count once with a hash map, then bucket by frequency`).toBeLessThan(500);
    });
  });
});
