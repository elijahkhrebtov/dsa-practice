/*
 * Title:      Diameter of Binary Tree
 * Difficulty: Easy
 * Patterns:   Tree DFS
 *
 * Solution — Diameter of Binary Tree
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * Look at any path and find its highest node (the one nearest the root).
 * The path goes down from there into the left subtree, the right subtree,
 * or both — so the longest path "bending" at a node has
 *
 *     height(left) + height(right)   edges
 *
 * where height counts nodes and height(null) = 0. (A left subtree of height
 * 2 contributes 2 edges: one from the node to its child, one more below.)
 *
 * The diameter is the maximum of that quantity over EVERY node, because the
 * best bend point can be anywhere — not necessarily at the root.
 *
 * Computing heights separately at every node repeats work (O(n · h)). But
 * the height of a node is itself computed from its children's heights, so a
 * single post-order DFS can do both jobs: RETURN the height upward, and
 * RECORD left + right in a running maximum on the way. This "return one
 * thing, record another" shape comes back in Binary Tree Maximum Path Sum.
 *
 * Approach
 * ────────
 *   1. best = 0.
 *   2. height(node):
 *        a. If node is null, return 0.
 *        b. l = height(node.left), r = height(node.right).
 *        c. best = max(best, l + r)   ← longest path bending at this node
 *        d. Return 1 + max(l, r)      ← what the parent needs
 *   3. Call height(root) and return best.
 *
 * Walkthrough — root = [1, 2, null, 3, 4, 5, null, null, 6]
 * ───────────
 *               1
 *              /
 *             2
 *            / \
 *           3   4
 *          /     \
 *         5       6
 *
 *   node 5: l=0 r=0 → best 0, returns 1
 *   node 3: l=1 r=0 → best 1, returns 2
 *   node 6: returns 1;  node 4: l=0 r=1 → best 1, returns 2
 *   node 2: l=2 r=2 → best 4, returns 3
 *   node 1: l=3 r=0 → 3 < 4, returns 4
 *   Answer: 4 (5 → 3 → 2 → 4 → 6), which bends at 2, not at the root.
 *
 * Complexity
 * ──────────
 *   Time:  O(n) — each node is visited once and does O(1) work.
 *   Space: O(h) call stack (h = height).
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Naive: for every node call a separate height() for both children and
 *     take the max — O(n · h): fine for balanced trees, quadratic for tall
 *     ones (the caterpillar test).
 *   • Two BFS passes: treat the tree as an undirected graph; the node
 *     farthest from any start node is an endpoint of a diameter, and the
 *     farthest node from it gives the length. O(n) but needs parent links.
 *   • Returning only height(left) + height(right) at the ROOT is the most
 *     common wrong answer — it misses paths that never touch the root.
 *   • Mixing units: the answer counts edges. With heights in nodes,
 *     `l + r` is already the edge count; don't add 1 (that would count
 *     nodes on the path).
 *   • Keep `best` local to each call of diameterOfBinaryTree (a closure or
 *     an object passed around). A module-level variable leaks between calls.
 */

import { TreeNode } from '../../../lib/tree.js';

/**
 * @param {TreeNode | null} root
 * @returns {number}
 */
export function diameterOfBinaryTree(root) {
  let best = 0;

  /**
   * Returns the height (in nodes) of `node`'s subtree, and records the
   * longest path that bends at `node`.
   * @param {TreeNode | null} node
   * @returns {number}
   */
  function height(node) {
    if (node === null) return 0;
    const left = height(node.left);
    const right = height(node.right);
    best = Math.max(best, left + right); // edges on the best path through `node`
    return 1 + Math.max(left, right); // parent can only extend ONE branch
  }

  height(root);
  return best;
}
