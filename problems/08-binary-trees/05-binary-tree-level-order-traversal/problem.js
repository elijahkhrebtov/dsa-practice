/*
 * Title:      Binary Tree Level Order Traversal
 * Difficulty: Medium
 * Patterns:   Tree BFS
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * Given the root of a binary tree, return its node values **level by
 * level**: an array of levels, where level d contains the values of all
 * nodes at depth d (the root is depth 0), ordered from left to right.
 *
 *   • The result is a `number[][]`. Both orders matter: levels from top to
 *     bottom, and values within a level from left to right.
 *   • "Left to right" is position in the drawing, not value and not parent:
 *     nodes on the same level that have different parents still belong to
 *     the same inner array.
 *   • For an empty tree (`root === null`) return `[]` (no levels).
 *   • Don't modify the tree.
 *
 * Nodes are `TreeNode` objects from lib/tree.js: `{ val, left, right }`,
 * where a missing child is `null`.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  root = [3, 9, 20, null, null, 15, 7]
 *
 *               3
 *              / \
 *             9   20
 *                /  \
 *               15   7
 *
 *     Output: [[3], [9, 20], [15, 7]]
 *
 *   Example 2
 *     Input:  root = [1, 2, 3, 4, null, null, 5]
 *
 *               1
 *              / \
 *             2   3
 *            /     \
 *           4       5
 *
 *     Output: [[1], [2, 3], [4, 5]]
 *     Why:    4 and 5 have different parents but the same depth, so they
 *             share a level; 4 is further left.
 *
 *   Example 3
 *     Input:  root = [1]
 *     Output: [[1]]
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
 *   O(n) time and O(n) space. A queue-based BFS is the natural fit. In JS,
 *   avoid `queue.shift()` in the loop (it is O(n) per call in general): keep
 *   a head index, or build each level into a fresh array.
 */

import { TreeNode } from '../../../lib/tree.js';

// ▶ Run tests:   npm run solve binary-tree-level-order-traversal
// ⟳ Watch mode:  npm run watch binary-tree-level-order-traversal

/**
 * Groups the tree's values by depth, each level listed left to right.
 *
 * @param {TreeNode | null} root - Root of the binary tree (null for an empty tree).
 * @returns {number[][]} One array of values per level, from the root level down (`[]` for an empty tree).
 */
export function levelOrder(root) {
  // Your code here
}
