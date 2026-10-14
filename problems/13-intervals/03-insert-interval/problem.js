/*
 * Title:      Insert Interval
 * Difficulty: Medium
 * Patterns:   Intervals
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * You are given an array `intervals` of non-overlapping intervals
 * [start_i, end_i], sorted in ascending order by start, and one more
 * interval `newInterval = [start, end]`.
 *
 * Insert `newInterval` into `intervals` so that the result is still sorted
 * by start and still has no overlapping intervals, merging wherever
 * necessary. Return the result.
 *
 *   • Intervals are CLOSED: touching intervals ([1, 5] and [5, 7]) overlap
 *     and must be merged into [1, 7].
 *   • The input intervals don't overlap or touch each other.
 *   • Do NOT modify `intervals`, its inner arrays, or `newInterval`.
 *     Return a new array of new [start, end] arrays.
 *   • `intervals` may be empty. Then the answer is [newInterval] (as a copy).
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  intervals = [[1, 3], [6, 9]], newInterval = [2, 5]
 *     Output: [[1, 5], [6, 9]]
 *
 *   Example 2
 *     Input:  intervals = [[1, 2], [3, 5], [6, 7], [8, 10], [12, 16]],
 *             newInterval = [4, 8]
 *     Output: [[1, 2], [3, 10], [12, 16]]
 *     Why:    [4, 8] overlaps [3, 5], [6, 7] and touches [8, 10]. All four
 *             become [3, 10].
 *
 *   Example 3
 *     Input:  intervals = [[1, 2], [10, 12]], newInterval = [4, 6]
 *     Output: [[1, 2], [4, 6], [10, 12]]
 *     Why:    Nothing to merge. It just slots into the gap.
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 0 <= intervals.length <= 10^4 (the performance test uses 200,000)
 *   • 0 <= start_i <= end_i <= 10^5 (the performance test goes up to 2·10^6)
 *   • intervals is sorted by start and has no overlapping/touching pairs.
 *   • 0 <= newInterval[0] <= newInterval[1]
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   O(n) time: the input is already sorted, so don't sort again. The tests
 *   make the built-in sort throw. O(n) extra space for the output.
 */

// ▶ Run tests:   npm run solve insert-interval
// ⟳ Watch mode:  npm run watch insert-interval

/**
 * Inserts an interval into a sorted list of disjoint intervals, merging where needed.
 *
 * @param {number[][]} intervals - Disjoint closed intervals sorted by start. Not modified.
 * @param {number[]} newInterval - The closed interval `[start, end]` to insert. Not modified.
 * @returns {number[][]} A new sorted array of disjoint intervals that covers the input plus `newInterval`.
 */
export function insert(intervals, newInterval) {
  // Your code here
}
