import { describe, it, expect } from 'vitest';
import { longestConsecutive } from './problem.js';
import { createRng, randomInt, randomIntArray, shuffle, measure, withoutBuiltinSort } from '../../../lib/test-utils.js';

/** Brute-force oracle: sort the distinct values and measure the longest step-by-1 stretch. */
function oracle(nums) {
  const values = [...new Set(nums)].sort((a, b) => a - b);
  let best = 0;
  let run = 0;
  for (let i = 0; i < values.length; i++) {
    run = i > 0 && values[i] === values[i - 1] + 1 ? run + 1 : 1;
    best = Math.max(best, run);
  }
  return best;
}

describe('Longest Consecutive Sequence', () => {
  describe('examples from the problem', () => {
    it('[100, 4, 200, 1, 3, 2] → 4 (1, 2, 3, 4)', () => {
      expect(longestConsecutive([100, 4, 200, 1, 3, 2])).toBe(4);
    });

    it('[0, 3, 7, 2, 5, 8, 4, 6, 0, 1] → 9 (0..8; the duplicate 0 counts once)', () => {
      expect(longestConsecutive([0, 3, 7, 2, 5, 8, 4, 6, 0, 1])).toBe(9);
    });

    it('[9, -1, 0, -2, 11] → 3 (-2, -1, 0: runs can cross zero)', () => {
      expect(longestConsecutive([9, -1, 0, -2, 11])).toBe(3);
    });
  });

  describe('edge cases', () => {
    it('empty array → 0', () => {
      expect(longestConsecutive([])).toBe(0);
    });

    it('a single element → 1', () => {
      expect(longestConsecutive([42])).toBe(1);
    });

    it('all duplicates: [5, 5, 5, 5] → 1 (duplicates do not extend a run)', () => {
      expect(longestConsecutive([5, 5, 5, 5])).toBe(1);
    });

    it('duplicates inside a run: [1, 2, 2, 3, 3, 3, 4] → 4', () => {
      expect(longestConsecutive([1, 2, 2, 3, 3, 3, 4])).toBe(4);
    });

    it('no two values adjacent: [1, 3, 5, 7] → 1 (a gap of 2 does not connect)', () => {
      expect(longestConsecutive([1, 3, 5, 7])).toBe(1);
    });

    it('all negative: [-5, -3, -4, -10] → 3', () => {
      expect(longestConsecutive([-5, -3, -4, -10])).toBe(3);
    });

    it('the extremes -10^9 and 10^9 are far apart → 1', () => {
      expect(longestConsecutive([-1_000_000_000, 1_000_000_000])).toBe(1);
    });

    it('a run touching 10^9: [10^9, 10^9 - 1, 10^9 - 2] → 3', () => {
      expect(longestConsecutive([1_000_000_000, 999_999_999, 999_999_998])).toBe(3);
    });

    it('does not modify the input array', () => {
      const nums = [3, 1, 2];
      longestConsecutive(nums);
      expect(nums).toEqual([3, 1, 2]);
    });
  });

  describe('tricky cases', () => {
    it('already sorted input: [1, 2, 3, 4, 5] → 5', () => {
      expect(longestConsecutive([1, 2, 3, 4, 5])).toBe(5);
    });

    it('reverse-sorted input: [5, 4, 3, 2, 1] → 5', () => {
      expect(longestConsecutive([5, 4, 3, 2, 1])).toBe(5);
    });

    it('the longest run comes last: [1, 2, 10, 11, 12, 13] → 4', () => {
      expect(longestConsecutive([1, 2, 10, 11, 12, 13])).toBe(4);
    });

    it('two runs of equal length: [1, 2, 3, 7, 8, 9] → 3', () => {
      expect(longestConsecutive([1, 2, 3, 7, 8, 9])).toBe(3);
    });

    it('interleaved runs: [10, 1, 11, 2, 12, 3, 13] → 4 (10..13), positions do not matter', () => {
      expect(longestConsecutive([10, 1, 11, 2, 12, 3, 13])).toBe(4);
    });

    it('a missing value splits a run: [1, 2, 3, 5, 6, 7, 8] → 4', () => {
      expect(longestConsecutive([1, 2, 3, 5, 6, 7, 8])).toBe(4);
    });

    it('works without the built-in sort (the goal is O(n), so a hash set instead of sorting)', () => {
      const nums = [50, 3, 52, 1, 51, 2, 54, 53, 4, -7];
      expect(withoutBuiltinSort(() => longestConsecutive(nums))).toBe(5);
    });
  });

  describe('randomized (seeded, reproducible)', () => {
    it('matches a sort-based oracle on 300 random arrays with many duplicates and short gaps', () => {
      const rng = createRng(606);
      for (let t = 0; t < 300; t++) {
        const nums = randomIntArray(rng, randomInt(rng, 0, 50), -30, 30);
        expect(longestConsecutive(nums), JSON.stringify(nums)).toBe(oracle(nums));
      }
    });

    it('matches the oracle on 50 shuffled arrays made of several runs', () => {
      const rng = createRng(607);
      for (let t = 0; t < 50; t++) {
        const nums = [];
        const runs = randomInt(rng, 1, 6);
        for (let r = 0; r < runs; r++) {
          const start = randomInt(rng, -1000, 1000);
          const len = randomInt(rng, 1, 40);
          for (let i = 0; i < len; i++) nums.push(start + i);
        }
        shuffle(rng, nums);
        expect(longestConsecutive(nums)).toBe(oracle(nums));
      }
    });
  });

  describe('performance', () => {
    it('100,000 numbers containing a 30,000-long run, shuffled (walking up from every element is O(n²))', () => {
      const rng = createRng(31337);
      const nums = [];
      for (let i = 0; i < 30_000; i++) nums.push(1_000_000 + i);
      // 70,000 more values spaced 3 apart, far away from the run: runs of length 1.
      for (let i = 0; nums.length < 100_000; i++) nums.push(-500_000_000 + 3 * i);
      shuffle(rng, nums);
      const { result, ms } = measure(() => longestConsecutive(nums));
      expect(result).toBe(30_000);
      expect(ms, `took ${ms.toFixed(0)}ms. Only start counting at values x where x - 1 is absent`).toBeLessThan(500);
    });

    it('a 20,000-long run whose first value is repeated 20,000 times (iterate over distinct values, not nums)', () => {
      // Starting a walk at every COPY of the run's first value walks the
      // same 20,000-long run 20,000 times.
      const rng = createRng(4242);
      const nums = [];
      for (let i = 0; i < 20_000; i++) nums.push(i);
      for (let i = 0; i < 20_000; i++) nums.push(0);
      shuffle(rng, nums);
      const { result, ms } = measure(() => longestConsecutive(nums));
      expect(result).toBe(20_000);
      expect(ms, `took ${ms.toFixed(0)}ms. Each run should be walked once, not once per duplicate`).toBeLessThan(500);
    });
  });
});
