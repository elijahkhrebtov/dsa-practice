/*
 * Title:      Clone Graph
 * Difficulty: Medium
 * Patterns:   Graph DFS, Hash Map
 *
 * Solution — Clone Graph
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * Copying a tree is easy: copy the node, then recursively copy the children.
 * A graph breaks that recipe in two ways:
 *   1. Cycles — 1 → 2 → 1 → 2 … a naive recursion never stops.
 *   2. Shared nodes — in a diamond, node 4 is reachable from both 2 and 3;
 *      copying it twice would give the clone an extra node.
 *
 * Both problems disappear with one hash map: original node → its copy. The
 * map is the "visited set" AND the lookup table. The first time we meet an
 * original node we create its copy and remember it; every later encounter
 * just reuses that copy.
 *
 * Approach (iterative DFS with a Map)
 * ───────────────────────────────────
 *   1. If node is null, return null.
 *   2. copies = new Map([[node, new GraphNode(node.val)]]); stack = [node].
 *   3. While the stack is non-empty, pop an original `cur`:
 *        for each neighbour `nb` of cur (in order):
 *          • if nb has no copy yet: create one, store it, push nb so its
 *            own neighbours get wired up later;
 *          • append copies.get(nb) to copies.get(cur).neighbors.
 *   4. Return copies.get(node).
 *
 * Each original node is pushed exactly once (right after its copy is made),
 * so each node's neighbour list is wired exactly once — in the original
 * order, which keeps the neighbour order identical.
 *
 * Walkthrough — square [[2,4],[1,3],[2,4],[1,3]]
 * ───────────
 *   copies {1}, stack [1]
 *   pop 1: nb 2 → new copy 2, push; nb 4 → new copy 4, push.  1' → [2', 4']
 *   pop 4: nb 1 → exists; nb 3 → new copy 3, push.            4' → [1', 3']
 *   pop 3: nb 2 → exists; nb 4 → exists.                      3' → [2', 4']
 *   pop 2: nb 1 → exists; nb 3 → exists.                      2' → [1', 3']
 *   return 1'
 *
 * Complexity
 * ──────────
 *   Time:  O(V + E) — every node is created/popped once and every neighbour
 *          reference is processed once, with O(1) Map operations.
 *   Space: O(V) — the map and the stack (the copy itself is the output).
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Recursive DFS is the classic short answer:
 *       clone(n) = copies.get(n) ?? (create copy, store it FIRST, then
 *                  copy.neighbors = n.neighbors.map(clone))
 *     Storing the copy in the map BEFORE recursing into the neighbours is
 *     what breaks cycles. Recursion depth can reach V. That's fine for the
 *     2,000 nodes allowed here, but Node's call stack runs out somewhere
 *     around a few thousand nested calls, so the iterative version below
 *     is the safer habit for big graphs.
 *   • BFS with a queue works identically.
 *   • Keying the map by `val` instead of by node works here because values
 *     are unique; keying by the node object is the general solution.
 *   • Keeping copies in an array and searching it for "the copy of val x"
 *     turns every edge into an O(V) scan — O(V · E) overall.
 *   • A module-level map (outside the function) leaks state between calls:
 *     the second clone would hand back nodes from the first.
 */

import { GraphNode } from '../../../lib/graph.js';

/**
 * @param {GraphNode | null} node
 * @returns {GraphNode | null}
 */
export function cloneGraph(node) {
  if (node === null) return null;

  /** @type {Map<GraphNode, GraphNode>} original → copy (doubles as the visited set) */
  const copies = new Map([[node, new GraphNode(node.val)]]);
  const stack = [node];

  while (stack.length > 0) {
    const cur = stack.pop();
    const curCopy = copies.get(cur);
    for (const nb of cur.neighbors) {
      let nbCopy = copies.get(nb);
      if (nbCopy === undefined) {
        // First time we see this node: make its copy and schedule its wiring.
        nbCopy = new GraphNode(nb.val);
        copies.set(nb, nbCopy);
        stack.push(nb);
      }
      curCopy.neighbors.push(nbCopy); // same order as the original list
    }
  }

  return copies.get(node);
}
