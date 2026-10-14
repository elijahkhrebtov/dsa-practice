/*
 * Title:      Redundant Connection
 * Difficulty: Medium
 * Patterns:   Union-Find
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * A TREE is a connected undirected graph with no cycles. Start with a tree
 * on the vertices 1 … n, then add ONE extra edge between two different
 * vertices that weren't already directly connected. The result is given to
 * you as `edges`, a list of exactly n undirected edges `[a, b]`, in some
 * arbitrary order.
 *
 * The extra edge created exactly one cycle. Removing any single edge of
 * that cycle turns the graph back into a tree. Return the edge to remove:
 * among all edges whose removal leaves a tree, the one that appears LAST
 * in `edges`.
 *
 *   • Return the edge exactly as it appears in the input (same two numbers
 *     in the same order), e.g. [4, 1], not [1, 4].
 *   • Removing an edge that is not on the cycle disconnects the graph, so
 *     only cycle edges are candidates.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  edges = [[1, 2], [1, 3], [2, 3]]
 *     Output: [2, 3]
 *
 *         1
 *        / \
 *       2 ─ 3
 *
 *     Why:    All three edges are on the triangle; [2, 3] comes last.
 *
 *   Example 2
 *     Input:  edges = [[1, 2], [2, 3], [3, 4], [1, 4], [1, 5]]
 *     Output: [1, 4]
 *
 *         5 ─ 1 ─ 2
 *             │   │
 *             4 ─ 3
 *
 *     Why:    The cycle is 1-2-3-4-1. [1, 5] is the last edge overall, but
 *             removing it would cut off vertex 5. Of the cycle edges,
 *             [1, 4] appears last.
 *
 *   Example 3
 *     Input:  edges = [[1, 2], [2, 3], [3, 4], [4, 1]]
 *     Output: [4, 1]
 *     Why:    Returned exactly as written in the input.
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • n === edges.length, 3 <= n <= 10^5
 *   • edges[i].length === 2, 1 <= a, b <= n, a !== b
 *   • No edge is repeated (in either orientation).
 *   • The graph is connected: a tree on 1 … n plus one extra edge.
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   Near-linear time, O(n · α(n)), with union-find (path compression +
 *   union by rank/size). "Remove each edge and re-check connectivity" or
 *   "run a DFS before adding each edge" are O(n²) and too slow for the
 *   large tests.
 */

// ▶ Run tests:   npm run solve redundant-connection
// ⟳ Watch mode:  npm run watch redundant-connection

/**
 * Finds the edge that can be removed to turn the graph back into a tree.
 *
 * @param {number[][]} edges - The n undirected edges `[a, b]` of a tree on 1 … n plus one extra edge.
 * @returns {number[]} The removable edge that appears last in `edges`, exactly as written there.
 */
export function findRedundantConnection(edges) {
  // Your code here
}
