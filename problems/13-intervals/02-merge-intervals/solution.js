/*
 * Title:      Merge Intervals
 * Difficulty: Medium
 * Patterns:   Intervals, Sorting
 *
 * Solution — Merge Intervals
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * In arbitrary order, an interval might overlap anything, which is why
 * pairwise approaches end up O(n²). Sort by start and the picture becomes
 * one-dimensional: merged groups appear one after another, left to right.
 * While we sweep, only the group we're currently building can still grow.
 * Every earlier group ended before the current one began, and everything
 * still to come starts at or after the current interval's start. So each
 * interval either joins the current group (it starts at or before the
 * group's end) or begins a new group.
 *
 * Approach
 * ────────
 *   1. sorted = copy of intervals, sorted by start (never sort the input
 *      itself, since the caller's array must not change).
 *   2. result = []
 *   3. For each [s, e] in sorted:
 *        last = result's last interval
 *        if last exists and s <= last[1]:  last[1] = max(last[1], e)
 *        else:                             result.push([s, e])   ← new array
 *   4. Return result.
 *
 * Walkthrough — [[4, 7], [1, 4], [9, 9], [2, 3]]
 * ───────────
 *   sorted: [1,4] [2,3] [4,7] [9,9]
 *   [1,4]  result empty            → push      [[1,4]]
 *   [2,3]  2 <= 4, max(4,3) = 4     → extend    [[1,4]]   (end must not shrink!)
 *   [4,7]  4 <= 4 (touching)        → extend    [[1,7]]
 *   [9,9]  9 >  7                   → push      [[1,7], [9,9]]
 *
 * Complexity
 * ──────────
 *   Time:  O(n log n) for the sort, plus an O(n) sweep.
 *   Space: O(n) for the sorted copy and the output.
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Brute force: repeatedly find any overlapping pair and merge it until
 *     none is left. O(n²) per pass, O(n³) overall.
 *   • Sweep line / counting: mark +1 at starts and -1 just after ends, then
 *     emit a merged interval every time the running count returns to 0.
 *     Equivalent, but you have to be careful with ties for touching
 *     intervals (starts must come before ends at the same coordinate).
 *   • last[1] = e instead of max(last[1], e) breaks on nested intervals.
 *   • `<` instead of `<=` fails to merge touching intervals like [1,4],[4,5].
 *   • intervals.sort(...) reorders the CALLER's array, and pushing the
 *     original inner array then extending it mutates the caller's interval.
 *     Both are input mutation. Copy first, and push fresh [s, e] arrays.
 *   • `.sort()` without a comparator sorts the pairs as strings.
 */

/**
 * @param {number[][]} intervals
 * @returns {number[][]}
 */
export function merge(intervals) {
  // Sort a shallow copy: the caller's array keeps its order.
  const sorted = [...intervals].sort((a, b) => a[0] - b[0]);
  const result = [];

  for (const [start, end] of sorted) {
    const last = result[result.length - 1];
    if (last !== undefined && start <= last[1]) {
      // Overlaps or touches the current group: extend it (never shrink it).
      last[1] = Math.max(last[1], end);
    } else {
      // Starts after the current group ends: begin a new group with a FRESH array.
      result.push([start, end]);
    }
  }

  return result;
}
