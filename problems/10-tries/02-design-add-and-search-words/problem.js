/*
 * Title:      Design Add and Search Words Data Structure
 * Difficulty: Medium
 * Patterns:   Trie, Recursion
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * Design a dictionary that stores words and can check whether a pattern
 * matches any stored word, where the pattern may contain wildcards.
 *
 * Implement the `WordDictionary` class:
 *
 *   • new WordDictionary()   creates an empty dictionary.
 *   • addWord(word)          stores `word` (lowercase letters only). Adding
 *                            a word twice changes nothing.
 *   • search(pattern)        returns `true` if some stored word matches
 *                            `pattern`, and `false` otherwise.
 *
 * Matching rules for `search`:
 *
 *   • `pattern` consists of lowercase letters and dots ('.').
 *   • A dot matches exactly ONE letter, any letter.
 *   • A letter matches only itself.
 *   • The whole word must match: the pattern and the word have the same
 *     length. A pattern is not a prefix query, so "ba." doesn't match "bad"
 *     plus more letters.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   const d = new WordDictionary();
 *   d.addWord('bad');
 *   d.addWord('dad');
 *   d.addWord('mad');
 *   d.search('pad');   // false
 *   d.search('bad');   // true
 *   d.search('.ad');   // true   ('bad', 'dad' and 'mad' all match)
 *   d.search('b..');   // true   ('bad')
 *   d.search('b.');    // false  (too short: no 2-letter word starts with b)
 *   d.search('...');   // true   (any 3-letter word)
 *   d.search('....');  // false  (no 4-letter word)
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 1 <= word.length, pattern.length <= 25
 *   • `word` contains only lowercase English letters. `pattern` contains
 *     lowercase letters and '.'.
 *   • A pattern may contain any number of dots. The performance test uses
 *     at most 2 dots per pattern, with 20,000 words and 20,000 searches.
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   addWord in O(L). search in O(L) when the pattern has no dots. Each dot
 *   can branch into at most 26 children, so the cost grows only with the
 *   dots, never with the total number of stored words. Comparing the
 *   pattern against every stored word costs O(words · L) per search, and
 *   the performance test is designed to make that too slow.
 */

// ▶ Run tests:   npm run solve design-add-and-search-words
// ⟳ Watch mode:  npm run watch design-add-and-search-words

/**
 * A word dictionary supporting searches with '.' wildcards.
 */
export class WordDictionary {
  /**
   * Creates an empty dictionary.
   */
  constructor() {
    // Your code here
  }

  /**
   * Stores a word in the dictionary.
   *
   * @param {string} word - Lowercase word to add.
   * @returns {void}
   */
  addWord(word) {
    // Your code here
  }

  /**
   * Checks whether any stored word matches the pattern ('.' matches any single letter).
   *
   * @param {string} pattern - Lowercase letters and dots; must match a whole word of the same length.
   * @returns {boolean} `true` if at least one stored word matches `pattern`.
   */
  search(pattern) {
    // Your code here
  }
}
