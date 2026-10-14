/*
 * Title:      House Robber III
 * Difficulty: Medium
 * Patterns:   Tree DFS, Dynamic Programming
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * The houses in a neighbourhood form a binary tree: `root` is the entrance,
 * and every house is a node whose value is the money inside. A thief wants
 * to rob as much as possible, but the alarm goes off if two DIRECTLY LINKED
 * houses — a parent and its child — are both robbed on the same night.
 *
 * Return the maximum total amount the thief can rob without triggering the
 * alarm.
 *
 *   • Robbing a node and its grandchild is fine; only parent–child pairs
 *     are forbidden. Two siblings may both be robbed.
 *   • Robbing nothing is allowed, so the answer is never negative.
 *   • An empty tree (`root === null`) → 0. Don't modify the tree.
 *
 * Nodes are `TreeNode` objects from lib/tree.js: `{ val, left, right }`.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  root = [3, 2, 3, null, 3, null, 1]
 *
 *               3
 *              / \
 *             2   3
 *              \   \
 *               3   1
 *
 *     Output: 7
 *     Why:    Rob the root and the two grandchildren: 3 + 3 + 1.
 *
 *   Example 2
 *     Input:  root = [3, 4, 5, 1, 3, null, 1]
 *
 *               3
 *              / \
 *             4   5
 *            / \   \
 *           1   3   1
 *
 *     Output: 9
 *     Why:    Rob the two children: 4 + 5. Robbing the root allows at most
 *             3 + 1 + 3 + 1 = 8.
 *
 *   Example 3
 *     Input:  root = [4, 1, null, 2, null, 3]
 *
 *               4
 *              /
 *             1
 *            /
 *           2
 *          /
 *         3
 *
 *     Output: 7
 *     Why:    Rob 4 and 3, skipping TWO levels in between. "Every other
 *             level" would give only 4 + 2 = 6.
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 0 <= number of nodes <= 2 * 10^5
 *   • The height of the tree is at most 3,000 (so recursion is safe).
 *   • 0 <= node.val <= 10^4
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   O(n) time, O(h) extra space. The obvious recursion ("rob this node and
 *   recurse into the grandchildren, or skip it and recurse into the
 *   children") solves the same subtrees over and over and is EXPONENTIAL:
 *   the tests include a chain of just 40 houses where it takes seconds.
 */

import { TreeNode } from '../../../lib/tree.js';

// ▶ Run tests:   npm run solve house-robber-iii
// ⟳ Watch mode:  npm run watch house-robber-iii

/**
 * Computes the most money that can be robbed without robbing a parent and its child.
 *
 * @param {TreeNode | null} root - Root of the tree of houses (null for no houses).
 * @returns {number} The maximum total value of a set of nodes with no parent–child pair.
 */
export function rob(root) {
  // Your code here
}
