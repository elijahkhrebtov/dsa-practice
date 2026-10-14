/*
 * Title:      Add Two Numbers
 * Difficulty: Medium
 * Patterns:   Simulation, Dummy Node
 *
 * Solution — Add Two Numbers
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * Just simulate grade-school addition. Storing the digits ones-first is
 * convenient: the heads are the ones column, where addition starts, and a
 * carry only ever moves toward the next node. So we walk both lists at the
 * same time, add the digits in each column plus the carry, emit one result
 * digit and pass the carry on.
 *
 * We never build the whole number, so length doesn't matter. Converting to
 * a JS Number fails beyond about 16 digits (2^53), and BigInt would work
 * but misses the point of the exercise.
 *
 * Approach (dummy node + carry)
 * ─────────────────────────────
 *   1. dummy = new ListNode(); tail = dummy; carry = 0.
 *   2. While l1 or l2 or carry:
 *        x = l1 ? l1.val : 0;  y = l2 ? l2.val : 0
 *        sum = x + y + carry
 *        tail.next = new ListNode(sum % 10); tail = tail.next
 *        carry = Math.floor(sum / 10)       (always 0 or 1)
 *        advance l1 and l2 if they aren't null
 *   3. Return dummy.next.
 *
 * Walkthrough — 2 → 4 → 3  +  5 → 6 → 4   (342 + 465)
 * ───────────
 *   column 1:  2 + 5 + 0 = 7   → digit 7, carry 0
 *   column 2:  4 + 6 + 0 = 10  → digit 0, carry 1
 *   column 3:  3 + 4 + 1 = 8   → digit 8, carry 0
 *   both lists done, carry 0 → stop.  Result 7 → 0 → 8  (807)
 *
 * Complexity
 * ──────────
 *   Time:  O(max(m, n)) — one step per column, plus possibly one for the
 *          final carry.
 *   Space: O(1) besides the output list (which has max(m, n) + 1 nodes at
 *          most).
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Convert to Number, add, convert back: wrong for anything over ~16
 *     digits because of floating-point precision.
 *   • Convert to BigInt: correct but slower (string building) and avoids
 *     the actual technique.
 *   • Recursive addition (add(l1.next, l2.next, carry)) is neat but uses
 *     one stack frame per digit and overflows on 100,000-digit inputs.
 *   • Stopping when both lists end but forgetting the carry: 5 + 5 gives 0
 *     instead of 0 → 1.
 *   • Stopping when the SHORTER list ends drops the rest of the longer one.
 *   • Reusing the input nodes to store the sum saves allocations but
 *     changes the caller's lists. Here the problem asks for a new list.
 */

import { ListNode } from '../../../lib/linked-list.js';

/**
 * @param {ListNode | null} l1
 * @param {ListNode | null} l2
 * @returns {ListNode | null}
 */
export function addTwoNumbers(l1, l2) {
  const dummy = new ListNode(); // result starts at dummy.next
  let tail = dummy;
  let carry = 0;

  // Keep going while there are digits left OR a carry still has to be written.
  while (l1 !== null || l2 !== null || carry !== 0) {
    const x = l1 !== null ? l1.val : 0; // a finished list counts as zeros
    const y = l2 !== null ? l2.val : 0;
    const sum = x + y + carry;

    tail.next = new ListNode(sum % 10);
    tail = tail.next;
    carry = Math.floor(sum / 10); // 0 or 1

    if (l1 !== null) l1 = l1.next;
    if (l2 !== null) l2 = l2.next;
  }

  return dummy.next;
}
