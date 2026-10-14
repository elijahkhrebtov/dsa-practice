/*
 * Title:      Generate Parentheses
 * Difficulty: Medium
 * Patterns:   Backtracking, Recursion
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * Given an integer `n`, return every string made of exactly `n` opening
 * brackets '(' and `n` closing brackets ')' that is WELL-FORMED: reading
 * left to right, every ')' closes an earlier unmatched '(' and, at the end,
 * nothing is left open.
 *
 *   • Return each well-formed string exactly once, in ANY order (the tests
 *     sort the result).
 *   • Every string has length 2n.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  n = 3
 *     Output: ["((()))","(()())","(())()","()(())","()()()"]
 *
 *   Example 2
 *     Input:  n = 1
 *     Output: ["()"]
 *
 *   Example 3
 *     Input:  n = 2
 *     Output: ["(())","()()"]
 *     Why:    ")(()" or "())(" have the right counts but close a bracket
 *             that was never opened.
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 1 <= n <= 10 (the answer for n = 10 has 16,796 strings)
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   Never build an invalid string: only add a bracket when the result can
 *   still become well-formed. Then the work is proportional to the output
 *   size (the n-th Catalan number of strings, each of length 2n), instead
 *   of generating all 2^(2n) bracket strings and filtering them.
 */

// ▶ Run tests:   npm run solve generate-parentheses
// ⟳ Watch mode:  npm run watch generate-parentheses

/**
 * Generates every well-formed combination of `n` pairs of parentheses.
 *
 * @param {number} n - Number of bracket pairs (1 to 10).
 * @returns {string[]} All distinct well-formed strings of length `2n`, in any order.
 */
export function generateParenthesis(n) {
  // Your code here
}
