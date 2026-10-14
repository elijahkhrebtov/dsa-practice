/*
 * Title:      Valid Parentheses
 * Difficulty: Easy
 * Patterns:   Stack
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * You are given a string `s` made up only of the six bracket characters
 * '(', ')', '[', ']', '{' and '}'. Decide whether the brackets are balanced.
 *
 * The string is valid when all of the following hold:
 *
 *   • Every opening bracket is closed by a bracket of the SAME type.
 *   • Brackets are closed in the correct order: the most recently opened,
 *     still-unclosed bracket must be the first one to be closed.
 *     "([)]" is therefore invalid even though the counts match.
 *   • Every closing bracket has a matching opening bracket before it.
 *
 * Return `true` if `s` is valid, `false` otherwise.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  s = "()[]{}"
 *     Output: true
 *
 *   Example 2
 *     Input:  s = "{[()]}"
 *     Output: true
 *     Why:    Each pair is closed only after everything opened inside it.
 *
 *   Example 3
 *     Input:  s = "(]"
 *     Output: false
 *     Why:    '(' is closed by a bracket of a different type.
 *
 *   Example 4
 *     Input:  s = "([)]"
 *     Output: false
 *     Why:    '[' was opened last, so it must be closed before ')' appears.
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 1 <= s.length <= 10^4 (the performance test uses 60,000 characters)
 *   • s contains only the characters ()[]{}
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   O(n) time, O(n) extra space, in a single left-to-right pass.
 *   Repeatedly deleting "()" / "[]" / "{}" pairs until nothing changes is
 *   correct but O(n²), and the performance test will catch it.
 */

// ▶ Run tests:   npm run solve valid-parentheses
// ⟳ Watch mode:  npm run watch valid-parentheses

/**
 * Checks whether a string of brackets is properly balanced and nested.
 *
 * @param {string} s - A string consisting only of the characters ()[]{}.
 * @returns {boolean} `true` if every bracket is closed by the same type in the correct order.
 */
export function isValid(s) {
  // Your code here
}
