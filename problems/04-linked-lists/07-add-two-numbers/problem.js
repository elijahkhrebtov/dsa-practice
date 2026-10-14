/*
 * Title:      Add Two Numbers
 * Difficulty: Medium
 * Patterns:   Simulation, Dummy Node
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * You are given two non-empty linked lists, `l1` and `l2`, each representing
 * a non-negative integer. The digits are stored in REVERSE order: the head
 * holds the ones digit, the next node the tens digit, and so on. Each node
 * holds a single digit 0–9.
 *
 * Return the sum of the two numbers as a linked list in the same reversed
 * format.
 *
 *   • The numbers have no leading zeros, except the number 0 itself (a
 *     single node holding 0). Your result must not have leading zeros
 *     either, so no extra 0 node at the end of the list.
 *   • The numbers can be far longer than JavaScript's `Number` can hold
 *     exactly (2^53 ≈ 9·10^15), so add digit by digit, the way you would on
 *     paper.
 *   • Return a NEW list and leave `l1` and `l2` unchanged.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  l1 = 2 → 4 → 3, l2 = 5 → 6 → 4
 *     Output: 7 → 0 → 8
 *     Why:    342 + 465 = 807.
 *
 *   Example 2
 *     Input:  l1 = 0, l2 = 0
 *     Output: 0
 *
 *   Example 3
 *     Input:  l1 = 9 → 9 → 9 → 9 → 9 → 9 → 9, l2 = 9 → 9 → 9 → 9
 *     Output: 8 → 9 → 9 → 9 → 0 → 0 → 0 → 1
 *     Why:    9,999,999 + 9,999 = 10,009,998. The final carry adds a node.
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • Each list has between 1 and 10^5 nodes.
 *   • 0 <= Node.val <= 9
 *   • Neither number has leading zeros (except the number 0 itself).
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   O(max(m, n)) time, where m and n are the list lengths. Apart from the
 *   output list, use O(1) extra space. The tests add numbers with 100,000
 *   digits, so convert-to-number tricks and recursion won't work.
 */

import { ListNode } from '../../../lib/linked-list.js';

// ▶ Run tests:   npm run solve add-two-numbers
// ⟳ Watch mode:  npm run watch add-two-numbers

/**
 * Adds two non-negative integers stored as reversed-digit linked lists.
 *
 * @param {ListNode | null} l1 - First number, ones digit first (non-empty).
 * @param {ListNode | null} l2 - Second number, ones digit first (non-empty).
 * @returns {ListNode | null} A new list holding the sum, ones digit first.
 */
export function addTwoNumbers(l1, l2) {
  // Your code here
}
