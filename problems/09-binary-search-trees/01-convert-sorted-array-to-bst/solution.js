/*
 * Title:      Convert Sorted Array to Binary Search Tree
 * Difficulty: Easy
 * Patterns:   BST Property, Divide & Conquer
 *
 * Solution — Convert Sorted Array to Binary Search Tree
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * An in-order traversal of a BST lists its values in sorted order. So we're
 * really asked: "arrange these sorted values into a tree whose in-order is
 * this array, and keep it balanced".
 *
 * Whichever value we pick as the root, the elements before it in the array
 * must form the left subtree and the elements after it the right subtree.
 * To keep the two sides equally tall, give them equally many elements: pick
 * the MIDDLE element. Then repeat the same trick on each half. The two
 * halves never differ in size by more than one, so their heights never
 * differ by more than one either, at every node.
 *
 * Approach (divide & conquer on index ranges)
 * ───────────────────────────────────────────
 *   1. build(lo, hi) returns the root of a balanced BST for nums[lo..hi].
 *   2. If lo > hi the range is empty: return null.
 *   3. mid = (lo + hi) >> 1; create a node with nums[mid].
 *   4. node.left = build(lo, mid - 1); node.right = build(mid + 1, hi).
 *   5. Answer: build(0, nums.length - 1).
 *
 * Walkthrough — nums = [-10, -3, 0, 5, 9]
 * ───────────
 *   build(0,4): mid=2 → node 0
 *     build(0,1): mid=0 → node -10
 *       build(0,-1) → null              (left of -10)
 *       build(1,1): mid=1 → node -3     (right of -10)
 *     build(3,4): mid=3 → node 5
 *       build(3,2) → null
 *       build(4,4): mid=4 → node 9
 *
 *   Result [0, -10, 5, null, -3, null, 9]:
 *            0
 *          /   \
 *        -10    5
 *          \     \
 *          -3     9
 *   (Rounding mid up instead gives [0, -3, 9, -10, null, 5], equally valid.)
 *
 * Complexity
 * ──────────
 *   Time:  O(n): each element becomes exactly one node, O(1) work each.
 *   Space: O(log n) recursion depth, because the range halves at every
 *          level. The O(n) nodes are the output and aren't counted.
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • `nums.slice(0, mid)` / `nums.slice(mid + 1)` at each level is simpler to
 *     write but copies O(n) elements per level: O(n log n) time and extra
 *     memory. Index bounds avoid that.
 *   • Inserting the values one by one into an empty BST produces a straight
 *     chain (sorted input is the worst case for a plain BST). It is a valid
 *     BST, but not balanced.
 *   • Checking balance only at the root is not enough. The definition applies
 *     to every node, and the middle-split guarantees it everywhere.
 *   • `(lo + hi) >> 1` is safe here because indices are small. In languages
 *     with fixed-width ints, `lo + (hi - lo) / 2` avoids overflow.
 */

import { TreeNode } from '../../../lib/tree.js';

/**
 * @param {number[]} nums
 * @returns {TreeNode | null}
 */
export function sortedArrayToBST(nums) {
  /**
   * Builds a balanced BST from nums[lo..hi] (inclusive).
   * @param {number} lo
   * @param {number} hi
   * @returns {TreeNode | null}
   */
  function build(lo, hi) {
    if (lo > hi) return null; // empty range → empty subtree
    const mid = (lo + hi) >> 1; // middle element becomes the root
    const node = new TreeNode(nums[mid]);
    node.left = build(lo, mid - 1); // smaller values
    node.right = build(mid + 1, hi); // larger values
    return node;
  }

  return build(0, nums.length - 1);
}
