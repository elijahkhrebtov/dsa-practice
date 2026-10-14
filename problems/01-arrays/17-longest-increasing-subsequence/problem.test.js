import { describe, it, expect } from 'vitest';
import { lengthOfLIS } from './problem.js';
import { createRng, randomInt, randomIntArray, measure } from '../../../lib/test-utils.js';

/** Brute force: check every subsequence (bitmask) — only for tiny arrays. */
function bruteForce(nums) {
  const n = nums.length;
  let best = 0;
  for (let mask = 1; mask < 1 << n; mask++) {
    let prev = -Infinity;
    let len = 0;
    let ok = true;
    for (let i = 0; i < n && ok; i++) {
      if (!(mask & (1 << i))) continue;
      if (nums[i] <= prev) ok = false;
      prev = nums[i];
      len++;
    }
    if (ok && len > best) best = len;
  }
  return best;
}

/**
 * `blocks` blocks of `size` values each. Inside a block the values decrease;
 * every block is entirely above the previous one. An increasing subsequence
 * can take at most one value per block, so the LIS is exactly `blocks`.
 */
function staircase(blocks, size) {
  const nums = [];
  for (let b = 0; b < blocks; b++) {
    for (let j = size - 1; j >= 0; j--) nums.push(b * size + j);
  }
  return nums;
}

