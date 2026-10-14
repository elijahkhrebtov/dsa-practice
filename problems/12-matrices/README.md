# Matrices and Grids

A **matrix** (or **grid**) is a two-dimensional table of values, addressed by a **row** index and a **column** index. Images, game boards, maps, spreadsheets and DP tables are all matrices. Grid problems come in a few flavours:

- **Pure index gymnastics**: walk the cells in an unusual order (spiral, diagonal) or rearrange them in place (rotate, transpose).
- **Sorted matrices**: treat the grid as one long sorted array and binary search it.
- **Grids as graphs**: every cell is a node, and it is connected to its neighbours. Flood fill, islands, shortest paths and "spreading" simulations are graph searches in disguise.
- **Grid DP**: the answer for a cell depends on the answers for the cells above / to the left (or on its neighbours, with memoization).

```
          col 0  col 1  col 2  col 3
row 0   [   1  ,   2  ,   3  ,   4  ]
row 1   [   5  ,   6  ,   7  ,   8  ]       grid[1][2] === 7
row 2   [   9  ,  10  ,  11  ,  12  ]       m = 3 rows, n = 4 columns
```

## Matrices in JavaScript

JavaScript has no real 2D array. A matrix is an **array of row arrays**: `grid[r]` is a row, `grid[r][c]` is a cell. Always read it as *row first, then column* — `grid[r][c]`, never `grid[x][y]` with `x` meaning "horizontal". Mixing those up is the single most common grid bug, and square test grids hide it.

```js
const m = grid.length;     // number of rows
const n = grid[0].length;  // number of columns (assumes m > 0)
```

### Creating a matrix: the shared-row trap

```js
// ✗ WRONG: every row is the SAME array object
const bad = Array(3).fill([]);          // or Array(3).fill(Array(4).fill(0))
bad[0].push(1);
console.log(bad);                       // [[1], [1], [1]]  ← all rows changed!

// ✓ RIGHT: Array.from calls the factory once per row
const good = Array.from({ length: m }, () => Array(n).fill(0));
const visited = Array.from({ length: m }, () => new Array(n).fill(false));
```

`fill(value)` puts the *same value* in every slot. For a primitive that's fine; for an array it means every slot points at one shared row. `Array.from({ length }, factory)` builds a fresh row each time.

Copying has the same trap: `grid.slice()` and `[...grid]` copy only the **outer** array, so the rows are still shared. A real copy is `grid.map((row) => row.slice())` (or `structuredClone(grid)`).

### Flat storage

For big grids you can store everything in one flat (typed) array and convert between a flat index and a cell:

```js
const idx = r * n + c;                       // (r, c) → index   (n = number of COLUMNS)
const r = Math.floor(idx / n), c = idx % n;  // index → (r, c)
const seen = new Uint8Array(m * n);          // compact visited array
```

This is also how a sorted matrix becomes "one long sorted array" for binary search (problem 04). Note that you divide by the number of **columns**, not rows — another bug that square grids hide.

## Neighbours and bounds

Write the neighbour offsets once as a **direction array** instead of four copy-pasted `if`s:

```js
const DIRS4 = [[1, 0], [-1, 0], [0, 1], [0, -1]];            // down, up, right, left
const DIRS8 = [...DIRS4, [1, 1], [1, -1], [-1, 1], [-1, -1]]; // + diagonals

for (const [dr, dc] of DIRS4) {
  const nr = r + dr, nc = c + dc;
  if (nr < 0 || nr >= m || nc < 0 || nc >= n) continue;  // bounds check FIRST
  // ... use grid[nr][nc]
}
```

Check the bounds **before** reading the cell. In JS, `grid[-1]` is `undefined`, so `grid[-1][0]` throws a `TypeError`. `grid[0][-1]` is quietly `undefined`, which can hide a bug instead of crashing. Unless a problem says otherwise, only the 4 orthogonal neighbours count — diagonal cells do **not** touch.

## Grids as implicit graphs

You never build an adjacency list: the neighbours of `(r, c)` are computed on the fly.

- **DFS / flood fill**: from a start cell, visit every reachable cell that satisfies a condition. Mark a cell as visited **when you first reach it**, so it can never be added twice.
- **BFS**: explores in rings of increasing distance, so the first time BFS reaches a cell is along a shortest path (in steps). Use it for "minimum number of moves/minutes".
- **Multi-source BFS**: put *all* the starting cells in the queue at distance 0. Then everything spreads simultaneously, and one BFS gives each cell its distance to the *nearest* source (problem 06). Running a separate BFS from each source is both slower and wrong for "simultaneous" spreading.
- **Counting components**: scan every cell; each unvisited cell of interest starts a new traversal that marks its whole component. The number of traversals started is the number of components (problem 05).
- **Reverse search**: when the question is "which cells can reach the border?", it's often easier to start from the border and walk backwards (problem 07).

