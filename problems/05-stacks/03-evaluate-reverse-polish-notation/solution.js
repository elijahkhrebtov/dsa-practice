/*
 * Title:      Evaluate Reverse Polish Notation
 * Difficulty: Medium
 * Patterns:   Stack
 *
 * Solution — Evaluate Reverse Polish Notation
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * In postfix notation an operator always applies to the two most recent
 * values that haven't been consumed yet. Those values may be plain numbers
 * or results of earlier operators. "Most recent first" is a stack: push
 * values as they appear, and let each operator pop its two operands and
 * push the result back. A valid expression leaves exactly one value.
 *
 * Approach
 * ────────
 *   1. Create an empty stack of numbers.
 *   2. For each token:
 *        a. If it is one of "+", "-", "*", "/":
 *             b = pop()   ← right operand (pushed last)
 *             a = pop()   ← left operand
 *             push(a op b), using Math.trunc(a / b) for division.
 *        b. Otherwise it is an integer: push Number(token).
 *   3. Return the only value left on the stack.
 *
 * Walkthrough — ["4", "13", "5", "/", "+"]
 * ───────────
 *   "4"   push            stack: [4]
 *   "13"  push            stack: [4, 13]
 *   "5"   push            stack: [4, 13, 5]
 *   "/"   b=5, a=13       13 / 5 = 2.6 → trunc → 2      stack: [4, 2]
 *   "+"   b=2, a=4        4 + 2 = 6                     stack: [6]
 *   end → 6
 *
 * Complexity
 * ──────────
 *   Time:  O(n) — every token is handled once with O(1) work.
 *   Space: O(n) — e.g. all operands first, all operators last.
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Repeatedly scanning the token array for the first operator and
 *     splicing "a b op" into its result is correct but O(n²).
 *   • Recursion from the END of the array (the last token is the root
 *     operator) also works in O(n), but it's easy to get the index
 *     bookkeeping wrong and deep expressions can overflow the call stack.
 *   • Operand order: the first pop is the RIGHT operand. Swapping them
 *     breaks "-" and "/" but not "+" and "*", so simple tests may not
 *     reveal the bug.
 *   • Division: Math.floor(-7 / 2) is -4, but truncation toward zero gives
 *     -3. Use Math.trunc. (`(a / b) | 0` also truncates and is safe here
 *     because all values fit in 32 bits.)
 *   • Math.trunc(-0.5) is -0. It behaves exactly like 0 in later
 *     arithmetic; the tests accept it, but `Object.is(-0, 0)` is false,
 *     which is why the result is normalized below anyway.
 *   • Detecting operators with `token[0] === '-'` misclassifies "-11".
 *     Compare whole tokens (or check `token.length === 1`).
 */

/**
 * @param {string[]} tokens
 * @returns {number}
 */
export function evalRPN(tokens) {
  const stack = [];

  for (const token of tokens) {
    if (token === '+' || token === '-' || token === '*' || token === '/') {
      const b = stack.pop(); // right operand: it was pushed last
      const a = stack.pop(); // left operand
      let result;
      if (token === '+') result = a + b;
      else if (token === '-') result = a - b;
      else if (token === '*') result = a * b;
      else result = Math.trunc(a / b); // truncate toward zero, not floor
      stack.push(result);
    } else {
      stack.push(Number(token)); // handles negatives such as "-11"
    }
  }

  const answer = stack.pop();
  return answer === 0 ? 0 : answer; // turns -0 into a plain 0
}
