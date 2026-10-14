/*
 * Title:      Longest Subarray With Absolute Diff Limit
 * Difficulty: Medium
 * Patterns:   Monotonic Deque, Sliding Window
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * Given an array of integers `nums` and an integer `limit`, return the
 * length of the longest non-empty CONTIGUOUS subarray in which the absolute
 * difference between any two elements is at most `limit`.
 *
 * "Any two elements differ by at most limit" is the same as
 * max(subarray) - min(subarray) <= limit.
 *
 * Since a single element always qualifies (its max and min are equal), the
 * answer is at least 1. Return only the length, not the subarray itself.
 * Do not modify `nums`.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  nums = [8, 2, 4, 7], limit = 4
 *     Output: 2
 *     Why:    [2, 4] (diff 2) and [4, 7] (diff 3) qualify. Every subarray of
 *             length 3 has a diff of at least 5: [8, 2, 4] → 6, [2, 4, 7] → 5.
 *
 *   Example 2
 *     Input:  nums = [10, 1, 2, 4, 7, 2], limit = 5
 *     Output: 4
 *     Why:    [2, 4, 7, 2] has max 7 and min 2, a diff of 5 <= 5.
 *
 *   Example 3
 *     Input:  nums = [4, 2, 2, 2, 4, 4, 2, 2], limit = 0
 *     Output: 3
 *     Why:    With limit 0 all elements must be equal: [2, 2, 2].
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 1 <= nums.length <= 10^5 (the performance test uses 200,000)
 *   • 1 <= nums[i] <= 10^9
 *   • 0 <= limit <= 10^9
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   O(n) time. Trying every start index and extending right is O(n²) in the
 *   worst case, and the performance test is built so that the valid windows
 *   are tens of thousands of elements long everywhere. A balanced
 *   tree/heap-based window (O(n log n)) also passes, but the elegant
 *   solution uses two monotonic deques.
 */

// ▶ Run tests:   npm run solve longest-subarray-with-diff-limit
// ⟳ Watch mode:  npm run watch longest-subarray-with-diff-limit

/**
 * Finds the length of the longest contiguous subarray whose max and min differ by at most `limit`.
 *
 * @param {number[]} nums - The array of positive integers (not modified).
 * @param {number} limit - The largest allowed difference between any two elements of the subarray.
 * @returns {number} The length of the longest qualifying subarray (at least 1).
 */
export function longestSubarray(nums, limit) {
  // Your code here
}
