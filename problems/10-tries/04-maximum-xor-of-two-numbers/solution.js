/*
 * Title:      Maximum XOR of Two Numbers in an Array
 * Difficulty: Medium
 * Patterns:   Trie, Bit Manipulation
 *
 * Solution — Maximum XOR of Two Numbers in an Array
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * Numbers compare by their highest differing bit, so a 1 at bit k is worth
 * more than all bits below k combined (2^k > 2^k − 1). That makes a greedy
 * choice safe. To maximise x XOR y, first make bit 30 of the result 1 if
 * any y allows it, then bit 29 among those candidates, and so on.
 *
 * "Among the numbers that agree with my choices so far, is there one with
 * bit b equal to 0 / to 1?" is a prefix question about binary strings. A
 * trie over the bits (most significant first) answers it in O(1) per bit:
 * just check whether the child exists.
 *
 * Approach (binary trie, 31 levels)
 * ─────────────────────────────────
 *   1. Insert every number: for b = 30 … 0, bit = (x >> b) & 1, and
 *      descend into children[bit], creating it if missing.
 *   2. For every number x, walk from the root:
 *        want = 1 − bit
 *        if children[want] exists → go there, result |= (1 << b)
 *        else                     → go to children[bit] (it must exist,
 *                                   since x's own path is in the trie)
 *   3. Return the maximum result over all x.
 *
 * Walkthrough — nums = [3, 10, 5, 25, 2, 8], looking at the low 5 bits
 * ───────────
 *   3 = 00011   10 = 01010   5 = 00101   25 = 11001   2 = 00010   8 = 01000
 *   Query x = 5 (00101):
 *     bit4: x has 0, want 1 → 25 has it         result = 10000
 *     bit3: x has 0, want 1 → 25 has 1          result = 11000
 *     bit2: x has 1, want 0 → 25 has 0          result = 11100
 *     bit1: x has 0, want 1 → only 25 left, it has 0 → follow 0
 *     bit0: x has 1, want 0 → 25 has 1 → follow 1
 *     result = 11100 = 28, partner 25
 *   (The 26 higher bits are all 0 for every number, so every query just
 *   follows the 0 child there.)
 *
 * Complexity
 * ──────────
 *   Time:  O(31 · n): every insert and every query is exactly 31 steps.
 *   Space: O(31 · n) trie nodes in the worst case. In practice the top
 *          levels are shared, so it's fewer.
 *
 * Alternatives & pitfalls
 * ────────��──────────────
 *   • Brute force over all pairs: O(n²), billions of operations at n = 10^5.
 *   • Prefix-set greedy (no trie): build the answer bit by bit. For each b,
 *     put every (x & mask) into a Set and test whether some prefix p has
 *     p ^ candidate in the Set too (because a ^ b = c ⇔ a ^ c = b). Also
 *     O(31 · n), and less memory.
 *   • Bit order matters: insert most-significant first. Walking from bit 0
 *     upward optimises the least important bits first, which is wrong.
 *   • JS bitwise ops are signed 32-bit. Here every bit we touch is ≤ 30, so
 *     `1 << b` and `|=` stay positive. For full 32-bit inputs you'd need
 *     `>>> 0` to read the result as unsigned.
 *   • Starting the walk at bit 31 is harmless (every number has a 0 there),
 *     but `1 << 31` would be negative if you ever set it.
 */

/**
 * @param {number[]} nums
 * @returns {number}
 */
export function findMaximumXOR(nums) {
  const HIGH_BIT = 30; // nums[i] < 2^31 → bits 30..0
  /** each node is a 2-slot array: [child for bit 0, child for bit 1] */
  const root = [null, null];

  // 1. Insert every number, most significant bit first.
  for (const x of nums) {
    let node = root;
    for (let b = HIGH_BIT; b >= 0; b--) {
      const bit = (x >> b) & 1;
      if (node[bit] === null) node[bit] = [null, null];
      node = node[bit];
    }
  }

  // 2. For every number, greedily walk toward the opposite bit.
  let best = 0;
  for (const x of nums) {
    let node = root;
    let result = 0;
    for (let b = HIGH_BIT; b >= 0; b--) {
      const bit = (x >> b) & 1;
      const want = bit ^ 1;
      if (node[want] !== null) {
        result |= 1 << b; // this bit of x XOR partner will be 1
        node = node[want];
      } else {
        node = node[bit]; // forced: no number differs here (x's own path exists)
      }
    }
    if (result > best) best = result;
  }
  return best;
}
