/*
 * Title:      Is Graph Bipartite?
 * Difficulty: Medium
 * Patterns:   Graph BFS
 *
 * Solution — Is Graph Bipartite?
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * Inside one connected piece there are no real choices. Paint any node
 * colour 0; every neighbour is then forced to colour 1, every neighbour of
 * those forced back to 0, and so on. In other words, a node's colour is the
 * parity of its distance from the starting node. The piece is bipartite
 * exactly when this forced colouring never puts the same colour on both ends
 * of an edge — and a clash happens exactly when there is an odd cycle.
 *
 * Different pieces don't constrain each other at all, so each one gets its
 * own fresh start (and we must not forget pieces that the first traversal
 * never reaches).
 *
 * Approach (BFS 2-colouring, one start per piece)
 * ────────────────────────────────────────────────
 *   1. color = Int8Array(n) filled with -1 (= not visited).
 *   2. For every node s in 0 … n-1 that is still -1:
 *        a. color[s] = 0, queue = [s].
 *        b. While the queue is not empty, take u:
 *             for each neighbour v of u:
 *               – v uncoloured → color[v] = 1 - color[u], enqueue v
 *               – v has the same colour as u → return false (odd cycle)
 *               – v has the other colour → fine, nothing to do
 *   3. All pieces passed → return true.
 *
 * Walkthrough — graph = [[1], [0], [3, 4], [2, 4], [2, 3]]
 * ───────────
 *   s=0: color 0=0. Pop 0 → neighbour 1 gets 1. Pop 1 → neighbour 0 has
 *        colour 0 ≠ 1, fine. Piece {0,1} done.
 *   s=1: already coloured, skip.
 *   s=2: color 2=0. Pop 2 → 3 gets 1, 4 gets 1.
 *        Pop 3 (colour 1) → neighbour 2 is 0, fine; neighbour 4 is 1 = same
 *        → return false. (Triangle 2-3-4.)
 *
 * Complexity
 * ──────────
 *   Time:  O(V + E) — each node is enqueued once (when it gets its colour)
 *          and each adjacency list is scanned once, when its node is popped.
 *   Space: O(V) for the colour array and the queue.
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Iterative DFS with an explicit stack works identically — only the
 *     visiting order changes. Recursive DFS is the shortest code but recurses
 *     as deep as the longest path: a 10,000-node path overflows the default
 *     Node.js call stack.
 *   • Union-Find: for every node u, all of u's neighbours must end up on the
 *     same side, so union them together; if u itself is ever in the same set
 *     as one of its neighbours, return false. Also near-linear.
 *   • Forgetting disconnected pieces (only exploring from node 0) is the #1
 *     bug — node 0 might even be isolated.
 *   • Colouring nodes in label order rather than along edges ("if uncoloured,
 *     give it colour 0") invents conflicts that don't exist.
 *   • Restarting a BFS from every node with a fresh colour array is correct
 *     but O(V·(V+E)). Share one colour array across all starts.
 *   • queue.shift() is O(n) in the worst case; walk the queue array with a
 *     head index instead.
 */

/**
 * @param {number[][]} graph
 * @returns {boolean}
 */
export function isBipartite(graph) {
  const n = graph.length;
  const color = new Int8Array(n).fill(-1); // -1 = unvisited, otherwise 0 or 1
  const queue = new Int32Array(n); // every node is enqueued at most once overall

  for (let start = 0; start < n; start++) {
    if (color[start] !== -1) continue; // already handled as part of an earlier piece

    // New connected piece: its first node may take either colour.
    color[start] = 0;
    let head = 0;
    let tail = 0;
    queue[tail++] = start;

    while (head < tail) {
      const u = queue[head++];
      const next = 1 - color[u];
      for (const v of graph[u]) {
        if (color[v] === -1) {
          color[v] = next; // forced: opposite of the node that discovered it
          queue[tail++] = v;
        } else if (color[v] !== next) {
          return false; // both ends of edge u-v have the same colour → odd cycle
        }
      }
    }
  }

  return true;
}
