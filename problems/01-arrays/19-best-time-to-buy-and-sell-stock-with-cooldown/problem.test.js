import { describe, it, expect } from 'vitest';
import { maxProfit } from './problem.js';
import { createRng, randomInt, randomIntArray, measure } from '../../../lib/test-utils.js';

/**
 * Exponential brute force: on every day either do nothing, or (depending on
 * whether we hold a share) buy / sell. Selling skips the next day.
 */
function bruteForce(prices) {
  const go = (day, holding) => {
    if (day >= prices.length) return 0;
    let best = go(day + 1, holding); // rest
    if (holding) best = Math.max(best, prices[day] + go(day + 2, false)); // sell, then cooldown
    else best = Math.max(best, -prices[day] + go(day + 1, true)); // buy
    return best;
  };
  return go(0, false);
}

describe('Best Time to Buy and Sell Stock with Cooldown', () => {
  describe('examples from the problem', () => {
    it('[1, 2, 3, 0, 2] → 3 (buy, sell, cooldown, buy, sell)', () => {
      expect(maxProfit([1, 2, 3, 0, 2])).toBe(3);
    });

    it('[1] → 0 (one day: nothing to sell)', () => {
      expect(maxProfit([1])).toBe(0);
    });

    it('[1, 4, 2, 7] → 6 (the cooldown forbids buying at 2 right after selling at 4)', () => {
      expect(maxProfit([1, 4, 2, 7])).toBe(6);
    });
  });

  describe('edge cases', () => {
    it('two days, rising: [3, 8] → 5', () => {
      expect(maxProfit([3, 8])).toBe(5);
    });

    it('two days, falling: [8, 3] → 0 (never forced to trade)', () => {
      expect(maxProfit([8, 3])).toBe(0);
    });

    it('strictly decreasing prices → 0', () => {
      expect(maxProfit([5, 4, 3, 2, 1])).toBe(0);
    });

    it('all prices equal → 0', () => {
      expect(maxProfit([7, 7, 7, 7, 7])).toBe(0);
    });

    it('prices of 0 are valid: [0, 0, 5] → 5', () => {
      expect(maxProfit([0, 0, 5])).toBe(5);
    });

    it('strictly increasing prices: one long trade [1, 2, 3, 4, 5] → 4', () => {
      // Splitting into 1→2 and 3→5 would also need a cooldown day in between.
      expect(maxProfit([1, 2, 3, 4, 5])).toBe(4);
    });
  });

  describe('tricky cases', () => {
    it('[6, 1, 3, 2, 4, 7] → 6 (summing every rise gives 7, but the cooldown blocks it)', () => {
      expect(maxProfit([6, 1, 3, 2, 4, 7])).toBe(6);
    });

    it('[2, 1, 2, 0, 1] → 1 (the cheapest buy day is exactly the cooldown day after 1 → 2)', () => {
      expect(maxProfit([2, 1, 2, 0, 1])).toBe(1);
    });

    it('[1, 5, 0, 0, 1, 5] → 9 (the cooldown can land on a day you would skip anyway)', () => {
      expect(maxProfit([1, 5, 0, 0, 1, 5])).toBe(9);
    });

    it('[1, 7, 2, 4, 1, 8] → 13 (skip the small 2 → 4 trade to keep the 1 → 8 one)', () => {
      expect(maxProfit([1, 7, 2, 4, 1, 8])).toBe(13);
    });

    it('[3, 3, 5, 0, 0, 3, 1, 4] → 6', () => {
      expect(maxProfit([3, 3, 5, 0, 0, 3, 1, 4])).toBe(6);
    });

    it('[1, 3, 2, 8, 4, 9] → 8 (one trade 1 → 9 beats any split)', () => {
      expect(maxProfit([1, 3, 2, 8, 4, 9])).toBe(8);
    });

    it('does not count a share bought on the last day: [4, 1] → 0', () => {
      expect(maxProfit([4, 1])).toBe(0);
    });

    it('does not modify the input array', () => {
      const prices = [1, 2, 3, 0, 2];
      maxProfit(prices);
      expect(prices).toEqual([1, 2, 3, 0, 2]);
    });
  });

  describe('randomized (seeded) against a brute force', () => {
    it('matches an exhaustive search on 400 small random price lists', () => {
      const rng = createRng(19);
      for (let t = 0; t < 400; t++) {
        const n = randomInt(rng, 1, 14);
        const prices = randomIntArray(rng, n, 0, 20);
        expect(maxProfit(prices), `prices = [${prices}]`).toBe(bruteForce(prices));
      }
    });

    it('matches on zig-zag prices, where the cooldown matters most', () => {
      const rng = createRng(1919);
      for (let t = 0; t < 100; t++) {
        const n = randomInt(rng, 2, 14);
        const prices = Array.from({ length: n }, (_, i) => (i % 2 === 0 ? randomInt(rng, 0, 5) : randomInt(rng, 6, 12)));
        expect(maxProfit(prices), `prices = [${prices}]`).toBe(bruteForce(prices));
      }
    });
  });

  describe('performance', () => {
    it('20 price lists of 30,000 days stay fast (an O(n²) "try every buy day" DP will be far too slow)', () => {
      const rng = createRng(4242);
      const inputs = Array.from({ length: 20 }, () => randomIntArray(rng, 30_000, 0, 1000));
      const budget = 500;
      let total = 0;
      let done = 0;
      for (const prices of inputs) {
        const { result, ms } = measure(() => maxProfit(prices));
        total += ms;
        expect(result).toBeGreaterThan(0);
        done++;
        if (total > budget) break; // stop early so a slow solution fails fast
      }
      expect(done, `the ${budget}ms budget ran out after ${done} of 20 inputs (${total.toFixed(0)}ms) — aim for O(n)`).toBe(20);
      expect(total, `took ${total.toFixed(0)}ms — aim for O(n)`).toBeLessThan(budget);
    });

    it('a slowly rising 30,000-day series (0, 0, …, 999) → 999 (one trade, first day to last)', () => {
      const prices = Array.from({ length: 30_000 }, (_, i) => Math.floor(i / 30));
      const { result, ms } = measure(() => maxProfit(prices));
      expect(result).toBe(999);
      expect(ms, `took ${ms.toFixed(0)}ms — aim for O(n)`).toBeLessThan(500);
    });
  });
});
