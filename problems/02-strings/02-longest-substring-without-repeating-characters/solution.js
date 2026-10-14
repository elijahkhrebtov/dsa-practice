/*
 * Title:      Longest Substring Without Repeating Characters
 * Difficulty: Medium
 * Patterns:   Sliding Window, Hash Map
 *
 * Solution — Longest Substring Without Repeating Characters
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * Brute force tries every start i and extends while characters stay
 * distinct — lots of re-scanning. The key observation: if s[left..right-1]
 * is duplicate-free and s[right] repeats a character at index p inside that
 * window, then NO valid window ending at `right` can start at or before p.
 * So the best window ending at `right` starts at p + 1, and we can move
 * `left` there in one jump. Both edges only ever move forward → O(n).
 *
 * Approach (sliding window + "last seen" index)
 * ─────────────────────────────────────────────
 *   1. lastSeen = map from character → most recent index (here an Int32Array
 *      of size 128 filled with -1, indexed by char code).
 *   2. left = 0, best = 0.
 *   3. For right = 0 .. n-1:
 *        a. c = s.charCodeAt(right)
 *        b. If lastSeen[c] >= left, the char is inside the window:
 *           left = lastSeen[c] + 1.
 *        c. lastSeen[c] = right.
 *        d. best = max(best, right - left + 1).
 *   4. Return best.
 *
 * Walkthrough — s = "abba"
 * ───────────
 *   right=0 'a'  lastSeen[a]=-1          left=0  window "a"    best=1
 *   right=1 'b'  lastSeen[b]=-1          left=0  window "ab"   best=2
 *   right=2 'b'  lastSeen[b]=1 >= 0  →   left=2  window "b"    best=2
 *   right=3 'a'  lastSeen[a]=0 <  2  →   left stays 2 (that 'a' is outside
 *                                        the window!)  window "ba"  best=2
 *   Answer: 2. Without the `>= left` check, left would jump BACK to 1 and
 *   we'd wrongly report "bba" (3).
 *
 * Complexity
 * ──────────
 *   Time:  O(n) — one pass; each step is O(1).
 *   Space: O(1) — a fixed 128-entry table (O(alphabet) in general; a Map
 *          would use O(min(n, alphabet))).
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Brute force: for each start, extend with a fresh Set until a repeat.
 *     O(n · alphabet) here; checking every substring independently is
 *     O(n² · alphabet) or worse.
 *   • Set-based window: on a duplicate, delete s[left] and left++ until the
 *     duplicate is gone. Still O(n) (each char added/removed once), just
 *     slightly more work per step. Use `while`, not `if`, when shrinking.
 *   • Bug: `left = lastSeen[c] + 1` without the `>= left` guard (the "abba"
 *     trap above). Writing `left = Math.max(left, lastSeen[c] + 1)` is an
 *     equivalent fix.
 *   • Bug: `if (map.get(c))` — index 0 is falsy. Use `has` or compare to -1.
 *   • Building substrings with `s.slice` inside the loop to test membership
 *     costs O(window) each time.
 */

/**
 * @param {string} s
 * @returns {number}
 */
export function lengthOfLongestSubstring(s) {
  const lastSeen = new Int32Array(128).fill(-1); // char code → last index seen
  let left = 0;
  let best = 0;

  for (let right = 0; right < s.length; right++) {
    const c = s.charCodeAt(right);
    // Only a previous occurrence INSIDE the window forces left forward.
    if (lastSeen[c] >= left) left = lastSeen[c] + 1;
    lastSeen[c] = right;
    const len = right - left + 1;
    if (len > best) best = len;
  }

  return best;
}
