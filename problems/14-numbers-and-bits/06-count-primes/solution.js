/*
 * Title:      Count Primes
 * Difficulty: Medium
 * Patterns:   Math
 *
 * Solution — Count Primes
 * ══════════════════════════════════════════════════════════════════════��══
 *
 * Intuition
 * ─────────
 * Testing each number for primality separately (trial division up to √k)
 * costs about √k per prime and adds up to roughly O(n√n / log n). The sieve
 * of Eratosthenes works the other way around: instead of asking "does
 * anything divide k?", every prime announces its multiples. Each composite
 * gets crossed out by its prime factors, and whatever is never crossed out
 * is prime.
 *
 * Two observations make it fast:
 *   • When we reach prime p, every multiple k·p with k < p has a smaller
 *     prime factor and is already crossed out. So start at p·p.
 *   • Consequently, primes with p·p >= n cross out nothing. The outer loop
 *     can stop at √n, and every number still unmarked is prime.
 *
 * Approach
 * ────────
 *   1. If n < 3, return 0 (there is no prime below 2).
 *   2. composite = new Uint8Array(n) (all 0 = "not crossed out yet").
 *   3. For p = 2 while p·p < n: if composite[p] is 0, set composite[m] = 1
 *      for m = p·p, p·p + p, … < n.
 *   4. Count the indices 2 … n − 1 that are still 0.
 *
 * Walkthrough — n = 30
 * ───────────
 *   p = 2: cross out 4, 6, 8, …, 28
 *   p = 3: cross out 9, 15, 21, 27 (12, 18, 24 are already crossed out)
 *   p = 4: crossed out, skip
 *   p = 5: cross out 25 (and 30 is not < 30)
 *   p = 6: 36 >= 30, stop
 *   survivors: 2 3 5 7 11 13 17 19 23 29 → 10
 *
 * Complexity
 * ──────────
 *   Time:  O(n log log n) — prime p does about n/p crossings, and the sum of
 *          n/p over primes p < n is n·ln ln n. The final count is O(n).
 *   Space: O(n) — one byte per number (20 MB for n = 2·10^7).
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Trial division of every number: correct, but several seconds for
 *     n = 2·10^7. Dividing only by primes found so far helps a lot, but
 *     it's still slower than the sieve.
 *   • Memory: new Array(n).fill(true) also works but uses 4 to 8 bytes per
 *     entry instead of 1. A Uint8Array is smaller and faster.
 *   • Off-by-one traps: "strictly less than n" means index n is never
 *     looked at. Use `p * p < n` for the outer loop (p·p = n is out of
 *     range anyway), and don't count 0 and 1.
 *   • Odd-only sieve: skip even numbers entirely (count 2 separately) to
 *     halve memory and time. A good optimization, same complexity.
 *   • Linear sieve (Euler's sieve) is O(n) exactly, but more complex and
 *     rarely faster in practice.
 */

/**
 * @param {number} n
 * @returns {number}
 */
export function countPrimes(n) {
  if (n < 3) return 0; // no primes below 2

  const composite = new Uint8Array(n); // composite[k] = 1 once k is crossed out

  for (let p = 2; p * p < n; p++) {
    if (composite[p]) continue; // not prime: its multiples are already crossed out
    // smaller multiples k·p (k < p) were crossed out by k's prime factors
    for (let m = p * p; m < n; m += p) composite[m] = 1;
  }

  let count = 0;
  for (let k = 2; k < n; k++) if (!composite[k]) count++;
  return count;
}
