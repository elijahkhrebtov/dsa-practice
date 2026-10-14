/*
 * Title:      Cheapest Flights Within K Stops
 * Difficulty: Medium
 * Patterns:   Shortest Path, Graph BFS
 *
 * Solution — Cheapest Flights Within K Stops
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * Without the stop limit this is plain cheapest-path (Dijkstra). The limit
 * changes the nature of the problem: a state is no longer just "I'm in city
 * X" but "I'm in city X having used f flights". A cheap arrival that used
 * many flights and an expensive arrival that used few are BOTH worth
 * keeping, because the second one may be the only one that can still reach
 * dst in time. Dijkstra that finalizes each city once throws one of them
 * away (Example 3: city 1 is finalized at cost 4 via city 3, and the
 * cost-5 direct arrival that leads to the answer is discarded).
 *
 * Bellman-Ford fits perfectly, because its rounds count flights: after r
 * rounds, cost[v] is the cheapest price to reach v using at most r flights.
 * We just stop after k + 1 rounds.
 *
 * Approach (Bellman-Ford limited to k + 1 rounds)
 * ────────────────────────────────────────────────
 *   1. cost = [∞, …, ∞], cost[src] = 0.             (0 flights used)
 *   2. Repeat k + 1 times:
 *        a. next = copy of cost.
 *        b. For every flight [a, b, p]: next[b] = min(next[b], cost[a] + p).
 *        c. cost = next.
 *   3. Return cost[dst], or -1 if it's still ∞.
 *
 * Why the copy? Within one round we must only extend routes from the
 * PREVIOUS round. If we relaxed in place, processing [0,1] then [1,2] in the
 * same round would build the two-flight route 0→1→2 in a round that should
 * only add one flight, silently exceeding the limit.
 *
 * Walkthrough — Example 3, k = 2 (3 rounds)
 * ───────────
 *   flights: 0→1 (5), 1→2 (5), 0→3 (2), 3→1 (2), 1→4 (1), 4→2 (1)
 *              city:   0   1   2   3   4
 *   start            [ 0,  ∞,  ∞,  ∞,  ∞ ]
 *   round 1 (≤1 fl.) [ 0,  5,  ∞,  2,  ∞ ]   0→1, 0→3
 *   round 2 (≤2 fl.) [ 0,  4, 10,  2,  6 ]   3→1 = 4, 1→2 = 5+5, 1→4 = 5+1
 *   round 3 (≤3 fl.) [ 0,  4,  7,  2,  5 ]   4→2 = 6+1 = 7 (uses last round's 6)
 *   answer cost[2] = 7. (The 6 via 0→3→1→4→2 would need a 4th round.)
 *
 * Complexity
 * ──────────
 *   Time:  O((k + 1) · (n + E)) — k + 1 rounds, each copies the array and
 *          scans every flight once.
 *   Space: O(n) for the two cost arrays.
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Level-by-level BFS: queue of (city, price) states, process one level
 *     (= one more flight) at a time for at most k + 1 levels, and only
 *     enqueue a state if it improves best[city]. Same idea, same bound.
 *   • Dijkstra on (price, city, flightsUsed) states also works, as long as
 *     you don't finalize a city on first pop — e.g. keep the fewest flights
 *     seen per city and only expand a later (pricier) pop if it used fewer
 *     flights. Plain Dijkstra on price alone is wrong.
 *   • DFS over all routes is exponential (10^8 routes in the layered
 *     performance test); DFS with memoization on (city, stopsLeft) is fine.
 *   • Off-by-one: k stops = k + 1 flights = k + 1 rounds.
 *   • Relaxing in place (no copy) is the classic bug — see the tests where
 *     flights are ordered so that it chains within a round.
 */

/**
 * @param {number} n
 * @param {number[][]} flights
 * @param {number} src
 * @param {number} dst
 * @param {number} k
 * @returns {number}
 */
export function findCheapestPrice(n, flights, src, dst, k) {
  // cost[v] = cheapest price to reach v using at most `round` flights.
  let cost = new Array(n).fill(Infinity);
  cost[src] = 0;

  // k stops ⇔ at most k + 1 flights ⇔ k + 1 rounds of relaxation.
  for (let round = 1; round <= k + 1; round++) {
    const next = cost.slice(); // routes with fewer flights stay valid
    let changed = false;

    for (const [from, to, price] of flights) {
      if (cost[from] === Infinity) continue; // `from` not reachable yet
      const candidate = cost[from] + price; // extend a route from LAST round
      if (candidate < next[to]) {
        next[to] = candidate;
        changed = true;
      }
    }

    cost = next;
    if (!changed) break; // nothing improved, more rounds won't help either
  }

  return cost[dst] === Infinity ? -1 : cost[dst];
}
