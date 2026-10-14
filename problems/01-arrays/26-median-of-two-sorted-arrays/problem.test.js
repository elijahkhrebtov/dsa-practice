import { describe, it, expect } from 'vitest';
import { findMedianSortedArrays } from './problem.js';
import { createRng, randomInt, randomIntArray, measure } from '../../../lib/test-utils.js';

/** Oracle: merge-and-sort, then read the middle. */
function oracle(a, b) {
  const all = [...a, ...b].sort((x, y) => x - y);
  const mid = all.length >> 1;
  return all.length % 2 === 1 ? all[mid] : (all[mid - 1] + all[mid]) / 2;
}

/** Linear two-pointer walk to the middle — used once per big pair to get the expected value. */
function linearMedian(a, b) {
  const total = a.length + b.length;
  let i = 0;
  let j = 0;
  let prev = 0;
  let cur = 0;
  for (let k = 0; k <= total >> 1; k++) {
    prev = cur;
    cur = j >= b.length || (i < a.length && a[i] <= b[j]) ? a[i++] : b[j++];
  }
  return total % 2 === 1 ? cur : (prev + cur) / 2;
}

/** Median results can be x.5, so compare as floats. */
function expectMedian(a, b, expected) {
  const result = findMedianSortedArrays(a, b);
  expect(typeof result, 'should return a number').toBe('number');
  expect(result, `nums1 = [${a}], nums2 = [${b}]`).toBeCloseTo(expected, 9);
}

/** A sorted array of `n` values in [-10^6, 10^6] built from random steps. */
function sortedArray(rng, n, maxStep) {
  const arr = new Array(n);
  let v = -1_000_000 + randomInt(rng, 0, maxStep);
  for (let i = 0; i < n; i++) {
    arr[i] = v;
    v += randomInt(rng, 0, maxStep);
  }
  return arr;
}

