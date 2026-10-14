/*
 * Title:      Edit Distance
 * Difficulty: Medium
 * Patterns:   Dynamic Programming
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * Given two strings `word1` and `word2`, return the minimum number of
 * single-character operations needed to turn `word1` into `word2`.
 * The allowed operations are:
 *
 *   • Insert a character (anywhere).
 *   • Delete a character.
 *   • Replace a character with a different one.
 *
 * Each operation costs 1. There is no "swap two characters" operation.
 * If the strings are already equal, the answer is 0. (This is also known
 * as the Levenshtein distance.)
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  word1 = "horse", word2 = "ros"
 *     Output: 3
 *     Why:    horse → rorse (replace 'h' with 'r')
 *             rorse → rose  (delete 'r')
 *             rose  → ros   (delete 'e')
 *
 *   Example 2
 *     Input:  word1 = "intention", word2 = "execution"
 *     Output: 5
 *     Why:    intention → inention (delete 't')
 *             inention  → enention (replace 'i' with 'e')
 *             enention  → exention (replace 'n' with 'x')
 *             exention  → exection (replace 'n' with 'c')
 *             exection  → execution (insert 'u')
 *
 *   Example 3
 *     Input:  word1 = "", word2 = "abc"
 *     Output: 3
 *     Why:    Three insertions.
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 0 <= word1.length, word2.length <= 1000
 *   • Both strings consist of lowercase English letters only.
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   Recursing over "insert, delete or replace" without remembering results
 *   branches three ways on every mismatch. Two 12-letter words with nothing
 *   in common already take seconds, and the tests include such a pair.
 *   Aim for O(m · n) time; O(min(m, n)) extra space is a nice follow-up.
 */

// ▶ Run tests:   npm run solve edit-distance
// ⟳ Watch mode:  npm run watch edit-distance

/**
 * Computes the minimum number of insertions, deletions and replacements that turn `word1` into `word2`.
 *
 * @param {string} word1 - The starting string (lowercase letters, may be empty).
 * @param {string} word2 - The target string (lowercase letters, may be empty).
 * @returns {number} The edit (Levenshtein) distance between the two strings.
 */
export function minDistance(word1, word2) {
  // Your code here
}
