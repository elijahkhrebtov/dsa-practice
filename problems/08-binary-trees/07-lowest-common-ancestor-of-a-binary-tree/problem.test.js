import { describe, it, expect } from 'vitest';
import { lowestCommonAncestor } from './problem.js';
import { TreeNode, arrayToTree, treeToArray, findNode } from '../../../lib/tree.js';
import { createRng, randomInt, shuffle, measure } from '../../../lib/test-utils.js';

const EXAMPLE = [3, 5, 1, 6, 2, 0, 8, null, null, 7, 4];

/** Builds the tree from a level-order array and runs the solution on the nodes with values pv and qv. */
function lcaOf(values, pv, qv) {
  const root = arrayToTree(values);
  const p = findNode(root, pv);
  const q = findNode(root, qv);
  return { root, result: lowestCommonAncestor(root, p, q) };
}

/**
 * Asserts that `result` is exactly the node object `expected` from the tree.
 * Compares values first for a readable failure message, then identity.
 */
function expectSameNode(result, expected) {
  expect(result !== null && typeof result === 'object', 'should return a TreeNode').toBe(true);
  expect(result.val, 'value of the returned node').toBe(expected.val);
  expect(result === expected, 'must return the node object from the tree itself, not a copy').toBe(true);
}

/**
 * Random tree whose values are `vals` (one node per value). Each new node is
 * hung on a random free child slot; with probability `skew` it goes under the
 * most recently added node instead, which produces long chains.
 */
function randomTree(rng, vals, skew = 0) {
  if (vals.length === 0) return null;
  const root = new TreeNode(vals[0]);
  const slots = [[root, 'left'], [root, 'right']];
  for (let i = 1; i < vals.length; i++) {
    const k = rng() < skew ? slots.length - 1 - randomInt(rng, 0, 1) : randomInt(rng, 0, slots.length - 1);
    const [parent, side] = slots[k];
    slots[k] = slots[slots.length - 1];
    slots.pop();
    const node = new TreeNode(vals[i]);
    parent[side] = node;
    slots.push([node, 'left'], [node, 'right']);
  }
  return root;
}

/** Brute-force oracle: record every node's parent and depth, then climb from the deeper node. */
function oracleLca(root, p, q) {
  const parent = new Map([[root, null]]);
  const depth = new Map([[root, 0]]);
  const queue = [root];
  for (let head = 0; head < queue.length; head++) {
    const node = queue[head];
    for (const child of [node.left, node.right]) {
      if (child) {
        parent.set(child, node);
        depth.set(child, depth.get(node) + 1);
        queue.push(child);
      }
    }
  }
  let a = p;
  let b = q;
  while (depth.get(a) > depth.get(b)) a = parent.get(a);
  while (depth.get(b) > depth.get(a)) b = parent.get(b);
  while (a !== b) {
    a = parent.get(a);
    b = parent.get(b);
  }
  return a;
}

/** Collects all nodes in BFS order. */
function allNodes(root) {
  const out = root ? [root] : [];
  for (let i = 0; i < out.length; i++) {
    if (out[i].left) out.push(out[i].left);
    if (out[i].right) out.push(out[i].right);
  }
  return out;
}

/** A chain of nodes with values 1..n where every child hangs on side `side`. */
function chain(n, side) {
  const root = new TreeNode(1);
  let cur = root;
  for (let v = 2; v <= n; v++) {
    cur[side] = new TreeNode(v);
    cur = cur[side];
  }
  return root;
}

