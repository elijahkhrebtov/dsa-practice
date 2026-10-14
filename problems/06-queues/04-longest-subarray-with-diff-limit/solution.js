/*
 * Title:      Longest Subarray With Absolute Diff Limit
 * Difficulty: Medium
 * Patterns:   Monotonic Deque, Sliding Window
 *
 * Solution — Longest Subarray With Absolute Diff Limit
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * The condition "max - min <= limit" is monotone: shrinking a window can
 * only lower its max and raise its min. So for every right end there is a
 * smallest valid left end, and it never moves backwards as `right`
 * advances. That's the classic variable-size sliding window. Grow on the
 * right, shrink on the left while the window is invalid.
 *
 * The window needs its max and min at every step. A monotonic deque gives
 * the max of a sliding window in amortized O(1). Keep indices whose values
 * DECREASE from front to back. When x arrives, every element at the back
 * that is <= x is useless: x is at least as large and leaves the window
 * later, so those elements can never be the maximum again. Pop them, then
 * push x. The front is the max. A second deque with INCREASING values
 * gives the min the same way.
 *
 * Approach
 * ────────
 *   1. left = 0, best = 0, maxQ = [], minQ = [] (indices, with head pointers).
 *   2. For right = 0 … n-1:
 *        a. Pop from maxQ's back while its value < nums[right]; push right.
 *        b. Pop from minQ's back while its value > nums[right]; push right.
 *        c. While nums[maxQ front] - nums[minQ front] > limit:
 *             left++; drop any deque front whose index < left.
 *        d. best = max(best, right - left + 1).
 *   3. Return best.
 *
 * Walkthrough — nums = [10, 1, 2, 4, 7, 2], limit = 5
 * ───────────
 *   r  x   maxQ (values)  minQ (values)  diff  shrink → left  len  best
 *   0  10  [10]           [10]           0     —        0      1    1
 *   1  1   [10, 1]        [1]            9     left=1: drop 10 from maxQ
 *                         maxQ [1]                       1      1    1
 *   2  2   [2]            [1, 2]         1     —        1      2    2
 *   3  4   [4]            [1, 2, 4]      3     —        1      3    3
 *   4  7   [7]            [1, 2, 4, 7]   6     left=2: drop 1 from minQ
 *                         minQ [2, 4, 7] diff 5          2      3    3
 *   5  2   [7, 2]         [2, 2]         5     —        2      4    4
 *   → 4
 *
 * Complexity
 * ───��──────
 *   Time:  O(n). Each index is pushed into each deque once and popped at
 *          most once (from the back or the front), and `left` only moves
 *          forward.
 *   Space: O(n) for the deques in the worst case (e.g. sorted input).
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Brute force: for each start, extend right while tracking a running
 *     min/max. O(n²) when valid windows are long.
 *   • Sliding window + two heaps with lazy deletion, or a sorted multiset:
 *     O(n log n). Works fine, just more machinery.
 *   • Use strict comparisons when popping (< for maxQ, > for minQ) or
 *     non-strict ones. Both are correct, because fronts are removed by
 *     INDEX (index < left), never by value.
 *   • A known variant replaces the shrinking `while` with an `if`: the
 *     window then never gets shorter than the best length found so far, and
 *     it just slides. The answer is n - left at the end. It's correct but
 *     subtle. The `while` version above is easier to reason about.
 *   • `shift()` on the deques makes each front-pop O(n). Use head indices.
 */

/**
 * @param {number[]} nums
 * @param {number} limit
 * @returns {number}
 */
export function longestSubarray(nums, limit) {
  const maxQ = []; // indices, values decreasing front→back; front = window max
  const minQ = []; // indices, values increasing front→back; front = window min
  let maxHead = 0;
  let minHead = 0;
  let left = 0;
  let best = 0;

  for (let right = 0; right < nums.length; right++) {
    const x = nums[right];

    // Elements smaller than x can never be the max again while x is in the window.
    while (maxQ.length > maxHead && nums[maxQ[maxQ.length - 1]] < x) maxQ.pop();
    maxQ.push(right);
    // Elements larger than x can never be the min again while x is in the window.
    while (minQ.length > minHead && nums[minQ[minQ.length - 1]] > x) minQ.pop();
    minQ.push(right);

    // Shrink from the left until the window is valid again.
    while (nums[maxQ[maxHead]] - nums[minQ[minHead]] > limit) {
      left++;
      if (maxQ[maxHead] < left) maxHead++;
      if (minQ[minHead] < left) minHead++;
    }

    best = Math.max(best, right - left + 1);
  }

  return best;
}
