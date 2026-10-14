import { describe, it, expect } from 'vitest';
import { sortedArrayToBST } from './problem.js';
import { treeToArray, inorderValues } from '../../../lib/tree.js';
import { createRng, randomInt, measure } from '../../../lib/test-utils.js';

/**
 * Collects every node in BFS order, failing if a node is reachable twice
 * (shared subtrees or cycles are not a tree).
 */
function collectNodes(root) {
  if (!root) return [];
  const order = [root];
  const seen = new Set(order);
  for (let i = 0; i < order.length; i++) {
    for (const child of [order[i].left, order[i].right]) {
      if (!child) continue;
      if (seen.has(child)) throw new Error('the same node object appears twice — every element needs its own node');
      seen.add(child);
      order.push(child);
    }
  }
  return order;
}

/**
 * Checks that `root` is a height-balanced BST holding exactly `nums`.
 * Iterative, so even a badly skewed answer gets a clear failure instead of a stack overflow.
 */
function expectBalancedBST(nums, root) {
  if (nums.length === 0) {
    expect(root, 'an empty array should give null').toBeNull();
    return;
  }
  expect(root, 'should return a TreeNode for a non-empty array').toBeTruthy();
  const nodes = collectNodes(root);
  expect(nodes.length, 'the tree must have exactly one node per element').toBe(nums.length);
  // nums is strictly increasing, so "in-order equals nums" also proves the BST property.
  expect(inorderValues(root), 'in-order traversal must equal nums (BST order + same values)').toEqual(nums);

  const height = new Map();
  for (let i = nodes.length - 1; i >= 0; i--) {
    const n = nodes[i];
    const hl = n.left ? height.get(n.left) : 0;
    const hr = n.right ? height.get(n.right) : 0;
    if (Math.abs(hl - hr) > 1) {
      throw new Error(`not height-balanced at node ${n.val}: left height ${hl}, right height ${hr}`);
    }
    height.set(n, 1 + Math.max(hl, hr));
  }
}

const range = (from, to) => Array.from({ length: to - from + 1 }, (_, i) => from + i);

describe('Convert Sorted Array to Binary Search Tree', () => {
  describe('examples from the problem', () => {
    it('[-10, -3, 0, 5, 9] → any height-balanced BST of those values', () => {
      const nums = [-10, -3, 0, 5, 9];
      expectBalancedBST(nums, sortedArrayToBST(nums));
    });

    it('[1, 3] → [3, 1] or [1, null, 3] (both are balanced)', () => {
      const out = treeToArray(sortedArrayToBST([1, 3]));
      expect([JSON.stringify([3, 1]), JSON.stringify([1, null, 3])]).toContain(JSON.stringify(out));
    });

    it('[1, 2, 3] → exactly [2, 1, 3] (the only balanced shape: the middle must be the root)', () => {
      expect(treeToArray(sortedArrayToBST([1, 2, 3]))).toEqual([2, 1, 3]);
    });
  });

  describe('edge cases', () => {
    it('[] → null', () => {
      expect(sortedArrayToBST([])).toBeNull();
    });

    it('[7] → a single node [7]', () => {
      expect(treeToArray(sortedArrayToBST([7]))).toEqual([7]);
    });

    it('handles negative numbers and zero', () => {
      const nums = [-9, -5, -2, -1, 0];
      expectBalancedBST(nums, sortedArrayToBST(nums));
    });

    it('handles values at ±10^9', () => {
      const nums = [-1_000_000_000, -1, 0, 1, 1_000_000_000];
      expectBalancedBST(nums, sortedArrayToBST(nums));
    });

    it('does not modify the input array', () => {
      const nums = [1, 4, 6, 8, 10, 15];
      const copy = [...nums];
      sortedArrayToBST(nums);
      expect(nums).toEqual(copy);
    });
  });

  describe('tricky cases', () => {
    it('7 elements: a perfect tree [4, 2, 6, 1, 3, 5, 7] is the natural answer, any balanced one is accepted', () => {
      const nums = range(1, 7);
      const root = sortedArrayToBST(nums);
      expectBalancedBST(nums, root);
    });

    it('8 elements: one side gets one extra node — that is still balanced', () => {
      const nums = range(1, 8);
      expectBalancedBST(nums, sortedArrayToBST(nums));
    });

    it('balance is required at EVERY node, not just the root (checked for 1..20)', () => {
      // A tree can have equal-height root subtrees and still be lopsided deeper down.
      const nums = range(1, 20);
      expectBalancedBST(nums, sortedArrayToBST(nums));
    });

    it('every size from 0 to 100 produces a balanced BST (off-by-one in the split shows up here)', () => {
      for (let n = 0; n <= 100; n++) {
        const nums = range(0, n - 1).map((x) => x * 3 - 50);
        expectBalancedBST(nums, sortedArrayToBST(nums));
      }
    });

    it('two calls on the same array return independent trees', () => {
      const nums = [1, 2, 3, 4];
      const a = sortedArrayToBST(nums);
      const b = sortedArrayToBST(nums);
      expect(a).not.toBe(b);
      expectBalancedBST(nums, a);
      expectBalancedBST(nums, b);
    });
  });

  describe('randomized (seeded, reproducible)', () => {
    it('300 random strictly increasing arrays all become balanced BSTs', () => {
      const rng = createRng(2024);
      for (let t = 0; t < 300; t++) {
        const n = randomInt(rng, 0, 60);
        const nums = [];
        let v = randomInt(rng, -1000, 0);
        for (let i = 0; i < n; i++) {
          v += randomInt(rng, 1, 50); // strictly increasing, uneven gaps
          nums.push(v);
        }
        expectBalancedBST(nums, sortedArrayToBST(nums));
      }
    });
  });

  describe('performance', () => {
    it('100,000 elements build quickly and stay balanced (inserting one by one would make a 100,000-deep chain)', () => {
      const nums = range(0, 99_999).map((x) => x * 2 - 100_000);
      const { result, ms } = measure(() => sortedArrayToBST(nums));
      expectBalancedBST(nums, result);
      expect(ms, `took ${ms.toFixed(0)}ms — aim for O(n)`).toBeLessThan(1000);
    });
  });
});
