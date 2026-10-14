/*
 * Title:      Binary Tree Inorder Traversal
 * Difficulty: Easy
 * Patterns:   Tree DFS, Stack
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * Given the root of a binary tree, return the values of its nodes in
 * **in-order**: for every node, first everything in its left subtree, then
 * the node itself, then everything in its right subtree.
 *
 *   • Return a new array of numbers (the order matters — it is exactly the
 *     in-order sequence).
 *   • For an empty tree (`root === null`) return `[]`.
 *   • Don't modify the tree.
 *
 * Nodes are `TreeNode` objects from lib/tree.js: `{ val, left, right }`,
 * where a missing child is `null`.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  root = [1, null, 2, 3]
 *
 *               1
 *                \
 *                 2
 *                /
 *               3
 *
 *     Output: [1, 3, 2]
 *     Why:    1 has no left subtree, so it comes first. Then its right
 *             subtree {2, 3} in in-order: 3 (left of 2), then 2.
 *
 *   Example 2
 *     Input:  root = [1, 2, 3, 4, 5, null, 8, null, null, 6, 7, 9]
 *
 *                   1
 *                 /   \
 *                2     3
 *               / \     \
 *              4   5     8
 *                 / \   /
 *                6   7 9
 *
 *     Output: [4, 2, 6, 5, 7, 1, 3, 9, 8]
 *
 *   Example 3
 *     Input:  root = []   (null)
 *     Output: []
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 0 <= number of nodes <= 10^5
 *   • -10^9 <= node.val <= 10^9 (values may repeat)
 *   • The tree may be completely unbalanced: in the follow-up tests it is a
 *     single chain 100,000 nodes deep.
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   O(n) time, O(h) extra space (h = height of the tree).
 *
 *   The recursive solution is short — write it first. It passes every test
 *   except the "follow-up" group.
 *
 *   Follow-up: do it iteratively, with an explicit stack instead of the call
 *   stack. A 100,000-deep recursion overflows JavaScript's call stack
 *   ("Maximum call stack size exceeded"), so the follow-up tests only pass
 *   with an iterative solution.
 */

import { TreeNode } from '../../../lib/tree.js';

// ▶ Run tests:   npm run solve binary-tree-inorder-traversal
// ⟳ Watch mode:  npm run watch binary-tree-inorder-traversal

/**
 * Returns the node values of a binary tree in in-order (left, node, right).
 *
 * @param {TreeNode | null} root - Root of the binary tree (null for an empty tree).
 * @returns {number[]} The values in in-order sequence (`[]` for an empty tree).
 */
export function inorderTraversal(root) {
  // Your code here
}
