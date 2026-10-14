import { describe, it, expect } from 'vitest';
import { sortArray } from './problem.js';
import { createRng, randomInt, randomIntArray, measure, withoutBuiltinSort } from '../../../lib/test-utils.js';

/** Reference answer computed with the built-in sort — BEFORE the user's code runs. */
function expected(nums) {
  return [...nums].sort((a, b) => a - b);
}

/** Runs sortArray with the built-in sort disabled. */
function run(nums) {
  return withoutBuiltinSort(() => sortArray(nums));
}

/** Checks the result without relying on the built-in sort being available. */
function expectSorted(input, result) {
  const want = expected(input);
  expect(Array.isArray(result), 'should return an array').toBe(true);
  expect(result.length, 'output must have the same number of elements').toBe(want.length);
  for (let i = 0; i < want.length; i++) {
    if (result[i] !== want[i]) {
      expect(result[i], `first mismatch at index ${i}`).toBe(want[i]);
    }
  }
}

describe('Sort an Array', () => {
  describe('examples from the problem', () => {
    it('[5, 2, 3, 1] → [1, 2, 3, 5]', () => {
      expect(run([5, 2, 3, 1])).toEqual([1, 2, 3, 5]);
    });

    it('[5, 1, 1, 2, 0, 0] → [0, 0, 1, 1, 2, 5] (duplicates are kept)', () => {
      expect(run([5, 1, 1, 2, 0, 0])).toEqual([0, 0, 1, 1, 2, 5]);
    });

    it('[10, -3, 100, 9] → [-3, 9, 10, 100] (numeric order, not string order)', () => {
      expect(run([10, -3, 100, 9])).toEqual([-3, 9, 10, 100]);
    });
  });

  describe('edge cases', () => {
    it('empty array → []', () => {
      expect(run([])).toEqual([]);
    });

    it('single element → unchanged', () => {
      expect(run([42])).toEqual([42]);
    });

    it('two elements in order and out of order', () => {
      expect(run([1, 2])).toEqual([1, 2]);
      expect(run([2, 1])).toEqual([1, 2]);
    });

    it('two equal elements: [7, 7] → [7, 7]', () => {
      expect(run([7, 7])).toEqual([7, 7]);
    });

    it('all negative numbers: [-1, -50000, -3, -2] → [-50000, -3, -2, -1]', () => {
      expect(run([-1, -50_000, -3, -2])).toEqual([-50_000, -3, -2, -1]);
    });

    it('the extremes of the value range: [50000, -50000, 0] → [-50000, 0, 50000]', () => {
      expect(run([50_000, -50_000, 0])).toEqual([-50_000, 0, 50_000]);
    });

    it('already sorted input stays sorted', () => {
      expect(run([-2, -1, 0, 1, 2, 3])).toEqual([-2, -1, 0, 1, 2, 3]);
    });

    it('reverse-sorted input: [6, 5, 4, 3, 2, 1] → [1, 2, 3, 4, 5, 6]', () => {
      expect(run([6, 5, 4, 3, 2, 1])).toEqual([1, 2, 3, 4, 5, 6]);
    });

    it('all elements equal: [3, 3, 3, 3, 3] → [3, 3, 3, 3, 3]', () => {
      expect(run([3, 3, 3, 3, 3])).toEqual([3, 3, 3, 3, 3]);
    });
  });

  describe('tricky cases', () => {
    it('does not use the built-in sort (the tests make it throw)', () => {
      expect(() => run([3, 1, 2])).not.toThrow();
    });

    it('odd and even lengths both split correctly: lengths 3, 4, 7 and 8', () => {
      for (const nums of [[2, 3, 1], [4, 1, 3, 2], [7, 1, 6, 2, 5, 3, 4], [8, 1, 7, 2, 6, 3, 5, 4]]) {
        expectSorted(nums, run([...nums]));
      }
    });

    it('only two distinct values, interleaved: [1, 0, 1, 0, 1, 0, 0, 1] → [0, 0, 0, 0, 1, 1, 1, 1]', () => {
      expect(run([1, 0, 1, 0, 1, 0, 0, 1])).toEqual([0, 0, 0, 0, 1, 1, 1, 1]);
    });

    it('"organ pipe" input (ascending then descending): [1, 3, 5, 7, 6, 4, 2, 0]', () => {
      expect(run([1, 3, 5, 7, 6, 4, 2, 0])).toEqual([0, 1, 2, 3, 4, 5, 6, 7]);
    });

    it('sorted except for the smallest value at the very end: [2, 3, 4, 5, 6, 1]', () => {
      expect(run([2, 3, 4, 5, 6, 1])).toEqual([1, 2, 3, 4, 5, 6]);
    });

    it('zero among positives and negatives: [0, -1, 1, 0, -1, 1] → [-1, -1, 0, 0, 1, 1]', () => {
      expect(run([0, -1, 1, 0, -1, 1])).toEqual([-1, -1, 0, 0, 1, 1]);
    });
  });

  describe('randomized (seeded, reproducible)', () => {
    it('matches a reference sort on 300 random arrays (lengths 0–300, wide value range)', () => {
      const rng = createRng(13);
      for (let t = 0; t < 300; t++) {
        const nums = randomIntArray(rng, randomInt(rng, 0, 300), -50_000, 50_000);
        expectSorted(nums, run([...nums]));
      }
    });

    it('matches a reference sort on 300 random arrays with lots of duplicates (values 0–5)', () => {
      const rng = createRng(14);
      for (let t = 0; t < 300; t++) {
        const nums = randomIntArray(rng, randomInt(rng, 0, 300), 0, 5);
        expectSorted(nums, run([...nums]));
      }
    });
  });

  describe('performance (100,000 elements, built-in sort disabled)', () => {
    const N = 100_000;
    const LIMIT = 500;

    function timed(nums) {
      const input = [...nums];
      const { result, ms } = measure(() => run(input));
      expectSorted(nums, result);
      return ms;
    }

    it('random values (bubble / insertion / selection sort are O(n²) here)', () => {
      const nums = randomIntArray(createRng(15), N, -50_000, 50_000);
      const ms = timed(nums);
      expect(ms, `took ${ms.toFixed(0)}ms — aim for O(n log n)`).toBeLessThan(LIMIT);
    });

    it('already sorted (quicksort with the first/last element as pivot degrades to O(n²) and deep recursion)', () => {
      const nums = Array.from({ length: N }, (_, i) => i - 50_000);
      const ms = timed(nums);
      expect(ms, `took ${ms.toFixed(0)}ms — aim for O(n log n) in the worst case`).toBeLessThan(LIMIT);
    });

    it('reverse-sorted (the worst case for insertion sort and naive quicksort)', () => {
      const nums = Array.from({ length: N }, (_, i) => 50_000 - i);
      const ms = timed(nums);
      expect(ms, `took ${ms.toFixed(0)}ms — aim for O(n log n) in the worst case`).toBeLessThan(LIMIT);
    });

    it('all elements equal (a quicksort that puts equal keys on one side degrades to O(n²))', () => {
      const nums = new Array(N).fill(7);
      const ms = timed(nums);
      expect(ms, `took ${ms.toFixed(0)}ms — handle equal keys without degrading`).toBeLessThan(LIMIT);
    });
  });
});
