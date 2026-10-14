/*
 * Title:      Is Graph Bipartite?
 * Difficulty: Medium
 * Patterns:   Graph BFS
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * You are given an undirected graph with `n` nodes labelled 0 … n - 1 as an
 * adjacency list: `graph[u]` is the array of nodes connected to `u`.
 *
 *   • Edges are undirected: if `v` appears in graph[u], then `u` appears in
 *     graph[v].
 *   • There are no self-loops and no duplicate edges.
 *   • The graph is NOT necessarily connected — it may consist of several
 *     separate pieces, and some nodes may have no edges at all.
 *
 * The graph is **bipartite** if its nodes can be split into two groups A and
 * B so that every edge connects a node in A with a node in B (no edge stays
 * inside one group). Equivalently: you can paint every node with one of two
 * colours so that the two ends of every edge get different colours.
 *
 * Return `true` if the graph is bipartite, `false` otherwise. Do not modify
 * `graph`.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  graph = [[1, 2, 3], [0, 2], [0, 1, 3], [0, 2]]
 *     Output: false
 *     Why:    0, 1 and 2 form a triangle. Whatever colours 0 and 1 get
 *             (they must differ), 2 is adjacent to both and has no colour
 *             left.
 *
 *   Example 2
 *     Input:  graph = [[1, 3], [0, 2], [1, 3], [0, 2]]
 *     Output: true
 *     Why:    The square 0-1-2-3-0 splits into A = {0, 2} and B = {1, 3}.
 *
 *   Example 3
 *     Input:  graph = [[1], [0], [3, 4], [2, 4], [2, 3]]
 *     Output: false
 *     Why:    Two separate pieces. {0, 1} is fine, but {2, 3, 4} is a
 *             triangle. Exploring only from node 0 would miss it.
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 1 <= n <= 10^4
 *   • 0 <= graph[u].length < n, total number of edges <= 5 * 10^4
 *   • graph[u] does not contain u and contains no duplicates.
 *   • v in graph[u]  ⇔  u in graph[v]
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   O(V + E) time and O(V) extra space: every node and every edge should be
 *   looked at a constant number of times. The tests include a 10,000-node
 *   grid and a 10,000-node path — the path is deep enough to overflow the
 *   call stack of a recursive DFS, so traverse iteratively (BFS queue or an
 *   explicit stack).
 *
 *   A graph is bipartite exactly when it has no cycle of odd length — handy
 *   for reasoning about the test cases.
 */

// ▶ Run tests:   npm run solve is-graph-bipartite
// ⟳ Watch mode:  npm run watch is-graph-bipartite

/**
 * Decides whether an undirected graph can be 2-coloured so that every edge joins different colours.
 *
 * @param {number[][]} graph - Adjacency list: graph[u] lists the neighbours of node u (undirected, possibly disconnected).
 * @returns {boolean} True if the nodes can be split into two groups with every edge crossing between them.
 */
export function isBipartite(graph) {
  // Your code here
}
