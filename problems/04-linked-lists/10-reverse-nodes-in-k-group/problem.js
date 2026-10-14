/*
 * Title:      Reverse Nodes in k-Group
 * Difficulty: Hard
 * Patterns:   In-place Reversal
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * You are given the `head` of a singly linked list and a positive integer
 * `k`. Split the list into consecutive groups of `k` nodes, starting from
 * the head, and reverse the order of the nodes inside every complete group.
 * Return the head of the modified list.
 *
 *   • If the number of nodes at the end is less than k, that last partial
 *     group stays in its original order. (So if k > length, nothing changes.)
 *   • Only re-link nodes. Don't change any node's `val` and don't create
 *     new nodes. The tests check node identity.
 *   • k = 1 leaves the list unchanged.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  1 → 2 → 3 → 4 → 5, k = 2
 *     Output: 2 → 1 → 4 → 3 → 5
 *     Why:    groups [1 2] [3 4] [5]; the last group has fewer than 2 nodes.
 *
 *   Example 2
 *     Input:  1 → 2 → 3 → 4 → 5, k = 3
 *     Output: 3 → 2 → 1 → 4 → 5
 *     Why:    groups [1 2 3] [4 5]; only the first group is complete.
 *
 *   Example 3
 *     Input:  1 → 2 → 3 → 4 → 5 → 6, k = 3
 *     Output: 3 → 2 → 1 → 6 → 5 → 4
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • The number of nodes n is in the range [1, 10^5].
 *   • 1 <= k <= 10^5
 *   • 0 <= Node.val <= 1000
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   O(n) time and O(1) extra space. Every node is visited a constant number
 *   of times, and nothing besides a few pointers is stored. The tests use
 *   100,000-node lists with k = 2, so a recursive "reverse the first group,
 *   recurse on the rest" solution (n/k = 50,000 nested calls) overflows the
 *   call stack. Copying nodes or values into an array is O(n) extra space
 *   and doesn't count.
 */

import { ListNode } from '../../../lib/linked-list.js';

// ▶ Run tests:   npm run solve reverse-nodes-in-k-group
// ⟳ Watch mode:  npm run watch reverse-nodes-in-k-group

/**
 * Reverses the nodes of a linked list k at a time, leaving a final partial group as it is.
 *
 * @param {ListNode | null} head - Head of a non-empty list.
 * @param {number} k - Group size (k >= 1).
 * @returns {ListNode | null} Head of the modified list.
 */
export function reverseKGroup(head, k) {
  // Your code here
}
