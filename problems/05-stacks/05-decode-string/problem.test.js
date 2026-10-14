import { describe, it, expect } from 'vitest';
import { decodeString } from './problem.js';
import { createRng, randomInt, measure } from '../../../lib/test-utils.js';

const LETTERS = 'abcdefghijklmnopqrstuvwxyz';

/**
 * Builds a random encoding as a TREE and returns both the encoded string and
 * the decoded string, computed from the tree structure (no parsing involved).
 * A sequence is a list of parts; a part is either plain letters or a
 * repetition { k, body }.
 */
function randomSequence(rng, depth) {
  const parts = randomInt(rng, 1, 3);
  let encoded = '';
  let decoded = '';
  for (let p = 0; p < parts; p++) {
    if (depth > 0 && rng() < 0.55) {
      const k = rng() < 0.2 ? randomInt(rng, 10, 30) : randomInt(rng, 1, 9);
      const inner = randomSequence(rng, depth - 1);
      encoded += `${k}[${inner.encoded}]`;
      decoded += inner.decoded.repeat(k);
    } else {
      const len = randomInt(rng, 1, 3);
      const letters = Array.from({ length: len }, () => LETTERS[randomInt(rng, 0, 25)]).join('');
      encoded += letters;
      decoded += letters;
    }
  }
  return { encoded, decoded };
}

describe('Decode String', () => {
  describe('examples from the problem', () => {
    it('"3[a]2[bc]" → "aaabcbc"', () => {
      expect(decodeString('3[a]2[bc]')).toBe('aaabcbc');
    });

    it('"3[a2[c]]" → "accaccacc" (decode the inner group first)', () => {
      expect(decodeString('3[a2[c]]')).toBe('accaccacc');
    });

    it('"2[abc]3[cd]ef" → "abcabccdcdcdef" (trailing plain letters are kept)', () => {
      expect(decodeString('2[abc]3[cd]ef')).toBe('abcabccdcdcdef');
    });

    it('"10[x]y" → ten x\'s then y (multi-digit count)', () => {
      expect(decodeString('10[x]y')).toBe('xxxxxxxxxxy');
    });
  });

  describe('edge cases', () => {
    it('no brackets at all: "leetcode" → "leetcode"', () => {
      expect(decodeString('leetcode')).toBe('leetcode');
    });

    it('a single letter: "a" → "a"', () => {
      expect(decodeString('a')).toBe('a');
    });

    it('a count of 1 is just the body: "1[abc]" → "abc"', () => {
      expect(decodeString('1[abc]')).toBe('abc');
    });

    it('the maximum count: "300[z]" → 300 z\'s', () => {
      expect(decodeString('300[z]')).toBe('z'.repeat(300));
    });

    it('a count containing a zero digit: "101[ab]" → "ab" × 101 (not 1, 0, 1)', () => {
      expect(decodeString('101[ab]')).toBe('ab'.repeat(101));
    });

    it('letters before a group: "abc3[cd]" → "abccdcdcd"', () => {
      expect(decodeString('abc3[cd]')).toBe('abccdcdcd');
    });
  });

  describe('tricky cases', () => {
    it('letters on both sides of a nested group: "2[a3[b]c]" → "abbbcabbbc"', () => {
      expect(decodeString('2[a3[b]c]')).toBe('abbbcabbbc');
    });

    it('two sibling groups inside a group: "2[2[a]2[b]]" → "aabbaabb"', () => {
      expect(decodeString('2[2[a]2[b]]')).toBe('aabbaabb');
    });

    it('deep nesting multiplies: "2[2[2[2[a]]]]" → 16 a\'s', () => {
      expect(decodeString('2[2[2[2[a]]]]')).toBe('a'.repeat(16));
    });

    it('a multi-digit count inside a nested group: "2[12[a]b]" → ("a" × 12 + "b") × 2', () => {
      expect(decodeString('2[12[a]b]')).toBe(('a'.repeat(12) + 'b').repeat(2));
    });

    it('plain text, then a group, then text: "abc3[cd]xyz" → "abccdcdcdxyz"', () => {
      expect(decodeString('abc3[cd]xyz')).toBe('abccdcdcdxyz');
    });

    it('text after the closing bracket of a nested group belongs to the outer level: "3[a2[b]]c" → "abbabbabbc"', () => {
      expect(decodeString('3[a2[b]]c')).toBe('abbabbabbc');
    });

    it('a mix of everything: "3[z]2[2[y]pq4[2[jk]e1[f]]]ef"', () => {
      const inner = 'yy' + 'pq' + ('jkjk' + 'e' + 'f').repeat(4);
      expect(decodeString('3[z]2[2[y]pq4[2[jk]e1[f]]]ef')).toBe('zzz' + inner + inner + 'ef');
    });

    it('consecutive groups of different counts: "1[a]2[b]3[c]" → "abbccc"', () => {
      expect(decodeString('1[a]2[b]3[c]')).toBe('abbccc');
    });
  });

  describe('randomized (seeded, reproducible)', () => {
    it('decodes 500 random nested encodings built from a tree', () => {
      const rng = createRng(4242);
      let checked = 0;
      while (checked < 500) {
        const { encoded, decoded } = randomSequence(rng, randomInt(rng, 1, 4));
        if (decoded.length > 5000) continue; // keep each case small and fast
        expect(decodeString(encoded), encoded).toBe(decoded);
        checked++;
      }
    });
  });

  describe('large inputs', () => {
    it('five levels of 10× nesting produce 100,000 characters quickly', () => {
      const s = '10[10[10[10[10[a]]]]]';
      const { result, ms } = measure(() => decodeString(s));
      expect(result.length).toBe(100_000);
      expect(result).toBe('a'.repeat(100_000));
      expect(ms, `took ${ms.toFixed(0)}ms — build strings with repeat/join, not char by char in nested loops`).toBeLessThan(1000);
    });

    it('a long flat input of 2,000 groups "2[ab]2[ab]…" (input length 10,000)', () => {
      const s = '2[ab]'.repeat(2_000);
      const { result, ms } = measure(() => decodeString(s));
      expect(result).toBe('abab'.repeat(2_000));
      expect(ms, `took ${ms.toFixed(0)}ms — one pass over the input is enough`).toBeLessThan(1000);
    });
  });
});
