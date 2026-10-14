import { describe, it, expect } from 'vitest';
import { countPrimes } from './problem.js';
import { createRng, randomInt, measure } from '../../../lib/test-utils.js';

/** Oracle: trial division. Slow, but obviously correct for small n. */
function isPrime(k) {
  if (k < 2) return false;
  for (let d = 2; d * d <= k; d++) if (k % d === 0) return false;
  return true;
}

describe('Count Primes', () => {
  describe('examples from the problem', () => {
    it('n = 10 → 4 (2, 3, 5, 7)', () => {
      expect(countPrimes(10)).toBe(4);
    });

    it('n = 13 → 5 (13 itself is not counted: strictly less than n)', () => {
      expect(countPrimes(13)).toBe(5);
    });

    it('n = 0 → 0', () => {
      expect(countPrimes(0)).toBe(0);
    });

    it('n = 1 → 0', () => {
      expect(countPrimes(1)).toBe(0);
    });
  });

  describe('edge cases', () => {
    it('n = 2 → 0 (2 is prime but not less than 2)', () => {
      expect(countPrimes(2)).toBe(0);
    });

    it('n = 3 → 1 (just 2)', () => {
      expect(countPrimes(3)).toBe(1);
    });

    it('n = 4 → 2 (2 and 3)', () => {
      expect(countPrimes(4)).toBe(2);
    });

    it('n = 14 → 6 (now 13 is below n and counts)', () => {
      expect(countPrimes(14)).toBe(6);
    });
  });

  describe('tricky cases', () => {
    it('squares of primes are composite: n = 26 → 9 and n = 50 → 15 (25 and 49 must be crossed out)', () => {
      expect(countPrimes(26)).toBe(9);
      expect(countPrimes(50)).toBe(15);
    });

    it('n = 121 → 30 and n = 122 → 30 (121 = 11² is the first number that needs 11 to be crossed out)', () => {
      expect(countPrimes(121)).toBe(30);
      expect(countPrimes(122)).toBe(30);
    });

    it('known values: π(100) = 25, π(1000) = 168, π(10^4) = 1229, π(10^5) = 9592', () => {
      expect(countPrimes(100)).toBe(25);
      expect(countPrimes(1000)).toBe(168);
      expect(countPrimes(10_000)).toBe(1229);
      expect(countPrimes(100_000)).toBe(9592);
    });

    it('n = 10^6 → 78498', () => {
      expect(countPrimes(1_000_000)).toBe(78498);
    });

    it('calling it repeatedly with different n gives independent answers (no stale sieve reused wrongly)', () => {
      expect(countPrimes(100)).toBe(25);
      expect(countPrimes(10)).toBe(4);
      expect(countPrimes(100)).toBe(25);
    });
  });

  describe('exhaustive and randomized checks against trial division', () => {
    it('matches the oracle for every n from 0 to 1500 (catches every off-by-one)', () => {
      let expected = 0; // primes < n
      for (let n = 0; n <= 1500; n++) {
        expect(countPrimes(n), `n = ${n}`).toBe(expected);
        if (isPrime(n)) expected++;
      }
    });

    it('matches the oracle for 30 random n up to 200,000 (seeded)', () => {
      const rng = createRng(17);
      const ns = Array.from({ length: 30 }, () => randomInt(rng, 0, 200_000)).sort((a, b) => a - b);
      let k = 0;
      let count = 0; // primes < k
      for (const n of ns) {
        while (k < n) {
          if (isPrime(k)) count++;
          k++;
        }
        expect(countPrimes(n), `n = ${n}`).toBe(count);
      }
    });
  });

  describe('performance', () => {
    it('n = 2·10^7 → 1270607 in under a second (trial division of every number takes several seconds)', () => {
      const { result, ms } = measure(() => countPrimes(20_000_000));
      expect(result).toBe(1270607);
      expect(ms, `took ${ms.toFixed(0)}ms — cross out multiples instead of testing each number`).toBeLessThan(1000);
    });
  });
});
