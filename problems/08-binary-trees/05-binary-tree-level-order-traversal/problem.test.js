import { describe, it, expect } from 'vitest';
import { levelOrder } from './problem.js';
import { TreeNode, arrayToTree, treeToArray } from '../../../lib/tree.js';
import { createRng, randomInt, measure } from '../../../lib/test-utils.js';

const levelsOf = (values) => levelOrder(arrayToTree(values));

/**
 * Builds a random tree of `n` nodes and the expected level order, derived
 * from construction rather than from a traversal: each node records its
 * depth and its in-order position. Two nodes on the same level are ordered
 * left-to-right exactly as they are in in-order, so sorting each level by
 * in-order position gives the answer. `skew` = probability of choosing an
 * extreme split, which produces long chains.
 */
function randomTreeWithLevels(rng, n, skew = 0) {
  const records = []; // { val, depth, pos }
  function build(lo, hi, depth) {
    if (lo > hi) return null;
    let mid = randomInt(rng, lo, hi);
    if (rng() < skew) mid = rng() < 0.5 ? lo : hi;
    const val = randomInt(rng, -1000, 1000);
    records.push({ val, depth, pos: mid });
    return new TreeNode(val, build(lo, mid - 1, depth + 1), build(mid + 1, hi, depth + 1));
  }
  const root = build(0, n - 1, 0);
  const levels = [];
  for (const r of records) (levels[r.depth] ??= []).push(r);
  const expected = levels.map((level) => level.sort((a, b) => a.pos - b.pos).map((r) => r.val));
  return { root, expected };
}

describe('Binary Tree Level Order Traversal', () => {
  describe('examples from the problem', () => {
    it('[3, 9, 20, null, null, 15, 7] → [[3], [9, 20], [15, 7]]', () => {
      expect(levelsOf([3, 9, 20, null, null, 15, 7])).toEqual([[3], [9, 20], [15, 7]]);
    });

    it('[1, 2, 3, 4, null, null, 5] → [[1], [2, 3], [4, 5]] (cousins with different parents share a level)', () => {
      expect(levelsOf([1, 2, 3, 4, null, null, 5])).toEqual([[1], [2, 3], [4, 5]]);
    });

    it('[1] → [[1]]', () => {
      expect(levelsOf([1])).toEqual([[1]]);
    });

    it('empty tree (null) → [] (no levels at all, not [[]])', () => {
      expect(levelOrder(null)).toEqual([]);
    });
  });

  describe('edge cases', () => {
    it('root with only a right child [1, null, 2] → [[1], [2]]', () => {
      expect(levelsOf([1, null, 2])).toEqual([[1], [2]]);
    });

    it('left-skewed chain [1, 2, null, 3, null, 4] → one value per level', () => {
      expect(levelsOf([1, 2, null, 3, null, 4])).toEqual([[1], [2], [3], [4]]);
    });

    it('right-skewed chain [1, null, 2, null, 3, null, 4] → one value per level', () => {
      expect(levelsOf([1, null, 2, null, 3, null, 4])).toEqual([[1], [2], [3], [4]]);
    });

    it('negative values, zeros and duplicates are kept as-is: [0, -1, -1, 0, null, null, 0]', () => {
      expect(levelsOf([0, -1, -1, 0, null, null, 0])).toEqual([[0], [-1, -1], [0, 0]]);
    });

    it('perfect tree [1..7] → [[1], [2, 3], [4, 5, 6, 7]]', () => {
      expect(levelsOf([1, 2, 3, 4, 5, 6, 7])).toEqual([[1], [2, 3], [4, 5, 6, 7]]);
    });
  });

  describe('tricky cases', () => {
    it('order within a level is by POSITION, not by value: [1, 9, 2, 8, null, null, 3] → [[1], [9, 2], [8, 3]]', () => {
      expect(levelsOf([1, 9, 2, 8, null, null, 3])).toEqual([[1], [9, 2], [8, 3]]);
    });

    it('a level may consist only of nodes deep in the RIGHT subtree: [1, 2, 3, null, null, 4, 5, null, 6]', () => {
      //      1
      //     / \
      //    2   3
      //       / \
      //      4   5
      //       \
      //        6
      expect(levelsOf([1, 2, 3, null, null, 4, 5, null, 6])).toEqual([[1], [2, 3], [4, 5], [6]]);
    });

    it('a zigzag chain [1, 2, null, null, 3, 4] still gives one value per level', () => {
      expect(levelsOf([1, 2, null, null, 3, 4])).toEqual([[1], [2], [3], [4]]);
    });

    it('nodes from far-apart subtrees meet on the same level: [1, 2, 3, 4, null, null, 5, 6, null, null, 7]', () => {
      //          1
      //        /   \
      //       2     3
      //      /       \
      //     4         5
      //    /           \
      //   6             7
      expect(levelsOf([1, 2, 3, 4, null, null, 5, 6, null, null, 7])).toEqual([[1], [2, 3], [4, 5], [6, 7]]);
    });

    it('levels of very different widths: [1, 2, 3, 4, 5, 6, 7, null, null, null, null, null, null, 8]', () => {
      expect(levelsOf([1, 2, 3, 4, 5, 6, 7, null, null, null, null, null, null, 8])).toEqual([
        [1],
        [2, 3],
        [4, 5, 6, 7],
        [8],
      ]);
    });

    it('does not modify the tree, and separate calls do not share results', () => {
      const values = [3, 9, 20, null, null, 15, 7];
      const root = arrayToTree(values);
      expect(levelOrder(root)).toEqual([[3], [9, 20], [15, 7]]);
      expect(levelOrder(root)).toEqual([[3], [9, 20], [15, 7]]);
      expect(treeToArray(root)).toEqual(values);
      expect(levelsOf([5])).toEqual([[5]]);
    });
  });

  describe('randomized (seeded)', () => {
    it('400 random trees (0–80 nodes, balanced to very skewed) match the levels recorded while building', () => {
      const rng = createRng(555);
      for (let t = 0; t < 400; t++) {
        const n = randomInt(rng, 0, 80);
        const { root, expected } = randomTreeWithLevels(rng, n, [0, 0.4, 0.9][t % 3]);
        expect(levelOrder(root)).toEqual(expected);
      }
    });
  });

  describe('large inputs', () => {
    it('perfect tree with 17 levels (131,071 nodes): level d holds 2^d values in left-to-right order', () => {
      const n = 2 ** 17 - 1;
      const root = arrayToTree(Array.from({ length: n }, (_, i) => i % 1000));
      const { result, ms } = measure(() => levelOrder(root));
      expect(result).toHaveLength(17);
      for (let d = 0; d < 17; d++) {
        const start = 2 ** d - 1;
        expect(result[d]).toEqual(Array.from({ length: 2 ** d }, (_, k) => (start + k) % 1000));
      }
      expect(ms, `took ${ms.toFixed(0)}ms — each node should be enqueued and dequeued once`).toBeLessThan(1000);
    });

    it('a random 200,000-node tree matches the levels recorded while building', () => {
      const rng = createRng(12);
      const { root, expected } = randomTreeWithLevels(rng, 200_000);
      const { result, ms } = measure(() => levelOrder(root));
      expect(result).toEqual(expected);
      expect(ms, `took ${ms.toFixed(0)}ms — think O(n)`).toBeLessThan(1000);
    });

    it('a 3,000-node left chain → 3,000 single-value levels', () => {
      let root = null;
      for (let i = 2999; i >= 0; i--) root = new TreeNode(i, root, null);
      expect(levelOrder(root)).toEqual(Array.from({ length: 3000 }, (_, i) => [i]));
    });
  });
});
