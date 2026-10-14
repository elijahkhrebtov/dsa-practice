/*
 * Title:      Find First and Last Position of Element in Sorted Array
 * Difficulty: Medium
 * Patterns:   Binary Search
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * You are given an array of integers `nums` sorted in non-decreasing order
 * (duplicates allowed) and an integer `target`.
 *
 * Return [first, last]: the index of the first and the index of the last
 * occurrence of `target` in `nums`.
 *
 *   • If `target` occurs once, first === last.
 *   • If `target` doesn't occur at all (or the array is empty), return
 *     [-1, -1].
 *   • Don't modify `nums`.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  nums = [5, 7, 7, 8, 8, 10], target = 8
 *     Output: [3, 4]
 *
 *   Example 2
 *     Input:  nums = [5, 7, 7, 8, 8, 10], target = 6
 *     Output: [-1, -1]
 *
 *   Example 3
 *     Input:  nums = [], target = 0
 *     Output: [-1, -1]
 *
 *   Example 4
 *     Input:  nums = [2, 2, 2, 2], target = 2
 *     Output: [0, 3]
 *     Why:    The whole array is one run of the target.
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 0 <= nums.length <= 10^6
 *   • -10^9 <= nums[i], target <= 10^9
 *   • nums is sorted in non-decreasing order.
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   O(log n) time per call, even when the target fills most of the array.
 *   Finding one occurrence with binary search and then walking left and
 *   right to the ends of the run is O(n) in the worst case, and so is
 *   indexOf/lastIndexOf. The performance tests catch both.
 */

// ▶ Run tests:   npm run solve find-first-and-last-position
// ⟳ Watch mode:  npm run watch find-first-and-last-position

/**
 * Finds the first and last index of `target` in a sorted array.
 *
 * @param {number[]} nums - Integers sorted in non-decreasing order (duplicates allowed, may be empty).
 * @param {number} target - The value to look for.
 * @returns {number[]} `[first, last]` indices of `target`, or `[-1, -1]` if it is absent.
 */
export function searchRange(nums, target) {
  // Your code here
}
