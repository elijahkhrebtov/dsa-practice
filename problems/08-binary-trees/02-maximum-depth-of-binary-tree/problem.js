/*
 * Title:      Maximum Depth of Binary Tree
 * Difficulty: Easy
 * Patterns:   Tree DFS, Tree BFS
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * Given the root of a binary tree, return its **maximum depth**: the number
 * of NODES on the longest path from the root down to a leaf.
 *
 *   • Depth counts nodes, not edges: a single node has depth 1.
 *   • An empty tree (`root === null`) has depth 0.
 *   • Don't modify the tree.
 *
 * Nodes are `TreeNode` objects from lib/tree.js: `{ val, left, right }`,
 * where a missing child is `null`. Node values play no role here.
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
 *     Output: 3
 *     Why:    The longest root-to-leaf paths are 3 → 20 → 15 and
 *             3 → 20 → 7, each with 3 nodes.
 *
 *   Example 2
 *     Input:  root = [1, null, 2]
 *
 *               1
 *                \
 *                 2
 *
 *     Output: 2
 *
 *   Example 3
 *     Input:  root = []   (null)
 *     Output: 0
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 0 <= number of nodes <= 2 * 10^5
 *   • The height of the tree is at most 2,000 (so recursion is safe).
 *   • -100 <= node.val <= 100
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   O(n) time — visit each node once. Extra space O(h) for a recursive DFS
 *   (h = height) or O(w) for a level-by-level BFS (w = widest level).
 *   Try writing both.
 */

import { TreeNode } from '../../../lib/tree.js';

// ▶ Run tests:   npm run solve maximum-depth-of-binary-tree
// ⟳ Watch mode:  npm run watch maximum-depth-of-binary-tree

/**
 * Returns the number of nodes on the longest root-to-leaf path.
 *
 * @param {TreeNode | null} root - Root of the binary tree (null for an empty tree).
 * @returns {number} The maximum depth (0 for an empty tree).
 */
export function maxDepth(root) {
  // Your code here
}
