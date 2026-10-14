/*
 * Title:      House Robber III
 * Difficulty: Medium
 * Patterns:   Tree DFS, Dynamic Programming
 *
 * Solution — House Robber III
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * For any node there are only two situations that matter to its parent:
 *
 *   • the node IS robbed   → its children must not be robbed;
 *   • the node is NOT robbed → each child is free to be robbed or not,
 *                              whichever is better for that child.
 *
 * So let every subtree report a PAIR of numbers instead of one:
 *
 *   withNode    = best total for this subtree if this node is robbed
 *   withoutNode = best total for this subtree if this node is not robbed
 *
 * Both can be computed from the children's pairs in O(1):
 *
 *   withNode    = node.val + left.withoutNode + right.withoutNode
 *   withoutNode = max(left.withNode, left.withoutNode)
 *               + max(right.withNode, right.withoutNode)
 *
 * A post-order DFS computes the pair for every node exactly once. This is
 * dynamic programming on a tree: the "state" is (node, robbed or not).
 *
 * Why the obvious recursion is exponential: `best(node) = max(node.val +
 * best(grandchildren…), best(left) + best(right))` asks for a grandchild's
 * answer both from the node (directly) and from the child (as its child).
 * Each level multiplies the work — Fibonacci growth on a chain (φ^n), and
 * roughly n^1.7 on a perfect tree.
 *
 * Approach
 * ────────
 *   1. dfs(node) returns [withNode, withoutNode]; dfs(null) = [0, 0].
 *   2. Compute the children's pairs first, then combine with the formulas.
 *   3. Answer = max of the root's pair.
 *
 * Walkthrough — root = [3, 4, 5, 1, 3, null, 1]
 * ───────────
 *   leaves 1, 3, 1        → [1, 0], [3, 0], [1, 0]
 *   node 4 (children 1,3) → with = 4 + 0 + 0 = 4,  without = 1 + 3 = 4 → [4, 4]
 *   node 5 (child 1)      → with = 5 + 0 = 5,      without = 1         → [5, 1]
 *   root 3                → with = 3 + 4 + 1 = 8,  without = 4 + 5 = 9 → [8, 9]
 *   Answer: max(8, 9) = 9.
 *
 * Complexity
 * ──────────
 *   Time:  O(n) — one visit per node, O(1) work each.
 *   Space: O(h) for the recursion stack (the pairs are tiny and temporary).
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Memoization: keep the "rob grandchildren vs. rob children" recursion
 *     but cache best(node) in a Map keyed by the node object. Also O(n),
 *     with more memory and hashing overhead.
 *   • Level sums ("rob every other level") are wrong: the best choice can
 *     skip two levels in a row, and differ between the left and right
 *     subtrees (see example 3 and the tests).
 *   • Greedy "rob the bigger of node vs. its children" is wrong for the
 *     same reason — decisions deeper down change what's best higher up.
 *   • Returning a single number per subtree is not enough information for
 *     the parent; that's exactly why the pair is needed.
 */

import { TreeNode } from '../../../lib/tree.js';

/**
 * @param {TreeNode | null} root
 * @returns {number}
 */
export function rob(root) {
  /**
   * @param {TreeNode | null} node
   * @returns {[number, number]} [best if `node` is robbed, best if it is not]
   */
  function dfs(node) {
    if (node === null) return [0, 0];

    const [leftWith, leftWithout] = dfs(node.left);
    const [rightWith, rightWithout] = dfs(node.right);

    // Robbing this node forces both children to be skipped.
    const withNode = node.val + leftWithout + rightWithout;
    // Skipping it leaves each child free to take its own better option.
    const withoutNode = Math.max(leftWith, leftWithout) + Math.max(rightWith, rightWithout);

    return [withNode, withoutNode];
  }

  const [withRoot, withoutRoot] = dfs(root);
  return Math.max(withRoot, withoutRoot);
}
