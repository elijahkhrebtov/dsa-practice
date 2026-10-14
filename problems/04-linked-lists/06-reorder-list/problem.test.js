import { describe, it, expect } from 'vitest';
import { reorderList } from './problem.js';
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

/** Collects the node objects of a list, in order (guards against accidental cycles). */
function nodesOf(head, limit = 1_000_000) {
  const nodes = [];
  for (let node = head; node; node = node.next) {
    if (nodes.length >= limit) throw new Error(`more than ${limit} nodes — did you leave a cycle?`);
    nodes.push(node);
  }
  return nodes;
}

/** Oracle: the expected order of ORIGINAL INDICES, e.g. 5 → [0, 4, 1, 3, 2]. */
function expectedOrder(length) {
  const order = [];
  for (let lo = 0, hi = length - 1; lo <= hi; lo++, hi--) {
    order.push(lo);
    if (lo !== hi) order.push(hi);
  }
  return order;
}

/** Reorders a fresh list built from `values` and returns the values read from the original head. */
function reorderValues(values) {
  const head = arrayToList(values);
  reorderList(head);
  return listToArray(head, values.length + 1); // +1 so a leftover cycle throws instead of hanging
}

/** Reorders and checks that the result is the original nodes in the expected order (no copies). */
function expectReorderedNodes(values) {
  const head = arrayToList(values);
  const original = nodesOf(head);
  reorderList(head);
  const result = nodesOf(head, values.length + 1);
  const order = expectedOrder(values.length);
  expect(result.length, 'every node must still be in the list, exactly once').toBe(values.length);
  result.forEach((node, i) => {
    expect(node, `position ${i} should hold original node #${order[i]}`).toBe(original[order[i]]);
    expect(node.val).toBe(values[order[i]]);
  });
}

describe('Reorder List', () => {
  describe('examples from the problem', () => {
    it('1 → 2 → 3 → 4 becomes 1 → 4 → 2 → 3', () => {
      expect(reorderValues([1, 2, 3, 4])).toEqual([1, 4, 2, 3]);
    });

    it('1 → 2 → 3 → 4 → 5 becomes 1 → 5 → 2 → 4 → 3 (the middle node ends up last)', () => {
      expect(reorderValues([1, 2, 3, 4, 5])).toEqual([1, 5, 2, 4, 3]);
    });

    it('1 → 2 stays 1 → 2', () => {
      expect(reorderValues([1, 2])).toEqual([1, 2]);
    });
  });

  describe('edge cases', () => {
    it('an empty list (null) does not throw', () => {
      expect(() => reorderList(null)).not.toThrow();
    });

    it('a single node stays as it is, with next === null', () => {
      const head = arrayToList([9]);
      reorderList(head);
      expect(head.val).toBe(9);
      expect(head.next).toBeNull();
    });

    it('three nodes: 1 → 2 → 3 becomes 1 → 3 → 2', () => {
      expect(reorderValues([1, 2, 3])).toEqual([1, 3, 2]);
    });

    it('six nodes: 1 → 2 → 3 → 4 → 5 → 6 becomes 1 → 6 → 2 → 5 → 3 → 4', () => {
      expect(reorderValues([1, 2, 3, 4, 5, 6])).toEqual([1, 6, 2, 5, 3, 4]);
    });

    it('works with the value extremes and duplicates: 1000 → 1 → 1 → 1000 becomes 1000 → 1000 → 1 → 1', () => {
      expect(reorderValues([1000, 1, 1, 1000])).toEqual([1000, 1000, 1, 1]);
    });
  });

  describe('tricky cases', () => {
    it('the original head stays the head (the result is read from it — nothing is returned)', () => {
      const head = arrayToList([1, 2, 3, 4, 5]);
      const second = head.next;
      reorderList(head);
      expect(head.val).toBe(1);
      expect(head.next.val).toBe(5);
      expect(head.next.next).toBe(second);
    });

    it('the new tail has next === null — no cycle left behind (odd length)', () => {
      // Classic bug: forgetting to cut the first half off from the second half.
      const head = arrayToList([1, 2, 3, 4, 5, 6, 7]);
      reorderList(head);
      const nodes = nodesOf(head, 8);
      expect(nodes).toHaveLength(7);
      expect(nodes[6].val).toBe(4);
      expect(nodes[6].next).toBeNull();
    });

    it('the new tail has next === null — no cycle left behind (even length)', () => {
      const head = arrayToList([1, 2, 3, 4, 5, 6, 7, 8]);
      reorderList(head);
      const nodes = nodesOf(head, 9);
      expect(nodes.map((n) => n.val)).toEqual([1, 8, 2, 7, 3, 6, 4, 5]);
      expect(nodes[7].next).toBeNull();
    });

    it('re-links the original nodes for every length 0–12 (no new nodes, no value swapping)', () => {
      for (let len = 0; len <= 12; len++) {
        expectReorderedNodes(Array.from({ length: len }, (_, i) => i + 1));
      }
    });

    it('all values equal: identity still has to follow the L0, Ln, L1, Ln-1 pattern', () => {
      expectReorderedNodes([5, 5, 5, 5, 5, 5, 5]);
    });
  });

  describe('randomized (seeded, reproducible)', () => {
    it('matches an array-based interleave on 300 random lists, reusing the original nodes', () => {
      const rng = createRng(8086);
      for (let t = 0; t < 300; t++) {
        const values = randomIntArray(rng, randomInt(rng, 0, 50), 1, 1000);
        const expected = expectedOrder(values.length).map((i) => values[i]);
        expect(reorderValues(values), `values=${values}`).toEqual(expected);
        expectReorderedNodes(values);
      }
    });
  });

  describe('performance & stack depth', () => {
    it('reorders 100,000 nodes quickly (walking to the tail for every node is O(n²) — far too slow; recursion overflows)', () => {
      const n = 100_000;
      const values = Array.from({ length: n }, (_, i) => (i % 1000) + 1);
      const head = arrayToList(values);
      const { ms } = measure(() => reorderList(head));
      const expected = expectedOrder(n).map((i) => values[i]);
      expectSameArray(listToArray(head, n + 1), expected, 'reordered list');
      expect(ms, `took ${ms.toFixed(0)}ms — find the middle, reverse, merge: O(n)`).toBeLessThan(500);
    });
  });
});
