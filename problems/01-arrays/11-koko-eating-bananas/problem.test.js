import { describe, it, expect } from 'vitest';
import { minEatingSpeed } from './problem.js';
import { createRng, randomInt, randomIntArray, measure } from '../../../lib/test-utils.js';

/** Hours needed to eat all piles at speed k. */
function hoursAt(piles, k) {
  let hours = 0;
  for (const p of piles) hours += Math.ceil(p / k);
  return hours;
}

/** Brute force: try every speed from 1 upward (only used on small piles). */
function bruteForce(piles, h) {
  let k = 1;
  while (hoursAt(piles, k) > h) k++;
  return k;
}

describe('Koko Eating Bananas', () => {
  describe('examples from the problem', () => {
    it('[3, 6, 7, 11], h 8 → 4 (k = 3 would need 10 hours)', () => {
      expect(minEatingSpeed([3, 6, 7, 11], 8)).toBe(4);
    });

    it('[30, 11, 23, 4, 20], h 5 → 30 (one pile per hour: k must cover the biggest pile)', () => {
      expect(minEatingSpeed([30, 11, 23, 4, 20], 5)).toBe(30);
    });

    it('[30, 11, 23, 4, 20], h 6 → 23 (only the 30-pile gets two hours)', () => {
      expect(minEatingSpeed([30, 11, 23, 4, 20], 6)).toBe(23);
    });
  });

  describe('edge cases', () => {
    it('single pile, one hour: [5], h 1 → 5', () => {
      expect(minEatingSpeed([5], 1)).toBe(5);
    });

    it('single pile, plenty of time: [5], h 5 → 1 (the speed never drops below 1)', () => {
      expect(minEatingSpeed([5], 5)).toBe(1);
      expect(minEatingSpeed([5], 1_000_000_000)).toBe(1);
    });

    it('single pile of 1 banana: [1], h 1 → 1', () => {
      expect(minEatingSpeed([1], 1)).toBe(1);
    });

    it('h equals the number of piles → the answer is the largest pile', () => {
      expect(minEatingSpeed([2, 9, 4, 7], 4)).toBe(9);
    });

    it('all piles equal: [4, 4, 4, 4], h 8 → 2', () => {
      expect(minEatingSpeed([4, 4, 4, 4], 8)).toBe(2);
    });

    it('h at least the total number of bananas → 1', () => {
      expect(minEatingSpeed([3, 6, 7, 11], 27)).toBe(1);
      expect(minEatingSpeed([3, 6, 7, 11], 26)).toBe(2);
    });

    it('does not modify the piles', () => {
      const piles = [3, 6, 7, 11];
      minEatingSpeed(piles, 8);
      expect(piles).toEqual([3, 6, 7, 11]);
    });
  });

  describe('tricky cases', () => {
    it('round UP the hours per pile: [7], h 3 → 3 (7 / 3 needs 3 hours, 7 / 2 needs 4)', () => {
      expect(minEatingSpeed([7], 3)).toBe(3);
    });

    it('exact division is not rounded up: [6], h 2 → 3 (not 4)', () => {
      expect(minEatingSpeed([6], 2)).toBe(3);
    });

    it('returns the MINIMUM feasible speed, not just any feasible one: [3, 6, 7, 11], h 10 → 3', () => {
      expect(minEatingSpeed([3, 6, 7, 11], 10)).toBe(3);
    });

    it('a speed of total / h is a lower bound, not the answer: [10, 1, 1], h 4 → 5', () => {
      // 12 bananas in 4 hours suggests k = 3, but at k = 3 the 10-pile alone takes 4 hours.
      expect(minEatingSpeed([10, 1, 1], 4)).toBe(5);
    });

    it('[312884470], h 312884469 → 2 (one hour short of eating at speed 1)', () => {
      expect(minEatingSpeed([312_884_470], 312_884_469)).toBe(2);
    });

    it('[805306368, 805306368, 805306368], h 10^9 → 3 (the total exceeds 2^31 — no overflow in JS, but stay careful)', () => {
      expect(minEatingSpeed([805_306_368, 805_306_368, 805_306_368], 1_000_000_000)).toBe(3);
    });

    it('[10^9], h 2 → 500,000,000', () => {
      expect(minEatingSpeed([1_000_000_000], 2)).toBe(500_000_000);
    });
  });

  describe('randomized (seeded, reproducible)', () => {
    it('matches a brute-force speed scan on 300 small random inputs', () => {
      const rng = createRng(11);
      for (let t = 0; t < 300; t++) {
        const n = randomInt(rng, 1, 25);
        const piles = randomIntArray(rng, n, 1, 300);
        const total = piles.reduce((a, b) => a + b, 0);
        const h = randomInt(rng, n, total + 5);
        expect(minEatingSpeed(piles, h), `piles = [${piles}], h = ${h}`).toBe(bruteForce(piles, h));
      }
    });

    it('10,000 piles of up to 2,000 bananas: the answer is feasible and one less is not', () => {
      const rng = createRng(12);
      const piles = randomIntArray(rng, 10_000, 1, 2_000);
      for (const h of [10_000, 10_001, 15_000, 123_456, 50_000_000]) {
        const k = minEatingSpeed(piles, h);
        expect(hoursAt(piles, k), `h = ${h}: speed ${k} is too slow`).toBeLessThanOrEqual(h);
        if (k > 1) expect(hoursAt(piles, k - 1), `h = ${h}: speed ${k - 1} also works`).toBeGreaterThan(h);
      }
    });
  });

  describe('performance', () => {
    it('answer near 10^9: [10^9, 10^9, 1, 1], h 5 → 10^9 (scanning speeds upward would try ~10^9 of them)', () => {
      const { result, ms } = measure(() => minEatingSpeed([1_000_000_000, 1_000_000_000, 1, 1], 5));
      expect(result).toBe(1_000_000_000);
      expect(ms, `took ${ms.toFixed(0)}ms — binary search over k`).toBeLessThan(500);
    });

    it('small answer, huge piles: [10^9, 999999999], h 4·10^6 → 500 (scanning downward from the largest pile would try ~10^9 speeds)', () => {
      const { result, ms } = measure(() => minEatingSpeed([1_000_000_000, 999_999_999], 4_000_000));
      expect(result).toBe(500);
      expect(ms, `took ${ms.toFixed(0)}ms — binary search over k`).toBeLessThan(500);
    });
  });
});
