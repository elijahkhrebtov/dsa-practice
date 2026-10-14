/*
 * Title:      Construct Binary Tree from Preorder and Inorder Traversal
 * Difficulty: Medium
 * Patterns:   Divide & Conquer, Hash Map
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * You are given two arrays describing the same binary tree:
 *
 *   • `preorder` — the values in pre-order (node, then left subtree, then
 *     right subtree);
 *   • `inorder`  — the values in in-order (left subtree, then node, then
 *     right subtree).
 *
 * Rebuild the tree and return its root.
 *
 *   • All values are distinct, which is what makes the tree unique.
 *   • Build new `TreeNode` objects (from lib/tree.js). Don't modify the two
 *     input arrays.
 *   • If both arrays are empty, return `null`.
 *   • The inputs are always valid traversals of some binary tree.
 *
 * The tests compare your tree with the expected one in level-order form
 * (the `[3, 9, 20, null, null, 15, 7]` notation used in the examples).
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  preorder = [3, 9, 20, 15, 7]
 *             inorder  = [9, 3, 15, 20, 7]
 *     Output: [3, 9, 20, null, null, 15, 7]
 *
 *               3
 *              / \
 *             9   20
 *                /  \
 *               15   7
 *
 *     Why:    preorder starts with the root, 3. In `inorder`, everything to
 *             the left of 3 ([9]) is the left subtree and everything to the
 *             right ([15, 20, 7]) is the right subtree. Repeat for each part.
 *
 *   Example 2
 *     Input:  preorder = [-1], inorder = [-1]
 *     Output: [-1]
 *
 *   Example 3
 *     Input:  preorder = [1, 2, 3], inorder = [3, 2, 1]
 *     Output: [1, 2, null, 3]
 *
 *               1
 *              /
 *             2
 *            /
 *           3
 *
 *     Why:    each root is the LAST of its inorder range, so every subtree
 *             is a left child — a left-leaning chain.
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 0 <= preorder.length == inorder.length <= 2 * 10^5
 *   • -10^9 <= value <= 10^9, all values distinct.
 *   • The height of the tree is at most 3,000 (so recursion is safe).
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   O(n) time and O(n) extra space. The tests rebuild a 200,000-node tree:
 *   locating each root in `inorder` with a linear scan (indexOf over the
 *   whole array) makes it O(n²) and too slow. Slicing arrays at every step
 *   also costs extra copying — try to work with index ranges instead.
 */

import { TreeNode } from '../../../lib/tree.js';

// ▶ Run tests:   npm run solve construct-tree-from-preorder-and-inorder
// ⟳ Watch mode:  npm run watch construct-tree-from-preorder-and-inorder

/**
 * Rebuilds a binary tree from its pre-order and in-order traversals.
 *
 * @param {number[]} preorder - Values in pre-order (node, left, right). All distinct.
 * @param {number[]} inorder - The same values in in-order (left, node, right).
 * @returns {TreeNode | null} Root of the rebuilt tree, or null when the arrays are empty.
 */
export function buildTree(preorder, inorder) {
  // Your code here
}
