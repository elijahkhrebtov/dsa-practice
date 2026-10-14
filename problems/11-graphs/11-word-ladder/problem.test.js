import { describe, it, expect } from 'vitest';
import { ladderLength } from './problem.js';
import { createRng, randomInt, shuffle, measure } from '../../../lib/test-utils.js';

/** True when a and b differ in exactly one position. */
function oneApart(a, b) {
  let diff = 0;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i] && ++diff > 1) return false;
  return diff === 1;
}

/** Brute force: BFS that compares against every word in the list (fine for tiny lists). */
function bruteForce(beginWord, endWord, wordList) {
  if (!wordList.includes(endWord)) return 0;
  const dist = new Map([[beginWord, 1]]);
  const queue = [beginWord];
  for (let head = 0; head < queue.length; head++) {
    const word = queue[head];
    for (const next of wordList) {
      if (!dist.has(next) && oneApart(word, next)) {
        dist.set(next, dist.get(word) + 1);
        queue.push(next);
      }
    }
  }
  return dist.get(endWord) ?? 0;
}

const hamming = (a, b) => [...a].filter((ch, i) => ch !== b[i]).length;

/**
 * ~5000 six-letter words: all 4096 words over "abcd", ~900 words that have
 * exactly one letter outside "abcd", and the isolated word "zzzzzz".
 * Because every "abcd" word is present, the shortest ladder between an
 * "abcd" word (or a one-foreign-letter word) and an "abcd" word is exactly
 * hamming distance + 1 — you can always fix one mismatched letter per step,
 * and no step can fix more than one.
 */
function bigDictionary() {
  const rng = createRng(1);
  const letters = 'abcd';
  const main = [];
  for (let code = 0; code < 4096; code++) {
    let word = '';
    for (let i = 0, x = code; i < 6; i++, x = Math.floor(x / 4)) word += letters[x % 4];
    main.push(word);
  }
  const foreign = 'efghijklmnopqrstuvwxy';
  const extra = new Set();
  while (extra.size < 900) {
    const base = main[randomInt(rng, 0, main.length - 1)];
    const pos = randomInt(rng, 0, 5);
    extra.add(base.slice(0, pos) + foreign[randomInt(rng, 0, foreign.length - 1)] + base.slice(pos + 1));
  }
  const wordList = shuffle(rng, [...main, ...extra, 'zzzzzz']);
  return { wordList, main, extra: [...extra] };
}

