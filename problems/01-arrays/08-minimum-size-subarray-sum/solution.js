/*
 * Title:      Minimum Size Subarray Sum
 * Difficulty: Medium
 * Patterns:   Sliding Window
 *
 * Solution — Minimum Size Subarray Sum
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * Because every number is positive, the window sum behaves monotonically:
 * growing the window to the right only increases the sum, and shrinking it
 * from the left only decreases it. That gives two useful facts:
 *   • Once nums[left..right] reaches the target, extending it further right
 *     only makes it longer — so for this `left` we're done; move left on.
 *   • If nums[left..right] doesn't reach the target, no shorter window
 *     ending at `right` (starting later than left) can either.
 * So both ends only ever move forward: a sliding window.
 *
 * Approach (variable-size sliding window)
 * ──────────────────────────────────────
 *   1. left = 0, sum = 0, best = Infinity.
 *   2. For right = 0 .. n−1:
 *        sum += nums[right]
 *        while sum >= target:
 *          best = min(best, right − left + 1)
 *          sum -= nums[left]; left++
 *   3. Return best === Infinity ? 0 : best.
 *
 * Walkthrough — target = 7, nums = [2, 3, 1, 2, 4, 3]
 * ───────────
 *   r  add  window          sum  shrink?
 *   0  2    [2]             2    no
 *   1  3    [2,3]           5    no
 *   2  1    [2,3,1]         6    no
 *   3  2    [2,3,1,2]       8    best=4, drop 2 → [3,1,2] sum 6
 *   4  4    [3,1,2,4]       10   best=4, drop 3 → [1,2,4] sum 7
 *                                best=3, drop 1 → [2,4]   sum 6
 *   5  3    [2,4,3]         9    best=3, drop 2 → [4,3]   sum 7
 *                                best=2, drop 4 → [3]     sum 3
 *   → 2
 *
 * Complexity
 * ──────────
 *   Time:  O(n) — `right` moves n times and `left` moves at most n times in
 *          total, so the inner while loop does O(n) work over the whole run.
 *   Space: O(1).
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Brute force: for each start, extend until the sum reaches the target.
 *     O(n²) in the worst case (e.g. an unreachable target).
 *   • Prefix sums + binary search (the follow-up): prefix[] is strictly
 *     increasing because the numbers are positive, so for each start i you
 *     can binary-search the first j with prefix[j] − prefix[i] >= target.
 *     O(n log n) time, O(n) space.
 *   • The sliding window relies on positivity. With negative numbers the
 *     sum isn't monotonic and you'd need a monotonic deque over prefix sums.
 *   • Using `if` instead of `while` for shrinking misses cases where one big
 *     element lets you drop several from the left ([1, 1, 1, 1, 100]).
 *   • Don't forget to return 0, not Infinity, when nothing reaches the target.
 */

/**
 * @param {number} target
 * @param {number[]} nums
 * @returns {number}
 */
export function minSubArrayLen(target, nums) {
  let left = 0;
  let sum = 0; // sum of nums[left..right]
  let best = Infinity;

  for (let right = 0; right < nums.length; right++) {
    sum += nums[right];
    // Shrink from the left as long as the window still reaches the target.
    while (sum >= target) {
      best = Math.min(best, right - left + 1);
      sum -= nums[left];
      left++;
    }
  }

  return best === Infinity ? 0 : best;
}
