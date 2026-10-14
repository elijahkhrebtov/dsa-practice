/*
 * Title:      Rotting Oranges
 * Difficulty: Medium
 * Patterns:   Graph BFS, Matrix Traversal
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * You are given an m × n grid where each cell is one of:
 *
 *   0  an empty cell
 *   1  a fresh orange
 *   2  a rotten orange
 *
 * Every minute, every fresh orange that is directly next to a rotten one
 * (up, down, left or right; NOT diagonally) becomes rotten. All rotten
 * oranges spread at the same time, and an orange that turns rotten during
 * minute k only starts spreading in minute k + 1.
 *
 * Return the minimum number of minutes that must pass until no fresh
 * orange is left. If some fresh orange can never rot, return -1.
 *
 *   • If there are no fresh oranges to begin with, the answer is 0, even if
 *     there are no rotten oranges either.
 *   • You may modify `grid`; the tests always pass a fresh copy.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  grid = [[2, 1, 1],
 *                     [1, 1, 0],
 *                     [0, 1, 1]]
 *     Output: 4
 *     Why:    minute 0      minute 1      minute 2      minute 3      minute 4
 *             2 1 1         2 2 1         2 2 2         2 2 2         2 2 2
 *             1 1 0         2 1 0         2 2 0         2 2 0         2 2 0
 *             0 1 1         0 1 1         0 1 1         0 2 1         0 2 2
 *
 *   Example 2
 *     Input:  grid = [[2, 1, 1],
 *                     [0, 1, 1],
 *                     [1, 0, 1]]
 *     Output: -1
 *     Why:    The orange in the bottom-left corner is walled off by empty
 *             cells (diagonal contact doesn't spread rot).
 *
 *   Example 3
 *     Input:  grid = [[0, 2]]
 *     Output: 0
 *     Why:    There are no fresh oranges, so no time needs to pass.
 *
 *   Example 4
 *     Input:  grid = [[2, 1, 1, 1, 2]]
 *     Output: 2
 *     Why:    Both rotten oranges spread at the same time and meet in the
 *             middle. It's not 4 minutes.
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 1 <= m, n <= 300 (m = grid.length, n = grid[0].length)
 *   • grid[r][c] is 0, 1 or 2
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   O(m·n) time. Simulating minute by minute, re-scanning the whole grid
 *   each minute, costs O(m·n) PER MINUTE, and the tests include a 300 × 300
 *   snake-shaped orchard that takes over 20,000 minutes to rot. Process each
 *   orange once, starting from all rotten oranges at the same time.
 */

// ▶ Run tests:   npm run solve rotting-oranges
// ⟳ Watch mode:  npm run watch rotting-oranges

/**
 * Computes how many minutes it takes for the rot to reach every fresh orange.
 *
 * @param {number[][]} grid - The m × n grid of 0 (empty), 1 (fresh) and 2 (rotten); may be modified.
 * @returns {number} Minutes until no fresh orange remains, or -1 if that never happens.
 */
export function orangesRotting(grid) {
  // Your code here
}
