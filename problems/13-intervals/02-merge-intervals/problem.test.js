import { describe, it, expect } from 'vitest';
import { merge } from './problem.js';
import { createRng, randomInt, shuffle, measure } from '../../../lib/test-utils.js';

/**
 * Independent reference: paint every covered point on a number line with
 * doubled coordinates (so touching intervals connect but [1,3] and [4,5]
 * leave a gap at 3.5), then read off the maximal painted runs.
 */
function bruteForce(intervals) {
  const covered = new Uint8Array(2 * 200 + 2);
  for (const [s, e] of intervals) for (let x = 2 * s; x <= 2 * e; x++) covered[x] = 1;
  const out = [];
  for (let x = 0; x < covered.length; x++) {
    if (covered[x] && (x === 0 || !covered[x - 1])) out.push([x / 2, x / 2]);
    if (covered[x]) out[out.length - 1][1] = x / 2;
  }
  return out;
}

const deepCopy = (intervals) => intervals.map((iv) => [...iv]);

describe('Merge Intervals', () => {
  describe('examples from the problem', () => {
    it('[[1, 3], [2, 6], [8, 10], [15, 18]] → [[1, 6], [8, 10], [15, 18]]', () => {
      expect(merge([[1, 3], [2, 6], [8, 10], [15, 18]])).toEqual([[1, 6], [8, 10], [15, 18]]);
    });

    it('[[1, 4], [4, 5]] → [[1, 5]] (touching intervals merge)', () => {
      expect(merge([[1, 4], [4, 5]])).toEqual([[1, 5]]);
    });

    it('[[4, 7], [1, 4], [9, 9], [2, 3]] → [[1, 7], [9, 9]] (unsorted, nested, and a single point)', () => {
      expect(merge([[4, 7], [1, 4], [9, 9], [2, 3]])).toEqual([[1, 7], [9, 9]]);
    });
  });

  describe('edge cases', () => {
    it('empty input → []', () => {
      expect(merge([])).toEqual([]);
    });

    it('a single interval comes back unchanged', () => {
      expect(merge([[2, 5]])).toEqual([[2, 5]]);
    });

    it('a single point interval [0, 0] is valid', () => {
      expect(merge([[0, 0]])).toEqual([[0, 0]]);
    });

    it('disjoint, non-touching intervals stay separate: [[1, 3], [4, 5]] (a gap of 3 → 4 is not touching)', () => {
      expect(merge([[1, 3], [4, 5]])).toEqual([[1, 3], [4, 5]]);
    });

    it('identical intervals collapse into one', () => {
      expect(merge([[3, 6], [3, 6], [3, 6]])).toEqual([[3, 6]]);
    });

    it('a point that touches an interval end merges: [[5, 5], [1, 5]] → [[1, 5]]', () => {
      expect(merge([[5, 5], [1, 5]])).toEqual([[1, 5]]);
    });
  });

  describe('tricky cases', () => {
    it('a nested interval must not shrink the group: [[1, 10], [2, 3]] → [[1, 10]]', () => {
      expect(merge([[1, 10], [2, 3]])).toEqual([[1, 10]]);
    });

    it('a nested interval followed by one that still overlaps the outer one: [[1, 10], [2, 3], [9, 12]] → [[1, 12]]', () => {
      expect(merge([[1, 10], [2, 3], [9, 12]])).toEqual([[1, 12]]);
    });

    it('chain merging is transitive: [[1, 2], [2, 3], [3, 4], [4, 5]] → [[1, 5]]', () => {
      expect(merge([[1, 2], [2, 3], [3, 4], [4, 5]])).toEqual([[1, 5]]);
    });

    it('reverse-sorted input: [[7, 8], [5, 6], [1, 4], [3, 5]] → [[1, 6], [7, 8]]', () => {
      expect(merge([[7, 8], [5, 6], [1, 4], [3, 5]])).toEqual([[1, 6], [7, 8]]);
    });

    it('one big interval swallows everything, wherever it appears', () => {
      expect(merge([[2, 3], [5, 6], [0, 100], [8, 9]])).toEqual([[0, 100]]);
    });

    it('numeric sort, not string sort: [[10, 11], [2, 3], [9, 10]] → [[2, 3], [9, 11]]', () => {
      expect(merge([[10, 11], [2, 3], [9, 10]])).toEqual([[2, 3], [9, 11]]);
    });

    it('the output is sorted by start even when the input is not', () => {
      expect(merge([[20, 25], [0, 1], [10, 12]])).toEqual([[0, 1], [10, 12], [20, 25]]);
    });
  });

  describe('input must not be modified', () => {
    it('does not reorder the input array', () => {
      const input = [[8, 10], [1, 3], [2, 6]];
      merge(input);
      expect(input).toEqual([[8, 10], [1, 3], [2, 6]]);
    });

    it('does not change the inner [start, end] arrays (extend a copy, not the original)', () => {
      const a = [1, 3];
      const b = [2, 6];
      const result = merge([a, b]);
      expect(result).toEqual([[1, 6]]);
      expect(a).toEqual([1, 3]);
      expect(b).toEqual([2, 6]);
    });

    it('later changes to the result do not leak into the input', () => {
      const input = [[1, 2], [5, 6]];
      const result = merge(input);
      result[0][1] = 99;
      expect(input).toEqual([[1, 2], [5, 6]]);
    });
  });

  describe('randomized (seeded) against a number-line painting reference', () => {
    it('matches the reference on 400 random interval lists', () => {
      const rng = createRng(56);
      for (let t = 0; t < 400; t++) {
        const n = randomInt(rng, 0, 10);
        const intervals = [];
        for (let i = 0; i < n; i++) {
          const s = randomInt(rng, 0, 40);
          intervals.push([s, s + randomInt(rng, 0, 6)]);
        }
        const before = deepCopy(intervals);
        expect(merge(intervals), JSON.stringify(before)).toEqual(bruteForce(before));
        expect(intervals, 'input was modified').toEqual(before);
      }
    });
  });

  describe('performance', () => {
    it('30,000 shuffled intervals finish quickly (comparing all pairs is O(n²))', () => {
      const n = 30_000;
      const rng = createRng(9);
      // Pairs: [10i, 10i+4] and [10i+4, 10i+7] touch and merge; groups never touch each other.
      const intervals = [];
      for (let i = 0; i < n / 2; i++) {
        intervals.push([10 * i, 10 * i + 4], [10 * i + 4, 10 * i + 7]);
      }
      shuffle(rng, intervals);
      const { result, ms } = measure(() => merge(intervals));
      expect(result).toHaveLength(n / 2);
      expect(result[0]).toEqual([0, 7]);
      expect(result[n / 2 - 1]).toEqual([10 * (n / 2 - 1), 10 * (n / 2 - 1) + 7]);
      expect(ms, `took ${ms.toFixed(0)}ms — sort once, then a single pass`).toBeLessThan(500);
    });
  });
});
