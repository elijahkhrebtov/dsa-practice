import { describe, it, expect } from 'vitest';
import { BSTIterator } from './problem.js';
import { TreeNode, arrayToTree, treeToArray } from '../../../lib/tree.js';
import { createRng, randomInt, shuffle, measure } from '../../../lib/test-utils.js';

/** Drains an iterator, checking hasNext() before every next(). */
function drain(it) {
  const out = [];
  while (it.hasNext()) out.push(it.next());
  return out;
}

/** Perfectly balanced BST over sorted vals[lo..hi]. */
function balancedFrom(vals, lo = 0, hi = vals.length - 1) {
  if (lo > hi) return null;
  const mid = (lo + hi) >> 1;
  return new TreeNode(vals[mid], balancedFrom(vals, lo, mid - 1), balancedFrom(vals, mid + 1, hi));
}

/** Plain BST insertion (iterative). */
function bstInsert(root, val) {
  const node = new TreeNode(val);
  if (!root) return node;
  let cur = root;
  for (;;) {
    const side = val < cur.val ? 'left' : 'right';
    if (!cur[side]) {
      cur[side] = node;
      return root;
    }
    cur = cur[side];
  }
}

/** Left chain n, n-1, …, 1 (root is the maximum). Built iteratively. */
function leftChain(n) {
  let root = null;
  for (let v = 1; v <= n; v++) root = new TreeNode(v, root, null);
  return root;
}

/** Right chain 1, 2, …, n (root is the minimum). Built iteratively. */
function rightChain(n) {
  let root = null;
  for (let v = n; v >= 1; v--) root = new TreeNode(v, null, root);
  return root;
}

