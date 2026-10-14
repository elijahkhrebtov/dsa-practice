import { describe, it, expect } from 'vitest';
import { rob } from './problem.js';
import { createRng, randomInt, randomIntArray, measure } from '../../../lib/test-utils.js';

/** Brute force: try every subset of houses (as a bitmask) with no two adjacent ones. */
function bruteForce(nums) {
  const n = nums.length;
  let best = 0;
  for (let mask = 0; mask < 1 << n; mask++) {
    if (mask & (mask << 1)) continue; // two adjacent houses chosen
    let sum = 0;
    for (let i = 0; i < n; i++) if (mask & (1 << i)) sum += nums[i];
    if (sum > best) best = sum;
  }
  return best;
}

describe('House Robber', () => {
  describe('examples from the problem', () => {
    it('[1, 2, 3, 1] → 4 (houses 0 and 2)', () => {
      expect(rob([1, 2, 3, 1])).toBe(4);
    });

    it('[2, 7, 9, 3, 1] → 12 (houses 0, 2 and 4)', () => {
      expect(rob([2, 7, 9, 3, 1])).toBe(12);
    });

    it('[2, 1, 1, 2] → 4 (skip two houses in a row: "every other house" only gives 3)', () => {
      expect(rob([2, 1, 1, 2])).toBe(4);
    });
  });

  describe('edge cases', () => {
    it('a single house: [5] → 5', () => {
      expect(rob([5])).toBe(5);
    });

    it('a single empty house: [0] → 0', () => {
      expect(rob([0])).toBe(0);
    });

    it('two houses: take the richer one — [2, 9] → 9 and [9, 2] → 9', () => {
      expect(rob([2, 9])).toBe(9);
      expect(rob([9, 2])).toBe(9);
    });

    it('three houses where the middle one beats both ends: [2, 10, 3] → 10', () => {
      expect(rob([2, 10, 3])).toBe(10);
    });

    it('three houses where the two ends win: [4, 7, 5] → 9', () => {
      expect(rob([4, 7, 5])).toBe(9);
    });

    it('all houses empty: [0, 0, 0, 0] → 0', () => {
      expect(rob([0, 0, 0, 0])).toBe(0);
    });

    it('all houses equal: [400 × 9] → 2000 (houses 0, 2, 4, 6, 8)', () => {
      expect(rob(new Array(9).fill(400))).toBe(2000);
    });

    it('does not modify the input', () => {
      const nums = [2, 7, 9, 3, 1];
      rob(nums);
      expect(nums).toEqual([2, 7, 9, 3, 1]);
    });
  });

  describe('tricky cases', () => {
    it('greedily taking the richest house first fails: [3, 4, 3] → 6', () => {
      expect(rob([3, 4, 3])).toBe(6);
    });

    it('both ends, skipping the middle two: [5, 1, 1, 5] → 10', () => {
      expect(rob([5, 1, 1, 5])).toBe(10);
    });

    it('the best plan mixes gaps of one and two houses: [6, 1, 2, 7, 1, 1, 8] → 21', () => {
      // 6 + 7 + 8 = 21 (houses 0, 3, 6)
      expect(rob([6, 1, 2, 7, 1, 1, 8])).toBe(21);
    });

    it('zeros between rich houses: [10, 0, 0, 10, 0, 10] → 30', () => {
      expect(rob([10, 0, 0, 10, 0, 10])).toBe(30);
    });

    it('a decreasing street: [9, 8, 7, 6, 5, 4] → 21 (9 + 7 + 5)', () => {
      expect(rob([9, 8, 7, 6, 5, 4])).toBe(21);
    });

    it('the last house matters: [1, 1, 1, 100] → 101', () => {
      expect(rob([1, 1, 1, 100])).toBe(101);
    });
  });

  describe('exhaustive small cases', () => {
    it('every street of 1–7 houses with amounts 0–3 matches trying all subsets', () => {
      for (let n = 1; n <= 7; n++) {
        const nums = new Array(n);
        for (let code = 0; code < 4 ** n; code++) {
          let c = code;
          for (let i = 0; i < n; i++) {
            nums[i] = c % 4;
            c = Math.floor(c / 4);
          }
          const want = bruteForce(nums);
          const got = rob(nums);
          if (got !== want) expect(got, `nums = [${nums}]`).toBe(want);
        }
      }
    });
  });

  describe('randomized (seeded, reproducible)', () => {
    it('matches trying all subsets on 200 random streets of up to 16 houses', () => {
      const rng = createRng(15);
      for (let t = 0; t < 200; t++) {
        const nums = randomIntArray(rng, randomInt(rng, 1, 16), 0, 400);
        expect(rob(nums), `nums = [${nums}]`).toBe(bruteForce(nums));
      }
    });
  });

  describe('performance', () => {
    it('41 houses (plain rob/skip recursion makes ~10^8 calls here — remember or build up sub-results)', () => {
      const nums = Array.from({ length: 41 }, (_, i) => (i * 37) % 11); // 0, 4, 8, 1, 5, 9, 2, …
      const { result, ms } = measure(() => rob(nums));
      expect(result).toBe(125);
      expect(ms, `took ${ms.toFixed(0)}ms — think O(n)`).toBeLessThan(500);
    });
  });
});
