import { describe, it, expect } from 'vitest';
import { spiralOrder } from './problem.js';
import { createRng, randomInt, measure } from '../../../lib/test-utils.js';

/** Matrix whose cell (r, c) holds `start + r * n + c`, so every value tells you its position. */
const numbered = (m, n, start = 1) => Array.from({ length: m }, (_, r) => Array.from({ length: n }, (_, c) => start + r * n + c));

const copy = (grid) => grid.map((row) => row.slice());

/** Brute-force oracle: walk with a direction vector and turn right at walls / visited cells. */
function bruteSpiral(matrix) {
  const m = matrix.length;
  const n = matrix[0].length;
  const seen = Array.from({ length: m }, () => Array(n).fill(false));
  const dirs = [
    [0, 1],
    [1, 0],
    [0, -1],
    [-1, 0],
  ];
  const out = [];
  let r = 0;
  let c = 0;
  let d = 0;
  for (let k = 0; k < m * n; k++) {
    out.push(matrix[r][c]);
    seen[r][c] = true;
    let nr = r + dirs[d][0];
    let nc = c + dirs[d][1];
    if (nr < 0 || nr >= m || nc < 0 || nc >= n || seen[nr][nc]) {
      d = (d + 1) % 4;
      nr = r + dirs[d][0];
      nc = c + dirs[d][1];
    }
    r = nr;
    c = nc;
  }
  return out;
}

