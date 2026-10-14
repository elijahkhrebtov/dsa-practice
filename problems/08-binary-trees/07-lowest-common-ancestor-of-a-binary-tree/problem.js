/*
 * Title:      Lowest Common Ancestor of a Binary Tree
 * Difficulty: Medium
 * Patterns:   Tree DFS
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * Given the root of a binary tree and two nodes `p` and `q` that are both in
 * the tree, return their **lowest common ancestor** (LCA): the deepest node
 * that has both `p` and `q` in its subtree.
 *
 *   • A node counts as an ancestor of itself. So if `p` lies inside the
 *     subtree of `q`, the answer is `q` itself (and vice versa).
 *   • `p` and `q` are actual node objects taken from the tree, not values.
 *     Return the node object from the tree (the tests compare by identity,
 *     `result === expectedNode`), not a copy and not a value.
 *   • `p` and `q` may be the same node; then the answer is that node.
 *   • All values in the tree are distinct, but values carry no meaning
 *     here — this is a plain binary tree, NOT a binary search tree.
 *   • Don't modify the tree.
 *
 * Nodes are `TreeNode` objects from lib/tree.js: `{ val, left, right }`,
 * where a missing child is `null`.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   The tree for examples 1 and 2:
 *   root = [3, 5, 1, 6, 2, 0, 8, null, null, 7, 4]
 *
 *                 3
 *              /     \
 *             5       1
 *            / \     / \
 *           6   2   0   8
 *              / \
 *             7   4
 *
 *   Example 1
 *     Input:  p = node 5, q = node 1
 *     Output: node 3
 *     Why:    5 is in the left subtree of 3 and 1 in the right one, so 3 is
 *             the deepest node that has both below it.
 *
 *   Example 2
 *     Input:  p = node 5, q = node 4
 *     Output: node 5
 *     Why:    4 is a descendant of 5, and 5 is an ancestor of itself.
 *
 *   Example 3
 *     Input:  root = [1, 2], p = node 1, q = node 2
 *
 *               1
 *              /
 *             2
 *
 *     Output: node 1
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 2 <= number of nodes <= 2 * 10^5
 *   • The height of the tree is at most 3,000 (so recursion is safe).
 *   • -10^9 <= node.val <= 10^9, all values distinct.
 *   • p and q are nodes of the tree (possibly the same node).
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   O(n) time with a single traversal, O(h) extra space for the recursion.
 *   The tests include a 130,000-node tree hanging under a 2,500-node spine:
 *   repeatedly asking "is p somewhere in this subtree?" while walking down
 *   re-scans the same nodes thousands of times and will be too slow.
 */

import { TreeNode } from '../../../lib/tree.js';

// ▶ Run tests:   npm run solve lowest-common-ancestor-of-a-binary-tree
// ⟳ Watch mode:  npm run watch lowest-common-ancestor-of-a-binary-tree

/**
 * Finds the deepest node that has both `p` and `q` in its subtree.
 *
 * @param {TreeNode | null} root - Root of the binary tree.
 * @param {TreeNode} p - A node of the tree.
 * @param {TreeNode} q - Another (or the same) node of the tree.
 * @returns {TreeNode | null} The lowest common ancestor — a node object of the tree itself.
 */
export function lowestCommonAncestor(root, p, q) {
  // Your code here
}
