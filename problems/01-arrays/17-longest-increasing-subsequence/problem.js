/*
 * Title:      Longest Increasing Subsequence
 * Difficulty: Medium
 * Patterns:   Dynamic Programming, Binary Search
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * Given an integer array `nums`, return the length of its longest STRICTLY
 * increasing subsequence.
 *
 *   • A subsequence keeps the original order but may skip elements: from
 *     [3, 1, 4, 1, 5] you can pick [3, 4, 5] or [1, 4, 5], but not [4, 3].
 *   • It does NOT have to be contiguous.
 *   • "Strictly" means each element must be greater than the previous one —
 *     equal values can't both be used.
 *   • Return only the length.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  nums = [10, 9, 2, 5, 3, 7, 101, 18]
 *     Output: 4
 *     Why:    e.g. [2, 3, 7, 101] or [2, 5, 7, 18].
 *
 *   Example 2
 *     Input:  nums = [0, 1, 0, 3, 2, 3]
 *     Output: 4
 *     Why:    [0, 1, 2, 3].
 *
 *   Example 3
 *     Input:  nums = [7, 7, 7, 7, 7, 7, 7]
 *     Output: 1
 *     Why:    equal values don't count as increasing.
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 1 <= nums.length <= 2500   (the follow-up test uses 50,000)
 *   • -10^9 <= nums[i] <= 10^9
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   Baseline: an O(n²)-time, O(n)-space dynamic programming solution. Every
 *   test except one passes with it.
 *
 *   Follow-up: O(n log n) time. The test marked "follow-up" in the
 *   performance group uses 50,000 numbers; the O(n²) DP takes a few seconds
 *   there and fails it. Get the baseline green first, then come back for it.
 */

// ▶ Run tests:   npm run solve longest-increasing-subsequence
// ⟳ Watch mode:  npm run watch longest-increasing-subsequence

/**
 * Computes the length of the longest strictly increasing subsequence.
 *
 * @param {number[]} nums - The input integers (at least one).
 * @returns {number} Length of the longest strictly increasing subsequence.
 */
export function lengthOfLIS(nums) {
  // Your code here
}
