/*
 * Title:      Non-overlapping Intervals
 * Difficulty: Medium
 * Patterns:   Intervals, Greedy
 *
 * Solution — Non-overlapping Intervals
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * Minimizing removals = maximizing the number of intervals we KEEP with no
 * two overlapping (answer = n - kept). That's the activity-selection
 * problem, and its greedy is: repeatedly keep the compatible interval that
 * FINISHES FIRST.
 *
 * Why it's safe (exchange argument): take any optimal selection and look
 * at its first interval X. Let G be the interval with the earliest end
 * overall. G ends no later than X, so replacing X with G can't create a
 * conflict with the rest of the selection, which all starts at or after
 * X's end ≥ G's end. So some optimal solution starts with G. Repeat the
 * argument on what's left.
 *
 * Approach
 * ────────
 *   1. Sort by end ascending.
 *   2. lastEnd = -Infinity, removed = 0.
 *   3. For each [s, e]:
 *        if s >= lastEnd: keep it, lastEnd = e    (>= : touching is fine)
 *        else:            removed++                (overlaps the kept one)
 *   4. Return removed.
 *
 * Walkthrough — [[1, 100], [11, 22], [1, 11], [2, 12]]
 * ───────────
 *   sorted by end: [1,11] [2,12] [11,22] [1,100]
 *   [1,11]   1 >= -∞   keep, lastEnd 11
 *   [2,12]   2 < 11    remove (1)
 *   [11,22]  11 >= 11  keep, lastEnd 22   (touching is OK)
 *   [1,100]  1 < 22    remove (2)
 *   → 2
 *
 * Complexity
 * ──────────
 *   Time:  O(n log n) for the sort, plus an O(n) greedy pass.
 *   Space: O(1) extra besides the sort.
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • DP: sort by start, dp[i] = longest chain ending at i = 1 + max dp[j]
 *     over j with end_j <= start_i. O(n²), or O(n log n) with binary search.
 *     Correct, but much more work than the greedy.
 *   • Sort by START with a twist also works: on overlap, keep whichever of
 *     the two ends earlier (lastEnd = min(lastEnd, e)). It's the same
 *     greedy in disguise.
 *   • Plain sort-by-start keeping the first interval is WRONG:
 *     [[1,100],[2,3],[4,5]] would keep [1,100] and remove 2 instead of 1.
 *   • `>` instead of `>=` treats touching intervals as overlapping.
 *   • Starting lastEnd at 0 breaks with negative coordinates. Use -Infinity.
 */

/**
 * @param {number[][]} intervals
 * @returns {number}
 */
export function eraseOverlapIntervals(intervals) {
  intervals.sort((a, b) => a[1] - b[1]); // earliest finish first (reordering the input is allowed)

  let lastEnd = -Infinity; // end of the most recently KEPT interval
  let removed = 0;

  for (const [start, end] of intervals) {
    if (start >= lastEnd) {
      lastEnd = end; // compatible: keep it
    } else {
      removed++; // overlaps the kept one, which ends no later than this one
    }
  }

  return removed;
}
