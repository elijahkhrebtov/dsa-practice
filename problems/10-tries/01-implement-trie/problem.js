/*
 * Title:      Implement Trie (Prefix Tree)
 * Difficulty: Medium
 * Patterns:   Trie, Design
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * A trie (prefix tree) stores a set of strings so that both exact lookups
 * and "does any stored word start with this prefix?" queries are fast.
 *
 * Implement the `Trie` class:
 *
 *   • new Trie()            creates an empty trie.
 *   • insert(word)          adds `word` to the trie. Inserting a word that
 *                           is already present changes nothing.
 *   • search(word)          returns `true` if `word` was inserted before,
 *                           as a complete word, and `false` otherwise.
 *   • startsWith(prefix)    returns `true` if at least one inserted word
 *                           starts with `prefix`, and `false` otherwise. A
 *                           word counts as a prefix of itself.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   const trie = new Trie();
 *   trie.insert('apple');
 *   trie.search('apple');     // true
 *   trie.search('app');       // false  ← 'app' is only a prefix so far
 *   trie.startsWith('app');   // true
 *   trie.insert('app');
 *   trie.search('app');       // true   ← now it's a word too
 *
 *   const t2 = new Trie();
 *   t2.insert('car');
 *   t2.startsWith('car');     // true   (a word is a prefix of itself)
 *   t2.startsWith('cart');    // false  (longer than anything stored)
 *   t2.search('ca');          // false
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 1 <= word.length, prefix.length <= 2000
 *   • `word` and `prefix` consist only of lowercase English letters (a–z).
 *   • Up to 3 * 10^4 calls in total in the regular tests. The performance
 *     test makes about 100,000 calls with 30,000 stored words.
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   Every operation in O(L) time, where L is the length of its argument,
 *   no matter how many words are stored. Keeping a plain list of words and
 *   scanning it on each startsWith() is O(total characters) per query, which
 *   the performance test rules out.
 */

// ▶ Run tests:   npm run solve implement-trie
// ⟳ Watch mode:  npm run watch implement-trie

/**
 * A prefix tree over lowercase English words.
 */
export class Trie {
  /**
   * Creates an empty trie.
   */
  constructor() {
    // Your code here
  }

  /**
   * Adds a word to the trie (no effect if it is already present).
   *
   * @param {string} word - Lowercase word to insert.
   * @returns {void}
   */
  insert(word) {
    // Your code here
  }

  /**
   * Checks whether a complete word was inserted.
   *
   * @param {string} word - Lowercase word to look up.
   * @returns {boolean} `true` if `word` itself was inserted (not merely a longer word starting with it).
   */
  search(word) {
    // Your code here
  }

  /**
   * Checks whether any inserted word starts with the given prefix.
   *
   * @param {string} prefix - Lowercase prefix to look up.
   * @returns {boolean} `true` if at least one inserted word begins with `prefix` (including the word equal to it).
   */
  startsWith(prefix) {
    // Your code here
  }
}
