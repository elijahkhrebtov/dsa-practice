/*
 * Title:      Kth Largest Element in a Stream
 * Difficulty: Easy
 * Patterns:   Heap, Top-K
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * Numbers arrive one at a time. After each one arrives, report the k-th
 * largest number seen so far, counting duplicates. In the sorted
 * (descending) list of everything seen, that's the element at position k
 * (1-based). It is NOT the k-th largest distinct value.
 *
 * Implement the `KthLargest` class:
 *
 *   • new KthLargest(k, nums)   starts the stream with the numbers in
 *                               `nums` (possibly fewer than k of them, even
 *                               zero). Don't modify `nums`.
 *   • add(val)                  adds `val` to the stream and returns the
 *                               k-th largest number seen so far.
 *
 * It is guaranteed that every call to add() leaves at least k numbers in
 * the stream, so there is always an answer.
 *
 * You may import `PriorityQueue` from `../../../lib/priority-queue.js` (or
 * use your own heap from problem 01).
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     const s = new KthLargest(3, [4, 5, 8, 2]);
 *     s.add(3);    // 4    stream 2 3 4 5 8   → 3rd largest is 4
 *     s.add(5);    // 5    stream 2 3 4 5 5 8 → 3rd largest is 5
 *     s.add(10);   // 5    stream … 5 5 8 10  → 3rd largest is 5
 *     s.add(9);    // 8    stream … 5 8 9 10  → 3rd largest is 8
 *     s.add(4);    // 8
 *
 *   Example 2
 *     const s = new KthLargest(1, []);
 *     s.add(-3);   // -3   (k = 1 means "the maximum so far")
 *     s.add(-5);   // -3
 *     s.add(7);    // 7
 *
 *   Example 3
 *     const s = new KthLargest(2, [0]);
 *     s.add(-1);   // -1   stream -1 0 → 2nd largest is -1
 *     s.add(1);    // 0
 *     s.add(-2);   // 0
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 1 <= k <= 10^4
 *   • 0 <= nums.length <= 10^5
 *   • -10^4 <= nums[i], val <= 10^4
 *   • Up to 10^5 calls to add.
 *   • When add() is called there will be at least k numbers in the stream.
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   O(log k) per add, and O(n log k) for the constructor, using O(k) memory.
 *   Re-sorting the whole stream on every add is far too slow for the
 *   performance test.
 */

// ▶ Run tests:   npm run solve kth-largest-element-in-a-stream
// ⟳ Watch mode:  npm run watch kth-largest-element-in-a-stream

/**
 * Tracks the k-th largest value of a growing stream of numbers.
 */
export class KthLargest {
  /**
   * Starts the stream.
   *
   * @param {number} k - Which largest element to report (1 = the maximum).
   * @param {number[]} nums - Numbers already in the stream (not modified).
   */
  constructor(k, nums) {
    // Your code here
  }

  /**
   * Adds a number to the stream and reports the current k-th largest.
   *
   * @param {number} val - The new number.
   * @returns {number} The k-th largest number among everything added so far.
   */
  add(val) {
    // Your code here
  }
}