describe('Binary Search Tree Iterator', () => {
  describe('example from the problem', () => {
    it('[7, 3, 15, null, null, 9, 20]: next 3, 7, hasNext, 9, hasNext, 15, hasNext, 20, hasNext → false', () => {
      const it = new BSTIterator(arrayToTree([7, 3, 15, null, null, 9, 20]));
      expect(it.next()).toBe(3);
      expect(it.next()).toBe(7);
      expect(it.hasNext()).toBe(true);
      expect(it.next()).toBe(9);
      expect(it.hasNext()).toBe(true);
      expect(it.next()).toBe(15);
      expect(it.hasNext()).toBe(true);
      expect(it.next()).toBe(20);
      expect(it.hasNext()).toBe(false);
    });
  });

  describe('basic behaviour', () => {
    it('an empty tree (null): hasNext() is false right away', () => {
      expect(new BSTIterator(null).hasNext()).toBe(false);
    });

    it('a single node: hasNext true → next returns it → hasNext false', () => {
      const it = new BSTIterator(arrayToTree([42]));
      expect(it.hasNext()).toBe(true);
      expect(it.next()).toBe(42);
      expect(it.hasNext()).toBe(false);
    });

    it('the first next() returns the minimum, even when it is deep in the tree', () => {
      const it = new BSTIterator(arrayToTree([50, 30, 70, 20, null, null, null, 10, null, 5]));
      expect(it.next()).toBe(5);
    });

    it('hasNext() never advances: calling it many times in a row changes nothing', () => {
      const it = new BSTIterator(arrayToTree([2, 1, 3]));
      for (let i = 0; i < 5; i++) expect(it.hasNext()).toBe(true);
      expect(it.next()).toBe(1);
      for (let i = 0; i < 5; i++) expect(it.hasNext()).toBe(true);
      expect(it.next()).toBe(2);
      expect(it.next()).toBe(3);
      for (let i = 0; i < 5; i++) expect(it.hasNext()).toBe(false);
    });

    it('next() works without calling hasNext() first', () => {
      const it = new BSTIterator(arrayToTree([4, 2, 6, 1, 3, 5, 7]));
      expect([it.next(), it.next(), it.next(), it.next(), it.next(), it.next(), it.next()]).toEqual([
        1, 2, 3, 4, 5, 6, 7,
      ]);
      expect(it.hasNext()).toBe(false);
    });

    it('handles negative values, zero and ±10^9', () => {
      const root = arrayToTree([0, -5, 1_000_000_000, -1_000_000_000, -1, 7]);
      expect(drain(new BSTIterator(root))).toEqual([-1_000_000_000, -5, -1, 0, 7, 1_000_000_000]);
    });
  });

  describe('tree shapes', () => {
    it('the root is the minimum (only right children): [1, null, 2, null, 3] → 1, 2, 3', () => {
      expect(drain(new BSTIterator(arrayToTree([1, null, 2, null, 3])))).toEqual([1, 2, 3]);
    });

    it('the root is the maximum (only left children): [3, 2, null, 1] → 1, 2, 3', () => {
      expect(drain(new BSTIterator(arrayToTree([3, 2, null, 1])))).toEqual([1, 2, 3]);
    });

    it('zig-zag: [10, 1, null, null, 9, 2, null, null, 8] → 1, 2, 8, 9, 10 (right subtrees with left spines)', () => {
      expect(drain(new BSTIterator(arrayToTree([10, 1, null, null, 9, 2, null, null, 8])))).toEqual([1, 2, 8, 9, 10]);
    });

    it('after a node, the next value is the leftmost node of its right subtree', () => {
      //      5
      //     / \
      //    1   9
      //       /
      //      7
      //     /
      //    6        ← after 5 comes 6, three levels down
      expect(drain(new BSTIterator(arrayToTree([5, 1, 9, null, null, 7, null, 6])))).toEqual([1, 5, 6, 7, 9]);
    });
  });

  describe('independence and immutability', () => {
    it('two iterators over the same tree advance independently', () => {
      const root = arrayToTree([4, 2, 6, 1, 3, 5, 7]);
      const a = new BSTIterator(root);
      const b = new BSTIterator(root);
      expect(a.next()).toBe(1);
      expect(a.next()).toBe(2);
      expect(b.next()).toBe(1);
      expect(a.next()).toBe(3);
      expect(drain(b)).toEqual([2, 3, 4, 5, 6, 7]);
      expect(drain(a)).toEqual([4, 5, 6, 7]);
    });

    it('the tree is unchanged both mid-iteration and after a full iteration', () => {
      const arr = [8, 4, 12, 2, 6, 10, 14, 1, 3, 5, 7];
      const root = arrayToTree(arr);
      const it = new BSTIterator(root);
      it.next();
      it.next();
      it.next();
      expect(treeToArray(root), 'mid-iteration').toEqual(arr);
      drain(it);
      expect(treeToArray(root), 'after iteration').toEqual(arr);
    });
  });

  describe('randomized (seeded, reproducible)', () => {
    it('300 random BSTs with interleaved hasNext()/next() calls produce the sorted values', () => {
      const rng = createRng(1234);
      for (let t = 0; t < 300; t++) {
        const n = randomInt(rng, 0, 40);
        const pool = new Set();
        while (pool.size < n) pool.add(randomInt(rng, -300, 300));
        let root = null;
        for (const v of shuffle(rng, [...pool])) root = bstInsert(root, v);
        const sorted = [...pool].sort((a, b) => a - b);
        const it = new BSTIterator(root);
        const out = [];
        while (out.length < n) {
          if (randomInt(rng, 0, 2) === 0) expect(it.hasNext()).toBe(true);
          out.push(it.next());
        }
        expect(it.hasNext()).toBe(false);
        expect(out).toEqual(sorted);
      }
    });
  });

  describe('large and skewed trees', () => {
    it('a 100,000-node LEFT chain (the minimum is 100,000 levels down) — no recursion allowed', () => {
      const it = new BSTIterator(leftChain(100_000));
      const { result, ms } = measure(() => drain(it));
      expect(result.length).toBe(100_000);
      expect(result[0]).toBe(1);
      expect(result[99_999]).toBe(100_000);
      expect(result.every((v, i) => v === i + 1)).toBe(true);
      expect(ms, `took ${ms.toFixed(0)}ms`).toBeLessThan(1000);
    });

    it('a 100,000-node RIGHT chain (each next() descends one level)', () => {
      const it = new BSTIterator(rightChain(100_000));
      const { result, ms } = measure(() => drain(it));
      expect(result.length).toBe(100_000);
      expect(result.every((v, i) => v === i + 1)).toBe(true);
      expect(ms, `took ${ms.toFixed(0)}ms`).toBeLessThan(1000);
    });

    it('a full iteration of a 131,071-node balanced tree is fast (each node is pushed and popped once in total)', () => {
      const N = 2 ** 17 - 1;
      const root = balancedFrom(Array.from({ length: N }, (_, i) => i * 3));
      const { result, ms } = measure(() => drain(new BSTIterator(root)));
      expect(result.length).toBe(N);
      expect(result.every((v, i) => v === i * 3)).toBe(true);
      expect(ms, `took ${ms.toFixed(0)}ms`).toBeLessThan(1000);
    });
  });
});
