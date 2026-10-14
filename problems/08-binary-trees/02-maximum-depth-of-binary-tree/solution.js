/*
 * Title:      Maximum Depth of Binary Tree
 * Difficulty: Easy
 * Patterns:   Tree DFS, Tree BFS
 *
 * Solution — Maximum Depth of Binary Tree
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * The longest root-to-leaf path starts at the root and then continues into
 * either the left or the right subtree — whichever has the longer path. So
 * the depth of a tree is one (the root) plus the larger of its subtrees'
 * depths. The empty tree has depth 0, which makes a leaf 1 + max(0, 0) = 1.
 *
 * This is the simplest example of the "return info up" (post-order) shape:
 * each call returns a summary of its subtree, and the parent combines the
 * two children's summaries.
 *
 * Approach (recursive DFS)
 * ────────────────────────
 *   1. If node is null, return 0.
 *   2. Recursively compute the depth of the left and right subtrees.
 *   3. Return 1 + max(left, right).
 *
 * Walkthrough — root = [3, 9, 20, null, null, 15, 7]
 * ───────────
 *               3
 *              / \
 *             9   20
 *                /  \
 *               15   7
 *
 *   depth(9)  = 1 + max(0, 0) = 1
 *   depth(15) = 1,  depth(7) = 1
 *   depth(20) = 1 + max(1, 1) = 2
 *   depth(3)  = 1 + max(1, 2) = 3   ← answer
 *
 * Complexity
 * ──────────
 *   Time:  O(n) — each node is visited exactly once.
 *   Space: O(h) call stack: O(log n) for a balanced tree, O(n) for a chain.
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • BFS level counting: keep a queue, and for each level process exactly
 *     the nodes that were in the queue when the level started; count the
 *     levels. O(n) time, O(w) space (w = widest level, up to ~n/2). Never
 *     recurses, so it survives arbitrarily deep trees. Use a head index
 *     instead of `queue.shift()`, which is O(n) per call.
 *   • Top-down DFS: pass `depth` down as a parameter and record the maximum
 *     at each node. Same complexity; handy when other per-path state is also
 *     needed.
 *   • Iterative DFS with a stack of [node, depth] pairs is another
 *     recursion-free option.
 *   • Off-by-one: this problem counts NODES. Returning -1 for null (edge
 *     counting) gives 0 for a single node, which is wrong here.
 *   • Recursion depth: fine here because the height is capped at 2,000;
 *     Node's call stack overflows somewhere around 10,000 nested calls.
 */

import { TreeNode } from '../../../lib/tree.js';

/**
 * @param {TreeNode | null} root
 * @returns {number}
 */
export function maxDepth(root) {
  if (root === null) return 0; // an empty tree contributes no nodes
  // The longest path goes through the root and then into the deeper subtree.
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}