describe('Lowest Common Ancestor of a Binary Tree', () => {
  describe('examples from the problem', () => {
    it('[3,5,1,6,2,0,8,null,null,7,4], p=5, q=1 → 3 (they sit on opposite sides of the root)', () => {
      const { root, result } = lcaOf(EXAMPLE, 5, 1);
      expectSameNode(result, root);
    });

    it('[3,5,1,6,2,0,8,null,null,7,4], p=5, q=4 → 5 (a node is an ancestor of itself)', () => {
      const { root, result } = lcaOf(EXAMPLE, 5, 4);
      expectSameNode(result, findNode(root, 5));
    });

    it('[1, 2], p=1, q=2 → 1', () => {
      const { root, result } = lcaOf([1, 2], 1, 2);
      expectSameNode(result, root);
    });
  });

  describe('edge cases', () => {
    it('p and q are the same node → that node', () => {
      const { root, result } = lcaOf(EXAMPLE, 7, 7);
      expectSameNode(result, findNode(root, 7));
    });

    it('p and q are the same node and it is the root → the root', () => {
      const { root, result } = lcaOf(EXAMPLE, 3, 3);
      expectSameNode(result, root);
    });

    it('p is the root and q is a deep leaf → the root', () => {
      const { root, result } = lcaOf(EXAMPLE, 3, 7);
      expectSameNode(result, root);
    });

    it('two-node tree with a right child: [1, null, 2], p=2, q=1 → 1', () => {
      const { root, result } = lcaOf([1, null, 2], 2, 1);
      expectSameNode(result, root);
    });

    it('siblings 7 and 4 → their parent 2', () => {
      const { root, result } = lcaOf(EXAMPLE, 7, 4);
      expectSameNode(result, findNode(root, 2));
    });

    it('both nodes in the right subtree: p=0, q=8 → 1 (the answer need not involve the root)', () => {
      const { root, result } = lcaOf(EXAMPLE, 0, 8);
      expectSameNode(result, findNode(root, 1));
    });

    it('nodes at different depths in the left subtree: p=6, q=4 → 5', () => {
      const { root, result } = lcaOf(EXAMPLE, 6, 4);
      expectSameNode(result, findNode(root, 5));
    });

    it('deep nodes in different halves: p=7, q=8 → 3', () => {
      const { root, result } = lcaOf(EXAMPLE, 7, 8);
      expectSameNode(result, root);
    });
  });

  describe('tricky cases', () => {
    it('the order of p and q does not matter', () => {
      const root = arrayToTree(EXAMPLE);
      const cases = [[5, 1, 3], [5, 4, 5], [7, 8, 3], [6, 4, 5], [0, 8, 1], [2, 6, 5]];
      for (const [a, b, lca] of cases) {
        const na = findNode(root, a);
        const nb = findNode(root, b);
        expect(lowestCommonAncestor(root, na, nb)?.val, `p=${a}, q=${b}`).toBe(lca);
        expect(lowestCommonAncestor(root, nb, na)?.val, `p=${b}, q=${a}`).toBe(lca);
      }
    });

    it('a node whose value is 0 can be the answer (don\'t test nodes for truthiness via .val)', () => {
      const { root, result } = lcaOf([0, -1, 1, -2, null, null, 2], -2, 2);
      expectSameNode(result, root);
    });

    it('compares nodes, not values: negative values and a BST-looking shape change nothing', () => {
      // This happens to look like a BST, but the answer comes from the structure only.
      const { root, result } = lcaOf([-10, -20, -5, -30, -15], -30, -15);
      expectSameNode(result, findNode(root, -20));
    });

    it('left-skewed chain of 50 nodes: p=40, q=17 → 17 (the higher node is the ancestor)', () => {
      const root = chain(50, 'left');
      const result = lowestCommonAncestor(root, findNode(root, 40), findNode(root, 17));
      expectSameNode(result, findNode(root, 17));
    });

    it('right-skewed chain of 3,000 nodes: p = the bottom node, q = node 1,000 → node 1,000', () => {
      const root = chain(3000, 'right');
      const result = lowestCommonAncestor(root, findNode(root, 3000), findNode(root, 1000));
      expectSameNode(result, findNode(root, 1000));
    });

    it('does not modify the tree', () => {
      const root = arrayToTree(EXAMPLE);
      lowestCommonAncestor(root, findNode(root, 7), findNode(root, 0));
      expect(treeToArray(root)).toEqual(EXAMPLE);
    });
  });

  describe('randomized (seeded) against a parent-pointer oracle', () => {
    it('matches the oracle for 400 random trees and node pairs', () => {
      const rng = createRng(2024);
      for (let t = 0; t < 400; t++) {
        const n = randomInt(rng, 2, 60);
        const vals = shuffle(rng, Array.from({ length: n }, (_, i) => i * 3 - 50));
        const root = randomTree(rng, vals, t % 3 === 0 ? 0.8 : 0);
        const nodes = allNodes(root);
        const p = nodes[randomInt(rng, 0, n - 1)];
        const q = rng() < 0.1 ? p : nodes[randomInt(rng, 0, n - 1)];
        const expected = oracleLca(root, p, q);
        const result = lowestCommonAncestor(root, p, q);
        expect(result?.val, `tree ${JSON.stringify(treeToArray(root))}, p=${p.val}, q=${q.val}`).toBe(expected.val);
        expect(result === expected, 'must return the node object from the tree').toBe(true);
      }
    });
  });

  describe('performance', () => {
    it('130,000-node subtree under a 2,500-node spine (re-checking "is p in this subtree?" at every level is far too slow)', () => {
      // A left spine of 2,500 nodes, and at its bottom a perfect tree of 2^17 - 1
      // nodes. Values: perfect tree = 0..131070 in level order, spine = 131071+.
      const m = 2 ** 17 - 1;
      const bottom = arrayToTree(Array.from({ length: m }, (_, i) => i));
      let root = bottom;
      for (let i = 0; i < 2500; i++) root = new TreeNode(m + i, root, null);
      const p = findNode(bottom, m - 1); // rightmost leaf
      const q = findNode(bottom, 66_535); // a leaf in the left half
      const { result, ms } = measure(() => lowestCommonAncestor(root, p, q));
      expectSameNode(result, bottom);
      expect(ms, `took ${ms.toFixed(0)}ms — aim for a single O(n) traversal`).toBeLessThan(500);
    });
  });
});
