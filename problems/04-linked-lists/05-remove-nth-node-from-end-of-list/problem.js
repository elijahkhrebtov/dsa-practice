/*
 * Title:      Remove Nth Node From End of List
 * Difficulty: Medium
 * Patterns:   Two Pointers, Dummy Node
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * You are given the `head` of a singly linked list and an integer `n`.
 * Remove the n-th node counted from the END of the list (n = 1 is the last
 * node) and return the head of the resulting list.
 *
 *   • Remove the node by re-linking its neighbours. Don't create new nodes
 *     or shift values around. The tests check that every node left in the
 *     list is one of the original objects, in the original order.
 *   • `n` is always valid: 1 <= n <= length of the list.
 *   • Removing the head is allowed (n = length). Then the new head is the
 *     old second node. If the list had a single node, return null.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  1 → 2 → 3 → 4 → 5, n = 2
 *     Output: 1 → 2 → 3 → 5
 *     Why:    counting from the end: 5 is 1st, 4 is 2nd, so 4 is removed.
 *
 *   Example 2
 *     Input:  1, n = 1
 *     Output: (empty list): return null
 *
 *   Example 3
 *     Input:  1 → 2, n = 1
 *     Output: 1
 *
 *   Example 4
 *     Input:  1 → 2, n = 2
 *     Output: 2
 *     Why:    the 2nd node from the end is the head itself.
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • The number of nodes `sz` is in the range [1, 10^5].
 *   • 0 <= Node.val <= 100
 *   • 1 <= n <= sz
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   O(sz) time and O(1) extra space. Counting the length first and then
 *   walking again (two passes) is a fine start.
 *
 *   Follow-up: do it in ONE pass over the list. The tests use lists of up
 *   to 100,000 nodes, so recursive "count on the way back" solutions will
 *   overflow the call stack.
 */

import { ListNode } from '../../../lib/linked-list.js';

// ▶ Run tests:   npm run solve remove-nth-node-from-end-of-list
// ⟳ Watch mode:  npm run watch remove-nth-node-from-end-of-list

/**
 * Removes the n-th node from the end of a linked list.
 *
 * @param {ListNode | null} head - Head of a non-empty list.
 * @param {number} n - Position from the end of the node to remove (1 = last node).
 * @returns {ListNode | null} Head of the list after the removal (null if it became empty).
 */
export function removeNthFromEnd(head, n) {
  // Your code here
}
