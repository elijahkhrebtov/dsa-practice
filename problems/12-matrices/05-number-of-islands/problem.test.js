import { describe, it, expect } from 'vitest';
import { numIslands } from './problem.js';
import { createRng, randomInt, measure } from '../../../lib/test-utils.js';

/** Builds a fresh grid from row strings: g('110', '011') → [['1','1','0'], ['0','1','1']]. */
const g = (...rows) => rows.map((row) => row.split(''));

const copy = (grid) => grid.map((row) => row.slice());

/**
 * Brute-force oracle: give every land cell its own label, then keep replacing
 * each label with the smallest label among its land neighbours until nothing
 * changes. Count the distinct labels left.
 */
function bruteIslands(grid) {
  const m = grid.length;
  const n = grid[0].length;
  const label = grid.map((row, r) => row.map((v, c) => (v === '1' ? r * n + c : -1)));
  let changed = true;
  while (changed) {
    changed = false;
    for (let r = 0; r < m; r++) {
      for (let c = 0; c < n; c++) {
        if (label[r][c] < 0) continue;
        for (const [nr, nc] of [
          [r - 1, c],
          [r + 1, c],
          [r, c - 1],
          [r, c + 1],
        ]) {
          if (nr >= 0 && nr < m && nc >= 0 && nc < n && label[nr][nc] >= 0 && label[nr][nc] < label[r][c]) {
            label[r][c] = label[nr][nc];
            changed = true;
          }
        }
      }
    }
  }
  return new Set(label.flat().filter((x) => x >= 0)).size;
}

/** n × n snake: full land rows linked by a single land cell at alternating ends. */
function snakeGrid(n) {
  return Array.from({ length: n }, (_, r) => {
    if (r % 2 === 0) return Array(n).fill('1');
    const row = Array(n).fill('0');
    row[r % 4 === 1 ? n - 1 : 0] = '1';
    return row;
  });
}

describe('Number of Islands', () => {
  describe('examples from the problem', () => {
    it('one big irregular island → 1', () => {
      expect(numIslands(g('11110', '11010', '11000', '00000'))).toBe(1);
    });

    it('block + single cell + pair → 3 (corner contact does not connect)', () => {
      expect(numIslands(g('11000', '11000', '00100', '00011'))).toBe(3);
    });

    it('a ring of land around a lake is still 1 island', () => {
      expect(numIslands(g('111', '101', '111'))).toBe(1);
    });
  });

  describe('edge cases', () => {
    it("1×1 grid [['1']] → 1", () => {
      expect(numIslands(g('1'))).toBe(1);
    });

    it("1×1 grid [['0']] → 0", () => {
      expect(numIslands(g('0'))).toBe(0);
    });

    it('all water → 0', () => {
      expect(numIslands(g('0000', '0000', '0000'))).toBe(0);
    });

    it('all land → 1', () => {
      expect(numIslands(g('1111', '1111', '1111'))).toBe(1);
    });

    it('single row 1 0 1 1 0 1 → 3', () => {
      expect(numIslands(g('101101'))).toBe(3);
    });

    it('single column 1 1 0 1 0 0 1 → 3', () => {
      expect(numIslands(g('1', '1', '0', '1', '0', '0', '1'))).toBe(3);
    });

    it('islands touching all four borders are counted (outside the grid is water)', () => {
      expect(numIslands(g('10001', '00000', '00100', '00000', '10001'))).toBe(5);
    });
  });

  describe('tricky cases', () => {
    it('checkerboard: diagonal neighbours are NOT connected, so every land cell is its own island', () => {
      expect(numIslands(g('10101', '01010', '10101', '01010'))).toBe(10);
    });

    it('U-shape → 1 (the two arms only join at the bottom, after both were already seen in the scan)', () => {
      expect(numIslands(g('101', '101', '111'))).toBe(1);
    });

    it('upside-down U and a comb whose teeth join at the bottom → 1 each', () => {
      expect(numIslands(g('111', '101', '101'))).toBe(1);
      expect(numIslands(g('10101', '10101', '10101', '11111'))).toBe(1);
    });

    it('a spiral island must be followed around every corner → 1', () => {
      expect(numIslands(g('11111', '00001', '11101', '10001', '11111'))).toBe(1);
    });

    it('island inside a lake inside an island → 2', () => {
      expect(numIslands(g('11111', '10001', '10101', '10001', '11111'))).toBe(2);
    });

    it('a staircase that only touches at corners → one island per step', () => {
      expect(numIslands(g('1100', '0011', '1100', '0011'))).toBe(4);
    });

    it("cells are strings: a grid of '0' strings has no land even though '0' is truthy", () => {
      expect(numIslands(g('00', '00'))).toBe(0);
    });
  });

  describe('randomized (seeded, reproducible)', () => {
    it('matches a brute-force label-propagation count on 300 random grids', () => {
      const rng = createRng(1205);
      for (let t = 0; t < 300; t++) {
        const m = randomInt(rng, 1, 10);
        const n = randomInt(rng, 1, 10);
        const density = randomInt(rng, 2, 8) / 10;
        const grid = Array.from({ length: m }, () => Array.from({ length: n }, () => (rng() < density ? '1' : '0')));
        const expected = bruteIslands(grid);
        expect(numIslands(copy(grid)), JSON.stringify(grid.map((row) => row.join('')))).toBe(expected);
      }
    });
  });

  describe('performance & recursion depth', () => {
    it('1000×1000 snake-shaped single island (~500,000 cells deep for a recursive DFS → stack overflow)', () => {
      const grid = snakeGrid(1000);
      const { result, ms } = measure(() => numIslands(grid));
      expect(result).toBe(1);
      expect(ms, `took ${ms.toFixed(0)}ms — think O(m·n), no recursion`).toBeLessThan(1500);
    });

    it('1000×1000 all land → 1 (a recursive DFS can also go very deep here)', () => {
      const grid = Array.from({ length: 1000 }, () => Array(1000).fill('1'));
      const { result, ms } = measure(() => numIslands(grid));
      expect(result).toBe(1);
      expect(ms, `took ${ms.toFixed(0)}ms — think O(m·n)`).toBeLessThan(1500);
    });

    it('1000×1000 checkerboard → 500,000 one-cell islands (per-island overhead must be O(1), not O(m·n))', () => {
      const grid = Array.from({ length: 1000 }, (_, r) => Array.from({ length: 1000 }, (_, c) => ((r + c) % 2 === 0 ? '1' : '0')));
      const { result, ms } = measure(() => numIslands(grid));
      expect(result).toBe(500_000);
      expect(ms, `took ${ms.toFixed(0)}ms — don't allocate a fresh visited grid per island`).toBeLessThan(1500);
    });
  });
});
