import { describe, it, expect } from 'vitest';
import { rotate } from './problem.js';
import { createRng, randomInt, measure } from '../../../lib/test-utils.js';

/** Matrix whose cell (r, c) holds `start + r * n + c`. */
const numbered = (n, start = 1) => Array.from({ length: n }, (_, r) => Array.from({ length: n }, (_, c) => start + r * n + c));

const copy = (grid) => grid.map((row) => row.slice());

/** Oracle: build the rotated image in a fresh matrix — (r, c) moves to (c, n - 1 - r). */
function rotatedCopy(matrix) {
  const n = matrix.length;
  const out = Array.from({ length: n }, () => Array(n).fill(0));
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) out[c][n - 1 - r] = matrix[r][c];
  return out;
}

/**
 * Rotates `matrix` with the user's function and checks that it happened in
 * place: same outer array, same row objects (possibly reordered), right values.
 */
function expectRotatedInPlace(matrix, expected) {
  const outer = matrix;
  const rowsBefore = new Set(matrix);
  rotate(matrix);
  expect(matrix, 'the matrix variable must still be the same array').toBe(outer);
  expect(matrix).toHaveLength(expected.length);
  for (const row of matrix) {
    expect(rowsBefore.has(row), 'rows must be the original row arrays — don\'t assign new arrays to matrix[r]').toBe(true);
  }
  expect(new Set(matrix).size, 'each original row array must appear exactly once').toBe(expected.length);
  expect(matrix).toEqual(expected);
}

describe('Rotate Image', () => {
  describe('examples from the problem', () => {
    it('3×3 [[1,2,3],[4,5,6],[7,8,9]] → [[7,4,1],[8,5,2],[9,6,3]]', () => {
      expectRotatedInPlace(numbered(3), [
        [7, 4, 1],
        [8, 5, 2],
        [9, 6, 3],
      ]);
    });

    it('4×4 example (even n: no centre cell, two full rings)', () => {
      expectRotatedInPlace(
        [
          [5, 1, 9, 11],
          [2, 4, 8, 10],
          [13, 3, 6, 7],
          [15, 14, 12, 16],
        ],
        [
          [15, 13, 2, 5],
          [14, 3, 4, 1],
          [12, 6, 8, 9],
          [16, 7, 10, 11],
        ],
      );
    });

    it('1×1 [[1]] stays [[1]]', () => {
      expectRotatedInPlace([[1]], [[1]]);
    });
  });

  describe('edge cases', () => {
    it('2×2 [[1,2],[3,4]] → [[3,1],[4,2]]', () => {
      expectRotatedInPlace(
        [
          [1, 2],
          [3, 4],
        ],
        [
          [3, 1],
          [4, 2],
        ],
      );
    });

    it('5×5 (odd n): the centre cell stays put and two rings rotate', () => {
      const m = numbered(5);
      expectRotatedInPlace(m, rotatedCopy(numbered(5)));
      expect(m[2][2]).toBe(13);
    });

    it('6×6 (even n): three rings rotate', () => {
      expectRotatedInPlace(numbered(6), rotatedCopy(numbered(6)));
    });

    it('handles negative values, zeros and duplicates', () => {
      expectRotatedInPlace(
        [
          [0, -1000, 0],
          [1000, -1, 1000],
          [0, 0, -1000],
        ],
        [
          [0, 1000, 0],
          [0, -1, -1000],
          [-1000, 1000, 0],
        ],
      );
    });

    it('a matrix of identical values is unchanged', () => {
      expectRotatedInPlace(
        Array.from({ length: 4 }, () => Array(4).fill(7)),
        Array.from({ length: 4 }, () => Array(4).fill(7)),
      );
    });
  });

  describe('tricky cases', () => {
    it('clockwise, not counter-clockwise: the top-left corner moves to the top-right', () => {
      const m = numbered(3);
      rotate(m);
      expect(m[0][2], 'old (0,0) = 1 should now be at (0, 2)').toBe(1);
      expect(m[0][0], 'old bottom-left (2,0) = 7 should now be at (0, 0)').toBe(7);
    });

    it('a rotation, not just a transpose: [[1,2],[3,4]] must not become [[1,3],[2,4]]', () => {
      const m = [
        [1, 2],
        [3, 4],
      ];
      rotate(m);
      expect(m).not.toEqual([
        [1, 3],
        [2, 4],
      ]);
      expect(m).toEqual([
        [3, 1],
        [4, 2],
      ]);
    });

    it('rotating twice = 180°: every row and the row order are reversed', () => {
      const m = numbered(4);
      rotate(m);
      rotate(m);
      expect(m).toEqual(
        numbered(4)
          .map((row) => row.reverse())
          .reverse(),
      );
    });

    it('rotating four times gives back the original matrix (n = 1..8)', () => {
      for (let n = 1; n <= 8; n++) {
        const m = numbered(n);
        for (let k = 0; k < 4; k++) rotate(m);
        expect(m, `n = ${n}`).toEqual(numbered(n));
      }
    });

    it('rotating three times = rotating counter-clockwise once', () => {
      const m = numbered(5);
      for (let k = 0; k < 3; k++) rotate(m);
      // Counter-clockwise: (r, c) moves to (n - 1 - c, r).
      const n = 5;
      const expected = Array.from({ length: n }, () => Array(n).fill(0));
      const original = numbered(n);
      for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) expected[n - 1 - c][r] = original[r][c];
      expect(m).toEqual(expected);
    });
  });

  describe('randomized (seeded, reproducible)', () => {
    it('matches a rotate-into-a-copy oracle on 200 random matrices (n = 1..15), in place', () => {
      const rng = createRng(1203);
      for (let t = 0; t < 200; t++) {
        const n = randomInt(rng, 1, 15);
        const matrix = Array.from({ length: n }, () => Array.from({ length: n }, () => randomInt(rng, -1000, 1000)));
        expectRotatedInPlace(copy(matrix), rotatedCopy(matrix));
      }
    });
  });

  describe('performance', () => {
    it('1000×1000 rotates in place quickly (O(n²) time, O(1) extra space)', () => {
      const n = 1000;
      const m = numbered(n, 0);
      const rowsBefore = new Set(m);
      const { ms } = measure(() => rotate(m));
      expect(m[0][0]).toBe((n - 1) * n); // old bottom-left corner
      expect(m[0][n - 1]).toBe(0); // old top-left corner
      expect(m[n - 1][n - 1]).toBe(n - 1); // old top-right corner
      expect(m[n - 1][0]).toBe(n * n - 1); // old bottom-right corner
      expect(m[123][456]).toBe((n - 1 - 456) * n + 123);
      expect(m.every((row) => rowsBefore.has(row)), 'rows must be the original row arrays').toBe(true);
      expect(ms, `took ${ms.toFixed(0)}ms — think O(n²)`).toBeLessThan(1000);
    });
  });
});
