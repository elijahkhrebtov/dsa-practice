import { describe, it, expect } from 'vitest';
import { diameterOfBinaryTree } from './problem.js';
import { TreeNode, arrayToTree, treeToArray } from '../../../lib/tree.js';
import { createRng, randomInt, measure } from '../../../lib/test-utils.js';

const diameterOf = (values) => diameterOfBinaryTree(arrayToTree(values));

/** Turns a tree into an undirected adjacency list (node index → neighbour indices). */
function toGraph(root) {
  const adj = [];
  if (!root) return adj;
  const stack = [[root, -1]];
  while (stack.length) {
    const [node, parent] = stack.pop();
    const id = adj.length;
    adj.push([]);
    if (parent >= 0) {
      adj[id].push(parent);
      adj[parent].push(id);
    }
    if (node.left) stack.push([node.left, id]);
    if (node.right) stack.push([node.right, id]);
  }
  return adj;
}

/** BFS distances (in edges) from `start` to every node. */
function distancesFrom(adj, start) {
  const dist = new Array(adj.length).fill(-1);
  dist[start] = 0;
  const queue = [start];
  for (let head = 0; head < queue.length; head++) {
    const u = queue[head];
    for (const v of adj[u]) {
      if (dist[v] === -1) {
        dist[v] = dist[u] + 1;
        queue.push(v);
      }
    }
  }
  return dist;
}

/** Brute force: the largest BFS distance over every pair of nodes. O(n²). */
function bruteForceDiameter(root) {
  const adj = toGraph(root);
  let best = 0;
  for (let s = 0; s < adj.length; s++) best = Math.max(best, ...distancesFrom(adj, s));
  return best;
}

/**
 * Oracle for large trees: in a tree, the node farthest from ANY node is one
 * end of a diameter, so two BFS passes find it in O(n).
 */
function twoPassDiameter(root) {
  const adj = toGraph(root);
  if (adj.length === 0) return 0;
  const d1 = distancesFrom(adj, 0);
  const far = d1.indexOf(Math.max(...d1));
  const d2 = distancesFrom(adj, far);
  return d2.reduce((a, b) => Math.max(a, b), 0);
}

/** Random tree of `n` nodes; `skew` = probability of putting every remaining node on one side. */
function randomTree(rng, n, skew = 0) {
  if (n === 0) return null;
  let leftCount = randomInt(rng, 0, n - 1);
  if (rng() < skew) leftCount = rng() < 0.5 ? 0 : n - 1;
  return new TreeNode(randomInt(rng, -100, 100), randomTree(rng, leftCount, skew), randomTree(rng, n - 1 - leftCount, skew));
}

/** A chain of `n` nodes, each the left child of the previous one. */
function leftChain(n) {
  let root = null;
  for (let i = 0; i < n; i++) root = new TreeNode(i, root, null);
  return root;
}

