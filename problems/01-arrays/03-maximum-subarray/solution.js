/*
 * Title:      Maximum Subarray
 * Difficulty: Medium
 * Patterns:   Kadane's Algorithm, Dynamic Programming
 *
 * Solution — Maximum Subarray
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * Let best(i) be the largest sum of a subarray that ENDS at index i. That
 * subarray either:
 *   • is just [nums[i]], or
 *   • is the best subarray ending at i − 1, extended by nums[i].
 * So best(i) = max(nums[i], best(i−1) + nums[i]). In words: if the run
 * ending at i − 1 has a negative sum, it only hurts — throw it away and
 * start over at i. The overall answer is the maximum best(i) over all i.
 *
 * Each step only needs the previous value, so the DP table collapses into
 * one variable. That's Kadane's algorithm.
 *
 * Approach
 * ────────
 *   1. current = best = nums[0].
 *   2. For i = 1 .. n−1:
 *        current = max(nums[i], current + nums[i])
 *        best    = max(best, current)
 *   3. Return best.
 *
 * Walkthrough — nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]
 * ───────────
 *   i  x   current = max(x, current+x)   best
 *   0  -2  -2                            -2
 *   1   1  max(1, -1)  = 1                1
 *   2  -3  max(-3, -2) = -2               1
 *   3   4  max(4, 2)   = 4   (restart)    4
 *   4  -1  max(-1, 3)  = 3                4
 *   5   2  max(2, 5)   = 5                5
 *   6   1  max(1, 6)   = 6                6
 *   7  -5  max(-5, 1)  = 1                6
 *   8   4  max(4, 5)   = 5                6
 *   → 6
 *
 * Complexity
 * ──────────
 *   Time:  O(n) — one pass.
 *   Space: O(1).
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Brute force: every (i, j) with a running sum, O(n²).
 *   • Prefix sums: answer = max over j of prefix[j] − min(prefix[k] for k < j).
 *     Also O(n) — it's the same idea as "Best Time to Buy and Sell Stock".
 *   • Divide & conquer (the follow-up): the best subarray is entirely in the
 *     left half, entirely in the right half, or crosses the middle (best
 *     suffix of the left + best prefix of the right). O(n log n).
 *   • Pitfall: starting with best = 0 (or resetting current to 0 when it
 *     goes negative and only then comparing) returns 0 for all-negative
 *     input. The subarray must be non-empty.
 */

/**
 * @param {number[]} nums
 * @returns {number}
 */
export function maxSubArray(nums) {
  let current = nums[0]; // best sum of a subarray ending at the current index
  let best = nums[0]; // best sum seen anywhere

  for (let i = 1; i < nums.length; i++) {
    // Extend the previous run, or start fresh if the previous run is a liability.
    current = Math.max(nums[i], current + nums[i]);
    if (current > best) best = current;
  }

  return best;
}
