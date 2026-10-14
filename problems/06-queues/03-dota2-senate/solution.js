/*
 * Title:      Dota2 Senate
 * Difficulty: Medium
 * Patterns:   Queue, Greedy, Simulation
 *
 * Solution — Dota2 Senate
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * Announcing victory early is never wrong, so the only real decision is
 * WHOM to ban. Banning someone from your own party only hurts you. Among
 * the opponents, the dangerous one is the one who will act soonest after
 * you, because they're about to ban one of yours. Opponents who act later
 * can be dealt with later, possibly by a teammate who acts before them. So
 * the greedy rule is: ban the next opposing senator in circular turn order.
 *
 * With that rule, the game reduces to a duel between the fronts of two
 * queues. Line the Radiant senators up in turn order, and the Dire ones
 * too. Whoever of the two fronts comes first acts, and bans the other
 * front (it's exactly the next opponent in line). The winner then goes to
 * the back of its own queue for the next round.
 *
 * Approach (two queues of indices)
 * ────────────────────────────────
 *   1. radiant = indices of 'R', dire = indices of 'D' (each ascending).
 *   2. While both queues are non-empty:
 *        r = radiant.dequeue(), d = dire.dequeue()
 *        if r < d: radiant.enqueue(r + n)   // R acts first, d is banned
 *        else:     dire.enqueue(d + n)      // D acts first, r is banned
 *      Adding n puts the survivor behind everyone who still has to act in
 *      the current round, which matches the round order exactly.
 *   3. The non-empty queue's party wins.
 *
 * Walkthrough — "DDRRR" (n = 5)
 * ───────────
 *   radiant [2, 3, 4]       dire [0, 1]
 *   r=2 d=0 → D wins   radiant [3, 4]   dire [1, 5]
 *   r=3 d=1 → D wins   radiant [4]      dire [5, 6]
 *   r=4 d=5 → R wins   radiant [9]      dire [6]
 *   r=9 d=6 → D wins   radiant []       dire [11]
 *   → "Dire"
 *
 * Complexity
 * ──────────
 *   Time:  O(n). Each loop iteration permanently removes one senator, so
 *          there are at most n - 1 iterations, each O(1).
 *   Space: O(n) for the two queues.
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Literal simulation (for each active senator, scan forward for the
 *     next opponent and mark them banned) is correct but O(n²) on inputs
 *     like "RRR…DDD".
 *   • "Pending bans" counting: sweep the string repeatedly, keeping a count
 *     of bans each party still owes. Skip a senator if their party has a
 *     pending ban against it, otherwise keep them and add a ban for the
 *     other party. Also fast, but trickier to get right across rounds.
 *   • Counting votes is wrong. Order beats numbers ("DDRRR" → Dire).
 *   • Using `shift()` on JS arrays makes each dequeue O(n). Use head
 *     indices, as below. The arrays only grow by at most n entries in total.
 */

/**
 * @param {string} senate
 * @returns {string}
 */
export function predictPartyVictory(senate) {
  const n = senate.length;
  const radiant = [];
  const dire = [];
  for (let i = 0; i < n; i++) {
    if (senate[i] === 'R') radiant.push(i);
    else dire.push(i);
  }

  // Head indices instead of shift(): dequeue is O(1).
  let rHead = 0;
  let dHead = 0;
  while (rHead < radiant.length && dHead < dire.length) {
    const r = radiant[rHead++];
    const d = dire[dHead++];
    // The earlier senator bans the other and comes back next round.
    if (r < d) radiant.push(r + n);
    else dire.push(d + n);
  }

  return rHead < radiant.length ? 'Radiant' : 'Dire';
}
