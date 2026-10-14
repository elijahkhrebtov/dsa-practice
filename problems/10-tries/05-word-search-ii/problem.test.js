import { describe, it, expect } from 'vitest';
import { findWords } from './problem.js';
import { createRng, randomInt, measure } from '../../../lib/test-utils.js';

/** Builds a board from rows of letters: ['ab', 'cd'] → [['a','b'],['c','d']]. */
const grid = (rows) => rows.map((r) => r.split(''));

/** Runs findWords on a copy-checked board and returns the sorted result. */
function solve(rows, words) {
  const board = grid(rows);
  const result = findWords(board, words);
  expect(board, 'the board must be unchanged when findWords returns').toEqual(grid(rows));
  expect(Array.isArray(result), 'should return an array').toBe(true);
  return [...result].sort();
}

/** Brute force: a separate backtracking search for each word. */
function bruteFindWords(board, words) {
  const R = board.length;
  const C = board[0].length;
  const used = board.map((row) => row.map(() => false));
  const can = (w, r, c, i) => {
    if (r < 0 || c < 0 || r >= R || c >= C || used[r][c] || board[r][c] !== w[i]) return false;
    if (i === w.length - 1) return true;
    used[r][c] = true;
    const ok = can(w, r + 1, c, i + 1) || can(w, r - 1, c, i + 1) || can(w, r, c + 1, i + 1) || can(w, r, c - 1, i + 1);
    used[r][c] = false;
    return ok;
  };
  return words.filter((w) => board.some((row, r) => row.some((_, c) => can(w, r, c, 0)))).sort();
}

const EXAMPLE_BOARD = ['oaan', 'etae', 'ihkr', 'iflv'];

