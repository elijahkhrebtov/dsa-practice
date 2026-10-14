import { describe, it, expect } from 'vitest';
import { searchMatrix } from './problem.js';
import { createRng, randomInt, measure } from '../../../lib/test-utils.js';

const EXAMPLE = [
  [1, 3, 5, 7],
  [10, 11, 16, 20],
  [23, 30, 34, 60],
];

/**
 * Random valid matrix: values never decrease within a row (duplicates
 * allowed), and each row starts strictly above the previous row's end.
 */
function randomSortedMatrix(rng, m, n) {
  let v = randomInt(rng, -50, 10);
  return Array.from({ length: m }, (_, r) =>
    Array.from({ length: n }, (_, c) => {
      if (r > 0 && c === 0) v += randomInt(rng, 1, 3);
      else if (r > 0 || c > 0) v += randomInt(rng, 0, 3);
      return v;
    }),
  );
}

/** Oracle: just look at every cell. */
const bruteSearch = (matrix, target) => matrix.some((row) => row.includes(target));

describe('Search a 2D Matrix', () => {
  describe('examples from the problem', () => {
    it('target 3 → true (in the first row)', () => {
      expect(searchMatrix(EXAMPLE, 3)).toBe(true);
    });

    it('target 13 → false (would sit between 11 and 16, but is missing)', () => {
      expect(searchMatrix(EXAMPLE, 13)).toBe(false);
    });

    it('target 8 → false (falls in the gap between row 0 ending at 7 and row 1 starting at 10)', () => {
      expect(searchMatrix(EXAMPLE, 8)).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('1×1 matrix: [[5]] has 5 but not 4 or 6', () => {
      expect(searchMatrix([[5]], 5)).toBe(true);
      expect(searchMatrix([[5]], 4)).toBe(false);
      expect(searchMatrix([[5]], 6)).toBe(false);
    });

    it('finds the very first element (top-left corner) and the very last (bottom-right corner)', () => {
      expect(searchMatrix(EXAMPLE, 1)).toBe(true);
      expect(searchMatrix(EXAMPLE, 60)).toBe(true);
    });

    it('finds the first and last element of every row (row boundaries)', () => {
      for (const v of [1, 7, 10, 20, 23, 60]) expect(searchMatrix(EXAMPLE, v), `target ${v}`).toBe(true);
    });

    it('target smaller than everything / larger than everything → false (no out-of-bounds read)', () => {
      expect(searchMatrix(EXAMPLE, 0)).toBe(false);
      expect(searchMatrix(EXAMPLE, -10_000_000)).toBe(false);
      expect(searchMatrix(EXAMPLE, 61)).toBe(false);
      expect(searchMatrix(EXAMPLE, 10_000_000)).toBe(false);
    });

    it('single row [[1, 4, 9, 12, 20]]: present and absent targets', () => {
      const m = [[1, 4, 9, 12, 20]];
      expect(searchMatrix(m, 12)).toBe(true);
      expect(searchMatrix(m, 10)).toBe(false);
    });

    it('single column [[1], [4], [9], [12], [20]]: present and absent targets', () => {
      const m = [[1], [4], [9], [12], [20]];
      expect(searchMatrix(m, 9)).toBe(true);
      expect(searchMatrix(m, 5)).toBe(false);
    });

    it('negative numbers and zero', () => {
      const m = [
        [-20, -15, -15],
        [-3, 0, 2],
      ];
      expect(searchMatrix(m, -15)).toBe(true);
      expect(searchMatrix(m, 0)).toBe(true);
      expect(searchMatrix(m, -4)).toBe(false);
      expect(searchMatrix(m, 1)).toBe(false);
    });

    it('does not modify the matrix', () => {
      const m = EXAMPLE.map((row) => row.slice());
      searchMatrix(m, 16);
      searchMatrix(m, 17);
      expect(m).toEqual(EXAMPLE);
    });
  });

  describe('tricky cases', () => {
    it('3×4 (wider than tall): every value is found (index → (row, col) must divide by the number of COLUMNS)', () => {
      for (const row of EXAMPLE) for (const v of row) expect(searchMatrix(EXAMPLE, v), `target ${v}`).toBe(true);
    });

    it('4×3 (taller than wide): every value is found and every gap value is not', () => {
      const m = [
        [2, 4, 6],
        [8, 10, 12],
        [14, 16, 18],
        [20, 22, 24],
      ];
      for (let v = 1; v <= 25; v++) expect(searchMatrix(m, v), `target ${v}`).toBe(v % 2 === 0);
    });

    it('duplicates inside a row are fine: [[1, 1, 1], [2, 2, 3]]', () => {
      const m = [
        [1, 1, 1],
        [2, 2, 3],
      ];
      expect(searchMatrix(m, 1)).toBe(true);
      expect(searchMatrix(m, 2)).toBe(true);
      expect(searchMatrix(m, 3)).toBe(true);
      expect(searchMatrix(m, 4)).toBe(false);
    });

    it('a value that is larger than the first column of a row but missing from it → false (not "found the row, so true")', () => {
      expect(searchMatrix(EXAMPLE, 25)).toBe(false);
      expect(searchMatrix(EXAMPLE, 59)).toBe(false);
    });

    it('returns real booleans, not indices or undefined', () => {
      expect(searchMatrix(EXAMPLE, 1)).toBe(true); // index 0 — don't return it!
      expect(searchMatrix(EXAMPLE, 2)).toBe(false);
    });
  });

  describe('randomized (seeded, reproducible)', () => {
    it('matches a cell-by-cell scan for every target in range on 200 random matrices', () => {
      const rng = createRng(1204);
      for (let t = 0; t < 200; t++) {
        const m = randomInt(rng, 1, 9);
        const n = randomInt(rng, 1, 9);
        const matrix = randomSortedMatrix(rng, m, n);
        const lo = matrix[0][0] - 2;
        const hi = matrix[m - 1][n - 1] + 2;
        for (let target = lo; target <= hi; target++) {
          expect(searchMatrix(matrix, target), `${JSON.stringify(matrix)}, target ${target}`).toBe(bruteSearch(matrix, target));
        }
      }
    });
  });

  describe('performance', () => {
    it('12,000 searches on a 1000×1000 matrix (scanning up to 10^6 cells per search is far too slow)', () => {
      const m = 1000;
      const n = 1000;
      // Even numbers 0, 2, 4, … row by row: odd targets are always absent.
      const matrix = Array.from({ length: m }, (_, r) => Array.from({ length: n }, (_, c) => 2 * (r * n + c)));
      const rng = createRng(4242);
      const targets = Array.from({ length: 12_000 }, (_, i) => 2 * randomInt(rng, 0, m * n - 1) + (i % 2));
      const { result, ms } = measure(() => {
        let found = 0;
        for (const t of targets) if (searchMatrix(matrix, t)) found++;
        return found;
      });
      expect(result, 'exactly the even targets (half of them) are present').toBe(6000);
      expect(ms, `took ${ms.toFixed(0)}ms — think O(log(m·n)) per search`).toBeLessThan(500);
    });
  });
});
