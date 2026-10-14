/*
 * Title:      Pacific Atlantic Water Flow
 * Difficulty: Medium
 * Patterns:   Graph DFS, Matrix Traversal
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * An island is described by an m × n grid `heights`, where `heights[r][c]`
 * is the height of the land at row r, column c.
 *
 *   • The Pacific Ocean touches the island's TOP and LEFT edges.
 *   • The Atlantic Ocean touches the island's BOTTOM and RIGHT edges.
 *
 * When it rains, water on a cell can flow to any of its 4 neighbours (up,
 * down, left, right — not diagonally) whose height is LESS THAN OR EQUAL to
 * the current cell's height. Water on a cell next to an ocean can flow
 * straight into that ocean, so every cell in row 0 or column 0 drains into
 * the Pacific, and every cell in row m-1 or column n-1 drains into the
 * Atlantic. (The top-right and bottom-left corners touch both oceans.)
 *
 * Return the coordinates `[r, c]` of every cell from which rain water can
 * reach BOTH oceans.
 *
 *   • The result may be in any order, but each cell must appear only once.
 *   • Do not modify `heights`.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *              Pacific ~ ~ ~ ~ ~
 *                 ~  1  2  2  3 (5) *
 *                 ~  3  2  3 (4)(4) *
 *                 ~  2  4 (5) 3  1  *
 *                 ~ (6)(7) 1  4  5  *
 *                 ~ (5) 1  1  2  4  *
 *                    * * * * * Atlantic
 *
 *     Input:  heights = [[1, 2, 2, 3, 5],
 *                        [3, 2, 3, 4, 4],
 *                        [2, 4, 5, 3, 1],
 *                        [6, 7, 1, 4, 5],
 *                        [5, 1, 1, 2, 4]]
 *     Output: [[0, 4], [1, 3], [1, 4], [2, 2], [3, 0], [3, 1], [4, 0]]
 *     Why:    e.g. from (2, 2) = 5, water can go up 5 → 3 → 2 into the
 *             Pacific, and right 5 → 3 → 1 into the Atlantic.
 *             From (1, 1) = 2 it reaches the Pacific, but every path to
 *             the Atlantic would have to climb.
 *
 *   Example 2
 *     Input:  heights = [[1]]
 *     Output: [[0, 0]]
 *     Why:    a single cell touches all four edges, so both oceans.
 *
 *   Example 3
 *     Input:  heights = [[3, 3, 3],
 *                        [3, 1, 3],
 *                        [3, 3, 3]]
 *     Output: the 8 border cells (every cell except [1, 1])
 *     Why:    the border ring is a flat plateau touching both oceans, and
 *             water may flow between cells of equal height. The centre is
 *             a pit: water on it can't climb out.
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • m == heights.length, n == heights[r].length
 *   • 1 <= m, n <= 200
 *   • 0 <= heights[r][c] <= 10^5
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   O(m · n) time and space. Running a separate search from every cell is
 *   O((m · n)²) — the tests include 200 × 200 grids where that takes
 *   seconds.
 *
 *   JavaScript gotcha: a flat 200 × 200 plateau lets a recursive DFS go up
 *   to 40,000 calls deep, which overflows the JS call stack (roughly 10,000
 *   frames). Use an explicit stack or a BFS queue for the grid search.
 */

// ▶ Run tests:   npm run solve pacific-atlantic-water-flow
// ⟳ Watch mode:  npm run watch pacific-atlantic-water-flow

/**
 * Finds every cell from which rain water can flow into both the Pacific (top/left) and the Atlantic (bottom/right).
 *
 * @param {number[][]} heights - m × n grid of land heights; must not be modified.
 * @returns {number[][]} The `[row, col]` pairs of all qualifying cells, in any order, each exactly once.
 */
export function pacificAtlantic(heights) {
  // Your code here
}
