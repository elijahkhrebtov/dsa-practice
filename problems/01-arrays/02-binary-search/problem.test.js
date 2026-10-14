import { describe, it, expect } from 'vitest';
import { search } from './problem.js';
import { createRng, randomInt, measure } from '../../../lib/test-utils.js';

/** Builds a strictly ascending array of `n` distinct random integers in [lo, hi]. */
function randomSortedDistinct(rng, n, lo, hi) {
  const set = new Set();
  while (set.size < n) set.add(randomInt(rng, lo, hi));
  return [...set].sort((a, b) => a - b);
}

describe('Binary Search', () => {
  describe('examples from the problem', () => {
    it('[-1, 0, 3, 5, 9, 12], target 9 → 4', () => {
      expect(search([-1, 0, 3, 5, 9, 12], 9)).toBe(4);
    });

    it('[-1, 0, 3, 5, 9, 12], target 2 → -1 (falls between 0 and 3 but is missing)', () => {
      expect(search([-1, 0, 3, 5, 9, 12], 2)).toBe(-1);
    });

    it('[5], target 5 → 0', () => {
      expect(search([5], 5)).toBe(0);
    });
  });

  describe('edge cases', () => {
    it('empty array → -1 (don\'t read nums[0] blindly)', () => {
      expect(search([], 3)).toBe(-1);
    });

    it('single element that doesn\'t match: [5], target 4 → -1 and target 6 → -1', () => {
      expect(search([5], 4)).toBe(-1);
      expect(search([5], 6)).toBe(-1);
    });

    it('target is the first element: [1, 3, 5, 7], target 1 → 0', () => {
      expect(search([1, 3, 5, 7], 1)).toBe(0);
    });

    it('target is the last element: [1, 3, 5, 7], target 7 → 3 (the classic off-by-one: lo <= hi, not lo < hi)', () => {
      expect(search([1, 3, 5, 7], 7)).toBe(3);
    });

    it('target smaller than everything → -1', () => {
      expect(search([2, 4, 6, 8], -100)).toBe(-1);
    });

    it('target larger than everything → -1', () => {
      expect(search([2, 4, 6, 8], 100)).toBe(-1);
    });

    it('two elements: finds either one, and misses values around them', () => {
      expect(search([10, 20], 10)).toBe(0);
      expect(search([10, 20], 20)).toBe(1);
      expect(search([10, 20], 5)).toBe(-1);
      expect(search([10, 20], 15)).toBe(-1);
      expect(search([10, 20], 25)).toBe(-1);
    });

    it('negative numbers and zero: [-9, -4, -1, 0, 2], target -4 → 1, target 0 → 3', () => {
      expect(search([-9, -4, -1, 0, 2], -4)).toBe(1);
      expect(search([-9, -4, -1, 0, 2], 0)).toBe(3);
    });

    it('values at ±10^9: [-1e9, 0, 1e9], target 1e9 → 2', () => {
      expect(search([-1_000_000_000, 0, 1_000_000_000], 1_000_000_000)).toBe(2);
      expect(search([-1_000_000_000, 0, 1_000_000_000], -1_000_000_000)).toBe(0);
    });
  });

  describe('tricky cases', () => {
    it('finds every element of an odd-length array at its own index', () => {
      const nums = [1, 4, 9, 16, 25, 36, 49];
      nums.forEach((v, i) => expect(search(nums, v), `target ${v}`).toBe(i));
    });

    it('finds every element of an even-length array at its own index', () => {
      const nums = [-7, -3, 0, 2, 11, 13, 40, 41];
      nums.forEach((v, i) => expect(search(nums, v), `target ${v}`).toBe(i));
    });

    it('misses every gap value in [0, 10, 20, …, 90] (no infinite loop when the target is absent)', () => {
      const nums = Array.from({ length: 10 }, (_, i) => i * 10);
      for (let t = -5; t <= 95; t += 10) expect(search(nums, t), `target ${t}`).toBe(-1);
    });

    it('does not modify the input array', () => {
      const nums = [1, 2, 3, 4, 5];
      search(nums, 4);
      expect(nums).toEqual([1, 2, 3, 4, 5]);
    });
  });

  describe('randomized (seeded, reproducible)', () => {
    it('agrees with indexOf on 300 random arrays, for present and absent targets', () => {
      const rng = createRng(99);
      for (let t = 0; t < 300; t++) {
        const n = randomInt(rng, 0, 50);
        const nums = randomSortedDistinct(rng, n, -200, 200);
        for (let q = 0; q < 10; q++) {
          const target = randomInt(rng, -210, 210);
          expect(search(nums, target), `nums = [${nums}], target = ${target}`).toBe(nums.indexOf(target));
        }
      }
    });
  });

  describe('performance', () => {
    it('12,000 searches in 1,000,000 numbers, mostly misses (a linear scan / indexOf is O(n) per search)', () => {
      const n = 1_000_000;
      const nums = Array.from({ length: n }, (_, i) => i * 2); // even numbers 0 … 1,999,998
      const queries = Array.from({ length: 12_000 }, (_, q) => {
        const k = (q * 7_919) % n;
        return q % 4 === 0 ? 2 * k : 2 * k + 1; // 1 in 4 present, the rest odd → absent
      });
      const { result, ms } = measure(() => queries.map((target) => search(nums, target)));
      expect(result).toEqual(queries.map((target) => (target % 2 === 0 ? target / 2 : -1)));
      expect(ms, `took ${ms.toFixed(0)}ms — think O(log n) per search`).toBeLessThan(500);
    });
  });
});
