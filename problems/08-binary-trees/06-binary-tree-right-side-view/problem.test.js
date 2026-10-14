import { describe, it, expect } from 'vitest';
import { rightSideView } from './problem.js';
import { TreeNode, arrayToTree, treeToArray } from '../../../lib/tree.js';
import { createRng, randomInt, measure } from '../../../lib/test-utils.js';

const viewOf = (values) => rightSideView(arrayToTree(values));

/**
 * Builds a random tree of `n` nodes and the expected right side view,
 * derived from construction rather than from a traversal: each node records
 * its depth and in-order position. Among nodes of the same depth, the
 * rightmost one has the largest in-order position. `skew` = probability of
 * an extreme split, which produces long chains and deep left subtrees.
 */
function randomTreeWithView(rng, n, skew = 0) {
  const best = []; // best[depth] = { val, pos } of the rightmost node seen so far
  function build(lo, hi, depth) {
    if (lo > hi) return null;
    let mid = randomInt(rng, lo, hi);
    if (rng() < skew) mid = rng() < 0.5 ? lo : hi;
    const val = randomInt(rng, -1000, 1000);
    if (!best[depth] || mid > best[depth].pos) best[depth] = { val, pos: mid };
    return new TreeNode(val, build(lo, mid - 1, depth + 1), build(mid + 1, hi, depth + 1));
  }
  const root = build(0, n - 1, 0);
  return { root, expected: best.map((b) => b.val) };
}

describe('Binary Tree Right Side View', () => {
  describe('examples from the problem', () => {
    it('[1, 2, 3, null, 5, null, 4] → [1, 3, 4]', () => {
      expect(viewOf([1, 2, 3, null, 5, null, 4])).toEqual([1, 3, 4]);
    });

    it('[1, 2, 3, 4, null, null, null, 5] → [1, 3, 4, 5] (deeper levels are seen through the LEFT subtree)', () => {
      expect(viewOf([1, 2, 3, 4, null, null, null, 5])).toEqual([1, 3, 4, 5]);
    });

    it('[1, null, 3] → [1, 3]', () => {
      expect(viewOf([1, null, 3])).toEqual([1, 3]);
    });

    it('empty tree (null) → []', () => {
      expect(rightSideView(null)).toEqual([]);
    });
  });

  describe('edge cases', () => {
    it('a single node [7] → [7]', () => {
      expect(viewOf([7])).toEqual([7]);
    });

    it('a lone left child is visible: [1, 2] → [1, 2]', () => {
      expect(viewOf([1, 2])).toEqual([1, 2]);
    });

    it('left-skewed chain [1, 2, null, 3, null, 4] → every node is visible', () => {
      expect(viewOf([1, 2, null, 3, null, 4])).toEqual([1, 2, 3, 4]);
    });

    it('right-skewed chain [1, null, 2, null, 3, null, 4] → every node is visible', () => {
      expect(viewOf([1, null, 2, null, 3, null, 4])).toEqual([1, 2, 3, 4]);
    });

    it('negative values and duplicates: [-1, -2, -2, -3] → [-1, -2, -3]', () => {
      expect(viewOf([-1, -2, -2, -3])).toEqual([-1, -2, -3]);
    });

    it('perfect tree [1..7] → [1, 3, 7] (the right edge)', () => {
      expect(viewOf([1, 2, 3, 4, 5, 6, 7])).toEqual([1, 3, 7]);
    });
  });

  describe('tricky cases', () => {
    it('following only right pointers is wrong: [1, 2, 3, 4, 5, null, null, 6] → [1, 3, 5, 6]', () => {
      //        1
      //       / \
      //      2   3
      //     / \
      //    4   5      ← 5 (left subtree) is visible: 3 has no children
      //   /
      //  6            ← 6 is a LEFT child of a LEFT child, and still visible
      expect(viewOf([1, 2, 3, 4, 5, null, null, 6])).toEqual([1, 3, 5, 6]);
    });

    it('the visible node can be a LEFT child: [1, 2, 3, null, 4, 5] → [1, 3, 5]', () => {
      //      1
      //     / \
      //    2   3
      //     \  /
      //     4 5        ← 5 is 3's left child, but it is the rightmost on its level
      expect(viewOf([1, 2, 3, null, 4, 5])).toEqual([1, 3, 5]);
    });

    it('the leftmost node of the whole tree can be visible: [1, 2, 3, 4, 5, 6, 7, 8] → [1, 3, 7, 8]', () => {
      expect(viewOf([1, 2, 3, 4, 5, 6, 7, 8])).toEqual([1, 3, 7, 8]);
    });

    it('a right child hides a node in a different subtree: [1, 2, 3, 4, null, null, 5] → [1, 3, 5]', () => {
      expect(viewOf([1, 2, 3, 4, null, null, 5])).toEqual([1, 3, 5]);
    });

    it('a zigzag chain [1, 2, null, null, 3, 4] → [1, 2, 3, 4] (one node per level, all visible)', () => {
      expect(viewOf([1, 2, null, null, 3, 4])).toEqual([1, 2, 3, 4]);
    });

    it('the view switches from the right subtree to the left one when the right ends: [1, 2, 3, 4, 5, 6, null, 7, null, null, null, null, null, 8]', () => {
      //            1
      //          /   \
      //         2     3
      //        / \   /
      //       4   5 6        ← 6 (right subtree)
      //      /
      //     7                ← 7 (left subtree takes over)
      //    /
      //   8
      expect(viewOf([1, 2, 3, 4, 5, 6, null, 7, null, null, null, null, null, 8])).toEqual([1, 3, 6, 7, 8]);
    });

    it('does not modify the tree', () => {
      const values = [1, 2, 3, null, 5, null, 4];
      const root = arrayToTree(values);
      expect(rightSideView(root)).toEqual([1, 3, 4]);
      expect(treeToArray(root)).toEqual(values);
    });
  });

  describe('randomized (seeded)', () => {
    it('400 random trees (0–80 nodes, balanced to very skewed) match the view recorded while building', () => {
      const rng = createRng(606);
      for (let t = 0; t < 400; t++) {
        const n = randomInt(rng, 0, 80);
        const { root, expected } = randomTreeWithView(rng, n, [0, 0.4, 0.9][t % 3]);
        expect(rightSideView(root)).toEqual(expected);
      }
    });
  });

  describe('large inputs', () => {
    it('a random 200,000-node tree matches the recorded view, in O(n)', () => {
      const rng = createRng(66);
      const { root, expected } = randomTreeWithView(rng, 200_000);
      const { result, ms } = measure(() => rightSideView(root));
      expect(result).toEqual(expected);
      expect(ms, `took ${ms.toFixed(0)}ms — visit each node once`).toBeLessThan(1000);
    });

    it('perfect tree with 17 levels (131,071 nodes): the last node of every level is visible', () => {
      const n = 2 ** 17 - 1;
      const root = arrayToTree(Array.from({ length: n }, (_, i) => i % 1000));
      const expected = Array.from({ length: 17 }, (_, d) => (2 ** (d + 1) - 2) % 1000);
      expect(rightSideView(root)).toEqual(expected);
    });

    it('a 3,000-node left spine where each spine node has a right leaf: below the root, the leaves hide the spine', () => {
      // Level d (d ≥ 1) holds spine node d (value 0) and the right leaf of
      // spine node d-1 (value 1). The leaf is further right, so it is seen.
      const N = 3000;
      let root = null;
      for (let i = 0; i < N; i++) root = new TreeNode(0, root, new TreeNode(1));
      expect(rightSideView(root)).toEqual([0, ...new Array(N).fill(1)]);
    });
  });
});
