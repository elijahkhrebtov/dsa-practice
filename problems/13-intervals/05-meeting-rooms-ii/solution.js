/*
 * Title:      Meeting Rooms II
 * Difficulty: Medium
 * Patterns:   Intervals, Heap, Sweep Line
 *
 * Solution — Meeting Rooms II
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * Allocate rooms greedily in order of start time. When a meeting starts,
 * reuse a room if any room is free, otherwise open a new one. To know
 * whether ANY room is free, it's enough to look at the room that frees up
 * EARLIEST. If it's still busy, they all are. A min-heap keyed by end
 * time gives that room in O(log n).
 *
 * The greedy uses the minimum number of rooms, because it only opens a new
 * room when every existing room is busy at that instant. At that moment,
 * (rooms + 1) meetings really are in progress at once, and no schedule can
 * use fewer rooms than the peak number of simultaneous meetings.
 *
 * Approach (min-heap of end times)
 * ────────────────────────────────
 *   1. Sort meetings by start.
 *   2. heap = empty min-heap of end times (one entry per room in use).
 *   3. For each [s, e]:
 *        if heap not empty and heap.peek() <= s: heap.pop()  // reuse that room
 *        heap.push(e)
 *   4. Return heap.size. The heap only grows when a new room is opened,
 *      so its final size is the number of rooms ever needed.
 *
 * Walkthrough — [[1,10], [2,7], [3,19], [8,12], [10,20], [11,30]]
 * ───────────
 *   meeting  earliest end  action          heap (end times)
 *   [1,10]   —             new room        {10}
 *   [2,7]    10 > 2        new room        {7, 10}
 *   [3,19]   7 > 3         new room        {7, 10, 19}
 *   [8,12]   7 <= 8        reuse room of 7 {10, 12, 19}
 *   [10,20]  10 <= 10      reuse (touch)   {12, 19, 20}
 *   [11,30]  12 > 11       new room        {12, 19, 20, 30}
 *   → 4 rooms
 *
 * Complexity
 * ──────────
 *   Time:  O(n log n): the sort plus n heap operations of O(log n).
 *   Space: O(n) for the heap in the worst case (all meetings overlap).
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Sweep line with two sorted arrays (also O(n log n), no heap):
 *       starts = sorted starts, ends = sorted ends, j = 0, rooms = 0
 *       for each s in starts:
 *         if ends[j] <= s: j++   (a meeting ended, its room is reused)
 *         else: rooms++          (need a new room)
 *     It works because only the COUNT of busy rooms matters, not which
 *     meeting is in which room.
 *   • Event sweep: +1 at each start, -1 at each end, sorted by time with
 *     ends BEFORE starts at equal times (half-open). Track the peak.
 *   • Brute force: for each meeting start, count the meetings active at
 *     that instant. O(n²).
 *   • Scanning all rooms for a free one is O(n · rooms), which is slow when
 *     many rooms are needed.
 *   • Using `<` instead of `<=` when reusing a room treats back-to-back
 *     meetings as conflicts.
 *   • Sorting by end (as in Non-overlapping Intervals) is the wrong key
 *     here. Rooms must be assigned in start order.
 */

import { PriorityQueue } from '../../../lib/priority-queue.js';

/**
 * @param {number[][]} intervals
 * @returns {number}
 */
export function minMeetingRooms(intervals) {
  intervals.sort((a, b) => a[0] - b[0]); // handle meetings in the order they begin

  const endTimes = new PriorityQueue(); // min-heap: one end time per room in use

  for (const [start, end] of intervals) {
    // The room that frees up first is free by now (touching is fine) → reuse it.
    if (!endTimes.isEmpty() && endTimes.peek() <= start) endTimes.pop();
    endTimes.push(end);
  }

  return endTimes.size;
}
