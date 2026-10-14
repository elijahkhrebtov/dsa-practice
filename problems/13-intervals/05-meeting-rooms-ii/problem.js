/*
 * Title:      Meeting Rooms II
 * Difficulty: Medium
 * Patterns:   Intervals, Heap, Sweep Line
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * You are given an array of meeting time intervals, where
 * intervals[i] = [start_i, end_i]. Return the minimum number of conference
 * rooms needed to hold all the meetings, with no two meetings in the same
 * room at the same time.
 *
 *   • Meetings are HALF-OPEN: [start, end) is over at exactly `end`. A room
 *     freed at time 10 can host a meeting that starts at 10.
 *   • An empty list needs 0 rooms.
 *   • The intervals are not sorted. You may reorder the input array
 *     (sorting it in place is fine).
 *
 * Equivalently: the answer is the largest number of meetings in progress
 * at any single moment.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  intervals = [[0, 30], [5, 10], [15, 20]]
 *     Output: 2
 *     Why:    [0, 30] needs a room the whole time. [5, 10] and [15, 20]
 *             don't overlap each other, so they can share a second room.
 *
 *   Example 2
 *     Input:  intervals = [[7, 10], [2, 4]]
 *     Output: 1
 *
 *   Example 3
 *     Input:  intervals = [[1, 5], [5, 10], [10, 15]]
 *     Output: 1
 *     Why:    Each meeting starts exactly when the previous one ends, so
 *             one room is reused.
 *
 *   Example 4
 *     Input:  intervals = [[1, 10], [2, 7], [3, 19], [8, 12], [10, 20], [11, 30]]
 *     Output: 4
 *     Why:    At time 11, [3, 19], [8, 12], [10, 20] and [11, 30] are all
 *             in progress. ([1, 10] ended at 10, just in time.)
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 0 <= intervals.length <= 10^4 (the performance test uses 100,000)
 *   • 0 <= start_i < end_i <= 10^6
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   O(n log n) time. Comparing every meeting with every other meeting, or
 *   scanning all open rooms for a free one each time, is too slow for the
 *   performance test (100,000 meetings needing about 40,000 rooms).
 *   `PriorityQueue` from lib/priority-queue.js is available if you want a
 *   heap:  import { PriorityQueue } from '../../../lib/priority-queue.js';
 */

// ▶ Run tests:   npm run solve meeting-rooms-ii
// ⟳ Watch mode:  npm run watch meeting-rooms-ii

/**
 * Computes the minimum number of rooms needed to schedule all meetings.
 *
 * @param {number[][]} intervals - Meetings as half-open `[start, end]` pairs, in any order (may be reordered).
 * @returns {number} The minimum number of rooms (0 for no meetings).
 */
export function minMeetingRooms(intervals) {
  // Your code here
}
