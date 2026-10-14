/*
 * Title:      Group Anagrams
 * Difficulty: Medium
 * Patterns:   Hash Map, Sorting
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * Given an array of strings `strs`, group the strings that are anagrams of
 * each other, i.e. that consist of exactly the same letters with the same
 * counts, possibly in a different order.
 *
 * Return an array of groups, where each group is an array of strings.
 *
 *   • Every input string appears in exactly one group. Duplicates in the
 *     input stay duplicates in the output (["a", "a"] → [["a", "a"]]).
 *   • The order of the groups, and the order of strings inside a group,
 *     do NOT matter.
 *   • Return [] for an empty input. Don't modify `strs`.
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  strs = ["eat", "tea", "tan", "ate", "nat", "bat"]
 *     Output: [["bat"], ["nat", "tan"], ["ate", "eat", "tea"]]
 *     Why:    "eat", "tea" and "ate" all use {a, e, t}. "tan" and "nat" use
 *             {a, n, t}. "bat" has no anagram partner.
 *
 *   Example 2
 *     Input:  strs = [""]
 *     Output: [[""]]
 *     Why:    the empty string forms a group of its own.
 *
 *   Example 3
 *     Input:  strs = ["a"]
 *     Output: [["a"]]
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 0 <= strs.length <= 10^4 (the performance test uses 50,000)
 *   • 0 <= strs[i].length <= 100
 *   • strs[i] consists of lowercase English letters.
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   O(n · k log k) by sorting each string's letters into a key, or
 *   O(n · k) with a letter-count key (n strings, maximum length k).
 *   Comparing each string with every existing group is O(n² · k), and
 *   the performance test (50,000 strings in 25,000 groups) will catch it.
 */

// ▶ Run tests:   npm run solve group-anagrams
// ⟳ Watch mode:  npm run watch group-anagrams

/**
 * Groups the strings that are anagrams of one another.
 *
 * @param {string[]} strs - Lowercase strings to group (not modified).
 * @returns {string[][]} The groups, in any order, each listing its strings in any order.
 */
export function groupAnagrams(strs) {
  // Your code here
}
