/*
 * Title:      Word Ladder
 * Difficulty: Hard
 * Patterns:   Graph BFS
 *
 * Solution — Word Ladder
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * Words are nodes; two words are joined by an edge when they differ in
 * exactly one position. "Fewest words in a sequence" is a shortest path in
 * an unweighted graph, so BFS is the tool: it visits words in order of
 * distance from beginWord, and the first time it reaches endWord that
 * distance is minimal.
 *
 * The graph is never given explicitly, and building it by comparing every
 * pair of words costs O(N² · L). The trick is to find a word's neighbours
 * from the word itself:
 *
 *   Wildcard buckets. Replace each position by '*': "hot" belongs to the
 *   buckets "*ot", "h*t" and "ho*". Two words are neighbours exactly when
 *   they share a bucket. Group all words by bucket once (N · L patterns);
 *   afterwards a word's neighbours are just the union of its L buckets.
 *
 *   (Equivalent alternative: for each position try all 26 letters and look
 *   the result up in a Set. Same idea, 26× more lookups.)
 *
 * Bidirectional BFS. The number of words at distance d tends to grow
 * quickly with d. Searching from both ends and meeting in the middle means
 * each side only explores to about half the depth — often a huge saving.
 * Always expand the SMALLER frontier to keep the work balanced.
 *
 * Approach (bidirectional BFS over wildcard buckets)
 * ──────────────────────────────────────────────────
 *   1. If endWord is not in wordList → return 0.
 *   2. Build buckets: Map pattern → list of words.
 *   3. front = {beginWord}, back = {endWord}, seen = {beginWord, endWord},
 *      words = 1 (number of words on the path covered so far, not counting
 *      the edge where the two searches will meet).
 *   4. While both frontiers are non-empty:
 *        a. If front is bigger than back, swap them.
 *        b. For every word in front and every pattern of it, look at each
 *           word nb in that bucket:
 *             – nb in back → the searches meet: return words + 1.
 *             – nb not seen → mark seen, add to the next frontier.
 *        c. front = next frontier, words++.
 *   5. A frontier ran dry → the ends are not connected → return 0.
 *
 * One-directional version: the same loop with only `front`, checking
 * nb === endWord instead of back.has(nb). You can also delete a bucket after
 * using it once — every word in it has been seen at that point.
 *
 * Walkthrough — hit → cog, [hot, dot, dog, lot, log, cog]
 * ───────────
 *   buckets: *ot:[hot,dot,lot]  h*t:[hot]  ho*:[hot]  d*t:[dot]  do*:[dot,dog]
 *            *og:[dog,log,cog]  d*g:[dog]  l*t:[lot]  lo*:[lot,log]  l*g:[log]
 *            c*g:[cog]  co*:[cog]
 *   front {hit}, back {cog}, words 1
 *   expand front {hit}: *it → none, h*t → hot, hi* → none
 *     → front {hot}, words 2
 *   sizes equal, expand front {hot}: *ot → dot, lot   → front {dot, lot}, words 3
 *   back is smaller, swap; expand {cog}: *og → dog, log; c*g, co* → nothing new
 *     → front {dog, log}, words 4   (back is now {dot, lot})
 *   expand {dog, log} (equal sizes, no swap): dog's bucket do* holds dot,
 *     which is in back → met! return 4 + 1 = 5
 *     (hit → hot → dot → dog → cog)
 *
 * Complexity
 * ──────────
 *   N words of length L.
 *   Time:  O(N · L²) — building N · L patterns of length L; during the BFS
 *          each word is expanded at most once, generating L patterns. (The
 *          words inside a bucket can be rescanned by several words on the
 *          same frontier; with the one-directional "delete the bucket after
 *          use" trick each bucket is scanned only once.)
 *   Space: O(N · L²) for the bucket map (N · L keys of length L).
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Pairwise comparison (for each dequeued word, scan the whole list for
 *     words one letter apart): O(N² · L). Simple, but quadratic.
 *   • Try-all-26-letters with a Set: O(N · 26 · L²), no preprocessing,
 *     great when the alphabet is small or the list is huge.
 *   • Mark words as visited when ENQUEUED, not when dequeued, or the same
 *     word can be queued many times on one level.
 *   • The answer counts WORDS (steps + 1). Returning the number of edges
 *     is the classic off-by-one.
 *   • Check that endWord is in the list — beginWord need not be, endWord
 *     must be.
 *   • DFS doesn't give shortest paths without exploring everything.
 */

/**
 * @param {string} beginWord
 * @param {string} endWord
 * @param {string[]} wordList
 * @returns {number}
 */
export function ladderLength(beginWord, endWord, wordList) {
  if (!wordList.includes(endWord)) return 0;
  const L = beginWord.length;

  // pattern ("h*t") → words matching it
  const buckets = new Map();
  for (const word of new Set(wordList)) {
    for (let i = 0; i < L; i++) {
      const pattern = word.slice(0, i) + '*' + word.slice(i + 1);
      const bucket = buckets.get(pattern);
      if (bucket) bucket.push(word);
      else buckets.set(pattern, [word]);
    }
  }

  let front = new Set([beginWord]); // frontier grown from the start
  let back = new Set([endWord]); // frontier grown from the end
  const seen = new Set([beginWord, endWord]);
  let words = 1; // words on the path so far, excluding the final meeting edge

  while (front.size > 0 && back.size > 0) {
    // Expand the smaller side — direction doesn't matter for the length.
    if (front.size > back.size) [front, back] = [back, front];

    const next = new Set();
    for (const word of front) {
      for (let i = 0; i < L; i++) {
        const bucket = buckets.get(word.slice(0, i) + '*' + word.slice(i + 1));
        if (!bucket) continue;
        for (const neighbour of bucket) {
          if (back.has(neighbour)) return words + 1; // the two searches meet
          if (!seen.has(neighbour)) {
            seen.add(neighbour); // mark on enqueue so it's added only once
            next.add(neighbour);
          }
        }
      }
    }

    front = next;
    words++;
  }

  return 0; // one side ran out of words: no ladder exists
}
