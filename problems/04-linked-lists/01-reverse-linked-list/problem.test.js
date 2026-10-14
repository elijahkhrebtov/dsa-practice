import { describe, it, expect } from 'vitest';
import { reverseList } from './problem.js';
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

/** Reverses `values` via the function under test and returns the result as an array. */
function reverseValues(values) {
  return listToArray(reverseList(arrayToList(values)));
}

describe('Reverse Linked List', () => {
  describe('examples from the problem', () => {
    it('1 → 2 → 3 → 4 → 5 becomes 5 → 4 → 3 → 2 → 1', () => {
      expect(reverseValues([1, 2, 3, 4, 5])).toEqual([5, 4, 3, 2, 1]);
    });

    it('1 → 2 becomes 2 → 1', () => {
      expect(reverseValues([1, 2])).toEqual([2, 1]);
    });

    it('an empty list (null) reverses to null', () => {
      expect(reverseList(null)).toBeNull();
    });
  });

  describe('edge cases', () => {
    it('a single node is its own reverse — return that same node, with next === null', () => {
      const head = arrayToList([7]);
      const result = reverseList(head);
      expect(result).toBe(head);
      expect(result.next).toBeNull();
    });

    it('handles negative values and zeros: -1 → 0 → -5000 → 5000 becomes 5000 → -5000 → 0 → -1', () => {
      expect(reverseValues([-1, 0, -5000, 5000])).toEqual([5000, -5000, 0, -1]);
    });

    it('handles duplicate values: 2 → 2 → 1 → 2 becomes 2 → 1 → 2 → 2', () => {
      expect(reverseValues([2, 2, 1, 2])).toEqual([2, 1, 2, 2]);
    });

    it('a palindrome list reads the same after reversing: 1 → 2 → 1', () => {
      expect(reverseValues([1, 2, 1])).toEqual([1, 2, 1]);
    });
  });

  describe('tricky cases', () => {
    it('the old head becomes the tail and its next is null (no leftover cycle)', () => {
      // Classic bug: forgetting to cut the old head's `next`, leaving 2 → 1 → 2 → 1 → …
      const head = arrayToList([1, 2, 3]);
      const result = reverseList(head);
      expect(head.next).toBeNull();
      expect(listToArray(result, 10)).toEqual([3, 2, 1]);
    });

    it('returns the original tail node as the new head', () => {
      const head = arrayToList([1, 2, 3, 4]);
      const tail = nodesOf(head)[3];
      expect(reverseList(head)).toBe(tail);
    });

    it('re-links the existing nodes instead of creating new ones or swapping values', () => {
      const head = arrayToList([10, 20, 30, 40, 50]);
      const original = nodesOf(head);
      const reversed = nodesOf(reverseList(head));
      expect(reversed).toHaveLength(5);
      reversed.forEach((node, i) => {
        expect(node, `node #${i} of the result should be original node #${4 - i}`).toBe(original[4 - i]);
        expect(node.val).toBe([50, 40, 30, 20, 10][i]);
      });
    });

    it('reversing twice gives back the original order and the original head', () => {
      const head = arrayToList([1, 2, 3, 4, 5, 6]);
      const back = reverseList(reverseList(head));
      expect(back).toBe(head);
      expect(listToArray(back)).toEqual([1, 2, 3, 4, 5, 6]);
    });
  });

  describe('randomized (seeded, reproducible)', () => {
    it('matches Array.prototype.reverse on 300 random lists', () => {
      const rng = createRng(2024);
      for (let t = 0; t < 300; t++) {
        const values = randomIntArray(rng, randomInt(rng, 0, 50), -5000, 5000);
        expect(reverseValues(values)).toEqual([...values].reverse());
      }
    });
  });

  describe('performance & stack depth', () => {
    it('reverses 100,000 nodes quickly (a recursive solution overflows the call stack here — go iterative)', () => {
      const n = 100_000;
      const values = Array.from({ length: n }, (_, i) => (i % 10_001) - 5000);
      const head = arrayToList(values);
      const { result, ms } = measure(() => reverseList(head));
      expectSameArray(listToArray(result), values.reverse(), 'reversed list');
      expect(ms, `took ${ms.toFixed(0)}ms — a single O(n) pass should take a few ms`).toBeLessThan(500);
    });
  });
});
