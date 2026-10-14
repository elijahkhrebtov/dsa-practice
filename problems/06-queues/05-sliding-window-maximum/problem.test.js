import { describe, it, expect } from 'vitest';
import { maxSlidingWindow } from './problem.js';
import { createRng, randomInt, randomIntArray, measure } from '../../../lib/test-utils.js';

/** O(n·k) reference: scan every window. */
function bruteForce(nums, k) {
  const out = [];
  for (let i = 0; i + k <= nums.length; i++) {
    let m = -Infinity;
    for (let j = i; j < i + k; j++) m = Math.max(m, nums[j]);
    out.push(m);
  }
  return out;
}

describe('Sliding Window Maximum', () => {
  describe('examples from the problem', () => {
    it('[1, 3, -1, -3, 5, 3, 6, 7], k 3 → [3, 3, 5, 5, 6, 7]', () => {
      expect(maxSlidingWindow([1, 3, -1, -3, 5, 3, 6, 7], 3)).toEqual([3, 3, 5, 5, 6, 7]);
    });

    it('[1], k 1 → [1]', () => {
      expect(maxSlidingWindow([1], 1)).toEqual([1]);
    });

    it('[9, 8, 7, 6], k 4 → [9] (k = n gives exactly one window)', () => {
      expect(maxSlidingWindow([9, 8, 7, 6], 4)).toEqual([9]);
    });
  });

  describe('edge cases', () => {
    it('k = 1: every element is its own window, so the output equals the input', () => {
      expect(maxSlidingWindow([4, -2, 7, 0, 7], 1)).toEqual([4, -2, 7, 0, 7]);
    });

    it('the output has exactly n − k + 1 elements', () => {
      expect(maxSlidingWindow([5, 1, 2, 3, 4, 0, 9], 4)).toHaveLength(4);
    });

    it('k = n on an increasing array → [last element]', () => {
      expect(maxSlidingWindow([1, 2, 3, 4, 5], 5)).toEqual([5]);
    });

    it('all negative numbers: [-7, -8, -3, -9, -10], k 2 → [-7, -3, -3, -9]', () => {
      expect(maxSlidingWindow([-7, -8, -3, -9, -10], 2)).toEqual([-7, -3, -3, -9]);
    });

    it('all equal values: [2, 2, 2, 2], k 2 → [2, 2, 2]', () => {
      expect(maxSlidingWindow([2, 2, 2, 2], 2)).toEqual([2, 2, 2]);
    });

    it('the extremes of the value range ±10^5', () => {
      expect(maxSlidingWindow([-100_000, 100_000, -100_000, -100_000], 2)).toEqual([100_000, 100_000, -100_000]);
    });

    it('does not modify the input array', () => {
      const nums = [3, 1, 4, 1, 5, 9, 2, 6];
      maxSlidingWindow(nums, 3);
      expect(nums).toEqual([3, 1, 4, 1, 5, 9, 2, 6]);
    });
  });

  describe('tricky cases', () => {
    it('strictly decreasing: the max leaves the window at every step ([9, 7, 5, 3, 1], k 3 → [9, 7, 5])', () => {
      expect(maxSlidingWindow([9, 7, 5, 3, 1], 3)).toEqual([9, 7, 5]);
    });

    it('strictly increasing: the newest element is always the max ([1, 3, 5, 7, 9], k 3 → [5, 7, 9])', () => {
      expect(maxSlidingWindow([1, 3, 5, 7, 9], 3)).toEqual([5, 7, 9]);
    });

    it('a big value expires exactly when it slides out ([9, 1, 2, 3], k 3 → [9, 3])', () => {
      // Off-by-one trap: 9 is in window [0..2] but not in [1..3].
      expect(maxSlidingWindow([9, 1, 2, 3], 3)).toEqual([9, 3]);
    });

    it('duplicate maximums: when one copy leaves, the other still counts ([4, 4, 1, 1], k 2 → [4, 4, 1])', () => {
      expect(maxSlidingWindow([4, 4, 1, 1], 2)).toEqual([4, 4, 1]);
    });

    it('duplicate maximums spread apart: [5, 1, 5, 1, 1], k 3 → [5, 5, 5]', () => {
      expect(maxSlidingWindow([5, 1, 5, 1, 1], 3)).toEqual([5, 5, 5]);
    });

    it('the second-largest becomes the max after the largest expires ([1, 3, 1, 2, 0, 5], k 3 → [3, 3, 2, 5])', () => {
      expect(maxSlidingWindow([1, 3, 1, 2, 0, 5], 3)).toEqual([3, 3, 2, 5]);
    });

    it('a valley then a peak: [7, 2, 4], k 2 → [7, 4]', () => {
      expect(maxSlidingWindow([7, 2, 4], 2)).toEqual([7, 4]);
    });

    it('zeros are values, not "empty": [0, -1, -2, 0], k 2 → [0, -1, 0]', () => {
      expect(maxSlidingWindow([0, -1, -2, 0], 2)).toEqual([0, -1, 0]);
    });
  });

  describe('randomized (seeded) against an O(n·k) brute force', () => {
    it('matches the brute force on 300 small random arrays with small values (lots of duplicates)', () => {
      const rng = createRng(239);
      for (let t = 0; t < 300; t++) {
        const n = randomInt(rng, 1, 30);
        const k = randomInt(rng, 1, n);
        const nums = randomIntArray(rng, n, -5, 5);
        expect(maxSlidingWindow(nums, k), `nums=[${nums}], k=${k}`).toEqual(bruteForce(nums, k));
      }
    });

    it('matches the brute force on 50 larger arrays over the full value range', () => {
      const rng = createRng(4242);
      for (let t = 0; t < 50; t++) {
        const n = randomInt(rng, 100, 1000);
        const k = randomInt(rng, 1, n);
        const nums = randomIntArray(rng, n, -100_000, 100_000);
        expect(maxSlidingWindow(nums, k)).toEqual(bruteForce(nums, k));
      }
    });
  });

  describe('performance', () => {
    it('n = 200,000 strictly decreasing, k = 50,000 is fast (O(n·k) rescanning, even "only when the max expires", does ~7.5·10^9 steps)', () => {
      const n = 200_000;
      const k = 50_000;
      const nums = Array.from({ length: n }, (_, i) => 100_000 - i); // strictly decreasing: 100,000 … -99,999
      const { result, ms } = measure(() => maxSlidingWindow(nums, k));
      expect(result).toHaveLength(n - k + 1);
      expect(result[0]).toBe(100_000);
      expect(result[result.length - 1]).toBe(nums[n - k]);
      expect(result[12_345]).toBe(nums[12_345]);
      expect(ms, `took ${ms.toFixed(0)}ms — aim for O(n), independent of k`).toBeLessThan(500);
    });

    it('n = 200,000 pseudo-random values, k = 50,000 is fast (scanning each window is O(n·k))', () => {
      const n = 200_000;
      const k = 50_000;
      const nums = Array.from({ length: n }, (_, i) => ((i * 2654435761) % 200_001) - 100_000);
      const { result, ms } = measure(() => maxSlidingWindow(nums, k));
      expect(result).toHaveLength(n - k + 1);
      // Spot-check a few windows directly.
      for (const start of [0, 777, 99_999, n - k]) {
        let m = -Infinity;
        for (let j = start; j < start + k; j++) m = Math.max(m, nums[j]);
        expect(result[start], `window starting at ${start}`).toBe(m);
      }
      expect(ms, `took ${ms.toFixed(0)}ms — aim for O(n), independent of k`).toBeLessThan(500);
    });
  });
});