describe('Longest Increasing Subsequence', () => {
  describe('examples from the problem', () => {
    it('[10, 9, 2, 5, 3, 7, 101, 18] → 4 (e.g. 2, 3, 7, 101)', () => {
      expect(lengthOfLIS([10, 9, 2, 5, 3, 7, 101, 18])).toBe(4);
    });

    it('[0, 1, 0, 3, 2, 3] → 4 (0, 1, 2, 3)', () => {
      expect(lengthOfLIS([0, 1, 0, 3, 2, 3])).toBe(4);
    });

    it('[7, 7, 7, 7, 7, 7, 7] → 1 (equal values are not increasing)', () => {
      expect(lengthOfLIS([7, 7, 7, 7, 7, 7, 7])).toBe(1);
    });
  });

  describe('edge cases', () => {
    it('a single element: [5] → 1', () => {
      expect(lengthOfLIS([5])).toBe(1);
    });

    it('two elements: [1, 2] → 2 and [2, 1] → 1', () => {
      expect(lengthOfLIS([1, 2])).toBe(2);
      expect(lengthOfLIS([2, 1])).toBe(1);
    });

    it('strictly increasing: [1..10] → 10 (the whole array)', () => {
      expect(lengthOfLIS([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])).toBe(10);
    });

    it('strictly decreasing: [10..1] → 1', () => {
      expect(lengthOfLIS([10, 9, 8, 7, 6, 5, 4, 3, 2, 1])).toBe(1);
    });

    it('equal neighbours do not extend the run: [1, 1, 2, 2, 3, 3] → 3', () => {
      expect(lengthOfLIS([1, 1, 2, 2, 3, 3])).toBe(3);
    });

    it('negative numbers: [-5, -3, -4, -1] → 3', () => {
      expect(lengthOfLIS([-5, -3, -4, -1])).toBe(3);
    });

    it('values at ±10^9: [10^9, -10^9, 0, 10^9] → 3', () => {
      expect(lengthOfLIS([1_000_000_000, -1_000_000_000, 0, 1_000_000_000])).toBe(3);
    });

    it('does not modify the input', () => {
      const nums = [10, 9, 2, 5, 3, 7, 101, 18];
      lengthOfLIS(nums);
      expect(nums).toEqual([10, 9, 2, 5, 3, 7, 101, 18]);
    });
  });

  describe('tricky cases', () => {
    it('starting from the first element is not always best: [10, 1, 2, 3] → 3', () => {
      expect(lengthOfLIS([10, 1, 2, 3])).toBe(3);
    });

    it('the longest contiguous run is shorter than the answer: [3, 4, -1, 0, 6, 2, 3] → 4 (-1, 0, 2, 3)', () => {
      expect(lengthOfLIS([3, 4, -1, 0, 6, 2, 3])).toBe(4);
    });

    it('a later, smaller value opens a longer chain: [1, 3, 6, 7, 9, 4, 10, 5, 6] → 6 (1, 3, 6, 7, 9, 10)', () => {
      expect(lengthOfLIS([1, 3, 6, 7, 9, 4, 10, 5, 6])).toBe(6);
    });

    it('[4, 10, 4, 3, 8, 9] → 3 (4, 8, 9)', () => {
      expect(lengthOfLIS([4, 10, 4, 3, 8, 9])).toBe(3);
    });

    it('zig-zag: [1, 5, 2, 6, 3, 7, 4, 8] → 5', () => {
      expect(lengthOfLIS([1, 5, 2, 6, 3, 7, 4, 8])).toBe(5);
    });

    it('[0, 8, 4, 12, 2, 10, 6, 14, 1, 9, 5, 13, 3, 11, 7, 15] → 6 (a classic)', () => {
      expect(lengthOfLIS([0, 8, 4, 12, 2, 10, 6, 14, 1, 9, 5, 13, 3, 11, 7, 15])).toBe(6);
    });

    it('a small value at the end must not lengthen the answer: [2, 5, 3, 1] → 2', () => {
      expect(lengthOfLIS([2, 5, 3, 1])).toBe(2);
    });
  });

  describe('exhaustive small cases', () => {
    it('every array of length 1–7 with values 0–3 matches checking all subsequences', () => {
      for (let n = 1; n <= 7; n++) {
        const nums = new Array(n);
        for (let code = 0; code < 4 ** n; code++) {
          let c = code;
          for (let i = 0; i < n; i++) {
            nums[i] = c % 4;
            c = Math.floor(c / 4);
          }
          const want = bruteForce(nums);
          const got = lengthOfLIS(nums);
          if (got !== want) expect(got, `nums = [${nums}]`).toBe(want);
        }
      }
    });
  });

  describe('randomized (seeded, reproducible)', () => {
    it('matches checking all subsequences on 200 random arrays of up to 14 elements', () => {
      const rng = createRng(17);
      for (let t = 0; t < 200; t++) {
        const n = randomInt(rng, 1, 14);
        const nums = randomIntArray(rng, n, -20, 20);
        expect(lengthOfLIS(nums), `nums = [${nums}]`).toBe(bruteForce(nums));
      }
    });
  });

  describe('performance', () => {
    it('baseline: 2,500 random values → 99 (O(n²) DP is fine; trying all subsequences is not)', () => {
      const nums = randomIntArray(createRng(17), 2500, -1_000_000_000, 1_000_000_000);
      const { result, ms } = measure(() => lengthOfLIS(nums));
      expect(result).toBe(99);
      expect(ms, `took ${ms.toFixed(0)}ms`).toBeLessThan(1000);
    });

    it('baseline: 2,500 values from a small range (many duplicates) → 67', () => {
      const nums = randomIntArray(createRng(18), 2500, 0, 100);
      expect(lengthOfLIS(nums)).toBe(67);
    });

    it('baseline: 2,500 increasing → 2500, 2,500 decreasing → 1, 50 decreasing blocks of 50 → 50', () => {
      expect(lengthOfLIS(Array.from({ length: 2500 }, (_, i) => i))).toBe(2500);
      expect(lengthOfLIS(Array.from({ length: 2500 }, (_, i) => -i))).toBe(1);
      expect(lengthOfLIS(staircase(50, 50))).toBe(50);
    });

    it('FOLLOW-UP O(n log n): 50,000 values in 250 decreasing blocks → 250 (the O(n²) DP takes seconds here)', () => {
      const nums = staircase(250, 200);
      const { result, ms } = measure(() => lengthOfLIS(nums));
      expect(result).toBe(250);
      expect(ms, `took ${ms.toFixed(0)}ms — this is the follow-up: patience sorting + binary search`).toBeLessThan(500);
    });
  });
});
