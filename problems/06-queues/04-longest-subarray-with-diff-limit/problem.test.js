import { describe, it, expect } from 'vitest';
import { longestSubarray } from './problem.js';
import { createRng, randomInt, randomIntArray, measure } from '../../../lib/test-utils.js';

/** O(n²) reference: try every start, extend while max - min stays within the limit. */
function bruteForce(nums, limit) {
  let best = 0;
  for (let i = 0; i < nums.length; i++) {
    let lo = nums[i];
    let hi = nums[i];
    for (let j = i; j < nums.length; j++) {
      lo = Math.min(lo, nums[j]);
      hi = Math.max(hi, nums[j]);
      if (hi - lo > limit) break;
      best = Math.max(best, j - i + 1);
    }
  }
  return best;
}

describe('Longest Subarray With Absolute Diff Limit', () => {
  describe('examples from the problem', () => {
    it('[8, 2, 4, 7], limit 4 → 2', () => {
      expect(longestSubarray([8, 2, 4, 7], 4)).toBe(2);
    });

    it('[10, 1, 2, 4, 7, 2], limit 5 → 4 ([2, 4, 7, 2]: max 7 − min 2 = 5 is allowed)', () => {
      expect(longestSubarray([10, 1, 2, 4, 7, 2], 5)).toBe(4);
    });

    it('[4, 2, 2, 2, 4, 4, 2, 2], limit 0 → 3 (limit 0 means all elements equal)', () => {
      expect(longestSubarray([4, 2, 2, 2, 4, 4, 2, 2], 0)).toBe(3);
    });
  });

  describe('edge cases', () => {
    it('a single element → 1 (any one element always qualifies)', () => {
      expect(longestSubarray([5], 0)).toBe(1);
    });

    it('no two neighbours fit the limit → 1', () => {
      expect(longestSubarray([1, 10, 1, 10, 1], 3)).toBe(1);
    });

    it('a huge limit makes the whole array valid → n', () => {
      expect(longestSubarray([1, 1_000_000_000, 3, 999_999_999], 1_000_000_000)).toBe(4);
    });

    it('all elements equal with limit 0 → n', () => {
      expect(longestSubarray([7, 7, 7, 7, 7, 7], 0)).toBe(6);
    });

    it('a difference exactly equal to the limit is allowed (<=, not <)', () => {
      expect(longestSubarray([1, 4, 1, 4], 3)).toBe(4);
      expect(longestSubarray([1, 4, 1, 4], 2)).toBe(1);
    });

    it('does not modify the input array', () => {
      const nums = [9, 3, 6, 1, 8, 2];
      longestSubarray(nums, 4);
      expect(nums).toEqual([9, 3, 6, 1, 8, 2]);
    });
  });

  describe('tricky cases', () => {
    it('the answer is at the very end: [1, 9, 9, 3, 4, 4, 5], limit 2 → 4', () => {
      expect(longestSubarray([1, 9, 9, 3, 4, 4, 5], 2)).toBe(4);
    });

    it('the answer is at the very start: [5, 6, 5, 6, 1, 20, 40], limit 1 → 4', () => {
      expect(longestSubarray([5, 6, 5, 6, 1, 20, 40], 1)).toBe(4);
    });

    it('the window must shrink by several steps at once: [1, 2, 3, 4, 100, 101], limit 3 → 4', () => {
      expect(longestSubarray([1, 2, 3, 4, 100, 101], 3)).toBe(4);
    });

    it('strictly increasing: [1, 2, … , 10], limit 4 → 5', () => {
      expect(longestSubarray([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 4)).toBe(5);
    });

    it('strictly decreasing: [10, 9, … , 1], limit 4 → 5', () => {
      expect(longestSubarray([10, 9, 8, 7, 6, 5, 4, 3, 2, 1], 4)).toBe(5);
    });

    it('[5, 1, 5, 9, 5], limit 4 → 3 (when 9 arrives, the old minimum 1 must leave the min-deque)', () => {
      expect(longestSubarray([5, 1, 5, 9, 5], 4)).toBe(3);
    });

    it('duplicates of the max: popping one copy must not lose the other ([3, 8, 8, 4, 8, 3], limit 5 → 6)', () => {
      expect(longestSubarray([3, 8, 8, 4, 8, 3], 5)).toBe(6);
    });

    it('duplicates of the max leaving the window one at a time ([8, 8, 1, 2, 3], limit 2 → 3)', () => {
      expect(longestSubarray([8, 8, 1, 2, 3], 2)).toBe(3);
    });

    it('a zig-zag that climbs slowly: [2, 5, 3, 6, 4, 7, 5, 8], limit 3 → 4 (max and min both keep changing)', () => {
      expect(longestSubarray([2, 5, 3, 6, 4, 7, 5, 8], 3)).toBe(4);
    });
  });

  describe('randomized (seeded) against an O(n²) brute force', () => {
    it('matches the brute force on 300 small random arrays', () => {
      const rng = createRng(1438);
      for (let t = 0; t < 300; t++) {
        const n = randomInt(rng, 1, 30);
        const nums = randomIntArray(rng, n, 1, 20);
        const limit = randomInt(rng, 0, 12);
        expect(longestSubarray(nums, limit), `nums=[${nums}], limit=${limit}`).toBe(bruteForce(nums, limit));
      }
    });

    it('matches the brute force on 50 larger arrays with big values', () => {
      const rng = createRng(99);
      for (let t = 0; t < 50; t++) {
        const n = randomInt(rng, 50, 400);
        const nums = randomIntArray(rng, n, 1, 1_000_000_000);
        const limit = randomInt(rng, 0, 600_000_000);
        expect(longestSubarray(nums, limit)).toBe(bruteForce(nums, limit));
      }
    });
  });

  describe('performance', () => {
    it('200,000 elements whose valid windows are ~25,000 long finish quickly (an O(n²) extend-from-every-start loop is too slow)', () => {
      // A slow triangle wave: every valid window is long, so brute force does ~n × 25,000 steps.
      const n = 200_000;
      const P = 25_000;
      const nums = Array.from({ length: n }, (_, i) => Math.abs((i % (2 * P)) - P) * 1000 + ((i * 7919) % 1000) + 1);
      const { result, ms } = measure(() => longestSubarray(nums, 12_500_000));
      expect(result).toBe(25_001);
      expect(ms, `took ${ms.toFixed(0)}ms — keep the window's max and min in two monotonic deques`).toBeLessThan(500);
    });
  });
});
