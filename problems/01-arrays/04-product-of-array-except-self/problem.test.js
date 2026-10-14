import { describe, it, expect } from 'vitest';
import { productExceptSelf } from './problem.js';
import { createRng, randomInt, randomIntArray, measure, normalizeZeros } from '../../../lib/test-utils.js';

/** Brute force: for each i, multiply every other element. */
function bruteForce(nums) {
  return nums.map((_, i) => {
    let product = 1;
    for (let j = 0; j < nums.length; j++) if (j !== i) product *= nums[j];
    return product;
  });
}

/**
 * Runs the solution and normalizes -0 to 0. A correct prefix/suffix solution
 * can legitimately produce -0 (e.g. 0 · -1), which toEqual would treat as
 * different from 0.
 */
function run(nums) {
  const result = productExceptSelf(nums);
  expect(Array.isArray(result), 'should return an array').toBe(true);
  return normalizeZeros(result);
}

describe('Product of Array Except Self', () => {
  describe('examples from the problem', () => {
    it('[1, 2, 3, 4] → [24, 12, 8, 6]', () => {
      expect(run([1, 2, 3, 4])).toEqual([24, 12, 8, 6]);
    });

    it('[-1, 1, 0, -3, 3] → [0, 0, 9, 0, 0] (one zero: only its own slot is non-zero)', () => {
      expect(run([-1, 1, 0, -3, 3])).toEqual([0, 0, 9, 0, 0]);
    });

    it('[2, 3] → [3, 2] (minimum length: each gets the other one)', () => {
      expect(run([2, 3])).toEqual([3, 2]);
    });
  });

  describe('zeros', () => {
    it('a zero at the start: [0, 4, 5] → [20, 0, 0]', () => {
      expect(run([0, 4, 5])).toEqual([20, 0, 0]);
    });

    it('a zero at the end: [4, 5, 0] → [0, 0, 20]', () => {
      expect(run([4, 5, 0])).toEqual([0, 0, 20]);
    });

    it('two zeros → everything is 0: [1, 0, 3, 0] → [0, 0, 0, 0]', () => {
      expect(run([1, 0, 3, 0])).toEqual([0, 0, 0, 0]);
    });

    it('all zeros: [0, 0, 0] → [0, 0, 0]', () => {
      expect(run([0, 0, 0])).toEqual([0, 0, 0]);
    });

    it('[0, 0] → [0, 0] (two elements, both zero)', () => {
      expect(run([0, 0])).toEqual([0, 0]);
    });

    it('[0, -1, 2] → [-2, 0, 0] (products like 0 · -1 may come out as -0; that is fine)', () => {
      expect(run([0, -1, 2])).toEqual([-2, 0, 0]);
    });

    it('"total product ÷ nums[i]" breaks on zeros: [5, 0] → [0, 5]', () => {
      expect(run([5, 0])).toEqual([0, 5]);
    });
  });

  describe('signs and values', () => {
    it('all negative, even count: [-1, -2, -3, -4] → [-24, -12, -8, -6]', () => {
      expect(run([-1, -2, -3, -4])).toEqual([-24, -12, -8, -6]);
    });

    it('all negative, odd count: [-2, -3, -4] → [12, 8, 6]', () => {
      expect(run([-2, -3, -4])).toEqual([12, 8, 6]);
    });

    it('all ones: [1, 1, 1, 1, 1] → all ones', () => {
      expect(run([1, 1, 1, 1, 1])).toEqual([1, 1, 1, 1, 1]);
    });

    it('duplicates: [3, 3, 3] → [9, 9, 9]', () => {
      expect(run([3, 3, 3])).toEqual([9, 9, 9]);
    });

    it('constraint extremes: [30, -30, 30, -30] → [27000, -27000, 27000, -27000]', () => {
      expect(run([30, -30, 30, -30])).toEqual([27000, -27000, 27000, -27000]);
    });
  });

  describe('contract', () => {
    it('returns a new array of the same length and leaves the input untouched', () => {
      const nums = [1, 2, 3, 4];
      const result = productExceptSelf(nums);
      expect(nums).toEqual([1, 2, 3, 4]);
      expect(result).toHaveLength(4);
      expect(result).not.toBe(nums);
    });
  });

  describe('randomized (seeded, reproducible)', () => {
    it('matches a brute force on 300 random arrays (many with zeros)', () => {
      const rng = createRng(1234);
      for (let t = 0; t < 300; t++) {
        const n = randomInt(rng, 2, 12);
        const nums = randomIntArray(rng, n, -5, 5); // ~1 in 11 values is 0
        expect(run([...nums]), `nums = [${nums}]`).toEqual(normalizeZeros(bruteForce(nums)));
      }
    });
  });

  describe('performance', () => {
    it('40,000 numbers in O(n) (recomputing each product from scratch is O(n²) and far too slow)', () => {
      const n = 40_000;
      // ±1 everywhere, plus a single 2 and a single -3, so every product stays small.
      const nums = Array.from({ length: n }, (_, i) => (i % 7 === 3 ? -1 : 1));
      nums[12_345] = 2;
      nums[34_321] = -3;
      let total = 1;
      for (const x of nums) total *= x;
      const expected = nums.map((x) => total / x); // safe here: no zeros in this input
      const { result, ms } = measure(() => productExceptSelf(nums));
      expect(normalizeZeros(result)).toEqual(expected);
      expect(ms, `took ${ms.toFixed(0)}ms — think prefix and suffix products`).toBeLessThan(500);
    });
  });
});
