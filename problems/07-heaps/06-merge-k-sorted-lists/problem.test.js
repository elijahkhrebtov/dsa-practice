import { describe, it, expect } from 'vitest';
import { mergeKLists } from './problem.js';
import { arrayToList, listToArray } from '../../../lib/linked-list.js';
import { createRng, randomInt, randomIntArray, measure } from '../../../lib/test-utils.js';

/** Builds the lists from arrays, merges them, and returns the merged values as an array. */
function mergeArrays(arrays) {
  return listToArray(mergeKLists(arrays.map((a) => arrayToList(a))));
}

/** Brute force: concatenate and sort. */
const bruteMerge = (arrays) => arrays.flat().sort((a, b) => a - b);

/** Sorted random array of length n. */
const sortedRandom = (rng, n, lo, hi) => randomIntArray(rng, n, lo, hi).sort((a, b) => a - b);

describe('Merge k Sorted Lists', () => {
  describe('examples from the problem', () => {
    it('[1→4→5, 1→3→4, 2→6] → 1→1→2→3→4→4→5→6', () => {
      expect(mergeArrays([[1, 4, 5], [1, 3, 4], [2, 6]])).toEqual([1, 1, 2, 3, 4, 4, 5, 6]);
    });

    it('no lists at all: [] → null', () => {
      expect(mergeKLists([])).toBeNull();
    });

    it('only empty lists: [null, null] → null', () => {
      expect(mergeKLists([null, null])).toBeNull();
    });

    it('[null, 0→7, null] → 0→7 (empty lists are skipped)', () => {
      expect(mergeArrays([[], [0, 7], []])).toEqual([0, 7]);
    });
  });

  describe('edge cases', () => {
    it('a single list comes back unchanged', () => {
      expect(mergeArrays([[1, 2, 3]])).toEqual([1, 2, 3]);
    });

    it('a single one-node list', () => {
      expect(mergeArrays([[5]])).toEqual([5]);
    });

    it('a single empty list: [null] → null', () => {
      expect(mergeKLists([null])).toBeNull();
    });

    it('many one-node lists in reverse order: [5], [4], [3], [2], [1] → 1..5', () => {
      expect(mergeArrays([[5], [4], [3], [2], [1]])).toEqual([1, 2, 3, 4, 5]);
    });

    it('negative values and the bounds ±10^4', () => {
      expect(mergeArrays([[-10000, 0, 10000], [-5, -5], [10000]])).toEqual([-10000, -5, -5, 0, 10000, 10000]);
    });

    it('the result is null-terminated (the last node points to null, no cycles)', () => {
      const head = mergeKLists([arrayToList([1, 3]), arrayToList([2, 4])]);
      let node = head;
      let steps = 0;
      while (node.next && steps < 10) {
        node = node.next;
        steps++;
      }
      expect(node.val).toBe(4);
      expect(node.next).toBeNull();
    });
  });

  describe('tricky cases', () => {
    it('lists that do not overlap at all: [7, 8, 9], [1, 2, 3], [4, 5, 6] → 1..9', () => {
      expect(mergeArrays([[7, 8, 9], [1, 2, 3], [4, 5, 6]])).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });

    it('lots of duplicates across and within lists: no value may be lost', () => {
      expect(mergeArrays([[1, 1, 1], [1, 1], [0, 1, 2]])).toEqual([0, 1, 1, 1, 1, 1, 1, 2]);
    });

    it('very different lengths: one long list and several tiny ones', () => {
      const long = Array.from({ length: 50 }, (_, i) => i * 2);
      expect(mergeArrays([long, [3], [], [49, 101]])).toEqual(bruteMerge([long, [3], [49, 101]]));
    });

    it('when one list runs out, the rest of the other lists must still be emitted', () => {
      expect(mergeArrays([[1], [2, 3, 4, 5, 6]])).toEqual([1, 2, 3, 4, 5, 6]);
    });

    it('empty lists mixed in everywhere, including first and last', () => {
      expect(mergeArrays([[], [2], [], [1, 3], []])).toEqual([1, 2, 3]);
    });
  });

  describe('randomized (seeded) against concatenate-and-sort', () => {
    it('300 random sets of lists (k up to 12, lengths up to 15, some empty)', () => {
      const rng = createRng(606);
      for (let t = 0; t < 300; t++) {
        const k = randomInt(rng, 0, 12);
        const arrays = Array.from({ length: k }, () => sortedRandom(rng, randomInt(rng, 0, 15), -20, 20));
        expect(mergeArrays(arrays), JSON.stringify(arrays)).toEqual(bruteMerge(arrays));
      }
    });
  });

  describe('performance', () => {
    it('5,000 lists × 20 nodes (merging the lists one by one into a growing result is O(k·N))', () => {
      const rng = createRng(1);
      const arrays = Array.from({ length: 5000 }, () => sortedRandom(rng, 20, -10_000, 10_000));
      const expected = bruteMerge(arrays);
      const lists = arrays.map((a) => arrayToList(a));
      const { result, ms } = measure(() => mergeKLists(lists));
      expect(listToArray(result)).toEqual(expected);
      expect(ms, `took ${ms.toFixed(0)}ms — use a heap of list heads (or merge in pairs)`).toBeLessThan(500);
    });

    it('10,000 lists where most are empty or a single node stays fast', () => {
      const rng = createRng(2);
      const arrays = Array.from({ length: 10_000 }, (_, i) => (i % 3 === 0 ? [] : sortedRandom(rng, randomInt(rng, 1, 3), -10_000, 10_000)));
      const expected = bruteMerge(arrays);
      const lists = arrays.map((a) => arrayToList(a));
      const { result, ms } = measure(() => mergeKLists(lists));
      expect(listToArray(result)).toEqual(expected);
      expect(ms, `took ${ms.toFixed(0)}ms`).toBeLessThan(500);
    });
  });
});
