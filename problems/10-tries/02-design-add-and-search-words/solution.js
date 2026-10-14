/*
 * Title:      Design Add and Search Words Data Structure
 * Difficulty: Medium
 * Patterns:   Trie, Recursion
 *
 * Solution — Design Add and Search Words Data Structure
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * A trie answers "is this exact word stored?" by following one child per
 * letter, ignoring every word that diverged earlier. That's why lookups
 * don't slow down as the dictionary grows. A '.' simply means "I don't
 * care which child". At that position we must try every child, and the
 * pattern still constrains everything after it. Trying several branches
 * and succeeding if ANY works is a DFS (backtracking) over the trie, guided
 * by the pattern.
 *
 * Approach
 * ────────
 *   addWord: standard trie insert, then mark isEnd on the last node.
 *
 *   search(pattern) = match(root, 0), where match(node, i):
 *     1. If i === pattern.length → return node.isEnd   (whole-word match)
 *     2. ch = pattern[i]
 *        • ch is a letter → child = node.children.get(ch);
 *                           return child ? match(child, i + 1) : false
 *        • ch is '.'      → for each child: if match(child, i + 1) return true
 *                           return false
 *
 * Walkthrough — words bad, dad, mad; search ".ad"
 * ───────────
 *   match(root, 0): '.' → try children b, d, m (in insertion order)
 *     match(b, 1): 'a' → child a exists
 *       match(ba, 2): 'd' → child d exists
 *         match(bad, 3): end of pattern, isEnd = true → true
 *   → true (d and m are never explored)
 *
 *   search "b.": match(b, 1) '.' → child a → match(ba, 2): end of
 *   pattern, but "ba" is not a word (isEnd false) → false.
 *
 * Complexity
 * ──────────
 *   addWord: O(L) time and at most L new nodes.
 *   search:  O(L) without dots. With d dots the DFS can branch up to 26
 *            ways at each dot: O(26^d · L) in the worst case, and much less
 *            in practice because only existing children are explored. The
 *            cost never depends on how many words are stored.
 *   Space:   O(total characters) for the trie. Recursion depth ≤ L.
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Scan every word (or build a RegExp per query): O(words · L) per
 *     search. Simple, but too slow with tens of thousands of words.
 *   • Bucket words by length, then scan the bucket: helps only when lengths
 *     vary, and doesn't help at all when every word has the same length.
 *   • Returning `true` when the walk merely reaches a node at the end of the
 *     pattern makes "ba" match "bad". Check isEnd.
 *   • Not stopping after the first successful branch is still correct but
 *     wastes work. Return as soon as any child succeeds.
 *   • Array-of-26 children work too. Iterating them for '.' means checking
 *     26 slots even when most are empty, while a Map only visits real
 *     children.
 */

class TrieNode {
  constructor() {
    /** @type {Map<string, TrieNode>} */
    this.children = new Map();
    this.isEnd = false;
  }
}

export class WordDictionary {
  constructor() {
    this.root = new TrieNode();
  }

  /** @param {string} word */
  addWord(word) {
    let node = this.root;
    for (const ch of word) {
      let next = node.children.get(ch);
      if (!next) {
        next = new TrieNode();
        node.children.set(ch, next);
      }
      node = next;
    }
    node.isEnd = true;
  }

  /**
   * @param {string} pattern
   * @returns {boolean}
   */
  search(pattern) {
    /**
     * Can pattern[i..] be matched starting at `node`?
     * @param {TrieNode} node
     * @param {number} i
     * @returns {boolean}
     */
    const match = (node, i) => {
      if (i === pattern.length) return node.isEnd; // whole pattern consumed: a word must end here
      const ch = pattern[i];
      if (ch === '.') {
        for (const child of node.children.values()) {
          if (match(child, i + 1)) return true; // first success is enough
        }
        return false;
      }
      const child = node.children.get(ch);
      return child !== undefined && match(child, i + 1);
    };

    return match(this.root, 0);
  }
}
