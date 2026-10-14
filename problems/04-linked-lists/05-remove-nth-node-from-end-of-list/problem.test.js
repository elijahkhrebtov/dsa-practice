import { describe, it, expect } from 'vitest';
import { removeNthFromEnd } from './problem.js';
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

/** Runs removeNthFromEnd on `values` and returns the resulting values. */
function removeValues(values, n) {
  return listToArray(removeNthFromEnd(arrayToList(values), n));
}

/**
 * Runs removeNthFromEnd and checks that the result is exactly the original
 * nodes minus the one at index (length - n), in the original order.
 */
function expectRemovedByRelinking(values, n) {
  const head = arrayToList(values);
  const original = nodesOf(head);
  const expected = original.filter((_, i) => i !== original.length - n);
  const result = nodesOf(removeNthFromEnd(head, n));
  expect(result.length, `removing n=${n} from a list of ${values.length}`).toBe(expected.length);
  result.forEach((node, i) => {
    expect(node, `node #${i} of the result should be the original node, not a copy`).toBe(expected[i]);
  });
}

describe('Remove Nth Node From End of List', () => {
  describe('examples from the problem', () => {
    it('1 → 2 → 3 → 4 → 5, n = 2 gives 1 → 2 → 3 → 5', () => {
      expect(removeValues([1, 2, 3, 4, 5], 2)).toEqual([1, 2, 3, 5]);
    });

    it('a single node, n = 1 gives an empty list (null)', () => {
      expect(removeNthFromEnd(arrayToList([1]), 1)).toBeNull();
    });

    it('1 → 2, n = 1 gives 1 (remove the tail)', () => {
      expect(removeValues([1, 2], 1)).toEqual([1]);
    });

    it('1 → 2, n = 2 gives 2 (remove the head)', () => {
      expect(removeValues([1, 2], 2)).toEqual([2]);
    });
  });

  describe('edge cases', () => {
    it('removing the head returns the old second node itself as the new head', () => {
      const head = arrayToList([10, 20, 30]);
      const second = head.next;
      expect(removeNthFromEnd(head, 3)).toBe(second);
    });

    it('removing any node other than the head returns the same head node', () => {
      const head = arrayToList([10, 20, 30]);
      expect(removeNthFromEnd(head, 1)).toBe(head);
    });

    it('removing the tail leaves the new tail with next === null', () => {
      const head = arrayToList([1, 2, 3, 4]);
      const third = head.next.next;
      removeNthFromEnd(head, 1);
      expect(third.next).toBeNull();
    });

    it('handles values at the extremes, including 0 (falsy!)', () => {
      expect(removeValues([0, 100, 0], 2)).toEqual([0, 0]);
    });
  });

  describe('tricky cases', () => {
    it('remove the middle of an odd-length list: 1 → 2 → 3 → 4 → 5, n = 3 gives 1 → 2 → 4 → 5', () => {
      expect(removeValues([1, 2, 3, 4, 5], 3)).toEqual([1, 2, 4, 5]);
    });

    it('n = length - 1 removes the second node: 1 → 2 → 3 → 4, n = 3 gives 1 → 3 → 4', () => {
      expect(removeValues([1, 2, 3, 4], 3)).toEqual([1, 3, 4]);
    });

    it('duplicate values: 7 → 7 → 7 → 7, n = 2 must remove the THIRD node (check which node, not which value)', () => {
      expectRemovedByRelinking([7, 7, 7, 7], 2);
    });

    it('re-links the original nodes for every n in a 6-node list (no copies, no value shifting)', () => {
      for (let n = 1; n <= 6; n++) expectRemovedByRelinking([1, 2, 3, 4, 5, 6], n);
    });
  });

  describe('randomized (seeded, reproducible)', () => {
    it('matches Array.prototype.splice on 300 random lists and n values', () => {
      const rng = createRng(555);
      for (let t = 0; t < 300; t++) {
        const values = randomIntArray(rng, randomInt(rng, 1, 40), 0, 100);
        const n = randomInt(rng, 1, values.length);
        const expected = [...values];
        expected.splice(values.length - n, 1);
        expect(removeValues(values, n), `values=${values}, n=${n}`).toEqual(expected);
      }
    });
  });

  describe('performance & stack depth', () => {
    it('100,000 nodes, removing the head, the middle and the tail (a recursive solution overflows the stack here)', () => {
      const len = 100_000;
      const values = Array.from({ length: len }, (_, i) => i % 101);
      const lists = [len, len / 2, 1].map((n) => ({ n, head: arrayToList(values) }));
      const { result, ms } = measure(() => lists.map(({ head, n }) => removeNthFromEnd(head, n)));
      result.forEach((head, k) => {
        const expected = [...values];
        expected.splice(len - lists[k].n, 1);
        expectSameArray(listToArray(head), expected, `after removing n=${lists[k].n}`);
      });
      expect(ms, `took ${ms.toFixed(0)}ms — this should be a linear walk`).toBeLessThan(500);
    });
  });
});
