/*
 * Title:      Non-overlapping Intervals
 * Difficulty: Medium
 * Patterns:   Intervals, Greedy
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * Given an array of intervals where intervals[i] = [start_i, end_i], return
 * the MINIMUM number of intervals you need to remove so that the remaining
 * intervals don't overlap each other.
 *
 *   • Intervals are HALF-OPEN here: touching intervals such as [1, 2] and
 *     [2, 3] do NOT overlap and can both stay.
 *   • Return only the count, not which intervals to remove.
 *   • The input is in no particular order. You may reorder the input array
 *     (sorting it in place is fine).
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  intervals = [[1, 2], [2, 3], [3, 4], [1, 3]]
 *     Output: 1
 *     Why:    Remove [1, 3]. The rest, [1, 2], [2, 3], [3, 4], only touch.
 *
 *   Example 2
 *     Input:  intervals = [[1, 2], [1, 2], [1, 2]]
 *     Output: 2
 *     Why:    Identical intervals overlap, so only one copy can stay.
 *
 *   Example 3
 *     Input:  intervals = [[1, 100], [11, 22], [1, 11], [2, 12]]
 *     Output: 2
 *     Why:    Keep [1, 11] and [11, 22] and remove the other two. Keeping
 *             the long [1, 100] would force removing all three others.
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 1 <= intervals.length <= 10^5 (the performance test uses 50,000)
 *   • intervals[i].length === 2
 *   • -5 * 10^4 <= start_i < end_i <= 5 * 10^4
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   O(n log n) time. An O(n²) dynamic program ("longest chain of
 *   non-overlapping intervals") is correct but too slow for the
 *   performance test. There is a much simpler greedy.
 */

// ▶ Run tests:   npm run solve non-overlapping-intervals
// ⟳ Watch mode:  npm run watch non-overlapping-intervals

/**
 * Counts the fewest intervals to remove so that no two remaining intervals overlap.
 *
 * @param {number[][]} intervals - Half-open intervals `[start, end]` in any order (may be reordered).
 * @returns {number} The minimum number of removals (touching intervals do not count as overlapping).
 */
export function eraseOverlapIntervals(intervals) {
  // Your code here
}
