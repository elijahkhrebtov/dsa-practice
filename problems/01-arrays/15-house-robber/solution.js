/*
 * Title:      House Robber
 * Difficulty: Medium
 * Patterns:   Dynamic Programming
 *
 * Solution — House Robber
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * Greedy ideas ("take the richest house", "take every other house") fail —
 * see [3, 4, 3] and [2, 1, 1, 2]. Instead, think about one decision at a
 * time. For the last house i there are only two options:
 *
 *   • skip it  → the best you can do is the best for houses 0..i-1;
 *   • rob it   → house i-1 is off-limits, so add nums[i] to the best for
 *                houses 0..i-2.
 *
 * So with best(i) = the maximum loot from houses 0..i:
 *
 *     best(i) = max(best(i - 1), best(i - 2) + nums[i])
 *     best(-1) = best(-2) = 0      (no houses → no money)
 *
 * The answer to the big problem is built from answers to smaller prefixes —
 * that's dynamic programming. Computing best(i) left to right means each
 * value is computed exactly once, instead of the exponential blow-up of the
 * plain recursion.
 *
 * Approach
 * ────────
 *   1. prev2 = 0 (best up to i-2), prev1 = 0 (best up to i-1).
 *   2. For each amount x in nums:
 *        cur = max(prev1, prev2 + x); prev2 = prev1; prev1 = cur.
 *   3. Return prev1.
 *
 * Walkthrough — nums = [2, 7, 9, 3, 1]
 * ───────────
 *   x   prev2  prev1   cur = max(prev1, prev2 + x)
 *   2     0      0     max(0, 0 + 2)  = 2
 *   7     0      2     max(2, 0 + 7)  = 7
 *   9     2      7     max(7, 2 + 9)  = 11
 *   3     7     11     max(11, 7 + 3) = 11
 *   1    11     11     max(11, 11 + 1) = 12   → answer 12
 *
 * Complexity
 * ──────────
 *   Time:  O(n) — one pass.
 *   Space: O(1) — two running values instead of a dp array.
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Plain recursion rob(i) = max(rob(i+1), nums[i] + rob(i+2)): correct
 *     but ~1.6^n calls — already ~10^8 for 41 houses (seconds).
 *   • Memoized recursion or a dp[] array: O(n) time, O(n) space. Perfectly
 *     fine; the two-variable version is just the space-optimised form.
 *   • Taking all even or all odd indices: wrong, the best plan can skip two
 *     houses in a row ([2, 1, 1, 2] → 4).
 *   • Special-casing n = 1 and n = 2 with dp[0], dp[1] = max(nums[0], nums[1])
 *     works but is easy to get wrong; seeding with zeros avoids it.
 *   • Variation (House Robber II): houses in a circle — run this twice, once
 *     without the first house and once without the last.
 */

/**
 * @param {number[]} nums
 * @returns {number}
 */
export function rob(nums) {
  let prev2 = 0; // best total using houses up to i - 2
  let prev1 = 0; // best total using houses up to i - 1

  for (const x of nums) {
    const cur = Math.max(prev1, prev2 + x); // skip house i, or rob it
    prev2 = prev1;
    prev1 = cur;
  }

  return prev1;
}
