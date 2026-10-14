import { describe, it, expect } from 'vitest';
import { alienOrder } from './problem.js';
import { createRng, randomInt, shuffle } from '../../../lib/test-utils.js';

/** Every distinct letter that appears in the words. */
function lettersOf(words) {
  return new Set(words.join(''));
}

/**
 * Validates `result` for a word list that IS consistent with some alphabet:
 *   • every letter that appears in `words` appears in `result` exactly once,
 *     and nothing else does;
 *   • for every adjacent pair, the first differing letters are in the right
 *     order according to `result` (and, with no difference, the first word
 *     is not longer than the second).
 */
function expectValidOrder(words, result) {
  expect(typeof result, 'should return a string').toBe('string');
  const expectedLetters = [...lettersOf(words)].sort().join('');
  expect([...result].sort().join(''), 'must contain every letter that appears, each exactly once, and nothing else').toBe(
    expectedLetters,
  );
  const rank = new Map([...result].map((ch, i) => [ch, i]));
  for (let w = 0; w + 1 < words.length; w++) {
    const a = words[w];
    const b = words[w + 1];
    const len = Math.min(a.length, b.length);
    let i = 0;
    while (i < len && a[i] === b[i]) i++;
    if (i < len) {
      expect(
        rank.get(a[i]) < rank.get(b[i]),
        `"${a}" before "${b}" requires '${a[i]}' before '${b[i]}', but the result is "${result}"`,
      ).toBe(true);
    } else {
      expect(a.length <= b.length, `test bug: "${a}" before "${b}" is a prefix violation`).toBe(true);
    }
  }
}

/** True when `words` is sorted under the alphabet given by `order`. */
function isSortedUnder(words, order) {
  const rank = new Map([...order].map((ch, i) => [ch, i]));
  for (let w = 0; w + 1 < words.length; w++) {
    const a = words[w];
    const b = words[w + 1];
    const len = Math.min(a.length, b.length);
    let i = 0;
    while (i < len && a[i] === b[i]) i++;
    if (i < len ? rank.get(a[i]) > rank.get(b[i]) : a.length > b.length) return false;
  }
  return true;
}

/** Brute force: does ANY permutation of the letters sort the list? (≤ 6 letters.) */
function someOrderExists(words) {
  const letters = [...lettersOf(words)];
  const permute = (prefix, rest) => {
    if (rest.length === 0) return isSortedUnder(words, prefix.join(''));
    for (let i = 0; i < rest.length; i++) {
      if (permute([...prefix, rest[i]], [...rest.slice(0, i), ...rest.slice(i + 1)])) return true;
    }
    return false;
  };
  return permute([], letters);
}

/** Random words over `alphabet`, sorted by that alphabet's order. Always valid. */
function sortedDictionary(rng, alphabet, count, maxLen) {
  const rank = new Map([...alphabet].map((ch, i) => [ch, i]));
  const words = Array.from({ length: count }, () =>
    Array.from({ length: randomInt(rng, 1, maxLen) }, () => alphabet[randomInt(rng, 0, alphabet.length - 1)]).join(''),
  );
  return words.sort((a, b) => {
    for (let i = 0; i < Math.min(a.length, b.length); i++) {
      if (a[i] !== b[i]) return rank.get(a[i]) - rank.get(b[i]);
    }
    return a.length - b.length;
  });
}

