/*
 * Title:      Sliding Window Maximum
 * Difficulty: Hard
 * Patterns:   Monotonic Deque, Sliding Window
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * You are given an array of integers `nums` and a window size `k`. A window
 * of exactly `k` consecutive elements starts at the left edge of the array
 * and slides right one position at a time until it reaches the right edge.
 *
 * Return an array containing the maximum of each window, in order from
 * left to right. There are exactly `nums.length - k + 1` windows, so the
 * result has that many elements: result[i] = max(nums[i .. i + k - 1]).
 *
 * Do not modify `nums`.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  nums = [1, 3, -1, -3, 5, 3, 6, 7], k = 3
 *     Output: [3, 3, 5, 5, 6, 7]
 *     Why:
 *       window              max
 *       [1  3  -1] -3  5  3  6  7     3
 *        1 [3  -1  -3] 5  3  6  7     3
 *        1  3 [-1  -3  5] 3  6  7     5
 *        1  3  -1 [-3  5  3] 6  7     5
 *        1  3  -1  -3 [5  3  6] 7     6
 *        1  3  -1  -3  5 [3  6  7]    7
 *
 *   Example 2
 *     Input:  nums = [1], k = 1
 *     Output: [1]
 *
 *   Example 3
 *     Input:  nums = [9, 8, 7, 6], k = 4
 *     Output: [9]
 *     Why:    k equal to the length gives a single window: the whole array.
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 1 <= nums.length <= 10^5 (the performance tests use 200,000)
 *   • -10^5 <= nums[i] <= 10^5
 *   • 1 <= k <= nums.length
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   O(n) time, regardless of k. Scanning each window for its maximum is
 *   O(n·k), and the performance tests use k = 50,000. A heap of (value,
 *   index) pairs with lazy deletion is O(n log n) and also passes. The
 *   intended solution, a monotonic deque, is O(n).
 */

// ▶ Run tests:   npm run solve sliding-window-maximum
// ⟳ Watch mode:  npm run watch sliding-window-maximum

/**
 * Computes the maximum of every contiguous window of size `k`.
 *
 * @param {number[]} nums - The input array (not modified).
 * @param {number} k - The window size, 1 <= k <= nums.length.
 * @returns {number[]} The window maximums from left to right (length nums.length - k + 1).
 */
export function maxSlidingWindow(nums, k) {
  // Your code here
}
