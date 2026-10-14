import { describe, it, expect } from 'vitest';
import { maxProfit } from './problem.js';
import { createRng, randomInt, randomIntArray, measure } from '../../../lib/test-utils.js';

/** Brute force: try every buy day i and every later sell day j. */
function bruteForce(prices) {
  let best = 0;
  for (let i = 0; i < prices.length; i++) {
    for (let j = i + 1; j < prices.length; j++) {
      best = Math.max(best, prices[j] - prices[i]);
    }
  }
  return best;
}

describe('Best Time to Buy and Sell Stock', () => {
  describe('examples from the problem', () => {
    it('[7, 1, 5, 3, 6, 4] → 5 (buy at 1, sell at 6)', () => {
      expect(maxProfit([7, 1, 5, 3, 6, 4])).toBe(5);
    });

    it('[7, 6, 4, 3, 1] → 0 (prices only fall, so don\'t trade)', () => {
      expect(maxProfit([7, 6, 4, 3, 1])).toBe(0);
    });

    it('[2, 4, 1] → 2 (the global minimum comes last and is useless)', () => {
      expect(maxProfit([2, 4, 1])).toBe(2);
    });
  });

  describe('edge cases', () => {
    it('a single day → 0 (there is no later day to sell on)', () => {
      expect(maxProfit([5])).toBe(0);
    });

    it('two days, rising: [1, 2] → 1', () => {
      expect(maxProfit([1, 2])).toBe(1);
    });

    it('two days, falling: [2, 1] → 0 (never return a negative profit)', () => {
      expect(maxProfit([2, 1])).toBe(0);
    });

    it('all prices equal: [3, 3, 3, 3] → 0', () => {
      expect(maxProfit([3, 3, 3, 3])).toBe(0);
    });

    it('prices of 0 are allowed: [0, 0, 10000] → 10000 (constraint extremes)', () => {
      expect(maxProfit([0, 0, 10000])).toBe(10000);
    });

    it('strictly increasing: [1, 2, 3, 4, 5] → 4 (buy first day, sell last day)', () => {
      expect(maxProfit([1, 2, 3, 4, 5])).toBe(4);
    });
  });

  describe('tricky cases', () => {
    it('the maximum price comes before the minimum: [9, 1, 2] → 1 (can\'t sell in the past)', () => {
      // max − min would be 8, but the 9 is on day 0, before any purchase.
      expect(maxProfit([9, 1, 2])).toBe(1);
    });

    it('a later, lower minimum produces the best trade: [3, 8, 1, 9] → 8', () => {
      // Keep updating the cheapest buy price — 1 beats 3 even though 3 already had a sale at 8.
      expect(maxProfit([3, 8, 1, 9])).toBe(8);
    });

    it('a later, lower minimum that never pays off: [3, 10, 1, 2] → 7', () => {
      // After switching the buy price to 1 the best sale is only 2 — keep the earlier best profit.
      expect(maxProfit([3, 10, 1, 2])).toBe(7);
    });

    it('the best trade is not between adjacent days: [2, 1, 4, 3, 6, 0, 5] → 5', () => {
      expect(maxProfit([2, 1, 4, 3, 6, 0, 5])).toBe(5);
    });

    it('only ONE transaction: [1, 5, 1, 5] → 4, not 8', () => {
      expect(maxProfit([1, 5, 1, 5])).toBe(4);
    });

    it('zigzag ending in the best sale: [5, 2, 6, 1, 4, 0, 7] → 7', () => {
      expect(maxProfit([5, 2, 6, 1, 4, 0, 7])).toBe(7);
    });
  });

  describe('randomized (seeded, reproducible)', () => {
    it('matches a brute-force O(n²) check on 300 random price lists', () => {
      const rng = createRng(2024);
      for (let t = 0; t < 300; t++) {
        const n = randomInt(rng, 1, 60);
        const prices = randomIntArray(rng, n, 0, randomInt(rng, 1, 100));
        expect(maxProfit([...prices]), `prices = [${prices}]`).toBe(bruteForce(prices));
      }
    });

    it('does not modify the input array', () => {
      const prices = [7, 1, 5, 3, 6, 4];
      maxProfit(prices);
      expect(prices).toEqual([7, 1, 5, 3, 6, 4]);
    });
  });

  describe('performance', () => {
    it('100,000 prices in one pass (checking every buy/sell pair is O(n²) and far too slow)', () => {
      const n = 100_000;
      // A slow downward drift with a deterministic wiggle; the best trade hides near the end.
      const prices = Array.from({ length: n }, (_, i) => 5000 + ((i * 7919) % 101) - Math.floor(i / 25));
      prices[n - 3] = 0;
      prices[n - 1] = 10_000;
      const { result, ms } = measure(() => maxProfit(prices));
      expect(result).toBe(10_000);
      expect(ms, `took ${ms.toFixed(0)}ms — think O(n)`).toBeLessThan(500);
    });
  });
});
