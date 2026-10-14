/*
 * Title:      Merge Two Sorted Lists
 * Difficulty: Easy
 * Patterns:   Dummy Node, Two Pointers
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * You are given the heads of two singly linked lists, `list1` and `list2`.
 * Each list is sorted in non-decreasing order. Merge them into ONE sorted
 * list and return its head.
 *
 *   • Build the result by splicing together the nodes of the two input
 *     lists — re-link the existing nodes, don't create new ones. The tests
 *     check that every node of the result is one of the original objects.
 *   • Either list (or both) may be empty (null). If both are empty, return
 *     null.
 *   • Equal values may come from either list, in any relative order.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  list1 = 1 → 2 → 4
 *             list2 = 1 → 3 → 4
 *     Output: 1 → 1 → 2 → 3 → 4 → 4
 *
 *   Example 2
 *     Input:  list1 = (empty), list2 = (empty)
 *     Output: (empty) — return null
 *
 *   Example 3
 *     Input:  list1 = (empty), list2 = 0
 *     Output: 0
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • Each list has between 0 and 5 * 10^4 nodes.
 *   • -10^6 <= Node.val <= 10^6
 *   • Both lists are sorted in non-decreasing order.
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   O(n + m) time and O(1) extra space. The tests merge two lists of 50,000
 *   nodes each, so a recursive merge (one stack frame per node) will overflow
 *   the call stack — write it iteratively.
 */

import { ListNode } from '../../../lib/linked-list.js';

// ▶ Run tests:   npm run solve merge-two-sorted-lists
// ⟳ Watch mode:  npm run watch merge-two-sorted-lists

/**
 * Merges two sorted linked lists into one sorted list by splicing their nodes.
 *
 * @param {ListNode | null} list1 - Head of the first sorted list (may be null).
 * @param {ListNode | null} list2 - Head of the second sorted list (may be null).
 * @returns {ListNode | null} Head of the merged sorted list, or null if both inputs are empty.
 */
export function mergeTwoLists(list1, list2) {
  // Your code here
}
