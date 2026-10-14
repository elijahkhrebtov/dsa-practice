/*
 * Title:      Sort an Array
 * Difficulty: Medium
 * Patterns:   Sorting, Divide & Conquer
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * Given an array of integers `nums`, return its values sorted in ascending
 * (numeric) order.
 *
 *   • You may NOT use the built-in sort (`Array.prototype.sort`, `toSorted`,
 *     typed-array sort). The tests replace them with functions that throw.
 *     Implement a sorting algorithm yourself.
 *   • Duplicates are kept: the output has exactly the same values as the
 *     input, just in order.
 *   • You may sort `nums` in place and return it, or build and return a new
 *     array — the tests only look at the returned array.
 *   • An empty array returns an empty array.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  nums = [5, 2, 3, 1]
 *     Output: [1, 2, 3, 5]
 *
 *   Example 2
 *     Input:  nums = [5, 1, 1, 2, 0, 0]
 *     Output: [0, 0, 1, 1, 2, 5]
 *     Why:    duplicates stay; every copy appears in the output.
 *
 *   Example 3
 *     Input:  nums = [10, -3, 100, 9]
 *     Output: [-3, 9, 10, 100]
 *     Why:    numeric order, not dictionary order ("10" < "9" as strings).
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 0 <= nums.length <= 10^5
 *   • -5 * 10^4 <= nums[i] <= 5 * 10^4  (integers)
 *   • No built-in sorting.
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   O(n log n) time in the WORST case (O(n) extra space is fine). The
 *   performance tests sort 100,000 numbers that are random, already sorted,
 *   reverse-sorted and all equal — O(n²) sorts (bubble, insertion,
 *   selection) and a quicksort with a naive pivot or a naive partition will
 *   be too slow or overflow the call stack on at least one of them.
 *
 *   Follow-up: since the values are bounded, can you also do it in
 *   O(n + range) with counting sort?
 */

// ▶ Run tests:   npm run solve sort-an-array
// ⟳ Watch mode:  npm run watch sort-an-array

/**
 * Sorts an array of integers in ascending order without using the built-in sort.
 *
 * @param {number[]} nums - The integers to sort (may contain duplicates and negatives).
 * @returns {number[]} The same values in ascending numeric order (either `nums` sorted in place or a new array).
 */
export function sortArray(nums) {
  // Your code here
}
