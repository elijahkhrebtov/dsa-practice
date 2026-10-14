/*
 * Title:      Network Delay Time
 * Difficulty: Medium
 * Patterns:   Shortest Path, Heap
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * A network has `n` nodes labelled 1 … n. You are given `times`, a list of
 * directed, weighted edges: times[i] = [u, v, w] means a signal sent from
 * node `u` reaches node `v` after `w` time units. An edge only works in the
 * direction u → v.
 *
 * At time 0 a signal is sent from node `k`. It spreads along every edge
 * simultaneously, so each node receives it at the length of the shortest
 * (minimum total time) path from `k` to that node.
 *
 * Return the time at which the LAST node receives the signal, i.e. the
 * largest shortest-path distance from `k`. If some node can never receive
 * it, return -1.
 *
 *   • There may be several edges between the same pair of nodes (with
 *     different times) — the faster one wins.
 *   • Edges may have time 0.
 *   • Node k itself receives the signal at time 0, so for n = 1 the answer
 *     is 0.
 *   • Do not modify `times`.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  times = [[2, 1, 1], [2, 3, 1], [3, 4, 1]], n = 4, k = 2
 *     Output: 2
 *     Why:    Node 2 sends at 0; nodes 1 and 3 receive at 1; node 4
 *             receives at 2 (via 3). The last arrival is at time 2.
 *
 *   Example 2
 *     Input:  times = [[1, 2, 1]], n = 2, k = 1
 *     Output: 1
 *
 *   Example 3
 *     Input:  times = [[1, 2, 1]], n = 2, k = 2
 *     Output: -1
 *     Why:    The edge points from 1 to 2, so node 1 never hears from 2.
 *
 *   Example 4
 *     Input:  times = [[1, 2, 10], [1, 3, 1], [3, 2, 2]], n = 3, k = 1
 *     Output: 3
 *     Why:    The detour 1 → 3 → 2 (1 + 2 = 3) beats the direct edge
 *             1 → 2 (10). Node 2 receives at 3, node 3 at 1.
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 1 <= k <= n <= 10^4
 *   • 0 <= times.length <= 10^5
 *   • times[i] = [u, v, w] with 1 <= u, v <= n and 0 <= w <= 100
 *   • Self-loops (u = v) and repeated (u, v) pairs may appear.
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   Dijkstra's algorithm with a min-heap: O((V + E) log V) time, O(V + E)
 *   space. You may import `PriorityQueue` from
 *   `../../../lib/priority-queue.js`.
 *
 *   The performance test uses 10,000 nodes and 100,000 edges arranged so
 *   that Bellman-Ford (O(V·E), ~10^9 relaxations) is far too slow. The
 *   simple O(V²) array version of Dijkstra (scan for the closest unvisited
 *   node) is borderline-acceptable at this size, but the heap version is
 *   the one to learn — it scales to sparse graphs of any size.
 */

// ▶ Run tests:   npm run solve network-delay-time
// ⟳ Watch mode:  npm run watch network-delay-time

/**
 * Computes how long it takes for a signal sent from node k to reach every node.
 *
 * @param {number[][]} times - Directed edges [u, v, w]: travelling u → v takes w time units.
 * @param {number} n - Number of nodes, labelled 1 … n.
 * @param {number} k - The node that sends the signal at time 0.
 * @returns {number} The time when the last node receives the signal, or -1 if some node is unreachable.
 */
export function networkDelayTime(times, n, k) {
  // Your code here
}
