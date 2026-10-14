/*
 * Title:      Combination Sum
 * Difficulty: Medium
 * Patterns:   Backtracking
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * You are given an array of DISTINCT positive integers `candidates` and a
 * positive integer `target`. Return every unique combination of candidates
 * whose values add up to exactly `target`.
 *
 *   • The same candidate may be used any number of times in a combination.
 *   • Two combinations are the same if they use each value the same number
 *     of times — [2, 2, 3] and [2, 3, 2] are ONE combination, so only one of
 *     them may appear.
 *   • The combinations may be returned in any order, and the numbers inside
 *     each combination may be in any order too.
 *   • If no combination reaches `target`, return an empty array [].
 *   • You may reorder (e.g. sort) `candidates` in place.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  candidates = [2, 3, 6, 7], target = 7
 *     Output: [[2, 2, 3], [7]]
 *     Why:    2 + 2 + 3 = 7 (2 is reused) and 7 = 7. Nothing else works.
 *
 *   Example 2
 *     Input:  candidates = [2, 3, 5], target = 8
 *     Output: [[2, 2, 2, 2], [2, 3, 3], [3, 5]]
 *
 *   Example 3
 *     Input:  candidates = [2], target = 1
 *     Output: []
 *     Why:    every candidate is larger than the target.
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 1 <= candidates.length <= 30 (the performance test uses 39)
 *   • 2 <= candidates[i] <= 40, all distinct
 *   • 1 <= target <= 40
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   Generate each combination exactly once, directly — never build the same
 *   multiset in several orders and de-duplicate afterwards. The performance
 *   test has 2,167 answers but millions of ordered sequences.
 *   Pruning branches whose sum already exceeds `target` keeps it fast.
 */

// ▶ Run tests:   npm run solve combination-sum
// ⟳ Watch mode:  npm run watch combination-sum

/**
 * Finds every unique multiset of candidates (with repetition) that sums to `target`.
 *
 * @param {number[]} candidates - Distinct positive integers; each may be used repeatedly.
 * @param {number} target - The exact sum each combination must reach.
 * @returns {number[][]} All unique combinations, in any order ([] if there are none).
 */
export function combinationSum(candidates, target) {
  // Your code here
}
