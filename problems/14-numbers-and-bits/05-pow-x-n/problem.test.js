import { describe, it, expect } from 'vitest';
import { myPow } from './problem.js';
import { createRng, randomInt, measure } from '../../../lib/test-utils.js';

const realPow = Math.pow; // the oracle; saved before any test replaces Math.pow
const MAX_N = 2 ** 31 - 1;
const MIN_N = -(2 ** 31);

/**
 * Relative-tolerance comparison: |actual − expected| ≤ tol · max(1, |expected|).
 * Repeated squaring with a huge n legitimately accumulates ~1e-8 relative
 * error, so the big-exponent tests use a looser tolerance.
 */
function expectClose(actual, expected, tol = 1e-10, label = '') {
  expect(typeof actual, `${label} should return a number`).toBe('number');
  const err = Math.abs(actual - expected);
  const allowed = tol * Math.max(1, Math.abs(expected));
  expect(err <= allowed, `${label} expected ≈ ${expected}, got ${actual}`).toBe(true);
}

/** Runs fn with Math.pow replaced by a function that throws. */
function withoutMathPow(fn) {
  Math.pow = () => {
    throw new Error('Math.pow is not allowed in this problem — implement the power yourself.');
  };
  try {
    return fn();
  } finally {
    Math.pow = realPow;
  }
}

describe('Pow(x, n)', () => {
  describe('examples from the problem', () => {
    it('2^10 → 1024', () => {
      expectClose(myPow(2, 10), 1024);
    });

    it('2.1^3 → 9.261 (approximately: floating point)', () => {
      expectClose(myPow(2.1, 3), 9.261);
    });

    it('2^-2 → 0.25 (a negative exponent means 1 / x^|n|)', () => {
      expectClose(myPow(2, -2), 0.25);
    });
  });

  describe('edge cases', () => {
    it('n = 0 → 1 for any non-zero base, including negative and fractional ones', () => {
      expect(myPow(5, 0)).toBe(1);
      expect(myPow(-3.7, 0)).toBe(1);
      expect(myPow(0.0001, 0)).toBe(1);
    });

    it('n = 1 → x itself', () => {
      expectClose(myPow(-42.5, 1), -42.5);
      expectClose(myPow(0.3, 1), 0.3);
    });

    it('n = −1 → 1 / x', () => {
      expectClose(myPow(4, -1), 0.25);
      expectClose(myPow(-0.5, -1), -2);
    });

    it('0^5 → 0 (zero base with a positive exponent)', () => {
      expect(myPow(0, 5)).toBe(0);
    });

    it('1^n → 1 and (−1)^n alternates sign with the parity of n', () => {
      expect(myPow(1, 1000)).toBe(1);
      expect(myPow(-1, 4)).toBe(1);
      expect(myPow(-1, 5)).toBe(-1);
      expect(myPow(-1, -3)).toBe(-1);
    });
  });

  describe('tricky cases', () => {
    it('negative base: (−2)^3 → −8, (−2)^4 → 16, (−2)^−3 → −0.125 (the sign depends on n\'s parity)', () => {
      expectClose(myPow(-2, 3), -8);
      expectClose(myPow(-2, 4), 16);
      expectClose(myPow(-2, -3), -0.125);
    });

    it('fractional base with a negative exponent grows: 0.5^−10 → 1024', () => {
      expectClose(myPow(0.5, -10), 1024);
    });

    it('34.00515^−3 → ≈ 2.5431e-5 (tiny results are compared relatively, not with a fixed number of decimals)', () => {
      expectClose(myPow(34.00515, -3), realPow(34.00515, -3));
    });

    it('n a power of two and n = 2^k − 1: 1.1^64 and 1.001^1023 (every bit of n set)', () => {
      expectClose(myPow(1.1, 64), realPow(1.1, 64));
      expectClose(myPow(1.001, 1023), realPow(1.001, 1023));
    });

    it('odd n where halving rounds down: 3^13 → 1594323 (13 = 0b1101)', () => {
      expectClose(myPow(3, 13), 1594323);
    });

    it('moderately large n: 0.9999^100000 → ≈ 4.5e-5', () => {
      expectClose(myPow(0.9999, 100_000), realPow(0.9999, 100_000), 1e-8);
    });

    it('does not call Math.pow', () => {
      const r = withoutMathPow(() => myPow(1.5, 7));
      expectClose(r, 17.0859375);
    });
  });

  describe('randomized (seeded, reproducible)', () => {
    it('matches Math.pow on 1,000 random bases in [−3, 3] and exponents in [−40, 40]', () => {
      const rng = createRng(5);
      let checked = 0;
      while (checked < 1000) {
        const x = randomInt(rng, -300, 300) / 100;
        const n = randomInt(rng, -40, 40);
        if (x === 0 && n <= 0) continue; // excluded by the constraints
        const expected = realPow(x, n);
        if (Math.abs(expected) > 1e4) continue; // outside the constraints
        expectClose(myPow(x, n), expected, 1e-10, `myPow(${x}, ${n}):`);
        checked++;
      }
    });
  });

  describe('performance (|n| near 2^31: a loop of n multiplications takes seconds)', () => {
    it('1.0000000001^(2^31 − 1) → ≈ 1.2395 and (−1)^(2^31 − 1) → −1, each well under a second', () => {
      const cases = [
        [1.0000000001, MAX_N, realPow(1.0000000001, MAX_N)],
        [-1, MAX_N, -1],
        [0.99999999, MAX_N, realPow(0.99999999, MAX_N)],
      ];
      for (const [x, n, expected] of cases) {
        const { result, ms } = measure(() => myPow(x, n));
        expect(ms, `myPow(${x}, ${n}) took ${ms.toFixed(0)}ms — halve the exponent instead of looping n times`).toBeLessThan(500);
        expectClose(result, expected, 1e-6, `myPow(${x}, ${n}):`);
      }
    });

    it('n = −2^31, the most negative 32-bit integer (watch out: n >> 1 breaks on |n| = 2^31; use / or >>>)', () => {
      const cases = [
        [1.0000000001, MIN_N, realPow(1.0000000001, MIN_N)], // ≈ 0.80674
        [1, MIN_N, 1],
        [-1, MIN_N, 1], // 2^31 is even
        [2, MIN_N, 0], // 1 / 2^(2^31) underflows to 0
      ];
      for (const [x, n, expected] of cases) {
        const { result, ms } = measure(() => myPow(x, n));
        expect(ms, `myPow(${x}, ${n}) took ${ms.toFixed(0)}ms — halve the exponent instead of looping n times`).toBeLessThan(500);
        expectClose(result, expected, 1e-6, `myPow(${x}, ${n}):`);
      }
    });
  });
});
