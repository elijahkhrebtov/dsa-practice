import { describe, it, expect } from 'vitest';
import { pacificAtlantic } from './problem.js';
import { createRng, randomInt, measure, canonical } from '../../../lib/test-utils.js';

/** Sorts the [r, c] pairs so results in any order can be compared. */
const sorted = (cells) => canonical(cells);

/** Builds an m × n grid from a function of (r, c). */
const grid = (m, n, f) => Array.from({ length: m }, (_, r) => Array.from({ length: n }, (_, c) => f(r, c)));

/** Every [r, c] of an m × n grid. */
const allCells = (m, n) => grid(m, n, (r, c) => [r, c]).flat();

/**
 * Brute-force oracle: from every cell, explore everything water can reach and
 * check whether it touches both oceans. O((m·n)²) — fine for small grids.
 */
function bruteForce(heights) {
  const m = heights.length;
  const n = heights[0].length;
  const result = [];
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      const seen = new Set([r * n + c]);
      const stack = [[r, c]];
      let pacific = false;
      let atlantic = false;
      while (stack.length) {
        const [x, y] = stack.pop();
        if (x === 0 || y === 0) pacific = true;
        if (x === m - 1 || y === n - 1) atlantic = true;
        for (const [nx, ny] of [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]]) {
          if (nx < 0 || ny < 0 || nx >= m || ny >= n) continue;
          if (heights[nx][ny] > heights[x][y] || seen.has(nx * n + ny)) continue;
          seen.add(nx * n + ny);
          stack.push([nx, ny]);
        }
      }
      if (pacific && atlantic) result.push([r, c]);
    }
  }
  return result;
}

