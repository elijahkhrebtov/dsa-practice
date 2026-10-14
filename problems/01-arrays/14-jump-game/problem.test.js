import { describe, it, expect } from 'vitest';
import { canJump } from './problem.js';
import { createRng, randomInt, measure } from '../../../lib/test-utils.js';

/** Brute force: mark every index reachable from a reachable index — O(n · maxJump). */
function bruteForce(nums) {
  const n = nums.length;
  const reachable = new Array(n).fill(false);
  reachable[0] = true;
  for (let i = 0; i < n; i++) {
    if (!reachable[i]) continue;
    for (let j = i + 1; j <= Math.min(n - 1, i + nums[i]); j++) reachable[j] = true;
  }
  return reachable[n - 1];
}

describe('Jump Game', () => {
  describe('examples from the problem', () => {
    it('[2, 3, 1, 1, 4] → true (1 step to index 1, then 3 steps)', () => {
      expect(canJump([2, 3, 1, 1, 4])).toBe(true);
    });

    it('[3, 2, 1, 0, 4] → false (every route gets stuck on the 0 at index 3)', () => {
      expect(canJump([3, 2, 1, 0, 4])).toBe(false);
    });

    it('[0] → true (you start on the last index)', () => {
      expect(canJump([0])).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('single non-zero element: [5] → true', () => {
      expect(canJump([5])).toBe(true);
    });

    it('[0, 1] → false (stuck at the start)', () => {
      expect(canJump([0, 1])).toBe(false);
    });

    it('[1, 0] → true (the last value is irrelevant, even if it is 0)', () => {
      expect(canJump([1, 0])).toBe(true);
    });

    it('all ones: [1, 1, 1, 1, 1] → true', () => {
      expect(canJump([1, 1, 1, 1, 1])).toBe(true);
    });

    it('all zeros (more than one element): [0, 0, 0] → false', () => {
      expect(canJump([0, 0, 0])).toBe(false);
    });

    it('overshooting the end is fine: [10, 0, 0] → true', () => {
      expect(canJump([10, 0, 0])).toBe(true);
    });

    it('returns a real boolean, not a truthy/falsy number', () => {
      expect(canJump([2, 0, 0])).toBe(true);
      expect(canJump([1, 0, 0])).toBe(false);
    });
  });

  describe('tricky cases', () => {
    it('jumping over a zero: [2, 0, 1] → true', () => {
      expect(canJump([2, 0, 1])).toBe(true);
    });

    it('a jump that lands exactly on the last index: [3, 0, 0, 0] → true', () => {
      expect(canJump([3, 0, 0, 0])).toBe(true);
    });

    it('one short of the last index: [2, 0, 0, 0] → false', () => {
      expect(canJump([2, 0, 0, 0])).toBe(false);
    });

    it('always taking the LONGEST jump fails: [2, 5, 0, 0] → true (go 1 step to the 5 instead)', () => {
      expect(canJump([2, 5, 0, 0])).toBe(true);
    });

    it('always taking the SHORTEST jump fails: [2, 0, 2, 0, 1] → true (must jump over the first 0)', () => {
      expect(canJump([2, 0, 2, 0, 1])).toBe(true);
    });

    it('a zero that every route funnels into: [3, 1, 1, 0, 4] → false', () => {
      expect(canJump([3, 1, 1, 0, 4])).toBe(false);
    });

    it('a far-reaching value that is itself unreachable does not help: [1, 0, 9, 1] → false', () => {
      expect(canJump([1, 0, 9, 1])).toBe(false);
    });

    it('a long chain of ones ending in a trap: 1,000 ones, then 0, then 5 → false', () => {
      const nums = [...new Array(1000).fill(1), 0, 5];
      expect(canJump(nums)).toBe(false);
    });
  });

  describe('exhaustive small cases', () => {
    it('every array of length 1–7 with values 0–3 matches a brute-force reachability check', () => {
      for (let n = 1; n <= 7; n++) {
        const total = 4 ** n;
        const nums = new Array(n);
        for (let code = 0; code < total; code++) {
          let c = code;
          for (let i = 0; i < n; i++) {
            nums[i] = c % 4;
            c = Math.floor(c / 4);
          }
          const want = bruteForce(nums);
          const got = canJump(nums);
          if (got !== want) expect(got, `nums = [${nums}]`).toBe(want);
        }
      }
    });
  });

  describe('randomized (seeded, reproducible)', () => {
    it('matches the brute force on 500 random arrays (length up to 20, lots of zeros)', () => {
      const rng = createRng(14);
      for (let t = 0; t < 500; t++) {
        const n = randomInt(rng, 1, 20);
        const nums = Array.from({ length: n }, () => (rng() < 0.3 ? 0 : randomInt(rng, 1, 4)));
        expect(canJump(nums), `nums = [${nums}]`).toBe(bruteForce(nums));
      }
    });
  });

  describe('performance', () => {
    it('100,000 elements where every index reaches exactly the trap at n - 2 → false (an O(n²) marking DP takes seconds)', () => {
      const n = 100_000;
      // nums[i] = n - 2 - i: from every i the farthest you get is index n - 2, which holds 0.
      const nums = Array.from({ length: n }, (_, i) => Math.max(0, n - 2 - i));
      const { result, ms } = measure(() => canJump(nums));
      expect(result).toBe(false);
      expect(ms, `took ${ms.toFixed(0)}ms — think O(n)`).toBeLessThan(500);
    });

    it('100,000 elements with huge jumps everywhere → true, stays fast', () => {
      const n = 100_000;
      const nums = new Array(n).fill(100_000);
      const { result, ms } = measure(() => canJump(nums));
      expect(result).toBe(true);
      expect(ms, `took ${ms.toFixed(0)}ms — think O(n)`).toBeLessThan(500);
    });

    it('100,000 ones → true (a recursive solution may overflow the call stack here — iterate instead)', () => {
      const nums = new Array(100_000).fill(1);
      const { result, ms } = measure(() => canJump(nums));
      expect(result).toBe(true);
      expect(ms, `took ${ms.toFixed(0)}ms — think O(n)`).toBeLessThan(500);
    });
  });
});
