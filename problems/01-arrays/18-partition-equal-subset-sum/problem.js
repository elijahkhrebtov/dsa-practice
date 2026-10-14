/*
 * Title:      Partition Equal Subset Sum
 * Difficulty: Medium
 * Patterns:   Dynamic Programming, Knapsack
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * Given an array of positive integers `nums`, decide whether it can be split
 * into TWO groups with equal sums. Every element must go into exactly one of
 * the two groups (each element is used once; you can't split an element).
 *
 * Return `true` if such a split exists, otherwise `false`.
 *
 *   • The order of elements doesn't matter — a group is any subset, not a
 *     contiguous piece.
 *   • Both groups must have the same sum; since all values are positive,
 *     neither group can be empty, so a single element can never be split.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  nums = [1, 5, 11, 5]
 *     Output: true
 *     Why:    [1, 5, 5] and [11] both sum to 11.
 *
 *   Example 2
 *     Input:  nums = [1, 2, 3, 5]
 *     Output: false
 *     Why:    the total is 11 — an odd total can never be halved.
 *
 *   Example 3
 *     Input:  nums = [1, 2, 5]
 *     Output: false
 *     Why:    the total 8 is even, but no subset sums to 4.
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 1 <= nums.length <= 200
 *   • 1 <= nums[i] <= 100
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   O(n · S) time and O(S) space, where S = sum(nums) / 2. Trying all 2^n
 *   ways to split the array is exponential — the performance test has only
 *   29 numbers, and that's already too many for it.
 */

// ▶ Run tests:   npm run solve partition-equal-subset-sum
// ⟳ Watch mode:  npm run watch partition-equal-subset-sum

/**
 * Decides whether `nums` can be divided into two subsets with equal sums.
 *
 * @param {number[]} nums - Positive integers; each must go into exactly one of the two subsets.
 * @returns {boolean} `true` if an equal-sum split exists, otherwise `false`.
 */
export function canPartition(nums) {
  // Your code here
}
