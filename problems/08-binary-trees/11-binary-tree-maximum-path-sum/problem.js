/*
 * Title:      Binary Tree Maximum Path Sum
 * Difficulty: Hard
 * Patterns:   Tree DFS
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * A **path** in a binary tree is a sequence of nodes where each consecutive
 * pair is connected by an edge, and no node appears more than once. A path
 * must contain at least one node, and it does NOT have to pass through the
 * root. It can go up from one node to a common ancestor and back down the
 * other side, but it can "bend" at most at that one top node.
 *
 * The **path sum** is the sum of the values of the nodes on the path.
 *
 * Given the root of a non-empty binary tree, return the maximum path sum
 * over all paths.
 *
 *   • A single node is a valid path, so if every value is negative the
 *     answer is the largest (least negative) value — not 0.
 *   • Don't modify the tree.
 *
 * Nodes are `TreeNode` objects from lib/tree.js: `{ val, left, right }`.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  root = [1, 2, 3]
 *
 *               1
 *              / \
 *             2   3
 *
 *     Output: 6
 *     Why:    The path 2 → 1 → 3 uses every node.
 *
 *   Example 2
 *     Input:  root = [-10, 9, 20, null, null, 15, 7]
 *
 *              -10
 *              /  \
 *             9    20
 *                 /  \
 *                15   7
 *
 *     Output: 42
 *     Why:    15 → 20 → 7. Extending it through -10 to 9 would only lose 1.
 *
 *   Example 3
 *     Input:  root = [-3]
 *     Output: -3
 *     Why:    The only path is the single node; empty paths aren't allowed.
 *
 *   Example 4
 *     Input:  root = [1, 2, 1, 10, 10]
 *
 *               1
 *              / \
 *             2   1
 *            / \
 *           10  10
 *
 *     Output: 22
 *     Why:    10 → 2 → 10. You can't also go up to the root and on to its
 *             right child: the path would branch at 2, which a path can't do.
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 1 <= number of nodes <= 2 * 10^5
 *   • The height of the tree is at most 3,000 (so recursion is safe).
 *   • -1000 <= node.val <= 1000
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   O(n) time — a single post-order traversal — and O(h) extra space.
 *   Re-computing "the best downward path from this child" separately for
 *   every node is O(n·h); the tests include a 133,000-node tree of height
 *   2,517 where that takes seconds.
 */

import { TreeNode } from '../../../lib/tree.js';

// ▶ Run tests:   npm run solve binary-tree-maximum-path-sum
// ⟳ Watch mode:  npm run watch binary-tree-maximum-path-sum

/**
 * Finds the largest sum of any non-empty path in the tree.
 *
 * @param {TreeNode} root - Root of a non-empty binary tree.
 * @returns {number} The maximum sum over all paths (each path has at least one node).
 */
export function maxPathSum(root) {
  // Your code here
}
