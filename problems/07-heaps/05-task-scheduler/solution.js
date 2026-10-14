/*
 * Title:      Task Scheduler
 * Difficulty: Medium
 * Patterns:   Greedy, Heap
 *
 * Solution — Task Scheduler
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * Labels don't matter, only how many copies each label has. Idle time
 * happens when we run out of DIFFERENT labels to fill a cooldown window. So
 * the scarce resource is variety, and the label with the most remaining
 * copies is the one most likely to force idling later. The greedy rule is
 * therefore: whenever you have a choice, run the available label with the
 * MOST remaining copies. A max-heap of counts gives exactly that.
 *
 * Approach 1 — greedy simulation in rounds (implemented below)
 * ──────────────────────────────────────────────────────────
 * Think in rounds of n + 1 slots. Within one round, no label can repeat, and
 * after it every label that ran is available again.
 *   1. Count each label and push the counts into a max-heap.
 *   2. While the heap is not empty:
 *        a. Pop up to n + 1 counts (distinct labels, most frequent first)
 *           and run each one once.
 *        b. Push back every count that is still > 0.
 *        c. If the heap is now empty, this was the last round. It costs
 *           only the number of tasks run (no trailing idle). Otherwise it
 *           costs the full n + 1 (unused slots are idle).
 *   Each round jumps over its idle units in O(1), so even 10^5 copies of 'A'
 *   with n = 100 take 10^5 cheap rounds, not 10^7 single steps.
 *
 * Approach 2 — the counting formula (O(T), no heap)
 * ──────────────────────────────────────────────────
 * Let maxCount be the highest frequency and tied the number of labels that
 * have it. Lay out the most frequent label as a skeleton:
 *
 *     A . . | A . . | A . . | A          (maxCount = 4, n = 2)
 *
 * That's (maxCount - 1) full blocks of n + 1 slots, plus a final block that
 * holds one copy of each tied label. Every other task fits into the gaps
 * without breaking the cooldown. If there are more tasks than gaps, you just
 * widen the blocks and there's no idle time at all. So:
 *
 *     answer = max(tasks.length, (maxCount - 1) * (n + 1) + tied)
 *
 * Walkthrough — tasks = A A A B B B, n = 2
 * ───────────
 *   heap {A:3, B:3}
 *   round 1: run A, B (1 slot idle) → {A:2, B:2}, heap non-empty → time 3
 *   round 2: run A, B               → {A:1, B:1}                  → time 6
 *   round 3: run A, B               → heap empty, last round: +2  → time 8
 *   Formula: max(6, (3 - 1) · 3 + 2) = 8 ✓
 *
 * Complexity
 * ──────────
 *   Simulation: each round runs at least one task, so there are at most T
 *               rounds, each costing O(min(n + 1, 26) · log 26). Since the
 *               alphabet is fixed, that's O(T) time and O(1) space.
 *   Formula:    O(T) to count, O(1) space.
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Stepping through time one unit at a time works, but the answer can be
 *     ~10^7 units (10^5 'A's, n = 100) while T is only 10^5.
 *   • Forgetting the max(tasks.length, …) in the formula. With lots of
 *     variety there's no idle time, and the skeleton under-counts.
 *   • Forgetting that ties for maxCount all spill into the last block
 *     (+ tied, not + 1).
 *   • Counting idle units after the very last task. The final round costs
 *     only what it actually ran.
 *   • Picking labels alphabetically or round-robin instead of by remaining
 *     count can leave a big pile of one label at the end, which forces idling.
 */
import { PriorityQueue } from '../../../lib/priority-queue.js';

/**
 * @param {string[]} tasks
 * @param {number} n
 * @returns {number}
 */
export function leastInterval(tasks, n) {
  const counts = new Array(26).fill(0);
  for (const t of tasks) counts[t.charCodeAt(0) - 65]++;

  const heap = new PriorityQueue((a, b) => b - a); // max-heap of remaining counts
  for (const c of counts) if (c > 0) heap.push(c);

  let time = 0;
  while (!heap.isEmpty()) {
    const ranThisRound = [];
    // Fill one round of n + 1 slots with distinct labels, most frequent first.
    for (let slot = 0; slot < n + 1 && !heap.isEmpty(); slot++) {
      ranThisRound.push(/** @type {number} */ (heap.pop()) - 1);
    }
    for (const left of ranThisRound) if (left > 0) heap.push(left);

    // Last round: no trailing idle. Otherwise the whole round elapses.
    time += heap.isEmpty() ? ranThisRound.length : n + 1;
  }
  return time;
}
