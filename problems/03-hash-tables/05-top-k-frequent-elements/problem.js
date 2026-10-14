/*
 * Title:      Top K Frequent Elements
 * Difficulty: Medium
 * Patterns:   Hash Map, Bucket Sort, Top-K
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * Given an integer array `nums` and an integer `k`, return the `k` values
 * that occur most often in `nums`.
 *
 *   • Each value appears at most once in the result.
 *   • The result may be in any order.
 *   • The answer is guaranteed to be unique: there is never a tie between
 *     the k-th and the (k+1)-th most frequent values.
 *   • Don't modify `nums`.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  nums = [1, 1, 1, 2, 2, 3], k = 2
 *     Output: [1, 2]
 *     Why:    1 occurs 3 times, 2 occurs twice, 3 once. The top two are 1
 *             and 2. [2, 1] would be accepted too.
 *
 *   Example 2
 *     Input:  nums = [1], k = 1
 *     Output: [1]
 *
 *   Example 3
 *     Input:  nums = [4, -1, -1, 4, 7, -1], k = 1
 *     Output: [-1]
 *     Why:    -1 occurs 3 times, 4 twice, 7 once.
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 1 <= nums.length <= 10^5
 *   • -10^5 <= nums[i] <= 10^5
 *   • 1 <= k <= number of distinct values in nums
 *   • The answer is unique.
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   Better than O(n log n). Counting is O(n). The question is how to pick
 *   the top k without sorting all the counts. Aim for O(n) time with bucket
 *   sort (or O(n log k) with a size-k heap, see lib/priority-queue.js).
 *
 *   One test runs your function with the built-in sort disabled, so
 *   "count, then sort by count" (O(n log n)) won't pass that test. The
 *   performance test (100,000 numbers, 45,500 distinct values) catches
 *   approaches that re-count each value by scanning the whole array.
 */

// ▶ Run tests:   npm run solve top-k-frequent-elements
// ⟳ Watch mode:  npm run watch top-k-frequent-elements

/**
 * Returns the `k` most frequent values of `nums`, in any order.
 *
 * @param {number[]} nums - Integers (not modified).
 * @param {number} k - How many of the most frequent values to return (1 <= k <= #distinct).
 * @returns {number[]} The k most frequent distinct values, in any order.
 */
export function topKFrequent(nums, k) {
  // Your code here
}
