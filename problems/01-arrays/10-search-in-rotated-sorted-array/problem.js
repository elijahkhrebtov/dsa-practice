/*
 * Title:      Search in Rotated Sorted Array
 * Difficulty: Medium
 * Patterns:   Binary Search
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * An array of DISTINCT integers was sorted in ascending order and then
 * possibly rotated: some prefix was cut off and moved to the end. For
 * example [0, 1, 2, 4, 5, 6, 7] rotated at index 4 becomes
 * [4, 5, 6, 7, 0, 1, 2]. The rotation amount is unknown and may be zero
 * (the array is then simply sorted).
 *
 * Given the rotated array `nums` and an integer `target`, return the index
 * of `target` in `nums`, or -1 if it isn't there.
 *
 *   • Because the values are distinct, the answer (if any) is unique.
 *   • Do not modify `nums`.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  nums = [4, 5, 6, 7, 0, 1, 2], target = 0
 *     Output: 4
 *
 *   Example 2
 *     Input:  nums = [4, 5, 6, 7, 0, 1, 2], target = 3
 *     Output: -1
 *     Why:    3 would sit between 2 and 4 in the sorted order, but it isn't
 *             in the array.
 *
 *   Example 3
 *     Input:  nums = [1], target = 0
 *     Output: -1
 *
 *   Example 4
 *     Input:  nums = [5, 1, 3], target = 5
 *     Output: 0
 *     Why:    the array was rotated so that only the largest value ended up
 *             in front.
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 1 <= nums.length <= 10^5
 *   • -10^9 <= nums[i], target <= 10^9
 *   • All values in `nums` are distinct.
 *   • `nums` is an ascending array rotated by some unknown amount (possibly 0).
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   O(log n) time, O(1) extra space. A linear scan (or indexOf) is O(n) —
 *   the performance tests count how many elements you read and will reject
 *   it.
 */

// ▶ Run tests:   npm run solve search-in-rotated-sorted-array
// ⟳ Watch mode:  npm run watch search-in-rotated-sorted-array

/**
 * Finds `target` in a rotated ascending array of distinct integers.
 *
 * @param {number[]} nums - Ascending array of distinct integers, rotated by an unknown amount (possibly 0).
 * @param {number} target - The value to look for.
 * @returns {number} The index of `target` in `nums`, or -1 if it is absent.
 */
export function search(nums, target) {
  // Your code here
}
