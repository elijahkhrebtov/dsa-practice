/*
 * Title:      Subsets
 * Difficulty: Medium
 * Patterns:   Backtracking
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * Given an array `nums` of DISTINCT integers, return every possible subset
 * (the power set) of its elements.
 *
 *   • Each subset is an array of elements taken from `nums`, each element
 *     used at most once.
 *   • The empty subset [] and the full set are both included.
 *   • Subsets are sets: [1, 2] and [2, 1] are the same subset, so only one
 *     of them may appear.
 *   • The result may list the subsets in any order, and the elements inside
 *     each subset may also be in any order.
 *   • Do not modify `nums`.
 *
 * For an empty `nums`, the only subset is the empty one: return [[]].
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  nums = [1, 2, 3]
 *     Output: [[], [1], [2], [1, 2], [3], [1, 3], [2, 3], [1, 2, 3]]
 *     Why:    2³ = 8 subsets; any ordering of them is accepted.
 *
 *   Example 2
 *     Input:  nums = [0]
 *     Output: [[], [0]]
 *
 *   Example 3
 *     Input:  nums = []
 *     Output: [[]]
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 0 <= nums.length <= 10 (the performance test uses 16)
 *   • -10 <= nums[i] <= 10
 *   • All values in nums are distinct.
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   O(n · 2^n) time — there are 2^n subsets of average length n/2, so you
 *   can't do better than the size of the output. Avoid generating
 *   duplicates and filtering them out afterwards.
 */

// ▶ Run tests:   npm run solve subsets
// ⟳ Watch mode:  npm run watch subsets

/**
 * Generates the power set of a list of distinct integers.
 *
 * @param {number[]} nums - Distinct integers (not modified).
 * @returns {number[][]} All 2^n subsets, in any order.
 */
export function subsets(nums) {
  // Your code here
}
