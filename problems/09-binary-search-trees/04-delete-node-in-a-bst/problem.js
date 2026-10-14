/*
 * Title:      Delete Node in a BST
 * Difficulty: Medium
 * Patterns:   BST Property
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * Given the root of a binary search tree with distinct values and an
 * integer `key`, delete the node whose value is `key` (if there is one) and
 * return the root of the resulting tree. The root may change, for example
 * when the root itself is deleted.
 *
 *   • The result must still be a valid BST (strict: left subtree smaller,
 *     right subtree larger, at every node) containing every original value
 *     except `key`.
 *   • If `key` is not in the tree, return the tree unchanged.
 *   • Work with the existing nodes: relink them, or copy a value from one
 *     node into another. Don't build a new tree. The tests check that every
 *     node in your result comes from the original tree.
 *   • Deleting the only node returns `null`. Deleting from an empty tree
 *     (`root === null`) returns `null`.
 *
 * Several shapes are usually valid. The tests accept any correct BST.
 *
 * Trees in examples are written as level-order arrays, with `null` for a
 * missing child.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  root = [5, 3, 6, 2, 4, null, 7], key = 3
 *
 *                5                     5                    5
 *               / \                   / \                  / \
 *              3   6       →         4   6       or       2   6
 *             / \   \               /     \                \   \
 *            2   4   7             2       7                4   7
 *
 *     Output: [5, 4, 6, 2, null, null, 7]   (or [5, 2, 6, null, 4, null, 7])
 *     Why:    3 has two children, so it's replaced by its in-order successor
 *             4 (or its predecessor 2).
 *
 *   Example 2
 *     Input:  root = [5, 3, 6, 2, 4, null, 7], key = 0
 *     Output: [5, 3, 6, 2, 4, null, 7]   (0 isn't in the tree; nothing changes)
 *
 *   Example 3
 *     Input:  root = [], key = 0
 *     Output: []
 *
 *   Example 4
 *     Input:  root = [2, 1], key = 2
 *     Output: [1]   (the root had one child, which becomes the new root)
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 0 <= number of nodes <= 2 * 10^5
 *   • -10^9 <= Node.val, key <= 10^9, node values are distinct
 *   • The tree's height is at most 3,000, so recursion is fine.
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   O(h) time and O(h) (or O(1)) extra space: walk one root-to-leaf path to
 *   find the node, plus one more path down to its successor. The
 *   performance test deletes thousands of keys from a large tree, so
 *   flattening and rebuilding the whole tree per deletion is too slow.
 */

import { TreeNode } from '../../../lib/tree.js';

// ▶ Run tests:   npm run solve delete-node-in-a-bst
// ⟳ Watch mode:  npm run watch delete-node-in-a-bst

/**
 * Deletes the node holding `key` from a BST and returns the (possibly new) root.
 *
 * @param {TreeNode | null} root - Root of a BST with distinct values.
 * @param {number} key - Value to delete; may be absent from the tree.
 * @returns {TreeNode | null} Root of the BST after deletion (`null` if the tree becomes empty).
 */
export function deleteNode(root, key) {
  // Your code here
}
