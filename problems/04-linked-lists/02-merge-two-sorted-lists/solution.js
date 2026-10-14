/*
 * Title:      Merge Two Sorted Lists
 * Difficulty: Easy
 * Patterns:   Dummy Node, Two Pointers
 *
 * Solution — Merge Two Sorted Lists
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * This is the "merge" step of merge sort. The next node of the result is
 * always the smaller of the two current fronts, because each list is already
 * sorted and nothing behind a front can be smaller than it. So we keep one
 * pointer into each list and repeatedly move the smaller front to the end of
 * the result.
 *
 * Building a list by appending has an annoying first step: there's no tail
 * to attach the first node to, and the head isn't known yet. A dummy node
 * fixes that. It acts as a fake head, so "attach to tail" works from the very
 * first node, and the real head is just `dummy.next` at the end.
 *
 * Approach (dummy node + two pointers)
 * ────────────────────────────────────
 *   1. dummy = new ListNode(); tail = dummy.
 *   2. While list1 and list2 are both non-null:
 *        • if list1.val <= list2.val: tail.next = list1; list1 = list1.next
 *        • else:                      tail.next = list2; list2 = list2.next
 *        • tail = tail.next
 *   3. Attach whatever is left: tail.next = list1 ?? list2 (null if both
 *      are exhausted). The leftover is already sorted and terminated.
 *   4. Return dummy.next.
 *
 * Walkthrough — list1 = 1 → 2 → 4, list2 = 1 → 3 → 4
 * ───────────
 *   compare 1 vs 1 → take list1's 1   result: 1
 *   compare 2 vs 1 → take list2's 1   result: 1 → 1
 *   compare 2 vs 3 → take 2           result: 1 → 1 → 2
 *   compare 4 vs 3 → take 3           result: 1 → 1 → 2 → 3
 *   compare 4 vs 4 → take list1's 4   result: 1 → 1 → 2 → 3 → 4
 *   list1 empty → attach list2's rest (4)
 *   result: 1 → 1 → 2 → 3 → 4 → 4
 *
 * Complexity
 * ──────────
 *   Time:  O(n + m) — each node is attached exactly once.
 *   Space: O(1) — only the dummy node and a few pointers. No new list nodes
 *          are created; existing ones are re-linked.
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Recursive version:
 *         if (!list1) return list2;  if (!list2) return list1;
 *         if (list1.val <= list2.val) { list1.next = merge(list1.next, list2); return list1; }
 *         list2.next = merge(list1, list2.next); return list2;
 *     Very clean, but it uses one stack frame per node: O(n + m) space, and
 *     it overflows JavaScript's call stack (~10,000 frames) on the
 *     100,000-node test.
 *   • Collecting all values, sorting and building a new list is
 *     O((n + m) log(n + m)), ignores the fact that the inputs are already
 *     sorted, and creates new nodes instead of splicing.
 *   • Looping only while both lists are non-empty and then forgetting to
 *     attach the leftover tail drops nodes.
 *   • Without a dummy you need special code to pick the head first; it's easy
 *     to get wrong when one list is empty.
 */

import { ListNode } from '../../../lib/linked-list.js';

/**
 * @param {ListNode | null} list1
 * @param {ListNode | null} list2
 * @returns {ListNode | null}
 */
export function mergeTwoLists(list1, list2) {
  const dummy = new ListNode(); // fake head: the result starts at dummy.next
  let tail = dummy; // last node of the result built so far

  while (list1 !== null && list2 !== null) {
    if (list1.val <= list2.val) {
      tail.next = list1;
      list1 = list1.next;
    } else {
      tail.next = list2;
      list2 = list2.next;
    }
    tail = tail.next;
  }

  // At most one list still has nodes; it's sorted and null-terminated already.
  tail.next = list1 ?? list2;

  return dummy.next;
}
