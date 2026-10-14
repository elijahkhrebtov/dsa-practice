import { describe, it, expect } from 'vitest';
import { orangesRotting } from './problem.js';
import { createRng, randomInt, measure } from '../../../lib/test-utils.js';

const copy = (grid) => grid.map((row) => row.slice());

/** Brute-force oracle: literally simulate minute by minute on a copy. */
function bruteRotting(input) {
  const grid = copy(input);
  const m = grid.length;
  const n = grid[0].length;
  let minutes = 0;
  for (;;) {
    const toRot = [];
    for (let r = 0; r < m; r++) {
      for (let c = 0; c < n; c++) {
        if (grid[r][c] !== 1) continue;
        const nearRotten =
          (r > 0 && grid[r - 1][c] === 2) ||
          (r < m - 1 && grid[r + 1][c] === 2) ||
          (c > 0 && grid[r][c - 1] === 2) ||
          (c < n - 1 && grid[r][c + 1] === 2);
        if (nearRotten) toRot.push([r, c]);
      }
    }
    if (toRot.length === 0) break;
    for (const [r, c] of toRot) grid[r][c] = 2;
    minutes++;
  }
  return grid.some((row) => row.includes(1)) ? -1 : minutes;
}

/**
 * n × n orchard of fresh oranges cut by walls of empty cells every
 * (width + 1) rows; each wall has one orange gap, alternating between the
 * right and the left end. The rot starts in the top-left corner and has to
 * snake back and forth through the corridors.
 */
function snakeOrchard(n, width) {
  let walls = 0;
  const grid = Array.from({ length: n }, (_, r) => {
    if (r % (width + 1) !== width) return Array(n).fill(1);
    const row = Array(n).fill(0);
    row[walls++ % 2 === 0 ? n - 1 : 0] = 1;
    return row;
  });
  grid[0][0] = 2;
  return grid;
}

