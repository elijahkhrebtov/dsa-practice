/*
 * Title:      Invert Binary Tree
 * Difficulty: Easy
 * Patterns:   Tree DFS
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * Given the root of a binary tree, **invert** it — turn it into its mirror
 * image — and return its root. In the mirrored tree, every node's left and
 * right children (and therefore its whole left and right subtrees) are
 * swapped, at every level.
 *
 *   • You may invert the tree in place (rearranging the existing nodes) or
 *     build a new tree; either way, return the root of the inverted tree.
 *   • Node values do not change — only the shape is mirrored.
 *   • For an empty tree (`root === null`) return `null`.
 *
 * Nodes are `TreeNode` objects from lib/tree.js: `{ val, left, right }`,
 * where a missing child is `null`. The tests compare the returned tree with
 * the expected one in level-order array form (`treeToArray`).
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  root = [4, 2, 7, 1, 3, 6, 9]
 *     Output: [4, 7, 2, 9, 6, 3, 1]
 *
 *               4                     4
 *             /   \                 /   \
 *            2     7      →        7     2
 *           / \   / \             / \   / \
 *          1   3 6   9           9   6 3   1
 *
 *   Example 2
 *     Input:  root = [1, 2, null, null, 3]
 *     Output: [1, null, 2, 3]
 *
 *               1                  1
 *              /                    \
 *             2           →          2
 *              \                    /
 *               3                  3
 *
 *     Why:    A missing child moves sides too: 1's empty right becomes its
 *             empty left, and 3 goes from 2's right to 2's left.
 *
 *   Example 3
 *     Input:  root = []   (null)
 *     Output: []          (null)
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 0 <= number of nodes <= 10^5
 *   • The height of the tree is at most 2,000 (so recursion is safe).
 *   • -100 <= node.val <= 100
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   O(n) time — each node is touched once. O(h) extra space for a recursive
 *   solution (h = height).
 */

import { TreeNode } from '../../../lib/tree.js';

// ▶ Run tests:   npm run solve invert-binary-tree
// ⟳ Watch mode:  npm run watch invert-binary-tree

/**
 * Mirrors a binary tree, swapping the left and right children of every node.
 *
 * @param {TreeNode | null} root - Root of the binary tree (null for an empty tree).
 * @returns {TreeNode | null} Root of the inverted tree (null for an empty tree).
 */
export function invertTree(root) {
  // Your code here
}
