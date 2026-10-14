import { describe, it, expect } from 'vitest';
import { invertTree } from './problem.js';
import { TreeNode, arrayToTree, treeToArray, inorderValues } from '../../../lib/tree.js';
import { createRng, randomInt, measure } from '../../../lib/test-utils.js';

/** Inverts the level-order array `values` and returns the result as a level-order array. */
const invertArray = (values) => treeToArray(invertTree(arrayToTree(values)));

/**
 * Builds a random tree of `n` nodes together with its mirror image. The
 * mirror is assembled at the same time (each mirror node takes the mirror of
 * the RIGHT subtree as its left child), so the expected answer comes from
 * construction. `skew` is the probability of putting all remaining nodes on
 * one side, producing long chains.
 */
function randomTreeAndMirror(rng, n, skew = 0) {
  function build(count) {
    if (count === 0) return [null, null];
    let leftCount = randomInt(rng, 0, count - 1);
    if (rng() < skew) leftCount = rng() < 0.5 ? 0 : count - 1;
    const val = randomInt(rng, -100, 100);
    const [left, mirrorOfLeft] = build(leftCount);
    const [right, mirrorOfRight] = build(count - 1 - leftCount);
    return [new TreeNode(val, left, right), new TreeNode(val, mirrorOfRight, mirrorOfLeft)];
  }
  const [root, mirror] = build(n);
  return { root, mirror };
}

describe('Invert Binary Tree', () => {
  describe('examples from the problem', () => {
    it('[4, 2, 7, 1, 3, 6, 9] → [4, 7, 2, 9, 6, 3, 1]', () => {
      expect(invertArray([4, 2, 7, 1, 3, 6, 9])).toEqual([4, 7, 2, 9, 6, 3, 1]);
    });

    it('[1, 2, null, null, 3] → [1, null, 2, 3] (missing children switch sides too)', () => {
      expect(invertArray([1, 2, null, null, 3])).toEqual([1, null, 2, 3]);
    });

    it('empty tree (null) → null', () => {
      expect(invertTree(null)).toBeNull();
    });
  });

  describe('edge cases', () => {
    it('a single node [5] is its own mirror → [5]', () => {
      expect(invertArray([5])).toEqual([5]);
    });

    it('[2, 1, 3] → [2, 3, 1]', () => {
      expect(invertArray([2, 1, 3])).toEqual([2, 3, 1]);
    });

    it('a left-skewed chain becomes a right-skewed chain: [1, 2, null, 3] → [1, null, 2, null, 3]', () => {
      expect(invertArray([1, 2, null, 3])).toEqual([1, null, 2, null, 3]);
    });

    it('a right-skewed chain becomes a left-skewed chain: [1, null, 2, null, 3] → [1, 2, null, 3]', () => {
      expect(invertArray([1, null, 2, null, 3])).toEqual([1, 2, null, 3]);
    });

    it('negative values and duplicates are kept as-is: [0, -1, -1, -2] → [0, -1, -1, null, null, null, -2]', () => {
      expect(invertArray([0, -1, -1, -2])).toEqual([0, -1, -1, null, null, null, -2]);
    });

    it('returns a TreeNode-shaped root (not undefined) for a non-empty tree', () => {
      const result = invertTree(arrayToTree([1, 2, 3]));
      expect(result).not.toBeNull();
      expect(result?.val).toBe(1);
      expect(result?.left?.val).toBe(3);
      expect(result?.right?.val).toBe(2);
    });
  });

  describe('tricky cases', () => {
    it('swaps at EVERY level, not just under the root: [1, 2, 3, 4, 5, 6, 7] → [1, 3, 2, 7, 6, 5, 4]', () => {
      expect(invertArray([1, 2, 3, 4, 5, 6, 7])).toEqual([1, 3, 2, 7, 6, 5, 4]);
    });

    it('swapping only values of the root\'s children is not enough — whole subtrees move: [1, 2, 3, 4] → [1, 3, 2, null, null, null, 4]', () => {
      expect(invertArray([1, 2, 3, 4])).toEqual([1, 3, 2, null, null, null, 4]);
    });

    it('zigzag [1, 2, null, null, 3, 4] → [1, null, 2, 3, null, null, 4]', () => {
      //      1              1
      //     /                \
      //    2        →         2
      //     \                /
      //      3              3
      //     /                \
      //    4                  4
      expect(invertArray([1, 2, null, null, 3, 4])).toEqual([1, null, 2, 3, null, null, 4]);
    });

    it('a symmetric tree is unchanged: [1, 2, 2, 3, 4, 4, 3] → [1, 2, 2, 3, 4, 4, 3]', () => {
      expect(invertArray([1, 2, 2, 3, 4, 4, 3])).toEqual([1, 2, 2, 3, 4, 4, 3]);
    });

    it('inverting twice gives back the original tree', () => {
      const values = [5, 3, 8, 1, null, 7, 9, null, 2, 6];
      expect(treeToArray(invertTree(invertTree(arrayToTree(values))))).toEqual(values);
    });

    it('the in-order sequence of the result is the original in-order sequence reversed', () => {
      const root = arrayToTree([5, 3, 8, 1, 4, 7, 9, null, 2]);
      const before = inorderValues(root);
      expect(inorderValues(invertTree(root))).toEqual(before.reverse());
    });
  });

  describe('randomized (seeded)', () => {
    it('400 random trees (0–80 nodes, balanced to very skewed) match their mirror built alongside them', () => {
      const rng = createRng(4242);
      for (let t = 0; t < 400; t++) {
        const n = randomInt(rng, 0, 80);
        const { root, mirror } = randomTreeAndMirror(rng, n, [0, 0.4, 0.9][t % 3]);
        expect(treeToArray(invertTree(root))).toEqual(treeToArray(mirror));
      }
    });
  });

  describe('large inputs', () => {
    it('a random 100,000-node tree is inverted in O(n)', () => {
      const rng = createRng(17);
      const { root, mirror } = randomTreeAndMirror(rng, 100_000);
      const expected = treeToArray(mirror);
      const { result, ms } = measure(() => invertTree(root));
      expect(ms, `took ${ms.toFixed(0)}ms — touch each node once`).toBeLessThan(1000);
      expect(treeToArray(result)).toEqual(expected);
    });

    it('a 2,000-node left chain (the maximum height) becomes a 2,000-node right chain', () => {
      let root = null;
      for (let i = 1999; i >= 0; i--) root = new TreeNode(i, root, null);
      let node = invertTree(root);
      let count = 0;
      while (node) {
        expect(node.left).toBeNull();
        expect(node.val).toBe(count);
        count++;
        node = node.right;
      }
      expect(count).toBe(2000);
    });
  });
});
