/*
 * Title:      Linked List Cycle
 * Difficulty: Easy
 * Patterns:   Fast & Slow Pointers
 *
 * Solution — Linked List Cycle
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * If the list has no cycle, walking it ends at null. If it has one, the walk
 * never ends, so "walk until null" alone can't give a `true` answer. We need
 * to notice that we're going around in circles.
 *
 * Floyd's "tortoise and hare": send two pointers down the list, `slow`
 * moving one node per step and `fast` moving two.
 *   • No cycle: `fast` reaches the end first, and we return false.
 *   • Cycle: both pointers eventually enter the loop. Once they're both in
 *     it, the gap between them (measured along the loop) shrinks by exactly
 *     one node per step, because fast gains one node on slow each time. A
 *     gap that shrinks by 1 must hit 0, so they land on the same node. Fast
 *     can't jump over slow.
 *
 * Approach
 * ────────
 *   1. slow = head, fast = head.
 *   2. While fast !== null and fast.next !== null:
 *        slow = slow.next; fast = fast.next.next
 *        if slow === fast → return true
 *   3. Return false (fast fell off the end).
 *
 * Walkthrough — 3 → 2 → 0 → -4 → (back to 2)
 * ───────────
 *   start   slow=3   fast=3
 *   step 1  slow=2   fast=0
 *   step 2  slow=0   fast=2     (fast went -4 → 2)
 *   step 3  slow=-4  fast=-4    → same node, return true
 *
 * Complexity
 * ──────────
 *   Time:  O(n) — before the meeting, slow takes at most (tail length +
 *          cycle length) steps, which is ≤ n.
 *   Space: O(1) — two pointers.
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Hash set of visited nodes: walk the list, return true if the current
 *     node is already in the Set. O(n) time but O(n) extra memory. A Set
 *     compares objects by identity, which is what we want.
 *   • Keeping visited nodes in an array and checking with `includes` is
 *     O(n) per check, O(n²) overall: too slow for 150,000 nodes.
 *   • Comparing VALUES instead of nodes (`slow.val === fast.val`) reports a
 *     false cycle on lists like 1 → 1 → 1.
 *   • Marking nodes (setting `node.visited = true` or overwriting `val`)
 *     works but destroys the caller's data. Don't modify input you don't own.
 *   • Reading `fast.next.next` without checking `fast.next` first throws a
 *     TypeError on even-length lists without a cycle.
 */

import { ListNode } from '../../../lib/linked-list.js';

/**
 * @param {ListNode | null} head
 * @returns {boolean}
 */
export function hasCycle(head) {
  let slow = head;
  let fast = head;

  // fast must have two more nodes ahead of it to take a double step.
  while (fast !== null && fast.next !== null) {
    slow = slow.next; // 1 step
    fast = fast.next.next; // 2 steps
    if (slow === fast) return true; // fast lapped slow → there's a loop
  }

  return false; // fast reached the end of the list
}
