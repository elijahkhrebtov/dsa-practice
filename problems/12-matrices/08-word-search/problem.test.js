import { describe, it, expect } from 'vitest';
import { exist } from './problem.js';
import { createRng, randomInt, measure, shuffle } from '../../../lib/test-utils.js';

/** Builds a board from row strings: b('AB', 'CD') → [['A','B'],['C','D']]. */
const b = (...rows) => rows.map((row) => [...row]);

/** Runs exist() and also checks that the board is left exactly as it was. */
function search(board, word) {
  const before = board.map((row) => [...row]);
  const result = exist(board, word);
  expect(board, 'the board must be restored after the call (did you un-mark every visited cell?)').toEqual(before);
  return result;
}

const EXAMPLE = () => b('ABCE', 'SFCS', 'ADEE');

/** Plants `word` along a random self-avoiding path, or returns null if the walk gets stuck. */
function plantWord(rng, board, word) {
  const m = board.length;
  const n = board[0].length;
  const path = [[randomInt(rng, 0, m - 1), randomInt(rng, 0, n - 1)]];
  const used = new Set([path[0].join()]);
  while (path.length < word.length) {
    const [r, c] = path[path.length - 1];
    const options = shuffle(rng, [[r + 1, c], [r - 1, c], [r, c + 1], [r, c - 1]]).filter(
      ([x, y]) => x >= 0 && y >= 0 && x < m && y < n && !used.has(`${x},${y}`),
    );
    if (options.length === 0) return null;
    path.push(options[0]);
    used.add(options[0].join());
  }
  path.forEach(([r, c], i) => (board[r][c] = word[i]));
  return board;
}

