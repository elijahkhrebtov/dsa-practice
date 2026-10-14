/*
 * Title:      Convert Sorted Array to Binary Search Tree
 * Difficulty: Easy
 * Patterns:   BST Property, Divide & Conquer
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * You are given an array `nums` of integers sorted in strictly increasing
 * order. Build a **height-balanced** binary search tree that contains every
 * element of `nums` exactly once, and return its root.
 *
 *   • Binary search tree: for every node, all values in its left subtree are
 *     smaller than the node's value and all values in its right subtree are
 *     larger.
 *   • Height-balanced: for EVERY node (not just the root), the heights of its
 *     left and right subtrees differ by at most 1.
 *   • Use the `TreeNode` class from lib/tree.js (already imported below).
 *     Create a fresh node for each element.
 *   • Do not modify `nums`.
 *   • If `nums` is empty, return `null`.
 *
 * Usually more than one tree is valid. The tests accept ANY height-balanced
 * BST holding exactly the values of `nums`.
 *
 * Trees in examples are written as level-order arrays, with `null` for a
 * missing child.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  nums = [-10, -3, 0, 5, 9]
 *     Output: [0, -3, 9, -10, null, 5]
 *
 *                 0
 *                / \
 *              -3   9
 *              /   /
 *            -10  5
 *
 *     Why:    [0, -10, 5, null, -3, null, 9] is also accepted. Both are
 *             BSTs, and neither has a node whose subtrees differ in height
 *             by more than 1.
 *
 *   Example 2
 *     Input:  nums = [1, 3]
 *     Output: [3, 1]   (or [1, null, 3], both are balanced)
 *
 *   Example 3
 *     Input:  nums = [1, 2, 3]
 *     Output: [2, 1, 3]
 *     Why:    This is the ONLY answer. Rooting at 1 or 3 leaves a chain of
 *             two nodes on one side and nothing on the other (2 vs 0).
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 0 <= nums.length <= 10^5
 *   • -10^9 <= nums[i] <= 10^9
 *   • `nums` is sorted in strictly increasing order (no duplicates).
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   O(n) time: every element becomes exactly one node. O(log n) extra space
 *   for the recursion (the tree you return doesn't count). Inserting the
 *   values one by one into a plain BST would build a chain of height n,
 *   which is a valid BST but not a balanced one.
 */

import { TreeNode } from '../../../lib/tree.js';

// ▶ Run tests:   npm run solve convert-sorted-array-to-bst
// ⟳ Watch mode:  npm run watch convert-sorted-array-to-bst

/**
 * Builds a height-balanced binary search tree from a strictly increasing array.
 *
 * @param {number[]} nums - Strictly increasing integers (do not modify).
 * @returns {TreeNode | null} Root of a height-balanced BST containing every value of `nums`, or `null` if `nums` is empty.
 */
export function sortedArrayToBST(nums) {
  // Your code here
}
