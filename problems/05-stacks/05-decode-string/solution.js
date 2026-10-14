/*
 * Title:      Decode String
 * Difficulty: Medium
 * Patterns:   Stack, String Parsing
 *
 * Solution — Decode String
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * The brackets nest, and the innermost group has to be expanded before
 * the group around it can be. As we read left to right, a '[' means
 * "pause what I'm building and start a fresh sub-string", and a ']' means
 * "finish the most recent sub-string, repeat it, and resume whatever was
 * paused". The paused work comes back in last-in-first-out order, so a
 * stack is the right tool.
 *
 * What do we need to save when we pause? The text built so far at the
 * outer level (we'll append the expanded group to it) and the repeat count
 * that came just before the '['.
 *
 * Approach
 * ────────
 *   State: `current` (string being built at this level) and `num` (the
 *   repeat count being read). Stack of [prefix, count] pairs.
 *
 *   For each character ch:
 *     1. Digit:  num = num * 10 + digit   (counts may have several digits)
 *     2. '[':    push [current, num]; reset current = '', num = 0
 *     3. ']':    pop [prefix, k]; current = prefix + current.repeat(k)
 *     4. Letter: current += ch
 *   Return `current`.
 *
 * Walkthrough — s = "3[a2[c]]"
 * ───────────
 *   ch   action                         current   num   stack
 *   '3'  num = 3                        ''        3     []
 *   '['  push ['', 3], reset            ''        0     [['',3]]
 *   'a'  append                         'a'       0     [['',3]]
 *   '2'  num = 2                        'a'       2     [['',3]]
 *   '['  push ['a', 2], reset           ''        0     [['',3], ['a',2]]
 *   'c'  append                         'c'       0     [['',3], ['a',2]]
 *   ']'  pop ['a',2] → 'a' + 'cc'       'acc'     0     [['',3]]
 *   ']'  pop ['',3]  → '' + 'acc'×3     'accaccacc'     []
 *   → "accaccacc"
 *
 * Complexity
 * ──────────
 *   Time:  O(|s| + total length of all strings built). Each ']' builds a
 *          new string, so deeply nested text is copied once per level.
 *          That is bounded by depth × output, which is small for the
 *          given constraints. In practice it's linear in input + output.
 *   Space: O(depth + output) for the stack of saved prefixes and the result.
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Recursion: a function that parses one sequence and returns when it
 *     hits ']' (sharing an index across calls) does the same thing, with
 *     the call stack playing the role of the explicit stack.
 *   • Regex "replace the innermost k[letters] until no brackets remain"
 *     works, but it rescans and copies the whole string every round.
 *   • Multi-digit counts: reading only one digit turns "12[a]" into
 *     "1" and "2[a]". Accumulate with num * 10 + digit and reset num
 *     after pushing it.
 *   • Forgetting the prefix: at ']' the expanded group must be appended to
 *     the text that was built BEFORE the matching '[' — that's why the
 *     prefix is saved on the stack together with the count.
 *   • Building output one character at a time in nested loops is slow.
 *     String.prototype.repeat does the copying in one go.
 */

/**
 * @param {string} s
 * @returns {string}
 */
export function decodeString(s) {
  /** @type {Array<[string, number]>} paused levels: [text before the '[', repeat count] */
  const stack = [];
  let current = ''; // text built at the current nesting level
  let num = 0; // repeat count being read (may span several digits)

  for (const ch of s) {
    if (ch >= '0' && ch <= '9') {
      num = num * 10 + (ch.charCodeAt(0) - 48);
    } else if (ch === '[') {
      stack.push([current, num]); // pause this level
      current = '';
      num = 0;
    } else if (ch === ']') {
      const [prefix, k] = stack.pop(); // resume the paused level
      current = prefix + current.repeat(k);
    } else {
      current += ch; // plain letter
    }
  }

  return current;
}
