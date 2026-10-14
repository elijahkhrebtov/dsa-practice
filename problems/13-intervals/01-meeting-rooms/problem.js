/*
 * Title:      Meeting Rooms
 * Difficulty: Easy
 * Patterns:   Intervals, Sorting
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * You are given an array of meeting time intervals, where
 * intervals[i] = [start_i, end_i]. Determine whether one person could
 * attend every meeting, i.e. whether no two meetings overlap in time.
 *
 * Meetings are HALF-OPEN: [start, end) occupies the time from `start` up
 * to, but not including, `end`. So a meeting that ends at 5 and another
 * that starts at 5 do NOT conflict. You can walk straight from one into
 * the other.
 *
 *   • Return `true` if all meetings can be attended, `false` otherwise.
 *   • An empty list (no meetings) or a single meeting → `true`.
 *   • The intervals are not sorted. You may reorder the input array
 *     (sorting it in place is fine).
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  intervals = [[0, 30], [5, 10], [15, 20]]
 *     Output: false
 *     Why:    [5, 10] (and [15, 20]) happen during [0, 30].
 *
 *   Example 2
 *     Input:  intervals = [[7, 10], [2, 4]]
 *     Output: true
 *
 *   Example 3
 *     Input:  intervals = [[1, 5], [5, 8]]
 *     Output: true
 *     Why:    Touching is fine. The first meeting is over at exactly 5.
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 0 <= intervals.length <= 10^4 (the performance test uses 30,000)
 *   • intervals[i].length === 2
 *   • 0 <= start_i < end_i <= 10^6
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   O(n log n) time. Comparing every pair of meetings is O(n²) and too slow
 *   for the performance test.
 */

// ▶ Run tests:   npm run solve meeting-rooms
// ⟳ Watch mode:  npm run watch meeting-rooms

/**
 * Determines whether a person can attend every meeting without any two overlapping.
 *
 * @param {number[][]} intervals - Meetings as half-open `[start, end]` pairs, in any order.
 * @returns {boolean} `true` if no two meetings overlap (touching endpoints are allowed), otherwise `false`.
 */
export function canAttendMeetings(intervals) {
  // Your code here
}
