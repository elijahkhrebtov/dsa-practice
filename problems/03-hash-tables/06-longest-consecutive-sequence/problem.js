/*
 * Title:      Longest Consecutive Sequence
 * Difficulty: Medium
 * Patterns:   Hash Set
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * Given an unsorted array of integers `nums`, return the length of the
 * longest run of consecutive integers (x, x+1, x+2, …, x+m) whose values
 * all appear in `nums`.
 *
 *   • The values can appear anywhere in the array, in any order. Only the
 *     values matter, not their positions.
 *   • Duplicates count once: [1, 2, 2, 3] has the run 1, 2, 3 of length 3.
 *   • Return 0 for an empty array.
 *   • Don't modify `nums`.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  nums = [100, 4, 200, 1, 3, 2]
 *     Output: 4
 *     Why:    1, 2, 3, 4 are all present. 100 and 200 are runs of length 1.
 *
 *   Example 2
 *     Input:  nums = [0, 3, 7, 2, 5, 8, 4, 6, 0, 1]
 *     Output: 9
 *     Why:    0 through 8 are all present (0 appears twice, but counts once).
 *
 *   Example 3
 *     Input:  nums = [9, -1, 0, -2, 11]
 *     Output: 3
 *     Why:    -2, -1, 0. Runs can cross zero.
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 0 <= nums.length <= 10^5
 *   • -10^9 <= nums[i] <= 10^9
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   O(n) time. Sorting (O(n log n)) would make this easy, which is why one
 *   test disables the built-in sort. The performance tests also catch the
 *   "count upwards from EVERY element" approach, which is O(n²) on long
 *   runs, including the subtle version that only starts at run beginnings
 *   but re-walks the same run for every duplicate of its first value.
 */

// ▶ Run tests:   npm run solve longest-consecutive-sequence
// ⟳ Watch mode:  npm run watch longest-consecutive-sequence

/**
 * Finds the length of the longest run of consecutive integer values in `nums`.
 *
 * @param {number[]} nums - Unsorted integers, possibly with duplicates (not modified).
 * @returns {number} Length of the longest consecutive run (0 for an empty array).
 */
export function longestConsecutive(nums) {
  // Your code here
}
