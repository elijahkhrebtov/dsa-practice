/*
 * Title:      Minimum Window Substring
 * Difficulty: Hard
 * Patterns:   Sliding Window, Frequency Counting
 *
 * Solution — Minimum Window Substring
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * Two facts make a sliding window work here:
 *   1. If s[l..r] contains all of t, then any larger window containing it
 *      does too. Growing never breaks a valid window.
 *   2. If s[l..r] does NOT contain all of t, then no window s[l'..r] with
 *      l' > l does either. Shrinking never fixes an invalid window.
 * So for each right end r, the best left end l only ever moves forward as
 * r moves forward. Both pointers sweep the string once: O(m).
 *
 * To know in O(1) whether the window currently covers t, keep a count of
 * how many characters of t are still MISSING (with multiplicity), and a
 * per-character table `need[c]` = (copies of c in t) − (copies in window).
 *   • need[c] > 0  → the window still lacks that many c's.
 *   • need[c] <= 0 → c is covered (negative = surplus copies).
 * `missing` drops by 1 exactly when adding a character turns a positive
 * need[c] into one less. It rises again when removing a character makes
 * need[c] positive.
 *
 * Approach (expand right, shrink left)
 * ────────────────────────────────────
 *   1. need[c] = count of c in t; missing = t.length.
 *   2. For r = 0..m-1:
 *        a. Add s[r]: if need[s[r]] > 0, missing--. Then need[s[r]]--.
 *        b. While missing === 0 (the window covers t):
 *             – record [l, r] if it's the shortest so far;
 *             – remove s[l]: need[s[l]]++, and if it became > 0, missing++;
 *             – l++.
 *   3. Return the recorded window, or "" if none was found.
 *
 * Walkthrough — s = "ADOBECODEBANC", t = "ABC"
 * ───────────
 *   r=5  'C'  window "ADOBEC"   missing 0 → record (6), drop 'A' → missing 1
 *   r=10 'A'  window "DOBECODEBA" missing 0 → shrink: drop D,O (still
 *             valid), "BECODEBA" (8)… drop B — still one B left, valid;
 *             "ECODEBA", "CODEBA" (6, not shorter) → drop 'C' → missing 1
 *   r=12 'C'  window "ODEBANC"  missing 0 → shrink: "DEBANC", "EBANC" (5,
 *             record), "BANC" (4, record), drop 'B' → missing 1
 *   Answer: "BANC".
 *
 * Complexity
 * ──────────
 *   Time:  O(m + n) — counting t is O(n); each index of s enters the window
 *          once (r) and leaves it at most once (l).
 *   Space: O(1) — a fixed 128-entry table (O(k) for a Map over k distinct
 *          characters).
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Brute force over all (start, end) pairs is O(m²) at best (O(m³) if
 *     you recount each window). Fine for tiny strings, far too slow at 10^5.
 *   • Comparing the whole frequency table on every step (52 letters) is
 *     O(52·m). That's acceptable, but the `missing` counter is cleaner.
 *   • Forgetting multiplicity: tracking only "which distinct letters are
 *     present" accepts "abc" for t = "aab".
 *   • Case sensitivity: don't lowercase anything. Index by charCode (or use
 *     a Map) so 'a' and 'A' stay separate.
 *   • Record the best window as indices and slice once at the end. Slicing
 *     on every improvement is wasteful (though still correct).
 */

/**
 * @param {string} s
 * @param {string} t
 * @returns {string}
 */
export function minWindow(s, t) {
  if (t.length > s.length) return '';

  // need[c] = how many more copies of char code c the window still needs
  // (negative means the window has surplus copies).
  const need = new Int32Array(128);
  for (let i = 0; i < t.length; i++) need[t.charCodeAt(i)]++;
  let missing = t.length; // characters of t (with multiplicity) not yet covered

  let bestStart = 0;
  let bestLen = Infinity;
  let left = 0;

  for (let right = 0; right < s.length; right++) {
    const c = s.charCodeAt(right);
    if (need[c] > 0) missing--; // this copy fills a real gap
    need[c]--;

    // While the window covers t, record it and try to shrink from the left.
    while (missing === 0) {
      const len = right - left + 1;
      if (len < bestLen) {
        bestLen = len;
        bestStart = left;
      }
      const d = s.charCodeAt(left);
      need[d]++;
      if (need[d] > 0) missing++; // we just removed a copy we needed
      left++;
    }
  }

  return bestLen === Infinity ? '' : s.slice(bestStart, bestStart + bestLen);
}
