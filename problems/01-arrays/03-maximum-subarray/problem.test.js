import { describe, it, expect } from 'vitest';
import { maxSubArray } from './problem.js';
import { createRng, randomInt, randomIntArray, measure } from '../../../lib/test-utils.js';

/** Brute force: every start i, extend the end j while keeping a running sum. */
function bruteForce(nums) {
  let best = -Infinity;
  for (let i = 0; i < nums.length; i++) {
    let sum = 0;
    for (let j = i; j < nums.length; j++) {
      sum += nums[j];
      best = Math.max(best, sum);
    }
  }
  return best;
}

describe('Maximum Subarray', () => {
  describe('examples from the problem', () => {
    it('[-2, 1, -3, 4, -1, 2, 1, -5, 4] → 6 (the subarray [4, -1, 2, 1])', () => {
      expect(maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4])).toBe(6);
    });

    it('[1] → 1', () => {
      expect(maxSubArray([1])).toBe(1);
    });

    it('[5, 4, -1, 7, 8] → 23 (the whole array, a small dip is worth crossing)', () => {
      expect(maxSubArray([5, 4, -1, 7, 8])).toBe(23);
    });

    it('[-3, -1, -2] → -1 (all negative: the best single element, never 0)', () => {
      expect(maxSubArray([-3, -1, -2])).toBe(-1);
    });
  });

  describe('edge cases', () => {
    it('a single negative number is its own answer: [-5] → -5', () => {
      expect(maxSubArray([-5])).toBe(-5);
    });

    it('a single zero: [0] → 0', () => {
      expect(maxSubArray([0])).toBe(0);
    });

    it('all negative, largest at the end: [-8, -7, -6, -2] → -2', () => {
      expect(maxSubArray([-8, -7, -6, -2])).toBe(-2);
    });

    it('all negative, largest at the start: [-1, -7, -6, -9] → -1', () => {
      expect(maxSubArray([-1, -7, -6, -9])).toBe(-1);
    });

    it('zeros and negatives: [-2, 0, -1] → 0 (a lone zero beats every negative)', () => {
      expect(maxSubArray([-2, 0, -1])).toBe(0);
    });

    it('all positive → the sum of everything: [1, 2, 3, 4] → 10', () => {
      expect(maxSubArray([1, 2, 3, 4])).toBe(10);
    });

    it('constraint extremes: [10000, -10000, 10000] → 10000', () => {
      expect(maxSubArray([10000, -10000, 10000])).toBe(10000);
    });
  });

  describe('tricky cases', () => {
    it('a dip too deep to cross: [3, -4, 5] → 5 (restart after the -4)', () => {
      expect(maxSubArray([3, -4, 5])).toBe(5);
    });

    it('a dip exactly as deep as the gain: [3, -3, 3] → 3', () => {
      expect(maxSubArray([3, -3, 3])).toBe(3);
    });

    it('a shallow dip worth crossing: [3, -2, 5] → 6', () => {
      expect(maxSubArray([3, -2, 5])).toBe(6);
    });

    it('the best subarray is in the middle: [-5, 2, 3, -10, 1] → 5', () => {
      expect(maxSubArray([-5, 2, 3, -10, 1])).toBe(5);
    });

    it('the best run ends the array: [-1, -2, 4, 4] → 8', () => {
      expect(maxSubArray([-1, -2, 4, 4])).toBe(8);
    });

    it('an early best that is never beaten: [8, -20, 1, 2, 3] → 8 (keep the global best separately)', () => {
      expect(maxSubArray([8, -20, 1, 2, 3])).toBe(8);
    });

    it('initializing the answer to 0 is a bug: [-1] must give -1', () => {
      expect(maxSubArray([-1])).toBe(-1);
    });
  });

  describe('randomized (seeded, reproducible)', () => {
    it('matches an O(n²) brute force on 300 random arrays (mixed signs)', () => {
      const rng = createRng(31337);
      for (let t = 0; t < 300; t++) {
        const n = randomInt(rng, 1, 60);
        const nums = randomIntArray(rng, n, -50, 50);
        expect(maxSubArray([...nums]), `nums = [${nums}]`).toBe(bruteForce(nums));
      }
    });

    it('matches the brute force on 100 random mostly-negative arrays', () => {
      const rng = createRng(4242);
      for (let t = 0; t < 100; t++) {
        const n = randomInt(rng, 1, 40);
        const nums = randomIntArray(rng, n, -100, 5);
        expect(maxSubArray([...nums]), `nums = [${nums}]`).toBe(bruteForce(nums));
      }
    });
  });

  describe('performance', () => {
    it('100,000 numbers in one pass (trying every start/end pair is O(n²) and far too slow)', () => {
      const rng = createRng(7);
      const nums = randomIntArray(rng, 100_000, -10_000, 10_000);
      const expected = (() => {
        // Independent O(n) check via prefix sums: max over j of prefix[j] − min(prefix[<j]).
        let prefix = 0;
        let minPrefix = 0;
        let best = -Infinity;
        for (const x of nums) {
          prefix += x;
          best = Math.max(best, prefix - minPrefix);
          minPrefix = Math.min(minPrefix, prefix);
        }
        return best;
      })();
      const { result, ms } = measure(() => maxSubArray(nums));
      expect(result).toBe(expected);
      expect(ms, `took ${ms.toFixed(0)}ms — think O(n)`).toBeLessThan(500);
    });
  });
});
