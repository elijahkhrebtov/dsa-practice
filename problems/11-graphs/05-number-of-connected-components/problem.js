/*
 * Title:      Number of Connected Components in an Undirected Graph
 * Difficulty: Medium
 * Patterns:   Union-Find, Graph DFS
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * You are given `n` vertices labelled 0 … n - 1 and a list of undirected
 * edges, where `edges[i] = [u, v]` connects `u` and `v`.
 *
 * Return the number of CONNECTED COMPONENTS: the number of separate
 * "islands" of vertices, where two vertices are in the same island if you
 * can walk from one to the other along edges.
 *
 *   • A vertex with no edges is a component on its own.
 *   • The same edge may be listed more than once (possibly as [u, v] and
 *     later as [v, u]). Repeats change nothing.
 *   • Edges may form cycles.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  n = 5, edges = [[0, 1], [1, 2], [3, 4]]
 *     Output: 2
 *
 *         0 ─ 1 ─ 2        3 ─ 4
 *
 *   Example 2
 *     Input:  n = 5, edges = [[0, 1], [1, 2], [2, 3], [3, 4]]
 *     Output: 1
 *
 *   Example 3
 *     Input:  n = 4, edges = [[2, 3]]
 *     Output: 3
 *     Why:    {0}, {1} and {2, 3}. Isolated vertices count.
 *
 *   Example 4
 *     Input:  n = 3, edges = [[0, 1], [1, 0], [0, 1]]
 *     Output: 2
 *     Why:    {0, 1} and {2}. Three edge entries, but they are all the
 *             same edge.
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 1 <= n <= 2 * 10^5
 *   • 0 <= edges.length <= 2 * 10^5
 *   • edges[i].length === 2, 0 <= u, v <= n - 1, u !== v
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   Near-linear time: O(n + E · α(n)) with union-find (path compression and
 *   union by rank/size), or O(n + E) with an iterative BFS/DFS. The tests
 *   include a 200,000-vertex path (too deep for recursion) and a big star
 *   that makes union-find without either optimisation quadratic.
 */

// ▶ Run tests:   npm run solve number-of-connected-components
// ⟳ Watch mode:  npm run watch number-of-connected-components

/**
 * Counts the connected components of an undirected graph.
 *
 * @param {number} n - Number of vertices, labelled 0 … n - 1.
 * @param {number[][]} edges - Undirected edges `[u, v]`; repeats are allowed.
 * @returns {number} The number of connected components.
 */
export function countComponents(n, edges) {
  // Your code here
}
