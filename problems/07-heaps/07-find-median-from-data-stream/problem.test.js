import { describe, it, expect } from 'vitest';
import { MedianFinder } from './problem.js';
import { createRng, randomInt, measure } from '../../../lib/test-utils.js';

/** Adds each value and records findMedian() after every add. */
function mediansAfterEach(values) {
  const m = new MedianFinder();
  return values.map((v) => {
    m.addNum(v);
    return m.findMedian();
  });
}

/** Asserts element-wise closeness (medians may be fractional). */
function expectCloseAll(actual, expected) {
  expect(actual).toHaveLength(expected.length);
  expected.forEach((e, i) => {
    expect(typeof actual[i], `median #${i + 1} should be a number`).toBe('number');
    expect(actual[i], `median after ${i + 1} numbers`).toBeCloseTo(e, 9);
  });
}

/** Brute force: sort a copy and read the middle. */
function bruteMedian(values) {
  const s = [...values].sort((a, b) => a - b);
  const mid = s.length >> 1;
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

describe('Find Median from Data Stream', () => {
  describe('examples from the problem', () => {
    it('add 1, 2 → 1.5; add 3 → 2', () => {
      const m = new MedianFinder();
      m.addNum(1);
      m.addNum(2);
      expect(m.findMedian()).toBeCloseTo(1.5);
      m.addNum(3);
      expect(m.findMedian()).toBeCloseTo(2);
    });

    it('add 5 → 5; add -5 → 0; add 5 → 5', () => {
      expectCloseAll(mediansAfterEach([5, -5, 5]), [5, 0, 5]);
    });

    it('6, 10, 2, 6, 5, 0 → medians 6, 8, 6, 6, 6, 5.5', () => {
      expectCloseAll(mediansAfterEach([6, 10, 2, 6, 5, 0]), [6, 8, 6, 6, 6, 5.5]);
    });
  });

  describe('basic behaviour', () => {
    it('a single number is its own median', () => {
      expectCloseAll(mediansAfterEach([42]), [42]);
    });

    it('two numbers: the median is their average, even when it is fractional (3 and 4 → 3.5)', () => {
      expectCloseAll(mediansAfterEach([4, 3]), [4, 3.5]);
    });

    it('findMedian() does not change anything: calling it repeatedly gives the same answer', () => {
      const m = new MedianFinder();
      [3, 1, 2].forEach((v) => m.addNum(v));
      expect(m.findMedian()).toBeCloseTo(2);
      expect(m.findMedian()).toBeCloseTo(2);
      m.addNum(10);
      expect(m.findMedian()).toBeCloseTo(2.5);
    });

    it('instances are independent of each other', () => {
      const a = new MedianFinder();
      const b = new MedianFinder();
      a.addNum(1);
      b.addNum(100);
      b.addNum(200);
      expect(a.findMedian()).toBeCloseTo(1);
      expect(b.findMedian()).toBeCloseTo(150);
    });
  });

  describe('tricky cases', () => {
    it('increasing input 1..7 → medians 1, 1.5, 2, 2.5, 3, 3.5, 4', () => {
      expectCloseAll(mediansAfterEach([1, 2, 3, 4, 5, 6, 7]), [1, 1.5, 2, 2.5, 3, 3.5, 4]);
    });

    it('decreasing input 7..1 → medians 7, 6.5, 6, 5.5, 5, 4.5, 4', () => {
      expectCloseAll(mediansAfterEach([7, 6, 5, 4, 3, 2, 1]), [7, 6.5, 6, 5.5, 5, 4.5, 4]);
    });

    it('all numbers equal: the median never moves', () => {
      expectCloseAll(mediansAfterEach([3, 3, 3, 3, 3]), [3, 3, 3, 3, 3]);
    });

    it('negative numbers: -1, -2, -3, -4 → -1, -1.5, -2, -2.5', () => {
      expectCloseAll(mediansAfterEach([-1, -2, -3, -4]), [-1, -1.5, -2, -2.5]);
    });

    it('averaging -1 and 0 gives -0.5 (watch out for integer division habits like `>> 1`)', () => {
      expectCloseAll(mediansAfterEach([0, -1]), [0, -0.5]);
    });

    it('alternating extremes ±10^5: the median jumps back and forth correctly', () => {
      expectCloseAll(mediansAfterEach([100000, -100000, 100000, -100000, 0]), [100000, 0, 100000, 0, 0]);
    });

    it('a new number that belongs in the LOWER half when the halves are balanced', () => {
      // After [10, 20] the halves are {10} | {20}. Adding 5 must make 10 the median, not 20.
      expectCloseAll(mediansAfterEach([10, 20, 5]), [10, 15, 10]);
    });

    it('a new number that belongs in the UPPER half when the halves are balanced', () => {
      // After [10, 20] adding 30 must make 20 the median.
      expectCloseAll(mediansAfterEach([10, 20, 30]), [10, 15, 20]);
    });

    it('duplicates of the median value on both sides', () => {
      expectCloseAll(mediansAfterEach([5, 1, 5, 9, 5, 5]), [5, 3, 5, 5, 5, 5]);
    });
  });

  describe('randomized (seeded) against sort-and-pick', () => {
    it('100 random streams of up to 80 numbers, checking the median after every add', () => {
      const rng = createRng(777);
      for (let t = 0; t < 100; t++) {
        const n = randomInt(rng, 1, 80);
        const range = randomInt(rng, 0, 1) ? 5 : 100_000;
        const values = Array.from({ length: n }, () => randomInt(rng, -range, range));
        const expected = values.map((_, i) => bruteMedian(values.slice(0, i + 1)));
        expectCloseAll(mediansAfterEach(values), expected);
      }
    });
  });

  describe('performance', () => {
    it('25,000 addNum calls with findMedian after each (sorting on every call is O(n² log n) overall)', () => {
      const rng = createRng(31337);
      const values = Array.from({ length: 25_000 }, () => randomInt(rng, -100_000, 100_000));
      const { result, ms } = measure(() => {
        const m = new MedianFinder();
        let sum = 0;
        for (const v of values) {
          m.addNum(v);
          sum += m.findMedian();
        }
        return [m.findMedian(), sum];
      });
      // Reference: a sorted array maintained by binary-search insertion.
      const sorted = [];
      let sum = 0;
      for (const v of values) {
        let lo = 0;
        let hi = sorted.length;
        while (lo < hi) {
          const mid = (lo + hi) >> 1;
          if (sorted[mid] < v) lo = mid + 1;
          else hi = mid;
        }
        sorted.splice(lo, 0, v);
        const mid = sorted.length >> 1;
        sum += sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
      }
      expect(result[0]).toBeCloseTo(bruteMedian(values), 9);
      expect(result[1]).toBeCloseTo(sum, 3);
      expect(ms, `took ${ms.toFixed(0)}ms — addNum should be O(log n), findMedian O(1)`).toBeLessThan(500);
    });
  });
});
