/*
 * Title:      Network Delay Time
 * Difficulty: Medium
 * Patterns:   Shortest Path, Heap
 *
 * Solution — Network Delay Time
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * Each node hears the signal at its shortest-path distance from k, so the
 * answer is max over all nodes of dist(k, v) — or -1 if any distance is
 * infinite. We need single-source shortest paths with non-negative weights,
 * which is exactly Dijkstra's algorithm.
 *
 * Why Dijkstra works: picture the signal spreading. The next node to light
 * up is always the unreached node with the smallest tentative arrival time.
 * Nothing can reach it sooner later, because any other route would pass
 * through some node that lights up even later and edges never subtract
 * time (w >= 0). So when we pop the smallest tentative distance, it is
 * final. A min-heap gives us "the smallest tentative distance" in O(log V).
 *
 * Approach (Dijkstra with a lazy-deletion heap)
 * ──────────────────────────────────────────────
 *   1. Build an adjacency list: adj[u] = [[v, w], …].
 *   2. dist[1..n] = Infinity, dist[k] = 0. Push [0, k] into a min-heap.
 *   3. While the heap is not empty:
 *        a. Pop [d, u]. If d > dist[u], it's a stale entry — skip.
 *        b. For each [v, w] in adj[u]: if d + w < dist[v], set
 *           dist[v] = d + w and push [dist[v], v].
 *   4. answer = max(dist[1..n]); return -1 if it is Infinity.
 *
 * Instead of a "decrease-key" operation (which our heap doesn't have), we
 * just push a new, better entry and ignore the old one when it surfaces.
 *
 * Walkthrough — times = [[1,2,10],[1,3,1],[3,2,2]], n = 3, k = 1
 * ───────────
 *   heap [[0,1]]                dist = {1:0, 2:∞, 3:∞}
 *   pop [0,1] → relax 1→2 (10), 1→3 (1)
 *   heap [[1,3],[10,2]]         dist = {1:0, 2:10, 3:1}
 *   pop [1,3] → relax 3→2: 1+2 = 3 < 10
 *   heap [[3,2],[10,2]]         dist = {1:0, 2:3, 3:1}
 *   pop [3,2] → no outgoing edges
 *   pop [10,2] → 10 > dist[2] = 3, stale, skip
 *   max(dist) = 3.
 *
 * Complexity
 * ──────────
 *   Time:  O((V + E) log V) — every edge can push at most one heap entry
 *          (so the heap holds O(E) items, and log E = O(log V)); building
 *          the adjacency list and the final max are O(V + E).
 *   Space: O(V + E) for the adjacency list, dist and the heap.
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • O(V²) Dijkstra without a heap: each round scan all nodes for the
 *     closest unfinished one. Good for dense graphs (E ≈ V²), wasteful on
 *     sparse ones.
 *   • Bellman-Ford: relax every edge, repeat up to V-1 times. O(V·E) — about
 *     10^9 relaxations for the performance test. Its advantage is that it
 *     handles negative weights, which we don't have.
 *   • Floyd–Warshall: all pairs in O(V³). Overkill for a single source.
 *   • Plain BFS is wrong: it finalizes nodes by number of hops, not by time.
 *   • Forgetting the stale-entry check still gives correct answers but can
 *     re-relax the same node many times.
 *   • Nodes are 1-indexed: size arrays n + 1 and skip index 0 when taking
 *     the max (or it will contribute Infinity / garbage).
 */

import { PriorityQueue } from '../../../lib/priority-queue.js';

/**
 * @param {number[][]} times
 * @param {number} n
 * @param {number} k
 * @returns {number}
 */
export function networkDelayTime(times, n, k) {
  // Adjacency list, 1-indexed: adj[u] = [[v, w], …]
  const adj = Array.from({ length: n + 1 }, () => []);
  for (const [u, v, w] of times) adj[u].push([v, w]);

  const dist = new Array(n + 1).fill(Infinity);
  dist[k] = 0;

  // Heap entries are [distance, node], smallest distance first.
  const heap = new PriorityQueue((a, b) => a[0] - b[0]);
  heap.push([0, k]);

  while (!heap.isEmpty()) {
    const [d, u] = heap.pop();
    if (d > dist[u]) continue; // outdated entry: u was already reached faster

    for (const [v, w] of adj[u]) {
      const candidate = d + w;
      if (candidate < dist[v]) {
        dist[v] = candidate;
        heap.push([candidate, v]);
      }
    }
  }

  let latest = 0;
  for (let v = 1; v <= n; v++) {
    if (dist[v] === Infinity) return -1; // someone never hears the signal
    if (dist[v] > latest) latest = dist[v];
  }
  return latest;
}
