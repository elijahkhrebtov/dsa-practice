/*
 * Title:      Path Sum III
 * Difficulty: Medium
 * Patterns:   Tree DFS, Prefix Sum
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * Given the root of a binary tree and an integer `targetSum`, return the
 * number of **downward paths** whose node values add up to `targetSum`.
 *
 *   • A downward path is a sequence of one or more nodes where each node is
 *     the child of the previous one. It may start at ANY node (not only the
 *     root) and end at ANY node below it (not only a leaf).
 *   • Paths that go up and then down (e.g. left child → parent → right
 *     child) do not count.
 *   • Values can be negative, so a running sum can go down as well as up.
 *   • Paths are counted by their nodes: two different paths with the same
 *     values are counted separately.
 *   • An empty tree has 0 paths. Don't modify the tree.
 *
 * Nodes are `TreeNode` objects from lib/tree.js: `{ val, left, right }`.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  root = [10, 5, -3, 3, 2, null, 11, 3, -2, null, 1], targetSum = 8
 *
 *                  10
 *                 /  \
 *                5    -3
 *               / \     \
 *              3   2     11
 *             / \   \
 *            3  -2   1
 *
 *     Output: 3
 *     Why:    5 → 3,  5 → 2 → 1,  and  -3 → 11.
 *
 *   Example 2
 *     Input:  root = [5, 4, 8, 11, null, 13, 4, 7, 2, null, null, 5, 1],
 *             targetSum = 22
 *
 *                  5
 *                 / \
 *                4   8
 *               /   / \
 *             11   13  4
 *            /  \     / \
 *           7    2   5   1
 *
 *     Output: 3
 *     Why:    5 → 4 → 11 → 2,  5 → 8 → 4 → 5,  and  4 → 11 → 7.
 *
 *   Example 3
 *     Input:  root = [1, 2, 3], targetSum = 6
 *
 *               1
 *              / \
 *             2   3
 *
 *     Output: 0
 *     Why:    2 + 1 + 3 = 6, but 2 → 1 → 3 goes up and then down.
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 0 <= number of nodes <= 2 * 10^5
 *   • The height of the tree is at most 3,000 (so recursion is safe).
 *   • -10^9 <= node.val <= 10^9
 *   • -10^9 <= targetSum <= 10^9
 *   • Sums can exceed 32-bit range; JavaScript numbers handle them exactly.
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   O(n) time, O(h) extra space for the recursion plus O(h) for bookkeeping.
 *   Starting a fresh downward walk from every node is O(n·h); the tests
 *   include a tree of 133,000 nodes and height 2,517 where that takes
 *   seconds.
 */

import { TreeNode } from '../../../lib/tree.js';

// ▶ Run tests:   npm run solve path-sum-iii
// ⟳ Watch mode:  npm run watch path-sum-iii

/**
 * Counts the downward paths whose values sum to `targetSum`.
 *
 * @param {TreeNode | null} root - Root of the binary tree (null for an empty tree).
 * @param {number} targetSum - The sum each counted path must add up to.
 * @returns {number} How many downward paths (any start node, any end node below it) have that sum.
 */
export function pathSum(root, targetSum) {
  // Your code here
}
