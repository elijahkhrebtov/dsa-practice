import { describe, it, expect } from 'vitest';
import { subarraySum } from './problem.js';
import { createRng, randomInt, randomIntArray, measure } from '../../../lib/test-utils.js';

/** Brute-force oracle: try every start, extend to every end. O(n²). */
function oracle(nums, k) {
  let count = 0;
  for (let i = 0; i < nums.length; i++) {
    let sum = 0;
    for (let j = i; j < nums.length; j++) {
      sum += nums[j];
      if (sum === k) count++;
    }
  }
  return count;
}

describe('Subarray Sum Equals K', () => {
  describe('examples from the problem', () => {
    it('[1, 1, 1], k = 2 → 2 (overlapping subarrays both count)', () => {
      expect(subarraySum([1, 1, 1], 2)).toBe(2);
    });

    it('[1, 2, 3], k = 3 → 2 ([1, 2] and [3])', () => {
      expect(subarraySum([1, 2, 3], 3)).toBe(2);
    });

    it('[1, -1, 0], k = 0 → 3 ([1, -1], [0], [1, -1, 0])', () => {
      expect(subarraySum([1, -1, 0], 0)).toBe(3);
    });
  });

  describe('edge cases', () => {
    it('a single element equal to k → 1', () => {
      expect(subarraySum([5], 5)).toBe(1);
    });

    it('a single element different from k → 0', () => {
      expect(subarraySum([5], 4)).toBe(0);
    });

    it('[0], k = 0 → 1 (the one-element subarray [0] counts)', () => {
      expect(subarraySum([0], 0)).toBe(1);
    });

    it('[1, 2, 3], k = 0 → 0 (the empty subarray does NOT count)', () => {
      expect(subarraySum([1, 2, 3], 0)).toBe(0);
    });

    it('no subarray reaches k → 0', () => {
      expect(subarraySum([1, 2, 3], 100)).toBe(0);
    });

    it('a subarray that starts at index 0: [3, 4], k = 3 → 1, and [3, 4], k = 7 → 1', () => {
      // These need the "empty prefix" (sum 0 seen once before index 0).
      expect(subarraySum([3, 4], 3)).toBe(1);
      expect(subarraySum([3, 4], 7)).toBe(1);
    });

    it('the whole array is the only answer: [2, 2, 2], k = 6 → 1', () => {
      expect(subarraySum([2, 2, 2], 6)).toBe(1);
    });

    it('all zeros, k = 0: [0, 0, 0] → 6 (every one of the n·(n+1)/2 subarrays)', () => {
      expect(subarraySum([0, 0, 0], 0)).toBe(6);
    });
  });

  describe('negatives: why a sliding window does not work', () => {
    it('[3, 4, 7, 2, -3, 1, 4, 2], k = 7 → 4', () => {
      expect(subarraySum([3, 4, 7, 2, -3, 1, 4, 2], 7)).toBe(4);
    });

    it('[1, -1, 1, -1], k = 0 → 4 (sums go down as well as up)', () => {
      expect(subarraySum([1, -1, 1, -1], 0)).toBe(4);
    });

    it('[5, -5, 5, -5, 5], k = 5 → 6 (growing a window can bring the sum back to k)', () => {
      expect(subarraySum([5, -5, 5, -5, 5], 5)).toBe(6);
    });

    it('[10, 2, -2, -20, 10], k = -10 → 3 (negative target)', () => {
      expect(subarraySum([10, 2, -2, -20, 10], -10)).toBe(3);
    });

    it('[-1, -1, 1], k = -1 → 3 ([-1], [-1], [-1, -1, 1])', () => {
      expect(subarraySum([-1, -1, 1], -1)).toBe(3);
    });

    it('all negative: [-3, -2, -1], k = -3 → 2 ([-3] and [-2, -1])', () => {
      expect(subarraySum([-3, -2, -1], -3)).toBe(2);
    });
  });

  describe('tricky cases', () => {
    it('repeated prefix sums must be COUNTED, not just remembered: [1, 2, 1, 2, 1], k = 3 → 4', () => {
      expect(subarraySum([1, 2, 1, 2, 1], 3)).toBe(4);
    });

    it('zeros multiply the answers: [0, 0, 5, 0, 0], k = 5 → 9 (3 choices of start × 3 of end)', () => {
      expect(subarraySum([0, 0, 5, 0, 0], 5)).toBe(9);
    });

    it('extreme values: [1000, -1000, 1000], k = 1000 → 3', () => {
      expect(subarraySum([1000, -1000, 1000], 1000)).toBe(3);
    });
  });

  describe('randomized (seeded, reproducible)', () => {
    it('matches an O(n²) brute force on 300 random arrays with small values (lots of hits)', () => {
      const rng = createRng(707);
      for (let t = 0; t < 300; t++) {
        const nums = randomIntArray(rng, randomInt(rng, 1, 60), -3, 3);
        const k = randomInt(rng, -5, 5);
        expect(subarraySum(nums, k), `nums=${JSON.stringify(nums)}, k=${k}`).toBe(oracle(nums, k));
      }
    });

    it('matches the brute force on 50 longer arrays over the full value range', () => {
      const rng = createRng(708);
      for (let t = 0; t < 50; t++) {
        const nums = randomIntArray(rng, randomInt(rng, 1, 400), -1000, 1000);
        // Pick k as the sum of a real subarray so there is at least one hit.
        const i = randomInt(rng, 0, nums.length - 1);
        const j = randomInt(rng, i, nums.length - 1);
        const k = nums.slice(i, j + 1).reduce((a, b) => a + b, 0);
        expect(subarraySum(nums, k)).toBe(oracle(nums, k));
      }
    });
  });

  describe('performance', () => {
    it('100,000 numbers in [-1000, 1000] (trying every start/end pair is O(n²), far too slow)', () => {
      const rng = createRng(2027);
      const nums = randomIntArray(rng, 100_000, -1000, 1000);
      const { result, ms } = measure(() => subarraySum(nums, 7));
      // Expected value computed once with the O(n²) brute force.
      expect(result).toBe(24_236);
      expect(ms, `took ${ms.toFixed(0)}ms. Use prefix sums and count earlier prefixes in a hash map`).toBeLessThan(500);
    });

    it('100,000 zeros with k = 0 → 5,000,050,000 subarrays (the count exceeds 2^32 but is exact)', () => {
      const nums = new Array(100_000).fill(0);
      const { result, ms } = measure(() => subarraySum(nums, 0));
      expect(result).toBe(5_000_050_000);
      expect(ms, `took ${ms.toFixed(0)}ms`).toBeLessThan(500);
    });
  });
});
