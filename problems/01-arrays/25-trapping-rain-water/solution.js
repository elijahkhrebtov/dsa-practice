/*
 * Title:      Trapping Rain Water
 * Difficulty: Hard
 * Patterns:   Two Pointers, Prefix Sum
 *
 * Solution — Trapping Rain Water
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * Think per column. The water surface above column i settles at the height
 * of the lower of the two "walls" that enclose it: the tallest bar on its
 * left and the tallest bar on its right (both including i itself). So
 *
 *     water[i] = min(maxLeft[i], maxRight[i]) - height[i]      (never < 0)
 *
 * Computing both maxima from scratch for each i is O(n²). Precomputing a
 * prefix-maximum array (left to right) and a suffix-maximum array (right to
 * left) makes it O(n) time with O(n) extra space.
 *
 * The two-pointer trick removes the arrays. We only ever need the SMALLER
 * of the two maxima, and often we can know which one is smaller without
 * knowing the bigger one exactly. Walk inward from both ends, keeping
 * running maxima leftMax (over bars already passed on the left) and
 * rightMax (on the right). If leftMax <= rightMax, then column `left`'s true
 * maxRight is at least rightMax >= leftMax, so its level is exactly leftMax —
 * we can settle it now. Otherwise settle column `right` with rightMax.
 * Comparing the current bars height[left] <= height[right] is an equivalent,
 * slightly simpler test (see "Why is it safe?" below).
 *
 * Approach (two pointers, O(1) space)
 * ───────────────────────────────────
 *   1. left = 0, right = n - 1, leftMax = rightMax = 0, water = 0.
 *   2. While left < right:
 *        if height[left] <= height[right]:
 *            leftMax = max(leftMax, height[left])
 *            water += leftMax - height[left];  left++
 *        else:
 *            rightMax = max(rightMax, height[right])
 *            water += rightMax - height[right];  right--
 *   3. Return water. (The column where the pointers meet is a tallest bar,
 *      which holds no water.)
 *
 * Why is it safe? We always move the pointer at the lower bar, so the
 * other pointer sits on a bar at least as tall as everything the moving
 * side has seen (by induction: we only left a bar behind when the other
 * side was at least as tall). Hence the far wall is never the limiting one.
 *
 * Walkthrough — height = [4, 2, 0, 3, 2, 5]
 * ───────────
 *   l=0 r=5  4 <= 5 → leftMax=4, +0      water=0
 *   l=1 r=5  2 <= 5 → leftMax=4, +2      water=2
 *   l=2 r=5  0 <= 5 → leftMax=4, +4      water=6
 *   l=3 r=5  3 <= 5 → leftMax=4, +1      water=7
 *   l=4 r=5  2 <= 5 → leftMax=4, +2      water=9
 *   l=5 = r  stop → 9
 *
 * Complexity
 * ──────────
 *   Time:  O(n) — each step moves one pointer inward.
 *   Space: O(1).
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Brute force: for each i scan both sides for the maxima — O(n²).
 *   • Prefix/suffix maximum arrays — O(n) time, O(n) space; the easiest
 *     correct O(n) solution and a great stepping stone.
 *   • Monotonic stack: keep indices of decreasing heights; when a taller bar
 *     arrives, pop the "floor" and add a horizontal slab of water bounded by
 *     the new top and the current bar. O(n) time, O(n) space; it counts water
 *     in horizontal layers instead of vertical columns.
 *   • Forgetting that edge columns can't hold water: [0, 3, 0] → 0.
 *   • Taking max instead of min of the two walls overflows the lower wall.
 */

/**
 * @param {number[]} height
 * @returns {number}
 */
export function trap(height) {
  let left = 0;
  let right = height.length - 1;
  let leftMax = 0; // tallest bar seen so far from the left
  let rightMax = 0; // tallest bar seen so far from the right
  let water = 0;

  while (left < right) {
    if (height[left] <= height[right]) {
      // The right side has a wall at least this tall, so leftMax sets the level here.
      leftMax = Math.max(leftMax, height[left]);
      water += leftMax - height[left];
      left++;
    } else {
      rightMax = Math.max(rightMax, height[right]);
      water += rightMax - height[right];
      right--;
    }
  }

  return water;
}
