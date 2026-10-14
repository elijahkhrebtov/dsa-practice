import { describe, it, expect } from 'vitest';
import { longestIncreasingPath } from './problem.js';
import { createRng, randomInt, measure } from '../../../lib/test-utils.js';

/** Builds an m × n grid from a function of (r, c). */
const grid = (m, n, f) => Array.from({ length: m }, (_, r) => Array.from({ length: n }, (_, c) => f(r, c)));

/** Brute-force oracle: DFS from every cell with no memo (exponential — small grids only). */
function bruteForce(matrix) {
  const m = matrix.length;
  const n = matrix[0].length;
  const longestFrom = (r, c) => {
    let best = 1;
    for (const [nr, nc] of [[r + 1, c], [r - 1, c], [r, c + 1], [r, c - 1]]) {
      if (nr >= 0 && nc >= 0 && nr < m && nc < n && matrix[nr][nc] > matrix[r][c]) {
        best = Math.max(best, 1 + longestFrom(nr, nc));
      }
    }
    return best;
  };
  let best = 0;
  for (let r = 0; r < m; r++) for (let c = 0; c < n; c++) best = Math.max(best, longestFrom(r, c));
  return best;
}

/**
 * 200 × 200 "snake": even rows hold consecutive increasing values (alternating
 * left→right and right→left), joined by one connector cell at the end of each odd
 * row. Every other cell is a wall of value 2^31 - 1. The snake is 20,099 cells
 * long, and from its last cell you can still step up onto a wall: 20,100.
 */
function snakeMatrix() {
  const N = 200;
  const WALL = 2 ** 31 - 1;
  const matrix = grid(N, N, () => WALL);
  let value = 0;
  for (let r = 0; r < N; r += 2) {
    const leftToRight = (r / 2) % 2 === 0;
    for (let i = 0; i < N; i++) matrix[r][leftToRight ? i : N - 1 - i] = value++;
    if (r + 1 < N - 1) matrix[r + 1][leftToRight ? N - 1 : 0] = value++; // connector to the next snake row
  }
  return matrix;
}

