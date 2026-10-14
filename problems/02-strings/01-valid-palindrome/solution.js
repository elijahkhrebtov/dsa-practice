/*
 * Title:      Valid Palindrome
 * Difficulty: Easy
 * Patterns:   Two Pointers
 *
 * Solution — Valid Palindrome
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * A palindrome is defined by pairs: the 1st character must equal the last,
 * the 2nd must equal the second-to-last, and so on. So we never need the
 * cleaned-up string as a whole — we only need to walk inwards from both
 * ends, skipping the characters that "don't count", and compare each pair.
 *
 * Approach (two pointers, O(1) extra space)
 * ────────────────────────────────────────
 *   1. left = 0, right = s.length - 1.
 *   2. While left < right:
 *        a. Advance `left` while it points at a non-alphanumeric char
 *           (and left < right).
 *        b. Retreat `right` the same way.
 *        c. Compare s[left] and s[right] case-insensitively.
 *           Different → return false.
 *        d. left++, right--.
 *   3. Return true (all pairs matched; an empty/all-symbol string never
 *      enters a comparison, so it's correctly `true`).
 *
 * Case folding without allocating: for ASCII, an uppercase letter's code is
 * exactly 32 less than its lowercase partner ('A' = 65, 'a' = 97), so
 * `code | 32` maps 'A'..'Z' onto 'a'..'z' and leaves lowercase letters and
 * digits ('0'..'9' = 48..57 already have bit 5 set) unchanged.
 *
 * Walkthrough — s = "a,b.:B/A"
 * ───────────
 *   left=0 'a'  right=7 'A'   → 'a' == 'a'          ✓  move in
 *   left=1 ','  skip → left=2 'b'
 *   right=6 '/' skip → right=5 'B'
 *              compare 'b' == 'b'                   ✓  move in
 *   left=3 '.'  skip → left=4, which now equals right → stop skipping
 *              compare s[4] with itself (trivially equal), move in
 *   left=5 > right=3 → loop ends → true
 *
 * Complexity
 * ──────────
 *   Time:  O(n) — each index is visited by at most one pointer.
 *   Space: O(1) — only two indices; no copies of the string.
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Filter + reverse: `clean = s.replace(/[^a-z0-9]/gi, '').toLowerCase()`
 *     then compare with its reverse. Also O(n) time and perfectly readable,
 *     but O(n) extra space.
 *   • Recursion with `s.slice(1, -1)` copies the string at every step:
 *     O(n²) time and a deep call stack.
 *   • Bug: forgetting the `left < right` guard inside the skip loops, which
 *     lets a pointer run off the end of an all-symbol string.
 *   • Bug: treating digits like letters when case folding, or using a
 *     "letters only" check that ignores digits ("0P" must be false).
 *   • `\w` in a regex also matches '_' — it's not the same as alphanumeric.
 */

/** @param {number} c - a char code @returns {boolean} */
function isAlnum(c) {
  return (c >= 48 && c <= 57) || (c >= 65 && c <= 90) || (c >= 97 && c <= 122);
}

/**
 * @param {string} s
 * @returns {boolean}
 */
export function isPalindrome(s) {
  let left = 0;
  let right = s.length - 1;

  while (left < right) {
    // Skip anything that doesn't count, without letting the pointers cross.
    while (left < right && !isAlnum(s.charCodeAt(left))) left++;
    while (left < right && !isAlnum(s.charCodeAt(right))) right--;

    // `| 32` lowercases ASCII letters and leaves digits untouched.
    if ((s.charCodeAt(left) | 32) !== (s.charCodeAt(right) | 32)) return false;

    left++;
    right--;
  }

  return true;
}
