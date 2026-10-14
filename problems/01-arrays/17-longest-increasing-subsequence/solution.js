/*
 * Title:      Longest Increasing Subsequence
 * Difficulty: Medium
 * Patterns:   Dynamic Programming, Binary Search
 *
 * Solution — Longest Increasing Subsequence
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * Baseline (DP). Define dp[i] = length of the longest strictly increasing
 * subsequence that ENDS at index i. Such a subsequence is either nums[i]
 * alone, or some subsequence ending at an earlier j with nums[j] < nums[i],
 * extended by nums[i]:
 *
 *     dp[i] = 1 + max(dp[j] for j < i with nums[j] < nums[i])   (or 1)
 *
 * The answer is max(dp). That's O(n²) — fine for n = 2500.
 *
 * Follow-up (O(n log n)). Change what we remember. For each length L, keep
 * tails[L-1] = the SMALLEST value that can end an increasing subsequence of
 * length L among the elements seen so far. Smaller tails dominate: anything
 * that extends a subsequence ending in 7 also extends one ending in 5.
 *
 * Claim: tails is strictly increasing. (If a length-(L+1) subsequence ends
 * in t, its first L elements form a length-L subsequence ending in something
 * < t, so tails[L-1] < tails[L].) So when a new x arrives:
 *   • if x is bigger than every tail, it extends the longest subsequence;
 *   • otherwise, find the first tail >= x and replace it with x — x can end a
 *     subsequence of that same length, with a smaller (better) tail.
 * Finding "first tail >= x" in a sorted array is a binary search.
 *
 * Approach (O(n log n))
 * ─────────────────────
 *   1. tails = [].
 *   2. For each x in nums:
 *        k = lower bound of x in tails (first index with tails[k] >= x)
 *        if k === tails.length → tails.push(x) else tails[k] = x
 *   3. Return tails.length.
 *
 * Walkthrough — nums = [10, 9, 2, 5, 3, 7, 101, 18]
 * ───────────
 *   x=10   tails = [10]
 *   x=9    first >= 9 is 10        → [9]
 *   x=2    first >= 2 is 9         → [2]
 *   x=5    none >= 5, push         → [2, 5]
 *   x=3    first >= 3 is 5         → [2, 3]
 *   x=7    push                    → [2, 3, 7]
 *   x=101  push                    → [2, 3, 7, 101]
 *   x=18   first >= 18 is 101      → [2, 3, 7, 18]
 *   Answer: 4
 *
 * Complexity
 * ──────────
 *   DP baseline:  O(n²) time, O(n) space.
 *   Patience:     O(n log n) time (one binary search per element),
 *                 O(n) space for tails.
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Brute force over all 2^n subsequences: hopeless beyond ~25 elements.
 *   • In the DP, returning dp[n-1] instead of max(dp) is a classic bug — the
 *     best subsequence need not end at the last element ([1, 2, 0] → 2).
 *   • Strictness: use lower bound (first >= x). Upper bound (first > x)
 *     computes the longest NON-decreasing subsequence ([7, 7, 7] → 3).
 *   • `tails` is not an actual LIS (after x=18 above, it's [2, 3, 7, 18],
 *     which happens to be valid, but [2, 5, 3, 1] ends with tails [1, 3] —
 *     not a subsequence, since 1 comes after 3).
 *     To reconstruct a real subsequence, store predecessor indices.
 *   • A segment tree / Fenwick tree over compressed values also gives
 *     O(n log n), but is far more code than the patience method.
 */

/**
 * @param {number[]} nums
 * @returns {number}
 */
export function lengthOfLIS(nums) {
  // tails[L - 1] = smallest tail of any increasing subsequence of length L
  const tails = [];

  for (const x of nums) {
    // Lower bound: first index k with tails[k] >= x.
    let lo = 0;
    let hi = tails.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (tails[mid] < x) lo = mid + 1;
      else hi = mid;
    }
    if (lo === tails.length) tails.push(x); // extends the longest subsequence
    else tails[lo] = x; // same length, smaller tail
  }

  return tails.length;
}
