/*
 * Title:      Invert Binary Tree
 * Difficulty: Easy
 * Patterns:   Tree DFS
 *
 * Solution — Invert Binary Tree
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * Holding a tree up to a mirror swaps left and right everywhere. At the root
 * that means: the mirror of the right subtree becomes the new left subtree,
 * and the mirror of the left subtree becomes the new right subtree. Those two
 * smaller mirrors are the same problem on smaller trees — a natural
 * recursion with the empty tree (its own mirror) as the base case.
 *
 * Put differently: every node must have its two child pointers swapped, and
 * nothing else changes. Any traversal that visits each node once works.
 *
 * Approach (recursive DFS, in place)
 * ──────────────────────────────────
 *   1. If node is null, return null.
 *   2. Recursively invert node.left and node.right.
 *   3. Set node.left = inverted right, node.right = inverted left.
 *   4. Return node.
 *
 * Walkthrough — root = [4, 2, 7, 1, 3, 6, 9]
 * ───────────
 *   invert(2): leaves 1 and 3 are their own mirrors → 2 gets left=3, right=1
 *   invert(7): → 7 gets left=9, right=6
 *   invert(4): left = inverted 7, right = inverted 2
 *
 *               4                     4
 *             /   \                 /   \
 *            2     7      →        7     2
 *           / \   / \             / \   / \
 *          1   3 6   9           9   6 3   1
 *
 *   Level order: [4, 7, 2, 9, 6, 3, 1]
 *
 * Complexity
 * ──────────
 *   Time:  O(n) — one swap per node.
 *   Space: O(h) call stack (h = height): O(log n) balanced, O(n) for a chain.
 *          No new nodes are allocated.
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Iterative: push the root onto a stack (or queue); pop a node, swap its
 *     children, push the non-null children. Same O(n), and safe for trees
 *     of any depth.
 *   • Building a new mirrored tree instead of mutating is equally valid, but
 *     costs O(n) extra memory.
 *   • Classic bug — overwriting before saving:
 *         node.left = invertTree(node.right);
 *         node.right = invertTree(node.left);   // node.left is already the NEW left!
 *     Compute both recursive results first (or use a temp / destructuring).
 *   • Swapping only values (e.g. the root's two children's `val`s) is not a
 *     mirror: whole subtrees must move, including missing (null) children.
 */

import { TreeNode } from '../../../lib/tree.js';

/**
 * @param {TreeNode | null} root
 * @returns {TreeNode | null}
 */
export function invertTree(root) {
  if (root === null) return null; // the mirror of nothing is nothing

  // Invert both subtrees first, keeping the results before reassigning anything.
  const invertedLeft = invertTree(root.left);
  const invertedRight = invertTree(root.right);

  // Mirror at this node: the subtrees trade places.
  root.left = invertedRight;
  root.right = invertedLeft;
  return root;
}