describe('Word Search II', () => {
  describe('examples from the problem', () => {
    it('oath, pea, eat, rain on the 4×4 board → ["eat", "oath"]', () => {
      expect(solve(EXAMPLE_BOARD, ['oath', 'pea', 'eat', 'rain'])).toEqual(['eat', 'oath']);
    });

    it('[["a","b"],["c","d"]], ["abcb"] → [] (the single b cannot be used twice)', () => {
      expect(solve(['ab', 'cd'], ['abcb'])).toEqual([]);
    });

    it('[["a","b"],["c","d"]], ab, abdc, ad, ba, x → ["ab", "abdc", "ba"] (no diagonal steps)', () => {
      expect(solve(['ab', 'cd'], ['ab', 'abdc', 'ad', 'ba', 'x'])).toEqual(['ab', 'abdc', 'ba']);
    });
  });

  describe('edge cases', () => {
    it('1×1 board: ["a"] / ["a"] → ["a"]', () => {
      expect(solve(['a'], ['a'])).toEqual(['a']);
    });

    it('1×1 board: ["a"] / ["aa", "b"] → [] (a cell cannot be reused within one word)', () => {
      expect(solve(['a'], ['aa', 'b'])).toEqual([]);
    });

    it('an empty word list → []', () => {
      expect(solve(EXAMPLE_BOARD, [])).toEqual([]);
    });

    it('none of the words can be spelled → []', () => {
      expect(solve(EXAMPLE_BOARD, ['zebra', 'oaf', 'tea'])).toEqual([]);
    });

    it('a single row: "abcde" finds forward and backward runs, but not skipping letters', () => {
      expect(solve(['abcde'], ['abc', 'edc', 'cde', 'ace', 'abcde', 'edcba'])).toEqual(['abc', 'abcde', 'cde', 'edc', 'edcba']);
    });

    it('a single column works the same way', () => {
      expect(solve(['a', 'b', 'c'], ['abc', 'cba', 'ac'])).toEqual(['abc', 'cba']);
    });

    it('a word longer than the number of cells can never be found', () => {
      expect(solve(['ab', 'ba'], ['ababa', 'abab'])).toEqual(['abab']);
    });
  });

  describe('tricky cases', () => {
    it('a word reachable along several paths is reported only once', () => {
      // "aa" can be traced in many ways on an all-a board.
      expect(solve(['aaa', 'aaa'], ['aa'])).toEqual(['aa']);
    });

    it('a word and its prefix are both found: ap, app, apple, apply share one path', () => {
      expect(solve(['apply', 'xxxex'], ['app', 'apple', 'apply', 'ap', 'apps'])).toEqual(['ap', 'app', 'apple', 'apply']);
    });

    it('cell reuse inside one word is forbidden: "aba" on [["a","b"]] → not found', () => {
      expect(solve(['ab'], ['aba', 'ab', 'ba'])).toEqual(['ab', 'ba']);
    });

    it('different words may reuse the same cells: eat, tae, ea, at all come from one row', () => {
      expect(solve(['eat', 'xxx'], ['eat', 'tae', 'ea', 'at'])).toEqual(['at', 'ea', 'eat', 'tae']);
    });

    it('a path may turn corners and snake through the grid', () => {
      // a b c
      // f e d
      // g h i   → "abcdefghi" snakes through every cell
      expect(solve(['abc', 'fed', 'ghi'], ['abcdefghi', 'adg', 'cfi', 'abed'])).toEqual(['abcdefghi', 'abed']);
    });

    it('no wrapping around the edges: "ca" on [["a","b","c"]] is not found', () => {
      expect(solve(['abc'], ['ca', 'cb'])).toEqual(['cb']);
    });

    it('repeated letters on a ring: "aaaa" fits on a 2×2 all-a board, "aaaaa" does not', () => {
      expect(solve(['aa', 'aa'], ['aaaa', 'aaaaa', 'aaa'])).toEqual(['aaa', 'aaaa']);
    });

    it('a path that needs backtracking: the first branch tried dead-ends', () => {
      // a b x
      // b x x     From 'a', the 'b' on the right is a dead end (no 'c' next to it);
      // c d x     the 'b' below leads on to c → d.
      expect(solve(['abx', 'bxx', 'cdx'], ['abcd'])).toEqual(['abcd']);
    });
  });

  describe('randomized (seeded, reproducible)', () => {
    it('matches a per-word brute force on 150 random boards over a 3-letter alphabet', () => {
      const rng = createRng(4321);
      const letter = () => 'abc'[randomInt(rng, 0, 2)];
      for (let t = 0; t < 150; t++) {
        const R = randomInt(rng, 1, 4);
        const C = randomInt(rng, 1, 4);
        const rows = Array.from({ length: R }, () => Array.from({ length: C }, letter).join(''));
        const words = new Set();
        const count = randomInt(rng, 0, 25);
        while (words.size < count) words.add(Array.from({ length: randomInt(rng, 1, 6) }, letter).join(''));
        const list = [...words];
        expect(solve(rows, list), `board ${JSON.stringify(rows)}`).toEqual(bruteFindWords(grid(rows), list));
      }
    });
  });

  describe('performance', () => {
    it('12×12 mostly-"a" board with ~4,400 words sharing a 7-letter prefix (one DFS per word is far too slow)', () => {
      const N = 12;
      const board = Array.from({ length: N }, () => Array(N).fill('a'));
      const letters = 'bcdefghijklmnopqrstuvwxyz'.split('');
      // Scatter 24 distinct non-'a' letters so that no two of them are adjacent.
      let k = 0;
      for (let r = 1; r < N && k < 24; r += 2) {
        for (let c = r % 4 === 1 ? 1 : 2; c < N && k < 24; c += 3) board[r][c] = letters[k++];
      }
      const onBoard = letters.slice(0, 24);
      const words = [];
      for (const x of letters) for (const y of letters) words.push('aaaaaaaa' + x + y); // never found: x, y not adjacent
      for (const x of letters) for (const y of letters) for (const z of letters.slice(0, 6)) words.push('aaaaaaa' + x + y + z);
      for (const x of letters) words.push('aaaaaaaa' + x, 'aaaaaaa' + x + 'a'); // found iff x is on the board

      const before = board.map((row) => [...row]);
      const { result, ms } = measure(() => findWords(board, words));
      expect(board, 'board must be restored').toEqual(before);
      const expected = onBoard.flatMap((x) => ['aaaaaaaa' + x, 'aaaaaaa' + x + 'a']).sort();
      expect([...result].sort()).toEqual(expected);
      expect(ms, `took ${ms.toFixed(0)}ms — search all words in one pass with a trie`).toBeLessThan(500);
    });
  });
});
