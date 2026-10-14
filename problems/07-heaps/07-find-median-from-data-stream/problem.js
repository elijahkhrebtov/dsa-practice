/*
 * Title:      Find Median from Data Stream
 * Difficulty: Hard
 * Patterns:   Two Heaps, Design
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * The median of a list of numbers is its middle value once sorted. If the
 * count is even, there is no single middle, so the median is the average of
 * the two middle values.
 *
 *   [2, 3, 4] → 3          [2, 3] → (2 + 3) / 2 = 2.5
 *
 * Implement the `MedianFinder` class, which receives numbers one at a time
 * and can report the median of everything received so far at any moment:
 *
 *   • new MedianFinder()   creates an empty structure.
 *   • addNum(num)          adds the integer `num`.
 *   • findMedian()         returns the median of all numbers added so far,
 *                          as a number (it may be fractional, e.g. 2.5).
 *
 * findMedian() is only called after at least one addNum().
 *
 * You may import `PriorityQueue` from `../../../lib/priority-queue.js` (or
 * use your own heap from problem 01).
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     const m = new MedianFinder();
 *     m.addNum(1);
 *     m.addNum(2);
 *     m.findMedian();   // 1.5   ([1, 2])
 *     m.addNum(3);
 *     m.findMedian();   // 2     ([1, 2, 3])
 *
 *   Example 2
 *     const m = new MedianFinder();
 *     m.addNum(5);
 *     m.findMedian();   // 5
 *     m.addNum(-5);
 *     m.findMedian();   // 0     ([-5, 5])
 *     m.addNum(5);
 *     m.findMedian();   // 5     ([-5, 5, 5])
 *
 *   Example 3
 *     Numbers arrive in any order: adding 6, 10, 2, 6, 5, 0 and asking for
 *     the median after each gives 6, 8, 6, 6, 6, 5.5.
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • -10^5 <= num <= 10^5
 *   • Up to 5 · 10^4 calls in total (the performance test does 25,000 of
 *     each, alternating).
 *   • findMedian is never called on an empty structure.
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   addNum in O(log n), findMedian in O(1). Sorting the numbers on every call
 *   is O(n log n) per call and fails the performance test.
 *
 *   Follow-ups: if every number were in [0, 100], how would you do it? What
 *   if 99% of them were?
 */

// ▶ Run tests:   npm run solve find-median-from-data-stream
// ⟳ Watch mode:  npm run watch find-median-from-data-stream

/**
 * Maintains the running median of a stream of integers.
 */
export class MedianFinder {
  /**
   * Creates an empty structure.
   */
  constructor() {
    // Your code here
  }

  /**
   * Adds a number from the stream.
   *
   * @param {number} num - The integer to add.
   * @returns {void}
   */
  addNum(num) {
    // Your code here
  }

  /**
   * Returns the median of all numbers added so far.
   *
   * @returns {number} The middle value, or the average of the two middle values for an even count.
   */
  findMedian() {
    // Your code here
  }
}
