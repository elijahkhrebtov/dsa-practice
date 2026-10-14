/*
 * Title:      Redundant Connection
 * Difficulty: Medium
 * Patterns:   Union-Find
 *
 * Solution — Redundant Connection
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * Rebuild the graph one edge at a time, in input order, keeping track of
 * which vertices are already connected. A tree edge always joins two
 * vertices that were NOT connected yet. The first edge whose endpoints are
 * ALREADY connected closes the (only) cycle — and it's exactly the answer:
 *
 *   • It is on the cycle (it closes it).
 *   • Every other cycle edge appeared earlier in the input, because the
 *     path it completes was already built. So it is the cycle edge that
 *     comes last — the one the problem asks for.
 *
 * "Are a and b already connected?" while edges keep arriving is the
 * textbook job for union-find.
 *
 * Approach (union-find)
 * ─────────────────────
 *   1. parent[v] = v for v in 1 … n; rank[v] = 0.
 *   2. For each edge [a, b] in order:
 *        ra = find(a), rb = find(b)
 *        if ra === rb → return this edge (exactly as given)
 *        else union the two roots (attach the lower-rank root under the
 *        higher-rank one).
 *   3. (Unreachable for valid input.)
 *
 * Walkthrough — [[1,2],[2,3],[3,4],[1,4],[1,5]]
 * ───────────
 *   [1,2]: roots 1,2 differ → union       sets {1,2} {3} {4} {5}
 *   [2,3]: roots differ → union           {1,2,3} {4} {5}
 *   [3,4]: roots differ → union           {1,2,3,4} {5}
 *   [1,4]: find(1) === find(4) → return [1, 4]
 *
 * Complexity
 * ──────────
 *   Time:  O(n · α(n)) — n finds/unions with path compression + union by
 *          rank; α(n) ≤ 4 in practice.
 *   Space: O(n) — parent and rank arrays.
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Brute force: remove each edge from the last one backwards and check
 *     whether the rest is connected — O(n) checks of O(n) each = O(n²).
 *   • DFS per edge: before adding [a, b], search the graph built so far for
 *     a path a → b; if one exists, this edge is redundant. Also O(n²), and
 *     a recursive search can overflow on long paths.
 *   • Find the whole cycle (e.g. by repeatedly trimming degree-1 vertices),
 *     then pick the cycle edge with the largest input index. Linear, but
 *     more code.
 *   • Returning a re-ordered pair ([1, 4] instead of the input's [4, 1])
 *     fails — return the input edge itself.
 *   • Without path compression and union by rank, union-find can build
 *     O(n)-tall chains (a star whose edges are [1, i]) and go quadratic.
 */

/**
 * @param {number[][]} edges
 * @returns {number[]}
 */
export function findRedundantConnection(edges) {
  const n = edges.length; // a tree on n vertices has n − 1 edges, plus the extra one
  const parent = new Int32Array(n + 1);
  for (let v = 0; v <= n; v++) parent[v] = v;
  const rank = new Uint8Array(n + 1);

  // Iterative find with path compression (no recursion → no stack overflow).
  const find = (x) => {
    let root = x;
    while (parent[root] !== root) root = parent[root];
    while (parent[x] !== root) {
      const up = parent[x];
      parent[x] = root;
      x = up;
    }
    return root;
  };

  for (const edge of edges) {
    const ra = find(edge[0]);
    const rb = find(edge[1]);
    if (ra === rb) return edge; // already connected → this edge closes the cycle

    // Union by rank: the shorter tree goes under the taller one.
    if (rank[ra] < rank[rb]) parent[ra] = rb;
    else if (rank[ra] > rank[rb]) parent[rb] = ra;
    else {
      parent[rb] = ra;
      rank[ra]++;
    }
  }

  return []; // unreachable for valid input
}
