/*
 * Title:      Linked List Cycle II
 * Difficulty: Medium
 * Patterns:   Fast & Slow Pointers
 *
 * Solution — Linked List Cycle II
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * Phase 1 is plain Floyd: slow moves 1 step, fast moves 2. If fast hits
 * null there's no cycle. Otherwise they meet somewhere inside the loop.
 *
 * Phase 2 uses some arithmetic. Let
 *     a = distance from head to the cycle start
 *     b = distance from the cycle start to the meeting point (along the loop)
 *     L = length of the loop
 * At the meeting, slow has walked a + b steps and fast has walked 2(a + b).
 * Both are at the same node, so fast's extra a + b steps were whole laps:
 *     a + b = k·L   for some k ≥ 1    ⟹    a = k·L − b
 * Starting at the meeting point (which is b past the start) and walking a
 * steps puts you at b + (k·L − b) = k·L past the start, which is the start
 * itself. A pointer walking a steps from the head also lands on the start.
 * So: reset one pointer to head, keep the other at the meeting point, step
 * both by one, and they meet exactly at the cycle's first node.
 *
 * Approach
 * ────────
 *   1. slow = fast = head. While fast and fast.next exist:
 *        slow = slow.next; fast = fast.next.next
 *        if slow === fast, break (meeting found).
 *      If the loop ended because fast ran out, return null.
 *   2. p = head, q = meeting node. While p !== q: p = p.next; q = q.next.
 *   3. Return p.
 *
 * Walkthrough — 3 → 2 → 0 → -4 → (back to 2): a = 1, L = 3
 * ───────────
 *   Phase 1:  slow 3,  fast 3
 *             slow 2,  fast 0
 *             slow 0,  fast 2
 *             slow -4, fast -4  → meet at -4   (b = 2, a + b = 3 = 1·L ✓)
 *   Phase 2:  p = 3,  q = -4
 *             p = 2,  q = 2     → equal: return the node holding 2
 *
 * Complexity
 * ──────────
 *   Time:  O(n) — phase 1 takes at most a + L steps, phase 2 takes a steps.
 *   Space: O(1) — just pointers, and the list is never modified.
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Hash set: walk from the head, return the first node already in the
 *     Set. O(n) time, O(n) memory. Very readable, and fine if memory isn't a
 *     concern.
 *   • Returning the meeting node from phase 1: it's inside the loop but
 *     usually not its first node.
 *   • Comparing values instead of nodes breaks on duplicate values.
 *   • Marking visited nodes (extra property, negating val, rewiring next)
 *     modifies the caller's list, which the problem forbids.
 *   • Single-node self-loop: phase 1 meets after one step (slow = fast =
 *     head), phase 2 returns head immediately. Make sure your loop
 *     conditions allow that.
 */

import { ListNode } from '../../../lib/linked-list.js';

/**
 * @param {ListNode | null} head
 * @returns {ListNode | null}
 */
export function detectCycle(head) {
  // Phase 1: find a meeting point inside the loop (or prove there is no loop).
  let slow = head;
  let fast = head;
  let meeting = null;
  while (fast !== null && fast.next !== null) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow === fast) {
      meeting = slow;
      break;
    }
  }
  if (meeting === null) return null; // fast reached the end: no cycle

  // Phase 2: head and the meeting point are the same distance (mod L) from the cycle start.
  let p = head;
  let q = meeting;
  while (p !== q) {
    p = p.next;
    q = q.next;
  }
  return p;
}
