/*
 * Title:      Find if Path Exists in Graph
 * Difficulty: Easy
 * Patterns:   Graph BFS, Graph DFS, Union-Find
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * There is an undirected graph with `n` vertices labelled 0 … n - 1. Its
 * edges are given as a list `edges`, where `edges[i] = [u, v]` means there
 * is an edge between `u` and `v` (you can travel it in both directions).
 *
 * Return `true` if you can walk from vertex `source` to vertex
 * `destination` by following edges, and `false` otherwise.
 *
 *   • A vertex can always reach itself: if source === destination the
 *     answer is `true`, even when that vertex has no edges.
 *   • Vertices that appear in no edge are still part of the graph (they are
 *     just isolated).
 *   • The graph may be disconnected and may contain cycles.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  n = 3, edges = [[0, 1], [1, 2], [2, 0]], source = 0, destination = 2
 *     Output: true
 *
 *         0 ─── 1
 *          \   /
 *           \ /
 *            2
 *
 *     Why:    0 → 2 directly, or 0 → 1 → 2.
 *
 *   Example 2
 *     Input:  n = 6, edges = [[0, 1], [0, 2], [3, 5], [5, 4], [4, 3]],
 *             source = 0, destination = 5
 *     Output: false
 *
 *         1 ─ 0 ─ 2        3 ─── 5
 *                           \   /
 *                             4
 *
 *     Why:    {0, 1, 2} and {3, 4, 5} are separate components.
 *
 *   Example 3
 *     Input:  n = 1, edges = [], source = 0, destination = 0
 *     Output: true
 *     Why:    Every vertex trivially reaches itself.
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 1 <= n <= 2 * 10^5
 *   • 0 <= edges.length <= 2 * 10^5
 *   • edges[i].length === 2, 0 <= u, v <= n - 1, u !== v
 *   • There are no duplicate edges.
 *   • 0 <= source, destination <= n - 1
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   O(n + E) time and O(n + E) space. The tests include a single path that
 *   is 200,000 vertices long — a recursive DFS will hit JavaScript's call
 *   stack limit long before the end of it, so traverse iteratively (explicit
 *   stack or queue) or use union-find.
 */

// ▶ Run tests:   npm run solve find-if-path-exists-in-graph
// ⟳ Watch mode:  npm run watch find-if-path-exists-in-graph

/**
 * Decides whether `destination` is reachable from `source` in an undirected graph.
 *
 * @param {number} n - Number of vertices, labelled 0 … n - 1.
 * @param {number[][]} edges - Undirected edges, each `[u, v]`.
 * @param {number} source - Start vertex.
 * @param {number} destination - Target vertex.
 * @returns {boolean} `true` if a path from `source` to `destination` exists.
 */
export function validPath(n, edges, source, destination) {
  // Your code here
}
