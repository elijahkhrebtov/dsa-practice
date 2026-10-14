/*
 * Title:      Longest Repeating Character Replacement
 * Difficulty: Medium
 * Patterns:   Sliding Window, Frequency Counting
 *
 * Solution — Longest Repeating Character Replacement
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * For any window, the cheapest way to make it uniform is to keep its most
 * frequent letter and repaint everything else. So:
 *
 *     cost(window) = length - maxCount        valid ⇔ cost <= k
 *
 * Validity is "monotone": if a window is valid, every smaller window inside
 * it is valid too (removing letters can't raise the cost). That's exactly
 * the shape a sliding window handles: grow on the right, shrink on the left
 * when the window becomes invalid.
 *
 * Approach (sliding window that never shrinks)
 * ────────────────────────────────────────────
 *   1. counts = 26 zeros; left = 0; maxCount = 0.
 *   2. For right = 0 .. n-1:
 *        a. counts[s[right]]++ and maxCount = max(maxCount, that count).
 *        b. If (right - left + 1) - maxCount > k:
 *             counts[s[left]]--; left++.        (shrink by exactly one)
 *   3. Return n - left  (the final window size).
 *
 * Why a single `if` and a `maxCount` that never decreases? We only care
 * about finding a LONGER valid window than we've seen. Once the window has
 * reached size W, we never need it smaller: when it's invalid we slide it
 * (add one on the right, drop one on the left) keeping size W. It can only
 * grow when some letter's count beats the old maxCount — and that's exactly
 * the case where a window of size W+1 is truly valid. A stale maxCount
 * therefore never produces a wrong answer; it just stops us from growing
 * until a genuinely better window appears. The window size is
 * non-decreasing, so the final size is the maximum.
 *
 * Walkthrough — s = "AABABBA", k = 1
 * ───────────
 *   r=0 A  counts A1      max=1  size 1, cost 0           window "A"
 *   r=1 A  counts A2      max=2  size 2, cost 0           "AA"
 *   r=2 B  A2 B1          max=2  size 3, cost 1 ≤ 1       "AAB"
 *   r=3 A  A3 B1          max=3  size 4, cost 1           "AABA"
 *   r=4 B  A3 B2          max=3  size 5, cost 2 > 1 → drop s[0]=A, left=1
 *                                                         "ABAB" (size 4)
 *   r=5 B  A2 B3          max=3  size 5, cost 2 > 1 → drop s[1]=A, left=2
 *                                                         "BABB"
 *   r=6 A  A2 B3          max=3  size 5, cost 2 > 1 → drop s[2]=B, left=3
 *                                                         "ABBA"
 *   Answer: n - left = 7 - 3 = 4.
 *
 * Complexity
 * ──────────
 *   Time:  O(n) — each index enters the window once and leaves at most once.
 *   Space: O(1) — 26 counters.
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Brute force: every substring with incremental counts → O(n²) (or
 *     O(26·n²) if you recount). Too slow for n = 10^5.
 *   • "Exact" sliding window: shrink with `while (size - max(counts) > k)`,
 *     recomputing max over the 26 counters each time. O(26·n) and easier to
 *     convince yourself of — totally acceptable.
 *   • Per-letter windows: for each of the 26 letters, find the longest
 *     window with at most k non-matching letters. Also O(26·n).
 *   • Bug: returning maxCount + k — it can exceed the string length
 *     (e.g. "AAAA", k = 2 → must be 4, not 6).
 *   • Bug: forgetting k can be 0 or as large as the whole string.
 */

/**
 * @param {string} s
 * @param {number} k
 * @returns {number}
 */
export function characterReplacement(s, k) {
  const counts = new Int32Array(26);
  let left = 0;
  let maxCount = 0; // highest single-letter count seen in any window so far

  for (let right = 0; right < s.length; right++) {
    const c = s.charCodeAt(right) - 65; // 'A' → 0
    counts[c]++;
    if (counts[c] > maxCount) maxCount = counts[c];

    // Too many letters to repaint: slide the window instead of growing it.
    if (right - left + 1 - maxCount > k) {
      counts[s.charCodeAt(left) - 65]--;
      left++;
    }
  }

  return s.length - left; // the window only ever grows or slides, so its final size is the best
}
