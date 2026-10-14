/*
 * Title:      Reorder List
 * Difficulty: Medium
 * Patterns:   Fast & Slow Pointers, In-place Reversal
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * You are given the `head` of a singly linked list
 *
 *     L0 → L1 → L2 → … → Ln-1 → Ln
 *
 * Reorder it IN PLACE into
 *
 *     L0 → Ln → L1 → Ln-1 → L2 → Ln-2 → …
 *
 * i.e. take nodes alternately from the front and from the back.
 *
 *   • Modify the list in place and return nothing. The tests read the
 *     result by walking from the ORIGINAL head node (which stays first).
 *   • Only re-link nodes. Don't create new nodes and don't change any
 *     node's `val`. The tests check node identity.
 *   • The last node of the reordered list must have `next === null`.
 *   • An empty list (null) or a list of 1–2 nodes stays as it is.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  1 → 2 → 3 → 4
 *     After:  1 → 4 → 2 → 3
 *
 *   Example 2
 *     Input:  1 → 2 → 3 → 4 → 5
 *     After:  1 → 5 → 2 → 4 → 3
 *     Why:    front, back, front, back, … and the middle node (3) ends up last.
 *
 *   Example 3
 *     Input:  1 → 2
 *     After:  1 → 2   (unchanged)
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • The number of nodes is in the range [0, 10^5].
 *   • 1 <= Node.val <= 1000
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   O(n) time and O(1) extra space. The tests reorder a 100,000-node list.
 *   Repeatedly walking to the current tail to detach it is O(n²) and far
 *   too slow, and a recursive solution overflows the call stack.
 *
 *   (Copying the nodes into an array makes it O(n) time with O(n) extra
 *   space. That passes, but try to reach O(1) space.)
 */

import { ListNode } from '../../../lib/linked-list.js';

// ▶ Run tests:   npm run solve reorder-list
// ⟳ Watch mode:  npm run watch reorder-list

/**
 * Reorders a list in place to L0 → Ln → L1 → Ln-1 → … by re-linking its nodes.
 *
 * @param {ListNode | null} head - Head of the list (may be null); it remains the head.
 * @returns {void} Nothing: the list is modified in place.
 */
export function reorderList(head) {
  // Your code here
}
