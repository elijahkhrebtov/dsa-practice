/*
 * Title:      Cheapest Flights Within K Stops
 * Difficulty: Medium
 * Patterns:   Shortest Path, Graph BFS
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * There are `n` cities labelled 0 … n - 1 and a list of one-way flights:
 * flights[i] = [from, to, price] means you can fly from city `from` to city
 * `to` for `price`.
 *
 * Given a start city `src`, a destination `dst` and an integer `k`, return
 * the cheapest total price of a trip from `src` to `dst` that makes AT MOST
 * `k` stops. A stop is an intermediate city where you land and change
 * planes, so a route with at most k stops uses at most k + 1 flights. If
 * there is no such route, return -1.
 *
 *   • Flights are directed: [a, b, p] does not let you fly b → a.
 *   • A route may pass through any city, including revisiting one, as long
 *     as it respects the stop limit (revisiting never helps, since prices
 *     are positive).
 *   • Do not modify `flights`.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  n = 3, flights = [[0, 1, 40], [1, 2, 40], [0, 2, 100]],
 *             src = 0, dst = 2, k = 1
 *     Output: 80
 *     Why:    0 → 1 → 2 costs 80 with one stop (city 1).
 *
 *   Example 2
 *     Input:  same flights, k = 0
 *     Output: 100
 *     Why:    With zero stops only the direct flight 0 → 2 is allowed.
 *
 *   Example 3
 *     Input:  n = 5,
 *             flights = [[0, 1, 5], [1, 2, 5], [0, 3, 2], [3, 1, 2],
 *                        [1, 4, 1], [4, 2, 1]],
 *             src = 0, dst = 2, k = 2
 *     Output: 7
 *     Why:    The overall cheapest route 0 → 3 → 1 → 4 → 2 (6) needs three
 *             stops — too many. Among routes with ≤ 2 stops, 0 → 1 → 4 → 2
 *             (5 + 1 + 1 = 7) is cheapest. Note that city 1 is reached more
 *             cheaply via 3 (cost 4), but that uses up a stop; the pricier
 *             direct arrival (cost 5) is the one that leads to the answer.
 *
 *   Example 4
 *     Input:  n = 4, flights = [[0, 1, 1], [1, 2, 1], [2, 3, 1]],
 *             src = 0, dst = 3, k = 1
 *     Output: -1
 *     Why:    The only route needs two stops.
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 1 <= n <= 100
 *   • 0 <= flights.length <= n * (n - 1) / 2
 *   • flights[i] = [from, to, price], 0 <= from, to < n, from ≠ to
 *   • 1 <= price <= 10^4
 *   • No two flights share the same (from, to) pair.
 *   • 0 <= src, dst, k < n and src ≠ dst
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   O(k · E) time and O(n) space (Bellman-Ford limited to k + 1 rounds, or a
 *   level-by-level BFS). Trying every route is exponential — the tests
 *   include a layered graph with 10^8 equally priced routes.
 *
 *   Careful: plain Dijkstra on price alone is wrong here, because the
 *   cheapest way to reach a middle city may burn too many stops (Example 3).
 */

// ▶ Run tests:   npm run solve cheapest-flights-within-k-stops
// ⟳ Watch mode:  npm run watch cheapest-flights-within-k-stops

/**
 * Finds the cheapest price from src to dst using at most k intermediate stops.
 *
 * @param {number} n - Number of cities, labelled 0 … n - 1.
 * @param {number[][]} flights - One-way flights [from, to, price].
 * @param {number} src - Starting city.
 * @param {number} dst - Destination city (different from src).
 * @param {number} k - Maximum number of stops (so at most k + 1 flights).
 * @returns {number} The cheapest total price, or -1 if dst can't be reached within k stops.
 */
export function findCheapestPrice(n, flights, src, dst, k) {
  // Your code here
}
