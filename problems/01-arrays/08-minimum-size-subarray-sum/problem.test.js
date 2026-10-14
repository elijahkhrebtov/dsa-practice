import { describe, it, expect } from 'vitest';
import { minSubArrayLen } from './problem.js';
import { createRng, randomInt, randomIntArray, measure } from '../../../lib/test-utils.js';

/** Brute force: for each start, extend right until the sum reaches the target. */
function bruteForce(target, nums) {
  let best = 0;
  for (let i = 0; i < nums.length; i++) {
    let sum = 0;
    for (let j = i; j < nums.length; j++) {
      sum += nums[j];
      if (sum >= target) {
        if (best === 0 || j - i + 1 < best) best = j - i + 1;
        break;
      }
    }
  }
  return best;
}

describe('Minimum Size Subarray Sum', () => {
  describe('examples from the problem', () => {
    it('target 7, [2, 3, 1, 2, 4, 3] → 2 (the subarray [4, 3])', () => {
      expect(minSubArrayLen(7, [2, 3, 1, 2, 4, 3])).toBe(2);
    });

    it('target 4, [1, 4, 4] → 1 (a single element can be enough)', () => {
      expect(minSubArrayLen(4, [1, 4, 4])).toBe(1);
    });

    it('target 11, [1, 1, 1, 1, 1, 1, 1, 1] → 0 (even the whole array falls short)', () => {
      expect(minSubArrayLen(11, [1, 1, 1, 1, 1, 1, 1, 1])).toBe(0);
    });
  });

  describe('edge cases', () => {
    it('a single element that reaches the target: target 5, [5] → 1', () => {
      expect(minSubArrayLen(5, [5])).toBe(1);
    });

    it('a single element that overshoots: target 3, [10] → 1 (">=" not "==")', () => {
      expect(minSubArrayLen(3, [10])).toBe(1);
    });

    it('a single element that falls short: target 6, [5] → 0', () => {
      expect(minSubArrayLen(6, [5])).toBe(0);
    });

    it('the whole array is needed: target 15, [1, 2, 3, 4, 5] → 5', () => {
      expect(minSubArrayLen(15, [1, 2, 3, 4, 5])).toBe(5);
    });

    it('the whole array is one short: target 16, [1, 2, 3, 4, 5] → 0', () => {
      expect(minSubArrayLen(16, [1, 2, 3, 4, 5])).toBe(0);
    });

    it('target 1 → 1 (every element is at least 1)', () => {
      expect(minSubArrayLen(1, [3, 1, 2])).toBe(1);
    });

    it('a huge target no array can reach: target 10^9, [10000, 10000] → 0', () => {
      expect(minSubArrayLen(1_000_000_000, [10_000, 10_000])).toBe(0);
    });
  });

  describe('tricky cases', () => {
    it('the shortest window is at the very end: target 11, [1, 2, 3, 4, 5] → 3 ([3, 4, 5])', () => {
      expect(minSubArrayLen(11, [1, 2, 3, 4, 5])).toBe(3);
    });

    it('the shortest window is at the very start: target 9, [5, 4, 1, 1, 1, 1] → 2', () => {
      expect(minSubArrayLen(9, [5, 4, 1, 1, 1, 1])).toBe(2);
    });

    it('shrink the window more than one step at a time: target 100, [1, 1, 1, 1, 100] → 1', () => {
      // When the 100 arrives, the window must drop ALL the 1s in front of it, not just one.
      expect(minSubArrayLen(100, [1, 1, 1, 1, 100])).toBe(1);
    });

    it('a big element in the middle: target 15, [1, 2, 3, 15, 1, 2] → 1', () => {
      expect(minSubArrayLen(15, [1, 2, 3, 15, 1, 2])).toBe(1);
    });

    it('the first window found is not the shortest: target 8, [3, 3, 3, 1, 7] → 2 ([1, 7])', () => {
      expect(minSubArrayLen(8, [3, 3, 3, 1, 7])).toBe(2);
    });

    it('sum exactly equal to the target counts: target 6, [2, 2, 2] → 3', () => {
      expect(minSubArrayLen(6, [2, 2, 2])).toBe(3);
    });
  });

  describe('randomized (seeded, reproducible)', () => {
    it('matches an O(n²) brute force on 400 random cases', () => {
      const rng = createRng(808);
      for (let t = 0; t < 400; t++) {
        const n = randomInt(rng, 1, 50);
        const nums = randomIntArray(rng, n, 1, 20);
        const target = randomInt(rng, 1, 300); // sometimes unreachable → 0
        expect(minSubArrayLen(target, [...nums]), `target = ${target}, nums = [${nums}]`).toBe(bruteForce(target, nums));
      }
    });

    it('does not modify the input array', () => {
      const nums = [2, 3, 1, 2, 4, 3];
      minSubArrayLen(7, nums);
      expect(nums).toEqual([2, 3, 1, 2, 4, 3]);
    });
  });

  describe('performance', () => {
    it('100,000 ones with an unreachable target → 0 (restarting the sum at every index is O(n²))', () => {
      const nums = new Array(100_000).fill(1);
      const { result, ms } = measure(() => minSubArrayLen(100_001, nums));
      expect(result).toBe(0);
      expect(ms, `took ${ms.toFixed(0)}ms — think sliding window`).toBeLessThan(500);
    });

    it('100,000 numbers where the best window is ~half the array (each element enters and leaves once)', () => {
      const n = 100_000;
      const nums = Array.from({ length: n }, (_, i) => 1 + (i % 2)); // 1, 2, 1, 2, …
      // Any window of length 2k sums to exactly 3k; target 75,000 → length 50,000.
      const { result, ms } = measure(() => minSubArrayLen(75_000, nums));
      expect(result).toBe(50_000);
      expect(ms, `took ${ms.toFixed(0)}ms — think sliding window`).toBeLessThan(500);
    });
  });
});
