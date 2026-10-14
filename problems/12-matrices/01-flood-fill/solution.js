/*
 * Title:      Flood Fill
 * Difficulty: Easy
 * Patterns:   Matrix Traversal, Graph DFS
 *
 * Solution — Flood Fill
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * Treat the image as a graph: every pixel is a node, and it has an edge to
 * each of its (up to) 4 neighbours that has the same original colour. The
 * region to repaint is exactly the connected component that contains
 * (sr, sc), and any graph traversal (DFS or BFS) visits that component.
 *
 * We don't even need a separate `visited` grid: a pixel we've repainted no
 * longer has the original colour, so the "same colour as the start?" check
 * automatically skips it. That trick only works if the new colour really
 * is different. When `color === original` a repainted pixel still looks
 * unvisited and the traversal never ends, so we handle that case first:
 * there's nothing to change.
 *
 * Approach (iterative DFS with an explicit stack)
 * ─────────────────────────────────────────────────
 *   1. original = image[sr][sc]. If original === color, return image.
 *   2. Paint (sr, sc) and push it on a stack.
 *   3. While the stack is not empty: pop (r, c). For each of the 4
 *      neighbours that is inside the grid and still has the original
 *      colour, paint it right away and push it.
 *   4. Return image.
 *
 * Painting when we PUSH (not when we pop) guarantees every pixel enters the
 * stack at most once, so the stack never grows beyond m·n entries.
 *
 * Walkthrough — Example 1, start (1, 1), 1 → 2
 * ───────────
 *   paint (1,1), stack [(1,1)]
 *   pop (1,1): neighbours (2,1)=0 ✗, (0,1)=1 ✓, (1,2)=0 ✗, (1,0)=1 ✓
 *              paint both, stack [(0,1), (1,0)]
 *   pop (1,0): (2,0)=1 ✓, (0,0)=1 ✓ → paint, stack [(0,1), (2,0), (0,0)]
 *   pop (0,0): neighbours are already 2 or out of bounds
 *   pop (2,0): (2,1)=0 ✗
 *   pop (0,1): (0,2)=1 ✓ → paint, stack [(0,2)]
 *   pop (0,2): (1,2)=0 ✗ → stack empty, done.
 *   (2,2) is only diagonally adjacent to the region, so it stays 1.
 *
 * Complexity
 * ──────────
 *   Time:  O(m·n) — each pixel is painted and pushed at most once and
 *          looks at 4 neighbours.
 *   Space: O(m·n) in the worst case for the stack (the whole image is one
 *          region). The image itself is modified in place.
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Recursive DFS is the textbook version and fine for small images, but
 *     on a 500 × 500 single-colour image the recursion goes ~250,000 levels
 *     deep, and Node's stack holds only about 10,000 frames:
 *     "RangeError: Maximum call stack size exceeded".
 *   • BFS with a queue works just as well. Use a head index instead of
 *     `queue.shift()`, which is O(n) per call.
 *   • Forgetting the `color === original` early return means an infinite
 *     loop (iterative) or a stack overflow (recursive).
 *   • Read the original colour BEFORE painting the start pixel; reading
 *     `image[sr][sc]` afterwards gives you the new colour.
 *   • Check bounds before indexing: `image[-1]` is undefined, so
 *     `image[-1][c]` throws.
 */

const DIRS = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

/**
 * @param {number[][]} image
 * @param {number} sr
 * @param {number} sc
 * @param {number} color
 * @returns {number[][]}
 */
export function floodFill(image, sr, sc, color) {
  const original = image[sr][sc];
  if (original === color) return image; // nothing to do — and avoids an endless fill

  const m = image.length;
  const n = image[0].length;

  image[sr][sc] = color;
  const stack = [[sr, sc]];

  while (stack.length > 0) {
    const [r, c] = stack.pop();
    for (const [dr, dc] of DIRS) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr < 0 || nr >= m || nc < 0 || nc >= n) continue; // bounds first
      if (image[nr][nc] !== original) continue; // other colour, or already painted
      image[nr][nc] = color; // paint on push → each pixel is pushed once
      stack.push([nr, nc]);
    }
  }

  return image;
}
