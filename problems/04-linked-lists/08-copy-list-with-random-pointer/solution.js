/*
 * Title:      Copy List with Random Pointer
 * Difficulty: Medium
 * Patterns:   Hash Map
 *
 * Solution — Copy List with Random Pointer
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * A plain list copy goes front to back, creating each node and linking it
 * to the previous one. Random pointers break that: a random may point to a
 * node we haven't copied yet. And even when the target copy exists, we have
 * no way to find it from the original target.
 *
 * Both problems go away if we separate CREATING nodes from LINKING them and
 * keep a lookup table original → copy:
 *   • first create every copy and record it in a Map,
 *   • then set each copy's `next` and `random` by looking up the copies of
 *     the original's `next` and `random`.
 * A JavaScript Map compares object keys by identity, so equal values don't
 * cause any confusion.
 *
 * Approach (two passes with a Map)
 * ────────────────────────────────
 *   1. If head is null, return null.
 *   2. Pass 1: for each original node X: map.set(X, new RandomListNode(X.val)).
 *   3. Pass 2: for each original node X:
 *        copy = map.get(X)
 *        copy.next   = X.next   === null ? null : map.get(X.next)
 *        copy.random = X.random === null ? null : map.get(X.random)
 *   4. Return map.get(head).
 * The original is only read, so it stays untouched.
 *
 * Walkthrough — [[7, null], [13, 0], [11, 4], [10, 2], [1, 0]]
 * ───────────
 *   Pass 1: map = {7→7', 13→13', 11→11', 10→10', 1→1'}
 *   Pass 2: 7'.next = 13',  7'.random = null
 *           13'.next = 11', 13'.random = map.get(7)  = 7'
 *           11'.next = 10', 11'.random = map.get(1)  = 1'
 *           10'.next = 1',  10'.random = map.get(11) = 11'
 *           1'.next = null, 1'.random = map.get(7)   = 7'
 *   Return 7'.
 *
 * Complexity
 * ──────────
 *   Time:  O(n) — two passes; Map get/set are O(1) on average.
 *   Space: O(n) — the Map has one entry per node (besides the copy itself).
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • O(1) extra space, "interweaving":
 *       1. After each original X insert its copy: A → A' → B → B' → …
 *       2. X.next.random = X.random === null ? null : X.random.next
 *       3. Detach the copies and restore every original X.next.
 *     Same O(n) time. It temporarily changes the input, so step 3 must
 *     restore it exactly (the tests check this).
 *   • Looking up a random target by its index (walk from the head to find
 *     the index, then walk the copy the same distance) is O(n) per node,
 *     O(n²) total: too slow for 80,000 nodes.
 *   • Mapping by VALUE instead of by node breaks as soon as two nodes share
 *     a value.
 *   • `map.get(null)` returns `undefined`, not `null`. Handle null explicitly
 *     (or seed the map with null → null).
 *   • A shallow copy (copy.random = X.random) leaves the copy pointing back
 *     into the original list.
 */

import { RandomListNode } from '../../../lib/linked-list.js';

/**
 * @param {RandomListNode | null} head
 * @returns {RandomListNode | null}
 */
export function copyRandomList(head) {
  if (head === null) return null;

  /** @type {Map<RandomListNode, RandomListNode>} original node → its copy */
  const copyOf = new Map();

  // Pass 1: create all copies (values only), so every random target exists.
  for (let node = head; node !== null; node = node.next) {
    copyOf.set(node, new RandomListNode(node.val));
  }

  // Pass 2: wire next and random through the map.
  for (let node = head; node !== null; node = node.next) {
    const copy = copyOf.get(node);
    copy.next = node.next === null ? null : copyOf.get(node.next);
    copy.random = node.random === null ? null : copyOf.get(node.random);
  }

  return copyOf.get(head);
}
