/*
 * Title:      Kth Largest Element in a Stream
 * Difficulty: Easy
 * Patterns:   Heap, Top-K
 *
 * Solution — Kth Largest Element in a Stream
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * We never need to know anything about numbers that are smaller than the
 * current k-th largest. They can never become the answer again, because the
 * stream only grows and the k-th largest can only go up. So keep just the k
 * largest numbers seen so far. The answer is the SMALLEST of those k, and a
 * min-heap gives you its smallest element in O(1).
 *
 * Think of the heap's root as a bouncer at the door of a "top-k club". A
 * newcomer only gets in if it beats the weakest member, who is then thrown
 * out.
 *
 * Approach
 * ────────
 *   1. Create a min-heap.
 *   2. add(val): push val; if the heap now holds more than k items, pop the
 *      smallest. Return the root (heap.peek()).
 *   3. The constructor simply calls the same logic for every number in nums
 *      (without needing a return value). While fewer than k numbers have
 *      arrived, the heap just grows; the problem guarantees it has k items
 *      by the time anyone reads an answer.
 *
 * Walkthrough — k = 3, nums = [4, 5, 8, 2]
 * ───────────
 *   build:   push 4 → {4}; push 5 → {4,5}; push 8 → {4,5,8};
 *            push 2 → {2,4,5,8} → too big, pop 2 → {4,5,8}
 *   add(3):  {3,4,5,8} → pop 3 → {4,5,8}       answer 4
 *   add(5):  {4,5,5,8} → pop 4 → {5,5,8}       answer 5
 *   add(10): {5,5,8,10} → pop 5 → {5,8,10}     answer 5
 *   add(9):  {5,8,9,10} → pop 5 → {8,9,10}     answer 8
 *   add(4):  {4,8,9,10} → pop 4 → {8,9,10}     answer 8
 *
 * Complexity
 * ──────────
 *   Time:  O(log k) per add; O(n log k) for the constructor.
 *   Space: O(k) — the heap never holds more than k + 1 numbers.
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Keep every number and sort on each add: O(n log n) per add. Keeping a
 *     sorted array with binary-search insertion is O(n) per add (shifting).
 *   • A MAX-heap of everything would need k pops (and pushes back) to find
 *     the k-th largest — O(k log n) per add.
 *   • Micro-optimization: when the heap already has k items and val <= root,
 *     skip the push entirely; nothing changes.
 *   • Since values are bounded (|val| <= 10^4), a counting array also works,
 *     but finding the k-th largest is then O(range) per query.
 *   • Use `size > k` (not `>=`) when trimming, or the heap ends up with k - 1
 *     items and you report the (k-1)-th largest.
 */
import { PriorityQueue } from '../../../lib/priority-queue.js';

export class KthLargest {
  /**
   * @param {number} k
   * @param {number[]} nums
   */
  constructor(k, nums) {
    this.k = k;
    /** min-heap holding the k largest numbers seen so far; its root is the answer */
    this.heap = new PriorityQueue((a, b) => a - b);
    for (const n of nums) this.add(n);
  }

  /**
   * @param {number} val
   * @returns {number}
   */
  add(val) {
    const heap = this.heap;
    if (heap.size < this.k) {
      heap.push(val); // still filling up the top-k club
    } else if (val > /** @type {number} */ (heap.peek())) {
      heap.pop(); // the weakest member leaves…
      heap.push(val); // …and the newcomer takes its place
    }
    // (val <= root with a full heap: it can't be in the top k — nothing to do)
    return /** @type {number} */ (heap.peek());
  }
}
