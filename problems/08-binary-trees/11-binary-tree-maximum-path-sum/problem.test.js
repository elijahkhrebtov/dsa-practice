import { describe, it, expect } from 'vitest';
import { maxPathSum } from './problem.js';
import { TreeNode, arrayToTree, treeToArray } from '../../../lib/tree.js';
import { createRng, randomInt, measure } from '../../../lib/test-utils.js';

/**
 * Brute-force oracle: a path is determined by its two end nodes, so try
 * every pair (u, v), including u = v, and sum the nodes between them by
 * climbing parent pointers to their meeting point. O(n²·h).
 */
function bruteForce(root) {
  const parent = new Map([[root, null]]);
  const depth = new Map([[root, 0]]);
  const nodes = [root];
  for (let i = 0; i < nodes.length; i++) {
    for (const child of [nodes[i].left, nodes[i].right]) {
      if (child) {
        parent.set(child, nodes[i]);
        depth.set(child, depth.get(nodes[i]) + 1);
        nodes.push(child);
      }
    }
  }
  let best = -Infinity;
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i; j < nodes.length; j++) {
      let a = nodes[i];
      let b = nodes[j];
      let sum = 0;
      while (depth.get(a) > depth.get(b)) {
        sum += a.val;
        a = parent.get(a);
      }
      while (depth.get(b) > depth.get(a)) {
        sum += b.val;
        b = parent.get(b);
      }
      while (a !== b) {
        sum += a.val + b.val;
        a = parent.get(a);
        b = parent.get(b);
      }
      sum += a.val; // the meeting point, counted once
      best = Math.max(best, sum);
    }
  }
  return best;
}

/**
 * Random tree with `n` nodes and values from `nextVal()`. Each new node is
 * hung on a random free child slot; with probability `skew` it goes under the
 * most recently added node instead, which produces long chains.
 */
function randomTree(rng, n, nextVal, skew = 0) {
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

describe('Binary Tree Maximum Path Sum', () => {
  describe('examples from the problem', () => {
    it('[1, 2, 3] → 6 (2 → 1 → 3)', () => {
      expect(maxPathSum(arrayToTree([1, 2, 3]))).toBe(6);
    });

    it('[-10, 9, 20, null, null, 15, 7] → 42 (15 → 20 → 7 does not pass through the root)', () => {
      expect(maxPathSum(arrayToTree([-10, 9, 20, null, null, 15, 7]))).toBe(42);
    });

    it('[-3] → -3 (a path needs at least one node, so the answer can be negative)', () => {
      expect(maxPathSum(arrayToTree([-3]))).toBe(-3);
    });

    it('[1, 2, 1, 10, 10] → 22 (a path bends at most once: a parent cannot extend 10 → 2 → 10)', () => {
      expect(maxPathSum(arrayToTree([1, 2, 1, 10, 10]))).toBe(22);
    });
  });

  describe('edge cases', () => {
    it('a single positive node → its value', () => {
      expect(maxPathSum(arrayToTree([1000]))).toBe(1000);
    });

    it('a single node with value 0 → 0', () => {
      expect(maxPathSum(arrayToTree([0]))).toBe(0);
    });

    it('all negative [-2, -1] → -1 (the best path is the single largest node)', () => {
      expect(maxPathSum(arrayToTree([-2, -1]))).toBe(-1);
    });

    it('all negative [-5, -4, -3, -6, -7] → -3 (starting the answer at 0 is a classic bug)', () => {
      expect(maxPathSum(arrayToTree([-5, -4, -3, -6, -7]))).toBe(-3);
    });

    it('all values -1000 → -1000 (don\'t start from Number.MIN_VALUE — it is a tiny POSITIVE number)', () => {
      expect(maxPathSum(arrayToTree([-1000, -1000, -1000, -1000]))).toBe(-1000);
    });

    it('a negative root with a zero child: [-1, 0] → 0', () => {
      expect(maxPathSum(arrayToTree([-1, 0]))).toBe(0);
    });
  });

  describe('tricky cases', () => {
    it('the path can live deep inside a subtree: [-100, 1, -100, 2, 3] → 6', () => {
      expect(maxPathSum(arrayToTree([-100, 1, -100, 2, 3]))).toBe(6);
    });

    it('a straight path with no bend can win: [10, 2, -25, 20, 1] → 32 (20 → 2 → 10)', () => {
      expect(maxPathSum(arrayToTree([10, 2, -25, 20, 1]))).toBe(32);
    });

    it('negative branches are simply not taken: [2, -1, -2] → 2', () => {
      expect(maxPathSum(arrayToTree([2, -1, -2]))).toBe(2);
    });

    it('a lone node in the middle can be the answer: [-5, 10, -5, -1, -1] → 10', () => {
      expect(maxPathSum(arrayToTree([-5, 10, -5, -1, -1]))).toBe(10);
    });

    it('the bend at the root joins two long arms: [5,4,8,11,null,13,4,7,2,null,null,null,1] → 48', () => {
      // 7 → 11 → 4 → 5 → 8 → 13
      expect(maxPathSum(arrayToTree([5, 4, 8, 11, null, 13, 4, 7, 2, null, null, null, 1]))).toBe(48);
    });

    it('crossing a negative node is worth it when both sides are big: [-5, 10, 10] → 15', () => {
      expect(maxPathSum(arrayToTree([-5, 10, 10]))).toBe(15);
    });

    it('chain of 3,000 nodes, all 1 except a -5000 in the middle → 1500 (the longer half)', () => {
      const values = new Array(3000).fill(1);
      values[1500] = -5000;
      expect(maxPathSum(chain(values))).toBe(1500);
    });

    it('does not modify the tree', () => {
      const values = [-10, 9, 20, null, null, 15, 7];
      const root = arrayToTree(values);
      maxPathSum(root);
      expect(treeToArray(root)).toEqual(values);
    });
  });

  describe('randomized (seeded) against a brute-force oracle', () => {
    it('matches "try every pair of end nodes" for 300 random trees', () => {
      const rng = createRng(1234);
      for (let t = 0; t < 300; t++) {
        const n = randomInt(rng, 1, 40);
        // Mostly-negative trees every fourth round, to stress the "don't extend into a loss" logic.
        const lo = t % 4 === 0 ? -50 : -20;
        const hi = t % 4 === 0 ? 5 : 20;
        const root = randomTree(rng, n, () => randomInt(rng, lo, hi), t % 3 === 0 ? 0.8 : 0);
        expect(maxPathSum(root), `tree ${JSON.stringify(treeToArray(root))}`).toBe(bruteForce(root));
      }
    });
  });

  describe('performance', () => {
    it('133,000 nodes, height 2,517 (recomputing each subtree\'s best downward path per node is O(n·h) — seconds here)', () => {
      // A left spine of 2,500 nodes with values 3, -2, 3, -2, … (top to bottom),
      // ending in a perfect tree of 2^17 - 1 nodes that are all -1. The best path
      // runs straight down the spine from the top and stops at the last 3:
      // 1,250 threes and 1,249 minus-twos → 3750 - 2498 = 1252.
      let root = arrayToTree(new Array(2 ** 17 - 1).fill(-1));
      for (let i = 2499; i >= 0; i--) root = new TreeNode(i % 2 === 0 ? 3 : -2, root, null);
      const { result, ms } = measure(() => maxPathSum(root));
      expect(result).toBe(1252);
      expect(ms, `took ${ms.toFixed(0)}ms — compute everything in one post-order pass`).toBeLessThan(500);
    });
  });
});
