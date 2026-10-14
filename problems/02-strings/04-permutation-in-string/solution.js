/*
 * Title:      Permutation in String
 * Difficulty: Medium
 * Patterns:   Sliding Window, Frequency Counting
 *
 * Solution — Permutation in String
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * "Some permutation of s1 is a substring of s2" means "some window of s2 of
 * length m = s1.length has the same letter counts as s1". All windows have
 * the same length, so we can slide one fixed-size window across s2 and
 * update its counts in O(1) per step (one letter enters, one leaves)
 * instead of recounting m letters for each window.
 *
 * To avoid comparing all 26 counts on every step we track `matches`: the
 * number of letters whose count in the window equals their count in s1.
 * Each step touches only two letters, so `matches` changes by at most 2.
 *
 * Approach
 * ────────
 *   1. If m > n, return false.
 *   2. need[c] = count of c in s1; have[c] = count of c in s2[0..m-1].
 *   3. matches = number of c in 0..25 with need[c] === have[c].
 *   4. For i = m .. n (i is the index entering the window):
 *        a. If matches === 26 → return true.
 *        b. If i === n → stop.
 *        c. Add s2[i]:   before the change, if have === need, matches--;
 *                        have++; if now have === need, matches++.
 *        d. Remove s2[i - m] the same way (with have--).
 *   5. Return false.
 *
 * Walkthrough — s1 = "ab", s2 = "eidbaooo"
 * ───────────
 *   need: a1 b1. First window "ei": e1 i1. Letters a, b, e, i differ;
 *   the other 22 match → matches = 22.
 *   i=2 add 'd' (d: 0≠1 now, matches 21), drop 'e' (e: 1→0 equal, 22)  "id"
 *   i=3 add 'b' (b: 1=1, 23),             drop 'i' (i → 0 equal, 24)  "db"
 *   i=4 add 'a' (a: 1=1, 25),             drop 'd' (d → 0 equal, 26)  "ba"
 *   i=5 check: matches === 26 → true.
 *
 * Complexity
 * ──────────
 *   Time:  O(n + m) — O(m) to build counts, O(1) per slide, O(26) once.
 *   Space: O(1) — two arrays of 26 counters.
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Sort s1, then sort every window of s2 and compare: O(n · m log m).
 *   • Recount every window from scratch: O(n · m). With m = 10,000 and
 *     n = 110,000 that's ~10^9 operations.
 *   • Sliding window comparing all 26 counts each step: O(26·n) — simple
 *     and perfectly fine. The `matches` counter just removes the 26.
 *   • Generating all permutations of s1 is O(m!) — hopeless beyond m ≈ 10.
 *   • Bug: forgetting the m > n case, or checking the last window only
 *     after the loop (off-by-one: the final window must be tested too).
 *   • Bug: using `Map` deletes/increments inconsistently so a count of 0
 *     is treated differently from a missing key.
 */

/**
 * @param {string} s1
 * @param {string} s2
 * @returns {boolean}
 */
export function checkInclusion(s1, s2) {
  const m = s1.length;
  const n = s2.length;
  if (m > n) return false;

  const need = new Int32Array(26);
  const have = new Int32Array(26);
  for (let i = 0; i < m; i++) {
    need[s1.charCodeAt(i) - 97]++;
    have[s2.charCodeAt(i) - 97]++;
  }

  let matches = 0;
  for (let c = 0; c < 26; c++) if (need[c] === have[c]) matches++;

  for (let i = m; ; i++) {
    if (matches === 26) return true; // the window s2[i-m .. i-1] is a permutation of s1
    if (i === n) return false;

    // Letter entering on the right.
    const add = s2.charCodeAt(i) - 97;
    if (have[add] === need[add]) matches--;
    have[add]++;
    if (have[add] === need[add]) matches++;

    // Letter leaving on the left.
    const drop = s2.charCodeAt(i - m) - 97;
    if (have[drop] === need[drop]) matches--;
    have[drop]--;
    if (have[drop] === need[drop]) matches++;
  }
}
