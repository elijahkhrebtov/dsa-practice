/*
 * Title:      Container With Most Water
 * Difficulty: Medium
 * Patterns:   Two Pointers, Greedy
 *
 * Solution — Container With Most Water
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * Start with the widest container (lines 0 and n−1). Suppose height[left]
 * is the shorter of the two. Pair the left line with any other line k
 * between the pointers: the width (k − left) is smaller than now, and the
 * level min(height[left], height[k]) is still at most height[left]. So
 * EVERY remaining container that uses the left line is no better than the
 * one we just measured. We can discard the left line for good and move
 * the left pointer inward. The same argument applies symmetrically when
 * the right line is shorter.
 *
 * Each step permanently eliminates one line without missing the optimum —
 * a greedy argument that turns O(n²) pairs into O(n) steps.
 *
 * Approach (two pointers from the ends)
 * ─────────────────────────────────────
 *   1. left = 0, right = n − 1, best = 0.
 *   2. While left < right:
 *        best = max(best, min(height[left], height[right]) × (right − left))
 *        if height[left] < height[right]: left++   (the left line is used up)
 *        else:                            right--  (the right line is used up)
 *   3. Return best.
 *
 * On ties either move is safe: both lines are capped at the same level, so
 * neither can do better with a narrower partner.
 *
 * Walkthrough — height = [1, 8, 6, 2, 5, 4, 8, 3, 7]
 * ───────────
 *   l r  h[l] h[r]  area          best  move
 *   0 8  1    7     1·8 = 8       8     l++ (1 < 7)
 *   1 8  8    7     7·7 = 49      49    r--
 *   1 7  8    3     3·6 = 18      49    r--
 *   1 6  8    8     8·5 = 40      49    r-- (tie)
 *   1 5  8    4     4·4 = 16      49    r--
 *   1 4  8    5     5·3 = 15      49    r--
 *   1 3  8    2     2·2 = 4       49    r--
 *   1 2  8    6     6·1 = 6       49    r--
 *   → 49
 *
 * Complexity
 * ──────────
 *   Time:  O(n) — each iteration moves one pointer inward.
 *   Space: O(1).
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Brute force over all pairs: O(n²), ~5·10^9 pairs for n = 10^5.
 *   • Moving the TALLER pointer is wrong: it can throw away the line that
 *     belongs to the optimal pair while keeping the one that limits you.
 *   • Don't confuse this with Trapping Rain Water: here the lines in between
 *     are irrelevant and you choose exactly two lines.
 *   • Small optimization: after moving, keep skipping lines that are not
 *     taller than the one you just discarded — they can't help. Same
 *     big-O, fewer area computations.
 */

/**
 * @param {number[]} height
 * @returns {number}
 */
export function maxArea(height) {
  let left = 0;
  let right = height.length - 1;
  let best = 0;

  while (left < right) {
    const area = Math.min(height[left], height[right]) * (right - left);
    if (area > best) best = area;

    // The shorter line can't do better with any narrower partner — drop it.
    if (height[left] < height[right]) left++;
    else right--;
  }

  return best;
}
