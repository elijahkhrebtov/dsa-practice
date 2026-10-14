import { describe, it, expect } from 'vitest';
import { groupAnagrams } from './problem.js';
import { createRng, randomInt, shuffle, measure, canonical } from '../../../lib/test-utils.js';

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';

/** Canonical form: groups and the strings inside them sorted, so any valid order compares equal. */
const norm = (groups) => canonical(groups, { sortInner: true });

/** Brute-force anagram check by comparing 26 letter counts. */
function sameLetters(a, b) {
  if (a.length !== b.length) return false;
  const counts = new Array(26).fill(0);
  for (let i = 0; i < a.length; i++) {
    counts[a.charCodeAt(i) - 97]++;
    counts[b.charCodeAt(i) - 97]--;
  }
  return counts.every((c) => c === 0);
}

/** Brute-force oracle: compare each string with the first member of every group so far. */
function oracle(strs) {
  const groups = [];
  for (const s of strs) {
    const group = groups.find((g) => sameLetters(g[0], s));
    if (group) group.push(s);
    else groups.push([s]);
  }
  return groups;
}

function randomWord(rng, length, letters) {
  let out = '';
  for (let i = 0; i < length; i++) out += ALPHABET[randomInt(rng, 0, letters - 1)];
  return out;
}

describe('Group Anagrams', () => {
  describe('examples from the problem', () => {
    it('["eat","tea","tan","ate","nat","bat"] → [["bat"], ["nat","tan"], ["ate","eat","tea"]]', () => {
      expect(norm(groupAnagrams(['eat', 'tea', 'tan', 'ate', 'nat', 'bat']))).toEqual(
        norm([['bat'], ['nat', 'tan'], ['ate', 'eat', 'tea']]),
      );
    });

    it('[""] → [[""]] (the empty string is a group of its own)', () => {
      expect(groupAnagrams([''])).toEqual([['']]);
    });

    it('["a"] → [["a"]]', () => {
      expect(groupAnagrams(['a'])).toEqual([['a']]);
    });
  });

  describe('edge cases', () => {
    it('empty input [] → []', () => {
      expect(groupAnagrams([])).toEqual([]);
    });

    it('two empty strings are anagrams of each other: ["", ""] → [["", ""]]', () => {
      expect(groupAnagrams(['', ''])).toEqual([['', '']]);
    });

    it('duplicates are kept: ["abc", "abc", "bca"] → [["abc", "abc", "bca"]]', () => {
      expect(norm(groupAnagrams(['abc', 'abc', 'bca']))).toEqual(norm([['abc', 'abc', 'bca']]));
    });

    it('all strings in one group: ["abc","bca","cab","acb","bac","cba"]', () => {
      const all = ['abc', 'bca', 'cab', 'acb', 'bac', 'cba'];
      expect(norm(groupAnagrams(all))).toEqual(norm([all]));
    });

    it('no two strings are anagrams: every string is a singleton group', () => {
      const strs = ['abc', 'abd', 'xyz', 'q', ''];
      expect(norm(groupAnagrams(strs))).toEqual(norm(strs.map((s) => [s])));
    });

    it('does not modify the input array or its order', () => {
      const strs = ['eat', 'tea', 'tan'];
      groupAnagrams(strs);
      expect(strs).toEqual(['eat', 'tea', 'tan']);
    });

    it('returns the original strings, not their sorted keys', () => {
      const flat = groupAnagrams(['tea', 'eat']).flat();
      expect(flat.sort()).toEqual(['eat', 'tea']);
    });
  });

  describe('tricky cases', () => {
    it('same letters but different counts are different groups: "aab" vs "abb"', () => {
      expect(norm(groupAnagrams(['aab', 'abb', 'bab', 'aba']))).toEqual(norm([['aab', 'aba'], ['abb', 'bab']]));
    });

    it('different lengths never group together: ["a", "aa", "aaa"]', () => {
      expect(norm(groupAnagrams(['a', 'aa', 'aaa']))).toEqual(norm([['a'], ['aa'], ['aaa']]));
    });

    it('count-based keys need a separator: 1×a + 11×b must not collide with 11×a + 1×b', () => {
      // Counts joined without a separator give "111000…" for BOTH strings.
      const s1 = 'a' + 'b'.repeat(11);
      const s2 = 'a'.repeat(11) + 'b';
      expect(norm(groupAnagrams([s1, s2]))).toEqual(norm([[s1], [s2]]));
    });

    it('a sum-of-char-codes key is not enough: "ad" and "bc" are not anagrams', () => {
      expect(norm(groupAnagrams(['ad', 'bc', 'da']))).toEqual(norm([['ad', 'da'], ['bc']]));
    });

    it('one extra letter makes a different group: "listen"/"silent"/"enlist"/"tinsel" vs "listens"', () => {
      const strs = ['listen', 'silent', 'enlist', 'listens', 'tinsel', 'enlists'];
      expect(norm(groupAnagrams(strs))).toEqual(
        norm([
          ['listen', 'silent', 'enlist', 'tinsel'],
          ['listens', 'enlists'],
        ]),
      );
    });

    it('strings of the maximum length 100 are grouped correctly', () => {
      const rng = createRng(4);
      const base = randomWord(rng, 100, 26);
      const other = randomWord(rng, 100, 26);
      const a = shuffle(rng, [...base]).join('');
      const b = shuffle(rng, [...base]).join('');
      expect(norm(groupAnagrams([base, other, a, b]))).toEqual(norm(oracle([base, other, a, b])));
    });
  });

  describe('randomized (seeded, reproducible)', () => {
    it('matches a brute-force grouping on 200 random lists (small alphabets make many anagrams)', () => {
      const rng = createRng(31);
      for (let t = 0; t < 200; t++) {
        const n = randomInt(rng, 0, 40);
        const letters = randomInt(rng, 1, 4);
        const strs = Array.from({ length: n }, () => randomWord(rng, randomInt(rng, 0, 4), letters));
        expect(norm(groupAnagrams(strs)), JSON.stringify(strs)).toEqual(norm(oracle(strs)));
      }
    });

    it('matches a brute-force grouping on 50 lists built from shuffled copies of a few base words', () => {
      const rng = createRng(32);
      for (let t = 0; t < 50; t++) {
        const bases = Array.from({ length: randomInt(rng, 1, 8) }, () => randomWord(rng, randomInt(rng, 1, 12), 26));
        const strs = Array.from({ length: randomInt(rng, 1, 60) }, () =>
          shuffle(rng, [...bases[randomInt(rng, 0, bases.length - 1)]]).join(''),
        );
        expect(norm(groupAnagrams(strs))).toEqual(norm(oracle(strs)));
      }
    });
  });

  describe('performance', () => {
    it('50,000 strings in 25,000 groups (comparing each string against every group is O(n²), too slow)', () => {
      const rng = createRng(2026);
      const groups = 25_000;
      const bases = [];
      const seen = new Set();
      while (bases.length < groups) {
        const w = randomWord(rng, randomInt(rng, 6, 10), 26);
        const key = [...w].sort().join('');
        if (!seen.has(key)) {
          seen.add(key);
          bases.push(w);
        }
      }
      const strs = Array.from({ length: 2 * groups }, (_, i) => shuffle(rng, [...bases[i % groups]]).join(''));

      const { result, ms } = measure(() => groupAnagrams(strs));
      expect(result).toHaveLength(groups);
      expect(result.every((g) => g.length === 2 && sameLetters(g[0], g[1]))).toBe(true);
      expect(ms, `took ${ms.toFixed(0)}ms. Map each string to a key in O(k)/O(k log k) and use a hash map`).toBeLessThan(400);
    });
  });
});
