import { describe, it, expect } from 'vitest';
import { rob } from './problem.js';
import { TreeNode, arrayToTree, treeToArray } from '../../../lib/tree.js';
import { createRng, randomInt, measure } from '../../../lib/test-utils.js';

/**
 * Brute-force oracle: try every subset of nodes, keep the ones with no
 * parent–child pair, return the best sum. O(2^n · n) — tiny trees only.
 */
function bruteForce(root) {
  const nodes = [];
  const parentIndex = [];
  const queue = root ? [[root, -1]] : [];
  for (let head = 0; head < queue.length; head++) {
    const [node, p] = queue[head];
    nodes.push(node.val);
    parentIndex.push(p);
    const me = nodes.length - 1;
    if (node.left) queue.push([node.left, me]);
    if (node.right) queue.push([node.right, me]);
  }
  let best = 0;
  for (let mask = 0; mask < 1 << nodes.length; mask++) {
    let ok = true;
    let sum = 0;
    for (let i = 0; i < nodes.length && ok; i++) {
      if (!(mask & (1 << i))) continue;
      const p = parentIndex[i];
      if (p >= 0 && mask & (1 << p)) ok = false;
      sum += nodes[i];
    }
    if (ok) best = Math.max(best, sum);
  }
  return best;
}

/**
 * Random tree with `n` nodes and values from `nextVal()`. Each new node is
 * hung on a random free child slot; with probability `skew` it goes under the
 * most recently added node instead, which produces long chains.
 */
function randomTree(rng, n, nextVal, skew = 0) {
  if (n === 0) return null;
  const root = new TreeNode(nextVal());
  const slots = [[root, 'left'], [root, 'right']];
  for (let i = 1; i < n; i++) {
    const k = rng() < skew ? slots.length - 1 - randomInt(rng, 0, 1) : randomInt(rng, 0, slots.length - 1);
    const [parent, side] = slots[k];
    slots[k] = slots[slots.length - 1];
    slots.pop();
    const node = new TreeNode(nextVal());
    parent[side] = node;
    slots.push([node, 'left'], [node, 'right']);
  }
  return root;
}

/** A left-leaning chain with the given values from top to bottom. */
function chain(values) {
  let root = null;
  for (let i = values.length - 1; i >= 0; i--) root = new TreeNode(values[i], root, null);
  return root;
}

