/*
 * Title:      Maximum Subarray
 * Difficulty: Medium
 * Patterns:   Kadane's Algorithm, Dynamic Programming
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * Given an integer array `nums`, find the contiguous subarray with the
 * largest sum and return that sum.
 *
 *   • A subarray is a run of consecutive elements nums[i..j] (i <= j).
 *   • The subarray must be NON-EMPTY — you must pick at least one element.
 *     So if every number is negative, the answer is the largest (least
 *     negative) single element, not 0.
 *   • Return only the sum, not the boundaries.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]
 *     Output: 6
 *     Why:    The subarray [4, -1, 2, 1] sums to 6. Including the -1 is worth
 *             it because it connects 4 with 2 + 1.
 *
 *   Example 2
 *     Input:  nums = [1]
 *     Output: 1
 *
 *   Example 3
 *     Input:  nums = [5, 4, -1, 7, 8]
 *     Output: 23
 *     Why:    The whole array.
 *
 *   Example 4
 *     Input:  nums = [-3, -1, -2]
 *     Output: -1
 *     Why:    Every subarray has a negative sum; the best is [-1] alone.
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 1 <= nums.length <= 10^5
 *   • -10^4 <= nums[i] <= 10^4
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   O(n) time and O(1) extra space. Trying every (start, end) pair is O(n²)
 *   and the tests include 100,000 numbers.
 *
 *   Follow-up: solve it with divide and conquer in O(n log n).
 */

// ▶ Run tests:   npm run solve maximum-subarray
// ⟳ Watch mode:  npm run watch maximum-subarray

/**
 * Returns the largest sum of any non-empty contiguous subarray.
 *
 * @param {number[]} nums - Integer array with at least one element.
 * @returns {number} The maximum subarray sum.
 */
export function maxSubArray(nums) {
  // Your code here
}
