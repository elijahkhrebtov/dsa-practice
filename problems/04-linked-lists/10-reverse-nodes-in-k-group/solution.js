/*
 * Title:      Reverse Nodes in k-Group
 * Difficulty: Hard
 * Patterns:   In-place Reversal
 *
 * Solution — Reverse Nodes in k-Group
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * This is Reverse Linked List applied to one segment at a time, plus careful
 * bookkeeping at the segment boundaries. For each group we need four nodes:
 *
 *     groupPrev → [ first → … → kth ] → groupNext
 *
 *   • groupPrev: the node before the group (its `next` must end up pointing
 *     at the group's NEW first node, which is kth),
 *   • first:     the group's current first node (after reversal it's the
 *     group's last node and must point at groupNext),
 *   • kth:       the group's current last node (becomes the new first),
 *   • groupNext: the node after the group (where the next group starts).
 *
 * A dummy node in front of the head plays the role of groupPrev for the
 * first group, so the new overall head needs no special case.
 *
 * Before reversing, we walk k steps to check that a complete group exists.
 * If we reach null first, the leftover stays as is and we're done.
 *
 * Approach
 * ────────
 *   dummy.next = head; groupPrev = dummy
 *   loop:
 *     1. kth = walk k steps from groupPrev; if null → break
 *     2. groupNext = kth.next
 *     3. Reverse first … kth: prev = groupNext, curr = groupPrev.next;
 *        while curr !== groupNext: next = curr.next; curr.next = prev;
 *        prev = curr; curr = next
 *        (starting prev at groupNext links the old first node to the rest)
 *     4. first = groupPrev.next   (old first, now the group's tail)
 *        groupPrev.next = kth     (attach the reversed group)
 *        groupPrev = first        (move on to the next group)
 *   return dummy.next
 *
 * Walkthrough — 1 → 2 → 3 → 4 → 5, k = 2
 * ───────────
 *   D → 1 → 2 → 3 → 4 → 5
 *   group 1: groupPrev=D, kth=2, groupNext=3
 *            reverse 1,2 with prev starting at 3:  2 → 1 → 3
 *            D.next = 2; groupPrev = 1     D → 2 → 1 → 3 → 4 → 5
 *   group 2: groupPrev=1, kth=4, groupNext=5
 *            reverse 3,4:  4 → 3 → 5;  1.next = 4; groupPrev = 3
 *            D → 2 → 1 → 4 → 3 → 5
 *   group 3: walking 2 steps from 3 hits null after 5 → stop.
 *   return 2 → 1 → 4 → 3 → 5
 *
 * Complexity
 * ──────────
 *   Time:  O(n) — each node is visited once by the k-step check and once by
 *          the reversal. The final partial group is only walked.
 *   Space: O(1) — a dummy node and a few pointers.
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Recursive: reverse the first k nodes, then set the old first node's
 *     next to reverseKGroup(groupNext, k). Short and readable, but it needs
 *     n/k stack frames: O(n/k) space, and for k = 2 on 100,000 nodes it
 *     overflows JavaScript's call stack.
 *   • Collecting nodes (or values) into an array and rebuilding is O(n)
 *     extra space. Writing values back instead of re-linking also breaks
 *     the "don't modify val" rule.
 *   • Counting the total length first (n), then reversing ⌊n/k⌋ groups is
 *     an equally good way to know when to stop.
 *   • Common bugs: linking the previous group to the OLD first node instead
 *     of kth; reversing with prev = null, which cuts the group off from the
 *     rest; reversing the final partial group; forgetting to advance
 *     groupPrev to the group's new tail.
 */

import { ListNode } from '../../../lib/linked-list.js';

/**
 * @param {ListNode | null} head
 * @param {number} k
 * @returns {ListNode | null}
 */
export function reverseKGroup(head, k) {
  const dummy = new ListNode(0, head);
  let groupPrev = dummy; // node just before the current group

  while (true) {
    // 1. Find the k-th node of this group, or stop if fewer than k nodes remain.
    let kth = groupPrev;
    for (let i = 0; i < k && kth !== null; i++) kth = kth.next;
    if (kth === null) break;

    const groupNext = kth.next; // first node after the group

    // 2. Reverse the group in place. Starting prev at groupNext makes the
    //    old first node (the new tail) point at the rest of the list.
    let prev = groupNext;
    let curr = groupPrev.next;
    while (curr !== groupNext) {
      const next = curr.next;
      curr.next = prev;
      prev = curr;
      curr = next;
    }

    // 3. Stitch the reversed group in and move to the next group.
    const first = groupPrev.next; // old first node, now the group's tail
    groupPrev.next = kth; // kth is the group's new first node
    groupPrev = first;
  }

  return dummy.next;
}
