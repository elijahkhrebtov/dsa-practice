/*
 * Title:      Serialize and Deserialize Binary Tree
 * Difficulty: Hard
 * Patterns:   Tree BFS, Design
 *
 * Solution — Serialize and Deserialize Binary Tree
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * A single traversal order (pre-order, in-order, level order) is NOT enough
 * to rebuild a tree on its own — [1, 2] and [1, null, 2] both have the
 * pre-order "1, 2". What's missing is where the gaps are. If we also write
 * a marker for every missing child, the sequence becomes unambiguous: the
 * reader knows exactly when a subtree ends.
 *
 * Level order (BFS) with null markers is the LeetCode format:
 *
 *   [1, 2, 3, null, null, 4, 5]  →  "1,2,3,#,#,4,5,#,#,#,#"
 *
 * Deserializing replays the same BFS: keep a queue of nodes whose children
 * haven't been read yet; for each one, the next two tokens are its left and
 * right child (# = none). Every real node joins the queue so its own
 * children are read later, in the same order the writer emitted them.
 *
 * The output has one token per node plus one per missing child — n real
 * nodes always have exactly n + 1 null children — so the string is O(n)
 * even for a completely skewed tree.
 *
 * Approach
 * ────────
 *   serialize(root):
 *     1. If root is null → "" (an empty string is still a string).
 *     2. BFS with a queue starting at root. For each node popped:
 *          if null → emit "#"; otherwise emit its value and enqueue
 *          node.left and node.right (even if null).
 *     3. Join the tokens with ",".
 *
 *   deserialize(data):
 *     1. If data is "" → null.
 *     2. tokens = data.split(","); root = new TreeNode(+tokens[0]).
 *     3. queue = [root]; i = 1. For each node in the queue:
 *          left token  = tokens[i++]: if not "#", create, attach, enqueue
 *          right token = tokens[i++]: same for the right side.
 *     4. Return root.
 *
 * Use a moving head index instead of `queue.shift()` — shift may be O(n)
 * per call on big arrays.
 *
 * Walkthrough — root = [1, 2, 3, null, null, 4, 5]
 * ───────────
 *   serialize: queue 1 → emit 1, add 2,3 · 2 → emit 2, add #,# ·
 *              3 → emit 3, add 4,5 · # · # · 4 → emit 4, add #,# ·
 *              5 → emit 5, add #,# · # · # · # · #
 *              result "1,2,3,#,#,4,5,#,#,#,#"
 *   deserialize: root 1; node 1 reads "2","3" → children 2, 3
 *                node 2 reads "#","#"   → leaf
 *                node 3 reads "4","5"   → children 4, 5
 *                nodes 4, 5 read "#","#" each → leaves. Done.
 *
 * Complexity
 * ──────────
 *   Time:  O(n) for each function — every node and every null child is
 *          handled once; split/join are linear.
 *   Space: O(n) for the token array and the queue (the queue holds at most
 *          one level plus its children).
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Pre-order DFS with null markers ("1,2,#,#,3,4,#,#,5,#,#") is just as
 *     good and shorter to code recursively: build(node) reads one token; if
 *     it's "#" return null, else create the node and build its left, then
 *     right subtree. Mind the recursion depth on very deep trees.
 *   • JSON.stringify of nested objects works too, but is several times
 *     larger and leans on a library instead of exercising the idea.
 *   • Positional encodings (store each node at heap index 2i+1 / 2i+2) blow
 *     up exponentially on skewed trees — a 3,000-deep chain needs 2^3000
 *     slots.
 *   • Without separators, "1" "12" and "11" "2" both become "112". Always
 *     delimit tokens.
 *   • Don't use a falsy check to detect missing nodes: `if (!token)` or
 *     `if (!val)` treats the value 0 as null.
 *   • Inorder alone (or preorder alone) without null markers cannot
 *     describe the shape.
 */

import { TreeNode } from '../../../lib/tree.js';

const NULL_MARK = '#';
const SEP = ',';

/**
 * @param {TreeNode | null} root
 * @returns {string}
 */
export function serialize(root) {
  if (root === null) return '';

  const tokens = [];
  const queue = [root];
  // Moving head index: O(1) dequeue without Array.prototype.shift.
  for (let head = 0; head < queue.length; head++) {
    const node = queue[head];
    if (node === null) {
      tokens.push(NULL_MARK);
      continue;
    }
    tokens.push(String(node.val));
    queue.push(node.left, node.right); // nulls too: they become markers
  }
  return tokens.join(SEP);
}

/**
 * @param {string} data
 * @returns {TreeNode | null}
 */
export function deserialize(data) {
  if (data === '') return null;

  const tokens = data.split(SEP);
  const root = new TreeNode(Number(tokens[0]));
  const queue = [root]; // nodes whose children haven't been read yet
  let i = 1; // next unread token

  for (let head = 0; head < queue.length; head++) {
    const node = queue[head];

    const leftToken = tokens[i++];
    if (leftToken !== NULL_MARK) {
      node.left = new TreeNode(Number(leftToken));
      queue.push(node.left);
    }

    const rightToken = tokens[i++];
    if (rightToken !== NULL_MARK) {
      node.right = new TreeNode(Number(rightToken));
      queue.push(node.right);
    }
  }
  return root;
}
