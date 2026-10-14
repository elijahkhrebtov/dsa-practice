/*
 * Title:      Group Anagrams
 * Difficulty: Medium
 * Patterns:   Hash Map, Sorting
 *
 * Solution — Group Anagrams
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * Two strings are anagrams exactly when they have the same letters with
 * the same counts. So give every string a CANONICAL KEY that only depends
 * on that multiset of letters, the same key for all anagrams and different
 * keys otherwise. Then grouping is just "bucket the strings by key" with a
 * hash map: key → list of strings. Here we deliberately want equivalent
 * items to collide.
 *
 * The simplest key: the string's letters sorted, so "eat", "tea" and "ate"
 * all become "aet".
 *
 * Approach
 * ────────
 *   1. groups = new Map()   (key → array of original strings)
 *   2. For each string s:
 *        key = letters of s sorted and joined
 *        append s to groups[key] (creating the array the first time)
 *   3. Return the map's values as an array.
 *
 * Walkthrough — ["eat", "tea", "tan", "ate", "nat", "bat"]
 * ───────────
 *   "eat" → "aet"   { aet: [eat] }
 *   "tea" → "aet"   { aet: [eat, tea] }
 *   "tan" → "ant"   { aet: [eat, tea], ant: [tan] }
 *   "ate" → "aet"   { aet: [eat, tea, ate], ant: [tan] }
 *   "nat" → "ant"   { …, ant: [tan, nat] }
 *   "bat" → "abt"   { …, abt: [bat] }
 *   result: [[eat, tea, ate], [tan, nat], [bat]]
 *
 * Complexity
 * ──────────
 *   Time:  O(n · k log k) for n strings of length ≤ k (one sort per
 *          string). Map operations on a key of length k cost O(k).
 *   Space: O(n · k) for the keys and the groups.
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Letter-count key: count the 26 letters and use the counts as the key,
 *     e.g. counts.join(','). That's O(n · k) time, better for long
 *     strings. The separator matters: without it, 1×a + 11×b and 11×a + 1×b
 *     both become "111000…". Any composite key needs an unambiguous
 *     separator.
 *   • Brute force: compare each string with a representative of every group
 *     found so far: O(n² · k) in the worst case (all groups distinct).
 *   • Arrays can't be Map keys by value: map.get([1, 0, 2]) never finds an
 *     earlier [1, 0, 2], because arrays compare by reference. Convert to a
 *     string.
 *   • A plain object `{}` also works for string keys, but `Map` avoids
 *     prototype keys and keeps insertion order explicitly.
 *   • Don't push the KEY into the group. Push the original string.
 */

/**
 * @param {string[]} strs
 * @returns {string[][]}
 */
export function groupAnagrams(strs) {
  /** @type {Map<string, string[]>} canonical key → original strings */
  const groups = new Map();

  for (const s of strs) {
    const key = [...s].sort().join(''); // anagrams share the same sorted letters
    const group = groups.get(key);
    if (group) group.push(s);
    else groups.set(key, [s]);
  }

  return [...groups.values()];
}
