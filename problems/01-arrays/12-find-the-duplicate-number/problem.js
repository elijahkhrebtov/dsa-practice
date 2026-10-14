/*
 * Title:      Find the Duplicate Number
 * Difficulty: Medium
 * Patterns:   Fast & Slow Pointers, Binary Search
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * You are given an array `nums` of n + 1 integers, where every value is in
 * the range [1, n]. By the pigeonhole principle at least one value must
 * appear more than once. In this problem EXACTLY ONE value is repeated —
 * but it may be repeated any number of times (2, 3, … up to n + 1 times),
 * which means some values in [1, n] may be missing entirely.
 *
 * Return the repeated value.
 *
 *   • You must NOT modify `nums` (no sorting it, no swapping, no marking
 *     entries as negative). The tests check that the array is unchanged
 *     afterwards, and one of them passes a frozen array (writes throw).
 *   • You should use only O(1) extra space (no Set, Map, counting array or
 *     copy of the input). The tests can't measure memory — that part is on
 *     your honour.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  nums = [1, 3, 4, 2, 2]
 *     Output: 2
 *
 *   Example 2
 *     Input:  nums = [3, 1, 3, 4, 2]
 *     Output: 3
 *
 *   Example 3
 *     Input:  nums = [3, 3, 3, 3, 3]
 *     Output: 3
 *     Why:    the duplicate can appear many times; 1, 2 and 4 are missing.
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 1 <= n <= 2 * 10^5, and nums.length === n + 1
 *   • 1 <= nums[i] <= n
 *   • Exactly one value appears two or more times; every other value
 *     appears at most once.
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   O(n) time and O(1) extra space without modifying the array. (An
 *   O(n log n)-time, O(1)-space approach also passes the tests.) Comparing
 *   every pair is O(n²) — the performance test uses n = 150,000.
 *
 *   Follow-up: can you prove at least one duplicate must exist?
 */

// ▶ Run tests:   npm run solve find-the-duplicate-number
// ⟳ Watch mode:  npm run watch find-the-duplicate-number

/**
 * Finds the single repeated value in an array of n + 1 integers drawn from [1, n].
 *
 * @param {number[]} nums - Array of length n + 1 with values in [1, n]; exactly one value repeats. Must not be modified.
 * @returns {number} The repeated value.
 */
export function findDuplicate(nums) {
  // Your code here
}
