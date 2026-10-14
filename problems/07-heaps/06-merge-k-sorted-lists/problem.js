/*
 * Title:      Merge k Sorted Lists
 * Difficulty: Hard
 * Patterns:   Heap, K-way Merge
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * You are given an array of `k` singly linked lists. Each list is sorted in
 * non-decreasing order, and any of them may be empty (`null`). Merge them all
 * into ONE sorted linked list and return its head. Return `null` if there
 * are no nodes at all (k = 0, or every list is empty).
 *
 * You may reuse (relink) the input nodes or create new ones. Either is fine.
 * Equal values may appear in any order relative to each other.
 *
 * Nodes are `ListNode` objects from `lib/linked-list.js` (`{ val, next }`),
 * already imported below.
 *
 * You may import `PriorityQueue` from `../../../lib/priority-queue.js` (or
 * use your own heap from problem 01).
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  lists = [1 → 4 → 5,  1 → 3 → 4,  2 → 6]
 *     Output: 1 → 1 → 2 → 3 → 4 → 4 → 5 → 6
 *
 *   Example 2
 *     Input:  lists = []
 *     Output: null
 *
 *   Example 3
 *     Input:  lists = [null, null]
 *     Output: null
 *
 *   Example 4
 *     Input:  lists = [null, 0 → 7, null]
 *     Output: 0 → 7
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 0 <= k <= 10^4
 *   • 0 <= length of each list; total number of nodes N <= 10^5
 *   • -10^4 <= node values <= 10^4
 *   • Every list is sorted in non-decreasing order.
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   O(N log k) time. Merging the lists one after another into a growing
 *   result is O(k · N) and too slow for the performance test (5,000 lists).
 *   Use a min-heap of list heads, or merge in pairs (divide & conquer).
 */
import { ListNode } from '../../../lib/linked-list.js';

// ▶ Run tests:   npm run solve merge-k-sorted-lists
// ⟳ Watch mode:  npm run watch merge-k-sorted-lists

/**
 * Merges k sorted linked lists into one sorted linked list.
 *
 * @param {Array<ListNode | null>} lists - Heads of the sorted lists (null = empty list).
 * @returns {ListNode | null} Head of the merged sorted list, or null if there are no nodes.
 */
export function mergeKLists(lists) {
  // Your code here
}