describe('Longest Increasing Path in a Matrix', () => {
  describe('examples from the problem', () => {
    it('[[9,9,4],[6,6,8],[2,1,1]] → 4 (1 → 2 → 6 → 9)', () => {
      expect(longestIncreasingPath([[9, 9, 4], [6, 6, 8], [2, 1, 1]])).toBe(4);
    });

    it('[[3,4,5],[3,2,6],[2,2,1]] → 4 (3 → 4 → 5 → 6; 3 → 3 is not an increase)', () => {
      expect(longestIncreasingPath([[3, 4, 5], [3, 2, 6], [2, 2, 1]])).toBe(4);
    });

    it('[[7]] → 1 (a single cell is a path of length 1)', () => {
      expect(longestIncreasingPath([[7]])).toBe(1);
    });
  });

  describe('edge cases', () => {
    it('all values equal → 1 (equal neighbours are not strictly increasing)', () => {
      expect(longestIncreasingPath(grid(4, 5, () => 3))).toBe(1);
    });

    it('a single increasing row [1, 2, 3, 4, 5] → 5', () => {
      expect(longestIncreasingPath([[1, 2, 3, 4, 5]])).toBe(5);
    });

    it('a single decreasing column → its full height (paths may go UP the grid)', () => {
      expect(longestIncreasingPath([[5], [4], [3], [2], [1]])).toBe(5);
    });

    it('a zig-zag row [3, 1, 4, 1, 5] → 2 (every peak is surrounded by valleys)', () => {
      expect(longestIncreasingPath([[3, 1, 4, 1, 5]])).toBe(2);
    });

    it('equal values break a run: [[1, 2, 2, 3]] → 2', () => {
      expect(longestIncreasingPath([[1, 2, 2, 3]])).toBe(2);
    });

    it('handles 0 and 2^31 - 1', () => {
      expect(longestIncreasingPath([[0, 2 ** 31 - 1], [1, 2 ** 31 - 2]])).toBe(4);
    });
  });

  describe('tricky cases', () => {
    it('[[1, 2], [4, 3]] → 4 (the path turns: right, down, left)', () => {
      expect(longestIncreasingPath([[1, 2], [4, 3]])).toBe(4);
    });

    it('a 3×3 spiral 1..9 → 9 (the path uses all four directions)', () => {
      // 1 2 3
      // 8 9 4
      // 7 6 5
      expect(longestIncreasingPath([[1, 2, 3], [8, 9, 4], [7, 6, 5]])).toBe(9);
    });

    it('the longest path does not have to start at the smallest value', () => {
      // The 0 is trapped among 9s (length 2); the run 1 → 2 → 3 → 4 → 5 is elsewhere.
      const matrix = [
        [9, 9, 9, 9],
        [9, 0, 9, 9],
        [9, 9, 9, 9],
        [1, 2, 3, 4],
        [9, 9, 9, 5],
      ];
      expect(longestIncreasingPath(matrix)).toBe(6); // 1 2 3 4 5 9
    });

    it('the longest path does not have to end at the largest value', () => {
      const matrix = [
        [100, 0, 0, 0],
        [0, 0, 0, 0],
        [1, 2, 3, 4],
      ];
      // 100 can be reached only from its 0-neighbours (length 2); 0 → 1 → 2 → 3 → 4 gives 5.
      expect(longestIncreasingPath(matrix)).toBe(5);
    });

    it('does not modify the input matrix', () => {
      const matrix = [[9, 9, 4], [6, 6, 8], [2, 1, 1]];
      longestIncreasingPath(matrix);
      expect(matrix).toEqual([[9, 9, 4], [6, 6, 8], [2, 1, 1]]);
    });
  });

  describe('randomized (seeded, reproducible)', () => {
    it('matches a brute-force DFS on 200 random grids with many ties (values 0..5)', () => {
      const rng = createRng(17);
      for (let t = 0; t < 200; t++) {
        const matrix = grid(randomInt(rng, 1, 6), randomInt(rng, 1, 6), () => randomInt(rng, 0, 5));
        expect(longestIncreasingPath(matrix), JSON.stringify(matrix)).toBe(bruteForce(matrix));
      }
    });

    it('matches a brute-force DFS on 200 random grids with a wide value range', () => {
      const rng = createRng(4242);
      for (let t = 0; t < 200; t++) {
        const matrix = grid(randomInt(rng, 1, 6), randomInt(rng, 1, 6), () => randomInt(rng, 0, 2 ** 31 - 1));
        expect(longestIncreasingPath(matrix), JSON.stringify(matrix)).toBe(bruteForce(matrix));
      }
    });
  });

  describe('performance', () => {
    it('200×200 tiled 10×10 slopes → 19 (DFS without memo re-walks the same paths ~100 million times and takes seconds)', () => {
      // value = (r % 10) + (c % 10): inside each tile, from the top-left corner there are
      // C(18, 9) different increasing paths — exactly the repeated work a memo removes.
      const matrix = grid(200, 200, (r, c) => (r % 10) + (c % 10));
      const { result, ms } = measure(() => longestIncreasingPath(matrix));
      expect(result).toBe(19);
      expect(ms, `took ${ms.toFixed(0)}ms — remember the answer for each cell`).toBeLessThan(1000);
    });

    it('200×200 snake whose longest path is 20,100 cells (a RECURSIVE DFS this deep overflows the JS call stack — use an explicit stack or peel layers)', () => {
      const matrix = snakeMatrix();
      const { result, ms } = measure(() => longestIncreasingPath(matrix));
      expect(result).toBe(20100);
      expect(ms, `took ${ms.toFixed(0)}ms`).toBeLessThan(1000);
    });
  });
});
