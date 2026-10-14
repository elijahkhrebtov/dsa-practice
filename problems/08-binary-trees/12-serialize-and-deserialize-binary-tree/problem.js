/*
 * Title:      Serialize and Deserialize Binary Tree
 * Difficulty: Hard
 * Patterns:   Tree BFS, Design
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * Serialization turns a data structure into a string so it can be saved to
 * a file or sent over a network, and deserialization rebuilds the original
 * structure from that string.
 *
 * Design your own codec for binary trees by implementing two functions:
 *
 *   • serialize(root)   → a string that encodes the tree;
 *   • deserialize(data) → a new tree with exactly the same shape and values
 *                         as the one that produced `data`.
 *
 * The format is entirely up to you — the tests only check that
 * `deserialize(serialize(tree))` reproduces `tree`. Requirements:
 *
 *   • serialize must return a string, also for the empty tree (`null`), and
 *     deserialize of that string must return `null`.
 *   • The string must carry ALL the information. No hidden state: don't
 *     stash trees in module-level variables, and don't hand back the
 *     original nodes — deserialize builds brand-new `TreeNode` objects.
 *     (The tests decode strings with a freshly loaded copy of your module.)
 *   • Values may repeat, may be negative, and may have several digits.
 *   • The string should grow linearly with the tree: at most ~50 characters
 *     per node, even for very deep, skewed trees.
 *   • Don't modify the tree passed to serialize.
 *
 * Nodes are `TreeNode` objects from lib/tree.js: `{ val, left, right }`.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  root = [1, 2, 3, null, null, 4, 5]
 *
 *               1
 *              / \
 *             2   3
 *                / \
 *               4   5
 *
 *     serialize(root) could return, for example, "1,2,3,#,#,4,5,#,#,#,#"
 *     (level order with # for missing children) or "1,2,#,#,3,4,#,#,5,#,#"
 *     (pre-order) — any format works.
 *     Output: deserialize(serialize(root)) is the same tree.
 *
 *   Example 2
 *     Input:  root = []   (null)
 *     Output: serialize returns some string s, and deserialize(s) → null.
 *
 *   Example 3
 *     Input:  root = [-12, 3, null, 45]
 *
 *               -12
 *               /
 *              3
 *             /
 *            45
 *
 *     Why:    "-12" must decode as one value, and a left child must stay a
 *             left child — the shape is part of the tree.
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 0 <= number of nodes <= 10^5
 *   • The height of the tree is at most 3,000 (so recursion is safe).
 *   • -1000 <= node.val <= 1000 (integers)
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   O(n) time for both functions and an O(n)-length string. The tests
 *   round-trip a 100,000-node tree; quadratic work (re-scanning or
 *   re-slicing the string for each node) will be too slow.
 */

import { TreeNode } from '../../../lib/tree.js';

// ▶ Run tests:   npm run solve serialize-and-deserialize-binary-tree
// ⟳ Watch mode:  npm run watch serialize-and-deserialize-binary-tree

/**
 * Encodes a binary tree as a string.
 *
 * @param {TreeNode | null} root - Root of the tree to encode (null for an empty tree).
 * @returns {string} A string from which `deserialize` can rebuild the tree.
 */
export function serialize(root) {
  // Your code here
}

/**
 * Rebuilds a binary tree from a string produced by `serialize`.
 *
 * @param {string} data - A string returned by `serialize`.
 * @returns {TreeNode | null} Root of a newly built tree identical in shape and values, or null for an empty tree.
 */
export function deserialize(data) {
  // Your code here
}
