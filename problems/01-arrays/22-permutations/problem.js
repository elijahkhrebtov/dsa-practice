/*
 * Title:      Permutations
 * Difficulty: Medium
 * Patterns:   Backtracking
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * Given an array `nums` of DISTINCT integers, return every possible ordering
 * (permutation) of all its elements.
 *
 *   • Each permutation is an array containing every element of `nums`
 *     exactly once.
 *   • The permutations may be returned in any order, but each one must
 *     appear exactly once.
 *   • Do not modify `nums` (or, if you swap elements in place while
 *     working, put them back before returning).
 *
 * For an empty `nums` there is exactly one ordering — the empty one — so
 * return [[]].
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  nums = [1, 2, 3]
 *     Output: [[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]]
 *     Why:    3! = 6 orderings; any order of this list is accepted.
 *
 *   Example 2
 *     Input:  nums = [0, 1]
 *     Output: [[0, 1], [1, 0]]
 *
 *   Example 3
 *     Input:  nums = [1]
 *     Output: [[1]]
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 0 <= nums.length <= 6 (the performance test uses 8)
 *   • -10 <= nums[i] <= 10
 *   • All values in nums are distinct.
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   O(n · n!) time — there are n! permutations of length n, so that's the
 *   size of the output. Build each permutation directly instead of
 *   generating candidates and filtering out the invalid ones.
 */

// ▶ Run tests:   npm run solve permutations
// ⟳ Watch mode:  npm run watch permutations

/**
 * Generates every ordering of a list of distinct integers.
 *
 * @param {number[]} nums - Distinct integers (must be unchanged afterwards).
 * @returns {number[][]} All n! permutations, in any order.
 */
export function permute(nums) {
  // Your code here
}
