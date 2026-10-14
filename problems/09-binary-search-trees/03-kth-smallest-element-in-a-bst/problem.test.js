import { describe, it, expect } from 'vitest';
import { kthSmallest } from './problem.js';
import { TreeNode, arrayToTree, treeToArray } from '../../../lib/tree.js';
import { createRng, randomInt, shuffle, measure } from '../../../lib/test-utils.js';

/** Perfectly balanced BST over the sorted array vals[lo..hi]. */
function balancedFrom(vals, lo = 0, hi = vals.length - 1) {
  if (lo > hi) return null;
  const mid = (lo + hi) >> 1;
  return new TreeNode(vals[mid], balancedFrom(vals, lo, mid - 1), balancedFrom(vals, mid + 1, hi));
}

/** Plain BST insertion (iterative), used to build random-shaped trees. */
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

describe('Kth Smallest Element in a BST', () => {
  describe('examples from the problem', () => {
    it('[3, 1, 4, null, 2], k = 1 → 1 (k = 1 is the minimum)', () => {
      expect(kthSmallest(arrayToTree([3, 1, 4, null, 2]), 1)).toBe(1);
    });

    it('[5, 3, 6, 2, 4, null, null, 1], k = 3 → 3', () => {
      expect(kthSmallest(arrayToTree([5, 3, 6, 2, 4, null, null, 1]), 3)).toBe(3);
    });

    it('[5, 3, 6, 2, 4, null, null, 1], k = 6 → 6 (k = n is the maximum)', () => {
      expect(kthSmallest(arrayToTree([5, 3, 6, 2, 4, null, null, 1]), 6)).toBe(6);
    });
  });

  describe('edge cases', () => {
    it('a single node with k = 1 → that node\'s value', () => {
      expect(kthSmallest(arrayToTree([7]), 1)).toBe(7);
    });

    it('[2, 1]: k = 1 → 1, k = 2 → 2 (the root can be the answer)', () => {
      expect(kthSmallest(arrayToTree([2, 1]), 1)).toBe(1);
      expect(kthSmallest(arrayToTree([2, 1]), 2)).toBe(2);
    });

    it('[1, null, 2]: k = 1 → 1 (the root is the minimum when there is no left subtree)', () => {
      expect(kthSmallest(arrayToTree([1, null, 2]), 1)).toBe(1);
      expect(kthSmallest(arrayToTree([1, null, 2]), 2)).toBe(2);
    });

    it('handles negative values and zero', () => {
      const root = arrayToTree([0, -5, 5, -10, -2, 3, 8]);
      expect(kthSmallest(root, 1)).toBe(-10);
      expect(kthSmallest(root, 3)).toBe(-2);
      expect(kthSmallest(root, 4)).toBe(0);
    });

    it('handles values at ±10^9', () => {
      const root = arrayToTree([0, -1_000_000_000, 1_000_000_000]);
      expect(kthSmallest(root, 1)).toBe(-1_000_000_000);
      expect(kthSmallest(root, 3)).toBe(1_000_000_000);
    });
  });

  describe('tricky cases', () => {
    it('every k from 1 to 15 on a full 4-level tree returns the k-th value of the sorted order', () => {
      const root = arrayToTree([80, 40, 120, 20, 60, 100, 140, 10, 30, 50, 70, 90, 110, 130, 150]);
      for (let k = 1; k <= 15; k++) expect(kthSmallest(root, k), `k = ${k}`).toBe(k * 10);
    });

    it('the answer can sit in the right subtree of a left child: [5, 2, 6, 1, 4, null, null, null, null, 3], k = 3 → 3', () => {
      expect(kthSmallest(arrayToTree([5, 2, 6, 1, 4, null, null, null, null, 3]), 3)).toBe(3);
    });

    it('a left-leaning chain (the minimum is at the bottom): k = 1 and k = n', () => {
      const root = arrayToTree([5, 4, null, 3, null, 2, null, 1]);
      expect(kthSmallest(root, 1)).toBe(1);
      expect(kthSmallest(root, 5)).toBe(5);
    });

    it('a right-leaning chain (the minimum is the root): k = 1 and k = n', () => {
      const root = arrayToTree([1, null, 2, null, 3, null, 4, null, 5]);
      expect(kthSmallest(root, 1)).toBe(1);
      expect(kthSmallest(root, 5)).toBe(5);
    });

    it('a zig-zag shaped tree: [10, 1, null, null, 9, 2, null, null, 8], every k', () => {
      const root = arrayToTree([10, 1, null, null, 9, 2, null, null, 8]);
      const sorted = [1, 2, 8, 9, 10];
      sorted.forEach((v, i) => expect(kthSmallest(root, i + 1), `k = ${i + 1}`).toBe(v));
    });

    it('repeated calls on the same tree give consistent answers and do not modify it', () => {
      const arr = [5, 3, 6, 2, 4, null, null, 1];
      const root = arrayToTree(arr);
      expect(kthSmallest(root, 2)).toBe(2);
      expect(kthSmallest(root, 5)).toBe(5);
      expect(kthSmallest(root, 2)).toBe(2);
      expect(treeToArray(root)).toEqual(arr);
    });

    it('a 3,000-deep left chain: k = 1, 1,500 and 3,000', () => {
      let root = null;
      for (let v = 1; v <= 3000; v++) root = new TreeNode(v, root, null); // each new root is larger
      expect(kthSmallest(root, 1)).toBe(1);
      expect(kthSmallest(root, 1500)).toBe(1500);
      expect(kthSmallest(root, 3000)).toBe(3000);
    });
  });

  describe('randomized (seeded, reproducible)', () => {
    it('matches "sort all values, take index k - 1" on 300 random BSTs', () => {
      const rng = createRng(99);
      for (let t = 0; t < 300; t++) {
        const n = randomInt(rng, 1, 40);
        const pool = new Set();
        while (pool.size < n) pool.add(randomInt(rng, -500, 500));
        const values = shuffle(rng, [...pool]);
        let root = null;
        for (const v of values) root = bstInsert(root, v);
        const sorted = [...values].sort((a, b) => a - b);
        const k = randomInt(rng, 1, n);
        expect(kthSmallest(root, k), `values ${values}, k = ${k}`).toBe(sorted[k - 1]);
      }
    });
  });

  describe('performance', () => {
    const N = 2 ** 17 - 1; // 131,071 nodes
    const root = balancedFrom(Array.from({ length: N }, (_, i) => i + 1));

    it('2,000 queries with small k on a 131,071-node tree (stop after k nodes; a full traversal per call is far too slow)', () => {
      const { result, ms } = measure(() => {
        let sum = 0;
        for (let q = 0; q < 2000; q++) sum += kthSmallest(root, (q % 20) + 1);
        return sum;
      });
      expect(result).toBe(100 * 210); // each k in 1..20 is asked 100 times; sum(1..20) = 210
      expect(ms, `took ${ms.toFixed(0)}ms — aim for O(h + k) per call`).toBeLessThan(500);
    });

    it('k = n on the same tree still works (a single full in-order walk)', () => {
      const { result, ms } = measure(() => kthSmallest(root, N));
      expect(result).toBe(N);
      expect(ms).toBeLessThan(1000);
    });
  });
});
