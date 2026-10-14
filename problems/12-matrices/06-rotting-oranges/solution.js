/*
 * Title:      Rotting Oranges
 * Difficulty: Medium
 * Patterns:   Graph BFS, Matrix Traversal
 *
 * Solution — Rotting Oranges
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * The minute a fresh orange rots equals its distance (in steps through
 * orange cells) to the NEAREST rotten orange. The answer is therefore the
 * largest such distance, or -1 if some fresh orange isn't reachable at all.
 *
 * BFS computes shortest distances in an unweighted graph. Here there are
 * many starting points that all spread at the same time, so we use
 * MULTI-SOURCE BFS: put every initially rotten orange in the queue at
 * distance 0. BFS then processes the oranges in "rings": first everything
 * at distance 1 from any source, then distance 2, and so on. That is
 * exactly the minute-by-minute spread, but each orange is handled once
 * instead of the whole grid being re-scanned every minute.
 *
 * Approach (level-by-level multi-source BFS)
 * ──────────────────────────────────────────
 *   1. Scan the grid once: push every rotten cell into the queue and count
 *      the fresh ones. If fresh === 0, return 0.
 *   2. minutes = 0. While the queue has cells AND fresh > 0:
 *        • Take the whole current level (everything that rotted in the
 *          previous minute). For each cell, rot every fresh 4-neighbour:
 *          set it to 2, fresh--, and push it into the next level.
 *        • minutes++.
 *   3. Return fresh === 0 ? minutes : -1.
 *
 * Stopping as soon as fresh hits 0 avoids counting one extra "empty"
 * minute for the last level, which has nothing left to infect.
 *
 * Walkthrough — Example 4: [2, 1, 1, 1, 2]
 * ───────────
 *   start:    queue = [(0,0), (0,4)], fresh = 3
 *   minute 1: (0,0) rots (0,1); (0,4) rots (0,3)  → fresh = 1
 *   minute 2: (0,1) rots (0,2); (0,3) finds nothing new → fresh = 0
 *   fresh is 0 → answer 2. Two separate BFS runs, one per source, would
 *   wrongly suggest 4 (or need extra min-merging).
 *
 * Complexity
 * ──────────
 *   Time:  O(m·n) — one scan, and every orange enters the queue at most
 *          once and checks 4 neighbours.
 *   Space: O(m·n) for the queue in the worst case.
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Simulating minute by minute (scan the grid, collect the fresh oranges
 *     next to a rotten one, rot them, repeat) is correct but O(m·n) per
 *     minute. On a long snake that is O((m·n)²) overall: 22,000+ full scans of
 *     90,000 cells in the performance test.
 *   • Rotting cells during the scan, in the same grid, lets the rot travel
 *     several cells in one "minute". Collect first, then apply (the BFS
 *     levels do this naturally).
 *   • Running a separate BFS from each rotten orange is slower and needs a
 *     min over all of them. One multi-source BFS does it all.
 *   • Edge cases: no fresh oranges → 0 (even with no rotten ones); fresh
 *     oranges but no rotten ones → -1.
 *   • Use a head index for the queue (or swap level arrays as below), not
 *     `shift()`, which is O(n) per call.
 */

const DIRS = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

/**
 * @param {number[][]} grid
 * @returns {number}
 */
export function orangesRotting(grid) {
  const m = grid.length;
  const n = grid[0].length;
  let fresh = 0;
  let level = []; // cells that became rotten in the previous minute

  // 1. All initially rotten oranges are sources at distance 0.
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (grid[r][c] === 2) level.push([r, c]);
      else if (grid[r][c] === 1) fresh++;
    }
  }
  if (fresh === 0) return 0;

  // 2. Spread one ring per minute.
  let minutes = 0;
  while (level.length > 0 && fresh > 0) {
    const next = [];
    for (const [r, c] of level) {
      for (const [dr, dc] of DIRS) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr < 0 || nr >= m || nc < 0 || nc >= n) continue;
        if (grid[nr][nc] !== 1) continue;
        grid[nr][nc] = 2; // rot it now so it's never enqueued twice
        fresh--;
        next.push([nr, nc]);
      }
    }
    level = next;
    minutes++;
  }

  // 3. Anything still fresh was unreachable.
  return fresh === 0 ? minutes : -1;
}
