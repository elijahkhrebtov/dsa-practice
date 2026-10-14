/*
 * Title:      K Closest Points to Origin
 * Difficulty: Medium
 * Patterns:   Heap, Top-K
 *
 * Solution — K Closest Points to Origin
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * This is "top-k" with a custom key: the k SMALLEST squared distances. (The
 * square root is monotonic, so comparing x² + y² gives the same order and
 * stays in exact integer arithmetic.)
 *
 * To keep the k smallest, keep a MAX-heap of size k. Its root is the
 * farthest of the current candidates, the one to evict when something
 * closer shows up. It's the mirror image of "k largest → min-heap".
 *
 * Approach
 * ────────
 *   1. Max-heap of [dist², point], ordered by dist² descending.
 *   2. For each point:
 *        • if the heap has fewer than k items, push it;
 *        • else if its dist² < root's dist², pop the root and push it;
 *        • else skip it (it can't be among the k closest).
 *   3. The heap now holds exactly the k closest; return their points.
 *
 * Walkthrough — points = [[3, 3], [5, -1], [-2, 4]], k = 2
 * ───────────
 *   [3, 3]  d=18 → heap {18}
 *   [5,-1]  d=26 → heap {26, 18}           (root 26, the farthest)
 *   [-2,4]  d=20 → 20 < 26 → pop 26, push → heap {20, 18}
 *   result: [[3, 3], [-2, 4]] (in heap order)
 *
 * Complexity
 * ──────────
 *   Time:  O(n log k) — each point does at most one pop and one push on a
 *          heap of size k.
 *   Space: O(k) for the heap (plus the output).
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Sort all points by distance and slice: O(n log n). Short and fine
 *     in practice.
 *   • Quickselect on distances: O(n) average, O(1) extra. Partition around a
 *     random pivot distance until the first k slots hold the k closest. Do
 *     it on a copy or an index array, because the input must stay intact.
 *   • A MIN-heap of all n points followed by k pops is O(n + k log n) with
 *     heapify. That's valid, but it uses O(n) memory, versus O(k) for the
 *     max-heap.
 *   • Wrong metric: |x| + |y| (Manhattan) or max(|x|, |y|) give different
 *     orders. Use x² + y².
 *   • Math.sqrt works but introduces floating point for no reason.
 *   • Returning copies vs. the original [x, y] arrays: either is fine here
 *     as long as the coordinates match.
 */
import { PriorityQueue } from '../../../lib/priority-queue.js';

/**
 * @param {number[][]} points
 * @param {number} k
 * @returns {number[][]}
 */
export function kClosest(points, k) {
  // Max-heap by squared distance: the root is the farthest of the current k candidates.
  const heap = new PriorityQueue((a, b) => b[0] - a[0]);

  for (const p of points) {
    const d = p[0] * p[0] + p[1] * p[1];
    if (heap.size < k) {
      heap.push([d, p]);
    } else if (d < heap.peek()[0]) {
      heap.pop(); // evict the farthest candidate
      heap.push([d, p]);
    }
  }

  const result = [];
  while (!heap.isEmpty()) result.push(heap.pop()[1]);
  return result;
}
