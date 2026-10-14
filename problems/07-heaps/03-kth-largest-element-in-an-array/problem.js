/*
 * Title:      Kth Largest Element in an Array
 * Difficulty: Medium
 * Patterns:   Heap, Quickselect
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * Given an integer array `nums` and an integer `k`, return the k-th largest
 * element of the array.
 *
 * "k-th largest" counts duplicates: it is the element that would sit at
 * position k (1-based) if you sorted `nums` in descending order. It is not
 * the k-th largest *distinct* value.
 *
 * Solve it without sorting the whole array. The tests switch off
 * `Array.prototype.sort`. You MAY reorder `nums` in place (quickselect does).
 *
 * You may import `PriorityQueue` from `../../../lib/priority-queue.js` (or
 * use your own heap from problem 01).
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  nums = [3, 2, 1, 5, 6, 4], k = 2
 *     Output: 5
 *     Why:    Descending order is 6 5 4 3 2 1; the 2nd element is 5.
 *
 *   Example 2
 *     Input:  nums = [3, 2, 3, 1, 2, 4, 5, 5, 6], k = 4
 *     Output: 4
 *     Why:    6 5 5 4 3 3 2 2 1 — the two 5s count separately.
 *
 *   Example 3
 *     Input:  nums = [7, 7, 7], k = 3
 *     Output: 7
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 1 <= k <= nums.length <= 10^5 (the performance tests go up to 3·10^5)
 *   • -10^4 <= nums[i] <= 10^4
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   Better than sorting:
 *     • a size-k min-heap: O(n log k) time, O(k) space, or
 *     • quickselect: O(n) average time, O(1) extra space.
 *   The performance tests include already-sorted input and inputs full of
 *   duplicates. Quickselect with a fixed pivot or a plain two-way partition
 *   degrades to O(n²) on those. Use a random pivot and handle elements equal
 *   to the pivot (three-way partition).
 */

// ▶ Run tests:   npm run solve kth-largest-element-in-an-array
// ⟳ Watch mode:  npm run watch kth-largest-element-in-an-array

/**
 * Finds the k-th largest element of an array (duplicates count).
 *
 * @param {number[]} nums - The numbers (may be reordered in place).
 * @param {number} k - 1-based rank from the top (1 = the maximum).
 * @returns {number} The k-th largest element.
 */
export function findKthLargest(nums, k) {
  // Your code here
}
