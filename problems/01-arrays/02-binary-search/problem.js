/*
 * Title:      Binary Search
 * Difficulty: Easy
 * Patterns:   Binary Search
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * You are given an array of integers `nums` sorted in strictly ascending
 * order (no duplicates) and an integer `target`.
 *
 * Return the index of `target` in `nums`, or -1 if it isn't there.
 *
 *   • The array may be empty — then the answer is always -1.
 *   • Don't modify `nums`.
 *   • Implement the search yourself: no `indexOf`, `includes`, `findIndex`
 *     or other linear scans — they're O(n), and the tests will notice.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  nums = [-1, 0, 3, 5, 9, 12], target = 9
 *     Output: 4
 *
 *   Example 2
 *     Input:  nums = [-1, 0, 3, 5, 9, 12], target = 2
 *     Output: -1
 *     Why:    2 would sit between 0 and 3, but it isn't in the array.
 *
 *   Example 3
 *     Input:  nums = [5], target = 5
 *     Output: 0
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 0 <= nums.length <= 10^6
 *   • -10^9 <= nums[i], target <= 10^9
 *   • nums is sorted in strictly ascending order.
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   O(log n) time per search, O(1) extra space. The performance test runs
 *   thousands of searches on an array of a million numbers, most of them for
 *   values that are missing — a linear scan has to look at every element
 *   each time.
 */

// ▶ Run tests:   npm run solve binary-search
// ⟳ Watch mode:  npm run watch binary-search

/**
 * Finds the index of `target` in a strictly ascending array.
 *
 * @param {number[]} nums - Integers sorted in strictly ascending order (may be empty).
 * @param {number} target - The value to look for.
 * @returns {number} The index of `target`, or -1 if it is not present.
 */
export function search(nums, target) {
  // Your code here
}
