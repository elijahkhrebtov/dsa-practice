import { describe, it, expect } from 'vitest';
import { isValidBST } from './problem.js';
import { TreeNode, arrayToTree, treeToArray } from '../../../lib/tree.js';
import { createRng, randomInt, measure } from '../../../lib/test-utils.js';

const MIN = -(2 ** 31);
const MAX = 2 ** 31 - 1;

const check = (arr) => isValidBST(arrayToTree(arr));

/** Perfectly balanced BST over vals[lo..hi] (vals sorted). */
function balancedFrom(vals, lo = 0, hi = vals.length - 1) {
  if (lo > hi) return null;
  const mid = (lo + hi) >> 1;
  return new TreeNode(vals[mid], balancedFrom(vals, lo, mid - 1), balancedFrom(vals, mid + 1, hi));
}

/** Right-leaning chain holding `vals` top to bottom (built iteratively). */
function rightChain(vals) {
  let root = null;
  for (let i = vals.length - 1; i >= 0; i--) root = new TreeNode(vals[i], null, root);
  return root;
}

/** Inserts into a plain BST (iterative). */
function bstInsert(root, val) {
  const node = new TreeNode(val);
  if (!root) return node;
  let cur = root;
  for (;;) {
    if (val < cur.val) {
      if (!cur.left) return (cur.left = node), root;
      cur = cur.left;
    } else {
      if (!cur.right) return (cur.right = node), root;
      cur = cur.right;
    }
  }
}

/** Definition-level oracle: every left-subtree value < node < every right-subtree value. O(n²). */
function bruteIsBST(root) {
  const values = (n) => (n ? [n.val, ...values(n.left), ...values(n.right)] : []);
  const ok = (n) =>
    !n ||
    (values(n.left).every((v) => v < n.val) && values(n.right).every((v) => v > n.val) && ok(n.left) && ok(n.right));
  return ok(root);
}

