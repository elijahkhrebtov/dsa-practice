import { describe, it, expect } from 'vitest';
import { solveNQueens } from './problem.js';
import { measure } from '../../../lib/test-utils.js';

const COUNTS = [1, 0, 0, 2, 10, 4, 40, 92, 352]; // solutions for n = 1..9

/** Canonical order for a list of boards (any order is allowed). */
const sortBoards = (boards) => boards.map((board) => board.join('\n')).sort();

/** Converts queen columns per row into a board, e.g. [1, 3, 0, 2] → [".Q..", "...Q", "Q...", "..Q."]. */
const toBoard = (cols) => cols.map((c) => '.'.repeat(c) + 'Q' + '.'.repeat(cols.length - c - 1));

/** Checks the shape of a board and that no two queens attack each other. */
function expectValidBoard(board, n) {
  expect(Array.isArray(board), 'each solution is an array of strings').toBe(true);
  expect(board).toHaveLength(n);
  const cols = new Set();
  const diag = new Set(); // r - c is constant along a "\" diagonal
  const anti = new Set(); // r + c is constant along a "/" diagonal
  board.forEach((row, r) => {
    expect(typeof row, 'each row is a string').toBe('string');
    expect(row).toMatch(new RegExp(`^[.Q]{${n}}$`));
    expect(row.split('Q').length - 1, `row ${r} must hold exactly one queen: "${row}"`).toBe(1);
    const c = row.indexOf('Q');
    expect(cols.has(c), `two queens in column ${c}`).toBe(false);
    expect(diag.has(r - c), `two queens on the same "\\" diagonal (row ${r})`).toBe(false);
    expect(anti.has(r + c), `two queens on the same "/" diagonal (row ${r})`).toBe(false);
    cols.add(c);
    diag.add(r - c);
    anti.add(r + c);
  });
}

/** Valid + distinct + the right count ⇒ exactly the full set of solutions. */
function expectAllSolutions(boards, n) {
  expect(Array.isArray(boards), 'should return an array').toBe(true);
  for (const board of boards) expectValidBoard(board, n);
  expect(new Set(boards.map((b) => b.join('\n'))).size, 'solutions must be distinct').toBe(boards.length);
  expect(boards).toHaveLength(COUNTS[n - 1]);
}

describe('N-Queens', () => {
  describe('examples from the problem', () => {
    it('n = 4 → the two mirror-image boards', () => {
      expect(sortBoards(solveNQueens(4))).toEqual(
        sortBoards([
          ['.Q..', '...Q', 'Q...', '..Q.'],
          ['..Q.', 'Q...', '...Q', '.Q..'],
        ]),
      );
    });

    it('n = 1 → [["Q"]]', () => {
      expect(solveNQueens(1)).toEqual([['Q']]);
    });

    it('n = 3 → [] (no placement works)', () => {
      expect(solveNQueens(3)).toEqual([]);
    });
  });

  describe('edge cases', () => {
    it('n = 2 → [] (two queens on a 2×2 board always share a row, column or diagonal)', () => {
      expect(solveNQueens(2)).toEqual([]);
    });

    it('n = 6 → exactly these 4 boards (fewer than for n = 5!)', () => {
      const expected = [
        [1, 3, 5, 0, 2, 4],
        [2, 5, 1, 4, 0, 3],
        [3, 0, 4, 1, 5, 2],
        [4, 2, 0, 5, 3, 1],
      ].map(toBoard);
      expect(sortBoards(solveNQueens(6))).toEqual(sortBoards(expected));
    });

    it('rows are strings like "..Q." — not arrays of characters, not column indices', () => {
      const [board] = solveNQueens(4);
      expect(board.every((row) => typeof row === 'string' && row.length === 4)).toBe(true);
    });
  });

  describe('number of solutions for n = 1..8', () => {
    it.each(COUNTS.slice(0, 8).map((count, i) => [i + 1, count]))('n = %i → %i solutions', (n, count) => {
      expect(solveNQueens(n)).toHaveLength(count);
    });
  });

  describe('every board is valid', () => {
    it.each([1, 4, 5, 6, 7, 8])('n = %i: every board has one queen per row and column, none sharing a diagonal, and no duplicates', (n) => {
      expectAllSolutions(solveNQueens(n), n);
    });

    it('n = 8: the set of solutions is closed under mirroring (reverse every row → still a solution)', () => {
      const boards = solveNQueens(8);
      const all = new Set(boards.map((b) => b.join('\n')));
      for (const board of boards) {
        const mirrored = board.map((row) => [...row].reverse().join(''));
        expect(all.has(mirrored.join('\n')), `mirror of ${JSON.stringify(board)} is missing`).toBe(true);
      }
    });

    it('n = 8: the set is also closed under flipping upside down (reverse the row order)', () => {
      const boards = solveNQueens(8);
      const all = new Set(boards.map((b) => b.join('\n')));
      for (const board of boards) {
        expect(all.has([...board].reverse().join('\n'))).toBe(true);
      }
    });

    it('calling it twice gives the same solutions (no state leaks between calls)', () => {
      const first = sortBoards(solveNQueens(6));
      solveNQueens(5);
      expect(sortBoards(solveNQueens(6))).toEqual(first);
    });
  });

  describe('performance', () => {
    it('n = 9 → all 352 valid boards in well under a second (prune each row with O(1) column/diagonal checks)', () => {
      const { result, ms } = measure(() => solveNQueens(9));
      expectAllSolutions(result, 9);
      expect(ms, `took ${ms.toFixed(0)}ms — place queens row by row and skip attacked squares early`).toBeLessThan(1000);
    });
  });
});
