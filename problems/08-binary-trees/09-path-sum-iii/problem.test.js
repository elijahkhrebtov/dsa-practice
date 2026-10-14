import { describe, it, expect } from 'vitest';
import { pathSum } from './problem.js';
import { TreeNode, arrayToTree, treeToArray } from '../../../lib/tree.js';
import { createRng, randomInt, measure } from '../../../lib/test-utils.js';

/**
 * Brute-force oracle: from every node, walk every downward path and count
 * the ones that hit the target. O(n·h) — fine for small or shallow trees.
 */
function bruteForce(root, target) {
  let count = 0;
  const walkFrom = (node, sum) => {
    if (!node) return;
    sum += node.val;
    if (sum === target) count++;
    walkFrom(node.left, sum);
    walkFrom(node.right, sum);
  };
  const eachStart = (node) => {
    if (!node) return;
    walkFrom(node, 0);
    eachStart(node.left);
    eachStart(node.right);
  };
  eachStart(root);
  return count;
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

describe('Path Sum III', () => {
  describe('examples from the problem', () => {
    it('[10,5,-3,3,2,null,11,3,-2,null,1], target 8 → 3', () => {
      expect(pathSum(arrayToTree([10, 5, -3, 3, 2, null, 11, 3, -2, null, 1]), 8)).toBe(3);
    });

    it('[5,4,8,11,null,13,4,7,2,null,null,5,1], target 22 → 3', () => {
      expect(pathSum(arrayToTree([5, 4, 8, 11, null, 13, 4, 7, 2, null, null, 5, 1]), 22)).toBe(3);
    });

    it('[1, 2, 3], target 6 → 0 (2 → 1 → 3 goes up then down, so it is not a path)', () => {
      expect(pathSum(arrayToTree([1, 2, 3]), 6)).toBe(0);
    });
  });

  describe('edge cases', () => {
    it('empty tree → 0', () => {
      expect(pathSum(null, 0)).toBe(0);
    });

    it('single node equal to the target → 1', () => {
      expect(pathSum(arrayToTree([7]), 7)).toBe(1);
    });

    it('single node different from the target → 0', () => {
      expect(pathSum(arrayToTree([7]), 3)).toBe(0);
    });

    it('single node 0 with target 0 → 1 (a path needs at least one node, the empty path does not count)', () => {
      expect(pathSum(arrayToTree([0]), 0)).toBe(1);
    });

    it('negative target: [-2, null, -3], target -5 → 1', () => {
      expect(pathSum(arrayToTree([-2, null, -3]), -5)).toBe(1);
    });

    it('[1,-2,-3,1,3,-2,null,-1], target -1 → 4 (negative values let the sum come back down)', () => {
      // 1 → -2,   1 → -2 → 1 → -1,   -2 → 1,   and the lone -1.
      expect(pathSum(arrayToTree([1, -2, -3, 1, 3, -2, null, -1]), -1)).toBe(4);
    });
  });

  describe('tricky cases', () => {
    it('paths may start and end in the middle: chain 1 → 2 → 3 → 4, target 5 → 1 (just 2 → 3)', () => {
      expect(pathSum(chain([1, 2, 3, 4]), 5)).toBe(1);
    });

    it('chain of four zeros, target 0 → 10 (every one of the 4+3+2+1 segments counts)', () => {
      expect(pathSum(chain([0, 0, 0, 0]), 0)).toBe(10);
    });

    it('chain 1 → -1 → 1 → -1, target 0 → 4 (repeated running sums must be counted with multiplicity)', () => {
      expect(pathSum(chain([1, -1, 1, -1]), 0)).toBe(4);
    });

    it('[0, 3, 5], target 2 → 0 (sums from the left branch must not leak into the right branch)', () => {
      // A solution that forgets to undo its bookkeeping when backtracking out of
      // the left child "sees" 5 - 3 = 2 and wrongly counts a left→right "path".
      expect(pathSum(arrayToTree([0, 3, 5]), 2)).toBe(0);
    });

    it('[1, 2, 3], target 3 → 2 (1 → 2 and the lone node 3; the same total via different nodes)', () => {
      expect(pathSum(arrayToTree([1, 2, 3]), 3)).toBe(2);
    });

    it('running sums beyond 32-bit range: chain 10^9 → 10^9 → -10^9, target 10^9 → 3', () => {
      // [10^9], [10^9] and [10^9, 10^9, -10^9]; the running sum peaks at 2·10^9 > 2^31.
      expect(pathSum(chain([1e9, 1e9, -1e9]), 1e9)).toBe(3);
    });

    it('target 0 with a path that cancels out across many levels: 5 → -2 → -3 → 4 → -4', () => {
      // Zero-sum segments: [5,-2,-3], [4,-4], [5,-2,-3,4,-4].
      expect(pathSum(chain([5, -2, -3, 4, -4]), 0)).toBe(3);
    });

    it('does not modify the tree', () => {
      const values = [10, 5, -3, 3, 2, null, 11, 3, -2, null, 1];
      const root = arrayToTree(values);
      pathSum(root, 8);
      expect(treeToArray(root)).toEqual(values);
    });
  });

  describe('randomized (seeded) against a brute-force oracle', () => {
    it('matches the brute force for 400 small random trees with lots of repeated sums', () => {
      const rng = createRng(333);
      for (let t = 0; t < 400; t++) {
        const n = randomInt(rng, 0, 60);
        const root = randomTree(rng, n, () => randomInt(rng, -5, 5), t % 3 === 0 ? 0.8 : 0);
        const target = randomInt(rng, -6, 6);
        expect(pathSum(root, target), `tree ${JSON.stringify(treeToArray(root))}, target ${target}`).toBe(bruteForce(root, target));
      }
    });

    it('matches the brute force on a random 100,000-node tree', () => {
      const rng = createRng(4242);
      const root = randomTree(rng, 100_000, () => randomInt(rng, -20, 20));
      expect(pathSum(root, 17)).toBe(bruteForce(root, 17));
    });
  });

  describe('performance', () => {
    it('133,000 nodes, height 2,517 (a fresh downward walk from every node is O(n·h) — seconds here)', () => {
      // A left spine of 2,500 nodes ending in a perfect tree of 2^17 - 1 nodes;
      // every value is 1. With target 1,000, each node at depth >= 1,000
      // (counting the root as depth 1) ends exactly one valid path:
      // 1,501 spine nodes + all 131,071 nodes of the perfect tree.
      const m = 2 ** 17 - 1;
      let root = arrayToTree(new Array(m).fill(1));
      for (let i = 0; i < 2500; i++) root = new TreeNode(1, root, null);
      const { result, ms } = measure(() => pathSum(root, 1000));
      expect(result).toBe(1501 + m);
      expect(ms, `took ${ms.toFixed(0)}ms — aim for O(n) with running (prefix) sums`).toBeLessThan(500);
    });
  });
});