describe('Diameter of Binary Tree', () => {
  describe('examples from the problem', () => {
    it('[1, 2, 3, 4, 5] → 3 (4 → 2 → 1 → 3)', () => {
      expect(diameterOf([1, 2, 3, 4, 5])).toBe(3);
    });

    it('[1, 2] → 1', () => {
      expect(diameterOf([1, 2])).toBe(1);
    });

    it('[1, 2, null, 3, 4, 5, null, null, 6] → 4 (the longest path skips the root)', () => {
      expect(diameterOf([1, 2, null, 3, 4, 5, null, null, 6])).toBe(4);
    });
  });

  describe('edge cases', () => {
    it('empty tree (null) → 0', () => {
      expect(diameterOfBinaryTree(null)).toBe(0);
    });

    it('a single node → 0 (a path of one node has no edges)', () => {
      expect(diameterOf([1])).toBe(0);
    });

    it('[1, 2, 3] → 2 (length counts EDGES, not the 3 nodes)', () => {
      expect(diameterOf([1, 2, 3])).toBe(2);
    });

    it('a left-skewed chain of 5 nodes → 4 (one end is the root)', () => {
      expect(diameterOf([1, 2, null, 3, null, 4, null, 5])).toBe(4);
    });

    it('a right-skewed chain of 5 nodes → 4', () => {
      expect(diameterOf([1, null, 2, null, 3, null, 4, null, 5])).toBe(4);
    });

    it('negative values do not matter, only the shape: [-1, -2, -3, -4] → 3', () => {
      expect(diameterOf([-1, -2, -3, -4])).toBe(3);
    });
  });

  describe('tricky cases', () => {
    it('two chains hanging from the root join through it: [1, 2, 3, 4, null, null, 5, 6] → 5', () => {
      //        1
      //       / \
      //      2   3
      //     /     \
      //    4       5
      //   /
      //  6
      expect(diameterOf([1, 2, 3, 4, null, null, 5, 6])).toBe(5);
    });

    it('the longest path lives entirely in the left subtree: [1, 2, null, 3, 4, 5, null, null, 6, 7, null, null, 8] → 6', () => {
      //          1
      //         /
      //        2
      //       / \
      //      3   4
      //     /     \
      //    5       6
      //   /         \
      //  7           8
      // Through the root only 4 edges are possible; 7 … 8 has 6.
      expect(diameterOf([1, 2, null, 3, 4, 5, null, null, 6, 7, null, null, 8])).toBe(6);
    });

    it('a short branch at the root is a trap: the answer is NOT height(left) + height(right) at the root', () => {
      //          1
      //         / \
      //        2   9
      //       / \
      //      3   4
      //     /     \
      //    5       6
      //   /         \
      //  7           8
      // Through the root: 4 + 1 = 5 edges. Inside node 2: 7 … 8 has 6.
      expect(diameterOf([1, 2, 9, 3, 4, null, null, 5, null, null, 6, 7, null, null, 8])).toBe(6);
    });

    it('both deepest leaves are in the same subtree, so the root is not on the path', () => {
      // Root's right child is a single leaf; the left subtree is a perfect tree of height 4.
      // Perfect subtree of 4 levels: leaf-to-leaf through its root = 3 + 3 = 6 edges.
      // Through the global root: 4 + 1 = 5 edges.
      const left = arrayToTree(Array.from({ length: 15 }, (_, i) => i));
      const root = new TreeNode(100, left, new TreeNode(200));
      expect(diameterOfBinaryTree(root)).toBe(6);
    });

    it('a fork at the bottom of a chain: [1, 2, null, 3, null, 4, 5] → 3 (the best path ends at the root)', () => {
      //        1
      //       /
      //      2
      //     /
      //    3
      //   / \
      //  4   5
      // 1 → 2 → 3 → 4 has 3 edges; the leaf-to-leaf path 4 → 3 → 5 only 2.
      expect(diameterOf([1, 2, null, 3, null, 4, 5])).toBe(3);
    });

    it('does not modify the tree', () => {
      const values = [1, 2, null, 3, 4, 5, null, null, 6];
      const root = arrayToTree(values);
      expect(diameterOfBinaryTree(root)).toBe(4);
      expect(treeToArray(root)).toEqual(values);
    });
  });

  describe('randomized (seeded, brute-force oracle)', () => {
    it('400 random trees (0–60 nodes) match an all-pairs BFS brute force', () => {
      const rng = createRng(777);
      for (let t = 0; t < 400; t++) {
        const n = randomInt(rng, 0, 60);
        const root = randomTree(rng, n, [0, 0.3, 0.7][t % 3]);
        expect(diameterOfBinaryTree(root)).toBe(bruteForceDiameter(root));
      }
    });
  });

  describe('large inputs & performance', () => {
    it('a random 100,000-node tree matches an independent two-BFS oracle', () => {
      const rng = createRng(5);
      const root = randomTree(rng, 100_000);
      expect(diameterOfBinaryTree(root)).toBe(twoPassDiameter(root));
    });

    it('a 2,000-node chain → 1,999', () => {
      expect(diameterOfBinaryTree(leftChain(2000))).toBe(1999);
    });

    it('tall and bushy "caterpillar" (512,000 nodes) → 2,015 in O(n) (recomputing heights at every node is O(n·h) and too slow)', () => {
      // A left spine of 2,000 nodes; every spine node also has a perfect
      // 8-level tree (255 nodes) as its right child. The longest path runs from
      // a leaf under the top spine node, down the spine, to a leaf under the
      // bottom one: 8 + 1,999 + 8 = 2,015 edges.
      const SPINE = 2000;
      const LEGS = 8;
      const legValues = Array.from({ length: 2 ** LEGS - 1 }, (_, i) => i % 100);
      let root = null;
      for (let i = 0; i < SPINE; i++) root = new TreeNode(0, root, arrayToTree(legValues));
      const { result, ms } = measure(() => diameterOfBinaryTree(root));
      expect(result).toBe(SPINE - 1 + 2 * LEGS);
      expect(ms, `took ${ms.toFixed(0)}ms — compute each height once and reuse it`).toBeLessThan(500);
    });
  });
});
