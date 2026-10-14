/*
 * Title:      Linked List Cycle
 * Difficulty: Easy
 * Patterns:   Fast & Slow Pointers
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * You are given the `head` of a singly linked list. Return `true` if the
 * list contains a cycle, and `false` otherwise.
 *
 * A list has a cycle when following `next` pointers from the head never
 * reaches `null`, because some node's `next` points back to a node that
 * came earlier in the list (possibly itself).
 *
 *   • In the examples, `pos` is the index of the node the tail links back
 *     to (-1 means no cycle). `pos` is NOT passed to your function. You only
 *     get `head`.
 *   • Don't modify the list: no changing `val`/`next`, no adding marker
 *     properties to nodes. The tests check this.
 *   • Detect the cycle by node identity, not by value: different nodes may
 *     hold equal values.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  3 → 2 → 0 → -4
 *                 ↑         │
 *                 └─────────┘        (pos = 1)
 *     Output: true
 *     Why:    -4's next is the node holding 2, so the walk loops forever.
 *
 *   Example 2
 *     Input:  1 → 2
 *             ↑   │
 *             └───┘                  (pos = 0)
 *     Output: true
 *
 *   Example 3
 *     Input:  1                      (pos = -1)
 *     Output: false
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • The number of nodes is in the range [0, 1.5 * 10^5].
 *   • -10^5 <= Node.val <= 10^5
 *   • pos is -1 or a valid index in the list.
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   O(n) time. Remembering visited nodes in a `Set` gets you there with O(n)
 *   extra memory. The tests include 150,000-node lists, so checking every
 *   node against a growing array of visited nodes (O(n²)) is too slow.
 *
 *   Follow-up: can you do it with O(1) extra memory?
 */

import { ListNode } from '../../../lib/linked-list.js';

// ▶ Run tests:   npm run solve linked-list-cycle
// ⟳ Watch mode:  npm run watch linked-list-cycle

/**
 * Reports whether a singly linked list contains a cycle.
 *
 * @param {ListNode | null} head - Head of the list (may be null).
 * @returns {boolean} `true` if following `next` from `head` never reaches null, `false` otherwise.
 */
export function hasCycle(head) {
  // Your code here
}
