/*
 * Title:      Valid Anagram
 * Difficulty: Easy
 * Patterns:   Frequency Counting, Hash Map
 *
 * Solution — Valid Anagram
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * Order doesn't matter for an anagram, only "how many of each letter". So
 * throw the order away and compare letter counts. With an alphabet of just
 * 26 letters, the counts fit in a fixed array of 26 integers: a hash table
 * whose hash function is `charCode - 97`, with no collisions at all.
 *
 * Instead of building two count arrays and comparing them, use ONE array:
 * +1 for each letter of `s`, −1 for each letter of `t`. The strings are
 * anagrams exactly when every counter ends at 0.
 *
 * Approach
 * ────────
 *   1. If the lengths differ, return false right away.
 *   2. counts = array of 26 zeros.
 *   3. For each index i: counts[s[i]]++ and counts[t[i]]--.
 *   4. Return true iff every counter is 0.
 *
 * Because the lengths are equal, a counter that went positive somewhere
 * forces another one negative, so checking "all zero" catches every
 * mismatch.
 *
 * Walkthrough — s = "aab", t = "abb"
 * ───────────
 *   i=0  +a −a   → a:0 b:0
 *   i=1  +a −b   → a:1 b:−1
 *   i=2  +b −b   → a:1 b:−1
 *   counts not all zero → false
 *
 * Complexity
 * ──────────
 *   Time:  O(n): one pass over the strings plus a 26-step check.
 *   Space: O(1): 26 counters, independent of n.
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Sort both strings and compare: O(n log n) time, O(n) space for the
 *     split arrays. Short and correct, just not optimal.
 *   • For each letter of s, find and delete it from t (indexOf + splice or
 *     replace): O(n²), because each deletion copies the rest of the string.
 *   • Checking only that the same SET of letters appears ("aab" vs "abb"),
 *     or only one direction ("is every char of t in s?"), is wrong. Counts
 *     matter.
 *   • Sum or XOR of the character codes is not a valid fingerprint:
 *     "ad" and "bc" have the same sum, "aabb" and "ccdd" both XOR to 0.
 *   • Unicode follow-up: use a Map<char, count> instead of a 26-array and
 *     iterate with `for (const ch of s)`, so surrogate pairs (emoji) stay
 *     together. You may also need `s.normalize()`, since "é" can be stored
 *     as one code point or as "e" + a combining accent.
 */

/**
 * @param {string} s
 * @param {string} t
 * @returns {boolean}
 */
export function isAnagram(s, t) {
  if (s.length !== t.length) return false;

  const counts = new Array(26).fill(0); // counts[c] = (# in s) − (# in t) for letter c
  const A = 97; // 'a'.charCodeAt(0)

  for (let i = 0; i < s.length; i++) {
    counts[s.charCodeAt(i) - A]++;
    counts[t.charCodeAt(i) - A]--;
  }

  // Every letter must balance out exactly.
  return counts.every((c) => c === 0);
}
