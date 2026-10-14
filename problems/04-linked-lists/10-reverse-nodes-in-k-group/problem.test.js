import { describe, it, expect } from 'vitest';
import { reverseKGroup } from './problem.js';
import { arrayToList, listToArray } from '../../../lib/linked-list.js';
import { createRng, randomInt, measure } from '../../../lib/test-utils.js';

/**
 * Compares two long arrays without dumping 100,000-element diffs on failure:
 * reports the lengths and the first differing index instead.
 */
function expectSameArray(actual, expected, what = 'result') {
  expect(actual.length, `${what}: wrong length`).toBe(expected.length);
  const i = actual.findIndex((v, k) => v !== expected[k]);
  const msg = i === -1 ? '' : `${what}: first difference at index ${i}: got ${actual[i]}, expected ${expected[i]}`;
  expect(i, msg).toBe(-1);
}

/** Collects the node objects of a list, in order (guards against accidental cycles). */
function nodesOf(head, limit = 1_000_000) {
  const nodes = [];
  for (let node = head; node; node = node.next) {
    if (nodes.length >= limit) throw new Error(`more than ${limit} nodes — did you leave a cycle?`);
    nodes.push(node);
  }
  return nodes;
}

/** Oracle: the expected order of ORIGINAL INDICES for a list of `n` nodes. */
function expectedOrder(n, k) {
  const order = [];
  let start = 0;
  for (; start + k <= n; start += k) {
    for (let i = start + k - 1; i >= start; i--) order.push(i);
  }
  for (let i = start; i < n; i++) order.push(i); // leftover group keeps its order
  return order;
}

/** Runs reverseKGroup on a fresh list and returns the resulting values. */
function reverseValues(values, k) {
  return listToArray(reverseKGroup(arrayToList(values), k), values.length + 1);
}

/** Runs reverseKGroup and checks that the result consists of the original nodes in the expected order. */
function expectRelinked(values, k) {
  const head = arrayToList(values);
  const original = nodesOf(head);
  const result = nodesOf(reverseKGroup(head, k), values.length + 1);
  const order = expectedOrder(values.length, k);
  expect(result.length, `n=${values.length}, k=${k}: every node must appear exactly once`).toBe(values.length);
  result.forEach((node, i) => {
    expect(node, `n=${values.length}, k=${k}: position ${i} should hold original node #${order[i]}`).toBe(original[order[i]]);
  });
}

