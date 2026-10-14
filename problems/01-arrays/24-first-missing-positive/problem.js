/*
 * Title:      First Missing Positive
 * Difficulty: Hard
 * Patterns:   Cyclic Sort
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * Given an unsorted array of integers `nums`, return the SMALLEST positive
 * integer (1, 2, 3, …) that does not appear in `nums`.
 *
 *   • The array may contain negatives, zeros, duplicates and values far
 *     larger than its length — all of those are allowed.
 *   • You may modify `nums` in place (its contents afterwards don't matter).
 *   • The result is always between 1 and nums.length + 1.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  nums = [1, 2, 0]
 *     Output: 3
 *     Why:    1 and 2 are present; 3 is the first one missing.
 *
 *   Example 2
 *     Input:  nums = [3, 4, -1, 1]
 *     Output: 2
 *
 *   Example 3
 *     Input:  nums = [7, 8, 9, 11, 12]
 *     Output: 1
 *     Why:    1 itself is missing.
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 1 <= nums.length <= 10^5
 *   • -2^31 <= nums[i] <= 2^31 - 1
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   O(n) time and O(1) extra space (reusing `nums` itself is fine).
 *   Sorting (O(n log n)) is not allowed — the tests block the built-in sort —
 *   and checking 1, 2, 3, … one by one with a scan is O(n²), too slow for the
 *   performance test. A Set gives O(n) time but O(n) space; the tests can't
 *   measure memory, so treat the O(1)-space version as the real challenge.
 */

// ▶ Run tests:   npm run solve first-missing-positive
// ⟳ Watch mode:  npm run watch first-missing-positive

/**
 * Finds the smallest positive integer that is absent from `nums`.
 *
 * @param {number[]} nums - Integers in any order; may be modified in place.
 * @returns {number} The smallest missing positive integer (between 1 and nums.length + 1).
 */
export function firstMissingPositive(nums) {
  // Your code here
}