describe('Rotting Oranges', () => {
  describe('examples from the problem', () => {
    it('[[2,1,1],[1,1,0],[0,1,1]] → 4', () => {
      expect(
        orangesRotting([
          [2, 1, 1],
          [1, 1, 0],
          [0, 1, 1],
        ]),
      ).toBe(4);
    });

    it('[[2,1,1],[0,1,1],[1,0,1]] → -1 (the bottom-left orange is walled off; diagonals do not spread)', () => {
      expect(
        orangesRotting([
          [2, 1, 1],
          [0, 1, 1],
          [1, 0, 1],
        ]),
      ).toBe(-1);
    });

    it('[[0, 2]] → 0 (no fresh oranges at all)', () => {
      expect(orangesRotting([[0, 2]])).toBe(0);
    });

    it('[[2, 1, 1, 1, 2]] → 2 (both ends spread simultaneously and meet in the middle)', () => {
      expect(orangesRotting([[2, 1, 1, 1, 2]])).toBe(2);
    });
  });

  describe('edge cases', () => {
    it('[[0]] → 0 (no oranges at all: nothing fresh, so 0 minutes)', () => {
      expect(orangesRotting([[0]])).toBe(0);
    });

    it('[[1]] → -1 (a fresh orange with no rotten orange anywhere)', () => {
      expect(orangesRotting([[1]])).toBe(-1);
    });

    it('[[2]] → 0', () => {
      expect(orangesRotting([[2]])).toBe(0);
    });

    it('all rotten → 0', () => {
      expect(
        orangesRotting([
          [2, 2],
          [2, 2],
        ]),
      ).toBe(0);
    });

    it('[[2, 1]] → 1 (a single minute)', () => {
      expect(orangesRotting([[2, 1]])).toBe(1);
    });

    it('single column [2, 1, 1, 0, 1] → -1 (the empty cell breaks the chain)', () => {
      expect(orangesRotting([[2], [1], [1], [0], [1]])).toBe(-1);
    });

    it('fresh oranges but no rotten ones → -1', () => {
      expect(
        orangesRotting([
          [1, 1],
          [0, 1],
        ]),
      ).toBe(-1);
    });
  });

  describe('tricky cases', () => {
    it('[[2, 1, 1, 1, 1, 1, 2]] → 3, not 6 (multi-source: spreading from one source at a time overcounts)', () => {
      expect(orangesRotting([[2, 1, 1, 1, 1, 1, 2]])).toBe(3);
    });

    it('rot moves only ONE step per minute: [[2, 1, 1, 1]] → 3 (rotting oranges mid-scan in the same grid gives 1)', () => {
      expect(orangesRotting([[2, 1, 1, 1]])).toBe(3);
    });

    it('rot moves only one step per minute in every direction, including up and left', () => {
      expect(orangesRotting([[1, 1, 1, 2]])).toBe(3);
      expect(orangesRotting([[1], [1], [2]])).toBe(2);
    });

    it('no extra minute is counted after the last orange rots', () => {
      expect(
        orangesRotting([
          [2, 1],
          [1, 1],
        ]),
      ).toBe(2);
    });

    it('a diagonal-only neighbour never rots: [[2, 0], [0, 1]] → -1', () => {
      expect(
        orangesRotting([
          [2, 0],
          [0, 1],
        ]),
      ).toBe(-1);
    });

    it('the answer is the distance to the NEAREST rotten orange, maximised over fresh ones', () => {
      // The far-right column is close to the rotten orange on the right,
      // even though it is far from the one on the left.
      expect(
        orangesRotting([
          [2, 1, 1, 1, 1, 1],
          [1, 1, 1, 1, 1, 2],
        ]),
      ).toBe(3);
    });

    it('rot has to go around a wall of empty cells', () => {
      expect(
        orangesRotting([
          [2, 0, 1],
          [1, 0, 1],
          [1, 1, 1],
        ]),
      ).toBe(6);
    });
  });

  describe('randomized (seeded, reproducible)', () => {
    it('matches a minute-by-minute simulation on 300 random grids', () => {
      const rng = createRng(1206);
      for (let t = 0; t < 300; t++) {
        const m = randomInt(rng, 1, 9);
        const n = randomInt(rng, 1, 9);
        const grid = Array.from({ length: m }, () =>
          Array.from({ length: n }, () => {
            const x = rng();
            return x < 0.2 ? 0 : x < 0.9 ? 1 : 2;
          }),
        );
        expect(orangesRotting(copy(grid)), JSON.stringify(grid)).toBe(bruteRotting(grid));
      }
    });
  });

  describe('performance', () => {
    it('300×300 snake-shaped orchard: 22,724 minutes (re-scanning the whole grid every minute is far too slow)', () => {
      const grid = snakeOrchard(300, 3);
      const { result, ms } = measure(() => orangesRotting(grid));
      expect(result).toBe(22_724);
      expect(ms, `took ${ms.toFixed(0)}ms — process each orange once (multi-source BFS)`).toBeLessThan(1000);
    });

    it('300×300 snake orchard with one fresh orange sealed off at the end → -1, also quickly', () => {
      const grid = snakeOrchard(300, 3);
      grid[299][298] = 0;
      grid[298][299] = 0;
      grid[299][299] = 1; // the last cell can no longer be reached
      const { result, ms } = measure(() => orangesRotting(grid));
      expect(result).toBe(-1);
      expect(ms, `took ${ms.toFixed(0)}ms — process each orange once (multi-source BFS)`).toBeLessThan(1000);
    });

    it('300×300 with rotten oranges on the whole border → 149 minutes (many sources at once)', () => {
      const n = 300;
      const grid = Array.from({ length: n }, (_, r) =>
        Array.from({ length: n }, (_, c) => (r === 0 || c === 0 || r === n - 1 || c === n - 1 ? 2 : 1)),
      );
      const { result, ms } = measure(() => orangesRotting(grid));
      expect(result).toBe(149);
      expect(ms, `took ${ms.toFixed(0)}ms`).toBeLessThan(1000);
    });
  });
});
