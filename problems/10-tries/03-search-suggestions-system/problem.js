/*
 * Title:      Search Suggestions System
 * Difficulty: Medium
 * Patterns:   Trie, Sorting
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * You're building the autocomplete box of a shop. You're given an array of
 * distinct product names `products` and the word `searchWord` that a
 * customer types one character at a time.
 *
 * After each typed character, the box shows up to THREE product names that
 * start with the text typed so far. If more than three products match,
 * show the three that come first in lexicographic (dictionary) order.
 *
 * Return an array with one entry per typed character: entry i is the list
 * of suggestions for the prefix `searchWord.slice(0, i + 1)`.
 *
 *   • Each list is sorted in lexicographic order and holds at most 3 names.
 *   • A list is empty (`[]`) when no product starts with that prefix.
 *   • A product equal to the prefix counts as a match ("mouse" matches the
 *     prefix "mouse"), and a word sorts before every longer word that starts
 *     with it ("mouse" < "mousepad").
 *   • `products` is not sorted. Do not modify it.
 *
 * Lexicographic order here is plain JavaScript string comparison (`<`),
 * which for lowercase letters is dictionary order.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  products = ["mobile", "mouse", "moneypot", "monitor", "mousepad"],
 *             searchWord = "mouse"
 *     Output: [["mobile", "moneypot", "monitor"],
 *              ["mobile", "moneypot", "monitor"],
 *              ["mouse", "mousepad"],
 *              ["mouse", "mousepad"],
 *              ["mouse", "mousepad"]]
 *     Why:    Sorted, the products are mobile, moneypot, monitor, mouse,
 *             mousepad. All five start with "m" and "mo", and the first
 *             three are shown. Only mouse and mousepad start with "mou".
 *
 *   Example 2
 *     Input:  products = ["havana"], searchWord = "havana"
 *     Output: [["havana"], ["havana"], ["havana"], ["havana"], ["havana"], ["havana"]]
 *
 *   Example 3
 *     Input:  products = ["bags", "baggage", "banner", "box", "cloths"], searchWord = "bags"
 *     Output: [["baggage", "bags", "banner"], ["baggage", "bags", "banner"],
 *              ["baggage", "bags"], ["bags"]]
 *
 *   Example 4
 *     Input:  products = ["havana"], searchWord = "tatiana"
 *     Output: [[], [], [], [], [], [], []]
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 1 <= products.length <= 3 * 10^4, all names distinct
 *   • 1 <= products[i].length <= 500
 *   • 1 <= searchWord.length <= 500
 *   • All strings consist of lowercase English letters only.
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   Sort once, O(n log n) comparisons, then answer each prefix without
 *   rescanning every product: walk a trie whose nodes keep their 3 best
 *   words, or binary-search the sorted array. Filtering and sorting all
 *   matching products again for every prefix costs O(L · n log n). The
 *   performance test (25,000 products, a 400-letter search word) makes that
 *   take several seconds.
 */

// ▶ Run tests:   npm run solve search-suggestions-system
// ⟳ Watch mode:  npm run watch search-suggestions-system

/**
 * Returns up to three lexicographically smallest product suggestions for every prefix of `searchWord`.
 *
 * @param {string[]} products - Distinct lowercase product names, in any order (do not modify).
 * @param {string} searchWord - The word being typed, one character at a time.
 * @returns {string[][]} `result[i]` = up to 3 products starting with `searchWord.slice(0, i + 1)`, sorted lexicographically.
 */
export function suggestedProducts(products, searchWord) {
  // Your code here
}
