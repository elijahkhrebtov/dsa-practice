/*
 * Title:      Jump Game
 * Difficulty: Medium
 * Patterns:   Greedy
 *
 * Solution — Jump Game
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * A natural first idea is DP: reachable[i] is true if some earlier reachable
 * j has j + nums[j] >= i. That's correct, but checking/marking ranges is
 * O(n²) in the worst case.
 *
 * The key observation: if index i is reachable, then EVERY index before i is
 * reachable too (whatever jump took you over them could have stopped
 * earlier — jumps are "up to" nums[j]). So the set of reachable indices is
 * always a prefix [0, farthest], and a single number describes it. Scanning
 * left to right, each reachable index i can push the frontier out to
 * i + nums[i]. If we ever arrive at an index beyond the frontier, there's a
 * gap nobody can cross, and the answer is false.
 *
 * Approach
 * ────────
 *   1. farthest = 0.
 *   2. For i = 0 … n - 1:
 *        a. If i > farthest → return false (i is unreachable).
 *        b. farthest = max(farthest, i + nums[i]).
 *        c. If farthest >= n - 1 → return true.
 *   3. Return true (only reached for n = 1 via step c anyway).
 *
 * Walkthrough
 * ───────────
 *   nums = [2, 3, 1, 1, 4]
 *     i=0  farthest = max(0, 0+2) = 2
 *     i=1  farthest = max(2, 1+3) = 4 >= 4 → true
 *
 *   nums = [3, 2, 1, 0, 4]
 *     i=0  farthest = 3
 *     i=1  farthest = max(3, 3) = 3
 *     i=2  farthest = max(3, 3) = 3
 *     i=3  farthest = max(3, 3) = 3
 *     i=4  4 > 3 → false
 *
 * Complexity
 * ──────────
 *   Time:  O(n) — one pass.
 *   Space: O(1).
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Plain recursion "try every jump from i": exponential. Memoizing it
 *     gives O(n · maxJump) = O(n²), and the recursion can be 10^5 deep, which
 *     overflows the JavaScript call stack.
 *   • Bottom-up DP (mark every index in range): O(n²) worst case.
 *   • Backward greedy: goal = n - 1; for i from n - 2 down to 0, if
 *     i + nums[i] >= goal then goal = i. Answer: goal === 0. Same O(n).
 *   • "Always take the longest jump" or "always take a step of 1" are NOT
 *     correct strategies — [2, 5, 0, 0] and [2, 0, 2, 0, 1] break them. The
 *     frontier greedy doesn't commit to a path; it tracks all of them at once.
 *   • Don't forget the single-element array: you're already at the end.
 */

/**
 * @param {number[]} nums
 * @returns {boolean}
 */
export function canJump(nums) {
  const last = nums.length - 1;
  let farthest = 0; // every index in [0, farthest] is reachable

  for (let i = 0; i <= last; i++) {
    if (i > farthest) return false; // a gap nobody can jump across
    farthest = Math.max(farthest, i + nums[i]);
    if (farthest >= last) return true;
  }

  return true; // unreachable in practice: the loop returns for every input
}
