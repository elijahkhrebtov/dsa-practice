/*
 * Title:      Valid Parentheses
 * Difficulty: Easy
 * Patterns:   Stack
 *
 * Solution — Valid Parentheses
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * Proper nesting means "the bracket opened most recently must be closed
 * first". That is exactly last-in-first-out order, so a stack of
 * not-yet-closed openers models the problem perfectly: each closer must
 * match whatever is on top of the stack at that moment.
 *
 * Counting brackets per type is not enough — "([)]" has perfect counts but
 * the pairs cross. The stack catches that because when ')' arrives, the top
 * of the stack is '[' and not '('.
 *
 * Approach
 * ────────
 *   1. Keep a map closer → opener: ')' → '(', ']' → '[', '}' → '{'.
 *   2. Scan the string left to right:
 *        a. Opening bracket: push it onto the stack.
 *        b. Closing bracket: pop the top. If the stack was empty, or the
 *           popped opener isn't the matching one, return false.
 *   3. After the scan, return true only if the stack is empty — any
 *      leftovers are openers that were never closed.
 *
 * Small shortcut: an odd-length string can never be valid, so you can
 * return false immediately (optional — the algorithm handles it anyway).
 *
 * Walkthrough — s = "{[()]}" and s = "([)]"
 * ───────────
 *   "{[()]}"
 *     '{' push        stack: {
 *     '[' push        stack: { [
 *     '(' push        stack: { [ (
 *     ')' pop '(' ✓   stack: { [
 *     ']' pop '[' ✓   stack: {
 *     '}' pop '{' ✓   stack: (empty) → true
 *
 *   "([)]"
 *     '(' push        stack: (
 *     '[' push        stack: ( [
 *     ')' pop '[' ✗   ')' needs '(' → false
 *
 * Complexity
 * ──────────
 *   Time:  O(n) — each character is pushed and popped at most once.
 *   Space: O(n) — in the worst case ("((((…") every character is on the stack.
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Repeatedly deleting "()", "[]" and "{}" until the string stops
 *     changing is correct but O(n²): deeply nested input removes only one
 *     pair per pass, and every pass copies the whole string.
 *   • Popping from an empty stack: `stack.pop()` returns `undefined` in JS,
 *     which happens to compare unequal to every opener, so it "works" — but
 *     be explicit about the empty case; in other languages it crashes.
 *   • Forgetting the final emptiness check makes "((" look valid.
 *   • A counter per bracket type fails on crossing pairs like "([)]".
 *   • Use push/pop (end of the array). shift/unshift are O(n) in JS.
 */

const OPENER_OF = { ')': '(', ']': '[', '}': '{' };

/**
 * @param {string} s
 * @returns {boolean}
 */
export function isValid(s) {
  if (s.length % 2 === 1) return false; // odd length can never pair up

  const stack = []; // openers that are still waiting for their closer

  for (const ch of s) {
    const opener = OPENER_OF[ch];
    if (opener === undefined) {
      stack.push(ch); // it's an opening bracket
    } else if (stack.length === 0 || stack.pop() !== opener) {
      return false; // nothing to close, or the most recent opener is of a different type
    }
  }

  return stack.length === 0; // leftovers were never closed
}
