/*
 * Title:      Evaluate Reverse Polish Notation
 * Difficulty: Medium
 * Patterns:   Stack
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * You are given an arithmetic expression written in Reverse Polish Notation
 * (postfix notation) as an array of string tokens. Evaluate it and return
 * the resulting integer.
 *
 * In RPN an operator comes AFTER its two operands, so no parentheses are
 * ever needed: "3 4 +" means 3 + 4, and "2 3 4 * +" means 2 + (3 * 4).
 *
 * Each token is one of:
 *
 *   • an operator: "+", "-", "*" or "/"
 *   • an integer, possibly negative, such as "7", "0" or "-11"
 *     (note that "-11" is a number, while "-" on its own is an operator)
 *
 * Rules:
 *
 *   • For an operator, the operand that appeared EARLIER is the left-hand
 *     side: "5 2 -" is 5 - 2 = 3, and "6 3 /" is 6 / 3 = 2.
 *   • Division between two integers truncates toward zero:
 *     7 / 2 = 3, -7 / 2 = -3, 7 / -2 = -3.
 *   • The expression is always valid, there is never a division by zero,
 *     and every intermediate result fits in a 32-bit signed integer.
 *   • Return a plain number. A result of negative zero (-0) is accepted
 *     as 0.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  tokens = ["2", "1", "+", "3", "*"]
 *     Output: 9
 *     Why:    (2 + 1) * 3 = 9
 *
 *   Example 2
 *     Input:  tokens = ["4", "13", "5", "/", "+"]
 *     Output: 6
 *     Why:    4 + (13 / 5) = 4 + 2 = 6   (13 / 5 = 2.6 truncates to 2)
 *
 *   Example 3
 *     Input:  tokens = ["10", "6", "9", "3", "+", "-11", "*", "/", "*",
 *                       "17", "+", "5", "+"]
 *     Output: 22
 *     Why:    10 * (6 / ((9 + 3) * -11)) + 17 + 5
 *           = 10 * (6 / -132) + 17 + 5
 *           = 10 * 0 + 17 + 5          (6 / -132 = -0.045… truncates to 0)
 *           = 22
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 1 <= tokens.length <= 10^4 (the performance test uses 60,001 tokens)
 *   • Each token is an operator or an integer in [-200, 200].
 *   • The expression is valid; no division by zero; all intermediate values
 *     fit in a 32-bit signed integer.
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   O(n) time and O(n) space in a single pass over the tokens.
 */

// ▶ Run tests:   npm run solve evaluate-reverse-polish-notation
// ⟳ Watch mode:  npm run watch evaluate-reverse-polish-notation

/**
 * Evaluates an integer expression given in Reverse Polish (postfix) notation.
 *
 * @param {string[]} tokens - Operands (integer strings, possibly negative) and the operators "+", "-", "*", "/".
 * @returns {number} The value of the expression, with division truncating toward zero.
 */
export function evalRPN(tokens) {
  // Your code here
}
