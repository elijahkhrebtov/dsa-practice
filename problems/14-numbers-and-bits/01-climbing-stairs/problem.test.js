import { describe, it, expect } from 'vitest';
import { climbStairs } from './problem.js';
import { measure } from '../../../lib/test-utils.js';

/** Binomial coefficient C(n, k) for small n (exact in a float64). */
function binomial(n, k) {
  let r = 1;
  for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i;
  return Math.round(r);
}

/**
 * Oracle by counting, not recursion: a sequence with k two-steps has n - k
 * moves in total, and we choose which k of them are the 2s → C(n - k, k).
 */
function countByCombinatorics(n) {
  let total = 0;
  for (let k = 0; 2 * k <= n; k++) total += binomial(n - k, k);
  return total;
}

describe('Climbing Stairs', () => {
  describe('examples from the problem', () => {
    it('n = 2 → 2 (1+1, 2)', () => {
      expect(climbStairs(2)).toBe(2);
    });

    it('n = 3 → 3 (1+1+1, 1+2, 2+1: order matters)', () => {
      expect(climbStairs(3)).toBe(3);
    });

    it('n = 5 → 8 (ways(4) + ways(3) = 5 + 3)', () => {
      expect(climbStairs(5)).toBe(8);
    });
  });

  describe('edge cases', () => {
    it('n = 1 → 1 (a single 1-step; there is no way to use a 2-step)', () => {
      expect(climbStairs(1)).toBe(1);
    });

    it('n = 4 → 5 (1111, 112, 121, 211, 22)', () => {
      expect(climbStairs(4)).toBe(5);
    });

    it('returns a number, not a string or BigInt', () => {
      expect(typeof climbStairs(10)).toBe('number');
    });
  });

  describe('tricky cases', () => {
    it('n = 10 → 89 (the sequence is Fibonacci shifted by one: ways(n) = fib(n + 1))', () => {
      expect(climbStairs(10)).toBe(89);
    });

    it('n = 20 → 10946', () => {
      expect(climbStairs(20)).toBe(10946);
    });

    it('n = 30 → 1346269', () => {
      expect(climbStairs(30)).toBe(1346269);
    });

    it('each answer equals the sum of the previous two (the recurrence holds for 3 ≤ n ≤ 30)', () => {
      for (let n = 3; n <= 30; n++) {
        expect(climbStairs(n), `n = ${n}`).toBe(climbStairs(n - 1) + climbStairs(n - 2));
      }
    });

    it('calling the function repeatedly gives the same answers (no state leaks between calls)', () => {
      expect(climbStairs(6)).toBe(13);
      expect(climbStairs(2)).toBe(2);
      expect(climbStairs(6)).toBe(13);
      expect(climbStairs(1)).toBe(1);
    });
  });

  describe('exhaustive check against a counting formula', () => {
    it('matches Σ C(n − k, k) over the number k of 2-steps, for every n from 1 to 30', () => {
      for (let n = 1; n <= 30; n++) {
        expect(climbStairs(n), `n = ${n}`).toBe(countByCombinatorics(n));
      }
    });
  });

  describe('performance', () => {
    it('n = 45 → 1836311903 in well under a second (plain recursion makes billions of calls and takes seconds)', () => {
      // A memoized or bottom-up solution answers in microseconds. Unmemoized
      // recursion still finishes, but only after several seconds.
      const { result, ms } = measure(() => climbStairs(45));
      expect(result).toBe(1836311903);
      expect(ms, `took ${ms.toFixed(0)}ms — each subproblem should be solved only once`).toBeLessThan(500);
    });
  });
});
