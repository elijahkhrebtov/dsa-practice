import { describe, it, expect } from 'vitest';
import { numSquares } from './problem.js';
import { createRng, randomInt, measure } from '../../../lib/test-utils.js';

/** True if k is a perfect square. */
function isSquare(k) {
  const r = Math.round(Math.sqrt(k));
  return r * r === k;
}

/**
 * Oracle from number theory (NOT the DP this problem is about): every n is
 * a sum of at most 4 squares (Lagrange); it needs all 4 exactly when
 * n = 4^a · (8b + 7) (Legendre); otherwise check for 1 or 2 directly.
 */
function leastSquares(n) {
  if (isSquare(n)) return 1;
  let m = n;
  while (m % 4 === 0) m /= 4;
  if (m % 8 === 7) return 4;
  for (let a = 1; a * a <= n; a++) if (isSquare(n - a * a)) return 2;
  return 3;
}

// Set when the growth test detects exponential running time, so the larger
// tests below fail immediately instead of hanging for minutes.
let exponentialDetected = false;
function requireGrowthTestPassed() {
  if (exponentialDetected) {
    throw new Error(
      'Skipped: the "n = 1 … 300" growth test showed exponential running time, and this input would hang. ' +
        'Remember results (memoization) or fill a table bottom-up first.',
    );
  }
}

describe('Perfect Squares', () => {
  describe('examples from the problem', () => {
    it('n = 12 → 3 (4 + 4 + 4; greedy 9 + 1 + 1 + 1 would give 4)', () => {
      expect(numSquares(12)).toBe(3);
    });

    it('n = 13 → 2 (4 + 9)', () => {
      expect(numSquares(13)).toBe(2);
    });

    it('n = 1 → 1 (1 is itself a perfect square)', () => {
      expect(numSquares(1)).toBe(1);
    });
  });

  describe('edge cases', () => {
    it('n = 2 → 2 (1 + 1) and n = 3 → 3 (1 + 1 + 1)', () => {
      expect(numSquares(2)).toBe(2);
      expect(numSquares(3)).toBe(3);
    });

    it('perfect squares need exactly one: 4, 9, 16, 25, 36, 49 → 1', () => {
      for (const n of [4, 9, 16, 25, 36, 49]) expect(numSquares(n), `n = ${n}`).toBe(1);
    });

    it('n = 7 → 4 (4 + 1 + 1 + 1: the smallest number that needs four squares)', () => {
      expect(numSquares(7)).toBe(4);
    });

    it('n = 28 → 4 (28 = 4 · 7; multiplying by 4 keeps a number in the "needs four" family)', () => {
      expect(numSquares(28)).toBe(4);
    });
  });

  describe('greedy traps (taking the largest square first is wrong)', () => {
    it('n = 18 → 2 (9 + 9, not 16 + 1 + 1)', () => {
      expect(numSquares(18)).toBe(2);
    });

    it('n = 32 → 2 (16 + 16, not 25 + 4 + 1 + 1 + 1)', () => {
      expect(numSquares(32)).toBe(2);
    });

    it('n = 43 → 3 (25 + 9 + 9, not 36 + 4 + 1 + 1 + 1)', () => {
      expect(numSquares(43)).toBe(3);
    });

    it('n = 48 → 3 (16 + 16 + 16, not 36 + 9 + 1 + 1 + 1)', () => {
      expect(numSquares(48)).toBe(3);
    });
  });

  describe('growth check (this is where exponential solutions are caught)', () => {
    it('n = 1 … 300, each answered in well under 200ms (unmemoized recursion explodes past n ≈ 50; it fails here instead of hanging later)', () => {
      for (let n = 1; n <= 300; n++) {
        const { result, ms } = measure(() => numSquares(n));
        if (ms >= 200) exponentialDetected = true;
        expect(ms, `numSquares(${n}) took ${ms.toFixed(0)}ms — the same remainders are being solved over and over`).toBeLessThan(200);
        expect(result, `n = ${n}`).toBe(leastSquares(n));
      }
    });
  });

  describe('larger inputs', () => {
    it('n = 10000 → 1 (100², the largest input)', () => {
      requireGrowthTestPassed();
      expect(numSquares(10_000)).toBe(1);
    });

    it('n = 9999 → 4 (9999 = 8 · 1249 + 7)', () => {
      requireGrowthTestPassed();
      expect(numSquares(9999)).toBe(4);
    });

    it('n = 9998 → 3, n = 9997 → 2, n = 9973 → 2 (a prime of the form 4k + 1)', () => {
      requireGrowthTestPassed();
      expect(numSquares(9998)).toBe(3);
      expect(numSquares(9997)).toBe(2);
      expect(numSquares(9973)).toBe(2);
    });

    it('n = 7168 → 4 (= 4^5 · 7) and n = 9216 → 1 (= 96²)', () => {
      requireGrowthTestPassed();
      expect(numSquares(7168)).toBe(4);
      expect(numSquares(9216)).toBe(1);
    });
  });

  describe('exhaustive and randomized checks (oracle: the four-square theorem)', () => {
    it('matches the oracle for every n from 1 to 1000', () => {
      requireGrowthTestPassed();
      for (let n = 1; n <= 1000; n++) expect(numSquares(n), `n = ${n}`).toBe(leastSquares(n));
    });

    it('matches the oracle for 60 random n in [1000, 10000] (seeded)', () => {
      requireGrowthTestPassed();
      const rng = createRng(4);
      for (let t = 0; t < 60; t++) {
        const n = randomInt(rng, 1000, 10_000);
        expect(numSquares(n), `n = ${n}`).toBe(leastSquares(n));
      }
    });
  });

  describe('performance', () => {
    it('n = 9999 and n = 9998 each finish well under a second (target O(n√n) ≈ 10^6 steps)', () => {
      requireGrowthTestPassed();
      for (const [n, expected] of [[9999, 4], [9998, 3]]) {
        const { result, ms } = measure(() => numSquares(n));
        expect(result).toBe(expected);
        expect(ms, `numSquares(${n}) took ${ms.toFixed(0)}ms`).toBeLessThan(1000);
      }
    });
  });
});
