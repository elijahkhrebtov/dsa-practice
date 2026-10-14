/*
 * Title:      Generate Parentheses
 * Difficulty: Medium
 * Patterns:   Backtracking, Recursion
 *
 * Solution — Generate Parentheses
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * A bracket string is well-formed iff (1) it has n '(' and n ')' and
 * (2) no prefix contains more ')' than '('. Both rules can be checked
 * WHILE building the string left to right, so instead of producing all
 * 2^(2n) strings and filtering, we grow only prefixes that can still be
 * completed:
 *
 *   • '(' is allowed while open < n          (don't exceed n openings)
 *   • ')' is allowed while close < open      (only close what's open)
 *
 * Under these rules every prefix can be finished (just close everything
 * that's open after the remaining openings), so no branch is wasted: each
 * leaf of the recursion is a distinct valid answer.
 *
 * Approach
 * ────────
 *   1. result = [].
 *   2. build(current, open, close):
 *        • if current.length === 2n → push current; return
 *        • if open < n     → build(current + '(', open + 1, close)
 *        • if close < open → build(current + ')', open, close + 1)
 *   3. build('', 0, 0); return result.
 *
 * Walkthrough — n = 2
 * ───────────
 *   ''  (0,0)
 *   └─ '('  (1,0)
 *       ├─ '(('  (2,0)  open = n, so only ')' from here
 *       │   └─ '(()' (2,1) └─ '(())' ✓
 *       └─ '()'  (1,1)  close = open, so only '('
 *           └─ '()(' (2,1) └─ '()()' ✓
 *   Result: ["(())", "()()"]
 *
 * Complexity
 * ──────────
 *   Time:  O(C(n) · n), where C(n) = (2n)! / ((n+1)! n!) is the n-th
 *          Catalan number ≈ 4^n / (n^1.5 · √π). Each result costs O(n) to
 *          build; internal nodes are bounded by the leaves times 2n.
 *   Space: O(n) recursion depth, plus the output itself.
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Generate all 2^(2n) strings, keep the valid ones: O(2^(2n) · n) —
 *     about a million strings for n = 10, mostly thrown away.
 *   • Catalan recursion: every valid string is "(" + A + ")" + B, where A
 *     has k pairs and B has n-1-k pairs. Combine all A's and B's for each
 *     k (optionally memoized). Elegant and also output-sensitive.
 *   • Bug: allowing ')' when close < n instead of close < open → produces
 *     strings like "())(" .
 *   • Bug: building into a shared array without undoing (pop) after the
 *     recursive call. Passing new strings down avoids that entirely.
 */

/**
 * @param {number} n
 * @returns {string[]}
 */
export function generateParenthesis(n) {
  const result = [];

  /**
   * @param {string} current - prefix built so far (always completable)
   * @param {number} open - number of '(' in `current`
   * @param {number} close - number of ')' in `current`
   */
  const build = (current, open, close) => {
    if (current.length === 2 * n) {
      result.push(current);
      return;
    }
    if (open < n) build(current + '(', open + 1, close); // can still open
    if (close < open) build(current + ')', open, close + 1); // something to close
  };

  build('', 0, 0);
  return result;
}
