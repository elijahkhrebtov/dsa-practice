/*
 * Title:      Subarray Sum Equals K
 * Difficulty: Medium
 * Patterns:   Prefix Sum, Hash Map
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * Given an array of integers `nums` and an integer `k`, return the number
 * of contiguous, non-empty subarrays whose elements sum to exactly `k`.
 *
 *   • A subarray is a contiguous slice nums[i..j] with i <= j. Two subarrays
 *     are different if they start or end at different indices, even when
 *     they contain the same values.
 *   • `nums` may contain negative numbers and zeros, and `k` may be
 *     negative or zero.
 *   • The empty subarray does not count.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  nums = [1, 1, 1], k = 2
 *     Output: 2
 *     Why:    [1, 1] starting at index 0 and [1, 1] starting at index 1.
 *
 *   Example 2
 *     Input:  nums = [1, 2, 3], k = 3
 *     Output: 2
 *     Why:    [1, 2] and [3].
 *
 *   Example 3
 *     Input:  nums = [1, -1, 0], k = 0
 *     Output: 3
 *     Why:    [1, -1], [0] and [1, -1, 0]. Because of negative numbers, a
 *             longer window can have a SMALLER sum, so the sliding window
 *             technique does not apply here.
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 1 <= nums.length <= 10^5
 *   • -1000 <= nums[i] <= 1000
 *   • -10^7 <= k <= 10^7
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   O(n) time. Checking every (start, end) pair is O(n²): about 5·10^9
 *   additions for the 100,000-element performance test.
 */

// ▶ Run tests:   npm run solve subarray-sum-equals-k
// ⟳ Watch mode:  npm run watch subarray-sum-equals-k

/**
 * Counts the contiguous non-empty subarrays of `nums` that sum to `k`.
 *
 * @param {number[]} nums - Integers, possibly negative or zero.
 * @param {number} k - The target sum (may be negative or zero).
 * @returns {number} How many subarrays nums[i..j] have a sum equal to k.
 */
export function subarraySum(nums, k) {
  // Your code here
}
