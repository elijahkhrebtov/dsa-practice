import { describe, it, expect } from 'vitest';
import { twoSum } from './problem.js';
import { createRng, randomInt, measure } from '../../../lib/test-utils.js';

/** Checks the returned pair against the problem's rules. */
function expectValidPair(nums, target, result) {
  expect(Array.isArray(result), 'should return an array').toBe(true);
  expect(result).toHaveLength(2);
  const [i, j] = result;
  expect(Number.isInteger(i) && Number.isInteger(j), 'indices must be integers').toBe(true);
  expect(i, 'indices must be in ascending order (i < j) — which also means distinct').toBeLessThan(j);
  expect(i).toBeGreaterThanOrEqual(0);
  expect(j).toBeLessThan(nums.length);
  expect(nums[i] + nums[j]).toBe(target);
}

describe('Two Sum', () => {
  describe('examples from the problem', () => {
    it('[2, 7, 11, 15], target 9 → [0, 1]', () => {
      expect(twoSum([2, 7, 11, 15], 9)).toEqual([0, 1]);
    });

    it('[3, 2, 4], target 6 → [1, 2] (index 0 must not pair with itself)', () => {
      expect(twoSum([3, 2, 4], 6)).toEqual([1, 2]);
    });

    it('[3, 3], target 6 → [0, 1] (equal values at different indices are fine)', () => {
      expect(twoSum([3, 3], 6)).toEqual([0, 1]);
    });
  });

  describe('edge cases', () => {
    it('works with the minimum length of 2', () => {
      expect(twoSum([1, 5], 6)).toEqual([0, 1]);
    });

    it('handles negative numbers: [-3, 4, 3, 90], target 0 → [0, 2]', () => {
      expect(twoSum([-3, 4, 3, 90], 0)).toEqual([0, 2]);
    });

    it('handles a negative target: [-1, -2, -3, -4, -5], target -8 → [2, 4]', () => {
      expect(twoSum([-1, -2, -3, -4, -5], -8)).toEqual([2, 4]);
    });

    it('handles zeros: [0, 4, 3, 0], target 0 → [0, 3]', () => {
      expect(twoSum([0, 4, 3, 0], 0)).toEqual([0, 3]);
    });

    it('handles values near ±10^9 without precision issues', () => {
      expect(twoSum([1_000_000_000, -999_999_999, 7, 999_999_999], 1_999_999_999)).toEqual([0, 3]);
    });
  });

  describe('tricky cases', () => {
    it('returns indices in ascending order even when the pair is found "backwards"', () => {
      // If you store values as you go, you discover the pair at the later index —
      // make sure you still return [smaller, larger].
      expect(twoSum([5, 1, 9, 2], 7)).toEqual([0, 3]);
    });

    it('does not use the same element twice when target is exactly double a value', () => {
      // 4 + 4 = 8, but there is only one 4. The real answer is 1 + 7.
      expect(twoSum([1, 4, 7], 8)).toEqual([0, 2]);
    });

    it('finds the answer when it sits at the very end of the array', () => {
      expect(twoSum([10, 20, 30, 40, 50, 60, 1, 2], 3)).toEqual([6, 7]);
    });

    it('ignores duplicates that are not part of the answer: [2, 2, 2, 9, 5], target 14 → [3, 4]', () => {
      expect(twoSum([2, 2, 2, 9, 5], 14)).toEqual([3, 4]);
    });
  });

  describe('randomized (seeded, reproducible)', () => {
    it('returns a valid pair for 200 random arrays', () => {
      const rng = createRng(42);
      for (let t = 0; t < 200; t++) {
        const n = randomInt(rng, 2, 40);
        // Unique even values plus exactly one odd value. The target is odd, so
        // any valid pair must use the odd value — exactly one answer exists.
        const pool = new Set();
        while (pool.size < n) pool.add(randomInt(rng, -1000, 1000) * 2);
        const nums = [...pool];
        const i = randomInt(rng, 0, n - 1);
        let j = randomInt(rng, 0, n - 1);
        if (j === i) j = (i + 1) % n;
        nums[j] = nums[j] + 1;
        const target = nums[i] + nums[j];
        expectValidPair(nums, target, twoSum(nums, target));
      }
    });
  });

  describe('performance', () => {
    it('handles 100,000 numbers quickly (an O(n²) pair search will be far too slow)', () => {
      const n = 100_000;
      const nums = Array.from({ length: n }, (_, k) => k * 2); // all even
      nums[n - 1] = 1; // the only odd value — the answer must use it
      const target = nums[n - 2] + 1;
      const { result, ms } = measure(() => twoSum(nums, target));
      expect(result).toEqual([n - 2, n - 1]);
      expect(ms, `took ${ms.toFixed(0)}ms — think O(n)`).toBeLessThan(500);
    });
  });
});
