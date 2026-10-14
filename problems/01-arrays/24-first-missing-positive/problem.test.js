import { describe, it, expect } from 'vitest';
import { firstMissingPositive } from './problem.js';
import { createRng, randomInt, shuffle, measure, withoutBuiltinSort } from '../../../lib/test-utils.js';

/** Simple O(n)-space oracle: put everything in a Set and count up from 1. */
function oracle(nums) {
  const seen = new Set(nums);
  let k = 1;
  while (seen.has(k)) k++;
  return k;
}

/** Runs the solution on a copy, since it is allowed to scramble its input. */
const solve = (nums) => firstMissingPositive([...nums]);

describe('First Missing Positive', () => {
  describe('examples from the problem', () => {
    it('[1, 2, 0] → 3', () => {
      expect(solve([1, 2, 0])).toBe(3);
    });

    it('[3, 4, -1, 1] → 2', () => {
      expect(solve([3, 4, -1, 1])).toBe(2);
    });

    it('[7, 8, 9, 11, 12] → 1 (1 itself is missing)', () => {
      expect(solve([7, 8, 9, 11, 12])).toBe(1);
    });
  });

  describe('edge cases', () => {
    it('[1] → 2 (the answer can be n + 1)', () => {
      expect(solve([1])).toBe(2);
    });

    it('[2] → 1', () => {
      expect(solve([2])).toBe(1);
    });

    it('[0] → 1 (0 is not positive)', () => {
      expect(solve([0])).toBe(1);
    });

    it('[-5] → 1', () => {
      expect(solve([-5])).toBe(1);
    });

    it('only non-positive values: [0, -1, -2, -3] → 1', () => {
      expect(solve([0, -1, -2, -3])).toBe(1);
    });

    it('32-bit extremes: [2147483647, -2147483648, 1] → 2', () => {
      expect(solve([2 ** 31 - 1, -(2 ** 31), 1])).toBe(2);
    });
  });

  describe('tricky cases', () => {
    it('a full permutation of 1..n in reverse: [5, 4, 3, 2, 1] → 6', () => {
      expect(solve([5, 4, 3, 2, 1])).toBe(6);
    });

    it('a full permutation, shuffled: [2, 3, 1] → 4', () => {
      expect(solve([2, 3, 1])).toBe(4);
    });

    it('duplicates: [1, 1] → 2 (a swap-into-place loop must not spin forever on equal values)', () => {
      expect(solve([1, 1])).toBe(2);
    });

    it('duplicates hiding a gap: [1, 1, 2, 2] → 3', () => {
      expect(solve([1, 1, 2, 2])).toBe(3);
    });

    it('all copies of one value: [2, 2, 2] → 1', () => {
      expect(solve([2, 2, 2])).toBe(1);
    });

    it('values larger than n are irrelevant: [1, 1000, 2, 999] → 3', () => {
      expect(solve([1, 1000, 2, 999])).toBe(3);
    });

    it('the value n itself counts: [4, 1, 2, 3] → 5, but [4, 1, 2, 5] → 3', () => {
      expect(solve([4, 1, 2, 3])).toBe(5);
      expect(solve([4, 1, 2, 5])).toBe(3);
    });

    it('[1, 2, 3, 4, 5, 6, 7, 8, 9, 20] → 10 (the missing value right before n + 1)', () => {
      expect(solve([1, 2, 3, 4, 5, 6, 7, 8, 9, 20])).toBe(10);
    });

    it('long swap chains: [2, 3, 4, 5, 6, 1] → 7', () => {
      expect(solve([2, 3, 4, 5, 6, 1])).toBe(7);
    });

    it('solves it without the built-in sort (sorting is O(n log n); the goal is O(n))', () => {
      expect(withoutBuiltinSort(() => solve([3, 4, -1, 1, 9, 2, 2, 0]))).toBe(5);
    });
  });

  describe('randomized (seeded) against a Set-based oracle', () => {
    it('matches on 500 random arrays with negatives, duplicates and large values', () => {
      const rng = createRng(24);
      for (let t = 0; t < 500; t++) {
        const n = randomInt(rng, 1, 30);
        const nums = Array.from({ length: n }, () => {
          const r = rng();
          if (r < 0.7) return randomInt(rng, 1, n + 1); // mostly in the interesting range
          if (r < 0.85) return randomInt(rng, -5, 0);
          return randomInt(rng, n + 2, 1000);
        });
        expect(solve(nums), `nums = [${nums}]`).toBe(oracle(nums));
      }
    });

    it('matches on 200 shuffled permutations of 1..n with one value removed or replaced', () => {
      const rng = createRng(2424);
      for (let t = 0; t < 200; t++) {
        const n = randomInt(rng, 1, 40);
        const nums = shuffle(rng, Array.from({ length: n }, (_, i) => i + 1));
        const mode = randomInt(rng, 0, 2);
        if (mode === 1) nums[randomInt(rng, 0, n - 1)] = -1;
        if (mode === 2) nums[randomInt(rng, 0, n - 1)] = nums[randomInt(rng, 0, n - 1)];
        expect(solve(nums), `nums = [${nums}]`).toBe(oracle(nums));
      }
    });
  });

  describe('performance', () => {
    it('10 arrays of 100,000 numbers stay fast (testing 1, 2, 3, … with a linear scan each is O(n²))', () => {
      const rng = createRng(99);
      const n = 100_000;
      const inputs = [];
      for (let k = 0; k < 10; k++) {
        const nums = shuffle(rng, Array.from({ length: n }, (_, i) => i + 1));
        if (k % 2 === 1) nums[randomInt(rng, 0, n - 1)] = n + 5; // knocks out one value → answer in the middle
        inputs.push(nums);
      }
      const expected = inputs.map(oracle);

      const budget = 500;
      let total = 0;
      let done = 0;
      for (let k = 0; k < inputs.length; k++) {
        const copy = [...inputs[k]]; // copied outside the timed part
        const { result, ms } = measure(() => firstMissingPositive(copy));
        total += ms;
        expect(result).toBe(expected[k]);
        done++;
        if (total > budget) break; // stop early so a slow solution fails fast
      }
      expect(done, `the ${budget}ms budget ran out after ${done} of 10 arrays (${total.toFixed(0)}ms) — aim for O(n)`).toBe(10);
      expect(total, `took ${total.toFixed(0)}ms — aim for O(n)`).toBeLessThan(budget);
    });
  });
});
