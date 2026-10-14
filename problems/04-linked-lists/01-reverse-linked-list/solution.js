/*
 * Title:      Reverse Linked List
 * Difficulty: Easy
 * Patterns:   In-place Reversal
 *
 * Solution — Reverse Linked List
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * Reversing a list means flipping every arrow: if A → B, afterwards B → A.
 * We can flip the arrows one at a time while walking from the head, as long
 * as we keep two things in hand:
 *   • the node BEFORE the current one (where the arrow should point now),
 *   • the node AFTER the current one (saved before we overwrite `next`,
 *     or we lose the rest of the list).
 * Everything behind us is a fully reversed list; everything ahead is still
 * untouched. Each step moves one node from "ahead" to "behind".
 *
 * Approach (iterative, three pointers)
 * ────────────────────────────────────
 *   1. prev = null, curr = head.
 *   2. While curr is not null:
 *        a. next = curr.next        (remember the rest of the list)
 *        b. curr.next = prev        (flip the arrow)
 *        c. prev = curr; curr = next (advance both)
 *   3. Return prev — the last node we flipped, i.e. the old tail.
 *
 * Starting `prev` at null is what turns the old head into a proper tail.
 *
 * Walkthrough — 1 → 2 → 3
 * ───────────
 *   start       prev=null  curr=1     reversed: (none)     ahead: 1→2→3
 *   flip 1      prev=1     curr=2     reversed: 1→null     ahead: 2→3
 *   flip 2      prev=2     curr=3     reversed: 2→1→null   ahead: 3
 *   flip 3      prev=3     curr=null  reversed: 3→2→1→null
 *   return 3
 *
 * Complexity
 * ──────────
 *   Time:  O(n) — each node is visited once.
 *   Space: O(1) — three pointers, no matter how long the list is.
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Recursive: reverse the rest of the list first, then hook the current
 *     node behind its old successor:
 *         function reverseList(head) {
 *           if (head === null || head.next === null) return head;
 *           const newHead = reverseList(head.next);
 *           head.next.next = head;   // the old successor now points back at us
 *           head.next = null;        // we are (for now) the tail
 *           return newHead;
 *         }
 *     Elegant, but it uses O(n) call-stack space. JavaScript engines give you
 *     roughly 10,000 frames, so it crashes with "Maximum call stack size
 *     exceeded" on the 100,000-node test.
 *   • Copying values into an array and writing them back reversed gets the
 *     right values but uses O(n) space and doesn't actually re-link nodes.
 *   • Forgetting `head.next = null` (or starting prev at something other
 *     than null) leaves a 2-node cycle at the end of the list.
 *   • Overwriting `curr.next` before saving it loses the rest of the list.
 */

import { ListNode } from '../../../lib/linked-list.js';

/**
 * @param {ListNode | null} head
 * @returns {ListNode | null}
 */
export function reverseList(head) {
  let prev = null; // head of the already-reversed part
  let curr = head; // first node of the not-yet-reversed part

  while (curr !== null) {
    const next = curr.next; // save the rest before we overwrite the link
    curr.next = prev; // flip the arrow
    prev = curr; // the reversed part grows by one node
    curr = next; // move on
  }

  return prev; // the old tail is the new head (null for an empty list)
}
