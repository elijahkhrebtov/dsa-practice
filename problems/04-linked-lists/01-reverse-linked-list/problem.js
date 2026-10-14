/*
 * Title:      Reverse Linked List
 * Difficulty: Easy
 * Patterns:   In-place Reversal
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * You are given the `head` of a singly linked list. Reverse the list and
 * return the head of the reversed list.
 *
 *   • Reverse the list by re-pointing the `next` links of the EXISTING
 *     nodes. Don't create new nodes and don't just swap values around —
 *     the tests check that the returned nodes are the original objects.
 *   • An empty list (`head === null`) reverses to an empty list: return null.
 *   • After reversing, the old head is the new tail, so its `next` must be
 *     null (otherwise you've created a cycle).
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  1 → 2 → 3 → 4 → 5
 *     Output: 5 → 4 → 3 → 2 → 1
 *
 *   Example 2
 *     Input:  1 → 2
 *     Output: 2 → 1
 *
 *   Example 3
 *     Input:  (empty list)
 *     Output: (empty list) — return null
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • The number of nodes is in the range [0, 10^5].
 *   • -5000 <= Node.val <= 5000
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   O(n) time and O(1) extra space, iteratively. The tests include a list of
 *   100,000 nodes: a recursive solution needs one stack frame per node and
 *   will crash with "Maximum call stack size exceeded" (JavaScript engines
 *   allow roughly 10,000 frames).
 *
 *   Follow-up: once the iterative version works, write the recursive one
 *   too and convince yourself why it is O(n) space. It will pass every test
 *   except the 100,000-node one.
 */

import { ListNode } from '../../../lib/linked-list.js';

// ▶ Run tests:   npm run solve reverse-linked-list
// ⟳ Watch mode:  npm run watch reverse-linked-list

/**
 * Reverses a singly linked list by re-linking its nodes.
 *
 * @param {ListNode | null} head - Head of the list to reverse (may be null).
 * @returns {ListNode | null} Head of the reversed list (the old tail), or null for an empty list.
 */
export function reverseList(head) {
  // Your code here
}
