/*
 * Title:      Word Ladder
 * Difficulty: Hard
 * Patterns:   Graph BFS
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * A transformation sequence from `beginWord` to `endWord` is a list of words
 *
 *     beginWord → w1 → w2 → … → endWord
 *
 * where
 *   • every two consecutive words differ in EXACTLY one position (same
 *     length, one letter swapped for another: "hot" → "dot" is fine,
 *     "hot" → "toh" (rearranged) and "hot" → "dig" (two letters) are
 *     not), and
 *   • every word after beginWord (including endWord) is in `wordList`.
 *     beginWord itself does not have to be in the list.
 *
 * Return the NUMBER OF WORDS in the shortest such sequence (counting both
 * beginWord and endWord), or 0 if no sequence exists. In particular, if
 * endWord is not in `wordList`, the answer is 0.
 *
 *   • All words have the same length and consist of lowercase English
 *     letters.
 *   • beginWord ≠ endWord.
 *   • wordList may contain duplicates and may contain beginWord.
 *   • Do not modify `wordList`.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  beginWord = "hit", endWord = "cog",
 *             wordList = ["hot", "dot", "dog", "lot", "log", "cog"]
 *     Output: 5
 *     Why:    "hit" → "hot" → "dot" → "dog" → "cog" has 5 words.
 *
 *   Example 2
 *     Input:  beginWord = "hit", endWord = "cog",
 *             wordList = ["hot", "dot", "dog", "lot", "log"]
 *     Output: 0
 *     Why:    "cog" is not in the list, so it can never be reached.
 *
 *   Example 3
 *     Input:  beginWord = "a", endWord = "c", wordList = ["a", "b", "c"]
 *     Output: 2
 *     Why:    "a" → "c" directly. The answer counts words, not steps.
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 1 <= beginWord.length <= 10
 *   • endWord.length === beginWord.length, every wordList[i] has that length
 *   • 0 <= wordList.length <= 5000
 *   • beginWord, endWord and wordList[i] are lowercase English letters.
 *   • beginWord ≠ endWord
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   With N words of length L: O(N · L²) time (O(N · L) neighbour lookups,
 *   each building a string of length L) and O(N · L²) space if you index
 *   the words by pattern — or O(N · 26 · L²) by trying every letter in
 *   every position.
 *
 *   Comparing the current word against the whole list to find neighbours
 *   is O(N² · L). The performance test runs 10 searches on a ~5000-word
 *   list of 6-letter words, where scanning the full list for every word you
 *   dequeue takes seconds. (A pairwise scan that deletes visited words from
 *   the candidate pool is cleverer and may squeak by at this size — but its
 *   cost still grows quadratically with the list.)
 *
 *   Follow-up: bidirectional BFS (grow from both ends, always expanding the
 *   smaller frontier) usually explores far fewer words.
 */

// ▶ Run tests:   npm run solve word-ladder
// ⟳ Watch mode:  npm run watch word-ladder

/**
 * Finds the length (in words) of the shortest one-letter-at-a-time transformation from beginWord to endWord.
 *
 * @param {string} beginWord - Starting word (need not be in the list).
 * @param {string} endWord - Target word (must be in the list to be reachable).
 * @param {string[]} wordList - Allowed intermediate and final words, all the same length as beginWord.
 * @returns {number} Number of words in the shortest sequence including both ends, or 0 if there is none.
 */
export function ladderLength(beginWord, endWord, wordList) {
  // Your code here
}
