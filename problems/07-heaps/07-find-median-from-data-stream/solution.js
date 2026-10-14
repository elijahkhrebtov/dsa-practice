/*
 * Title:      Find Median from Data Stream
 * Difficulty: Hard
 * Patterns:   Two Heaps, Design
 *
 * Solution — Find Median from Data Stream
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * The median only cares about the boundary between the smaller half and the
 * larger half of the numbers. Inside each half, the order doesn't matter at
 * all. So split the numbers into two piles:
 *
 *   low  — the smaller half, as a MAX-heap  (its top is the largest small number)
 *   high — the larger half,  as a MIN-heap  (its top is the smallest large number)
 *
 * Keep every element of low <= every element of high, and keep the sizes
 * balanced: either equal, or low has one extra. Then the median is right
 * at the boundary:
 *   odd count  → low.peek()
 *   even count → (low.peek() + high.peek()) / 2
 *
 * Approach
 * ────────
 *   addNum(num):
 *     1. Push num into low.
 *     2. Move low's top into high. This step restores the ordering: whatever
 *        crosses over is the largest of the lower side, so the invariant
 *        "low <= high" holds even if num belonged in the upper half.
 *     3. If high now has more elements than low, move high's top back to low.
 *   findMedian(): read the tops as described above.
 *
 * Walkthrough — add 6, 10, 2, 6, 5, 0
 * ───────────
 *   add 6:  low {6} → move 6 → high {6} → rebalance → low {6}, high {}     median 6
 *   add 10: low {10,6} → move 10 → high {10}; sizes 1/1                    median (6+10)/2 = 8
 *   add 2:  low {6,2} → move 6 → high {6,10} → rebalance → low {6,2}, high {10}   median 6
 *   add 6:  low {6,6,2} → move 6 → high {6,10}; sizes 2/2                  median (6+6)/2 = 6
 *   add 5:  low {6,5,2} → move 6 → high {6,6,10} → move 6 back → low {6,5,2}, high {6,10}   median 6
 *   add 0:  low {6,5,2,0} → move 6 → high {6,6,10}; low {5,2,0}; sizes 3/3 median (5+6)/2 = 5.5
 *
 * Complexity
 * ──────────
 *   addNum:     O(log n) — a constant number of heap pushes/pops.
 *   findMedian: O(1) — two peeks.
 *   Space:      O(n) — every number is stored once.
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Sort on every findMedian: O(n log n) per call. Sorted array with
 *     binary-search insertion: O(log n) to find the spot, but splice still
 *     shifts O(n) elements per add.
 *   • A balanced BST / order-statistics tree also gives O(log n), but JS has
 *     none built in.
 *   • Follow-up "all numbers in [0, 100]": keep a 101-slot count array plus
 *     the total, and walk the counts to the middle in O(101) = O(1). With
 *     99% in range, add two overflow counters for the < 0 and > 100 outliers
 *     (the median almost surely sits inside the bucketed range).
 *   • Max-heap via comparator (b - a), or push -x into a min-heap. Mixing
 *     up which heap is which is the most common bug.
 *   • Use `/ 2`, not `>> 1`, for the average. Halves are real answers
 *     (2.5), and `>> 1` rounds negative values the wrong way too.
 *   • Inserting into low or high based only on the sizes, without comparing
 *     against the tops, breaks the low <= high ordering. The
 *     "push to low, move the top over" dance avoids that case analysis.
 */
import { PriorityQueue } from '../../../lib/priority-queue.js';

export class MedianFinder {
  constructor() {
    /** smaller half — max-heap; may hold one more element than `high` */
    this.low = new PriorityQueue((a, b) => b - a);
    /** larger half — min-heap */
    this.high = new PriorityQueue((a, b) => a - b);
  }

  /** @param {number} num */
  addNum(num) {
    this.low.push(num);
    // The largest of the lower half crosses over: keeps every low <= every high.
    this.high.push(/** @type {number} */ (this.low.pop()));
    // Keep sizes balanced, with any extra element living in `low`.
    if (this.high.size > this.low.size) this.low.push(/** @type {number} */ (this.high.pop()));
  }

  /** @returns {number} */
  findMedian() {
    const lowTop = /** @type {number} */ (this.low.peek());
    if (this.low.size > this.high.size) return lowTop; // odd count
    return (lowTop + /** @type {number} */ (this.high.peek())) / 2; // even count
  }
}
