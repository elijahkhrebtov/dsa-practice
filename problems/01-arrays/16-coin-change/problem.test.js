import { describe, it, expect } from 'vitest';
import { coinChange } from './problem.js';
import { createRng, randomInt, shuffle, measure } from '../../../lib/test-utils.js';

/**
 * Brute force: try every coin as the next one and recurse (no memo).
 * Exponential — only used on tiny amounts.
 */
function bruteForce(coins, amount) {
  if (amount === 0) return 0;
  let best = Infinity;
  for (const c of coins) {
    if (c > amount) continue;
    const sub = bruteForce(coins, amount - c);
    if (sub !== -1) best = Math.min(best, sub + 1);
  }
  return best === Infinity ? -1 : best;
}

describe('Coin Change', () => {
  describe('examples from the problem', () => {
    it('[1, 2, 5], amount 11 → 3 (5 + 5 + 1)', () => {
      expect(coinChange([1, 2, 5], 11)).toBe(3);
    });

    it('[2], amount 3 → -1 (odd amounts are impossible with only 2s)', () => {
      expect(coinChange([2], 3)).toBe(-1);
    });

    it('[1], amount 0 → 0 (zero coins make zero)', () => {
      expect(coinChange([1], 0)).toBe(0);
    });

    it('[1, 3, 4], amount 6 → 2 (3 + 3; largest-coin-first would use 4 + 1 + 1)', () => {
      expect(coinChange([1, 3, 4], 6)).toBe(2);
    });
  });

  describe('edge cases', () => {
    it('amount 0 is 0 even when no coin is small: [7, 11], amount 0 → 0', () => {
      expect(coinChange([7, 11], 0)).toBe(0);
    });

    it('amount equals a coin: [1, 2, 5], amount 5 → 1', () => {
      expect(coinChange([1, 2, 5], 5)).toBe(1);
    });

    it('single coin, exact multiple: [5], amount 25 → 5', () => {
      expect(coinChange([5], 25)).toBe(5);
    });

    it('single coin, not a multiple: [3], amount 7 → -1', () => {
      expect(coinChange([3], 7)).toBe(-1);
    });

    it('every coin is larger than the amount: [5, 10], amount 3 → -1', () => {
      expect(coinChange([5, 10], 3)).toBe(-1);
    });

    it('a coin of 2^31 - 1 is simply too big: [2147483647], amount 2 → -1', () => {
      expect(coinChange([2_147_483_647], 2)).toBe(-1);
    });

    it('a huge coin next to a 1: [1, 2147483647], amount 3 → 3', () => {
      expect(coinChange([1, 2_147_483_647], 3)).toBe(3);
    });

    it('coins in unsorted order: [5, 1, 2], amount 11 → 3', () => {
      expect(coinChange([5, 1, 2], 11)).toBe(3);
    });

    it('does not modify the coins array', () => {
      const coins = [5, 1, 2];
      coinChange(coins, 11);
      expect(coins).toEqual([5, 1, 2]);
    });
  });

  describe('tricky cases (greedy fails)', () => {
    it('[1, 5, 6, 9], amount 11 → 2 (5 + 6, not 9 + 1 + 1)', () => {
      expect(coinChange([1, 5, 6, 9], 11)).toBe(2);
    });

    it('[2, 5], amount 6 → 3 (2 + 2 + 2: taking the 5 first leads to a dead end)', () => {
      expect(coinChange([2, 5], 6)).toBe(3);
    });

    it('[3, 7], amount 9 → 3 (3 + 3 + 3: taking the 7 first leaves an impossible 2)', () => {
      expect(coinChange([3, 7], 9)).toBe(3);
    });

    it('impossible even though coins are small: [2, 4], amount 7 → -1 (return -1, not Infinity)', () => {
      expect(coinChange([2, 4], 7)).toBe(-1);
    });

    it('impossible with coprime-looking coins: [5, 3], amount 7 → -1', () => {
      expect(coinChange([5, 3], 7)).toBe(-1);
    });

    it('[1, 7, 10], amount 14 → 2 (7 + 7, not 10 + 1 + 1 + 1 + 1)', () => {
      expect(coinChange([1, 7, 10], 14)).toBe(2);
    });

    it('large amount with large coins: [1000, 2500], amount 9500 → 5 (2500 × 3 + 1000 × 2)', () => {
      expect(coinChange([1000, 2500], 9500)).toBe(5);
    });

    it('large amount, single coin, impossible: [7], amount 9999 → -1', () => {
      expect(coinChange([7], 9999)).toBe(-1);
    });
  });

  describe('randomized (seeded, reproducible)', () => {
    it('matches a brute-force recursion on 300 random small cases', () => {
      const rng = createRng(16);
      for (let t = 0; t < 300; t++) {
        const k = randomInt(rng, 1, 4);
        const coins = shuffle(rng, Array.from({ length: 15 }, (_, i) => i + 1)).slice(0, k);
        const amount = randomInt(rng, 0, 20);
        expect(coinChange(coins, amount), `coins = [${coins}], amount = ${amount}`).toBe(bruteForce(coins, amount));
      }
    });
  });

  describe('performance', () => {
    it('[1, 2, 5], amount 37 → 8 fast (recursion without memoization makes ~10^8 calls here)', () => {
      const { result, ms } = measure(() => coinChange([1, 2, 5], 37));
      expect(result).toBe(8);
      expect(ms, `took ${ms.toFixed(0)}ms — remember the answer for each sub-amount`).toBeLessThan(500);
    });
  });
});
