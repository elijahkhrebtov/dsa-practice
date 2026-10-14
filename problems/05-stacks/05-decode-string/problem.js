/*
 * Title:      Decode String
 * Difficulty: Medium
 * Patterns:   Stack, String Parsing
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * You are given an encoded string `s`. Return its decoded form.
 *
 * The encoding rule is   k[encoded]   which means: the part inside the
 * square brackets is repeated exactly `k` times. `k` is a positive integer
 * and may have several digits ("12[ab]"). Encodings can be nested
 * ("2[a3[b]]") and can sit next to plain letters ("x2[y]z").
 *
 * You may assume the input is always well-formed:
 *
 *   • brackets are balanced and every '[' is immediately preceded by its
 *     repeat count;
 *   • digits appear ONLY as repeat counts — the original text never
 *     contains digits, so "3a" or "2[4]" will not appear;
 *   • the original text contains only lowercase English letters.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  s = "3[a]2[bc]"
 *     Output: "aaabcbc"
 *
 *   Example 2
 *     Input:  s = "3[a2[c]]"
 *     Output: "accaccacc"
 *     Why:    The inner "2[c]" is "cc", so the outer part is "acc",
 *             repeated 3 times.
 *
 *   Example 3
 *     Input:  s = "2[abc]3[cd]ef"
 *     Output: "abcabccdcdcdef"
 *
 *   Example 4
 *     Input:  s = "10[x]y"
 *     Output: "xxxxxxxxxxy"
 *     Why:    The count is 10, not 1 followed by 0[...].
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 1 <= s.length <= 10^4
 *   • s consists of lowercase English letters, digits and '[' ']'.
 *   • Every repeat count k satisfies 1 <= k <= 300.
 *   • The decoded string has at most 10^5 characters.
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   One left-to-right pass over `s`, i.e. time proportional to the length
 *   of the input plus the length of the output. Space proportional to the
 *   nesting depth plus the output.
 */

// ▶ Run tests:   npm run solve decode-string
// ⟳ Watch mode:  npm run watch decode-string

/**
 * Expands a string encoded with the nested `k[encoded]` repetition rule.
 *
 * @param {string} s - A well-formed encoded string of lowercase letters, digits and square brackets.
 * @returns {string} The fully decoded string.
 */
export function decodeString(s) {
  // Your code here
}
