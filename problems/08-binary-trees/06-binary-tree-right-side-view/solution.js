/*
 * Title:      Binary Tree Right Side View
 * Difficulty: Medium
 * Patterns:   Tree BFS
 *
 * Solution — Binary Tree Right Side View
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * From the right you see exactly one node per level: the rightmost node of
 * that level. The tempting shortcut — walk `root.right.right…` — fails as
 * soon as the right side runs out before the left side does; then the deeper
 * levels are seen through the left subtree. The visible node can even be a
 * left child (when its parent is the rightmost node of the level above but
 * has no right child).
 *
 * So the problem is really "level order traversal, keep only the last
 * element of each level". A BFS that processes one level per round gives us
 * that for free: the last node dequeued in a round is the rightmost.
 *
 * Approach (BFS, one level per round)
 * ───────────────────────────────────
 *   1. If root is null, return [].
 *   2. queue = [root], head = 0, view = [].
 *   3. While head < queue.length:
 *        a. levelEnd = queue.length — nodes [head, levelEnd) form this level.
 *        b. Dequeue each node of the level, enqueueing its non-null children
 *           (left before right, so each level stays in left-to-right order).
 *        c. The node at index levelEnd - 1 was the level's last → push its val.
 *   4. Return view.
 *
 * Walkthrough — root = [1, 2, 3, 4, null, null, null, 5]
 * ───────────
 *               1
 *              / \
 *             2   3
 *            /
 *           4
 *          /
 *         5
 *
 *   round 1: level [1]     → see 1; enqueue 2, 3
 *   round 2: level [2, 3]  → see 3; enqueue 4 (3 has no children)
 *   round 3: level [4]     → see 4; enqueue 5
 *   round 4: level [5]     → see 5
 *   Answer: [1, 3, 4, 5]
 *
 * Complexity
 * ──────────
 *   Time:  O(n) — every node is enqueued and dequeued once.
 *   Space: O(n) for the queue array (with a head index nothing is removed;
 *          a current/next-array version needs O(w), w = widest level).
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • DFS, right child first, carrying the depth: the first node reached at
 *     a depth equal to view.length is visible — push it. O(n) time, O(h)
 *     stack. Visiting LEFT first would give the left side view instead.
 *   • Only following right pointers: wrong whenever the left subtree is
 *     deeper (e.g. [1, 2, 3, 4] → [1, 3, 4], not [1, 3]).
 *   • Reading `queue[queue.length - 1]` AFTER the inner loop gives the last
 *     node of the NEXT level (children were appended meanwhile). Capture
 *     the level boundary first and use index levelEnd - 1.
 *   • `queue.shift()` is O(n) per call in general; use a head index.
 */

import { TreeNode } from '../../../lib/tree.js';

/**
 * @param {TreeNode | null} root
 * @returns {number[]}
 */
export function rightSideView(root) {
  if (root === null) return [];

  const view = [];
  /** @type {TreeNode[]} */
  const queue = [root];
  let head = 0;

  while (head < queue.length) {
    const levelEnd = queue.length; // [head, levelEnd) is the current level
    // The last node of this level is already in the queue: it is the visible one.
    view.push(queue[levelEnd - 1].val);
    while (head < levelEnd) {
      const node = queue[head++];
      if (node.left) queue.push(node.left); // left before right keeps the level ordered
      if (node.right) queue.push(node.right);
    }
  }

  return view;
}
