/*
 * Title:      Word Break
 * Difficulty: Medium
 * Patterns:   Dynamic Programming, Hash Set
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * You are given a string `s` and a list of dictionary words `wordDict`.
 * Return `true` if `s` can be split into a sequence of one or more
 * dictionary words laid end to end (every character of `s` belongs to
 * exactly one word), and `false` otherwise.
 *
 *   • A dictionary word may be used any number of times, or not at all.
 *   • The words must appear in `s` in order, contiguously, with nothing
 *     left over — you can't skip or reorder characters.
 *   • Return only the yes/no answer, not the split itself.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  s = "leetcode", wordDict = ["leet", "code"]
 *     Output: true
 *     Why:    "leet" + "code"
 *
 *   Example 2
 *     Input:  s = "applepenapple", wordDict = ["apple", "pen"]
 *     Output: true
 *     Why:    "apple" + "pen" + "apple" — "apple" is used twice.
 *
 *   Example 3
 *     Input:  s = "catsandog", wordDict = ["cats", "dog", "sand", "and", "cat"]
 *     Output: false
 *     Why:    "cats" + "and" and "cat" + "sand" both cover "catsand", but
 *             the leftover "og" is not a word.
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 1 <= s.length <= 2000
 *   • 1 <= wordDict.length <= 1000
 *   • 1 <= wordDict[i].length <= 20
 *   • `s` and every word consist of lowercase English letters only.
 *   • `wordDict` may contain duplicates (they make no difference).
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   Trying every way to cut the string is exponential: for "aaa…ab" with
 *   the words "a", "aa", "aaa", … there are millions of cuts and none of
 *   them works. The tests include exactly that input. Aim for
 *   O(n · L) substring checks, where n = s.length and L is the longest word
 *   length (or O(n²) if you don't bound by L), using O(n) extra space.
 */

// ▶ Run tests:   npm run solve word-break
// ⟳ Watch mode:  npm run watch word-break

/**
 * Decides whether `s` can be segmented into a sequence of dictionary words.
 *
 * @param {string} s - The string to segment (lowercase letters).
 * @param {string[]} wordDict - The allowed words; each may be reused any number of times.
 * @returns {boolean} `true` if `s` is a concatenation of one or more dictionary words, otherwise `false`.
 */
export function wordBreak(s, wordDict) {
  // Your code here
}
