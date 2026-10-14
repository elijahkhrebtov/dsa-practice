/*
 * Title:      Implement Trie (Prefix Tree)
 * Difficulty: Medium
 * Patterns:   Trie, Design
 *
 * Solution — Implement Trie (Prefix Tree)
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * Store the words as paths in a tree: the root is the empty prefix, and
 * each edge appends one character. Words with a common prefix share the
 * nodes for it. To answer "does any word start with P?", walk P's letters
 * from the root: if the path exists, some inserted word went through it.
 * The cost depends only on |P|, not on how many words are stored.
 *
 * A path existing is NOT the same as a word ending there. Inserting
 * "apple" creates the nodes for "a", "ap", "app", … but "app" isn't a word.
 * So each node carries an `isEnd` flag, set only on the node where an
 * inserted word finishes.
 *
 * Approach
 * ────────
 *   Node = { children: Map<char, Node>, isEnd: boolean }
 *
 *   insert(word):      node = root; for each ch: create child if missing,
 *                      descend. Finally node.isEnd = true.
 *   walk(s):           node = root; for each ch: descend or return null.
 *                      Return the node reached.
 *   search(word):      n = walk(word); return n !== null && n.isEnd
 *   startsWith(pre):   return walk(pre) !== null
 *
 * Walkthrough — insert "apple", search "app", startsWith "app", insert "app"
 * ───────────
 *   insert apple:  root → a → p → p → l → e(isEnd)
 *   search app:    walk reaches the second p; isEnd = false → false
 *   startsWith app: the node exists → true
 *   insert app:    the path already exists; set isEnd on the second p
 *   search app:    now true
 *
 * Complexity
 * ──────────
 *   Time:  O(L) for every operation (L = length of the argument), with O(1)
 *          Map operations per character.
 *   Space: O(total characters inserted) nodes in the worst case (no shared
 *          prefixes). Each call uses O(1) extra space.
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Array of 26 children (`new Array(26)` or `Array(26).fill(null)`,
 *     indexed by `ch.charCodeAt(0) - 97`) is often faster than a Map for
 *     lowercase input and keeps children in alphabetical order. It costs 26
 *     slots per node, even for leaves.
 *   • Plain-object children work, but inherited keys can surprise you.
 *     Prefer `Object.create(null)` or a Map.
 *   • A `Set` of words handles search in O(L), but startsWith would need
 *     a scan of every word, unless you also add every prefix of every word
 *     to a second Set (O(L²) time and memory per insert).
 *   • Forgetting the isEnd flag makes search("app") true after inserting
 *     only "apple". That's the most common bug.
 *   • Walking with `for (const ch of word)` iterates code points, which is
 *     fine here (ASCII only).
 */

class TrieNode {
  constructor() {
    /** @type {Map<string, TrieNode>} */
    this.children = new Map();
    /** true if an inserted word ends exactly at this node */
    this.isEnd = false;
  }
}

export class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  /** @param {string} word */
  insert(word) {
    let node = this.root;
    for (const ch of word) {
      let next = node.children.get(ch);
      if (!next) {
        next = new TrieNode();
        node.children.set(ch, next);
      }
      node = next;
    }
    node.isEnd = true; // mark the end of the word (the path alone only means "prefix")
  }

  /**
   * Follows `s` from the root; returns the node reached or null if the path breaks.
   * @param {string} s
   * @returns {TrieNode | null}
   */
  walk(s) {
    let node = this.root;
    for (const ch of s) {
      node = node.children.get(ch);
      if (!node) return null;
    }
    return node;
  }

  /**
   * @param {string} word
   * @returns {boolean}
   */
  search(word) {
    const node = this.walk(word);
    return node !== null && node.isEnd; // the path must exist AND a word must end here
  }

  /**
   * @param {string} prefix
   * @returns {boolean}
   */
  startsWith(prefix) {
    return this.walk(prefix) !== null; // any path means some word passes through
  }
}
