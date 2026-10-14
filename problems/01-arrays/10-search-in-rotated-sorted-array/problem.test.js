import { describe, it, expect } from 'vitest';
import { search } from './problem.js';
import { createRng, randomInt } from '../../../lib/test-utils.js';

/** Rotates a sorted array left by `k`: rotate([0,1,2,3], 1) → [1,2,3,0]. */
function rotate(sorted, k) {
  return [...sorted.slice(k), ...sorted.slice(0, k)];
}

/**
 * Wraps `arr` in a Proxy that counts how many times an element (numeric
 * index) is read. `length` and other properties are not counted.
 */
function countingArray(arr) {
  const counter = { reads: 0 };
  const proxy = new Proxy(arr, {
    get(target, prop, receiver) {
      if (typeof prop === 'string' && /^\d+$/.test(prop)) counter.reads++;
      return Reflect.get(target, prop, receiver);
    },
  });
  return { proxy, counter };
}

describe('Search in Rotated Sorted Array', () => {
  describe('examples from the problem', () => {
    it('[4, 5, 6, 7, 0, 1, 2], target 0 → 4', () => {
      expect(search([4, 5, 6, 7, 0, 1, 2], 0)).toBe(4);
    });

    it('[4, 5, 6, 7, 0, 1, 2], target 3 → -1 (falls in the "gap" between the two halves)', () => {
      expect(search([4, 5, 6, 7, 0, 1, 2], 3)).toBe(-1);
    });

    it('[1], target 0 → -1', () => {
      expect(search([1], 0)).toBe(-1);
    });

    it('[5, 1, 3], target 5 → 0 (only the largest value was rotated to the front)', () => {
      expect(search([5, 1, 3], 5)).toBe(0);
    });
  });

  describe('edge cases', () => {
    it('single element that matches: [1], target 1 → 0', () => {
      expect(search([1], 1)).toBe(0);
    });

    it('two elements, rotated: [3, 1] → 3 at 0, 1 at 1, 2 missing', () => {
      expect(search([3, 1], 3)).toBe(0);
      expect(search([3, 1], 1)).toBe(1);
      expect(search([3, 1], 2)).toBe(-1);
    });

    it('not rotated at all: [1, 2, 3, 4, 5], target 4 → 3 (plain sorted array is a valid input)', () => {
      expect(search([1, 2, 3, 4, 5], 4)).toBe(3);
      expect(search([1, 2, 3, 4, 5], 1)).toBe(0);
      expect(search([1, 2, 3, 4, 5], 5)).toBe(4);
    });

    it('target smaller than every element → -1', () => {
      expect(search([6, 7, 8, 1, 2, 3], 0)).toBe(-1);
    });

    it('target larger than every element → -1', () => {
      expect(search([6, 7, 8, 1, 2, 3], 9)).toBe(-1);
    });

    it('negative numbers: [-2, 0, 5, -10, -7], target -7 → 4', () => {
      expect(search([-2, 0, 5, -10, -7], -7)).toBe(4);
    });

    it('values near ±10^9: [10^9, -10^9, 0], target -10^9 → 1', () => {
      expect(search([1_000_000_000, -1_000_000_000, 0], -1_000_000_000)).toBe(1);
    });

    it('does not modify the input array', () => {
      const nums = [15, 18, 2, 3, 6, 12];
      const copy = [...nums];
      search(nums, 6);
      search(nums, 7);
      expect(nums).toEqual(copy);
    });
  });

  describe('tricky cases', () => {
    it('target is the minimum (the rotation point): [5, 6, 7, 1, 2, 3, 4], target 1 → 3', () => {
      expect(search([5, 6, 7, 1, 2, 3, 4], 1)).toBe(3);
    });

    it('target is the maximum (just before the rotation point): [5, 6, 7, 1, 2, 3, 4], target 7 → 2', () => {
      expect(search([5, 6, 7, 1, 2, 3, 4], 7)).toBe(2);
    });

    it('rotated by one less than the length: [2, 3, 4, 5, 1], target 1 → 4 (minimum at the very end)', () => {
      expect(search([2, 3, 4, 5, 1], 1)).toBe(4);
    });

    it('target equals nums[0] or the last element (boundary comparisons must use <= / >= correctly)', () => {
      const nums = [30, 40, 50, 10, 20];
      expect(search(nums, 30)).toBe(0);
      expect(search(nums, 20)).toBe(4);
    });

    it('target between nums[last] and nums[0] is never present: [30, 40, 50, 10, 20], target 25 → -1', () => {
      expect(search([30, 40, 50, 10, 20], 25)).toBe(-1);
    });

    it('target lies in the right half while mid is in the left half: [4, 5, 6, 7, 8, 1, 2], target 2 → 6', () => {
      expect(search([4, 5, 6, 7, 8, 1, 2], 2)).toBe(6);
    });

    it('target lies in the left half while mid is in the right half: [7, 8, 1, 2, 3, 4, 5], target 8 → 1', () => {
      expect(search([7, 8, 1, 2, 3, 4, 5], 8)).toBe(1);
    });
  });

  describe('exhaustive small cases', () => {
    it('every length 1–12, every rotation, every target from -1 to 2n (present and absent)', () => {
      for (let n = 1; n <= 12; n++) {
        const sorted = Array.from({ length: n }, (_, i) => 2 * i); // 0, 2, 4, … → odd targets are absent
        for (let k = 0; k < n; k++) {
          const nums = rotate(sorted, k);
          for (let target = -1; target <= 2 * n; target++) {
            const expected = nums.indexOf(target);
            const got = search(nums, target);
            if (got !== expected) {
              expect(got, `nums = [${nums}], target = ${target}`).toBe(expected);
            }
          }
        }
      }
    });
  });

  describe('randomized (seeded, reproducible)', () => {
    it('matches indexOf on 300 random rotated arrays with present and absent targets', () => {
      const rng = createRng(2024);
      for (let t = 0; t < 300; t++) {
        const n = randomInt(rng, 1, 200);
        const pool = new Set();
        while (pool.size < n) pool.add(randomInt(rng, -1000, 1000));
        const sorted = [...pool].sort((a, b) => a - b);
        const nums = rotate(sorted, randomInt(rng, 0, n - 1));
        for (let q = 0; q < 5; q++) {
          const target = q % 2 === 0 ? nums[randomInt(rng, 0, n - 1)] : randomInt(rng, -1100, 1100);
          expect(search(nums, target), `nums = [${nums}], target = ${target}`).toBe(nums.indexOf(target));
        }
      }
    });
  });

  describe('performance', () => {
    it('reads at most ~200 elements of a 100,000-element array per search (a linear scan reads up to 100,000)', () => {
      const n = 100_000;
      const sorted = Array.from({ length: n }, (_, i) => 3 * i - 150_000);
      const rng = createRng(99);
      const rotations = [0, 1, n - 1, n >> 1, 12_345, 87_654];
      for (const k of rotations) {
        const nums = rotate(sorted, k);
        const targets = [nums[0], nums[n - 1], nums[k === 0 ? 0 : n - k], sorted[0] - 1, sorted[n - 1] + 1, sorted[500] + 1];
        for (let q = 0; q < 6; q++) targets.push(nums[randomInt(rng, 0, n - 1)]);
        for (const target of targets) {
          const { proxy, counter } = countingArray(nums);
          expect(search(proxy, target)).toBe(nums.indexOf(target));
          expect(counter.reads, `rotation ${k}, target ${target}: read ${counter.reads} elements — think O(log n)`).toBeLessThanOrEqual(200);
        }
      }
    });
  });
});
