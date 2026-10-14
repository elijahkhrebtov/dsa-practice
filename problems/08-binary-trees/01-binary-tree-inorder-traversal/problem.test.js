import { describe, it, expect } from 'vitest';
import { inorderTraversal } from './problem.js';
import { TreeNode, arrayToTree, treeToArray } from '../../../lib/tree.js';
import { createRng, randomInt, randomIntArray, measure } from '../../../lib/test-utils.js';

/**
 * Builds a random tree whose in-order sequence is exactly `values`: pick a
 * random index as the root of each range, build the left part from the
 * values before it and the right part from the values after it. `skew` is
 * the probability of choosing an end of the range, which produces long
 * one-sided chains. The expected answer is therefore known without ever
 * traversing the tree.
 */
function randomTreeWithInorder(rng, values, skew = 0) {
  function build(lo, hi) {
    if (lo > hi) return null;
    let mid = randomInt(rng, lo, hi);
    if (rng() < skew) mid = rng() < 0.5 ? lo : hi;
    return new TreeNode(values[mid], build(lo, mid - 1), build(mid + 1, hi));
  }
  return build(0, values.length - 1);
}

/** A chain where every node is the left child of the previous one; in-order is 0, 1, …, n-1. */
function leftChain(n) {
  let root = null;
  for (let i = 0; i < n; i++) root = new TreeNode(i, root, null);
  return root;
}

/** A chain where every node is the right child of the previous one; in-order is 0, 1, …, n-1. */
function rightChain(n) {
  let root = null;
  for (let i = n - 1; i >= 0; i--) root = new TreeNode(i, null, root);
  return root;
}

const range = (n) => Array.from({ length: n }, (_, i) => i);

