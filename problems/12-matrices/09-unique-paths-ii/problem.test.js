import { describe, it, expect } from 'vitest';
import { uniquePathsWithObstacles } from './problem.js';
import { createRng, randomInt, measure } from '../../../lib/test-utils.js';

/** m × n grid of free cells (0). */
const empty = (m, n) => Array.from({ length: m }, () => Array(n).fill(0));

/** Binomial coefficient C(a, b) — the number of paths in an empty grid is C(m+n-2, m-1). */
function choose(a, b) {
  let result = 1;
  for (let i = 1; i <= b; i++) result = (result * (a - b + i)) / i;
  return Math.round(result);
}

/** Brute-force oracle: literally walk every path. Exponential — small grids only. */
function bruteForce(grid) {
  const m = grid.length;
  const n = grid[0].length;
  const walk = (r, c) => {
    if (r >= m || c >= n || grid[r][c] === 1) return 0;
    if (r === m - 1 && c === n - 1) return 1;
    return walk(r + 1, c) + walk(r, c + 1);
  };
  return walk(0, 0);
}

describe('Unique Paths II', () => {
  describe('examples from the problem', () => {
    it('3×3 with an obstacle in the centre → 2', () => {
      expect(uniquePathsWithObstacles([[0, 0, 0], [0, 1, 0], [0, 0, 0]])).toBe(2);
    });

    it('[[0, 1], [0, 0]] → 1', () => {
      expect(uniquePathsWithObstacles([[0, 1], [0, 0]])).toBe(1);
    });

    it('2×4 with no obstacles → 4 (the single DOWN move can be in any column)', () => {
      expect(uniquePathsWithObstacles(empty(2, 4))).toBe(4);
    });

    it('[[1, 0]] → 0 (the robot starts on an obstacle)', () => {
      expect(uniquePathsWithObstacles([[1, 0]])).toBe(0);
    });
  });

  describe('edge cases', () => {
    it('[[0]] → 1 (already at the destination: the empty path counts)', () => {
      expect(uniquePathsWithObstacles([[0]])).toBe(1);
    });

    it('[[1]] → 0 (start and end are the same blocked cell)', () => {
      expect(uniquePathsWithObstacles([[1]])).toBe(0);
    });

    it('the destination is an obstacle → 0', () => {
      expect(uniquePathsWithObstacles([[0, 0], [0, 1]])).toBe(0);
      expect(uniquePathsWithObstacles([[0, 0, 0], [0, 0, 0], [0, 0, 1]])).toBe(0);
    });

    it('a single free row → 1; one obstacle anywhere in it → 0', () => {
      expect(uniquePathsWithObstacles([[0, 0, 0, 0, 0]])).toBe(1);
      expect(uniquePathsWithObstacles([[0, 0, 1, 0, 0]])).toBe(0);
    });

    it('a single free column → 1; one obstacle anywhere in it → 0', () => {
      expect(uniquePathsWithObstacles([[0], [0], [0], [0]])).toBe(1);
      expect(uniquePathsWithObstacles([[0], [0], [1], [0]])).toBe(0);
    });

    it('no obstacles at all: 3×7 → 28 and 10×10 → 48,620 (= C(m+n-2, m-1))', () => {
      expect(uniquePathsWithObstacles(empty(3, 7))).toBe(28);
      expect(uniquePathsWithObstacles(empty(10, 10))).toBe(48620);
    });
  });

  describe('tricky cases', () => {
    it('an obstacle in the FIRST ROW blocks every cell to its right in that row: [[0,1,0],[0,0,0]] → 1', () => {
      // Classic bug: initialising the whole first row with 1s gives 2 here.
      expect(uniquePathsWithObstacles([[0, 1, 0], [0, 0, 0]])).toBe(1);
    });

    it('an obstacle in the FIRST COLUMN blocks every cell below it in that column: → 1', () => {
      expect(uniquePathsWithObstacles([[0, 0], [1, 0], [0, 0]])).toBe(1);
    });

    it('both neighbours of the start are blocked → 0', () => {
      expect(uniquePathsWithObstacles([[0, 1], [1, 0]])).toBe(0);
    });

    it('a full anti-diagonal wall cuts every path → 0 (each path crosses every anti-diagonal once)', () => {
      const grid = empty(5, 5);
      for (let r = 0; r < 5; r++) grid[r][4 - r] = 1;
      expect(uniquePathsWithObstacles(grid)).toBe(0);
    });

    it('a wall with a single gap: every path must squeeze through it → 3', () => {
      // . . . .
      // . . . .
      // # # . #     3 ways to reach the gap at (2, 2), then only (3, 2) → (3, 3) is left.
      // . . . .
      const grid = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [1, 1, 0, 1],
        [0, 0, 0, 0],
      ];
      expect(uniquePathsWithObstacles(grid)).toBe(3);
    });

    it('does not modify the input grid', () => {
      const grid = [[0, 0, 0], [0, 1, 0], [0, 0, 0]];
      uniquePathsWithObstacles(grid);
      expect(grid).toEqual([[0, 0, 0], [0, 1, 0], [0, 0, 0]]);
    });
  });

  describe('randomized (seeded, reproducible)', () => {
    it('matches a path-walking brute force on 300 random grids up to 8×8', () => {
      const rng = createRng(123);
      for (let t = 0; t < 300; t++) {
        const m = randomInt(rng, 1, 8);
        const n = randomInt(rng, 1, 8);
        const density = randomInt(rng, 0, 40) / 100;
        const grid = Array.from({ length: m }, () => Array.from({ length: n }, () => (rng() < density ? 1 : 0)));
        expect(uniquePathsWithObstacles(grid), JSON.stringify(grid)).toBe(bruteForce(grid));
      }
    });

    it('transposing the grid does not change the answer (on 100 random 12×12 grids)', () => {
      const rng = createRng(5);
      for (let t = 0; t < 100; t++) {
        const grid = Array.from({ length: 12 }, () => Array.from({ length: 12 }, () => (rng() < 0.25 ? 1 : 0)));
        const transposed = grid[0].map((_, c) => grid.map((row) => row[c]));
        const answer = uniquePathsWithObstacles(grid);
        expect(Number.isInteger(answer), 'should return an integer').toBe(true);
        expect(uniquePathsWithObstacles(transposed)).toBe(answer);
      }
    });
  });

  describe('performance & large grids', () => {
    it('empty 16×16 → 155,117,520 quickly (naive recursion walks all 155 million paths and takes seconds)', () => {
      const { result, ms } = measure(() => uniquePathsWithObstacles(empty(16, 16)));
      expect(result).toBe(choose(30, 15));
      expect(result).toBe(155117520);
      expect(ms, `took ${ms.toFixed(0)}ms — count paths per cell instead of walking them`).toBeLessThan(500);
    });

    it('100×100 where only rows 0–1 and the last column are free → 100', () => {
      const grid = Array.from({ length: 100 }, () => Array(100).fill(1));
      for (let c = 0; c < 100; c++) grid[0][c] = grid[1][c] = 0;
      for (let r = 0; r < 100; r++) grid[r][99] = 0;
      // Choose the column of the single step from row 0 to row 1 (100 options), then go straight down.
      expect(uniquePathsWithObstacles(grid)).toBe(100);
    });

    it('100×100 staircase corridor one cell wide → exactly 1 path', () => {
      const grid = Array.from({ length: 100 }, () => Array(100).fill(1));
      for (let r = 0; r < 100; r++) {
        grid[r][r] = 0;
        if (r + 1 < 100) grid[r][r + 1] = 0;
      }
      expect(uniquePathsWithObstacles(grid)).toBe(1);
    });

    it('100×100 with a full anti-diagonal wall → 0', () => {
      const grid = empty(100, 100);
      for (let r = 0; r < 100; r++) grid[r][99 - r] = 1;
      const { result, ms } = measure(() => uniquePathsWithObstacles(grid));
      expect(result).toBe(0);
      expect(ms, `took ${ms.toFixed(0)}ms`).toBeLessThan(500);
    });
  });
});
