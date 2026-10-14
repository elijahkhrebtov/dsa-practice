import { describe, it, expect } from 'vitest';
import { characterReplacement } from './problem.js';
import { createRng, randomInt, measure } from '../../../lib/test-utils.js';

/**
 * Brute-force oracle: from every start, extend while the window can still be
 * made uniform (length - most frequent count <= k).
 */
function oracle(s, k) {
  let best = 0;
  for (let i = 0; i < s.length; i++) {
    const counts = new Array(26).fill(0);
    let max = 0;
    for (let j = i; j < s.length; j++) {
      const c = s.charCodeAt(j) - 65;
      max = Math.max(max, ++counts[c]);
      if (j - i + 1 - max > k) break;
      best = Math.max(best, j - i + 1);
    }
  }
  return best;
}

function randomString(rng, n, alphabet) {
  let s = '';
  for (let i = 0; i < n; i++) s += alphabet[randomInt(rng, 0, alphabet.length - 1)];
  return s;
}

describe('Longest Repeating Character Replacement', () => {
  describe('examples from the problem', () => {
    it('"ABAB", k = 2 → 4 (repaint both A\'s or both B\'s)', () => {
      expect(characterReplacement('ABAB', 2)).toBe(4);
    });

    it('"AABABBA", k = 1 → 4', () => {
      expect(characterReplacement('AABABBA', 1)).toBe(4);
    });

    it('"ABCDE", k = 0 → 1 (no changes allowed: any single letter)', () => {
      expect(characterReplacement('ABCDE', 0)).toBe(1);
    });
  });

  describe('edge cases', () => {
    it('"" with k = 0 → 0 (empty string)', () => {
      expect(characterReplacement('', 0)).toBe(0);
    });

    it('a single letter → 1, whatever k is', () => {
      expect(characterReplacement('Q', 0)).toBe(1);
      expect(characterReplacement('Q', 1)).toBe(1);
    });

    it('already uniform: "AAAA", k = 0 → 4', () => {
      expect(characterReplacement('AAAA', 0)).toBe(4);
    });

    it('the answer never exceeds the string length: "AAAA", k = 2 → 4 (not maxCount + k = 6)', () => {
      expect(characterReplacement('AAAA', 2)).toBe(4);
    });

    it('k = s.length → the whole string: "ABCDEFG", k = 7 → 7', () => {
      expect(characterReplacement('ABCDEFG', 7)).toBe(7);
    });

    it('k = s.length - 1 is already enough for everything: "ABCDEFG", k = 6 → 7', () => {
      expect(characterReplacement('ABCDEFG', 6)).toBe(7);
    });

    it('k = 0 means "longest run of equal letters": "ABBBCCDDDDE" → 4', () => {
      expect(characterReplacement('ABBBCCDDDDE', 0)).toBe(4);
    });
  });

  describe('tricky cases', () => {
    it('fill a single gap: "AAAABAAA", k = 1 → 8', () => {
      expect(characterReplacement('AAAABAAA', 1)).toBe(8);
    });

    it('spending changes on the minority letter at the edge: "BAAAB", k = 2 → 5', () => {
      expect(characterReplacement('BAAAB', 2)).toBe(5);
    });

    it('the best window keeps a letter that is NOT the globally most frequent one: "AABBBBCAAA", k = 1 → 5', () => {
      // A appears 5 times overall, but the best window is "BBBBC" → "BBBBB".
      // (Making A's contiguous would need far more than 1 change.)
      expect(characterReplacement('AABBBBCAAA', 1)).toBe(5);
    });

    it('the best window is at the very end: "ABCDEFGHHHHH", k = 1 → 6', () => {
      expect(characterReplacement('ABCDEFGHHHHH', 1)).toBe(6);
    });

    it('many distinct letters, small k: "ABCABCABC", k = 2 → 4 (e.g. "ABCA" → "AAAA")', () => {
      expect(characterReplacement('ABCABCABC', 2)).toBe(4);
    });

    it('alternating letters: "ABABABAB", k = 3 → 7', () => {
      expect(characterReplacement('ABABABAB', 3)).toBe(7);
    });

    it('uses letters across the alphabet, including "Z": "ZZAZZBZZ", k = 2 → 8', () => {
      expect(characterReplacement('ZZAZZBZZ', 2)).toBe(8);
    });

    it('when the window slides, its letter counts must stay consistent: "AAABBBBBAAAAAA", k = 2 → 8', () => {
      // Best: "BBAAAAAA" — repaint the last two B's next to the final block of six A's.
      expect(characterReplacement('AAABBBBBAAAAAA', 2)).toBe(8);
    });
  });

  describe('randomized (seeded, reproducible)', () => {
    it('matches a brute-force oracle on 400 short strings over "AB" and "ABC"', () => {
      const rng = createRng(31);
      for (let t = 0; t < 400; t++) {
        const s = randomString(rng, randomInt(rng, 0, 25), t % 2 ? 'AB' : 'ABC');
        const k = randomInt(rng, 0, s.length);
        expect(characterReplacement(s, k), `s = "${s}", k = ${k}`).toBe(oracle(s, k));
      }
    });

    it('matches a brute-force oracle on 200 longer strings over all 26 letters', () => {
      const rng = createRng(32);
      const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      for (let t = 0; t < 200; t++) {
        const s = randomString(rng, randomInt(rng, 1, 200), letters.slice(0, randomInt(rng, 1, 26)));
        const k = randomInt(rng, 0, Math.min(s.length, 15));
        expect(characterReplacement(s, k), `s = "${s}", k = ${k}`).toBe(oracle(s, k));
      }
    });
  });

  describe('performance', () => {
    it('60,000 letters with long valid windows stay fast (an O(n²) scan from every start is far too slow)', () => {
      // Random A/B with a generous k: valid windows are tens of thousands long,
      // so restarting from every index re-scans huge windows.
      const rng = createRng(33);
      const s = randomString(rng, 60_000, 'AB');
      const k = 12_000;
      const { result, ms } = measure(() => characterReplacement(s, k));
      expect(result).toBe(24_256);
      expect(ms, `took ${ms.toFixed(0)}ms — think sliding window, O(n)`).toBeLessThan(500);
    });

    it('100,000 letters: a uniform block in the middle is found exactly', () => {
      const n = 100_000;
      const left = randomString(createRng(34), 40_000, 'ABCDEFGHIJKLMNOPQRSTUVWXY'); // no Z
      const right = randomString(createRng(35), 40_000, 'ABCDEFGHIJKLMNOPQRSTUVWXY');
      const s = left + 'Z'.repeat(n - 80_000) + right;
      const { result, ms } = measure(() => characterReplacement(s, 0));
      expect(result).toBe(20_000);
      expect(ms, `took ${ms.toFixed(0)}ms`).toBeLessThan(500);
    });
  });
});
