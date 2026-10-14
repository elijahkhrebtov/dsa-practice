/*
 * Title:      Binary Tree Level Order Traversal
 * Difficulty: Medium
 * Patterns:   Tree BFS
 *
 * Solution — Binary Tree Level Order Traversal
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * A queue is first-in, first-out. If we dequeue a node and enqueue its
 * children, the children wait behind every node that was already queued —
 * in particular behind the rest of the current level. So nodes leave the
 * queue in breadth-first order: depth 0, then depth 1 left to right, then
 * depth 2 left to right, …
 *
 * To split the output into levels we use one more observation: right after
 * the last node of level d is dequeued, the queue contains exactly the
 * nodes of level d + 1 (all of them, nothing else). So at the start of each
 * round, "everything currently in the queue" is one level.
 *
 * Approach (BFS with a head index)
 * ────────────────────────────────
 *   1. If root is null, return [].
 *   2. queue = [root], head = 0, result = [].
 *   3. While head < queue.length:
 *        a. levelEnd = queue.length — nodes [head, levelEnd) form this level.
 *        b. level = []
 *        c. While head < levelEnd: node = queue[head++]; level.push(node.val);
 *           enqueue node.left and node.right if they are not null.
 *        d. result.push(level).
 *   4. Return result.
 *
 * Walkthrough — root = [3, 9, 20, null, null, 15, 7]
 * ───────────
 *   queue [3]                head 0, levelEnd 1 → level [3];      queue gains 9, 20
 *   queue [3, 9, 20]         head 1, levelEnd 3 → level [9, 20];  queue gains 15, 7
 *   queue [3, 9, 20, 15, 7]  head 3, levelEnd 5 → level [15, 7];  nothing new
 *   head 5 = queue.length → done: [[3], [9, 20], [15, 7]]
 *
 * Complexity
 * ──────────
 *   Time:  O(n) — every node is enqueued and dequeued exactly once.
 *   Space: O(n) — the queue array keeps every node (we never remove from
 *          it, only move the head). A "two arrays per level" version needs
 *          only O(w) extra, w = widest level. The output itself is O(n).
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Current/next arrays: loop over `current`, push children into `next`,
 *     then `current = next`. Same O(n), and memory is released level by level.
 *   • DFS with a depth parameter: `dfs(node, depth)` pushes node.val into
 *     result[depth] (creating it when depth === result.length). Visiting left
 *     before right keeps each level in left-to-right order. Works, but
 *     recursion depth = tree height.
 *   • `queue.shift()` is O(n) in general (it re-indexes the array), which
 *     can turn BFS into O(n²) on wide trees. Use a head index.
 *   • Reading `queue.length` inside the inner loop condition instead of
 *     saving it first — the queue grows while you process the level, so the
 *     level boundary must be captured before you start.
 *   • Returning [[]] for an empty tree instead of [].
 */

import { TreeNode } from '../../../lib/tree.js';

/**
 * @param {TreeNode | null} root
 * @returns {number[][]}
 */
export function levelOrder(root) {
  if (root === null) return [];

  const result = [];
  /** @type {TreeNode[]} */
  const queue = [root];
  let head = 0; // queue[head] is the next node to dequeue

  while (head < queue.length) {
    const levelEnd = queue.length; // freeze the boundary: [head, levelEnd) is one level
    const level = [];
    while (head < levelEnd) {
      const node = queue[head++];
      level.push(node.val);
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    result.push(level);
  }

  return result;
}
