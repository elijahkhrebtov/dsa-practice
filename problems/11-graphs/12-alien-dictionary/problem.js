/*
 * Title:      Alien Dictionary
 * Difficulty: Hard
 * Patterns:   Topological Sort
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * An alien language uses lowercase English letters, but in an unknown
 * alphabetical order. You are given `words`, a list of words from the alien
 * dictionary that is claimed to be SORTED lexicographically by the alien
 * alphabet.
 *
 * Lexicographic order works as usual: compare two words letter by letter;
 * at the first position where they differ, the word with the earlier letter
 * comes first. If one word is a prefix of the other, the shorter word comes
 * first ("ab" < "abc").
 *
 * Return a string containing every letter that appears in `words`, each
 * exactly once, in an order consistent with the sorted list. If several
 * orders are consistent, return ANY of them. If no order is consistent
 * (the list cannot be sorted under any alphabet), return "".
 *
 *   • Only letters that appear somewhere in `words` belong in the answer —
 *     including letters that never take part in any comparison.
 *   • Equal adjacent words are fine.
 *   • The list is invalid when it implies a cycle (a before b … before a)
 *     or when a word is followed by its own proper prefix (["abc", "ab"]
 *     can never be sorted).
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  words = ["wrt", "wrf", "er", "ett", "rftt"]
 *     Output: "wertf"
 *     Why:    wrt/wrf → t before f; wrf/er → w before e; er/ett → r
 *             before t; ett/rftt → e before r. Together: w, e, r, t, f.
 *             (Here the order happens to be unique.)
 *
 *   Example 2
 *     Input:  words = ["z", "x", "z"]
 *     Output: ""
 *     Why:    z before x, and x before z — a contradiction.
 *
 *   Example 3
 *     Input:  words = ["abc", "ab"]
 *     Output: ""
 *     Why:    "ab" is a prefix of "abc", so it must come first.
 *
 *   Example 4
 *     Input:  words = ["ab", "adc"]
 *     Output: "abdc" (or "cabd", "bdac", … — any order with b before d)
 *     Why:    The only rule is b before d (first difference of ab/adc).
 *             Letters a and c are never compared, but they appear in the
 *             words, so they must be in the answer somewhere.
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 1 <= words.length <= 100
 *   • 1 <= words[i].length <= 100
 *   • words[i] consists of lowercase English letters.
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   O(C) time, where C is the total number of characters in all words:
 *   one pass over adjacent pairs to collect "x before y" rules, then a
 *   topological sort of at most 26 letters (O(26 + number of rules)).
 *   O(1) extra space beyond that (at most 26 nodes and 26·25 edges).
 */

// ▶ Run tests:   npm run solve alien-dictionary
// ⟳ Watch mode:  npm run watch alien-dictionary

/**
 * Recovers an alien alphabet order from a dictionary sorted in that order.
 *
 * @param {string[]} words - Words claimed to be sorted lexicographically by the alien alphabet.
 * @returns {string} Every letter that appears in `words` exactly once, in a consistent order — or "" if no order is consistent.
 */
export function alienOrder(words) {
  // Your code here
}
