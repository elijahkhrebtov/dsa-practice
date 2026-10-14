/*
 * Title:      Kth Smallest Element in a BST
 * Difficulty: Medium
 * Patterns:   BST Property, Tree DFS
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * Given the root of a binary search tree and an integer `k`, return the
 * k-th smallest value in the tree. `k` is 1-indexed: k = 1 asks for the
 * minimum, and k = n (the number of nodes) asks for the maximum.
 *
 *   • The tree is a valid BST with distinct values: for every node, the
 *     left subtree holds only smaller values and the right subtree only
 *     larger ones.
 *   • `k` is always between 1 and n, so an answer always exists.
 *   • Do not modify the tree.
 *
 * Trees in examples are written as level-order arrays, with `null` for a
 * missing child.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  root = [3, 1, 4, null, 2], k = 1
 *     Output: 1
 *
 *                3
 *               / \
 *              1   4
 *               \
 *                2
 *
 *   Example 2
 *     Input:  root = [5, 3, 6, 2, 4, null, null, 1], k = 3
 *     Output: 3
 *     Why:    In sorted order the values are 1, 2, 3, 4, 5, 6. The third
 *             one is 3.
 *
 *   Example 3
 *     Input:  root = [5, 3, 6, 2, 4, null, null, 1], k = 6
 *     Output: 6   (k = n gives the largest value)
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 1 <= k <= n <= 2 * 10^5
 *   • -10^9 <= Node.val <= 10^9, all values distinct
 *   • The tree's height is at most 3,000, so recursion is fine.
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   O(h + k) time and O(h) extra space, where h is the tree's height. Stop
 *   as soon as you've found the k-th value. The performance test asks for
 *   small k many times on a large tree, so collecting all n values into an
 *   array (or sorting them) on every call is too slow.
 *
 *   Follow-up: if the tree were modified often (inserts/deletes) and you
 *   needed k-th smallest queries in between, how would you get O(h) per
 *   query?
 */

import { TreeNode } from '../../../lib/tree.js';

// ▶ Run tests:   npm run solve kth-smallest-element-in-a-bst
// ⟳ Watch mode:  npm run watch kth-smallest-element-in-a-bst

/**
 * Returns the k-th smallest value (1-indexed) stored in a binary search tree.
 *
 * @param {TreeNode} root - Root of a valid BST with distinct values (not modified).
 * @param {number} k - Rank of the value to return, 1 <= k <= number of nodes.
 * @returns {number} The k-th smallest value in the tree.
 */
export function kthSmallest(root, k) {
  // Your code here
}
