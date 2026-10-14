/*
 * Title:      Validate Binary Search Tree
 * Difficulty: Medium
 * Patterns:   BST Property, Tree DFS
 *
 * Solution — Validate Binary Search Tree
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * The BST rule is about whole subtrees: every value under a node's right
 * side must exceed that node. So a node is constrained not just by its
 * parent but by EVERY ancestor. Going down-left from an ancestor sets a
 * ceiling, and going down-right sets a floor. Luckily all of those
 * constraints collapse into one open interval (low, high): the tightest
 * floor and ceiling seen on the path from the root. Each node only needs to
 * check that it fits inside its interval, then pass a narrower interval to
 * each child.
 *
 * Approach (DFS with bounds)
 * ──────────────────────────
 *   1. check(node, low, high):
 *        a. null → true (empty subtrees are fine).
 *        b. If node.val <= low or node.val >= high → false
 *           (strict, so equal values are rejected).
 *        c. Return check(node.left, low, node.val) &&
 *                  check(node.right, node.val, high).
 *   2. Answer: check(root, -Infinity, Infinity).
 *
 * Walkthrough — root = [5, 4, 6, null, null, 3, 7]
 * ───────────
 *   check(5, -∞, ∞)   ok
 *     check(4, -∞, 5)  ok, children null
 *     check(6, 5, ∞)   ok
 *       check(3, 5, 6)  3 <= 5 → false   ← grandchild violation caught
 *   → false
 *
 * Complexity
 * ──────────
 *   Time:  O(n): each node is checked once with O(1) work. `&&`
 *          short-circuits, so we stop at the first violation.
 *   Space: O(h) recursion depth: O(log n) when balanced, O(n) for a chain.
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • In-order traversal: a tree is a BST exactly when its in-order sequence
 *     is strictly increasing. Walk in order (recursively or with a stack)
 *     and compare each value with the previous one. Same O(n) / O(h).
 *     Pitfall: initialising `prev = 0` or testing `if (prev && …)` breaks
 *     on negative values and on a previous value of 0. Use `null` and
 *     `prev !== null`.
 *   • Only comparing each node with its direct children: accepts example 3.
 *     The most common wrong answer.
 *   • Using -2^31 and 2^31 - 1 as the initial bounds: a single node holding
 *     exactly -2^31 would be "out of range". ±Infinity (or null for "no
 *     bound") avoids it.
 *   • Brute force: for every node, scan its whole left subtree for the max
 *     and right subtree for the min. Correct, but O(n·h): O(n²) on a chain.
 *   • Using `<` instead of `<=` in the rejection test lets duplicates through.
 */

import { TreeNode } from '../../../lib/tree.js';

/**
 * @param {TreeNode | null} root
 * @returns {boolean}
 */
export function isValidBST(root) {
  /**
   * @param {TreeNode | null} node
   * @param {number} low  - every value here must be > low
   * @param {number} high - every value here must be < high
   * @returns {boolean}
   */
  function check(node, low, high) {
    if (node === null) return true;
    if (node.val <= low || node.val >= high) return false; // strict: equal is invalid
    // Left subtree: still above `low`, now also below node.val.
    // Right subtree: still below `high`, now also above node.val.
    return check(node.left, low, node.val) && check(node.right, node.val, high);
  }

  return check(root, -Infinity, Infinity);
}
