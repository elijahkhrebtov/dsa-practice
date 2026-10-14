import { describe, it, expect } from 'vitest';
import { deleteNode } from './problem.js';
import { TreeNode, arrayToTree, treeToArray, inorderValues } from '../../../lib/tree.js';
import { createRng, randomInt, shuffle, measure } from '../../../lib/test-utils.js';

/** All nodes in BFS order; throws if a node is reachable twice (shared node or cycle). */
function collectNodes(root) {
  if (!root) return [];
  const order = [root];
  const seen = new Set(order);
  for (let i = 0; i < order.length; i++) {
    for (const child of [order[i].left, order[i].right]) {
      if (!child) continue;
      if (seen.has(child)) throw new Error('a node is reachable twice — the result is not a tree (cycle or shared node)');
      seen.add(child);
      order.push(child);
    }
  }
  return order;
}

/**
 * Deletes `key` from `root` and checks the result:
 *   • every remaining node comes from the original tree,
 *   • the in-order sequence is exactly the original values minus `key`
 *     (strictly increasing in-order ⇔ valid BST).
 * Returns the new root.
 */
function deleteAndCheck(root, key) {
  const before = collectNodes(root);
  const original = new Set(before);
  const expected = before
    .map((n) => n.val)
    .filter((v) => v !== key)
    .sort((a, b) => a - b);

  const result = deleteNode(root, key);

  if (expected.length === 0) {
    expect(result ?? null, 'the tree should be empty → return null').toBeNull();
    return null;
  }
  const after = collectNodes(result);
  for (const n of after) {
    expect(original.has(n), 'every node in the result must come from the original tree (no new nodes)').toBe(true);
  }
  expect(after.length, 'node count after deletion').toBe(expected.length);
  expect(inorderValues(result), 'in-order must be the original values minus key, strictly increasing').toEqual(expected);
  return result;
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

describe('Delete Node in a BST', () => {
  describe('examples from the problem', () => {
    it('[5, 3, 6, 2, 4, null, 7], key 3 → a valid BST without 3 (e.g. [5, 4, 6, 2, null, null, 7])', () => {
      deleteAndCheck(arrayToTree([5, 3, 6, 2, 4, null, 7]), 3);
    });

    it('[5, 3, 6, 2, 4, null, 7], key 0 → unchanged (key not present): same root, same shape', () => {
      const arr = [5, 3, 6, 2, 4, null, 7];
      const root = arrayToTree(arr);
      const result = deleteNode(root, 0);
      expect(result).toBe(root);
      expect(treeToArray(result)).toEqual(arr);
    });

    it('[], key 0 → null', () => {
      expect(deleteNode(null, 0) ?? null).toBeNull();
    });

    it('[2, 1], key 2 → [1] (the root\'s only child takes its place)', () => {
      expect(treeToArray(deleteAndCheck(arrayToTree([2, 1]), 2))).toEqual([1]);
    });
  });

  describe('edge cases', () => {
    it('deleting the only node → null', () => {
      expect(deleteNode(arrayToTree([7]), 7) ?? null).toBeNull();
    });

    it('deleting an absent key from a single node → the same node, unchanged', () => {
      const root = arrayToTree([7]);
      expect(deleteNode(root, 8)).toBe(root);
      expect(treeToArray(root)).toEqual([7]);
    });

    it('[1, null, 2], key 1 → [2] (root with only a right child)', () => {
      expect(treeToArray(deleteAndCheck(arrayToTree([1, null, 2]), 1))).toEqual([2]);
    });

    it('absent keys smaller than the min, larger than the max, and "between" values leave the tree unchanged', () => {
      const arr = [50, 30, 70, 20, 40, 60, 80];
      for (const key of [-1_000_000_000, 10, 35, 65, 90, 1_000_000_000]) {
        const root = arrayToTree(arr);
        expect(treeToArray(deleteNode(root, key)), `key ${key}`).toEqual(arr);
      }
    });

    it('handles negative values and zero', () => {
      deleteAndCheck(arrayToTree([0, -5, 5, -8, -2, 2, 8]), 0);
      deleteAndCheck(arrayToTree([0, -5, 5, -8, -2, 2, 8]), -5);
    });
  });

  describe('the three deletion cases', () => {
    it('leaf: [5, 3, 6, 2, 4, null, 7], key 7 → [5, 3, 6, 2, 4] (just unlink it)', () => {
      expect(treeToArray(deleteAndCheck(arrayToTree([5, 3, 6, 2, 4, null, 7]), 7))).toEqual([5, 3, 6, 2, 4]);
    });

    it('one child (right): [5, 3, 6, 2, 4, null, 7], key 6 → [5, 3, 7, 2, 4] (the child moves up)', () => {
      expect(treeToArray(deleteAndCheck(arrayToTree([5, 3, 6, 2, 4, null, 7]), 6))).toEqual([5, 3, 7, 2, 4]);
    });

    it('one child (left) with its own subtree: [8, 4, 10, 2, null, null, null, 1, 3], key 4 → e.g. [8, 2, 10, 1, 3]', () => {
      // Moving the child 2 (with 1 and 3) up is simplest; copying the predecessor 3 up is also valid.
      deleteAndCheck(arrayToTree([8, 4, 10, 2, null, null, null, 1, 3]), 4);
    });

    it('two children, successor is the immediate right child (it has no left child)', () => {
      // 4's right child 6 has no left subtree, so 6 itself is the successor.
      deleteAndCheck(arrayToTree([10, 4, 15, 2, 6, null, null, null, null, null, 8]), 4);
    });

    it('two children, successor is deep in the right subtree and has its own right child', () => {
      //        20
      //      /    \
      //    10      30
      //           /  \
      //         25    40
      //        /  \
      //      22    27
      //        \
      //         23        ← successor of 20 is 22, which has a right child 23
      deleteAndCheck(arrayToTree([20, 10, 30, null, null, 25, 40, 22, 27, null, null, null, 23]), 20);
    });

    it('deleting the root of a full tree keeps every other value', () => {
      deleteAndCheck(arrayToTree([8, 4, 12, 2, 6, 10, 14, 1, 3, 5, 7, 9, 11, 13, 15]), 8);
    });

    it('deleting the minimum and the maximum', () => {
      const root = deleteAndCheck(arrayToTree([8, 4, 12, 2, 6, 10, 14]), 2);
      deleteAndCheck(root, 14);
    });
  });

  describe('tricky cases', () => {
    it('using the returned root: delete every value in a fixed order until the tree is empty', () => {
      let root = arrayToTree([8, 4, 12, 2, 6, 10, 14, 1, 3, 5, 7, 9, 11, 13, 15]);
      for (const key of [8, 9, 4, 15, 1, 12, 5, 10, 7, 2, 14, 3, 6, 13, 11]) {
        root = deleteAndCheck(root, key);
      }
      expect(root).toBeNull();
    });

    it('deleting the root repeatedly from a chain (the root changes every time)', () => {
      let root = arrayToTree([1, null, 2, null, 3, null, 4, null, 5]);
      for (let key = 1; key <= 5; key++) root = deleteAndCheck(root, key);
      expect(root).toBeNull();
    });

    it('deleting the same key twice: the second call is a no-op', () => {
      let root = arrayToTree([5, 3, 6, 2, 4, null, 7]);
      root = deleteAndCheck(root, 3);
      const snapshot = treeToArray(root);
      root = deleteNode(root, 3);
      expect(treeToArray(root)).toEqual(snapshot);
    });

    it('a 3,000-deep chain: delete the bottom, the middle and the top', () => {
      let root = null;
      for (let v = 3000; v >= 1; v--) root = new TreeNode(v, null, root); // right chain 1 → 3000
      root = deleteAndCheck(root, 3000);
      root = deleteAndCheck(root, 1500);
      deleteAndCheck(root, 1);
    });
  });

  describe('randomized (seeded, reproducible)', () => {
    it('400 random BSTs, each with a random delete (present or absent key)', () => {
      const rng = createRng(4242);
      for (let t = 0; t < 400; t++) {
        const n = randomInt(rng, 1, 30);
        const pool = new Set();
        while (pool.size < n) pool.add(randomInt(rng, -100, 100));
        let root = null;
        for (const v of shuffle(rng, [...pool])) root = bstInsert(root, v);
        const key = t % 4 === 0 ? randomInt(rng, -110, 110) : [...pool][randomInt(rng, 0, n - 1)];
        deleteAndCheck(root, key);
      }
    });

    it('50 random BSTs emptied one random key at a time', () => {
      const rng = createRng(777);
      for (let t = 0; t < 50; t++) {
        const n = randomInt(rng, 1, 40);
        const pool = new Set();
        while (pool.size < n) pool.add(randomInt(rng, -200, 200));
        let root = null;
        for (const v of shuffle(rng, [...pool])) root = bstInsert(root, v);
        for (const key of shuffle(rng, [...pool])) root = deleteAndCheck(root, key);
        expect(root).toBeNull();
      }
    });
  });

  describe('performance', () => {
    it('2,000 deletions from a 131,071-node tree (O(h) each; rebuilding the tree per deletion is far too slow)', () => {
      const N = 2 ** 17 - 1;
      let root = balancedFrom(Array.from({ length: N }, (_, i) => i * 2)); // even values 0 … 262,140
      const rng = createRng(5);
      const keys = [];
      for (let i = 0; i < 2000; i++) keys.push(randomInt(rng, 0, 2 * N)); // ~half are odd → absent
      const { ms } = measure(() => {
        for (const key of keys) root = deleteNode(root, key);
      });
      const removed = new Set(keys.filter((k) => k % 2 === 0));
      const expected = Array.from({ length: N }, (_, i) => i * 2).filter((v) => !removed.has(v));
      expect(inorderValues(root)).toEqual(expected);
      expect(ms, `took ${ms.toFixed(0)}ms — each deletion should walk O(h) nodes`).toBeLessThan(500);
    });
  });
});
