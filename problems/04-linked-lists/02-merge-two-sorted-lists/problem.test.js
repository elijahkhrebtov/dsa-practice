import { describe, it, expect } from 'vitest';
import { mergeTwoLists } from './problem.js';
import { arrayToList, listToArray } from '../../../lib/linked-list.js';
import { createRng, randomInt, randomIntArray, measure } from '../../../lib/test-utils.js';

/**
 * Compares two long arrays without dumping 100,000-element diffs on failure:
 * reports the lengths and the first differing index instead.
 */
function expectSameArray(actual, expected, what = 'result') {
  expect(actual.length, `${what}: wrong length`).toBe(expected.length);
  const same = (a, b) => (Array.isArray(a) ? a.length === b.length && a.every((x, k) => x === b[k]) : a === b);
  const i = actual.findIndex((v, k) => !same(v, expected[k]));
  const msg = i === -1 ? '' : `${what}: first difference at index ${i}: got ${JSON.stringify(actual[i])}, expected ${JSON.stringify(expected[i])}`;
  expect(i, msg).toBe(-1);
}

/** Collects the node objects of a (finite) list, in order. */
function nodesOf(head) {
  const nodes = [];
  for (let node = head; node; node = node.next) {
    if (nodes.length > 1_000_000) throw new Error('list too long — does it contain a cycle?');
    nodes.push(node);
  }
  return nodes;
}

/** Merges two value arrays via the function under test and returns the result as an array. */
function mergeValues(a, b) {
  return listToArray(mergeTwoLists(arrayToList(a), arrayToList(b)));
}

/** Oracle: concatenate and sort numerically. */
function oracle(a, b) {
  return [...a, ...b].sort((x, y) => x - y);
}

/**
 * Checks that the merged list is made of exactly the original nodes (no copies,
 * none lost, none duplicated) and is sorted.
 */
function expectSplicedFrom(result, originals) {
  const merged = nodesOf(result);
  const pool = new Set(originals);
  expect(merged.length, 'the merged list must contain every input node exactly once').toBe(originals.length);
  for (const node of merged) {
    expect(pool.has(node), `node with val ${node.val} is not one of the input nodes — splice, don't copy`).toBe(true);
    pool.delete(node); // catches a node appearing twice
  }
  for (let i = 1; i < merged.length; i++) {
    expect(merged[i - 1].val, 'result must be sorted').toBeLessThanOrEqual(merged[i].val);
  }
}

