import { describe, it, expect } from 'vitest';
import { Trie } from './problem.js';
import { createRng, randomInt, measure } from '../../../lib/test-utils.js';

/** Random lowercase word with length in [min, max], letters from the first `alphabet` letters. */
function randomWord(rng, min, max, alphabet = 26) {
  const n = randomInt(rng, min, max);
  let s = '';
  for (let i = 0; i < n; i++) s += String.fromCharCode(97 + randomInt(rng, 0, alphabet - 1));
  return s;
}

describe('Implement Trie (Prefix Tree)', () => {
  describe('examples from the problem', () => {
    it('insert apple → search apple true, search app false, startsWith app true; insert app → search app true', () => {
      const trie = new Trie();
      trie.insert('apple');
      expect(trie.search('apple')).toBe(true);
      expect(trie.search('app')).toBe(false);
      expect(trie.startsWith('app')).toBe(true);
      trie.insert('app');
      expect(trie.search('app')).toBe(true);
    });

    it('insert car → startsWith car true (a word is its own prefix), startsWith cart false, search ca false', () => {
      const trie = new Trie();
      trie.insert('car');
      expect(trie.startsWith('car')).toBe(true);
      expect(trie.startsWith('cart')).toBe(false);
      expect(trie.search('ca')).toBe(false);
    });
  });

  describe('basic behaviour', () => {
    it('an empty trie finds nothing', () => {
      const trie = new Trie();
      expect(trie.search('a')).toBe(false);
      expect(trie.startsWith('a')).toBe(false);
    });

    it('single-letter words: insert a → search a true, search b false, startsWith a true', () => {
      const trie = new Trie();
      trie.insert('a');
      expect(trie.search('a')).toBe(true);
      expect(trie.search('b')).toBe(false);
      expect(trie.startsWith('a')).toBe(true);
    });

    it('search returns false for a LONGER word that merely starts with a stored one', () => {
      const trie = new Trie();
      trie.insert('app');
      expect(trie.search('apple')).toBe(false);
      expect(trie.startsWith('apple')).toBe(false);
    });

    it('inserting the same word twice is harmless', () => {
      const trie = new Trie();
      trie.insert('hello');
      trie.insert('hello');
      expect(trie.search('hello')).toBe(true);
      expect(trie.search('hell')).toBe(false);
    });

    it('instances are independent of each other', () => {
      const a = new Trie();
      const b = new Trie();
      a.insert('alpha');
      b.insert('beta');
      expect(a.search('alpha')).toBe(true);
      expect(a.search('beta')).toBe(false);
      expect(b.startsWith('al')).toBe(false);
      expect(b.startsWith('be')).toBe(true);
    });

    it('returns real booleans (not undefined / null / nodes)', () => {
      const trie = new Trie();
      trie.insert('abc');
      expect(trie.search('abc')).toBe(true);
      expect(trie.search('ab')).toBe(false);
      expect(trie.search('xyz')).toBe(false);
      expect(trie.startsWith('ab')).toBe(true);
      expect(trie.startsWith('abd')).toBe(false);
    });
  });

  describe('tricky cases', () => {
    it('a chain of nested words: a, ab, abc, abcd are all found; abcde is not', () => {
      const trie = new Trie();
      ['a', 'ab', 'abc', 'abcd'].forEach((w) => trie.insert(w));
      for (const w of ['a', 'ab', 'abc', 'abcd']) expect(trie.search(w), w).toBe(true);
      expect(trie.search('abcde')).toBe(false);
    });

    it('inserting a longer word first, then its prefix: the prefix becomes a word only after its own insert', () => {
      const trie = new Trie();
      trie.insert('abcd');
      expect(trie.search('ab')).toBe(false);
      trie.insert('ab');
      expect(trie.search('ab')).toBe(true);
      expect(trie.search('abc')).toBe(false); // still just a prefix
      expect(trie.search('abcd')).toBe(true);
    });

    it('words that share a prefix and then branch: car, cat, cart, dog', () => {
      const trie = new Trie();
      ['car', 'cat', 'cart', 'dog'].forEach((w) => trie.insert(w));
      expect(trie.search('car')).toBe(true);
      expect(trie.search('cat')).toBe(true);
      expect(trie.search('cart')).toBe(true);
      expect(trie.search('ca')).toBe(false);
      expect(trie.search('cats')).toBe(false);
      expect(trie.startsWith('ca')).toBe(true);
      expect(trie.startsWith('do')).toBe(true);
      expect(trie.startsWith('cb')).toBe(false);
      expect(trie.startsWith('d')).toBe(true);
      expect(trie.startsWith('e')).toBe(false);
    });

    it('same letters in a different order are different words: abc vs cba vs bca', () => {
      const trie = new Trie();
      trie.insert('abc');
      expect(trie.search('cba')).toBe(false);
      expect(trie.startsWith('bc')).toBe(false); // prefixes start at the beginning, not anywhere
      trie.insert('cba');
      expect(trie.search('cba')).toBe(true);
      expect(trie.search('bca')).toBe(false);
    });

    it('inherited object keys are not words: search("constructor") is false (a plain {} children map can trip on this)', () => {
      // A plain-object children map would find inherited keys such as "constructor".
      const trie = new Trie();
      expect(trie.search('constructor')).toBe(false);
      expect(trie.startsWith('constructor')).toBe(false);
      trie.insert('tostring');
      expect(trie.search('constructor')).toBe(false);
      expect(trie.search('valueof')).toBe(false);
      expect(trie.search('tostring')).toBe(true);
    });

    it('a 2,000-letter word and its prefixes', () => {
      const trie = new Trie();
      const long = 'ab'.repeat(1000);
      trie.insert(long);
      expect(trie.search(long)).toBe(true);
      expect(trie.search(long.slice(0, 1999))).toBe(false);
      expect(trie.startsWith(long.slice(0, 1999))).toBe(true);
      expect(trie.startsWith(long.slice(0, 1999) + 'a')).toBe(false);
    });
  });

  describe('randomized against a simple model (seeded)', () => {
    it('matches a word-list model over 6,000 random operations on a small alphabet', () => {
      const rng = createRng(2718);
      const trie = new Trie();
      const words = new Set();
      for (let step = 0; step < 6000; step++) {
        const op = randomInt(rng, 0, 2);
        const w = randomWord(rng, 1, 5, 3); // letters a–c only, so lots of shared prefixes
        if (op === 0) {
          trie.insert(w);
          words.add(w);
        } else if (op === 1) {
          expect(trie.search(w), `search(${w})`).toBe(words.has(w));
        } else {
          const expected = [...words].some((x) => x.startsWith(w));
          expect(trie.startsWith(w), `startsWith(${w})`).toBe(expected);
        }
      }
    });
  });

  describe('performance', () => {
    it('30,000 inserts, 30,000 searches and 50,000 prefix queries (scanning all words per startsWith is far too slow)', () => {
      const rng = createRng(11);
      const words = Array.from({ length: 30_000 }, () => randomWord(rng, 6, 12));
      const searches = Array.from({ length: 30_000 }, (_, i) =>
        i % 2 ? words[randomInt(rng, 0, words.length - 1)] : randomWord(rng, 6, 12),
      );
      const prefixes = Array.from({ length: 50_000 }, (_, i) => {
        if (i % 2) {
          const w = words[randomInt(rng, 0, words.length - 1)];
          return w.slice(0, randomInt(rng, 1, w.length));
        }
        return randomWord(rng, 4, 8);
      });
      const wordSet = new Set(words);
      const expectedSearch = searches.filter((w) => wordSet.has(w)).length;
      const allPrefixes = new Set(words.flatMap((w) => Array.from(w, (_, i) => w.slice(0, i + 1))));
      const expectedPrefixHits = prefixes.filter((p) => allPrefixes.has(p)).length;

      const { result, ms } = measure(() => {
        const trie = new Trie();
        for (const w of words) trie.insert(w);
        let found = 0;
        for (const w of searches) if (trie.search(w)) found++;
        let prefixHits = 0;
        for (const p of prefixes) if (trie.startsWith(p)) prefixHits++;
        return { found, prefixHits };
      });
      expect(result.found).toBe(expectedSearch);
      expect(result.prefixHits).toBe(expectedPrefixHits);
      expect(ms, `took ${ms.toFixed(0)}ms — each operation should be O(word length)`).toBeLessThan(1000);
    });
  });
});
