/*
 * Title:      Search Suggestions System
 * Difficulty: Medium
 * Patterns:   Trie, Sorting
 *
 * Solution — Search Suggestions System
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * Every prefix of `searchWord` is a node on ONE path in a trie of the
 * products. The words below a node are exactly the products with that
 * prefix. So if each node already knew its 3 lexicographically smallest
 * words, answering would just mean walking the path and reading the lists.
 *
 * How does a node learn its 3 smallest words cheaply? Insert the products
 * in sorted order. The first three words that pass through a node are then
 * its three smallest, and every later word can be ignored at that node.
 *
 * Approach
 * ────────
 *   1. sorted = copy of products, sorted lexicographically (don't touch the
 *      input).
 *   2. Build a trie. For each word in sorted order, walk/create its path.
 *      At every node on the path, push the word into node.suggestions if
 *      the list has fewer than 3 entries.
 *   3. Walk searchWord from the root. For each character:
 *        • if the path continues, push a copy of the node's suggestions;
 *        • otherwise push [] (and keep pushing [] for the rest — once a
 *          prefix has no matches, no longer prefix can).
 *
 * Walkthrough — products [mobile, mouse, moneypot, monitor, mousepad], "mouse"
 * ───────────
 *   sorted: mobile, moneypot, monitor, mouse, mousepad
 *   node "m":   mobile, moneypot, monitor   (mouse/mousepad arrive when full)
 *   node "mo":  mobile, moneypot, monitor
 *   node "mou": mouse, mousepad
 *   "mous", "mouse": mouse, mousepad
 *   Walk m, o, u, s, e → read those five lists.
 *
 * Complexity
 * ──────────
 *   Let n = number of products, S = total characters, L = |searchWord|.
 *   Time:  O(S log n) for sorting (comparisons cost up to a word's length),
 *          O(S) to build the trie, O(L) to answer.
 *   Space: O(S) trie nodes, each with a list of at most 3 references.
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Sort + binary search: sort once. For each prefix, a lower-bound
 *     binary search finds the first word >= prefix. Take up to 3 words from
 *     there that still start with the prefix. O(S log n + L · log n · L),
 *     with no trie memory. It's often the fastest in practice.
 *   • Sort + shrinking window: keep lo/hi pointers into the sorted array
 *     and advance them as each new character rules words out. Simple and
 *     O(n · L) in the worst case.
 *   • Trie without stored suggestions: at each prefix node, DFS children
 *     in alphabetical order until 3 words are found. Fine with an
 *     array-of-26 trie, whose order is alphabetical. With a Map trie you
 *     would have to sort the child keys.
 *   • Per prefix, filter all products and sort the matches: O(L · n log n),
 *     several seconds on the performance test.
 *   • Sorting `products` in place mutates the caller's array. Copy first.
 *   • Don't stop the output early when matches run out. The result must have
 *     exactly L entries.
 *   • `.sort()` without a comparator is right for lowercase strings. A
 *     numeric comparator like `(a, b) => a - b` returns NaN for strings and
 *     gives garbage.
 */

/**
 * @param {string[]} products
 * @param {string} searchWord
 * @returns {string[][]}
 */
export function suggestedProducts(products, searchWord) {
  const sorted = [...products].sort(); // copy: never mutate the caller's array

  // Build the trie; each node keeps the first (= smallest) 3 words that pass through it.
  const root = { children: new Map(), suggestions: [] };
  for (const word of sorted) {
    let node = root;
    for (const ch of word) {
      let next = node.children.get(ch);
      if (!next) {
        next = { children: new Map(), suggestions: [] };
        node.children.set(ch, next);
      }
      node = next;
      if (node.suggestions.length < 3) node.suggestions.push(word);
    }
  }

  // Walk the search word; once the path breaks, every remaining prefix has no matches.
  const result = [];
  let node = root;
  for (const ch of searchWord) {
    node = node ? node.children.get(ch) : undefined;
    result.push(node ? [...node.suggestions] : []);
  }
  return result;
}
