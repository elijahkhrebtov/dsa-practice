import { describe, it, expect } from 'vitest';
import { singleNumber } from './problem.js';
import { createRng, randomInt, shuffle, measure } from '../../../lib/test-utils.js';

/** Oracle: count every value with a Map and return the one seen once. */
function singleByCounting(nums) {
  const counts = new Map();
  for (const x of nums) counts.set(x, (counts.get(x) ?? 0) + 1);
  for (const [x, c] of counts) if (c === 1) return x;
  return undefined;
}

/** Builds a shuffled array: each value in `pairs` twice, plus `single` once. */
function buildInput(rng, pairs, single) {
  return shuffle(rng, [...pairs, ...pairs, single]);
}

describe('Single Number', () => {
  describe('examples from the problem', () => {
    it('[2, 2, 1] → 1', () => {
      expect(singleNumber([2, 2, 1])).toBe(1);
    });

    it('[4, 1, 2, 1, 2] → 4 (the copies of a pair are not adjacent)', () => {
      expect(singleNumber([4, 1, 2, 1, 2])).toBe(4);
    });

    it('[1] → 1 (a single element is the answer)', () => {
      expect(singleNumber([1])).toBe(1);
    });

    it('[-3, 7, 7] → -3 (negative answers are allowed)', () => {
      expect(singleNumber([-3, 7, 7])).toBe(-3);
    });
  });

  describe('edge cases', () => {
    it('[0, 5, 5] → 0 (zero can be the answer, so don\'t treat 0 as "not found")', () => {
      expect(singleNumber([0, 5, 5])).toBe(0);
    });

    it('[0, 0, 9] → 9 (zero can also be one of the pairs)', () => {
      expect(singleNumber([0, 0, 9])).toBe(9);
    });

    it('the answer can sit at the very end: [1, 2, 3, 1, 2, 3, 42] → 42', () => {
      expect(singleNumber([1, 2, 3, 1, 2, 3, 42])).toBe(42);
    });

    it('the answer can sit in the middle: [8, 6, 13, 6, 8] → 13', () => {
      expect(singleNumber([8, 6, 13, 6, 8])).toBe(13);
    });

    it('handles the 32-bit extremes: [2^31 − 1, −2^31, 2^31 − 1] → −2^31', () => {
      expect(singleNumber([2 ** 31 - 1, -(2 ** 31), 2 ** 31 - 1])).toBe(-(2 ** 31));
    });

    it('[−2^31, 2^31 − 1, −2^31] → 2^31 − 1', () => {
      expect(singleNumber([-(2 ** 31), 2 ** 31 - 1, -(2 ** 31)])).toBe(2 ** 31 - 1);
    });
  });

  describe('tricky cases', () => {
    it('a value and its negation are different values: [5, -5, 5] → -5', () => {
      expect(singleNumber([5, -5, 5])).toBe(-5);
    });

    it('-1 (all bits set in 32-bit two\'s complement) is returned as -1, not 4294967295', () => {
      expect(singleNumber([3, -1, 3])).toBe(-1);
    });

    it('works on unsorted input where sorting by string would mislead: [10, 9, 100, 9, 10] → 100', () => {
      expect(singleNumber([10, 9, 100, 9, 10])).toBe(100);
    });

    it('values sharing many bits still cancel correctly: [7, 6, 7, 6, 5, 4, 4] → 5', () => {
      expect(singleNumber([7, 6, 7, 6, 5, 4, 4])).toBe(5);
    });

    it('does not reorder or modify the input array', () => {
      const nums = [4, 1, 2, 1, 2];
      singleNumber(nums);
      expect(nums).toEqual([4, 1, 2, 1, 2]);
    });
  });

  describe('randomized (seeded, reproducible)', () => {
    it('matches a counting oracle on 300 shuffled arrays with values across the 32-bit range', () => {
      const rng = createRng(2024);
      for (let t = 0; t < 300; t++) {
        const pairCount = randomInt(rng, 0, 40);
        const wide = t % 2 === 0;
        const lo = wide ? -(2 ** 31) : -20;
        const hi = wide ? 2 ** 31 - 1 : 20;
        const distinct = new Set();
        while (distinct.size < pairCount + 1) distinct.add(randomInt(rng, lo, hi));
        const [single, ...pairs] = [...distinct];
        const nums = buildInput(rng, pairs, single);
        expect(singleNumber(nums), JSON.stringify(nums)).toBe(singleByCounting(nums));
      }
    });
  });

  describe('performance', () => {
    it('100,001 numbers with each pair 50,000 positions apart (counting each value with a nested loop is O(n²): seconds)', () => {
      const m = 50_000;
      const half = Array.from({ length: m }, (_, i) => i * 7 - 3 * m);
      const nums = [...half, 123_456_789, ...half];
      const { result, ms } = measure(() => singleNumber(nums));
      expect(result).toBe(123_456_789);
      expect(ms, `took ${ms.toFixed(0)}ms — aim for a single O(n) pass`).toBeLessThan(500);
    });
  });
});