describe('Pacific Atlantic Water Flow', () => {
  describe('examples from the problem', () => {
    it('the classic 5×5 island → 7 cells', () => {
      const heights = [
        [1, 2, 2, 3, 5],
        [3, 2, 3, 4, 4],
        [2, 4, 5, 3, 1],
        [6, 7, 1, 4, 5],
        [5, 1, 1, 2, 4],
      ];
      expect(sorted(pacificAtlantic(heights))).toEqual([
        [0, 4], [1, 3], [1, 4], [2, 2], [3, 0], [3, 1], [4, 0],
      ]);
    });

    it('[[1]] → [[0, 0]] (a single cell touches both oceans)', () => {
      expect(pacificAtlantic([[1]])).toEqual([[0, 0]]);
    });

    it('a flat ring around a pit → every cell except the centre', () => {
      const heights = [
        [3, 3, 3],
        [3, 1, 3],
        [3, 3, 3],
      ];
      expect(sorted(pacificAtlantic(heights))).toEqual(sorted(allCells(3, 3).filter(([r, c]) => !(r === 1 && c === 1))));
    });
  });

  describe('edge cases', () => {
    it('a single row: every cell touches the top (Pacific) and the bottom (Atlantic)', () => {
      expect(sorted(pacificAtlantic([[5, 1, 9, 2]]))).toEqual([[0, 0], [0, 1], [0, 2], [0, 3]]);
    });

    it('a single column: every cell touches the left (Pacific) and the right (Atlantic)', () => {
      expect(sorted(pacificAtlantic([[4], [8], [0]]))).toEqual([[0, 0], [1, 0], [2, 0]]);
    });

    it('a flat 2×2 grid → all four cells (water flows between EQUAL heights)', () => {
      expect(sorted(pacificAtlantic([[7, 7], [7, 7]]))).toEqual([[0, 0], [0, 1], [1, 0], [1, 1]]);
    });

    it('a 2×2 grid with distinct heights: the top-right and bottom-left corners always qualify', () => {
      // 1 2
      // 3 0   → (0,0)=1 can only reach the Pacific; (1,1)=0 only the Atlantic.
      expect(sorted(pacificAtlantic([[1, 2], [3, 0]]))).toEqual([[0, 1], [1, 0]]);
    });

    it('heights rising towards the bottom-right → exactly the bottom row and the right column', () => {
      const heights = grid(4, 5, (r, c) => r + c);
      const expected = allCells(4, 5).filter(([r, c]) => r === 3 || c === 4);
      expect(sorted(pacificAtlantic(heights))).toEqual(sorted(expected));
    });

    it('heights rising towards the top-left → exactly the top row and the left column', () => {
      const heights = grid(4, 5, (r, c) => 7 - r - c);
      const expected = allCells(4, 5).filter(([r, c]) => r === 0 || c === 0);
      expect(sorted(pacificAtlantic(heights))).toEqual(sorted(expected));
    });

    it('handles heights of 0 and 10^5', () => {
      const heights = [
        [0, 100000],
        [100000, 0],
      ];
      expect(sorted(pacificAtlantic(heights))).toEqual([[0, 1], [1, 0]]);
    });
  });

  describe('tricky cases', () => {
    it('a central peak drains both ways, but the valley cells next to it do not', () => {
      const heights = [
        [1, 1, 1],
        [1, 9, 1],
        [1, 1, 1],
      ];
      // Every border cell is flat-connected to both oceans; the peak flows down into them.
      expect(sorted(pacificAtlantic(heights))).toEqual(sorted(allCells(3, 3)));
    });

    it('an L-shaped wall cuts the low top-left corner off from the Atlantic → only the 5 wall cells qualify', () => {
      // 1 1 9
      // 1 1 9      the 1s drain into the Pacific but can't climb the wall;
      // 9 9 9      the wall flows along itself to the top row / left column.
      const heights = [
        [1, 1, 9],
        [1, 1, 9],
        [9, 9, 9],
      ];
      expect(sorted(pacificAtlantic(heights))).toEqual([[0, 2], [1, 2], [2, 0], [2, 1], [2, 2]]);
    });

    it('water must wind left, down and back right through a channel (not just two directions)', () => {
      // From (1, 3) = 6 the only way to the Atlantic is the channel 5 → 4 → 3 → 2 → 1 → 0 → 0
      // that goes LEFT along row 1, DOWN column 1, then RIGHT along row 3 to the edge.
      // It reaches the Pacific directly through (0, 3) = 5.
      const heights = [
        [9, 9, 9, 5, 9],
        [9, 4, 5, 6, 9],
        [9, 3, 9, 9, 9],
        [9, 2, 1, 0, 0],
        [9, 9, 9, 9, 9],
      ];
      const result = sorted(pacificAtlantic(heights));
      expect(result).toContainEqual([1, 3]);
      expect(result).not.toContainEqual([1, 2]); // 5 is stuck: its only Pacific route would climb to 6
      expect(result).toEqual(sorted(bruteForce(heights)));
    });

    it('a basin in the middle of a plateau: the plateau qualifies, the basin does not', () => {
      const heights = [
        [5, 5, 5, 5],
        [5, 2, 2, 5],
        [5, 2, 2, 5],
        [5, 5, 5, 5],
      ];
      const expected = allCells(4, 4).filter(([r, c]) => r === 0 || c === 0 || r === 3 || c === 3);
      expect(sorted(pacificAtlantic(heights))).toEqual(sorted(expected));
    });

    it('lists every qualifying cell exactly once (no duplicates even though both searches reach it)', () => {
      const heights = grid(6, 6, () => 1);
      const result = pacificAtlantic(heights);
      expect(result).toHaveLength(36);
      expect(new Set(result.map(([r, c]) => `${r},${c}`)).size).toBe(36);
    });

    it('does not modify the input grid', () => {
      const heights = [
        [1, 2, 2, 3, 5],
        [3, 2, 3, 4, 4],
        [2, 4, 5, 3, 1],
        [6, 7, 1, 4, 5],
        [5, 1, 1, 2, 4],
      ];
      const copy = heights.map((row) => [...row]);
      pacificAtlantic(heights);
      expect(heights).toEqual(copy);
    });
  });

  describe('randomized (seeded, reproducible)', () => {
    it('matches a brute-force search on 150 random grids with plateaus (heights 0..3)', () => {
      const rng = createRng(2024);
      for (let t = 0; t < 150; t++) {
        const m = randomInt(rng, 1, 9);
        const n = randomInt(rng, 1, 9);
        const heights = grid(m, n, () => randomInt(rng, 0, 3));
        expect(sorted(pacificAtlantic(heights))).toEqual(sorted(bruteForce(heights)));
      }
    });

    it('matches a brute-force search on 150 random grids with a wide height range', () => {
      const rng = createRng(77);
      for (let t = 0; t < 150; t++) {
        const m = randomInt(rng, 1, 12);
        const n = randomInt(rng, 1, 12);
        const heights = grid(m, n, () => randomInt(rng, 0, 100000));
        expect(sorted(pacificAtlantic(heights))).toEqual(sorted(bruteForce(heights)));
      }
    });
  });

  describe('performance', () => {
    it('200×200 striped slopes → bottom row + right column (a separate search from every cell is O((m·n)²) and takes seconds)', () => {
      // Height = (r % 40) + c: water always flows left (to the Pacific) but never
      // reaches the Atlantic unless it starts there, so a per-cell search explores
      // a big region for almost every one of the 40,000 cells.
      const heights = grid(200, 200, (r, c) => (r % 40) + c);
      const expected = allCells(200, 200).filter(([r, c]) => r === 199 || c === 199);
      const { result, ms } = measure(() => pacificAtlantic(heights));
      expect(sorted(result)).toEqual(sorted(expected));
      expect(ms, `took ${ms.toFixed(0)}ms — flood inward from the two oceans once each`).toBeLessThan(500);
    });

    it('200×200 flat plateau → all 40,000 cells (a RECURSIVE flood fill can be 40,000 calls deep and overflow the stack — use an explicit stack/queue)', () => {
      const heights = grid(200, 200, () => 42);
      const { result, ms } = measure(() => pacificAtlantic(heights));
      expect(result).toHaveLength(40000);
      expect(sorted(result)).toEqual(sorted(allCells(200, 200)));
      expect(ms, `took ${ms.toFixed(0)}ms`).toBeLessThan(1000);
    });
  });
});
