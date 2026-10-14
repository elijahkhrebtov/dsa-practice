/*
 * Title:      Count Primes
 * Difficulty: Medium
 * Patterns:   Math
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * Given an integer `n`, return how many prime numbers are **strictly less
 * than** n.
 *
 * A prime is an integer greater than 1 whose only positive divisors are 1
 * and itself (2, 3, 5, 7, 11, …). 0 and 1 are not prime. If n is itself
 * prime, it is not counted.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  n = 10
 *     Output: 4
 *     Why:    The primes below 10 are 2, 3, 5 and 7.
 *
 *   Example 2
 *     Input:  n = 13
 *     Output: 5
 *     Why:    2, 3, 5, 7, 11. 13 itself is excluded ("strictly less").
 *
 *   Example 3
 *     Input:  n = 0
 *     Output: 0
 *
 *   Example 4
 *     Input:  n = 1
 *     Output: 0
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 0 <= n <= 2 * 10^7
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   O(n log log n) time with the sieve of Eratosthenes, O(n) space.
 *
 *   Testing every number by trial division up to its square root is about
 *   O(n√n / log n). It's correct, but the performance test uses
 *   n = 2·10^7 with a one-second limit, and trial division takes several
 *   seconds there.
 */

// ▶ Run tests:   npm run solve count-primes
// ⟳ Watch mode:  npm run watch count-primes

/**
 * Counts the prime numbers strictly less than `n`.
 *
 * @param {number} n - Upper bound, exclusive (0 ≤ n ≤ 2·10^7).
 * @returns {number} How many primes p satisfy 2 ≤ p < n.
 */
export function countPrimes(n) {
  // Your code here
}
