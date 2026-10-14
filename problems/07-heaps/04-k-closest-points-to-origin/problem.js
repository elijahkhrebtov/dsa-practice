/*
 * Title:      K Closest Points to Origin
 * Difficulty: Medium
 * Patterns:   Heap, Top-K
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * You are given an array of points on the plane, `points[i] = [x, y]`, and
 * an integer `k`. Return the k points that are closest to the origin (0, 0).
 *
 * Distance is the usual Euclidean distance, √(x² + y²).
 *
 *   • The answer is guaranteed to be unique: the k-th closest point is
 *     strictly closer than the (k+1)-th, so there are no ties at the cutoff.
 *     (Ties *inside* the answer are fine. Several chosen points may be at
 *     the same distance.)
 *   • Return the points in any order. Each point is a two-element array
 *     `[x, y]`, with the same coordinates as in the input.
 *   • Don't modify `points`.
 *
 * You may import `PriorityQueue` from `../../../lib/priority-queue.js` (or
 * use your own heap from problem 01).
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  points = [[1, 3], [-2, 2]], k = 1
 *     Output: [[-2, 2]]
 *     Why:    Squared distances are 1 + 9 = 10 and 4 + 4 = 8. 8 < 10.
 *
 *   Example 2
 *     Input:  points = [[3, 3], [5, -1], [-2, 4]], k = 2
 *     Output: [[3, 3], [-2, 4]]        ([[-2, 4], [3, 3]] is also accepted)
 *     Why:    Squared distances 18, 26, 20 → the two smallest are 18 and 20.
 *
 *   Example 3
 *     Input:  points = [[0, 1], [1, 0], [2, 2]], k = 2
 *     Output: [[0, 1], [1, 0]]
 *     Why:    Both chosen points are at distance 1 — a tie inside the answer.
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 1 <= k <= points.length <= 10^5
 *   • -10^4 <= x, y <= 10^4
 *   • The answer is unique (see above).
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   O(n log k) with a size-k heap (or O(n) on average with quickselect).
 *   Sorting all points (O(n log n)) also passes the tests, but picking
 *   the closest point k times by scanning (O(n·k)) is too slow.
 *   Compare squared distances. There's no need for Math.sqrt.
 */

// ▶ Run tests:   npm run solve k-closest-points-to-origin
// ⟳ Watch mode:  npm run watch k-closest-points-to-origin

/**
 * Finds the k points closest to the origin.
 *
 * @param {number[][]} points - Points as `[x, y]` pairs (not modified).
 * @param {number} k - How many points to return.
 * @returns {number[][]} The k closest points, in any order.
 */
export function kClosest(points, k) {
  // Your code here
}
