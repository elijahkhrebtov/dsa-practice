import { describe, it, expect } from 'vitest';
import { canPartition } from './problem.js';
import { createRng, randomInt, randomIntArray, measure } from '../../../lib/test-utils.js';

/** Brute force: try every subset (bitmask) as "group A" — only for small arrays. */
function bruteForce(nums) {
  const n = nums.length;
  const total = nums.reduce((a, b) => a + b, 0);
  for (let mask = 0; mask < 1 << n; mask++) {
    let sum = 0;
    for (let i = 0; i < n; i++) if (mask & (1 << i)) sum += nums[i];
    if (2 * sum === total) return true;
  }
  return false;
}

describe('Partition Equal Subset Sum', () => {
  describe('examples from the problem', () => {
    it('[1, 5, 11, 5] → true ([1, 5, 5] and [11])', () => {
      expect(canPartition([1, 5, 11, 5])).toBe(true);
    });

    it('[1, 2, 3, 5] → false (odd total 11)', () => {
      expect(canPartition([1, 2, 3, 5])).toBe(false);
    });

    it('[1, 2, 5] → false (even total 8, but no subset makes 4)', () => {
      expect(canPartition([1, 2, 5])).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('a single element can never be split: [1] → false, [100] → false', () => {
      expect(canPartition([1])).toBe(false);
      expect(canPartition([100])).toBe(false);
    });

    it('two equal elements: [1, 1] → true, [100, 100] → true', () => {
      expect(canPartition([1, 1])).toBe(true);
      expect(canPartition([100, 100])).toBe(true);
    });

    it('two different elements: [1, 2] → false', () => {
      expect(canPartition([1, 2])).toBe(false);
    });

    it('all elements equal, even count: [3, 3, 3, 3] → true', () => {
      expect(canPartition([3, 3, 3, 3])).toBe(true);
    });

    it('all elements equal, odd count: [4, 4, 4] → false (even total 12, but halves need 1.5 elements)', () => {
      expect(canPartition([4, 4, 4])).toBe(false);
    });

    it('returns a real boolean', () => {
      expect(canPartition([2, 2])).toBe(true);
      expect(canPartition([2, 4])).toBe(false);
    });

    it('does not modify the input', () => {
      const nums = [1, 5, 11, 5];
      canPartition(nums);
      expect(nums).toEqual([1, 5, 11, 5]);
    });
  });

  describe('tricky cases', () => {
    it('one element is more than half the total: [1, 1, 1, 9] → false', () => {
      expect(canPartition([1, 1, 1, 9])).toBe(false);
    });

    it('one element is exactly half the total: [6, 1, 2, 3] → true', () => {
      expect(canPartition([6, 1, 2, 3])).toBe(true);
    });

    it('even total, no subset hits half: [2, 2, 3, 5] → false', () => {
      expect(canPartition([2, 2, 3, 5])).toBe(false);
    });

    it('each element may be used only once: [1, 5] → false (reusing the 1 would fake a 3)', () => {
      // A 1-D DP that loops sums upward lets an element count twice — loop downward.
      expect(canPartition([1, 5])).toBe(false);
    });

    it('greedily putting each number on the lighter side fails: [3, 3, 2, 2, 2] → true ([3, 3] | [2, 2, 2])', () => {
      expect(canPartition([3, 3, 2, 2, 2])).toBe(true);
    });

    it('[1, 2, 3, 4, 5, 6, 7] → true (total 28, e.g. [7, 6, 1] and the rest)', () => {
      expect(canPartition([1, 2, 3, 4, 5, 6, 7])).toBe(true);
    });

    it('needs many small elements to balance one big one: [100, 25, 25, 25, 24, 1] → true', () => {
      expect(canPartition([100, 25, 25, 25, 24, 1])).toBe(true);
    });

    it('powers of two: [1, 1, 2, 4, 8, 16] → true ([16] | [1, 1, 2, 4, 8])', () => {
      expect(canPartition([1, 1, 2, 4, 8, 16])).toBe(true);
    });
  });

  describe('exhaustive small cases', () => {
    it('every array of length 1–6 with values 1–5 matches trying all subsets', () => {
      for (let n = 1; n <= 6; n++) {
        const nums = new Array(n);
        for (let code = 0; code < 5 ** n; code++) {
          let c = code;
          for (let i = 0; i < n; i++) {
            nums[i] = (c % 5) + 1;
            c = Math.floor(c / 5);
          }
          const want = bruteForce(nums);
          const got = canPartition(nums);
          if (got !== want) expect(got, `nums = [${nums}]`).toBe(want);
        }
      }
    });
  });

  describe('randomized (seeded, reproducible)', () => {
    it('matches trying all subsets on 200 random arrays of up to 16 values in 1–100', () => {
      const rng = createRng(18);
      for (let t = 0; t < 200; t++) {
        const nums = randomIntArray(rng, randomInt(rng, 1, 16), 1, 100);
        expect(canPartition(nums), `nums = [${nums}]`).toBe(bruteForce(nums));
      }
    });

    it('matches trying all subsets on 200 random arrays of up to 16 values in 1–10 (more "true" answers)', () => {
      const rng = createRng(19);
      for (let t = 0; t < 200; t++) {
        const nums = randomIntArray(rng, randomInt(rng, 1, 16), 1, 10);
        expect(canPartition(nums), `nums = [${nums}]`).toBe(bruteForce(nums));
      }
    });
  });

  describe('performance', () => {
    it('29 numbers with an even total but no valid split → false (trying all 2^29 subsets takes seconds)', () => {
      // 28 multiples of 4 plus a single 2: the total is 4k + 2 (even), so half of it
      // is 2k + 1 — odd. Every element is even, so no subset can sum to an odd number.
      const rng = createRng(18);
      const nums = Array.from({ length: 28 }, () => 4 * randomInt(rng, 1, 25));
      nums.splice(13, 0, 2);
      const { result, ms } = measure(() => canPartition(nums));
      expect(result).toBe(false);
      expect(ms, `took ${ms.toFixed(0)}ms — think subset-sum DP over sums up to total / 2`).toBeLessThan(500);
    });
  });
});
