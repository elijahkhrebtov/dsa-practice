/*
 * Title:      Number of Connected Components in an Undirected Graph
 * Difficulty: Medium
 * Patterns:   Union-Find, Graph DFS
 *
 * Solution — Number of Connected Components in an Undirected Graph
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * Start with n separate islands, one per vertex. Each edge is a bridge
 * between two islands. If its endpoints are already on the same island the
 * bridge changes nothing (a duplicate edge, or an edge closing a cycle);
 * otherwise it merges two islands into one, and the island count drops by
 * exactly one. So:
 *
 *     components = n − (number of edges that actually merged two islands)
 *
 * Union-find (disjoint set union) is the data structure built for exactly
 * this: "which set is x in?" (find) and "merge these two sets" (union).
 *
 * Approach (union-find with path compression + union by size)
 * ───────────────────────────────────────────────────────────
 *   1. parent[i] = i (every vertex is its own root), size[i] = 1,
 *      components = n.
 *   2. find(x): follow parent pointers up to the root, then point every
 *      vertex on that route straight at the root (path compression).
 *   3. For each edge [u, v]: ru = find(u), rv = find(v). If ru === rv, skip.
 *      Otherwise attach the smaller tree's root under the larger one's root
 *      (union by size) and decrement components.
 *   4. Return components.
 *
 * Walkthrough — n = 5, edges [[0,1],[1,2],[3,4]]
 * ───────────
 *   start: parent [0,1,2,3,4], components 5
 *   [0,1]: roots 0,1 differ → parent[1]=0          components 4
 *   [1,2]: roots 0,2 differ → parent[2]=0          components 3
 *   [3,4]: roots 3,4 differ → parent[4]=3          components 2
 *   answer 2  ({0,1,2} and {3,4})
 *
 * Complexity
 * ──────────
 *   Time:  O(n + E · α(n)) — α is the inverse Ackermann function, which is
 *          at most 4 for any input that fits in the universe. Effectively
 *          linear.
 *   Space: O(n) — the parent and size arrays. No adjacency list needed.
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • BFS/DFS: build an adjacency list, then start a traversal from every
 *     unvisited vertex; each start is a new component. O(n + E). Use an
 *     explicit stack or queue — a recursive DFS overflows on a long path.
 *   • `n − edges.length` is only right for forests. Duplicates and cycles
 *     add edges without merging anything.
 *   • Linking the vertices instead of their roots (`parent[v] = u`)
 *     silently drops v's previous link. Always union the ROOTS.
 *   • Union-find without path compression AND without union by rank/size
 *     can build a tall chain (e.g. a star whose edges are [0, i]), making
 *     each find O(n) and the whole run O(n²). Either optimisation alone
 *     already gives O(log n) per operation; both together give α(n).
 *   • Recursive find with path compression can also overflow on a tall
 *     tree before it gets compressed; the two-pass loop below avoids that.
 */

/**
 * @param {number} n
 * @param {number[][]} edges
 * @returns {number}
 */
export function countComponents(n, edges) {
  const parent = new Int32Array(n);
  for (let i = 0; i < n; i++) parent[i] = i;
  const size = new Int32Array(n).fill(1);

  // Iterative find with full path compression.
  const find = (x) => {
    let root = x;
    while (parent[root] !== root) root = parent[root];
    while (parent[x] !== root) {
      const up = parent[x];
      parent[x] = root;
      x = up;
    }
    return root;
  };

  let components = n;
  for (const [u, v] of edges) {
    let ru = find(u);
    let rv = find(v);
    if (ru === rv) continue; // duplicate or cycle-closing edge: nothing merges
    if (size[ru] < size[rv]) [ru, rv] = [rv, ru];
    parent[rv] = ru; // hang the smaller tree under the larger one
    size[ru] += size[rv];
    components--;
  }

  return components;
}
