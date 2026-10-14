/*
 * Title:      Path Sum III
 * Difficulty: Medium
 * Patterns:   Tree DFS, Prefix Sum
 *
 * Solution — Path Sum III
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * Fix the END node of a path. Every downward path ending at `node` is a
 * suffix of the root-to-node path. Write the running sums along that
 * root-to-node path as
 *
 *      P0 = 0, P1 = v1, P2 = v1 + v2, …, Pk = v1 + … + vk   (vk = node.val)
 *
 * The path from the i-th node to the k-th node sums to Pk − P(i−1). So the
 * number of good paths ending at `node` is the number of earlier running
 * sums equal to Pk − targetSum. This is exactly the "subarray sum equals k"
 * trick on arrays — the root-to-node path plays the role of the array.
 *
 * Keep a hash map "running sum → how many times it occurs on the CURRENT
 * root-to-node path". During a DFS the current path changes only at its
 * end: we add the node's running sum when we enter it and remove it when
 * we leave. That keeps the map exactly in sync with the path, so sums from
 * a sibling branch can never be matched.
 *
 * Approach (DFS with a prefix-sum map)
 * ────────────────────────────────────
 *   1. counts = Map { 0 → 1 }  — the empty prefix, so paths starting at the
 *      root are counted too.
 *   2. dfs(node, sum):
 *        a. if node is null → return
 *        b. sum += node.val
 *        c. answer += counts.get(sum − targetSum) ?? 0
 *        d. counts[sum]++            (now this node is on the path)
 *        e. dfs(node.left, sum); dfs(node.right, sum)
 *        f. counts[sum]−−            (backtrack: leave the path)
 *   3. Return answer.
 *
 * Order matters in c/d: look up BEFORE adding the current sum. Otherwise,
 * for targetSum = 0, the node would match its own running sum and count an
 * empty path.
 *
 * Walkthrough — root = [10, 5, -3, 3, 2, null, 11, 3, -2, null, 1], target 8
 * ───────────
 *   path         S    need S−8   sums on the path above it    found
 *   10           10    2         {0}                           0
 *   10→5         15    7         {0, 10}                       0
 *   10→5→3       18   10         {0, 10, 15}                   1  ✓ 5→3
 *   10→5→3→3     21   13         {0, 10, 15, 18}               0
 *   10→5→3→-2    16    8         {0, 10, 15, 18}               0
 *   10→5→2       17    9         {0, 10, 15}                   0
 *   10→5→2→1     18   10         {0, 10, 15, 17}               1  ✓ 5→2→1
 *   10→-3         7   -1         {0, 10}                       0
 *   10→-3→11     18   10         {0, 10, 7}                    1  ✓ -3→11
 *   Total: 3.
 *
 * Complexity
 * ──────────
 *   Time:  O(n) — each node does O(1) map work.
 *   Space: O(h) — the map holds at most one entry per node on the current
 *          path, plus O(h) recursion stack.
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Brute force: for every start node, walk all paths below it. O(n·h):
 *     fine for balanced trees, O(n²) for deep ones.
 *   • Keeping the current path in an array and summing backwards from each
 *     node is also O(n·h) — better constants, same growth.
 *   • Forgetting step (f) leaks sums from finished branches into their
 *     siblings and over-counts (see the [0, 3, 5], target 2 test).
 *   • Store COUNTS, not booleans or a Set: the same running sum can occur
 *     several times on one path (zeros, or values that cancel out).
 *   • Don't stop early when the sum exceeds the target — values can be
 *     negative, so a later node can bring it back down.
 */

import { TreeNode } from '../../../lib/tree.js';

/**
 * @param {TreeNode | null} root
 * @param {number} targetSum
 * @returns {number}
 */
export function pathSum(root, targetSum) {
  // running sum → how many nodes on the current root-to-node path have it.
  // The 0 entry stands for the empty prefix, so paths starting at the root count.
  const counts = new Map([[0, 1]]);
  let answer = 0;

  /** @param {TreeNode | null} node @param {number} sum running sum above `node` */
  function dfs(node, sum) {
    if (node === null) return;
    sum += node.val;

    // Paths ending here = earlier prefixes P with sum - P === targetSum.
    answer += counts.get(sum - targetSum) ?? 0;

    counts.set(sum, (counts.get(sum) ?? 0) + 1); // enter: this node joins the path
    dfs(node.left, sum);
    dfs(node.right, sum);
    counts.set(sum, counts.get(sum) - 1); // leave: siblings must not see this sum
  }

  dfs(root, 0);
  return answer;
}
