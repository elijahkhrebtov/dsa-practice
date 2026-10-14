import { describe, it, expect } from 'vitest';
import { maxDepth } from './problem.js';
import { TreeNode, arrayToTree, treeToArray } from '../../../lib/tree.js';
import { createRng, randomInt, measure } from '../../../lib/test-utils.js';

/**
 * Builds a random tree of `n` nodes and returns it with its depth, which is
 * recorded while building (the deepest level any node was created on) — so
 * the expected answer is known without traversing the tree. `skew` is the
 * probability of putting all remaining nodes on one side, giving long chains.
 */
function randomTree(rng, n, skew = 0) {
  let deepest = 0;
  function build(count, level) {
    if (count === 0) return null;
    deepest = Math.max(deepest, level);
    let leftCount = randomInt(rng, 0, count - 1);
    if (rng() < skew) leftCount = rng() < 0.5 ? 0 : count - 1;
    const node = new TreeNode(randomInt(rng, -100, 100));
    node.left = build(leftCount, level + 1);
    node.right = build(count - 1 - leftCount, level + 1);
    return node;
  }
  const root = build(n, 1);
  return { root, depth: deepest };
}

/** A chain of `n` nodes; `dirs(i)` says whether node i's child goes 'left' or 'right'. */
function chain(n, dirs) {
  const nodes = Array.from({ length: n }, (_, i) => new TreeNode(i));
  for (let i = 0; i + 1 < n; i++) nodes[i][dirs(i)] = nodes[i + 1];
  return nodes[0] ?? null;
}

/** A perfect tree with `levels` full levels (2^levels - 1 nodes). */
function perfectTree(levels) {
  return arrayToTree(Array.from({ length: 2 ** levels - 1 }, (_, i) => i % 100));
}

describe('Maximum Depth of Binary Tree', () => {
  describe('examples from the problem', () => {
    it('[3, 9, 20, null, null, 15, 7] → 3', () => {
      expect(maxDepth(arrayToTree([3, 9, 20, null, null, 15, 7]))).toBe(3);
    });

    it('[1, null, 2] → 2', () => {
      expect(maxDepth(arrayToTree([1, null, 2]))).toBe(2);
    });

    it('empty tree (null) → 0', () => {
      expect(maxDepth(null)).toBe(0);
    });
  });

  describe('edge cases', () => {
    it('a single node has depth 1 (depth counts nodes, not edges)', () => {
      expect(maxDepth(arrayToTree([0]))).toBe(1);
    });

    it('root with one left child [1, 2] → 2', () => {
      expect(maxDepth(arrayToTree([1, 2]))).toBe(2);
    });

    it('left-skewed chain of 5 nodes → 5', () => {
      expect(maxDepth(arrayToTree([1, 2, null, 3, null, 4, null, 5]))).toBe(5);
    });

    it('right-skewed chain of 5 nodes → 5', () => {
      expect(maxDepth(arrayToTree([1, null, 2, null, 3, null, 4, null, 5]))).toBe(5);
    });

    it('negative values and zeros do not matter, only the shape: [-1, -2, 0, null, -3] → 3', () => {
      expect(maxDepth(arrayToTree([-1, -2, 0, null, -3]))).toBe(3);
    });

    it('perfect tree with 3 full levels (7 nodes) → 3', () => {
      expect(maxDepth(arrayToTree([1, 2, 3, 4, 5, 6, 7]))).toBe(3);
    });
  });

  describe('tricky cases', () => {
    it('the deepest leaf is in the LEFT subtree: [1, 2, 3, 4, null, null, null, 5] → 4', () => {
      expect(maxDepth(arrayToTree([1, 2, 3, 4, null, null, null, 5]))).toBe(4);
    });

    it('the deepest leaf is not on the leftmost or rightmost path: [1, 2, 3, null, 4, 5, null, null, 6] → 4', () => {
      //        1
      //       / \
      //      2   3
      //       \  /
      //       4 5
      //        \
      //         6
      expect(maxDepth(arrayToTree([1, 2, 3, null, 4, 5, null, null, 6]))).toBe(4);
    });

    it('a short branch next to a long one: the answer is the LONGER branch, not the shorter', () => {
      // Root with a single leaf on the right and a 4-node chain on the left.
      expect(maxDepth(arrayToTree([1, 2, 9, 3, null, null, null, 4, null, 5]))).toBe(5);
    });

    it('zigzag chain of 6 nodes (left, right, left, …) → 6', () => {
      expect(maxDepth(chain(6, (i) => (i % 2 === 0 ? 'left' : 'right')))).toBe(6);
    });

    it('does not modify the tree', () => {
      const values = [3, 9, 20, null, null, 15, 7];
      const root = arrayToTree(values);
      expect(maxDepth(root)).toBe(3);
      expect(treeToArray(root)).toEqual(values);
    });
  });

  describe('randomized (seeded)', () => {
    it('400 random trees (0–80 nodes, balanced to very skewed) match the depth recorded while building', () => {
      const rng = createRng(31337);
      for (let t = 0; t < 400; t++) {
        const n = randomInt(rng, 0, 80);
        const { root, depth } = randomTree(rng, n, [0, 0.4, 0.9][t % 3]);
        expect(maxDepth(root)).toBe(depth);
      }
    });
  });

  describe('large inputs', () => {
    it('perfect tree with 17 levels (131,071 nodes) → 17, in O(n)', () => {
      const root = perfectTree(17);
      const { result, ms } = measure(() => maxDepth(root));
      expect(result).toBe(17);
      expect(ms, `took ${ms.toFixed(0)}ms — visit each node once`).toBeLessThan(1000);
    });

    it('a 2,000-node left chain → 2,000 (the maximum height allowed)', () => {
      expect(maxDepth(chain(2000, () => 'left'))).toBe(2000);
    });

    it('a 2,000-node zigzag chain → 2,000', () => {
      expect(maxDepth(chain(2000, (i) => (i % 2 === 0 ? 'right' : 'left')))).toBe(2000);
    });

    it('a random 200,000-node tree matches the recorded depth', () => {
      const rng = createRng(8);
      const { root, depth } = randomTree(rng, 200_000);
      expect(maxDepth(root)).toBe(depth);
    });
  });
});
