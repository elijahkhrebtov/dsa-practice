/*
 * Title:      Decode Ways
 * Difficulty: Medium
 * Patterns:   Dynamic Programming
 *
 * Solution — Decode Ways
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * Look at how a decoding of the prefix s[0..i) ENDS. Its last piece is
 * either
 *   • the single digit s[i-1] — allowed when it isn't '0', or
 *   • the two digits s[i-2..i) — allowed when they form 10…26.
 * Whatever comes before that last piece is just a decoding of a shorter
 * prefix. So
 *
 *     ways(i) = [s[i-1] ≠ '0'] · ways(i-1)  +  [10 ≤ s[i-2..i) ≤ 26] · ways(i-2)
 *
 * which is the Fibonacci recurrence with "switches" that turn terms off.
 * Each prefix length is computed once, from the two before it.
 *
 * Approach (bottom-up, two rolling variables)
 * ───────────────────────────────────────────
 *   1. ways(0) = 1: the empty prefix has exactly one (empty) decoding.
 *      This makes the formula work for the first one- and two-digit pieces.
 *   2. Walk i = 1..n, computing ways(i) from ways(i-1) and ways(i-2) with
 *      the two switches above.
 *   3. Only the last two values are ever needed, so keep them in two
 *      variables instead of an array.
 *   4. Return ways(n). Zeros take care of themselves: a '0' turns off the
 *      single-digit term, and "00", "30", … also turn off the pair term, so
 *      the count drops to 0 and stays there.
 *
 * Walkthrough — s = "11106"
 * ───────────
 *   i   prefix    single (s[i-1])       pair (s[i-2..i))      ways(i)
 *   0   ""        —                     —                     1
 *   1   "1"       '1' ok → +ways(0)=1   —                     1
 *   2   "11"      '1' ok → +ways(1)=1   "11" ok → +ways(0)=1  2
 *   3   "111"     '1' ok → +ways(2)=2   "11" ok → +ways(1)=1  3
 *   4   "1110"    '0' ✗                 "10" ok → +ways(2)=2  2
 *   5   "11106"   '6' ok → +ways(4)=2   "06" ✗                2
 *
 *   Answer: 2 ("1 1 10 6" and "11 10 6").
 *
 * Complexity
 * ──────────
 *   Time:  O(n) — one constant-time step per digit.
 *   Space: O(1) — two rolling counters (O(n) if you keep the whole table).
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Plain recursion "take one digit or two, recurse on the rest" is
 *     correct but exponential — it visits every decoding (and every dead
 *     end) individually. Adding a memo keyed by index makes it O(n).
 *   • Zeros are where most bugs live:
 *       – "06" is not 6: check s[i-2] !== '0' (or compare the number
 *         against the range 10…26, which excludes "06" automatically).
 *       – A '0' can never stand alone, so it contributes no single-digit term.
 *       – Don't special-case "string starts with 0 → return 0" and forget the
 *         zeros in the middle ("1001", "230").
 *   • Using parseInt on a two-character slice is fine; comparing characters
 *     (s[i-2] === '1' || (s[i-2] === '2' && s[i-1] <= '6')) avoids
 *     allocating substrings.
 *   • The count is Fibonacci-like: a run of 1s/2s of length 78 would
 *     already exceed Number.MAX_SAFE_INTEGER. The constraints promise the
 *     answer fits in 32 bits; without that you'd need BigInt or a modulus.
 */

/**
 * @param {string} s
 * @returns {number}
 */
export function numDecodings(s) {
  let prev2 = 1; // ways(i-2) — starts as ways(0): the empty prefix
  let prev1 = s[0] === '0' ? 0 : 1; // ways(i-1) — starts as ways(1)

  for (let i = 2; i <= s.length; i++) {
    let cur = 0;
    // Last piece is the single digit s[i-1] (must not be '0').
    if (s[i - 1] !== '0') cur += prev1;
    // Last piece is the pair s[i-2]s[i-1] (must be 10..26 — no leading zero).
    const a = s[i - 2];
    const b = s[i - 1];
    if (a === '1' || (a === '2' && b <= '6')) cur += prev2;

    prev2 = prev1;
    prev1 = cur;
  }

  return prev1;
}
