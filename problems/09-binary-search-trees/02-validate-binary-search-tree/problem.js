/*
 * Title:      Validate Binary Search Tree
 * Difficulty: Medium
 * Patterns:   BST Property, Tree DFS
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * Given the root of a binary tree, decide whether it is a valid binary
 * search tree (BST).
 *
 * A valid BST satisfies, for EVERY node:
 *
 *   • every value in the node's left subtree is strictly LESS than the
 *     node's value;
 *   • every value in the node's right subtree is strictly GREATER than the
 *     node's value;
 *   • both subtrees are themselves valid BSTs.
 *
 * Duplicates are not allowed: a value equal to an ancestor's value on
 * either side makes the tree invalid. An empty tree (`root === null`) is a
 * valid BST. Do not modify the tree.
 *
 * Trees in examples are written as level-order arrays, with `null` for a
 * missing child.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  root = [2, 1, 3]
 *     Output: true
 *
 *   Example 2
 *     Input:  root = [5, 1, 4, null, null, 3, 6]
 *     Output: false
 *     Why:    The root's right child is 4, which is smaller than 5.
 *
 *   Example 3
 *     Input:  root = [5, 4, 6, null, null, 3, 7]
 *
 *                5
 *               / \
 *              4   6
 *                 / \
 *                3   7
 *
 *     Output: false
 *     Why:    Every parent/child pair looks fine (3 < 6), but 3 is in the
 *             RIGHT subtree of 5, so it would have to be greater than 5.
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • The number of nodes is in the range [0, 2 * 10^5].
 *   • The tree's height is at most 3,000, so recursion is fine.
 *   • -2^31 <= Node.val <= 2^31 - 1
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   O(n) time: visit each node once. O(h) extra space for the recursion
 *   or stack.
 */

import { TreeNode } from '../../../lib/tree.js';

// ▶ Run tests:   npm run solve validate-binary-search-tree
// ⟳ Watch mode:  npm run watch validate-binary-search-tree

/**
 * Determines whether a binary tree is a valid (strict) binary search tree.
 *
 * @param {TreeNode | null} root - Root of the binary tree (not modified).
 * @returns {boolean} `true` if every node's left subtree holds only smaller values and its right subtree only larger values.
 */
export function isValidBST(root) {
  // Your code here
}
