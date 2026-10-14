/*
 * Title:      Sliding Window Maximum
 * Difficulty: Hard
 * Patterns:   Monotonic Deque, Sliding Window
 *
 * Solution — Sliding Window Maximum
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * Rescanning the window costs O(k) per step. To do better, notice that many
 * elements in the window are irrelevant. If nums[j] <= nums[i] and j < i,
 * then nums[j] can NEVER again be a window maximum: from now on, every
 * window that contains j also contains i (i leaves later), and nums[i] is
 * at least as big.
 *
 * Throw such elements away as soon as a bigger-or-equal element arrives.
 * What remains is a sequence of candidates whose values strictly decrease
 * from oldest to newest. The oldest surviving candidate is the current
 * maximum. Candidates join at the back and leave from either end: from the
 * back when beaten by a newcomer, from the front when they slide out of the
 * window. That's a deque.
 *
 * Approach (monotonic deque of indices)
 * ─────────────────────────────────────
 *   For i = 0 … n-1:
 *     1. Pop the back while nums[back] <= nums[i].
 *     2. Push i.
 *     3. If the front index <= i - k, pop the front (it's outside the
 *        window [i-k+1, i]).
 *     4. If i >= k - 1, append nums[front] to the result.
 *   Indices (not values) are stored so we can tell when the front expires.
 *
 * Walkthrough — nums = [1, 3, -1, -3, 5, 3, 6, 7], k = 3
 * ───────────
 *   i  x   pop back      deque (idx:val)        front expired?  output
 *   0  1   —             [0:1]                  —               —
 *   1  3   0:1           [1:3]                  —               —
 *   2  -1  —             [1:3, 2:-1]            —               3
 *   3  -3  —             [1:3, 2:-1, 3:-3]      1 > 0, no       3
 *   4  5   3, 2, 1       [4:5]                  —               5
 *   5  3   —             [4:5, 5:3]             —               5
 *   6  6   5:3, 4:5      [6:6]                  —               6
 *   7  7   6:6           [7:7]                  —               7
 *   → [3, 3, 5, 5, 6, 7]
 *
 * Complexity
 * ──────────
 *   Time:  O(n). Each index is pushed exactly once and popped at most once
 *          (from the back or the front), so all the while-loops together
 *          run at most n times, independent of k.
 *   Space: O(k) for the deque (it never holds more than k live indices;
 *          with a head-index array the backing store can grow to O(n),
 *          which is fine). Plus O(n - k + 1) for the output.
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Brute force: max of each window, O(n·k). Dies when k is large.
 *   • "Only rescan when the max leaves the window": still O(n·k) on a
 *     strictly decreasing array, where the max leaves at every step.
 *   • Max-heap of [value, index]. Pop the top while its index is outside
 *     the window (lazy deletion). O(n log n).
 *   • Block decomposition: split into blocks of size k, precompute prefix
 *     maxima and suffix maxima per block, and answer each window as
 *     max(suffix[i], prefix[i + k - 1]). O(n) without a deque. A neat
 *     trick worth knowing.
 *   • Popping with < instead of <= is also correct (equal values are kept),
 *     because expiry is decided by index. It just keeps a few more items.
 *   • Storing values instead of indices makes it impossible to know when
 *     the front has left the window (duplicates make it ambiguous).
 *   • Array.shift() for the front pop is O(n) in JS. Use a head pointer.
 */

/**
 * @param {number[]} nums
 * @param {number} k
 * @returns {number[]}
 */
export function maxSlidingWindow(nums, k) {
  const deque = []; // indices; their values strictly decrease from deque[head] to the back
  let head = 0; // deque[head] is the front, which is the index of the current window max
  const result = [];

  for (let i = 0; i < nums.length; i++) {
    // 1. Smaller-or-equal elements behind i can never be a maximum again.
    while (deque.length > head && nums[deque[deque.length - 1]] <= nums[i]) deque.pop();
    // 2. i is always a candidate (it's the newest element).
    deque.push(i);
    // 3. Drop the front if it slid out of the window [i - k + 1, i].
    if (deque[head] <= i - k) head++;
    // 4. Once the first full window is formed, record its maximum.
    if (i >= k - 1) result.push(nums[deque[head]]);
  }

  return result;
}
