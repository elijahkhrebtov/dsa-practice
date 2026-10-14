/*
 * Title:      Partition Equal Subset Sum
 * Difficulty: Medium
 * Patterns:   Dynamic Programming, Knapsack
 *
 * Solution — Partition Equal Subset Sum
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * Two groups with equal sums means each group sums to total / 2. So:
 *   • an odd total → impossible;
 *   • otherwise, we just need ONE subset summing to target = total / 2 —
 *     the remaining elements form the other group automatically.
 *
 * That's the subset-sum problem (a 0/1 knapsack: each item in or out, at
 * most once). There are 2^n subsets, but only target + 1 <= 10,001 distinct
 * sums we care about. So instead of remembering subsets, remember which
 * SUMS are reachable using the elements processed so far:
 *
 *     reachable after x = reachable before x  ∪  { s + x : s reachable before x }
 *
 * Approach
 * ────────
 *   1. total = sum(nums). If odd, return false. target = total / 2.
 *   2. can = boolean array of size target + 1, can[0] = true.
 *   3. For each x in nums:
 *        for s = target down to x:  can[s] = can[s] || can[s - x]
 *        if can[target], return true (early exit).
 *   4. Return can[target].
 *
 * Why iterate s DOWNWARD? When we compute can[s] we read can[s - x], a
 * smaller index. Going downward, can[s - x] hasn't been updated for this x
 * yet, so it still means "reachable WITHOUT x" — x is used at most once.
 * Going upward would let can[s - x] already include x, so x could be
 * counted twice (e.g. [1, 5] would wrongly reach 3 = 1 + 1 + 1).
 *
 * Walkthrough — nums = [1, 5, 11, 5], total 22, target 11
 * ───────────
 *   start        reachable {0}
 *   x = 1        {0, 1}
 *   x = 5        {0, 1, 5, 6}
 *   x = 11       {0, 1, 5, 6, 11}           ← 11 reached → true
 *   ([11] vs [1, 5, 5].)
 *
 * Complexity
 * ──────────
 *   Time:  O(n · target) — at most 200 · 10,000 = 2·10^6 updates.
 *   Space: O(target) — one boolean row, reused for every element.
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Brute force over all subsets: O(2^n). Already seconds at n ≈ 29.
 *   • Top-down recursion with memo on (index, currentSum): same complexity
 *     as the table, but more memory (n · target entries) and recursion.
 *   • 2-D table dp[i][s] ("using the first i items, can we make s?") is the
 *     textbook form; the 1-D downward loop is its space-optimised version.
 *   • Bitset trick: keep reachable sums as bits of a BigInt and do
 *     `bits |= bits << BigInt(x)` — very compact, same idea.
 *   • Greedy (sort descending, put each number on the lighter side) is NOT
 *     correct: [3, 3, 2, 2, 2] fails.
 *   • Forgetting the odd-total check isn't a correctness bug (target would be
 *     fractional and never reached), but checking it first is an easy win.
 */

/**
 * @param {number[]} nums
 * @returns {boolean}
 */
export function canPartition(nums) {
  let total = 0;
  for (const x of nums) total += x;
  if (total % 2 !== 0) return false; // odd totals can't be halved

  const target = total / 2;
  const can = new Array(target + 1).fill(false); // can[s]: some subset sums to s
  can[0] = true; // the empty subset

  for (const x of nums) {
    // Downward, so every can[s - x] read still excludes x (each item used once).
    for (let s = target; s >= x; s--) {
      if (can[s - x]) can[s] = true;
    }
    if (can[target]) return true;
  }

  return can[target];
}
