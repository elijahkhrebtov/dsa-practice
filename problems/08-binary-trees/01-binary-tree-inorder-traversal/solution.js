/*
 * Title:      Binary Tree Inorder Traversal
 * Difficulty: Easy
 * Patterns:   Tree DFS, Stack
 *
 * Solution — Binary Tree Inorder Traversal
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * The recursive version is a direct translation of the definition:
 *
 *     visit(node): if node is null, return
 *                  visit(node.left); output node.val; visit(node.right)
 *
 * It is correct, O(n), and fine for balanced trees. But each level of the
 * tree costs one JavaScript call frame, and Node only has room for roughly
 * 10,000 of them — a 100,000-node chain throws "Maximum call stack size
 * exceeded".
 *
 * So we simulate the call stack ourselves. While the recursion is "inside"
 * a left subtree, every ancestor whose left subtree is still being explored
 * is suspended, waiting to output its value. Those suspended nodes are
 * exactly what we keep in an explicit stack: we push them on the way down
 * the left spine and pop them (most recent first) when their left subtree
 * is finished.
 *
 * Approach (explicit stack)
 * ─────────────────────────
 *   1. stack = [], current = root, out = [].
 *   2. While current !== null or the stack is not empty:
 *        a. While current !== null: push current, current = current.left.
 *           (Walk down the left spine; each pushed node is waiting.)
 *        b. node = stack.pop() — its left subtree is completely done.
 *        c. out.push(node.val).
 *        d. current = node.right — now traverse its right subtree the same
 *           way. If it's null, the next iteration pops the next ancestor.
 *   3. Return out.
 *
 * Walkthrough — root = [1, 2, 3, 4, 5]        1
 * ───────────                                / \
 *                                           2   3
 *                                          / \
 *                                         4   5
 *
 *   slide left from 1:  stack [1, 2, 4]
 *   pop 4 → out [4]          current = 4.right = null
 *   pop 2 → out [4, 2]       current = 5
 *   slide left from 5:  stack [1, 5]
 *   pop 5 → out [4, 2, 5]    current = null
 *   pop 1 → out [4, 2, 5, 1] current = 3
 *   slide left from 3:  stack [3]
 *   pop 3 → out [4, 2, 5, 1, 3]; current = null, stack empty → done
 *
 * Complexity
 * ──────────
 *   Time:  O(n) — every node is pushed once and popped once.
 *   Space: O(h) for the stack (h = height): O(log n) for a balanced tree,
 *          O(n) for a chain. The output array itself is O(n).
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Recursion: shortest code, same complexity, but limited by the call
 *     stack (~10^4 levels in Node). Write it with an inner helper that pushes
 *     into one shared array — returning and concatenating arrays at every
 *     level (`[...left, val, ...right]`) is O(n²) on a skewed tree.
 *   • Morris traversal: O(1) extra space by temporarily threading each
 *     in-order predecessor's empty right pointer back to the current node,
 *     then removing the thread. Clever, but it mutates the tree while running
 *     and is easy to get wrong; know it exists.
 *   • Common bug in the iterative version: looping only `while (stack.length)`
 *     — the stack is empty right after popping the root, but its right
 *     subtree is still unvisited. The loop condition must also check
 *     `current !== null`.
 *   • Keep results in a local array, not a module-level one, or a second call
 *     will see the first call's values.
 */

import { TreeNode } from '../../../lib/tree.js';

/**
 * @param {TreeNode | null} root
 * @returns {number[]}
 */
export function inorderTraversal(root) {
  const out = [];
  /** @type {TreeNode[]} nodes whose left subtree is being explored, waiting to be output */
  const stack = [];
  let current = root;

  while (current !== null || stack.length > 0) {
    // Walk down the left spine, remembering every node we pass.
    while (current !== null) {
      stack.push(current);
      current = current.left;
    }
    // The most recently pushed node has no unvisited left subtree left.
    const node = /** @type {TreeNode} */ (stack.pop());
    out.push(node.val);
    // Its right subtree comes next (null → the next pop handles an ancestor).
    current = node.right;
  }

  return out;
}
