/*
 * Title:      Binary Tree Maximum Path Sum
 * Difficulty: Hard
 * Patterns:   Tree DFS
 *
 * Solution — Binary Tree Maximum Path Sum
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * Every path has exactly one HIGHEST node, where it "bends": from there it
 * goes down into the left subtree, down into the right subtree, both, or
 * neither. So
 *
 *   best path whose highest node is X
 *     = X.val + (best downward path starting at X.left,  or 0 if negative)
 *             + (best downward path starting at X.right, or 0 if negative)
 *
 * and the answer is the maximum of that over all nodes X.
 *
 * Define gain(X) = the best sum of a path that starts at X and goes
 * straight DOWN (one branch only, possibly just X itself):
 *
 *   gain(X) = X.val + max(0, gain(X.left), gain(X.right))
 *
 * One post-order DFS computes gain for every node, and while it's at X it
 * already has both children's gains, so it can also evaluate "best path
 * bending at X" and update a running maximum.
 *
 * The subtle part is the difference between the two quantities:
 *   • what a node RETURNS to its parent is gain(X): one branch only,
 *     because the parent will extend it upward and a path can't fork;
 *   • what a node RECORDS as a candidate answer may use both branches.
 *
 * Approach
 * ────────
 *   1. best = -Infinity (not 0: all-negative trees have a negative answer).
 *   2. dfs(node) returns gain(node); dfs(null) = 0.
 *        a. left  = max(0, dfs(node.left))    ← drop a branch that loses
 *           right = max(0, dfs(node.right))
 *        b. best  = max(best, node.val + left + right)
 *        c. return node.val + max(left, right)
 *   3. Return best.
 *
 * Walkthrough — root = [-10, 9, 20, null, null, 15, 7]
 * ───────────
 *   node 9:   left 0, right 0 → candidate 9,          returns 9
 *   node 15:                  → candidate 15,         returns 15
 *   node 7:                   → candidate 7,          returns 7
 *   node 20:  left 15, right 7 → candidate 42 (best), returns 20 + 15 = 35
 *   node -10: left 9, right 35 → candidate 34,        returns 25
 *   Answer: 42.
 *
 * Complexity
 * ──────────
 *   Time:  O(n) — each node is processed once.
 *   Space: O(h) for the recursion stack.
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Brute force: try every pair of end nodes — O(n²) pairs. Or, for every
 *     node, call a separate "best downward path" function on its children:
 *     O(n·h), which is quadratic on deep trees.
 *   • Initializing the answer to 0 (or to Number.MIN_VALUE, which is
 *     5e-324 — positive!) breaks all-negative trees. Use -Infinity or
 *     root.val.
 *   • Returning node.val + left + right to the parent counts a forked
 *     "path" — see the [1, 2, 1, 10, 10] example.
 *   • Clamping with max(0, …) is what lets a path stop early; without it a
 *     negative branch would be forced into every path.
 *   • For trees deeper than the call stack allows, run the same logic
 *     iteratively in post-order with an explicit stack.
 */

import { TreeNode } from '../../../lib/tree.js';

/**
 * @param {TreeNode} root
 * @returns {number}
 */
export function maxPathSum(root) {
  let best = -Infinity; // NOT 0: an all-negative tree has a negative answer

  /**
   * @param {TreeNode | null} node
   * @returns {number} best sum of a downward path starting at `node` (0 for null)
   */
  function gain(node) {
    if (node === null) return 0;

    // A branch that would lower the sum is simply not taken.
    const left = Math.max(0, gain(node.left));
    const right = Math.max(0, gain(node.right));

    // Candidate: the best path whose highest point is this node (may use both arms).
    best = Math.max(best, node.val + left + right);

    // Upward we can only offer ONE arm — the parent will continue the path.
    return node.val + Math.max(left, right);
  }

  gain(root);
  return best;
}
