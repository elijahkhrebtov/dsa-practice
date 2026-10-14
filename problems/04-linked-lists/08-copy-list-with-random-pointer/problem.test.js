import { describe, it, expect } from 'vitest';
import { copyRandomList } from './problem.js';
import { pairsToRandomList, randomListToPairs } from '../../../lib/linked-list.js';
import { createRng, randomInt, measure } from '../../../lib/test-utils.js';

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

/**
 * Builds a list from pairs, copies it, and checks everything a deep copy must satisfy:
 *   1. the copy has the same shape ([val, randomIndex] pairs),
 *   2. no node of the copy is an original node,
 *   3. every random pointer of the copy points INTO the copy,
 *   4. the original list is exactly as it was (same nodes, links, values, randoms).
 * Returns the copy's head.
 */
function expectDeepCopy(pairs) {
  const head = pairsToRandomList(pairs);
  const originalNodes = nodesOf(head);
  const originalRandoms = originalNodes.map((n) => n.random);

  const copy = copyRandomList(head);

  // 4. Original untouched.
  expect(nodesOf(head).length, 'the original next-chain must be restored exactly').toBe(originalNodes.length);
  nodesOf(head).forEach((node, i) => {
    expect(node, `original node #${i} must be the same object`).toBe(originalNodes[i]);
    expect(node.random, `original node #${i}.random must be unchanged`).toBe(originalRandoms[i]);
  });
  expect(randomListToPairs(head), 'original values/randoms must be unchanged').toEqual(pairs);

  // 1. Same shape. (randomListToPairs reports -1 for a random that points outside the copy.)
  expect(randomListToPairs(copy), 'copy has the wrong shape (-1 means random points outside the copy)').toEqual(pairs);

  // 2. and 3. Fresh nodes only.
  const originalSet = new Set(originalNodes);
  const copyNodes = nodesOf(copy);
  const copySet = new Set(copyNodes);
  copyNodes.forEach((node, i) => {
    expect(originalSet.has(node), `copy node #${i} is an ORIGINAL node — create new ones`).toBe(false);
    if (node.random !== null) {
      expect(copySet.has(node.random), `copy node #${i}.random points outside the copy`).toBe(true);
    }
  });
  return copy;
}

/** Random pairs: each random is null (~25%) or any index. */
function randomPairs(rng, n) {
  return Array.from({ length: n }, () => [
    randomInt(rng, -10, 10),
    rng() < 0.25 ? null : randomInt(rng, 0, n - 1),
  ]);
}

describe('Copy List with Random Pointer', () => {
  describe('examples from the problem', () => {
    it('[[7, null], [13, 0], [11, 4], [10, 2], [1, 0]] is copied with the same shape', () => {
      expectDeepCopy([[7, null], [13, 0], [11, 4], [10, 2], [1, 0]]);
    });

    it('[[1, 1], [2, 1]]: two randoms pointing at the same node, one pointing at itself', () => {
      expectDeepCopy([[1, 1], [2, 1]]);
    });

    it('[[3, null], [3, 0], [3, null]]: equal values, so pointers must follow nodes, not values', () => {
      expectDeepCopy([[3, null], [3, 0], [3, null]]);
    });
  });

  describe('edge cases', () => {
    it('an empty list (null) copies to null', () => {
      expect(copyRandomList(null)).toBeNull();
    });

    it('a single node with random = null', () => {
      expectDeepCopy([[5, null]]);
    });

    it('a single node whose random points to itself: the copy must point to ITSELF (the copy)', () => {
      const copy = expectDeepCopy([[5, 0]]);
      expect(copy.random).toBe(copy);
    });

    it('every random is null (then it is just a plain list copy)', () => {
      expectDeepCopy([[1, null], [2, null], [3, null], [4, null]]);
    });

    it('handles negative values and zero', () => {
      expectDeepCopy([[-10_000, 2], [0, 0], [10_000, 1]]);
    });
  });

  describe('tricky cases', () => {
    it('random pointers to LATER nodes (the target has not been copied yet when you first see it)', () => {
      expectDeepCopy([[1, 3], [2, 3], [3, 4], [4, 4], [5, null]]);
    });

    it('random pointers to EARLIER nodes', () => {
      expectDeepCopy([[1, null], [2, 0], [3, 0], [4, 1], [5, 2]]);
    });

    it('every node points to itself', () => {
      expectDeepCopy([[1, 0], [2, 1], [3, 2], [4, 3]]);
    });

    it('every node points to the tail (many randoms sharing one target must share one copy)', () => {
      const copy = expectDeepCopy([[1, 4], [2, 4], [3, 4], [4, 4], [5, 4]]);
      const tail = nodesOf(copy)[4];
      nodesOf(copy).forEach((node) => expect(node.random).toBe(tail));
    });

    it('the copy and the original are independent: changing the copy does not affect the original', () => {
      const head = pairsToRandomList([[1, 1], [2, 0]]);
      const copy = copyRandomList(head);
      copy.val = 100;
      copy.next.random = null;
      expect(randomListToPairs(head)).toEqual([[1, 1], [2, 0]]);
    });
  });

  describe('randomized (seeded, reproducible)', () => {
    it('300 random lists (up to 40 nodes) are deep-copied correctly and the originals stay intact', () => {
      const rng = createRng(1234);
      for (let t = 0; t < 300; t++) {
        expectDeepCopy(randomPairs(rng, randomInt(rng, 1, 40)));
      }
    });
  });

  describe('performance', () => {
    it('copies an 80,000-node list quickly (looking up each random target by walking from the head is O(n²) — too slow)', () => {
      const n = 80_000;
      const pairs = Array.from({ length: n }, (_, i) => [(i % 20_001) - 10_000, i % 5 === 0 ? null : (i * 7919) % n]);
      const head = pairsToRandomList(pairs);
      const { result, ms } = measure(() => copyRandomList(head));
      expectSameArray(randomListToPairs(result), pairs, 'copy');
      expect(result === head, 'must return a copy, not the original head').toBe(false);
      expectSameArray(randomListToPairs(head), pairs, 'original after copying');
      expect(ms, `took ${ms.toFixed(0)}ms — aim for O(n)`).toBeLessThan(500);
    });
  });
});
