/*
 * Title:      Merge Intervals
 * Difficulty: Medium
 * Patterns:   Intervals, Sorting
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * Given an array of intervals where intervals[i] = [start_i, end_i], merge
 * every group of overlapping intervals into one interval covering the whole
 * group. Return the resulting non-overlapping intervals.
 *
 *   • Intervals are CLOSED here: [1, 4] and [4, 5] share the point 4, so
 *     they overlap and merge into [1, 5].
 *   • Merging is transitive: if A overlaps B and B overlaps C, all three
 *     become one interval even if A and C don't touch.
 *   • Return the merged intervals sorted by start, ascending.
 *   • Do NOT modify the input: neither reorder `intervals` nor change any
 *     of its inner [start, end] arrays. Return new arrays.
 *   • An empty input returns [].
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  intervals = [[1, 3], [2, 6], [8, 10], [15, 18]]
 *     Output: [[1, 6], [8, 10], [15, 18]]
 *     Why:    [1, 3] and [2, 6] overlap, so they become [1, 6].
 *
 *   Example 2
 *     Input:  intervals = [[1, 4], [4, 5]]
 *     Output: [[1, 5]]
 *     Why:    Touching intervals merge.
 *
 *   Example 3
 *     Input:  intervals = [[4, 7], [1, 4], [9, 9], [2, 3]]
 *     Output: [[1, 7], [9, 9]]
 *     Why:    Unsorted input. [2, 3] lies inside [1, 4], which touches
 *             [4, 7]. [9, 9] is a single point.
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 0 <= intervals.length <= 10^4 (the performance test uses 30,000)
 *   • intervals[i].length === 2
 *   • 0 <= start_i <= end_i <= 10^4 (the performance test goes up to 1.5·10^5)
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   O(n log n) time (dominated by sorting) and O(n) extra space for the
 *   copy and the output. Repeatedly scanning for any pair that can still be
 *   merged is O(n²) or worse.
 */

// ▶ Run tests:   npm run solve merge-intervals
// ⟳ Watch mode:  npm run watch merge-intervals

/**
 * Merges all overlapping (or touching) intervals.
 *
 * @param {number[][]} intervals - Closed intervals `[start, end]` in any order. Not modified.
 * @returns {number[][]} New array of disjoint merged intervals, sorted by start.
 */
export function merge(intervals) {
  // Your code here
}