describe('House Robber III', () => {
  describe('examples from the problem', () => {
    it('[3, 2, 3, null, 3, null, 1] → 7 (root + both grandchildren)', () => {
      expect(rob(arrayToTree([3, 2, 3, null, 3, null, 1]))).toBe(7);
    });

    it('[3, 4, 5, 1, 3, null, 1] → 9 (the two children beat the root)', () => {
      expect(rob(arrayToTree([3, 4, 5, 1, 3, null, 1]))).toBe(9);
    });

    it('[4, 1, null, 2, null, 3] → 7 (skip two levels in a row; "every other level" gives only 6)', () => {
      expect(rob(arrayToTree([4, 1, null, 2, null, 3]))).toBe(7);
    });
  });

  describe('edge cases', () => {
    it('empty tree → 0', () => {
      expect(rob(null)).toBe(0);
    });

    it('a single house → its value', () => {
      expect(rob(arrayToTree([8]))).toBe(8);
    });

    it('a single house with 0 money → 0', () => {
      expect(rob(arrayToTree([0]))).toBe(0);
    });

    it('[5, 1, 1] → 5 (the root alone beats both children)', () => {
      expect(rob(arrayToTree([5, 1, 1]))).toBe(5);
    });

    it('[2, 1, 3] → 4 (two siblings can both be robbed)', () => {
      expect(rob(arrayToTree([2, 1, 3]))).toBe(4);
    });

    it('all zeros → 0', () => {
      expect(rob(arrayToTree([0, 0, 0, 0, null, 0]))).toBe(0);
    });
  });

  describe('tricky cases', () => {
    it('[2, 1, 3, null, 4] → 7 (rob 3 and 4: they sit on different levels and are not linked)', () => {
      expect(rob(arrayToTree([2, 1, 3, null, 4]))).toBe(7);
    });

    it('chain 10 → 1 → 1 → 10 → 20 → 31 (robbing a cheap house can be part of the best plan: 10 + 1 + 20)', () => {
      // 10 + 10 = 20 and 10 + 20 = 30 both lose to 10 + 1 + 20.
      expect(rob(chain([10, 1, 1, 10, 20]))).toBe(31);
    });

    it('chain 10 → 1 → 1 → 10 → 1 → 1 → 10 → 30 (gaps of two houses beat strict alternation, which gives 22)', () => {
      expect(rob(chain([10, 1, 1, 10, 1, 1, 10]))).toBe(30);
    });

    it('the best choice can differ between the left and right subtrees', () => {
      //            1
      //          /   \
      //        10     1
      //        /     / \
      //       1     10  10
      // Rob 10 on the left (skipping its child) and both 10s on the right: 30.
      expect(rob(arrayToTree([1, 10, 1, 1, null, 10, 10]))).toBe(30);
    });

    it('[6, 3, 3, 4, 4, 4, 4] → 22 (root + all four grandchildren; comparing only the top two levels picks wrong)', () => {
      // Root vs children is a tie (6 vs 3 + 3), but 6 + 4·4 = 22 beats 3 + 3 = 6 and the leaves' 16.
      expect(rob(arrayToTree([6, 3, 3, 4, 4, 4, 4]))).toBe(22);
    });

    it('maximum values: perfect tree of 7 houses holding 10^4 each → 5·10^4 (the root plus the four leaves)', () => {
      expect(rob(arrayToTree(new Array(7).fill(10_000)))).toBe(50_000);
    });

    it('does not modify the tree', () => {
      const values = [3, 4, 5, 1, 3, null, 1];
      const root = arrayToTree(values);
      rob(root);
      expect(treeToArray(root)).toEqual(values);
    });

    it('chain of 30 houses with values 1, 2, …, 30: rob all the even values → 240', () => {
      // Pair up (1,2), (3,4), …: at most one house per pair, and 2k is the larger → 2 + 4 + … + 30.
      const root = chain(Array.from({ length: 30 }, (_, i) => i + 1));
      expect(rob(root)).toBe(240);
    });
  });

  describe('randomized (seeded) against a brute-force oracle', () => {
    it('matches "try every subset" for 300 random trees of up to 14 houses', () => {
      const rng = createRng(1111);
      for (let t = 0; t < 300; t++) {
        const n = randomInt(rng, 0, 14);
        const root = randomTree(rng, n, () => randomInt(rng, 0, 20), t % 3 === 0 ? 0.8 : 0);
        expect(rob(root), `tree ${JSON.stringify(treeToArray(root))}`).toBe(bruteForce(root));
      }
    });
  });

  describe('performance', () => {
    it('a chain of only 40 houses (plain recursion without memoization is exponential — seconds here)', () => {
      // Values 1..40 from top to bottom. Pairing (1,2), (3,4), … shows the best
      // is all even values: 2 + 4 + … + 40 = 420.
      const root = chain(Array.from({ length: 40 }, (_, i) => i + 1));
      const { result, ms } = measure(() => rob(root));
      expect(result).toBe(420);
      expect(ms, `took ${ms.toFixed(0)}ms — each subtree should be solved once`).toBeLessThan(500);
    });

    it('perfect tree of 131,071 houses (the un-memoized recursion is about O(n^1.7) here)', () => {
      // 17 levels, every value 1. Robbing the leaves and then every second level
      // upward is optimal: 2^16 + 2^14 + … + 2^0 = 87,381.
      const root = arrayToTree(new Array(2 ** 17 - 1).fill(1));
      const { result, ms } = measure(() => rob(root));
      expect(result).toBe(87_381);
      expect(ms, `took ${ms.toFixed(0)}ms — aim for O(n)`).toBeLessThan(500);
    });
  });
});
