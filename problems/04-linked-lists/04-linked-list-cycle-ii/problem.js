/*
 * Title:      Linked List Cycle II
 * Difficulty: Medium
 * Patterns:   Fast & Slow Pointers
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * You are given the `head` of a singly linked list. If the list contains a
 * cycle, return the NODE where the cycle begins: the first node you reach
 * again when following `next` from the head. If there is no cycle, return
 * `null`.
 *
 *   • Return the node object itself, not its value or index. The tests
 *     compare by identity, and different nodes may hold equal values.
 *   • In the examples, `pos` is the index of the node the tail links back
 *     to (-1 means no cycle). `pos` is NOT passed to your function.
 *   • Don't modify the list: no changing `val`/`next`, no adding marker
 *     properties to nodes. The tests check this.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  3 → 2 → 0 → -4
 *                 ↑         │
 *                 └─────────┘        (pos = 1)
 *     Output: the node holding 2 (index 1)
 *
 *   Example 2
 *     Input:  1 → 2
 *             ↑   │
 *             └───┘                  (pos = 0)
 *     Output: the node holding 1 (the head)
 *
 *   Example 3
 *     Input:  1                      (pos = -1)
 *     Output: null
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • The number of nodes is in the range [0, 1.5 * 10^5].
 *   • -10^5 <= Node.val <= 10^5
 *   • pos is -1 or a valid index in the list.
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   O(n) time. A `Set` of visited nodes works with O(n) extra memory. The
 *   tests include 150,000-node lists, so an O(n²) search is too slow.
 *
 *   Follow-up: solve it with O(1) extra memory. Floyd's fast/slow pointers
 *   tell you THAT there's a cycle. A little arithmetic about where they meet
 *   tells you WHERE it starts.
 */

import { ListNode } from '../../../lib/linked-list.js';

// ▶ Run tests:   npm run solve linked-list-cycle-ii
// ⟳ Watch mode:  npm run watch linked-list-cycle-ii

/**
 * Finds the node where a linked list's cycle begins.
 *
 * @param {ListNode | null} head - Head of the list (may be null).
 * @returns {ListNode | null} The first node of the cycle, or null if the list has no cycle.
 */
export function detectCycle(head) {
  // Your code here
}