### The recursion-depth trap

A recursive DFS is short and pretty, but every cell on the current path is a stack frame. Node's default stack holds roughly 10,000 simple frames, while a 500 × 500 grid of one colour, or a long snake-shaped island, can push the recursion **hundreds of thousands** of levels deep:

```
RangeError: Maximum call stack size exceeded
```

Several tests in this topic use exactly such grids. Turn the recursion into a loop with an **explicit stack** (an array with `push`/`pop`) or a **queue** (an array with a head index — never `shift()`, which is O(n)):

```js
const stack = [[sr, sc]];
mark(sr, sc);
while (stack.length) {
  const [r, c] = stack.pop();
  for (const [dr, dc] of DIRS4) {
    const nr = r + dr, nc = c + dc;
    if (inBounds(nr, nc) && !isMarked(nr, nc) && isWanted(nr, nc)) {
      mark(nr, nc);                 // mark when PUSHING, not when popping
      stack.push([nr, nc]);
    }
  }
}
```

Recursion is still fine when the depth is naturally small, for example word search (depth ≤ word length) or N-Queens (depth = n).

## In-place tricks

- **Markers instead of a visited array**: overwrite visited cells (land `'1'` → `'0'`, fresh → rotten, a letter → `'#'` during backtracking and back again afterwards). That saves O(m·n) memory, but only do it when the problem allows modifying the input.
- **Transpose + reverse**: rotating a square matrix 90° clockwise = transpose (swap `a[i][j]` with `a[j][i]` for `j > i`) and then reverse every row. Counter-clockwise = transpose, then reverse the order of the rows.
- **Layer by layer**: spiral order and rotation both work on concentric rings, shrinking `top / bottom / left / right` boundaries.
- **First row/column as storage**: some problems (e.g. Set Matrix Zeroes) reuse row 0 and column 0 as flag arrays to get O(1) extra space.

## Grid DP

When you can only move right/down, the number of ways (or the cheapest cost) to reach `(r, c)` depends only on `(r - 1, c)` and `(r, c - 1)`:

```
dp[r][c] = dp[r - 1][c] + dp[r][c - 1]      (0 if the cell is blocked)
```

Fill row by row. Since each row only needs the previous one, a single 1D array of length `n` is enough. When moves can go in any direction there is no natural fill order: use **DFS + memoization** instead, which works as long as the dependencies can't form a cycle (problem 10: strictly increasing paths).

## Complexity

| Operation | Time | Extra space |
| --- | --- | --- |
| Read / write `grid[r][c]` | O(1) | — |
| Visit every cell (any traversal) | O(m·n) | O(1) |
| DFS / BFS over the grid | O(m·n) — each cell is visited once, 4 neighbours each | O(m·n) visited + stack/queue |
| Binary search a fully sorted matrix | O(log(m·n)) | O(1) |
| Staircase search (rows and columns sorted separately) | O(m + n) | O(1) |
| Rotate / transpose in place | O(n²) | O(1) |
| Copy a grid | O(m·n) | O(m·n) |
| Grid DP | O(m·n) | O(m·n), often O(n) with a rolling row |

## Patterns in this topic

- **Matrix Traversal**: direction arrays, bounds checks, boundary-shrinking loops, in-place rearrangement.
- **Simulation**: follow the rules literally (spiral walk, step-by-step spreading) while staying efficient.
- **Binary Search**: on a matrix flattened to a virtual 1D array.
- **Graph DFS / Graph BFS**: flood fill, connected components, multi-source BFS, reverse reachability.
- **Backtracking**: try a move, recurse, undo (word search, N-Queens).
- **Dynamic Programming / Memoization**: path counting on grids, longest path in a DAG made of cells.

## Problem order

1. **Flood Fill** (Easy): the basic grid DFS/BFS, plus the "new colour equals old colour" trap.
2. **Spiral Matrix** (Medium): boundary-shrinking traversal.
3. **Rotate Image** (Medium): transpose + reverse, in place.
4. **Search a 2D Matrix** (Medium): binary search over a virtual flattened array.
5. **Number of Islands** (Medium): counting connected components.
6. **Rotting Oranges** (Medium): multi-source BFS, level by level.
7. **Pacific Atlantic Water Flow** (Medium): reverse reachability from the borders.
8. **Word Search** (Medium): backtracking on a grid with temporary markers.
9. **Unique Paths II** (Medium): grid DP with obstacles.
10. **Longest Increasing Path in a Matrix** (Hard): DFS + memoization on an implicit DAG.
11. **N-Queens** (Hard): backtracking with O(1) conflict checks on rows, columns and diagonals.
