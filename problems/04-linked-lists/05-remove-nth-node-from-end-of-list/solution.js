/*
 * Title:      Remove Nth Node From End of List
 * Difficulty: Medium
 * Patterns:   Two Pointers, Dummy Node
 *
 * Solution — Remove Nth Node From End of List
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * Deleting a node from a singly linked list means changing its PREDECESSOR's
 * `next`. So we need the node just before the target, which is the (n+1)-th
 * node from the end.
 *
 * "k-th from the end" is easy with two pointers a fixed distance apart:
 * put `fast` n nodes ahead of `slow` and move them together. When `fast`
 * is on the last node, `slow` is n nodes behind it, i.e. right before the
 * n-th node from the end.
 *
 * Removing the head is the special case: it has no predecessor. A dummy
 * node in front of the head gives it one, so the same code handles every
 * position, and `dummy.next` is the correct answer even when the head is
 * removed or the list becomes empty.
 *
 * Approach (one pass)
 * ───────────────────
 *   1. dummy = new ListNode(0, head); fast = slow = dummy.
 *   2. Move fast forward n steps.
 *   3. While fast.next !== null: fast = fast.next; slow = slow.next.
 *   4. slow.next = slow.next.next   (unlink the target)
 *   5. Return dummy.next.
 *
 * Walkthrough — 1 → 2 → 3 → 4 → 5, n = 2
 * ───────────
 *   D → 1 → 2 → 3 → 4 → 5          (D = dummy)
 *   after step 2:  slow=D, fast=2   (fast is n=2 nodes ahead)
 *   step 3:        slow=1, fast=3
 *                  slow=2, fast=4
 *                  slow=3, fast=5   ← fast.next is null, stop
 *   step 4:        3.next = 5       → D → 1 → 2 → 3 → 5
 *   return 1 → 2 → 3 → 5
 *
 *   With n = 5 (remove the head): fast ends on 5 after 5 steps, slow stays
 *   at D, and D.next = 2. dummy.next is the new head 2.
 *
 * Complexity
 * ──────────
 *   Time:  O(sz) — fast walks the list once, slow follows.
 *   Space: O(1) — one dummy node and two pointers.
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Two passes: count the length L, then walk L − n steps from the dummy.
 *     Same O(sz) time. It reads the list twice, which is the only difference.
 *   • Copying nodes into an array gives O(1) access to the predecessor
 *     (arr[L − n − 1]) but costs O(sz) extra memory.
 *   • Recursion that counts positions on the way back works for short lists
 *     but uses O(sz) stack and overflows for 100,000 nodes.
 *   • Without a dummy, removing the head (n = length) needs a special case.
 *     It's the most common bug in this problem.
 *   • Off-by-one: stopping when `fast === null` instead of `fast.next ===
 *     null` puts slow ON the target instead of before it (unless fast
 *     starts one step further ahead).
 */

import { ListNode } from '../../../lib/linked-list.js';

/**
 * @param {ListNode | null} head
 * @param {number} n
 * @returns {ListNode | null}
 */
export function removeNthFromEnd(head, n) {
  const dummy = new ListNode(0, head); // gives the head a predecessor
  let fast = dummy;
  let slow = dummy;

  // Open a gap of exactly n nodes between fast and slow.
  for (let i = 0; i < n; i++) fast = fast.next;

  // Move together until fast is on the last node; slow is then just before the target.
  while (fast.next !== null) {
    fast = fast.next;
    slow = slow.next;
  }

  slow.next = slow.next.next; // unlink the n-th node from the end
  return dummy.next; // correct even when the old head was removed
}
