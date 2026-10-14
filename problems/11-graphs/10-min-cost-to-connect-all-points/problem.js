/*
 * Title:      Min Cost to Connect All Points
 * Difficulty: Medium
 * Patterns:   Minimum Spanning Tree, Union-Find, Heap
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * You are given `points`, where points[i] = [x, y] is a point on a 2D
 * integer grid. Connecting two points [x1, y1] and [x2, y2] costs their
 * Manhattan distance:
 *
 *     |x1 - x2| + |y1 - y2|
 *
 * Return the minimum total cost to connect ALL points, where "connected"
 * means there is exactly one simple path between any two points — i.e. you
 * choose a set of connections that links every point together, directly or
 * through other points, and pay for each chosen connection once. (Such a
 * cheapest set is a minimum spanning tree of the complete graph on the
 * points.) Connections only meet at the points themselves.
 *
 *   • With a single point nothing needs connecting: return 0.
 *   • Do not modify `points`.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  points = [[0, 0], [1, 1], [1, 0], [-1, 1]]
 *     Output: 4
 *     Why:    Connect [0,0]–[1,0] (1), [1,0]–[1,1] (1) and [0,0]–[-1,1] (2).
 *
 *   Example 2
 *     Input:  points = [[3, 12], [-2, 5], [-4, 1]]
 *     Output: 18
 *     Why:    The three possible connections cost 12, 6 and 18. Two of them
 *             are needed; the cheapest two are 6 + 12.
 *
 *   Example 3
 *     Input:  points = [[0, 0], [2, 2], [3, 10], [5, 2], [7, 0]]
 *     Output: 20
 *     Why:    [2,2]–[5,2] (3), [0,0]–[2,2] (4), [5,2]–[7,0] (4) and
 *             [2,2]–[3,10] (9).
 *
 *   Example 4
 *     Input:  points = [[5, -7]]
 *     Output: 0
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 1 <= points.length <= 1000
 *   • -10^6 <= x, y <= 10^6
 *   • All points are distinct.
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   Every pair of points can be connected, so the graph is complete: about
 *   n²/2 ≈ 500,000 edges for n = 1000. Prim's algorithm with a plain
 *   distance array runs in O(n²) time and O(n) space without ever building
 *   the edge list — ideal for dense graphs. Kruskal (sort all edges +
 *   Union-Find, O(n² log n)) also passes. The performance test connects three
 *   sets of 1000 points; an O(n³) search for the cheapest connecting edge at
 *   every step will be too slow. You may import `PriorityQueue` from
 *   `../../../lib/priority-queue.js` if you want a heap.
 */

// ▶ Run tests:   npm run solve min-cost-to-connect-all-points
// ⟳ Watch mode:  npm run watch min-cost-to-connect-all-points

/**
 * Computes the minimum total Manhattan length needed to connect all points.
 *
 * @param {number[][]} points - Distinct integer points [x, y].
 * @returns {number} The total cost of a minimum spanning tree over the points (0 for a single point).
 */
export function minCostConnectPoints(points) {
  // Your code here
}