describe('Word Search', () => {
  describe('examples from the problem', () => {
    it('"ABCCED" → true (A → B → C → C → E → D)', () => {
      expect(search(EXAMPLE(), 'ABCCED')).toBe(true);
    });

    it('"SEE" → true', () => {
      expect(search(EXAMPLE(), 'SEE')).toBe(true);
    });

    it('"ABCB" → false (the only reachable B is already used)', () => {
      expect(search(EXAMPLE(), 'ABCB')).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('1×1 board with the matching letter → true', () => {
      expect(search(b('A'), 'A')).toBe(true);
    });

    it('1×1 board with a different letter → false', () => {
      expect(search(b('A'), 'B')).toBe(false);
    });

    it('a one-letter word found in the last cell → true (try every starting cell)', () => {
      expect(search(b('XYZ', 'XYQ'), 'Q')).toBe(true);
    });

    it('a word longer than the number of cells → false (cells cannot be reused)', () => {
      expect(search(b('AA', 'AA'), 'AAAAA')).toBe(false);
    });

    it('a word using every cell exactly once (spiral through a 3×3) → true', () => {
      // a b c
      // h i d      spelled clockwise: abcdefghi
      // g f e
      expect(search(b('abc', 'hid', 'gfe'), 'abcdefghi')).toBe(true);
    });

    it('letters are case-sensitive: "a" is not "A"', () => {
      expect(search(b('Ab', 'cD'), 'ab')).toBe(false);
      expect(search(b('Ab', 'cD'), 'Ab')).toBe(true);
    });

    it('a letter that does not appear on the board at all → false', () => {
      expect(search(EXAMPLE(), 'ABZ')).toBe(false);
    });
  });

  describe('tricky cases', () => {
    it('[["A","A"]], "AAA" → false (stepping back onto the same cell is not allowed)', () => {
      expect(search(b('AA'), 'AAA')).toBe(false);
    });

    it('diagonal moves are not allowed: "AD" in [["A","B"],["C","D"]] → false', () => {
      expect(search(b('AB', 'CD'), 'AD')).toBe(false);
    });

    it('paths do not wrap around the edges: "CA" in a single row "ABC" → false', () => {
      expect(search(b('ABC'), 'CA')).toBe(false);
    });

    it('paths may go right-to-left and bottom-to-top: "CBA" and "GDA" → true', () => {
      expect(search(b('ABC'), 'CBA')).toBe(true);
      expect(search(b('A', 'D', 'G'), 'GDA')).toBe(true);
    });

    it('the first promising branch dead-ends — you must back up and try another: "AAB" → true', () => {
      expect(search(b('CAA', 'AAA', 'BCD'), 'AAB')).toBe(true);
    });

    it('"ABCESEEEFS" → true (a failed branch must un-mark its cells, or a later path is blocked)', () => {
      // A failed detour marks some E's; if they are not restored, the real path
      // A B C E S E E E F S can no longer get through them.
      expect(search(b('ABCE', 'SFES', 'ADEE'), 'ABCESEEEFS')).toBe(true);
    });

    it('around the square: "abdc" → true, but "abcd" → false (b and c are only diagonal)', () => {
      expect(search(b('ab', 'cd'), 'abdc')).toBe(true);
      expect(search(b('ab', 'cd'), 'abcd')).toBe(false);
    });

    it('the board is restored after a SUCCESSFUL search too (no early return that skips the un-marking)', () => {
      const board = EXAMPLE();
      expect(exist(board, 'ABCCED')).toBe(true);
      expect(board).toEqual(EXAMPLE());
      // ...so asking again on the same board gives the same answers.
      expect(exist(board, 'ABCCED')).toBe(true);
      expect(exist(board, 'SEE')).toBe(true);
      expect(board).toEqual(EXAMPLE());
    });
  });

  describe('randomized (seeded, reproducible)', () => {
    it('finds 200 words planted along random paths on random boards', () => {
      const rng = createRng(31);
      let planted = 0;
      while (planted < 200) {
        const m = randomInt(rng, 1, 6);
        const n = randomInt(rng, 1, 6);
        const board = Array.from({ length: m }, () => Array.from({ length: n }, () => 'ABC'[randomInt(rng, 0, 2)]));
        const len = randomInt(rng, 1, Math.min(15, m * n));
        const word = Array.from({ length: len }, () => 'ABC'[randomInt(rng, 0, 2)]).join('');
        if (!plantWord(rng, board, word)) continue;
        planted++;
        expect(search(board, word), `word "${word}" on ${JSON.stringify(board)}`).toBe(true);
      }
    });

    it('a word and its reverse always get the same answer (a path read backwards is still a path)', () => {
      const rng = createRng(8);
      let seenTrue = 0;
      let seenFalse = 0;
      for (let t = 0; t < 300; t++) {
        const m = randomInt(rng, 1, 4);
        const n = randomInt(rng, 1, 4);
        const board = Array.from({ length: m }, () => Array.from({ length: n }, () => 'AB'[randomInt(rng, 0, 1)]));
        const word = Array.from({ length: randomInt(rng, 1, 7) }, () => 'AB'[randomInt(rng, 0, 1)]).join('');
        const forward = search(board, word);
        const backward = search(board, [...word].reverse().join(''));
        expect(backward, `word "${word}" on ${JSON.stringify(board)}`).toBe(forward);
        if (forward) seenTrue++;
        else seenFalse++;
      }
      // Sanity check that the random cases exercise both answers.
      expect(seenTrue).toBeGreaterThan(30);
      expect(seenFalse).toBeGreaterThan(30);
    });

    it('a word containing a letter missing from the board is never found', () => {
      const rng = createRng(99);
      for (let t = 0; t < 100; t++) {
        const m = randomInt(rng, 1, 6);
        const n = randomInt(rng, 1, 6);
        const board = Array.from({ length: m }, () => Array.from({ length: n }, () => 'ABC'[randomInt(rng, 0, 2)]));
        const letters = Array.from({ length: randomInt(rng, 0, 8) }, () => 'ABC'[randomInt(rng, 0, 2)]);
        letters.splice(randomInt(rng, 0, letters.length), 0, 'D');
        expect(search(board, letters.join(''))).toBe(false);
      }
    });
  });

  describe('performance', () => {
    it('6×6 board of all A, word "AAAAAAAAAAAAAAB" → false (millions of dead-end paths — plain backtracking still copes, but don\'t copy sets/arrays per step)', () => {
      const board = Array.from({ length: 6 }, () => Array(6).fill('A'));
      const { result, ms } = measure(() => search(board, 'A'.repeat(14) + 'B'));
      expect(result).toBe(false);
      expect(ms, `took ${ms.toFixed(0)}ms — mark/unmark cells in place instead of copying state`).toBeLessThan(1500);
    });

    it('6×6 board of all A with a single B in a corner, word of 14 A + "B" → true', () => {
      const board = Array.from({ length: 6 }, () => Array(6).fill('A'));
      board[5][5] = 'B';
      const { result, ms } = measure(() => search(board, 'A'.repeat(14) + 'B'));
      expect(result).toBe(true);
      expect(ms, `took ${ms.toFixed(0)}ms`).toBeLessThan(1500);
    });

    it('6×6 board of all A, word of 15 A → true quickly (stop at the first complete path)', () => {
      const board = Array.from({ length: 6 }, () => Array(6).fill('A'));
      const { result, ms } = measure(() => search(board, 'A'.repeat(15)));
      expect(result).toBe(true);
      expect(ms, `took ${ms.toFixed(0)}ms — return as soon as one path spells the word`).toBeLessThan(500);
    });
  });
});