describe('Binary Tree Inorder Traversal', () => {
  describe('examples from the problem', () => {
    it('[1, null, 2, 3] → [1, 3, 2] (no left subtree, so the root comes first)', () => {
      expect(inorderTraversal(arrayToTree([1, null, 2, 3]))).toEqual([1, 3, 2]);
    });

    it('[1, 2, 3, 4, 5, null, 8, null, null, 6, 7, 9] → [4, 2, 6, 5, 7, 1, 3, 9, 8]', () => {
      expect(inorderTraversal(arrayToTree([1, 2, 3, 4, 5, null, 8, null, null, 6, 7, 9]))).toEqual([
        4, 2, 6, 5, 7, 1, 3, 9, 8,
      ]);
    });

    it('empty tree (null) → []', () => {
      expect(inorderTraversal(null)).toEqual([]);
    });
  });

  describe('edge cases', () => {
    it('single node [7] → [7]', () => {
      expect(inorderTraversal(arrayToTree([7]))).toEqual([7]);
    });

    it('root with only a left child [2, 1] → [1, 2] (left comes before the node)', () => {
      expect(inorderTraversal(arrayToTree([2, 1]))).toEqual([1, 2]);
    });

    it('root with only a right child [1, null, 2] → [1, 2] (node comes before the right)', () => {
      expect(inorderTraversal(arrayToTree([1, null, 2]))).toEqual([1, 2]);
    });

    it('left-skewed chain [3, 2, null, 1] → [1, 2, 3] (the deepest node is visited first)', () => {
      expect(inorderTraversal(arrayToTree([3, 2, null, 1]))).toEqual([1, 2, 3]);
    });

    it('right-skewed chain [1, null, 2, null, 3] → [1, 2, 3] (the root is visited first)', () => {
      expect(inorderTraversal(arrayToTree([1, null, 2, null, 3]))).toEqual([1, 2, 3]);
    });

    it('negative values, zero and duplicates are reported as-is: [0, -1, -1] → [-1, 0, -1]', () => {
      expect(inorderTraversal(arrayToTree([0, -1, -1]))).toEqual([-1, 0, -1]);
    });

    it('handles values at ±10^9', () => {
      expect(inorderTraversal(arrayToTree([0, -1_000_000_000, 1_000_000_000]))).toEqual([
        -1_000_000_000, 0, 1_000_000_000,
      ]);
    });
  });

  describe('tricky cases', () => {
    it('a node is visited after its WHOLE left subtree, not just its left child: [1, 2, null, 3, 4] → [3, 2, 4, 1]', () => {
      expect(inorderTraversal(arrayToTree([1, 2, null, 3, 4]))).toEqual([3, 2, 4, 1]);
    });

    it('zigzag shape [1, 2, null, null, 3, 4] → [2, 4, 3, 1] (left, then right, then left again)', () => {
      expect(inorderTraversal(arrayToTree([1, 2, null, null, 3, 4]))).toEqual([2, 4, 3, 1]);
    });

    it('a binary SEARCH tree comes out sorted: [5, 3, 8, 1, 4, 7, 9] → [1, 3, 4, 5, 7, 8, 9]', () => {
      expect(inorderTraversal(arrayToTree([5, 3, 8, 1, 4, 7, 9]))).toEqual([1, 3, 4, 5, 7, 8, 9]);
    });

    it('complete tree 1..15 in level order → [8, 4, 9, 2, 10, 5, 11, 1, 12, 6, 13, 3, 14, 7, 15]', () => {
      const root = arrayToTree(range(15).map((i) => i + 1));
      expect(inorderTraversal(root)).toEqual([8, 4, 9, 2, 10, 5, 11, 1, 12, 6, 13, 3, 14, 7, 15]);
    });

    it('does not modify the tree', () => {
      const values = [1, 2, 3, 4, 5, null, 8, null, null, 6, 7, 9];
      const root = arrayToTree(values);
      expect(inorderTraversal(root)).toEqual([4, 2, 6, 5, 7, 1, 3, 9, 8]);
      expect(treeToArray(root)).toEqual(values);
    });

    it('calls on different trees are independent (no results leak between calls)', () => {
      expect(inorderTraversal(arrayToTree([2, 1, 3]))).toEqual([1, 2, 3]);
      expect(inorderTraversal(arrayToTree([5]))).toEqual([5]);
      expect(inorderTraversal(null)).toEqual([]);
      expect(inorderTraversal(arrayToTree([2, 1, 3]))).toEqual([1, 2, 3]);
    });
  });

  describe('randomized (seeded)', () => {
    it('300 random trees (0–60 nodes, balanced to very skewed) return the known in-order sequence', () => {
      const rng = createRng(2024);
      for (let t = 0; t < 300; t++) {
        const n = randomInt(rng, 0, 60);
        const values = randomIntArray(rng, n, -50, 50);
        const skew = [0, 0.3, 0.8][t % 3];
        const root = randomTreeWithInorder(rng, values, skew);
        expect(inorderTraversal(root)).toEqual(values);
      }
    });
  });

  describe('large inputs', () => {
    it('a random 100,000-node tree is traversed in O(n)', () => {
      const rng = createRng(99);
      const values = randomIntArray(rng, 100_000, -1e9, 1e9);
      const root = randomTreeWithInorder(rng, values);
      const { result, ms } = measure(() => inorderTraversal(root));
      expect(result).toEqual(values);
      expect(ms, `took ${ms.toFixed(0)}ms — each node should be handled once`).toBeLessThan(1000);
    });
  });

  describe('follow-up: iterative (very deep trees)', () => {
    it('a left-skewed chain 100,000 deep (a recursive solution overflows the call stack here — use an explicit stack)', () => {
      const n = 100_000;
      expect(inorderTraversal(leftChain(n))).toEqual(range(n));
    });

    it('a right-skewed chain 100,000 deep (recursion overflows here too)', () => {
      const n = 100_000;
      expect(inorderTraversal(rightChain(n))).toEqual(range(n));
    });

    it('a 100,000-node zigzag (left, right, left, …) — the explicit stack must handle both directions', () => {
      const n = 100_000;
      // Node i's single child is node i+1: a left child for even i, a right child for odd i.
      const nodes = range(n).map((i) => new TreeNode(i));
      for (let i = 0; i + 1 < n; i++) {
        if (i % 2 === 0) nodes[i].left = nodes[i + 1];
        else nodes[i].right = nodes[i + 1];
      }
      // Node i with a LEFT child (even i) comes after its subtree; with a RIGHT
      // child (odd i) comes before it. Nodes that come "before" are emitted in
      // top-down order, then the leaf, then the "after" nodes bottom-up.
      const before = range(n - 1).filter((i) => i % 2 === 1);
      const after = range(n - 1).filter((i) => i % 2 === 0).reverse();
      expect(inorderTraversal(nodes[0])).toEqual([...before, n - 1, ...after]);
    });
  });
});
