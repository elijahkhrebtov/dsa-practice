/*
 * Title:      Dota2 Senate
 * Difficulty: Medium
 * Patterns:   Queue, Greedy, Simulation
 *
 * ─── Problem ──────────────────────────────────────────────────────────────
 *
 * The senate of the Dota2 world has two parties: Radiant and Dire. You are
 * given a string `senate` where `senate[i]` is 'R' (Radiant) or 'D' (Dire)
 * and describes the i-th senator.
 *
 * Voting happens in rounds. In each round the senators act one at a time,
 * in their original order (index 0 first). A senator who has lost their
 * rights is skipped, both in the current round and in all later rounds.
 * When it's a senator's turn, they do exactly one of the following:
 *
 *   • Ban: take away the rights of one other senator (who then never acts
 *     again).
 *   • Announce victory: if every senator who still has rights belongs to
 *     the same party, that party wins and voting ends.
 *
 * Every senator is smart and plays the best possible strategy for their
 * own party. Predict which party wins. Return the string "Radiant" or
 * "Dire".
 *
 * ─── Examples ─────────────────────────────────────────────────────────────
 *
 *   Example 1
 *     Input:  senate = "RD"
 *     Output: "Radiant"
 *     Why:    Senator 0 (R) acts first and bans senator 1 (D). In round 2,
 *             senator 0 is the only one left and announces victory.
 *
 *   Example 2
 *     Input:  senate = "RDD"
 *     Output: "Dire"
 *     Why:    Senator 0 (R) bans senator 1. Senator 1 is skipped. Senator 2
 *             (D) bans senator 0. Senator 2 is the only one left: Dire.
 *
 *   Example 3
 *     Input:  senate = "DDRRR"
 *     Output: "Dire"
 *     Why:    Being earlier in the order matters more than numbers. Both D
 *             senators act before any R and ban the next two R senators.
 *             The last R bans one D, and the remaining D bans it next round.
 *
 * ─── Constraints ──────────────────────────────────────────────────────────
 *
 *   • 1 <= senate.length <= 10^4 in the original problem. The performance
 *     test uses 80,000 senators.
 *   • senate[i] is 'R' or 'D'.
 *
 * ─── Goal ─────────────────────────────────────────────────────────────────
 *
 *   O(n) time. Simulating the bans by scanning the string for the next
 *   victim each time is O(n²) in the worst case, and the performance test
 *   is built to expose that.
 */

// ▶ Run tests:   npm run solve dota2-senate
// ⟳ Watch mode:  npm run watch dota2-senate

/**
 * Predicts which party wins the senate vote when every senator plays optimally.
 *
 * @param {string} senate - The senators in voting order: 'R' for Radiant, 'D' for Dire.
 * @returns {string} "Radiant" or "Dire".
 */
export function predictPartyVictory(senate) {
  // Your code here
}