describe('Alien Dictionary', () => {
  describe('examples from the problem', () => {
    it('["wrt","wrf","er","ett","rftt"] → "wertf" (the only consistent order)', () => {
      expect(alienOrder(['wrt', 'wrf', 'er', 'ett', 'rftt'])).toBe('wertf');
    });

    it('["z","x","z"] → "" (z before x and x before z)', () => {
      expect(alienOrder(['z', 'x', 'z'])).toBe('');
    });

    it('["abc","ab"] → "" (a word can never come before its own prefix)', () => {
      expect(alienOrder(['abc', 'ab'])).toBe('');
    });

    it('["ab","adc"] → any order of a, b, c, d with b before d', () => {
      const words = ['ab', 'adc'];
      const result = alienOrder(words);
      expectValidOrder(words, result);
    });
  });

  describe('edge cases', () => {
    it('a single one-letter word → that letter', () => {
      expect(alienOrder(['a'])).toBe('a');
    });

    it('a single word: no rules, but every letter must still appear (["abc"])', () => {
      const result = alienOrder(['abc']);
      expectValidOrder(['abc'], result);
      expect(result).toHaveLength(3);
    });

    it('repeated letters appear once in the answer: ["zzz"] → "z"', () => {
      expect(alienOrder(['zzz'])).toBe('z');
    });

    it('equal adjacent words are fine: ["z","z"] → "z"', () => {
      expect(alienOrder(['z', 'z'])).toBe('z');
    });

    it('identical multi-letter words give no rules: ["abc","abc"]', () => {
      expectValidOrder(['abc', 'abc'], alienOrder(['abc', 'abc']));
    });

    it('a shorter prefix BEFORE the longer word is fine: ["ab","abc"]', () => {
      expectValidOrder(['ab', 'abc'], alienOrder(['ab', 'abc']));
    });
  });

  describe('tricky cases', () => {
    it('only the FIRST difference gives a rule: ["ab","ba"] → "ab" (b-vs-a in position 2 means nothing)', () => {
      expect(alienOrder(['ab', 'ba'])).toBe('ab');
    });

    it('["ba","bc","ac"] → "bac" (a before c, b before a)', () => {
      expect(alienOrder(['ba', 'bc', 'ac'])).toBe('bac');
    });

    it('the same rule derived twice must not be double-counted: ["ab","ac","bb","bc"] → "abc"', () => {
      // b→c comes from both ab/ac and bb/bc. Counting its in-degree twice but
      // removing the edge once leaves c stuck forever.
      expect(alienOrder(['ab', 'ac', 'bb', 'bc'])).toBe('abc');
    });

    it('letters that only appear after the first difference still belong in the answer: ["ac","bd"]', () => {
      const result = alienOrder(['ac', 'bd']);
      expectValidOrder(['ac', 'bd'], result);
      expect(result).toHaveLength(4);
    });

    it('a 3-letter cycle hidden among valid rules → ""', () => {
      // a<b, x<y, b<c, y<z, c<a  →  a < b < c < a.
      expect(alienOrder(['xa', 'xb', 'yb', 'yc', 'zc', 'za'])).toBe('');
    });

    it('a prefix violation in the middle of an otherwise fine list → ""', () => {
      expect(alienOrder(['x', 'abcd', 'abc', 'z'])).toBe('');
    });

    it('a prefix violation is detected even when no letter rules are broken: ["wrtkj","wrt"] → ""', () => {
      expect(alienOrder(['wrtkj', 'wrt'])).toBe('');
    });

    it('rules from different pairs can contradict each other: ["ab","b","a"] → ""', () => {
      // ab/b → a<b, b/a → b<a. Each pair looks fine on its own.
      expect(alienOrder(['ab', 'b', 'a'])).toBe('');
    });

    it('all 26 letters as single-letter words in reverse order → "zyx…a"', () => {
      const reversed = [...'zyxwvutsrqponmlkjihgfedcba'];
      expect(alienOrder(reversed)).toBe(reversed.join(''));
    });

    it('long words that only differ in their last letter', () => {
      const base = 'q'.repeat(99);
      const words = [base + 'm', base + 'k', base + 'p'];
      // m < k < p, and q unconstrained.
      expectValidOrder(words, alienOrder(words));
    });

    it('several independent chains: any interleaving is accepted', () => {
      // a<b<c (from the first letters) and x<y<z (second letters of the "a" words).
      const words = ['ax', 'ay', 'az', 'b', 'c'];
      expectValidOrder(words, alienOrder(words));
    });
  });

  describe('randomized (seeded)', () => {
    it('200 dictionaries sorted by a secret random alphabet: always returns a consistent order', () => {
      const rng = createRng(26);
      for (let t = 0; t < 200; t++) {
        const k = randomInt(rng, 1, 26);
        const alphabet = shuffle(rng, [...'abcdefghijklmnopqrstuvwxyz']).slice(0, k).join('');
        const words = sortedDictionary(rng, alphabet, randomInt(rng, 1, 40), randomInt(rng, 1, 6));
        expectValidOrder(words, alienOrder(words));
      }
    });

    it('400 random (mostly unsorted) small lists: agrees with a brute-force search over all alphabets', () => {
      const rng = createRng(404);
      let invalid = 0;
      for (let t = 0; t < 400; t++) {
        const pool = 'abcde'.slice(0, randomInt(rng, 2, 5));
        const words = Array.from({ length: randomInt(rng, 2, 6) }, () =>
          Array.from({ length: randomInt(rng, 1, 3) }, () => pool[randomInt(rng, 0, pool.length - 1)]).join(''),
        );
        const result = alienOrder(words);
        if (someOrderExists(words)) {
          expectValidOrder(words, result);
        } else {
          invalid++;
          expect(result, `words = ${JSON.stringify(words)} has no consistent order`).toBe('');
        }
      }
      expect(invalid).toBeGreaterThan(100);
      expect(invalid).toBeLessThan(380);
    });

    it('100 words of length 100 sorted by a random 26-letter alphabet (maximum size)', () => {
      const rng = createRng(100);
      const alphabet = shuffle(rng, [...'abcdefghijklmnopqrstuvwxyz']).join('');
      const words = sortedDictionary(rng, alphabet, 100, 100);
      expectValidOrder(words, alienOrder(words));
    });
  });
});
