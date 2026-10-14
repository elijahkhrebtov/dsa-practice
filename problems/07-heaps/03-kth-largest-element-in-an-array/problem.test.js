import { describe, it, expect } from 'vitest';
import { findKthLargest } from './problem.js';
import { createRng, randomInt, randomIntArray, shuffle, measure, withoutBuiltinSort } from '../../../lib/test-utils.js';

/** Calls the user's function on a copy, with the built-in sort switched off. */
function solve(nums, k) {
  const copy = [...nums];
  return withoutBuiltinSort(() => findKthLargest(copy, k));
}

/** Brute force: sort descending and index. */
const bruteKth = (nums, k) => [...nums].sort((a, b) => b - a)[k - 1];

describe('Kth Largest Element in an Array', () => {
  describe('examples from the problem', () => {
    it('[3, 2, 1, 5, 6, 4], k=2 → 5', () => {
      expect(solve([3, 2, 1, 5, 6, 4], 2)).toBe(5);
    });

    it('[3, 2, 3, 1, 2, 4, 5, 5, 6], k=4 → 4 (the two 5s count separately)', () => {
      expect(solve([3, 2, 3, 1, 2, 4, 5, 5, 6], 4)).toBe(4);
    });

    it('[7, 7, 7], k=3 → 7', () => {
      expect(solve([7, 7, 7], 3)).toBe(7);
    });
  });

  describe('edge cases', () => {
    it('a single element: [42], k=1 → 42', () => {
      expect(solve([42], 1)).toBe(42);
    });

    it('k=1 is the maximum: [-5, 10, 3, 10, -1] → 10', () => {
      expect(solve([-5, 10, 3, 10, -1], 1)).toBe(10);
    });

    it('k=n is the minimum: [4, -2, 9, 0, 7], k=5 → -2', () => {
      expect(solve([4, -2, 9, 0, 7], 5)).toBe(-2);
    });

    it('two elements, both ranks: [1, 2] → k=1 gives 2, k=2 gives 1', () => {
      expect(solve([1, 2], 1)).toBe(2);
      expect(solve([1, 2], 2)).toBe(1);
    });

    it('all negative: [-1, -9, -4, -7], k=2 → -4', () => {
      expect(solve([-1, -9, -4, -7], 2)).toBe(-4);
    });

    it('zeros and the value bounds: [0, -10000, 10000, 0], k=3 → 0', () => {
      expect(solve([0, -10000, 10000, 0], 3)).toBe(0);
    });
  });

  describe('tricky cases', () => {
    it('duplicates straddling the answer: [5, 5, 5, 1, 9], k=2..4 are all 5', () => {
      expect(solve([5, 5, 5, 1, 9], 2)).toBe(5);
      expect(solve([5, 5, 5, 1, 9], 3)).toBe(5);
      expect(solve([5, 5, 5, 1, 9], 4)).toBe(5);
    });

    it('k-th largest, not k-th largest DISTINCT: [2, 2, 1], k=2 → 2 (not 1)', () => {
      expect(solve([2, 2, 1], 2)).toBe(2);
    });

    it('already sorted ascending: [1..10], k=3 → 8', () => {
      expect(solve([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 3)).toBe(8);
    });

    it('sorted descending: [10..1], k=3 → 8', () => {
      expect(solve([10, 9, 8, 7, 6, 5, 4, 3, 2, 1], 3)).toBe(8);
    });

    it('only two distinct values: [1, 0, 1, 0, 1, 0, 0], k=3 → 1 and k=4 → 0', () => {
      expect(solve([1, 0, 1, 0, 1, 0, 0], 3)).toBe(1);
      expect(solve([1, 0, 1, 0, 1, 0, 0], 4)).toBe(0);
    });

    it('every rank of a shuffled array is right (catches off-by-one between k and the index n - k)', () => {
      const nums = shuffle(createRng(1), Array.from({ length: 25 }, (_, i) => i * 3 - 30));
      for (let k = 1; k <= nums.length; k++) {
        expect(solve(nums, k), `k=${k}`).toBe(bruteKth(nums, k));
      }
    });
  });

  describe('randomized (seeded) against a brute-force sort', () => {
    it('500 random arrays, many with heavy duplication', () => {
      const rng = createRng(31);
      for (let t = 0; t < 500; t++) {
        const n = randomInt(rng, 1, 60);
        const range = randomInt(rng, 0, 1) ? 3 : 1000; // half the arrays have only a few distinct values
        const nums = randomIntArray(rng, n, -range, range);
        const k = randomInt(rng, 1, n);
        expect(solve(nums, k), `nums=${JSON.stringify(nums)}, k=${k}`).toBe(bruteKth(nums, k));
      }
    });
  });

  describe('performance', () => {
    it('120,000 copies of the same value, k = 60,000 (a two-way partition degrades to O(n²) on duplicates)', () => {
      const nums = new Array(120_000).fill(7);
      const { result, ms } = measure(() => solve(nums, 60_000));
      expect(result).toBe(7);
      expect(ms, `took ${ms.toFixed(0)}ms — group elements equal to the pivot together`).toBeLessThan(500);
    });

    it('80,000 already-sorted values, k = 40,000 (a fixed first/last pivot degrades to O(n²))', () => {
      // Ascending values spread over the whole allowed range [-10^4, 10^4].
      const n = 80_000;
      const nums = Array.from({ length: n }, (_, i) => -10_000 + Math.floor((i * 20_001) / n));
      const { result, ms } = measure(() => solve(nums, 40_000));
      expect(result).toBe(nums[n - 40_000]);
      expect(ms, `took ${ms.toFixed(0)}ms — pick the pivot at random`).toBeLessThan(500);
    });

    it('300,000 random values with k = 100,000 (well under a second without sorting)', () => {
      const nums = randomIntArray(createRng(8), 300_000, -10_000, 10_000);
      const expected = bruteKth(nums, 100_000);
      const { result, ms } = measure(() => solve(nums, 100_000));
      expect(result).toBe(expected);
      expect(ms, `took ${ms.toFixed(0)}ms`).toBeLessThan(1000);
    });
  });
});
