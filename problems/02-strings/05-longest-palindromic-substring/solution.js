/*
 * Title:      Longest Palindromic Substring
 * Difficulty: Medium
 * Patterns:   Expand Around Center, Dynamic Programming
 *
 * Solution — Longest Palindromic Substring
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * Every palindrome has a center, and it is built by wrapping matching
 * characters around that center: if s[l..r] is a palindrome, s[l-1..r+1] is
 * one iff s[l-1] === s[r+1]. So rather than testing O(n²) substrings one by
 * one (O(n) each → O(n³)), we grow palindromes outward from each possible
 * center. A failed comparison ends that center immediately — no larger
 * palindrome around it can exist.
 *
 * Centers come in two kinds:
 *   • on a character  → odd length,  e.g. "aba" around 'b'
 *   • between two     → even length, e.g. "abba" around the gap "b|b"
 * That's n + (n - 1) = 2n - 1 centers.
 *
 * Approach (expand around center)
 * ───────────────────────────────
 *   1. bestStart = 0, bestLen = 0.
 *   2. For each i in 0..n-1:
 *        a. len1 = expand(i, i)       (odd)
 *        b. len2 = expand(i, i + 1)   (even)
 *        c. If max(len1, len2) > bestLen, record it. A palindrome of length
 *           L centered at i (odd) or at the gap after i (even) starts at
 *           i - floor((L - 1) / 2).
 *   3. Return s.slice(bestStart, bestStart + bestLen).
 *
 *   expand(l, r): while l >= 0, r < n and s[l] === s[r]: l--, r++.
 *                 Return r - l - 1 (the loop overshoots one step each side).
 *
 * Walkthrough — s = "cbbd"
 * ───────────
 *   i=0  odd "c" → 1        even c|b ✗ → 0        best "c"  (len 1)
 *   i=1  odd "b" → 1        even b|b ✓ → expand: c vs d ✗ → "bb" (len 2)
 *                                                  best "bb" start 1
 *   i=2  odd "b" → 1        even b|d ✗ → 0
 *   i=3  odd "d" → 1
 *   Answer: "bb".
 *
 * Complexity
 * ──────────
 *   Time:  O(n²) — 2n - 1 centers, each expansion up to O(n). The worst
 *          case is a string of one repeated letter; on typical text the
 *          expansions stop almost immediately.
 *   Space: O(1) besides the returned string — we store indices only.
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Brute force: every (i, j), check palindrome → O(n³). With n = 3,000
 *     and one repeated letter, that's ~4.5·10^9 character comparisons.
 *   • DP: isPal[i][j] = s[i] === s[j] && (j - i < 2 || isPal[i+1][j-1]),
 *     filled by increasing length (or i from n-1 down to 0). O(n²) time but
 *     O(n²) memory — 9 million cells for n = 3,000. Use a flat Uint8Array
 *     rather than nested JS arrays if you go this way.
 *   • Manacher's algorithm: O(n) time by reusing mirror information inside
 *     the rightmost palindrome found so far. Elegant but rarely expected.
 *   • Bug: forgetting even-length centers ("cbbd" → "b" instead of "bb").
 *   • Bug: calling s.slice / building strings inside the loop for every
 *     candidate — that adds an O(n) copy per center.
 *   • "Reverse the string and find the longest common substring" is a trap:
 *     "abacdfgdcaba" gives "aba"… and also "abacd", which isn't a palindrome.
 */

/**
 * @param {string} s
 * @returns {string}
 */
export function longestPalindrome(s) {
  const n = s.length;
  let bestStart = 0;
  let bestLen = 0;

  /** Grows a palindrome around [l, r] as far as possible; returns its length. */
  const expand = (l, r) => {
    while (l >= 0 && r < n && s.charCodeAt(l) === s.charCodeAt(r)) {
      l--;
      r++;
    }
    return r - l - 1; // the palindrome is s[l+1 .. r-1]
  };

  for (let i = 0; i < n; i++) {
    const odd = expand(i, i); // centered on s[i]
    const even = expand(i, i + 1); // centered between s[i] and s[i+1]
    const len = odd > even ? odd : even;
    if (len > bestLen) {
      bestLen = len;
      bestStart = i - Math.floor((len - 1) / 2);
    }
  }

  return s.slice(bestStart, bestStart + bestLen);
}
