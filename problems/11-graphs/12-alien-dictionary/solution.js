/*
 * Title:      Alien Dictionary
 * Difficulty: Hard
 * Patterns:   Topological Sort
 *
 * Solution — Alien Dictionary
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * A sorted dictionary leaks information only where two ADJACENT words first
 * differ: in "wrt" < "wrf", the first difference is t vs f, so t comes
 * before f. Everything after that position is irrelevant, and comparing
 * non-adjacent words adds nothing new (their rule follows from the chain of
 * adjacent rules, by transitivity).
 *
 * Each rule "x before y" is a directed edge x → y between letters. An
 * alphabet consistent with all rules is an ordering where every edge points
 * forward — a topological order — which exists exactly when the rule graph
 * has no cycle.
 *
 * One more way to be invalid: if two adjacent words have no differing
 * position, the shorter one must come first. "abc" followed by "ab" can't
 * be fixed by any alphabet.
 *
 * Approach (collect rules, then Kahn's algorithm)
 * ───────────────────────────────────────────────
 *   1. Create a node for every letter that appears anywhere (in-degree 0,
 *      empty successor set). Letters that never get a rule still need to be
 *      in the output.
 *   2. For each adjacent pair (a, b):
 *        – find the first i with a[i] ≠ b[i];
 *        – if found and a[i] → b[i] is a new edge, add it and increment
 *          inDegree[b[i]];
 *        – if not found and a.length > b.length, return "" (prefix rule).
 *   3. Kahn: queue every letter with in-degree 0. Pop a letter, append it
 *      to the answer, decrement the in-degree of each successor, and queue
 *      any successor that drops to 0.
 *   4. If the answer has every letter, return it. If not, the remaining
 *      letters all sit on or behind a cycle → return "".
 *
 * Walkthrough — ["wrt", "wrf", "er", "ett", "rftt"]
 * ───────────
 *   letters: w r t f e
 *   wrt / wrf  → first diff at 2: t → f
 *   wrf / er   → first diff at 0: w → e
 *   er  / ett  → first diff at 1: r → t
 *   ett / rftt → first diff at 0: e → r
 *   in-degrees: w0 r1 t1 f1 e1     queue [w]
 *   pop w → "w",   e drops to 0    queue [e]
 *   pop e → "we",  r drops to 0    queue [r]
 *   pop r → "wer", t drops to 0    queue [t]
 *   pop t → "wert", f drops to 0   queue [f]
 *   pop f → "wertf" — all 5 letters placed → answer "wertf".
 *
 * Complexity
 * ──────────
 *   C = total number of characters in all words, U = distinct letters
 *   (≤ 26), R = distinct rules (≤ 26·25).
 *   Time:  O(C) to register letters and compare adjacent pairs (each
 *          comparison stops at the shorter word), plus O(U + R) for Kahn.
 *   Space: O(U + R) — constant, since both are bounded by the alphabet.
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • DFS topological sort with three colours (unvisited / in progress /
 *     done): seeing an "in progress" letter again means a cycle; output
 *     letters in reverse post-order. Works just as well — recursion depth
 *     is at most 26.
 *   • Only the FIRST difference counts. Adding rules for later positions
 *     (e.g. from "ab" < "ba" also deriving b < a) invents cycles.
 *   • Duplicate rules: if you store successors in a Set but increment the
 *     in-degree every time, a repeated rule leaves its target stuck at a
 *     non-zero in-degree. Increment only when the edge is new (or use
 *     lists and decrement once per stored copy).
 *   • Forgetting letters that never appear in a rule (they must still be
 *     in the output), or forgetting the prefix check (["abc", "ab"]).
 *   • Brute force over all permutations of the letters is up to 26! —
 *     hopeless.
 */

/**
 * @param {string[]} words
 * @returns {string}
 */
export function alienOrder(words) {
  // 1. A node for every letter that appears anywhere.
  /** @type {Map<string, Set<string>>} letter → letters that must come after it */
  const next = new Map();
  /** @type {Map<string, number>} letter → number of letters that must come before it */
  const inDegree = new Map();
  for (const word of words) {
    for (const ch of word) {
      if (!next.has(ch)) {
        next.set(ch, new Set());
        inDegree.set(ch, 0);
      }
    }
  }

  // 2. One rule (at most) from each adjacent pair.
  for (let w = 0; w + 1 < words.length; w++) {
    const a = words[w];
    const b = words[w + 1];
    const len = Math.min(a.length, b.length);
    let i = 0;
    while (i < len && a[i] === b[i]) i++;

    if (i === len) {
      // No differing letter: the shorter word must come first.
      if (a.length > b.length) return '';
      continue;
    }

    const before = a[i];
    const after = b[i];
    if (!next.get(before).has(after)) {
      // Count each distinct rule exactly once.
      next.get(before).add(after);
      inDegree.set(after, inDegree.get(after) + 1);
    }
  }

  // 3. Kahn's algorithm: repeatedly output a letter nothing else must precede.
  const queue = [];
  for (const [ch, deg] of inDegree) if (deg === 0) queue.push(ch);

  let order = '';
  for (let head = 0; head < queue.length; head++) {
    const ch = queue[head];
    order += ch;
    for (const succ of next.get(ch)) {
      const deg = inDegree.get(succ) - 1;
      inDegree.set(succ, deg);
      if (deg === 0) queue.push(succ);
    }
  }

  // 4. Letters left over are stuck on a cycle.
  return order.length === next.size ? order : '';
}
