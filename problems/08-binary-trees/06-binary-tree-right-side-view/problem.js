/*
 * Title:      Binary Tree Right Side View
 * Difficulty: Medium
 * Patterns:   Tree BFS
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * Imagine standing to the right of a binary tree and looking at it. On each
 * level you can see exactly one node: the rightmost node of that level
 * (everything else on the level is hidden behind it). Return the values of
 * the visible nodes, ordered from top to bottom.
 *
 *   • The result has one value per level (its length equals the height of
 *     the tree).
 *   • The visible node of a level is the rightmost one ON THAT LEVEL. It is
 *     not necessarily a right child, and it may sit in the root's LEFT
 *     subtree when the left subtree is deeper than the right one.
 *   • For an empty tree (`root === null`) return `[]`.
 *   • Don't modify the tree.
 *
 * Nodes are `TreeNode` objects from lib/tree.js: `{ val, left, right }`,
 * where a missing child is `null`.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  root = [1, 2, 3, null, 5, null, 4]
 *
 *               1          ← see 1
 *              / \
 *             2   3        ← see 3
 *              \   \
 *               5   4      ← see 4
 *
 *     Output: [1, 3, 4]
 *
 *   Example 2
 *     Input:  root = [1, 2, 3, 4, null, null, null, 5]
 *
 *               1          ← see 1
 *              / \
 *             2   3        ← see 3
 *            /
 *           4              ← see 4 (nothing to its right on this level)
 *          /
 *         5                ← see 5
 *
 *     Output: [1, 3, 4, 5]
 *     Why:    The right subtree ends at depth 1, so the deeper levels are
 *             seen through nodes of the left subtree.
 *
 *   Example 3
 *     Input:  root = [1, null, 3]
 *     Output: [1, 3]
 *
 *   Example 4
 *     Input:  root = []   (null)
 *     Output: []
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 0 <= number of nodes <= 2 * 10^5
 *   • -1000 <= node.val <= 1000 (values may repeat)
 *   • The tree may be unbalanced (the tests include chains a few thousand
 *     nodes deep).
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   O(n) time: every node may matter (a deep node on the far left can be
 *   visible), so each node is visited once. O(n) extra space at most.
 */

import { TreeNode } from '../../../lib/tree.js';

// ▶ Run tests:   npm run solve binary-tree-right-side-view
// ⟳ Watch mode:  npm run watch binary-tree-right-side-view

/**
 * Returns the values visible from the right side of the tree, top to bottom.
 *
 * @param {TreeNode | null} root - Root of the binary tree (null for an empty tree).
 * @returns {number[]} The rightmost value of each level, from the root level down (`[]` for an empty tree).
 */
export function rightSideView(root) {
  // Your code here
}
