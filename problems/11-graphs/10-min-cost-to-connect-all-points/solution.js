/*
 * Title:      Min Cost to Connect All Points
 * Difficulty: Medium
 * Patterns:   Minimum Spanning Tree, Union-Find, Heap
 *
 * Solution — Min Cost to Connect All Points
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * Points are nodes, every pair is an edge weighted by Manhattan distance,
 * and we want the cheapest edge set that connects everything. A cheapest
 * such set never contains a cycle (drop the most expensive edge of the
 * cycle and everything stays connected, cheaper), so it is a tree with
 * n - 1 edges: a minimum spanning tree (MST).
 *
 * Both classic MST algorithms rest on the "cut property": for any split of
 * the nodes into two groups, the cheapest edge crossing the split is safe to
 * include. Prim applies it to the split {tree so far} vs {everything else}.
 *
 * The graph here is COMPLETE — ~500,000 edges for 1000 points. Prim with a
 * simple array (no heap) costs O(n²) total, which is as fast as merely
 * listing the edges, and it computes distances on the fly instead of
 * storing them.
 *
 * Approach (array-based Prim)
 * ───────────────────────────
 *   1. best[i] = cheapest known cost to attach point i to the tree;
 *      Infinity for all, best[0] = 0. inTree[i] = false.
 *   2. Repeat n times:
 *        a. Pick u = the point not in the tree with the smallest best[u].
 *        b. Add it: inTree[u] = true, total += best[u].
 *        c. For every point v not yet in the tree:
 *             best[v] = min(best[v], dist(u, v)).
 *   3. Return total.
 *
 * Walkthrough — [[0,0], [2,2], [3,10], [5,2], [7,0]]  (call them A…E)
 * ───────────
 *   start: best = [0, ∞, ∞, ∞, ∞]
 *   add A (0):  best ← dist from A: B 4, C 13, D 7, E 7
 *   add B (4):  from B: C 9, D 3, E 7      → best = [-, -, 9, 3, 7]
 *   add D (3):  from D: C 10 (keep 9), E 4 → best = [-, -, 9, -, 4]
 *   add E (4):  from E: C 13 (keep 9)
 *   add C (9).  total = 0 + 4 + 3 + 4 + 9 = 20
 *
 * Complexity
 * ──────────
 *   Time:  O(n²) — n rounds, each scanning all points twice (find the
 *          minimum, then update distances).
 *   Space: O(n) — two arrays. No edge list is ever built.
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Kruskal: build all n(n-1)/2 edges, sort by weight, and add each edge
 *     whose endpoints are in different Union-Find sets; stop after n - 1
 *     edges. O(n² log n) time and O(n²) memory for the edge list — fine for
 *     n = 1000, but it does more work than Prim on a dense graph. Kruskal
 *     shines on SPARSE graphs given as an edge list.
 *   • Heap-based ("lazy") Prim: push [dist, point] for every outside point
 *     each time a point joins, pop the cheapest, skip points already in the
 *     tree. O(n² log n) here — the heap pays off only when each node has
 *     few neighbours.
 *   • Re-scanning every (tree point, outside point) pair at each step to
 *     find the cheapest crossing edge is O(n³) — keep best[] instead.
 *   • Greedily walking to the nearest unvisited point from the LAST point
 *     builds a path, not a tree, and is not optimal.
 *   • Use Manhattan distance |dx| + |dy|, not Euclidean.
 */

/**
 * @param {number[][]} points
 * @returns {number}
 */
export function minCostConnectPoints(points) {
  const n = points.length;
  const best = new Float64Array(n).fill(Infinity); // cheapest edge from the tree to each point
  const inTree = new Uint8Array(n);
  best[0] = 0; // start the tree at point 0 (any point works)

  let total = 0;
  for (let round = 0; round < n; round++) {
    // a. Closest point that is still outside the tree.
    let u = -1;
    for (let i = 0; i < n; i++) {
      if (!inTree[i] && (u === -1 || best[i] < best[u])) u = i;
    }

    // b. Attach it with its cheapest edge.
    inTree[u] = 1;
    total += best[u];

    // c. The tree grew: points may now be closer to it via u.
    const [ux, uy] = points[u];
    for (let v = 0; v < n; v++) {
      if (inTree[v]) continue;
      const d = Math.abs(points[v][0] - ux) + Math.abs(points[v][1] - uy);
      if (d < best[v]) best[v] = d;
    }
  }

  return total;
}
