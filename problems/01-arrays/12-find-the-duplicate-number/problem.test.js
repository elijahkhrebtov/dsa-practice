import { describe, it, expect } from 'vitest';
import { findDuplicate } from './problem.js';
import { createRng, randomInt, shuffle, measure } from '../../../lib/test-utils.js';

/** Calls findDuplicate on a copy and checks afterwards that the copy is unchanged. */
function run(nums) {
  const input = [...nums];
  const result = findDuplicate(input);
  expect(input, 'the input array must not be modified').toEqual(nums);
  return result;
}

/** Builds a valid input: n + 1 values from [1, n], `dup` appearing `times` times, others at most once. */
function makeInput(rng, n, dup, times) {
  const others = shuffle(rng, Array.from({ length: n }, (_, i) => i + 1).filter((v) => v !== dup));
  const nums = [...others.slice(0, n + 1 - times), ...Array(times).fill(dup)];
  return shuffle(rng, nums);
}

describe('Find the Duplicate Number', () => {
  describe('examples from the problem', () => {
    it('[1, 3, 4, 2, 2] → 2', () => {
      expect(run([1, 3, 4, 2, 2])).toBe(2);
    });

    it('[3, 1, 3, 4, 2] → 3', () => {
      expect(run([3, 1, 3, 4, 2])).toBe(3);
    });

    it('[3, 3, 3, 3, 3] → 3 (the duplicate may appear many times)', () => {
      expect(run([3, 3, 3, 3, 3])).toBe(3);
    });
  });

  describe('edge cases', () => {
    it('smallest input, n = 1: [1, 1] → 1', () => {
      expect(run([1, 1])).toBe(1);
    });

    it('n = 2: [2, 1, 2] → 2 and [1, 1, 2] → 1', () => {
      expect(run([2, 1, 2])).toBe(2);
      expect(run([1, 1, 2])).toBe(1);
    });

    it('the duplicate is the largest value n: [1, 2, 3, 4, 4] → 4', () => {
      expect(run([1, 2, 3, 4, 4])).toBe(4);
    });

    it('the duplicate is the smallest value 1: [1, 4, 3, 2, 1] → 1', () => {
      expect(run([1, 4, 3, 2, 1])).toBe(1);
    });

    it('the two copies are adjacent: [4, 2, 2, 1, 3] → 2', () => {
      expect(run([4, 2, 2, 1, 3])).toBe(2);
    });

    it('the two copies are at the very first and very last positions: [5, 1, 2, 3, 4, 5] → 5', () => {
      expect(run([5, 1, 2, 3, 4, 5])).toBe(5);
    });
  });

  describe('tricky cases', () => {
    it('repeated three times with values missing: [2, 5, 9, 6, 9, 3, 8, 9, 7, 1] → 9 (4 is missing)', () => {
      expect(run([2, 5, 9, 6, 9, 3, 8, 9, 7, 1])).toBe(9);
    });

    it('repeated n times with only one other value: [2, 2, 2, 2, 1] → 2', () => {
      expect(run([2, 2, 2, 2, 1])).toBe(2);
    });

    it('a "sum minus n(n+1)/2" trick fails when the duplicate repeats: [1, 3, 3, 3, 5, 4] → 3', () => {
      // sum(nums) - n(n+1)/2 = 19 - 15 = 4, which is NOT the answer (2 is missing).
      expect(run([1, 3, 3, 3, 5, 4])).toBe(3);
    });

    it('an XOR trick fails too when the duplicate repeats an odd number of times: [4, 1, 4, 4, 2] → 4', () => {
      expect(run([4, 1, 4, 4, 2])).toBe(4);
    });

    it('the value at index 0 is not part of the cycle: [2, 6, 4, 1, 3, 1, 5] → 1', () => {
      expect(run([2, 6, 4, 1, 3, 1, 5])).toBe(1);
    });
  });

  describe('exhaustive small cases', () => {
    it('every valid array for n = 1..6 (all positions, all repeat counts)', () => {
      for (let n = 1; n <= 6; n++) {
        const len = n + 1;
        const nums = new Array(len).fill(1);
        const total = n ** len;
        for (let code = 0; code < total; code++) {
          // Decode `code` as a base-n number → one candidate array.
          let c = code;
          for (let i = 0; i < len; i++) {
            nums[i] = (c % n) + 1;
            c = Math.floor(c / n);
          }
          // Keep it only if exactly one value repeats.
          const count = new Array(n + 1).fill(0);
          for (const v of nums) count[v]++;
          const repeated = count.reduce((acc, k, v) => (k >= 2 ? [...acc, v] : acc), []);
          if (repeated.length !== 1) continue;
          const input = [...nums];
          const got = findDuplicate(input);
          if (got !== repeated[0]) expect(got, `nums = [${nums}]`).toBe(repeated[0]);
          if (input.some((v, i) => v !== nums[i])) expect(input, 'the input array must not be modified').toEqual(nums);
        }
      }
    });
  });

  describe('randomized (seeded, reproducible)', () => {
    it('finds the duplicate in 300 random arrays (n up to 2,000, repeated 2 to n + 1 times)', () => {
      const rng = createRng(31);
      for (let t = 0; t < 300; t++) {
        const n = randomInt(rng, 1, 2000);
        const dup = randomInt(rng, 1, n);
        // Mostly exactly twice, sometimes many times.
        const times = t % 3 === 0 ? randomInt(rng, 2, n + 1) : 2;
        const nums = makeInput(rng, n, dup, times);
        expect(run(nums), `n = ${n}, dup = ${dup}, times = ${times}`).toBe(dup);
      }
    });
  });

  describe('performance', () => {
    it('n = 150,000 with the two copies at the very end (an O(n²) pair search will be far too slow)', () => {
      const n = 150_000;
      const nums = Array.from({ length: n }, (_, i) => i + 1); // 1, 2, …, n
      nums.push(n - 1); // second copy of n - 1 at the very end (first copy at index n - 2)
      const copy = [...nums];
      const { result, ms } = measure(() => findDuplicate(nums));
      expect(result).toBe(n - 1);
      expect(nums, 'the input array must not be modified').toEqual(copy);
      expect(ms, `took ${ms.toFixed(0)}ms — think O(n) (or O(n log n)) with O(1) space`).toBeLessThan(500);
    });

    it('n = 150,000, shuffled, duplicate repeated 1,000 times, stays fast', () => {
      const rng = createRng(32);
      const n = 150_000;
      const nums = makeInput(rng, n, 77_777, 1000);
      const copy = [...nums];
      const { result, ms } = measure(() => findDuplicate(nums));
      expect(result).toBe(77_777);
      expect(nums, 'the input array must not be modified').toEqual(copy);
      expect(ms, `took ${ms.toFixed(0)}ms — think O(n) (or O(n log n)) with O(1) space`).toBeLessThan(500);
    });
  });

  // Kept last on purpose: calling a function with a frozen array can make V8
  // slow down later array accesses in it, which would distort the timings above.
  describe('read-only input', () => {
    it('works on a frozen array: even temporarily writing to it (and restoring) is not allowed', () => {
      const frozen = Object.freeze([3, 1, 3, 4, 2]);
      expect(() => findDuplicate(frozen), 'nums is frozen — do not write to it, not even temporarily').not.toThrow();
      expect(findDuplicate(frozen)).toBe(3);
    });
  });
});
