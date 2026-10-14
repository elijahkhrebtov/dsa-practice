/*
 * Title:      Minimum Size Subarray Sum
 * Difficulty: Medium
 * Patterns:   Sliding Window
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * You are given a positive integer `target` and an array `nums` of
 * POSITIVE integers. Return the length of the shortest contiguous subarray
 * whose sum is greater than or equal to `target`.
 *
 *   • A subarray is a run of consecutive elements nums[i..j] (i <= j).
 *   • "Greater than or equal": a sum that overshoots the target counts.
 *   • If no subarray reaches the target (even the whole array falls short),
 *     return 0.
 *   • Return only the length, not the subarray.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  target = 7, nums = [2, 3, 1, 2, 4, 3]
 *     Output: 2
 *     Why:    [4, 3] sums to 7. No single element reaches 7.
 *
 *   Example 2
 *     Input:  target = 4, nums = [1, 4, 4]
 *     Output: 1
 *     Why:    [4] alone is enough.
 *
 *   Example 3
 *     Input:  target = 11, nums = [1, 1, 1, 1, 1, 1, 1, 1]
 *     Output: 0
 *     Why:    The whole array only sums to 8.
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 1 <= target <= 10^9
 *   • 1 <= nums.length <= 10^5
 *   • 1 <= nums[i] <= 10^4
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   O(n) time, O(1) extra space. Trying every start and extending to the
 *   right is O(n²), and the tests include 100,000 numbers.
 *
 *   Follow-up: once you have the O(n) solution, find an O(n log n) one
 *   (hint: prefix sums are sorted when every number is positive).
 */

// ▶ Run tests:   npm run solve minimum-size-subarray-sum
// ⟳ Watch mode:  npm run watch minimum-size-subarray-sum

/**
 * Finds the length of the shortest contiguous subarray with sum >= target.
 *
 * @param {number} target - Positive integer the subarray sum must reach.
 * @param {number[]} nums - Array of positive integers.
 * @returns {number} The minimal length, or 0 if no subarray reaches the target.
 */
export function minSubArrayLen(target, nums) {
  // Your code here
}
