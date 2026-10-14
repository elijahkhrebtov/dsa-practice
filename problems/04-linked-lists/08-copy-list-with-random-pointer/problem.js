/*
 * Title:      Copy List with Random Pointer
 * Difficulty: Medium
 * Patterns:   Hash Map
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * You are given the `head` of a linked list of `n` nodes. Besides `next`,
 * every node has a `random` pointer that can point to ANY node of the list
 * (earlier, later, itself) or be `null`.
 *
 * Return a DEEP COPY of the list: `n` brand-new nodes such that
 *
 *   • each new node has the same `val` as its original,
 *   • the new nodes' `next` pointers form the same sequence, and
 *   • whenever original node X has X.random === Y, the copy of X has
 *     random === the copy of Y (null stays null).
 *
 * No pointer in the copy may point to an original node. The original list
 * must look exactly as it did before when your function returns (you may
 * rewire it temporarily, but you must restore it). An empty list copies to
 * null.
 *
 * Nodes are `RandomListNode`s from lib/linked-list.js:
 * `new RandomListNode(val, next = null, random = null)`.
 *
 * In the examples each node is written as [val, randomIndex], where
 * randomIndex is the position (0-based) of the node `random` points to, or
 * null.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  [[7, null], [13, 0], [11, 4], [10, 2], [1, 0]]
 *             7 → 13 → 11 → 10 → 1, where 13.random = 7, 11.random = 1,
 *             10.random = 11, 1.random = 7 and 7.random = null
 *     Output: a new list with the same shape:
 *             [[7, null], [13, 0], [11, 4], [10, 2], [1, 0]]
 *
 *   Example 2
 *     Input:  [[1, 1], [2, 1]]
 *     Output: [[1, 1], [2, 1]]
 *     Why:    both randoms point at the second node; node 2 points at itself.
 *
 *   Example 3
 *     Input:  [[3, null], [3, 0], [3, null]]
 *     Output: [[3, null], [3, 0], [3, null]]
 *     Why:    equal values are fine, since pointers are about nodes, not values.
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 0 <= n <= 10^5
 *   • -10^4 <= Node.val <= 10^4
 *   • Node.random is null or points to a node in the list.
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   O(n) time. A hash map from original node → copy gets you O(n) extra
 *   space. The tests copy an 80,000-node list, so finding each random
 *   target by walking the list from the head (O(n²)) is too slow.
 *
 *   Follow-up: O(1) extra space (not counting the copy) by temporarily
 *   weaving the copies into the original list.
 */

import { RandomListNode } from '../../../lib/linked-list.js';

// ▶ Run tests:   npm run solve copy-list-with-random-pointer
// ⟳ Watch mode:  npm run watch copy-list-with-random-pointer

/**
 * Creates a deep copy of a linked list whose nodes also have a `random` pointer.
 *
 * @param {RandomListNode | null} head - Head of the original list (may be null).
 * @returns {RandomListNode | null} Head of the copy, made only of new nodes (null for an empty list).
 */
export function copyRandomList(head) {
  // Your code here
}
