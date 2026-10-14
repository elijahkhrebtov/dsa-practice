/*
 * Title:      Diameter of Binary Tree
 * Difficulty: Easy
 * Patterns:   Tree DFS
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * Given the root of a binary tree, return the length of its **diameter**:
 * the longest path between ANY two nodes in the tree.
 *
 *   • A path is a sequence of nodes where each consecutive pair is joined by
 *     an edge (parent–child), and no node appears twice. It may go up from
 *     one node and then down to another.
 *   • The length of a path is its number of EDGES (not nodes).
 *   • The longest path does NOT have to pass through the root.
 *   • A single node has diameter 0. For an empty tree (`root === null`)
 *     return 0.
 *   • Don't modify the tree.
 *
 * Nodes are `TreeNode` objects from lib/tree.js: `{ val, left, right }`,
 * where a missing child is `null`. Node values play no role here.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  root = [1, 2, 3, 4, 5]
 *
 *               1
 *              / \
 *             2   3
 *            / \
 *           4   5
 *
 *     Output: 3
 *     Why:    4 → 2 → 1 → 3 (or 5 → 2 → 1 → 3) has 3 edges.
 *
 *   Example 2
 *     Input:  root = [1, 2]
 *     Output: 1
 *
 *   Example 3
 *     Input:  root = [1, 2, null, 3, 4, 5, null, null, 6]
 *
 *               1
 *              /
 *             2
 *            / \
 *           3   4
 *          /     \
 *         5       6
 *
 *     Output: 4
 *     Why:    5 → 3 → 2 → 4 → 6. It never touches the root; the best path
 *             through the root (5 → 3 → 2 → 1) only has 3 edges.
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 0 <= number of nodes <= 6 * 10^5
 *   • The height of the tree is at most 2,100 (so recursion is safe).
 *   • -100 <= node.val <= 100
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   O(n) time: a single traversal. Computing a height from scratch at every
 *   node costs O(n · h), and a performance test with a tall, bushy tree
 *   will catch that.
 */

import { TreeNode } from '../../../lib/tree.js';

// ▶ Run tests:   npm run solve diameter-of-binary-tree
// ⟳ Watch mode:  npm run watch diameter-of-binary-tree

/**
 * Returns the number of edges on the longest path between any two nodes.
 *
 * @param {TreeNode | null} root - Root of the binary tree (null for an empty tree).
 * @returns {number} The diameter in edges (0 for an empty or single-node tree).
 */
export function diameterOfBinaryTree(root) {
  // Your code here
}