describe('Spiral Matrix', () => {
  describe('examples from the problem', () => {
    it('3×3 [[1,2,3],[4,5,6],[7,8,9]] → [1,2,3,6,9,8,7,4,5]', () => {
      expect(
        spiralOrder([
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 9],
        ]),
      ).toEqual([1, 2, 3, 6, 9, 8, 7, 4, 5]);
    });

    it('3×4 → [1,2,3,4,8,12,11,10,9,5,6,7] (the leftover middle row is walked only once)', () => {
      expect(spiralOrder(numbered(3, 4))).toEqual([1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7]);
    });

    it('single column [[1],[2],[3]] → [1, 2, 3]', () => {
      expect(spiralOrder([[1], [2], [3]])).toEqual([1, 2, 3]);
    });
  });

  describe('edge cases', () => {
    it('1×1 matrix [[42]] → [42]', () => {
      expect(spiralOrder([[42]])).toEqual([42]);
    });

    it('single row [[1, 2, 3, 4, 5]] → [1, 2, 3, 4, 5] (must not walk back along the same row)', () => {
      expect(spiralOrder([[1, 2, 3, 4, 5]])).toEqual([1, 2, 3, 4, 5]);
    });

    it('single column of 5 → top to bottom, no walking back up', () => {
      expect(spiralOrder([[1], [2], [3], [4], [5]])).toEqual([1, 2, 3, 4, 5]);
    });

    it('2×2 [[1,2],[3,4]] → [1, 2, 4, 3]', () => {
      expect(
        spiralOrder([
          [1, 2],
          [3, 4],
        ]),
      ).toEqual([1, 2, 4, 3]);
    });

    it('2×1 and 1×2 matrices', () => {
      expect(spiralOrder([[1], [2]])).toEqual([1, 2]);
      expect(spiralOrder([[1, 2]])).toEqual([1, 2]);
    });

    it('handles negative numbers, zeros and duplicate values', () => {
      expect(
        spiralOrder([
          [0, -1, 0],
          [-1000, 1000, -1],
          [0, 0, 0],
        ]),
      ).toEqual([0, -1, 0, -1, 0, 0, 0, -1000, 1000]);
    });

    it('does not modify the input matrix', () => {
      const matrix = numbered(4, 5);
      const before = copy(matrix);
      spiralOrder(matrix);
      expect(matrix).toEqual(before);
    });
  });

  describe('tricky cases (non-square matrices)', () => {
    it('4×4 → two full rings', () => {
      expect(spiralOrder(numbered(4, 4))).toEqual([1, 2, 3, 4, 8, 12, 16, 15, 14, 13, 9, 5, 6, 7, 11, 10]);
    });

    it('3×5 (wide, odd height): the centre leftover is a ROW segment walked left to right', () => {
      expect(spiralOrder(numbered(3, 5))).toEqual([1, 2, 3, 4, 5, 10, 15, 14, 13, 12, 11, 6, 7, 8, 9]);
    });

    it('5×3 (tall, odd width): the centre leftover is a COLUMN segment walked top to bottom', () => {
      expect(spiralOrder(numbered(5, 3))).toEqual([1, 2, 3, 6, 9, 12, 15, 14, 13, 10, 7, 4, 5, 8, 11]);
    });

    it('2×5 (wide, even height): no leftover in the middle', () => {
      expect(spiralOrder(numbered(2, 5))).toEqual([1, 2, 3, 4, 5, 10, 9, 8, 7, 6]);
    });

    it('5×2 (tall, even width): no leftover in the middle', () => {
      expect(spiralOrder(numbered(5, 2))).toEqual([1, 2, 4, 6, 8, 10, 9, 7, 5, 3]);
    });

    it('4×1 column and 1×4 row are not mixed up (m and n are different numbers)', () => {
      expect(spiralOrder([[1], [2], [3], [4]])).toEqual([1, 2, 3, 4]);
      expect(spiralOrder([[1, 2, 3, 4]])).toEqual([1, 2, 3, 4]);
    });

    it('5×4: the innermost ring is a 3×2 block', () => {
      expect(spiralOrder(numbered(5, 4))).toEqual([1, 2, 3, 4, 8, 12, 16, 20, 19, 18, 17, 13, 9, 5, 6, 7, 11, 15, 14, 10]);
    });
  });

  describe('randomized (seeded, reproducible)', () => {
    it('matches a turn-right-at-walls simulation on 300 random shapes', () => {
      const rng = createRng(1202);
      for (let t = 0; t < 300; t++) {
        const m = randomInt(rng, 1, 12);
        const n = randomInt(rng, 1, 12);
        const matrix = Array.from({ length: m }, () => Array.from({ length: n }, () => randomInt(rng, -1000, 1000)));
        expect(spiralOrder(copy(matrix)), `matrix ${m}×${n}: ${JSON.stringify(matrix)}`).toEqual(bruteSpiral(matrix));
      }
    });

    it('every cell appears exactly once and consecutive cells are neighbours (all shapes up to 15×15)', () => {
      for (let m = 1; m <= 15; m++) {
        for (let n = 1; n <= 15; n++) {
          const result = spiralOrder(numbered(m, n, 0)); // value = r * n + c
          expect(result, `${m}×${n}`).toHaveLength(m * n);
          expect(new Set(result).size, `${m}×${n}: duplicates found`).toBe(m * n);
          for (let k = 1; k < result.length; k++) {
            const [r1, c1] = [Math.floor(result[k - 1] / n), result[k - 1] % n];
            const [r2, c2] = [Math.floor(result[k] / n), result[k] % n];
            expect(Math.abs(r1 - r2) + Math.abs(c1 - c2), `${m}×${n}: jump between steps ${k - 1} and ${k}`).toBe(1);
          }
        }
      }
    });
  });

  describe('performance', () => {
    it('1000×1000 matrix quickly (shift-a-row-then-rotate-the-rest re-copies the matrix ~2000 times and is too slow)', () => {
      const n = 1000;
      const matrix = numbered(n, n, 0);
      const { result, ms } = measure(() => spiralOrder(matrix));
      expect(result).toHaveLength(n * n);
      expect(result.slice(0, 3)).toEqual([0, 1, 2]);
      expect(result.slice(n - 1, n + 2)).toEqual([n - 1, 2 * n - 1, 3 * n - 1]);
      // The spiral of an even-sized square ends at (n/2, n/2 - 1).
      expect(result[result.length - 1]).toBe((n / 2) * n + (n / 2 - 1));
      expect(ms, `took ${ms.toFixed(0)}ms — think O(m·n)`).toBeLessThan(1000);
    });
  });
});