describe('Validate Binary Search Tree', () => {
  describe('examples from the problem', () => {
    it('[2, 1, 3] → true', () => {
      expect(check([2, 1, 3])).toBe(true);
    });

    it('[5, 1, 4, null, null, 3, 6] → false (right child 4 is smaller than the root 5)', () => {
      expect(check([5, 1, 4, null, null, 3, 6])).toBe(false);
    });

    it('[5, 4, 6, null, null, 3, 7] → false (3 < 6 is fine locally, but 3 sits in 5\'s right subtree)', () => {
      expect(check([5, 4, 6, null, null, 3, 7])).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('empty tree (null) → true', () => {
      expect(isValidBST(null)).toBe(true);
    });

    it('a single node is always a BST', () => {
      expect(check([42])).toBe(true);
    });

    it('a single node holding -2^31 → true (don\'t use -2^31 as the "no lower bound" sentinel)', () => {
      expect(check([MIN])).toBe(true);
    });

    it('a single node holding 2^31 - 1 → true (don\'t use 2^31 - 1 as the "no upper bound" sentinel)', () => {
      expect(check([MAX])).toBe(true);
    });

    it('[-2^31, null, 2^31 - 1] → true (both extremes in one tree)', () => {
      expect(check([MIN, null, MAX])).toBe(true);
    });

    it('[2^31 - 1, 2^31 - 1] → false (equal extreme values are still duplicates)', () => {
      expect(check([MAX, MAX])).toBe(false);
    });

    it('only a left child / only a right child, correctly ordered → true', () => {
      expect(check([2, 1])).toBe(true);
      expect(check([1, null, 2])).toBe(true);
    });

    it('only a left child / only a right child, wrongly ordered → false', () => {
      expect(check([1, 2])).toBe(false);
      expect(check([2, null, 1])).toBe(false);
    });
  });

  describe('duplicates are invalid (strict ordering)', () => {
    it('[1, 1] → false (equal left child)', () => {
      expect(check([1, 1])).toBe(false);
    });

    it('[1, null, 1] → false (equal right child)', () => {
      expect(check([1, null, 1])).toBe(false);
    });

    it('[2, 2, 2] → false', () => {
      expect(check([2, 2, 2])).toBe(false);
    });

    it('[5, 3, 8, null, 5] → false (a grandchild equal to the root is also a duplicate)', () => {
      expect(check([5, 3, 8, null, 5])).toBe(false);
    });
  });

  describe('tricky cases', () => {
    it('[10, 5, 15, 3, 12] → false (12 is a fine right child of 5 but exceeds the root 10)', () => {
      expect(check([10, 5, 15, 3, 12])).toBe(false);
    });

    it('[8, 4, 12, 2, 6, 10, 14, 1, 3, 5, 9] → false (9 is four levels down, in the left subtree of 8)', () => {
      expect(check([8, 4, 12, 2, 6, 10, 14, 1, 3, 5, 9])).toBe(false);
    });

    it('[8, 4, 12, 2, 6, 10, 14, 1, 3, 5, 7, 9, 11, 13, 15] → true (a full 4-level BST)', () => {
      expect(check([8, 4, 12, 2, 6, 10, 14, 1, 3, 5, 7, 9, 11, 13, 15])).toBe(true);
    });

    it('[-1, -2, 0] → true (all-negative left side: a "prev = 0" initial value would break this)', () => {
      expect(check([-1, -2, 0])).toBe(true);
    });

    it('[0, null, 0] → false (a previous value of 0 is falsy, but it still counts)', () => {
      expect(check([0, null, 0])).toBe(false);
    });

    it('[0, -1] → true (a node with value 0 is not "missing")', () => {
      expect(check([0, -1])).toBe(true);
    });

    it('[3, 1, 5, 0, 2, 4, 6, null, null, null, 3] → false (3 deep in the left subtree equals the root)', () => {
      expect(check([3, 1, 5, 0, 2, 4, 6, null, null, null, 3])).toBe(false);
    });

    it('does not modify the tree', () => {
      const arr = [5, 3, 8, 1, 4, 7, 9];
      const root = arrayToTree(arr);
      isValidBST(root);
      expect(treeToArray(root)).toEqual(arr);
    });
  });

  describe('randomized (seeded, reproducible)', () => {
    it('matches a definition-based brute force on 400 random trees (half of them corrupted)', () => {
      const rng = createRng(31337);
      let valid = 0;
      for (let t = 0; t < 400; t++) {
        const n = randomInt(rng, 1, 25);
        let root = null;
        for (let i = 0; i < n; i++) {
          root = bstInsert(root, randomInt(rng, -40, 40));
        }
        // collect nodes, then maybe corrupt one value
        const nodes = [];
        const stack = [root];
        while (stack.length) {
          const x = stack.pop();
          nodes.push(x);
          if (x.left) stack.push(x.left);
          if (x.right) stack.push(x.right);
        }
        if (t % 2 === 1) nodes[randomInt(rng, 0, nodes.length - 1)].val = randomInt(rng, -40, 40);
        const expected = bruteIsBST(root);
        if (expected) valid++;
        expect(isValidBST(root), `tree ${JSON.stringify(treeToArray(root))}`).toBe(expected);
      }
      expect(valid).toBeGreaterThan(50); // sanity: the generator produces both outcomes
      expect(valid).toBeLessThan(350);
    });
  });

  describe('large trees', () => {
    it('a valid balanced BST of 131,071 nodes → true, in linear time', () => {
      const vals = Array.from({ length: 2 ** 17 - 1 }, (_, i) => i * 2);
      const root = balancedFrom(vals);
      const { result, ms } = measure(() => isValidBST(root));
      expect(result).toBe(true);
      expect(ms, `took ${ms.toFixed(0)}ms — visit each node once`).toBeLessThan(1000);
    });

    it('131,071 nodes with one bad leaf at the bottom → false (the violation is 17 levels down)', () => {
      const vals = Array.from({ length: 2 ** 17 - 1 }, (_, i) => i * 2);
      const root = balancedFrom(vals);
      // Walk to the leftmost leaf of the root's RIGHT subtree; it must be > root.val.
      let leaf = root.right;
      while (leaf.left) leaf = leaf.left;
      leaf.val = root.val - 1; // still smaller than its parent (looks fine locally), but < root.val
      expect(isValidBST(root)).toBe(false);
    });

    it('a right-leaning chain of 3,000 increasing values → true (height 3,000)', () => {
      const root = rightChain(Array.from({ length: 3000 }, (_, i) => i - 1500));
      expect(isValidBST(root)).toBe(true);
    });

    it('a chain of 3,000 whose last node drops below the first → false', () => {
      const vals = Array.from({ length: 3000 }, (_, i) => i);
      vals[2999] = -1;
      expect(isValidBST(rightChain(vals))).toBe(false);
    });
  });
});
