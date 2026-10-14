/*
 * Title:      Letter Combinations of a Phone Number
 * Difficulty: Medium
 * Patterns:   Backtracking
 *
 * Solution — Letter Combinations of a Phone Number
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * Each answer is a sequence of independent choices — one letter per digit.
 * Laying those choices out gives a tree: the root is the empty string, the
 * nodes at depth d are all prefixes of length d, and every leaf (depth n)
 * is one full combination. A depth-first walk over that tree — choose a
 * letter, recurse, undo — visits each leaf exactly once. That's
 * backtracking in its purest form: there's no pruning because every path
 * leads to a valid answer.
 *
 * Approach
 * ────────
 *   1. If digits is empty, return [] (otherwise the recursion would record
 *      the empty string as one "combination").
 *   2. Keep a fixed table digit → letters.
 *   3. build(index, path):
 *        • if index === digits.length → push path.join('') to the result;
 *        • else for each letter of digits[index]:
 *              path.push(letter); build(index + 1, path); path.pop();
 *   4. Call build(0, []) and return the result.
 *
 * Walkthrough — digits = "23"
 * ───────────
 *   build(0, [])
 *     'a' → build(1, [a])  → 'd' → "ad", 'e' → "ae", 'f' → "af"
 *     'b' → build(1, [b])  → "bd", "be", "bf"
 *     'c' → build(1, [c])  → "cd", "ce", "cf"
 *   Result: 9 strings.
 *
 * Complexity
 * ──────────
 *   Time:  O(4^n · n) — up to 4^n leaves, each costs O(n) to join into a
 *          string. That matches the size of the output, so it's optimal.
 *   Space: O(n) for the recursion and the path (not counting the output,
 *          which is O(4^n · n) itself).
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Iterative "BFS" build: start with [""] and for each digit replace
 *     every partial string with its extensions:
 *       result = result.flatMap(p => letters[d].split('').map(c => p + c))
 *     Same complexity, very compact. Still special-case empty input.
 *   • Passing `current + letter` (a new string) down instead of a shared
 *     array is fine and simpler; strings are immutable so there's nothing
 *     to undo.
 *   • Bug: returning [""] for "" — the problem asks for [].
 *   • Bug: forgetting that 7 and 9 have FOUR letters (pqrs, wxyz).
 */

const KEYPAD = {
  2: 'abc',
  3: 'def',
  4: 'ghi',
  5: 'jkl',
  6: 'mno',
  7: 'pqrs',
  8: 'tuv',
  9: 'wxyz',
};

/**
 * @param {string} digits
 * @returns {string[]}
 */
export function letterCombinations(digits) {
  if (digits.length === 0) return [];

  const result = [];
  const path = []; // letters chosen so far, one per digit

  const build = (index) => {
    if (index === digits.length) {
      result.push(path.join(''));
      return;
    }
    for (const letter of KEYPAD[digits[index]]) {
      path.push(letter); // choose
      build(index + 1); // explore
      path.pop(); // un-choose
    }
  };

  build(0);
  return result;
}
