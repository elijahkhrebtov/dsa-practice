import { describe, it, expect } from 'vitest';
import { WordDictionary } from './problem.js';
import { createRng, randomInt, measure } from '../../../lib/test-utils.js';

/** Brute-force matcher: does any word match the pattern? */
function bruteSearch(words, pattern) {
  for (const w of words) {
    if (w.length !== pattern.length) continue;
    let ok = true;
    for (let i = 0; i < w.length && ok; i++) if (pattern[i] !== '.' && pattern[i] !== w[i]) ok = false;
    if (ok) return true;
  }
  return false;
}

const dictOf = (words) => {
  const d = new WordDictionary();
  for (const w of words) d.addWord(w);
  return d;
};

describe('Design Add and Search Words Data Structure', () => {
  describe('examples from the problem', () => {
    const d = dictOf(['bad', 'dad', 'mad']);

    it('pad → false', () => expect(d.search('pad')).toBe(false));
    it('bad → true', () => expect(d.search('bad')).toBe(true));
    it('.ad → true (the dot can be b, d or m)', () => expect(d.search('.ad')).toBe(true));
    it('b.. → true', () => expect(d.search('b..')).toBe(true));
    it('b. → false (too short — "ba" is only a prefix of "bad")', () => expect(d.search('b.')).toBe(false));
    it('... → true, .... → false (all-dot patterns only care about length)', () => {
      expect(d.search('...')).toBe(true);
      expect(d.search('....')).toBe(false);
    });
  });

  describe('basic behaviour', () => {
    it('an empty dictionary matches nothing, not even "."', () => {
      const d = new WordDictionary();
      expect(d.search('a')).toBe(false);
      expect(d.search('.')).toBe(false);
    });

    it('single-letter words: "a" stored → "a" and "." match, "b" and ".." do not', () => {
      const d = dictOf(['a']);
      expect(d.search('a')).toBe(true);
      expect(d.search('.')).toBe(true);
      expect(d.search('b')).toBe(false);
      expect(d.search('..')).toBe(false);
    });

    it('words added later become searchable; adding twice is harmless', () => {
      const d = new WordDictionary();
      expect(d.search('cat')).toBe(false);
      d.addWord('cat');
      d.addWord('cat');
      expect(d.search('cat')).toBe(true);
      expect(d.search('c.t')).toBe(true);
    });

    it('instances are independent', () => {
      const a = dictOf(['one']);
      const b = dictOf(['two']);
      expect(a.search('t..')).toBe(false);
      expect(b.search('t..')).toBe(true);
    });
  });

  describe('tricky cases', () => {
    it('a dot matches exactly ONE letter, never zero: "bad" stored → "ba.d" and "b.ad" are false', () => {
      const d = dictOf(['bad']);
      expect(d.search('ba.d')).toBe(false);
      expect(d.search('b.ad')).toBe(false);
      expect(d.search('.bad')).toBe(false);
    });

    it('whole-word matching under dots: "abcd" stored → "ab." false, "ab.." true, "ab..." false', () => {
      const d = dictOf(['abcd']);
      expect(d.search('ab.')).toBe(false);
      expect(d.search('ab..')).toBe(true);
      expect(d.search('ab...')).toBe(false);
    });

    it('backtracking: the first branch under a dot fails deeper down, a later one succeeds (".bd" with abc, xbd)', () => {
      // Taking 'a' for the dot reaches "ab" but no "abd" — you must go back and try 'x'.
      const d = dictOf(['abc', 'xbd']);
      expect(d.search('.bd')).toBe(true);
      expect(d.search('.bc')).toBe(true);
      expect(d.search('.be')).toBe(false);
    });

    it('consecutive dots: "a..e" matches able/axle/acne/…, "a..y" matches nothing, "a...y" matches abbey', () => {
      const d = dictOf(['able', 'axle', 'acne', 'aloe', 'ache', 'abbey']);
      expect(d.search('a..e')).toBe(true);
      expect(d.search('a..y')).toBe(false);
      expect(d.search('a...y')).toBe(true); // abbey
      expect(d.search('...e')).toBe(true);
      expect(d.search('.b..')).toBe(true);
      expect(d.search('.z..')).toBe(false);
    });

    it('a word that is a prefix of another: "ab" and "abc" stored → "a." true, ".." true, "a.." true, "..." true, "...." false', () => {
      const d = dictOf(['ab', 'abc']);
      expect(d.search('a.')).toBe(true);
      expect(d.search('..')).toBe(true);
      expect(d.search('a..')).toBe(true);
      expect(d.search('...')).toBe(true);
      expect(d.search('....')).toBe(false);
    });

    it('a stored longer word does not make a shorter all-dot pattern match: "abc" stored → ".." false', () => {
      const d = dictOf(['abc']);
      expect(d.search('..')).toBe(false);
      expect(d.search('.')).toBe(false);
    });

    it('25-letter words and 25-dot patterns', () => {
      const long = 'abcdefghijklmnopqrstuvwxy';
      const d = dictOf([long]);
      expect(d.search(long)).toBe(true);
      expect(d.search('.'.repeat(25))).toBe(true);
      expect(d.search('.'.repeat(24))).toBe(false);
      expect(d.search(long.slice(0, 24) + '.')).toBe(true);
      expect(d.search(long.slice(0, 24) + 'z')).toBe(false);
    });
  });

  describe('randomized against a brute force (seeded)', () => {
    it('5,000 random addWord / search operations on a 3-letter alphabet', () => {
      const rng = createRng(8080);
      const d = new WordDictionary();
      const words = [];
      for (let step = 0; step < 5000; step++) {
        const len = randomInt(rng, 1, 5);
        if (randomInt(rng, 0, 2) === 0) {
          let w = '';
          for (let i = 0; i < len; i++) w += 'abc'[randomInt(rng, 0, 2)];
          d.addWord(w);
          words.push(w);
        } else {
          let p = '';
          for (let i = 0; i < len; i++) p += 'abc..'[randomInt(rng, 0, 4)]; // ~40% dots
          expect(d.search(p), `search(${p})`).toBe(bruteSearch(words, p));
        }
      }
    });
  });

  describe('performance', () => {
    it('20,000 words and 20,000 searches with up to 2 dots (comparing against every word per search is far too slow)', () => {
      const rng = createRng(5);
      // All words have length 10 and share their first 3 letters from {a, b}, so comparing
      // with each word one by one gets no shortcut from length or from the first letter.
      const randomWord = () => {
        let s = '';
        for (let i = 0; i < 10; i++) s += String.fromCharCode(97 + randomInt(rng, 0, i < 3 ? 1 : 25));
        return s;
      };
      const words = Array.from({ length: 20_000 }, randomWord);
      const patterns = Array.from({ length: 20_000 }, (_, i) => {
        const chars = (i % 2 ? words[randomInt(rng, 0, words.length - 1)] : randomWord()).split('');
        const dots = randomInt(rng, 0, 2);
        for (let k = 0; k < dots; k++) chars[randomInt(rng, 0, 9)] = '.';
        return chars.join('');
      });

      const { result, ms } = measure(() => {
        const d = new WordDictionary();
        for (const w of words) d.addWord(w);
        let hits = 0;
        for (const p of patterns) if (d.search(p)) hits++;
        return hits;
      });
      // Every odd pattern came from a stored word; random even patterns almost never match.
      expect(result).toBeGreaterThanOrEqual(10_000);
      expect(result).toBeLessThan(10_100);
      expect(ms, `took ${ms.toFixed(0)}ms — searches should not scan all words`).toBeLessThan(750);
    });
  });
});