describe('Median of Two Sorted Arrays', () => {
  describe('examples from the problem', () => {
    it('[1, 3] and [2] → 2 (odd total: the middle element)', () => {
      expectMedian([1, 3], [2], 2);
    });

    it('[1, 2] and [3, 4] → 2.5 (even total: average of the two middle elements)', () => {
      expectMedian([1, 2], [3, 4], 2.5);
    });

    it('[] and [1] → 1 (the first array may be empty)', () => {
      expectMedian([], [1], 1);
    });
  });

  describe('edge cases', () => {
    it('[2] and [] → 2 (the second array may be empty)', () => {
      expectMedian([2], [], 2);
    });

    it('[] and [2, 3] → 2.5 (one empty array, even length)', () => {
      expectMedian([], [2, 3], 2.5);
    });

    it('[] and [1, 2, 3, 4, 5] → 3 (one empty array, odd length)', () => {
      expectMedian([], [1, 2, 3, 4, 5], 3);
    });

    it('two single elements: [1] and [2] → 1.5', () => {
      expectMedian([1], [2], 1.5);
    });

    it('negative numbers: [-5, -3] and [-4] → -4', () => {
      expectMedian([-5, -3], [-4], -4);
    });

    it('a median of 0 from opposite extremes: [-1000000] and [1000000] → 0', () => {
      expectMedian([-1_000_000], [1_000_000], 0);
    });

    it('all values equal: [1, 1] and [1, 1, 1] → 1', () => {
      expectMedian([1, 1], [1, 1, 1], 1);
    });

    it('does not modify either array', () => {
      const a = [1, 4, 9];
      const b = [2, 3];
      findMedianSortedArrays(a, b);
      expect(a).toEqual([1, 4, 9]);
      expect(b).toEqual([2, 3]);
    });
  });

  describe('tricky cases', () => {
    it('every element of nums1 is smaller: [1, 2, 3] and [10, 11, 12, 13] → 10', () => {
      expectMedian([1, 2, 3], [10, 11, 12, 13], 10);
    });

    it('every element of nums1 is larger: [10, 11, 12, 13] and [1, 2, 3] → 10', () => {
      expectMedian([10, 11, 12, 13], [1, 2, 3], 10);
    });

    it('both middle values come from the longer array: [1, 2] and [3, 4, 5, 6, 7, 8] → 4.5', () => {
      expectMedian([1, 2], [3, 4, 5, 6, 7, 8], 4.5);
    });

    it('a single element that lands exactly in the middle: [5] and [1, 2, 3, 4, 6, 7, 8, 9] → 5', () => {
      expectMedian([5], [1, 2, 3, 4, 6, 7, 8, 9], 5);
    });

    it('the two middle values come one from each array: [1, 3, 8] and [4, 9, 10] → 6', () => {
      expectMedian([1, 3, 8], [4, 9, 10], 6);
    });

    it('duplicates straddling the boundary: [1, 2, 2] and [2, 2, 3] → 2', () => {
      expectMedian([1, 2, 2], [2, 2, 3], 2);
    });

    it('interleaved arrays: [1, 3, 5, 7] and [2, 4, 6, 8] → 4.5', () => {
      expectMedian([1, 3, 5, 7], [2, 4, 6, 8], 4.5);
    });

    it('the longer array passed first still works: [1, 2, 3, 4, 5, 6] and [0] → 3', () => {
      expectMedian([1, 2, 3, 4, 5, 6], [0], 3);
    });

    it('the median is a non-integer with negatives: [-3, -1] and [-2, 0] → -1.5', () => {
      expectMedian([-3, -1], [-2, 0], -1.5);
    });
  });

  describe('randomized (seeded) against merge-and-sort', () => {
    it('matches on 800 random pairs of sorted arrays (both argument orders)', () => {
      const rng = createRng(26);
      for (let t = 0; t < 800; t++) {
        const m = randomInt(rng, 0, 20);
        const n = randomInt(rng, m === 0 ? 1 : 0, 20);
        const range = randomInt(rng, 1, 60); // small ranges create many duplicates
        const a = randomIntArray(rng, m, -range, range).sort((x, y) => x - y);
        const b = randomIntArray(rng, n, -range, range).sort((x, y) => x - y);
        const expected = oracle(a, b);
        expectMedian(a, b, expected);
        expectMedian(b, a, expected);
      }
    });
  });

  describe('performance', () => {
    it('5,000 calls on arrays of 1,000,000 elements stay fast (merging, even halfway, is O(m + n) per call)', () => {
      const rng = createRng(2626);
      const big1 = sortedArray(rng, 1_000_000, 3);
      const big2 = sortedArray(rng, 1_000_000, 3);
      const small = sortedArray(rng, 3, 500_000);
      const pairs = [
        [big1, big2],
        [big2, big1],
        [big1, small],
        [small, big2],
        [big1, []],
        [[], big2],
        [big2, [0]],
      ];
      const expected = pairs.map(([a, b]) => linearMedian(a, b)); // computed outside the timed part

      const calls = 5000;
      const budget = 500;
      let total = 0;
      let done = 0;
      for (let k = 0; k < calls; k++) {
        const p = k % pairs.length;
        const [a, b] = pairs[p];
        const { result, ms } = measure(() => findMedianSortedArrays(a, b));
        total += ms;
        if (!(Math.abs(result - expected[p]) <= 1e-9)) {
          // (written this way so NaN / undefined results also fail)
          expect(result, `pair #${p} (lengths ${a.length} and ${b.length})`).toBeCloseTo(expected[p], 9);
        }
        done++;
        if (total > budget) break; // stop early so a slow solution fails fast
      }
      expect(done, `the ${budget}ms budget ran out after ${done} of ${calls} calls (${total.toFixed(0)}ms) — aim for O(log(min(m, n)))`).toBe(calls);
      expect(total, `took ${total.toFixed(0)}ms — aim for O(log(min(m, n)))`).toBeLessThan(budget);
    });
  });
});
