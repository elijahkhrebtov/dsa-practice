import { describe, it, expect } from 'vitest';
import { buildTree } from './problem.js';
import { TreeNode, arrayToTree, treeToArray, inorderValues, treeHeight } from '../../../lib/tree.js';
import { createRng, randomInt, shuffle, measure } from '../../../lib/test-utils.js';

/** Pre-order values of a tree (iterative, safe for deep trees). */
function preorderValues(root) {
  const out = [];
  const stack = root ? [root] : [];
  while (stack.length) {
    const node = stack.pop();
    out.push(node.val);
    if (node.right) stack.push(node.right);
    if (node.left) stack.push(node.left);
  }
  return out;
}

/** Both traversals of a tree given in level-order form. */
function traversalsOf(values) {
  const root = arrayToTree(values);
  return { preorder: preorderValues(root), inorder: root ? inorderValues(root) : [] };
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

/** Checks that buildTree reproduces the tree written as `values` (level order). */
function expectRoundTrip(values) {
  const { preorder, inorder } = traversalsOf(values);
  expect(treeToArray(buildTree(preorder, inorder))).toEqual(values);
}

describe('Construct Binary Tree from Preorder and Inorder Traversal', () => {
  describe('examples from the problem', () => {
    it('preorder [3,9,20,15,7], inorder [9,3,15,20,7] → [3, 9, 20, null, null, 15, 7]', () => {
      expect(treeToArray(buildTree([3, 9, 20, 15, 7], [9, 3, 15, 20, 7]))).toEqual([3, 9, 20, null, null, 15, 7]);
    });

    it('preorder [-1], inorder [-1] → [-1]', () => {
      expect(treeToArray(buildTree([-1], [-1]))).toEqual([-1]);
    });

    it('preorder [1,2,3], inorder [3,2,1] → [1, 2, null, 3] (a left-leaning chain)', () => {
      expect(treeToArray(buildTree([1, 2, 3], [3, 2, 1]))).toEqual([1, 2, null, 3]);
    });
  });

  describe('edge cases', () => {
    it('empty arrays → null', () => {
      expect(buildTree([], [])).toBeNull();
    });

    it('a single node is returned as a TreeNode with no children', () => {
      const root = buildTree([42], [42]);
      expect(root).toBeInstanceOf(TreeNode);
      expect(root.val).toBe(42);
      expect(root.left).toBeNull();
      expect(root.right).toBeNull();
    });

    it('two nodes, preorder [1,2], inorder [2,1] → 2 is the LEFT child: [1, 2]', () => {
      expect(treeToArray(buildTree([1, 2], [2, 1]))).toEqual([1, 2]);
    });

    it('two nodes, preorder [1,2], inorder [1,2] → 2 is the RIGHT child: [1, null, 2]', () => {
      expect(treeToArray(buildTree([1, 2], [1, 2]))).toEqual([1, null, 2]);
    });

    it('right-leaning chain: preorder and inorder are identical', () => {
      expect(treeToArray(buildTree([1, 2, 3, 4], [1, 2, 3, 4]))).toEqual([1, null, 2, null, 3, null, 4]);
    });

    it('perfect tree of 7 nodes: [4, 2, 6, 1, 3, 5, 7]', () => {
      expectRoundTrip([4, 2, 6, 1, 3, 5, 7]);
    });

    it('negative values: [-5, -10, 8, null, -3, 0]', () => {
      expectRoundTrip([-5, -10, 8, null, -3, 0]);
    });
  });

  describe('tricky cases', () => {
    it('a root of value 0 sitting at inorder index 0 (watch out for falsy checks on values or indices)', () => {
      // preorder [0, 1, 2], inorder [0, 2, 1]: root 0 has no left subtree.
      expect(treeToArray(buildTree([0, 1, 2], [0, 2, 1]))).toEqual([0, null, 1, 2]);
    });

    it('zig-zag chain: left, right, left, right … [1, 2, null, null, 3, 4, null, null, 5]', () => {
      expectRoundTrip([1, 2, null, null, 3, 4, null, null, 5]);
    });

    it('lopsided tree where the left subtree is much bigger than the right', () => {
      expectRoundTrip([10, 5, 20, 3, 7, null, null, 1, 4, 6, 9, null, 2, null, null, null, null, 8]);
    });

    it('the order of values is unrelated to the shape (not a BST): [5, 9, 1, 7, 3, 8, 2]', () => {
      expectRoundTrip([5, 9, 1, 7, 3, 8, 2]);
    });

    it('values up to ±10^9', () => {
      expectRoundTrip([1_000_000_000, -1_000_000_000, 999_999_999, null, 0]);
    });

    it('does not modify the input arrays', () => {
      const preorder = [3, 9, 20, 15, 7];
      const inorder = [9, 3, 15, 20, 7];
      buildTree(preorder, inorder);
      expect(preorder).toEqual([3, 9, 20, 15, 7]);
      expect(inorder).toEqual([9, 3, 15, 20, 7]);
    });

    it('left-leaning chain of 3,000 nodes (deep recursion still has to work)', () => {
      const n = 3000;
      const preorder = Array.from({ length: n }, (_, i) => i);
      const inorder = [...preorder].reverse();
      const root = buildTree(preorder, inorder);
      expect(treeHeight(root)).toBe(n);
      expect(preorderValues(root)).toEqual(preorder);
      expect(inorderValues(root)).toEqual(inorder);
    });
  });

  describe('randomized (seeded)', () => {
    it('rebuilds 300 random trees exactly from their traversals', () => {
      const rng = createRng(808);
      for (let t = 0; t < 300; t++) {
        const n = randomInt(rng, 1, 80);
        const vals = shuffle(rng, Array.from({ length: n }, (_, i) => i * 7 - 200));
        const root = randomTree(rng, vals, t % 4 === 0 ? 0.7 : 0);
        const expected = treeToArray(root);
        const preorder = preorderValues(root);
        const inorder = inorderValues(root);
        expect(treeToArray(buildTree(preorder, inorder)), `preorder ${JSON.stringify(preorder)}, inorder ${JSON.stringify(inorder)}`).toEqual(expected);
      }
    });
  });

  describe('performance', () => {
    it('rebuilds a random 200,000-node tree quickly (indexOf over the whole inorder array for every node is O(n²))', () => {
      const rng = createRng(31337);
      const n = 200_000;
      const vals = shuffle(rng, Array.from({ length: n }, (_, i) => i * 2 - n));
      const original = randomTree(rng, vals);
      const preorder = preorderValues(original);
      const inorder = inorderValues(original);
      const { result, ms } = measure(() => buildTree(preorder, inorder));
      expect(treeToArray(result)).toEqual(treeToArray(original));
      expect(ms, `took ${ms.toFixed(0)}ms — look up each root's inorder position in O(1)`).toBeLessThan(700);
    });
  });
});
