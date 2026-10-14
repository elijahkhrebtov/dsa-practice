/*
 * Title:      Kth Smallest Element in a BST
 * Difficulty: Medium
 * Patterns:   BST Property, Tree DFS
 *
 * Solution — Kth Smallest Element in a BST
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * In-order traversal of a BST (left, node, right) produces the values in
 * ascending order, so the k-th node visited in order is the answer. The
 * only refinement is not to do more work than necessary. The in-order walk
 * first dives down the left spine (at most h nodes) to reach the minimum,
 * and then each step produces the next value. Stopping at the k-th value
 * costs O(h + k) instead of O(n).
 *
 * Approach (iterative in-order with an explicit stack)
 * ────────────────────────────────────────────────────
 *   1. stack = [], node = root.
 *   2. While true:
 *        a. While node is not null: push it, go to node.left.
 *           (After this, the stack top is the smallest unvisited node.)
 *        b. node = stack.pop(). This is the next value in sorted order.
 *        c. k -= 1; if k === 0, return node.val.
 *        d. node = node.right (its right subtree comes next in order).
 *
 * Walkthrough — root = [5, 3, 6, 2, 4, null, null, 1], k = 3
 * ───────────
 *   dive left: push 5, 3, 2, 1          stack [5,3,2,1]
 *   pop 1  → k=2, go right (null)
 *   pop 2  → k=1, go right (null)
 *   pop 3  → k=0 → return 3            (5, 4 and 6 are never visited)
 *
 * Complexity
 * ──────────
 *   Time:  O(h + k): the initial dive is at most h pushes, and each of the
 *          k pops may push at most a left spine, but every node is pushed
 *          and popped at most once, so the total stays O(h + k).
 *   Space: O(h) for the stack.
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Collect the full in-order array and return arr[k - 1]: correct and
 *     simple, but always O(n) time and O(n) memory, even for k = 1.
 *   • Collect all values in any order and sort: O(n log n). It ignores the
 *     BST property entirely.
 *   • Recursive in-order with an outer counter works too. Just make sure it
 *     actually stops (return early or check a "found" flag) rather than
 *     continuing through the rest of the tree after recording the answer.
 *   • Off-by-one: k is 1-indexed. Decrement and check for 0, or compare
 *     a count with k, but not with k - 1.
 *   • Follow-up (frequent updates): store the size of each node's subtree.
 *     Then at each node compare k with size(left) + 1 and go left, return,
 *     or go right with k reduced: O(h) per query, and sizes are updated
 *     along the insert/delete path.
 */

import { TreeNode } from '../../../lib/tree.js';

/**
 * @param {TreeNode} root
 * @param {number} k
 * @returns {number}
 */
export function kthSmallest(root, k) {
  const stack = [];
  let node = root;

  for (;;) {
    // Go as far left as possible: the smallest unvisited value ends up on top.
    while (node) {
      stack.push(node);
      node = node.left;
    }
    node = stack.pop(); // next value in ascending order
    k -= 1;
    if (k === 0) return node.val; // early stop — the rest of the tree is never touched
    node = node.right; // its right subtree holds the next larger values
  }
}