describe('Merge Two Sorted Lists', () => {
  describe('examples from the problem', () => {
    it('1 → 2 → 4 merged with 1 → 3 → 4 gives 1 → 1 → 2 → 3 → 4 → 4', () => {
      expect(mergeValues([1, 2, 4], [1, 3, 4])).toEqual([1, 1, 2, 3, 4, 4]);
    });

    it('two empty lists give null', () => {
      expect(mergeTwoLists(null, null)).toBeNull();
    });

    it('an empty list and 0 give 0', () => {
      expect(mergeValues([], [0])).toEqual([0]);
    });
  });

  describe('edge cases', () => {
    it('only list1 is non-empty: returns list1 itself (same head node)', () => {
      const list1 = arrayToList([1, 2, 3]);
      const result = mergeTwoLists(list1, null);
      expect(result).toBe(list1);
      expect(listToArray(result)).toEqual([1, 2, 3]);
    });

    it('only list2 is non-empty: returns list2 itself (same head node)', () => {
      const list2 = arrayToList([4, 5]);
      const result = mergeTwoLists(null, list2);
      expect(result).toBe(list2);
      expect(listToArray(result)).toEqual([4, 5]);
    });

    it('two single nodes: 5 and 1 give 1 → 5', () => {
      expect(mergeValues([5], [1])).toEqual([1, 5]);
    });

    it('handles negative numbers and the value extremes', () => {
      expect(mergeValues([-1_000_000, -3, 0], [-5, 1_000_000])).toEqual([-1_000_000, -5, -3, 0, 1_000_000]);
    });
  });

  describe('tricky cases', () => {
    it("every value of list1 is smaller: 1 → 2 → 3 and 4 → 5 → 6 (just link list1's tail to list2)", () => {
      expect(mergeValues([1, 2, 3], [4, 5, 6])).toEqual([1, 2, 3, 4, 5, 6]);
    });

    it('every value of list2 is smaller: 7 → 8 and 1 → 2 → 3', () => {
      expect(mergeValues([7, 8], [1, 2, 3])).toEqual([1, 2, 3, 7, 8]);
    });

    it('very different lengths: one long list and one single node in the middle', () => {
      expect(mergeValues([1, 2, 3, 4, 6, 7, 8, 9], [5])).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });

    it('perfectly alternating values: 1 → 3 → 5 and 2 → 4 → 6', () => {
      expect(mergeValues([1, 3, 5], [2, 4, 6])).toEqual([1, 2, 3, 4, 5, 6]);
    });

    it('all values equal across both lists: 2 → 2 and 2 → 2 → 2', () => {
      expect(mergeValues([2, 2], [2, 2, 2])).toEqual([2, 2, 2, 2, 2]);
    });

    it('do not stop when one list runs out — the rest of the other list must be attached', () => {
      // Classic bug: looping while BOTH lists are non-empty, then forgetting the leftovers.
      expect(mergeValues([1], [2, 3, 4, 5])).toEqual([1, 2, 3, 4, 5]);
      expect(mergeValues([1, 2, 3, 10], [4])).toEqual([1, 2, 3, 4, 10]);
    });

    it('splices the original nodes together instead of creating new ones', () => {
      const list1 = arrayToList([1, 4, 6]);
      const list2 = arrayToList([2, 3, 5, 7]);
      const originals = [...nodesOf(list1), ...nodesOf(list2)];
      expectSplicedFrom(mergeTwoLists(list1, list2), originals);
    });

    it('the merged list ends with next === null (no dangling link into a cycle)', () => {
      const result = mergeTwoLists(arrayToList([1, 3]), arrayToList([2, 4]));
      expect(listToArray(result, 10)).toEqual([1, 2, 3, 4]);
    });
  });

  describe('randomized (seeded, reproducible)', () => {
    it('matches "concatenate and sort" on 300 random pairs of sorted lists, using only original nodes', () => {
      const rng = createRng(99);
      for (let t = 0; t < 300; t++) {
        const a = randomIntArray(rng, randomInt(rng, 0, 30), -50, 50).sort((x, y) => x - y);
        const b = randomIntArray(rng, randomInt(rng, 0, 30), -50, 50).sort((x, y) => x - y);
        const list1 = arrayToList(a);
        const list2 = arrayToList(b);
        const originals = [...nodesOf(list1), ...nodesOf(list2)];
        const result = mergeTwoLists(list1, list2);
        expect(listToArray(result)).toEqual(oracle(a, b));
        expectSplicedFrom(result, originals);
      }
    });
  });

  describe('performance & stack depth', () => {
    it('merges two 50,000-node lists quickly (a recursive merge overflows the call stack here)', () => {
      const n = 50_000;
      const a = Array.from({ length: n }, (_, i) => 2 * i - n); // even values
      const b = Array.from({ length: n }, (_, i) => 2 * i - n + 1); // odd values → fully interleaved
      const list1 = arrayToList(a);
      const list2 = arrayToList(b);
      const { result, ms } = measure(() => mergeTwoLists(list1, list2));
      const values = listToArray(result);
      expectSameArray(values, Array.from({ length: 2 * n }, (_, i) => i - n), 'merged list');
      expect(ms, `took ${ms.toFixed(0)}ms — one O(n + m) pass should take a few ms`).toBeLessThan(500);
    });
  });
});
