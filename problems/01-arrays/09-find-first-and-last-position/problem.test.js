import { describe, it, expect } from 'vitest';
import { searchRange } from './problem.js';
import { createRng, randomInt, randomIntArray, measure } from '../../../lib/test-utils.js';

/** Oracle: linear scans from both ends. */
function linear(nums, target) {
  return [nums.indexOf(target), nums.lastIndexOf(target)];
}

describe('Find First and Last Position of Element in Sorted Array', () => {
  describe('examples from the problem', () => {
    it('[5, 7, 7, 8, 8, 10], target 8 → [3, 4]', () => {
      expect(searchRange([5, 7, 7, 8, 8, 10], 8)).toEqual([3, 4]);
    });

    it('[5, 7, 7, 8, 8, 10], target 6 → [-1, -1] (6 would fit between 5 and 7 but is absent)', () => {
      expect(searchRange([5, 7, 7, 8, 8, 10], 6)).toEqual([-1, -1]);
    });

    it('[], target 0 → [-1, -1]', () => {
      expect(searchRange([], 0)).toEqual([-1, -1]);
    });

    it('[2, 2, 2, 2], target 2 → [0, 3] (the whole array is the run)', () => {
      expect(searchRange([2, 2, 2, 2], 2)).toEqual([0, 3]);
    });
  });

  describe('edge cases', () => {
    it('single element, match: [1], target 1 → [0, 0] (first === last)', () => {
      expect(searchRange([1], 1)).toEqual([0, 0]);
    });

    it('single element, no match: [1], target 0 → [-1, -1] and target 2 → [-1, -1]', () => {
      expect(searchRange([1], 0)).toEqual([-1, -1]);
      expect(searchRange([1], 2)).toEqual([-1, -1]);
    });

    it('target occurs once in the middle: [1, 3, 5, 7, 9], target 5 → [2, 2]', () => {
      expect(searchRange([1, 3, 5, 7, 9], 5)).toEqual([2, 2]);
    });

    it('run at the very start: [4, 4, 4, 6, 8], target 4 → [0, 2]', () => {
      expect(searchRange([4, 4, 4, 6, 8], 4)).toEqual([0, 2]);
    });

    it('run at the very end: [1, 2, 9, 9, 9], target 9 → [2, 4] (don\'t stop one short of the end)', () => {
      expect(searchRange([1, 2, 9, 9, 9], 9)).toEqual([2, 4]);
    });

    it('target below everything → [-1, -1]; target above everything → [-1, -1]', () => {
      expect(searchRange([3, 4, 4, 5], -10)).toEqual([-1, -1]);
      expect(searchRange([3, 4, 4, 5], 10)).toEqual([-1, -1]);
    });

    it('negative values and ±10^9: [-1e9, -5, -5, 0, 1e9], target -5 → [1, 2]', () => {
      expect(searchRange([-1_000_000_000, -5, -5, 0, 1_000_000_000], -5)).toEqual([1, 2]);
      expect(searchRange([-1_000_000_000, -5, -5, 0, 1_000_000_000], 1_000_000_000)).toEqual([4, 4]);
    });
  });

  describe('tricky cases', () => {
    it('two elements, both the target: [8, 8], target 8 → [0, 1]', () => {
      expect(searchRange([8, 8], 8)).toEqual([0, 1]);
    });

    it('two different elements: [1, 2] → target 1 gives [0, 0], target 2 gives [1, 1]', () => {
      expect(searchRange([1, 2], 1)).toEqual([0, 0]);
      expect(searchRange([1, 2], 2)).toEqual([1, 1]);
    });

    it('every distinct value of a run-heavy array: [1, 1, 2, 3, 3, 3, 4, 5, 5]', () => {
      const nums = [1, 1, 2, 3, 3, 3, 4, 5, 5];
      expect(searchRange(nums, 1)).toEqual([0, 1]);
      expect(searchRange(nums, 2)).toEqual([2, 2]);
      expect(searchRange(nums, 3)).toEqual([3, 5]);
      expect(searchRange(nums, 4)).toEqual([6, 6]);
      expect(searchRange(nums, 5)).toEqual([7, 8]);
    });

    it('a missing value between two runs: [2, 2, 4, 4], target 3 → [-1, -1]', () => {
      expect(searchRange([2, 2, 4, 4], 3)).toEqual([-1, -1]);
    });

    it('does not modify the input array', () => {
      const nums = [5, 7, 7, 8, 8, 10];
      searchRange(nums, 7);
      expect(nums).toEqual([5, 7, 7, 8, 8, 10]);
    });
  });

  describe('randomized (seeded, reproducible)', () => {
    it('agrees with indexOf/lastIndexOf on 300 random sorted arrays full of duplicates', () => {
      const rng = createRng(909);
      for (let t = 0; t < 300; t++) {
        const n = randomInt(rng, 0, 60);
        const nums = randomIntArray(rng, n, -10, 10).sort((a, b) => a - b);
        for (let q = 0; q < 8; q++) {
          const target = randomInt(rng, -12, 12);
          expect(searchRange(nums, target), `nums = [${nums}], target = ${target}`).toEqual(linear(nums, target));
        }
      }
    });
  });

  describe('performance', () => {
    it('6,000 searches inside a run of ~1,000,000 equal values (find-one-then-walk-outward is O(n))', () => {
      const n = 1_000_000;
      const nums = new Array(n).fill(7);
      nums[0] = 3; // a different value on each side of the run
      nums[n - 1] = 9;
      const { result, ms } = measure(() => {
        let last;
        for (let q = 0; q < 6_000; q++) last = searchRange(nums, 7);
        return last;
      });
      expect(result).toEqual([1, n - 2]);
      expect(ms, `took ${ms.toFixed(0)}ms — find each boundary with its own binary search`).toBeLessThan(500);
    });

    it('12,000 searches in 1,000,000 numbers, mostly misses (indexOf / lastIndexOf scan O(n) each)', () => {
      const n = 1_000_000;
      // Values 0, 0, 2, 2, 4, 4, … : every even value appears exactly twice.
      const nums = Array.from({ length: n }, (_, i) => 2 * Math.floor(i / 2));
      const queries = Array.from({ length: 12_000 }, (_, q) => {
        const k = (q * 7_919) % (n / 2);
        return q % 4 === 0 ? 2 * k : 2 * k + 1; // 1 in 4 present, the rest odd → absent
      });
      const { result, ms } = measure(() => queries.map((target) => searchRange(nums, target)));
      expect(result).toEqual(queries.map((t) => (t % 2 === 0 ? [t, t + 1] : [-1, -1])));
      expect(ms, `took ${ms.toFixed(0)}ms — think O(log n) per search`).toBeLessThan(500);
    });
  });
});
