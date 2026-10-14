import { describe, it, expect } from 'vitest';
import { dailyTemperatures } from './problem.js';
import { createRng, randomInt, randomIntArray, measure } from '../../../lib/test-utils.js';

/** Brute-force oracle: for every day, scan forward for the first strictly warmer day. O(n²). */
function bruteDaily(t) {
  return t.map((x, i) => {
    for (let j = i + 1; j < t.length; j++) if (t[j] > x) return j - i;
    return 0;
  });
}

describe('Daily Temperatures', () => {
  describe('examples from the problem', () => {
    it('[73, 74, 75, 71, 69, 72, 76, 73] → [1, 1, 4, 2, 1, 1, 0, 0]', () => {
      expect(dailyTemperatures([73, 74, 75, 71, 69, 72, 76, 73])).toEqual([1, 1, 4, 2, 1, 1, 0, 0]);
    });

    it('[30, 40, 50, 60] → [1, 1, 1, 0] (rising: always the next day)', () => {
      expect(dailyTemperatures([30, 40, 50, 60])).toEqual([1, 1, 1, 0]);
    });

    it('[60, 50, 40] → [0, 0, 0] (falling: never warmer)', () => {
      expect(dailyTemperatures([60, 50, 40])).toEqual([0, 0, 0]);
    });

    it('[70, 70, 71] → [2, 1, 0] (an equal temperature is not warmer)', () => {
      expect(dailyTemperatures([70, 70, 71])).toEqual([2, 1, 0]);
    });
  });

  describe('edge cases', () => {
    it('a single day → [0]', () => {
      expect(dailyTemperatures([50])).toEqual([0]);
    });

    it('two equal days → [0, 0]', () => {
      expect(dailyTemperatures([42, 42])).toEqual([0, 0]);
    });

    it('two rising days → [1, 0]', () => {
      expect(dailyTemperatures([1, 2])).toEqual([1, 0]);
    });

    it('all the same temperature → all zeros (strictly warmer is required)', () => {
      expect(dailyTemperatures([5, 5, 5, 5, 5])).toEqual([0, 0, 0, 0, 0]);
    });

    it('zero is a valid temperature: [0, 0, 1] → [2, 1, 0]', () => {
      expect(dailyTemperatures([0, 0, 1])).toEqual([2, 1, 0]);
    });

    it('returns a new array of the same length and leaves the input unchanged', () => {
      const input = [73, 74, 75, 71];
      const result = dailyTemperatures(input);
      expect(result).toHaveLength(4);
      expect(result).not.toBe(input);
      expect(input).toEqual([73, 74, 75, 71]);
    });
  });

  describe('tricky cases', () => {
    it('a long plateau waits for the same warmer day: [70, 70, 70, 71] → [3, 2, 1, 0]', () => {
      expect(dailyTemperatures([70, 70, 70, 71])).toEqual([3, 2, 1, 0]);
    });

    it('a valley resolved by one hot day: [50, 40, 30, 60] → [3, 2, 1, 0]', () => {
      expect(dailyTemperatures([50, 40, 30, 60])).toEqual([3, 2, 1, 0]);
    });

    it('the answer is the NEXT warmer day, not the hottest one: [70, 60, 65, 80] → [3, 1, 1, 0]', () => {
      expect(dailyTemperatures([70, 60, 65, 80])).toEqual([3, 1, 1, 0]);
    });

    it('a slightly warmer day does not resolve a much hotter earlier day: [90, 50, 60, 95] → [3, 1, 1, 0]', () => {
      expect(dailyTemperatures([90, 50, 60, 95])).toEqual([3, 1, 1, 0]);
    });

    it('[55, 38, 53, 81, 61, 93, 97, 32, 43, 78] → [3, 1, 1, 2, 1, 1, 0, 1, 1, 0]', () => {
      expect(dailyTemperatures([55, 38, 53, 81, 61, 93, 97, 32, 43, 78])).toEqual([3, 1, 1, 2, 1, 1, 0, 1, 1, 0]);
    });

    it('zig-zag: [1, 3, 2, 4, 3, 5] → [1, 2, 1, 2, 1, 0]', () => {
      expect(dailyTemperatures([1, 3, 2, 4, 3, 5])).toEqual([1, 2, 1, 2, 1, 0]);
    });

    it('the last day is always 0, even after a long rise', () => {
      const result = dailyTemperatures([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
      expect(result[result.length - 1]).toBe(0);
      expect(result).toEqual([1, 1, 1, 1, 1, 1, 1, 1, 1, 0]);
    });
  });

  describe('randomized (seeded, reproducible)', () => {
    it('matches a brute-force forward scan on 500 random arrays', () => {
      const rng = createRng(77);
      for (let t = 0; t < 500; t++) {
        const n = randomInt(rng, 1, 60);
        const hi = randomInt(rng, 1, 100); // small ranges → many equal temperatures
        const temps = randomIntArray(rng, n, 0, hi);
        expect(dailyTemperatures(temps), JSON.stringify(temps)).toEqual(bruteDaily(temps));
      }
    });
  });

  describe('performance', () => {
    it('100,000 strictly falling days and then one hot day (a forward scan from every day is O(n²))', () => {
      const n = 100_000;
      // 99,999 days falling from 99,999 down to 1, then a 100,000 at the end.
      const temps = Array.from({ length: n }, (_, i) => (i === n - 1 ? 100_000 : n - 1 - i));
      const { result, ms } = measure(() => dailyTemperatures(temps));
      expect(result[0]).toBe(n - 1);
      expect(result[n - 2]).toBe(1);
      expect(result[n - 1]).toBe(0);
      expect(result[12_345]).toBe(n - 1 - 12_345);
      expect(ms, `took ${ms.toFixed(0)}ms — each day should be pushed and popped at most once`).toBeLessThan(500);
    });

    it('100,000 random temperatures stay fast', () => {
      const rng = createRng(5);
      const temps = randomIntArray(rng, 100_000, 0, 100_000);
      const { result, ms } = measure(() => dailyTemperatures(temps));
      expect(result).toHaveLength(100_000);
      // Spot-check a few positions against the brute force definition.
      for (const i of [0, 1, 500, 50_000, 99_998, 99_999]) {
        let expected = 0;
        for (let j = i + 1; j < temps.length; j++) {
          if (temps[j] > temps[i]) {
            expected = j - i;
            break;
          }
        }
        expect(result[i]).toBe(expected);
      }
      expect(ms, `took ${ms.toFixed(0)}ms — think O(n)`).toBeLessThan(500);
    });
  });
});
