/*
 * Title:      Reorder List
 * Difficulty: Medium
 * Patterns:   Fast & Slow Pointers, In-place Reversal
 *
 * Solution — Reorder List
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * The target L0 → Ln → L1 → Ln-1 → … interleaves two sequences:
 *     the first half, read forwards:    L0, L1, L2, …
 *     the second half, read BACKWARDS:  Ln, Ln-1, Ln-2, …
 * Reading backwards is the hard part of a singly linked list. But we're
 * allowed to rewire nodes, so we can simply reverse the second half. After
 * that the job is a plain "zip" of two forward lists. Each step is a
 * standard O(n)-time, O(1)-space technique:
 *   1. find the middle (fast & slow pointers),
 *   2. reverse the second half (in-place reversal),
 *   3. merge the halves alternately.
 *
 * Approach
 * ────────
 *   1. If the list has fewer than 3 nodes there's nothing to do.
 *   2. slow = fast = head; while fast.next && fast.next.next: slow += 1,
 *      fast += 2. Now `slow` is the last node of the first half (the first
 *      half has ⌈n/2⌉ nodes).
 *   3. second = reverse(slow.next); slow.next = null  ← cut, or you get a cycle
 *   4. first = head. While second:
 *        n1 = first.next, n2 = second.next
 *        first.next = second; second.next = n1
 *        first = n1; second = n2
 *      The first half is the same length as the second or one node longer,
 *      so the loop ends with the correct tail already null-terminated.
 *
 * Walkthrough — 1 → 2 → 3 → 4 → 5
 * ───────────
 *   middle:   slow stops at 3 → first half 1 → 2 → 3, second half 4 → 5
 *   reverse:  second = 5 → 4
 *   merge:    1 → 5 → 2 → 3          (first=2, second=4)
 *             1 → 5 → 2 → 4 → 3      (first=3, second=null) → done
 *   3 was cut (3.next = null), so the list ends there.
 *
 * Complexity
 * ──────────
 *   Time:  O(n) — three linear passes (middle, reverse half, merge).
 *   Space: O(1) — a handful of pointers. Nodes are only re-linked.
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Array of nodes: push every node into an array, then use two indices
 *     i (front) and j (back) to re-link. O(n) time, O(n) space. Simple and
 *     acceptable if memory isn't a concern.
 *   • Stack of the second half: same idea, O(n) space.
 *   • Repeatedly walking to the tail and moving it after the current node:
 *     O(n²). For 100,000 nodes that's billions of steps.
 *   • Recursion (passing a "front" pointer back up the call chain) is O(n)
 *     stack and overflows JavaScript's call stack on big lists.
 *   • Forgetting `slow.next = null` leaves the first half still pointing at
 *     the (now reversed) second half's tail, which makes a cycle.
 *   • Choosing the middle so that the SECOND half is longer leaves a node
 *     dangling at the end of the merge loop. With the condition
 *     `fast.next && fast.next.next` the first half is never shorter.
 */

import { ListNode } from '../../../lib/linked-list.js';

/**
 * Reverses a list in place and returns the new head.
 *
 * @param {ListNode | null} head
 * @returns {ListNode | null}
 */
function reverse(head) {
  let prev = null;
  while (head !== null) {
    const next = head.next;
    head.next = prev;
    prev = head;
    head = next;
  }
  return prev;
}

/**
 * @param {ListNode | null} head
 * @returns {void}
 */
export function reorderList(head) {
  if (head === null || head.next === null || head.next.next === null) return;

  // 1. Find the end of the first half (first half gets the extra node when n is odd).
  let slow = head;
  let fast = head;
  while (fast.next !== null && fast.next.next !== null) {
    slow = slow.next;
    fast = fast.next.next;
  }

  // 2. Detach and reverse the second half.
  let second = reverse(slow.next);
  slow.next = null; // cut: the first half now ends at `slow`

  // 3. Zip the halves: first, second, first, second, …
  let first = head;
  while (second !== null) {
    const nextFirst = first.next;
    const nextSecond = second.next;
    first.next = second;
    second.next = nextFirst;
    first = nextFirst;
    second = nextSecond;
  }
}
