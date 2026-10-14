/*
 * Title:      Lowest Common Ancestor of a Binary Tree
 * Difficulty: Medium
 * Patterns:   Tree DFS
 *
 * Solution — Lowest Common Ancestor of a Binary Tree
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * Ask every subtree one question: "which of p and q do you contain?" — and
 * let it answer with a single node:
 *
 *   • null        → neither p nor q is in here;
 *   • p or q      → at least one of them is in here (we return the one we
 *                   met first, i.e. the higher one);
 *   • some node   → BOTH are in here, and this is their LCA.
 *
 * At a node, after asking both children:
 *   • if the node itself is p or q, it is the answer for its subtree: either
 *     the other target is below it (so this node is the LCA, being its own
 *     ancestor), or the other target is elsewhere and an ancestor will
 *     combine the results;
 *   • if the left AND right answers are both non-null, p and q are split
 *     across this node — it is the LCA;
 *   • otherwise pass up whichever side is non-null (or null).
 *
 * The first node where the two searches "meet" is, by construction, the
 * deepest node covering both, and that answer bubbles unchanged up to the
 * root because every ancestor sees it on only one side.
 *
 * Approach (post-order DFS)
 * ─────────────────────────
 *   1. If root is null, or root is p, or root is q → return root.
 *   2. left  = lca(root.left,  p, q)
 *      right = lca(root.right, p, q)
 *   3. If left and right are both non-null → return root.
 *   4. Return left ?? right.
 *
 * Step 1 stops the descent at p or q. That's correct even when the other
 * target lies below: then nothing else in the tree can report it, so the
 * stopped node is the only non-null answer and it wins.
 *
 * Walkthrough — root = [3,5,1,6,2,0,8,null,null,7,4], p = 7, q = 8
 * ───────────
 *   lca(3): ask left  → lca(5): left lca(6) = null (leaf, not p/q)
 *                               right lca(2): left lca(7) = 7 (is p)
 *                                             right lca(4) = null
 *                                             → only left → 7
 *                               → only right → 7
 *           ask right → lca(1): left lca(0) = null, right lca(8) = 8 (is q)
 *                               → 8
 *           left = 7, right = 8, both non-null → answer 3.
 *
 * Complexity
 * ──────────
 *   Time:  O(n) — each node is visited at most once.
 *   Space: O(h) for the recursion stack (h = height; O(n) for a chain,
 *          O(log n) for a balanced tree).
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Parent pointers: BFS/DFS once to record each node's parent, put all
 *     ancestors of p in a Set, then climb from q until you hit one. O(n)
 *     time and O(n) space; easy to do iteratively for very deep trees.
 *   • Root-to-node paths: find the path to p and the path to q, then the
 *     last common node of the two paths is the answer. Also O(n).
 *   • The naive "does the left subtree contain both? then go left" descent
 *     calls a full search at every level: O(n·h), which is O(n²) on
 *     deep trees — that's what the performance test punishes.
 *   • Compare NODES (`root === p`), not values. Values are unique here, but
 *     `root.val === p.val` is a habit that breaks on trees with duplicates,
 *     and testing `if (root.val)` fails for a value of 0.
 *   • This is not a BST: you can't decide the direction by comparing values.
 */

import { TreeNode } from '../../../lib/tree.js';

/**
 * @param {TreeNode | null} root
 * @param {TreeNode} p
 * @param {TreeNode} q
 * @returns {TreeNode | null}
 */
export function lowestCommonAncestor(root, p, q) {
  // Empty subtree, or we've reached one of the targets: report it upward.
  if (root === null || root === p || root === q) return root;

  const left = lowestCommonAncestor(root.left, p, q);
  const right = lowestCommonAncestor(root.right, p, q);

  // One target on each side: this node is where the two paths meet.
  if (left !== null && right !== null) return root;

  // Otherwise forward whatever was found (a target, an already-found LCA, or null).
  return left ?? right;
}
