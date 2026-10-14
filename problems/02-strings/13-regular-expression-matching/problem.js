/*
 * Title:      Regular Expression Matching
 * Difficulty: Hard
 * Patterns:   Dynamic Programming, Memoization
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * Implement a tiny regular-expression matcher. Given a string `s` and a
 * pattern `p`, return `true` if the pattern matches the WHOLE string (not
 * just a part of it), and `false` otherwise.
 *
 * The pattern consists of lowercase letters and two special characters:
 *
 *   • '.'  matches any single character.
 *   • '*'  means "zero or more of the element right before it". The element
 *          is a letter or '.', so "a*" matches "", "a", "aa", … and ".*"
 *          matches any string at all, including "".
 *
 * A letter matches only itself. Don't use JavaScript's built-in RegExp,
 * because writing the matcher is the whole exercise.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  s = "aa", p = "a"
 *     Output: false
 *     Why:    "a" matches only the first character. The whole string must match.
 *
 *   Example 2
 *     Input:  s = "aa", p = "a*"
 *     Output: true
 *     Why:    'a' repeated twice.
 *
 *   Example 3
 *     Input:  s = "ab", p = ".*"
 *     Output: true
 *     Why:    ".*" means "any character, any number of times".
 *
 *   Example 4
 *     Input:  s = "aab", p = "c*a*b"
 *     Output: true
 *     Why:    "c*" matches zero c's, "a*" matches "aa", then "b".
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 0 <= s.length <= 50
 *   • 0 <= p.length <= 50
 *   • `s` contains only lowercase English letters.
 *   • `p` contains only lowercase English letters, '.' and '*'.
 *   • Every '*' directly follows a letter or a '.', so the pattern never
 *     starts with '*' and never contains "**".
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   Straightforward backtracking ("use the star once more, or move past
 *   it") is exponential on inputs like s = "aaaaaaaaaaaaaaaaaaaaaaaaaab"
 *   with p = "a*a*a*a*a*a*a*a*a*c". It tries millions of ways to split the
 *   a's between the stars, and the tests include that case. Aim for
 *   O(m · n) time, where m = s.length and n = p.length.
 */

// ▶ Run tests:   npm run solve regular-expression-matching
// ⟳ Watch mode:  npm run watch regular-expression-matching

/**
 * Decides whether pattern `p` (with '.' and '*') matches the entire string `s`.
 *
 * @param {string} s - The input string (lowercase letters, may be empty).
 * @param {string} p - The pattern: lowercase letters, '.' (any one character) and '*' (zero or more of the previous element).
 * @returns {boolean} `true` if `p` matches all of `s`, otherwise `false`.
 */
export function isMatch(s, p) {
  // Your code here
}