describe('Word Ladder', () => {
  describe('examples from the problem', () => {
    it('hit → cog with [hot, dot, dog, lot, log, cog] → 5', () => {
      expect(ladderLength('hit', 'cog', ['hot', 'dot', 'dog', 'lot', 'log', 'cog'])).toBe(5);
    });

    it('hit → cog without "cog" in the list → 0', () => {
      expect(ladderLength('hit', 'cog', ['hot', 'dot', 'dog', 'lot', 'log'])).toBe(0);
    });

    it('a → c with [a, b, c] → 2 (count words, not steps)', () => {
      expect(ladderLength('a', 'c', ['a', 'b', 'c'])).toBe(2);
    });
  });

  describe('edge cases', () => {
    it('empty word list → 0', () => {
      expect(ladderLength('hot', 'dot', [])).toBe(0);
    });

    it('endWord is one letter away but missing from the list → 0', () => {
      expect(ladderLength('cat', 'cot', ['cut', 'cat'])).toBe(0);
    });

    it('endWord is one letter away and in the list → 2', () => {
      expect(ladderLength('cat', 'cot', ['cot'])).toBe(2);
    });

    it('beginWord also appearing in the list changes nothing: hot → dog with [hot, dot, dog] → 3', () => {
      expect(ladderLength('hot', 'dog', ['hot', 'dot', 'dog'])).toBe(3);
    });

    it('duplicate words in the list are harmless → 3', () => {
      expect(ladderLength('hot', 'dog', ['dot', 'dot', 'dog', 'dog', 'dot'])).toBe(3);
    });

    it('single-letter words: any letter reaches any other in one step (a → z → 2)', () => {
      expect(ladderLength('a', 'z', ['q', 'z', 'm'])).toBe(2);
    });

    it('does not modify the word list', () => {
      const wordList = ['hot', 'dot', 'dog', 'lot', 'log', 'cog'];
      const copy = [...wordList];
      ladderLength('hit', 'cog', wordList);
      expect(wordList).toEqual(copy);
    });
  });

  describe('tricky cases', () => {
    it('endWord in the list but unreachable → 0', () => {
      expect(ladderLength('hit', 'cog', ['hot', 'dot', 'cog'])).toBe(0);
    });

    it('rearranging letters is not a step: abc → bca with [bca] → 0', () => {
      expect(ladderLength('abc', 'bca', ['bca'])).toBe(0);
    });

    it('changing two letters at once is not a step: ab → cd with [cd] → 0', () => {
      expect(ladderLength('ab', 'cd', ['cd'])).toBe(0);
    });

    it('sometimes you must detour through letters that are in neither word: aaa → bbb → 7', () => {
      // No word is one step closer to "bbb" from "aaa"; the only route goes via "c".
      const wordList = ['aac', 'acc', 'ccc', 'ccb', 'cbb', 'bbb'];
      expect(ladderLength('aaa', 'bbb', wordList)).toBe(7);
    });

    it('several routes exist; the shortest one has 4 words', () => {
      const wordList = ['bat', 'bet', 'bit', 'bot', 'cot', 'cog', 'dog', 'big', 'bog'];
      // bat → bot → bog → dog = 4 words. Detours such as bat → bot → cot → cog → dog
      // (5) or bat → bit → big → bog → dog (5) also exist — BFS finds the shortest first.
      expect(ladderLength('bat', 'dog', wordList)).toBe(4);
    });

    it('cycles in the word graph do not cause infinite loops', () => {
      // aa, ab, bb, ba form a 4-cycle; the tail ba → bc → cc leads to the target.
      // Shortest: aa → ba → bc → cc (4 words).
      expect(ladderLength('aa', 'cc', ['ab', 'bb', 'ba', 'aa', 'bc', 'cc'])).toBe(4);
    });

    it('a long forced chain: a → b → … changes one letter at a time → 11 words', () => {
      // aaaaaaaaaa → baaaaaaaaa → bbaaaaaaaa → … → bbbbbbbbbb (10 changes, 11 words).
      const wordList = [];
      for (let k = 1; k <= 10; k++) wordList.push('b'.repeat(k) + 'a'.repeat(10 - k));
      expect(ladderLength('a'.repeat(10), 'b'.repeat(10), shuffle(createRng(3), wordList))).toBe(11);
    });

    it('example 1 in reverse: dog → hit with [hot, dot, hit, dog] → 4', () => {
      expect(ladderLength('dog', 'hit', ['hot', 'dot', 'hit', 'dog'])).toBe(4);
    });
  });

  describe('randomized (seeded) against a brute-force pairwise BFS', () => {
    it('agrees on 400 random small dictionaries', () => {
      const rng = createRng(5150);
      const alphabet = 'abc';
      const randomWord = (len) => Array.from({ length: len }, () => alphabet[randomInt(rng, 0, 2)]).join('');
      let zeros = 0;
      for (let t = 0; t < 400; t++) {
        const len = randomInt(rng, 1, 4);
        const size = randomInt(rng, 0, 18);
        const wordList = Array.from({ length: size }, () => randomWord(len));
        const beginWord = randomWord(len);
        let endWord = rng() < 0.85 && size > 0 ? wordList[randomInt(rng, 0, size - 1)] : randomWord(len);
        if (endWord === beginWord) continue;
        const expected = bruteForce(beginWord, endWord, wordList);
        if (expected === 0) zeros++;
        expect(
          ladderLength(beginWord, endWord, wordList),
          `begin=${beginWord}, end=${endWord}, list=${JSON.stringify(wordList)}`,
        ).toBe(expected);
      }
      expect(zeros).toBeGreaterThan(20);
      expect(zeros).toBeLessThan(300);
    });
  });

  describe('performance', () => {
    it('10 searches over ~5000 six-letter words quickly (scanning the whole list for every dequeued word is O(N²·L) and takes seconds)', () => {
      const { wordList, main } = bigDictionary();
      const rng = createRng(77);
      const queries = [['aaaaaa', 'dddddd'], ['bacdab', 'zzzzzz'], ['cccccc', 'zzzzzz']];
      while (queries.length < 10) {
        const begin = wordList[randomInt(rng, 0, wordList.length - 1)];
        const end = main[randomInt(rng, 0, main.length - 1)];
        if (begin !== end && begin !== 'zzzzzz') queries.push([begin, end]);
      }
      const expected = queries.map(([b, e]) => (e === 'zzzzzz' ? 0 : hamming(b, e) + 1));

      const { result, ms } = measure(() => queries.map(([b, e]) => ladderLength(b, e, wordList)));
      expect(result).toEqual(expected);
      expect(ms, `took ${ms.toFixed(0)}ms — generate neighbours from the word itself instead of scanning the list`).toBeLessThan(750);
    });
  });
});
