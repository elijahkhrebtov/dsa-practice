/*
 * Title:      Meeting Rooms
 * Difficulty: Easy
 * Patterns:   Intervals, Sorting
 *
 * Solution — Meeting Rooms
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * Checking every pair is O(n²). Ordering the meetings by start time makes
 * most of those checks unnecessary. Once sorted, if ANY two meetings
 * overlap, then some two NEIGHBOURS in sorted order overlap too. So it's
 * enough to compare each meeting with the one right before it.
 *
 * Why: suppose j < i (sorted by start) and they overlap, so
 * start_i < end_j. If j and j+1 don't overlap, then end_j <= start_{j+1}.
 * Repeating the argument along j, j+1, …, i shows some adjacent pair must
 * overlap. Equivalently: if every adjacent pair is fine, the meetings form
 * a chain of back-to-back slots and nothing overlaps.
 *
 * Approach
 * ────────
 *   1. Sort the intervals by start.
 *   2. For i = 1 … n-1: if intervals[i][0] < intervals[i-1][1], return
 *      false. (Strict `<`: a meeting starting exactly when the previous one
 *      ends is fine.)
 *   3. Return true.
 *
 * Walkthrough — [[0, 30], [5, 10], [15, 20]]
 * ───────────
 *   sorted: [0,30] [5,10] [15,20]
 *   i=1: starts at 5, previous ends at 30 → 5 < 30 → overlap → false
 *
 *   [[1, 5], [5, 8]]: i=1: 5 < 5? no → true
 *
 * Complexity
 * ──────────
 *   Time:  O(n log n) for the sort, plus an O(n) scan.
 *   Space: O(1) extra beyond the sort (V8's TimSort uses O(n) internally).
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Brute force over all pairs with the overlap test
 *     a[0] < b[1] && b[0] < a[1]: O(n²).
 *   • `<=` instead of `<` treats touching meetings as a conflict. That's
 *     wrong for half-open time ranges.
 *   • `intervals.sort()` without a comparator sorts the pairs as STRINGS
 *     ("10,20" < "5,8"). Always pass (a, b) => a[0] - b[0].
 *   • Sorting by start then comparing only start times (not the previous
 *     END) misses long meetings that swallow later ones.
 */

/**
 * @param {number[][]} intervals
 * @returns {boolean}
 */
export function canAttendMeetings(intervals) {
  intervals.sort((a, b) => a[0] - b[0]); // the problem allows reordering the input

  for (let i = 1; i < intervals.length; i++) {
    // Starting before the previous meeting ends is a clash; starting exactly at its end is fine.
    if (intervals[i][0] < intervals[i - 1][1]) return false;
  }
  return true;
}