describe('Reverse Nodes in k-Group', () => {
  describe('examples from the problem', () => {
    it('1 → 2 → 3 → 4 → 5, k = 2 gives 2 → 1 → 4 → 3 → 5 (the lone 5 stays put)', () => {
      expect(reverseValues([1, 2, 3, 4, 5], 2)).toEqual([2, 1, 4, 3, 5]);
    });

    it('1 → 2 → 3 → 4 → 5, k = 3 gives 3 → 2 → 1 → 4 → 5 (the partial group 4 → 5 keeps its order)', () => {
      expect(reverseValues([1, 2, 3, 4, 5], 3)).toEqual([3, 2, 1, 4, 5]);
    });

    it('1 → 2 → 3 → 4 → 5 → 6, k = 3 gives 3 → 2 → 1 → 6 → 5 → 4 (no leftover)', () => {
      expect(reverseValues([1, 2, 3, 4, 5, 6], 3)).toEqual([3, 2, 1, 6, 5, 4]);
    });
  });

  describe('edge cases', () => {
    it('k = 1 leaves the list unchanged and returns the same head', () => {
      const head = arrayToList([1, 2, 3]);
      const result = reverseKGroup(head, 1);
      expect(result).toBe(head);
      expect(listToArray(result, 4)).toEqual([1, 2, 3]);
    });

    it('a single node with k = 1 is returned as is', () => {
      const head = arrayToList([42]);
      expect(reverseKGroup(head, 1)).toBe(head);
      expect(head.next).toBeNull();
    });

    it('k = n reverses the whole list: 1 → 2 → 3 → 4, k = 4 gives 4 → 3 → 2 → 1', () => {
      expect(reverseValues([1, 2, 3, 4], 4)).toEqual([4, 3, 2, 1]);
    });

    it('k > n changes nothing: 1 → 2 → 3, k = 4 stays 1 → 2 → 3 (one incomplete group)', () => {
      const head = arrayToList([1, 2, 3]);
      const result = reverseKGroup(head, 4);
      expect(result).toBe(head);
      expect(listToArray(result, 4)).toEqual([1, 2, 3]);
    });

    it('two nodes, k = 2 gives 2 → 1', () => {
      expect(reverseValues([1, 2], 2)).toEqual([2, 1]);
    });

    it('handles zeros and duplicates: 0 → 0 → 1000 → 1000 → 0, k = 2 gives 0 → 0 → 1000 → 1000 → 0', () => {
      expect(reverseValues([0, 0, 1000, 1000, 0], 2)).toEqual([0, 0, 1000, 1000, 0]);
    });
  });

  describe('tricky cases', () => {
    it('a leftover of exactly k - 1 nodes stays in order: 1..8, k = 3 gives 3 2 1 6 5 4 7 8', () => {
      expect(reverseValues([1, 2, 3, 4, 5, 6, 7, 8], 3)).toEqual([3, 2, 1, 6, 5, 4, 7, 8]);
    });

    it('groups must be connected to each other: 1..9, k = 3 gives 3 2 1 6 5 4 9 8 7', () => {
      // Classic bug: reversing each group correctly but linking the previous group's tail
      // to the group's OLD head instead of its new head.
      expect(reverseValues([1, 2, 3, 4, 5, 6, 7, 8, 9], 3)).toEqual([3, 2, 1, 6, 5, 4, 9, 8, 7]);
    });

    it('the last reversed group points at the leftover, not at null: 1..5, k = 2 → … 3 → 5', () => {
      const result = nodesOf(reverseKGroup(arrayToList([1, 2, 3, 4, 5]), 2), 6);
      expect(result[3].val).toBe(3);
      expect(result[3].next).toBe(result[4]);
      expect(result[4].next).toBeNull();
    });

    it('the final node always has next === null (no cycle left behind) when n is a multiple of k', () => {
      const result = nodesOf(reverseKGroup(arrayToList([1, 2, 3, 4, 5, 6]), 2), 7);
      expect(result.map((n) => n.val)).toEqual([2, 1, 4, 3, 6, 5]);
      expect(result[5].next).toBeNull();
    });

    it('re-links the original nodes for every n in 1..12 and k in 1..13 (no value swapping, no new nodes)', () => {
      for (let n = 1; n <= 12; n++) {
        for (let k = 1; k <= 13; k++) expectRelinked(Array.from({ length: n }, (_, i) => i), k);
      }
    });

    it('all values equal: node identity must still follow the group-reversal pattern', () => {
      expectRelinked([7, 7, 7, 7, 7, 7, 7], 3);
    });
  });

  describe('randomized (seeded, reproducible)', () => {
    it('matches an array-based chunk reversal on 300 random lists and k values', () => {
      const rng = createRng(777);
      for (let t = 0; t < 300; t++) {
        const n = randomInt(rng, 1, 60);
        const values = Array.from({ length: n }, () => randomInt(rng, 0, 1000));
        const k = randomInt(rng, 1, n + 2);
        const expected = expectedOrder(n, k).map((i) => values[i]);
        expect(reverseValues(values, k), `n=${n}, k=${k}`).toEqual(expected);
      }
    });
  });

  describe('performance & stack depth', () => {
    it('100,000 nodes with k = 2, 3, 1,000 and 100,000 stay fast (recursing once per group overflows the stack at k = 2)', () => {
      const n = 100_000;
      const values = Array.from({ length: n }, (_, i) => i % 1001);
      for (const k of [2, 3, 1000, n]) {
        const head = arrayToList(values);
        const { result, ms } = measure(() => reverseKGroup(head, k));
        const expected = expectedOrder(n, k).map((i) => values[i]);
        expectSameArray(listToArray(result, n + 1), expected, `k=${k}`);
        expect(ms, `k=${k} took ${ms.toFixed(0)}ms — aim for one O(n) pass with O(1) extra space`).toBeLessThan(500);
      }
    });
  });
});
