/*
 * Title:      Range Sum Query - Mutable
 * Difficulty: Medium
 * Patterns:   Segment Tree, Design
 *
 * Solution — Range Sum Query - Mutable
 * ═════════════════════════════════════════════════════════════════════════
 *
 * Intuition
 * ─────────
 * The two obvious designs each make one operation slow:
 *   • plain array:       update O(1), sumRange O(n) (loop over the slice);
 *   • prefix-sum array:  sumRange O(1), update O(n) (every later prefix
 *                        changes).
 * The middle ground is to precompute sums of *blocks* arranged in a tree:
 * each element belongs to only O(log n) blocks (so an update touches
 * O(log n) sums), and any range can be glued together from O(log n) blocks
 * (so a query reads O(log n) sums). Both classic structures do exactly that:
 * the segment tree and the Fenwick (binary indexed) tree.
 *
 * Approach (iterative segment tree)
 * ─────────────────────────────────
 * Store the tree in one array `tree` of length 2n:
 *   • leaves: tree[n + i] = nums[i];
 *   • internal nodes: tree[i] = tree[2i] + tree[2i + 1] for i = n-1 … 1
 *     (node i's children are 2i and 2i + 1, its parent is i >> 1).
 *
 *   1. Build: copy the leaves, then fill internal nodes right-to-left. O(n).
 *   2. update(index, val): set the leaf p = index + n, then walk up to the
 *      root recomputing each parent from its two children. O(log n).
 *   3. sumRange(left, right): use a half-open window [l, r) over the leaf
 *      level, l = left + n, r = right + n + 1, and shrink it level by level:
 *        • if l is a RIGHT child (odd), its parent would also cover stuff
 *          left of the range — so take tree[l] now and move l one step right;
 *        • if r is odd, the node r - 1 is a right child whose parent pokes
 *          past the range — take tree[r - 1] and move r left;
 *        • then go up a level: l >>= 1, r >>= 1. Stop when l >= r.
 *      Each level contributes at most two nodes. O(log n).
 *   This layout works for ANY n, not just powers of two, because addition
 *   is commutative — some internal nodes may mix "unrelated" leaves, but the
 *   query never uses those nodes.
 *
 * Walkthrough — nums = [1, 3, 5]  (n = 3)
 * ───────────
 *   leaves     tree[3]=1  tree[4]=3  tree[5]=5
 *   internal   tree[2]=tree[4]+tree[5]=8   tree[1]=tree[2]+tree[3]=9
 *
 *   sumRange(0, 2): l=3, r=6
 *     l odd  → take tree[3]=1, l=4;  r even.        up: l=2, r=3
 *     l even;  r odd → r=2, take tree[2]=8.         up: l=1, r=1  stop
 *     sum = 9 ✓
 *   update(1, 2): tree[4]=2 → tree[2]=2+5=7 → tree[1]=7+1=8
 *   sumRange(0, 2) now picks tree[3] + tree[2] = 1 + 7 = 8 ✓
 *
 * Complexity
 * ──────────
 *   Build:     O(n) time.
 *   update:    O(log n) — one node per level on the leaf-to-root path.
 *   sumRange:  O(log n) — at most two nodes per level.
 *   Space:     O(n) — the 2n-slot array.
 *
 * Alternatives & pitfalls
 * ───────────────────────
 *   • Fenwick tree (binary indexed tree), equally good and even shorter.
 *     Use 1-based array `bit` of length n + 1, where bit[i] stores the sum of
 *     the (i & -i) elements ending at position i.
 *       - add(i, delta):  for (i++; i <= n; i += i & -i) bit[i] += delta
 *       - prefix(i):      sum of nums[0..i-1]:
 *                         for (; i > 0; i -= i & -i) s += bit[i]
 *       - sumRange(l, r) = prefix(r + 1) - prefix(l)
 *     Because a Fenwick tree only knows how to ADD, update(index, val) must
 *     keep a copy of the current values and call add(index, val - old).
 *     Forgetting that (adding `val` itself) is the classic bug.
 *   • Recursive segment tree (node covers [lo, hi], children cover the two
 *     halves): same complexity, easier to extend (range min, lazy range
 *     updates), but more code and recursion overhead.
 *   • Square-root decomposition: blocks of size ≈ √n with stored block sums
 *     give O(1) update and O(√n) query. Simple and often fast enough, but
 *     not logarithmic.
 *   • Off-by-ones to watch: inclusive `right` (r = right + n + 1 for a
 *     half-open window), `left = 0` in prefix-sum formulas, and Fenwick's
 *     1-based indexing.
 */

export class NumArray {
  /** @param {number[]} nums */
  constructor(nums) {
    this.n = nums.length;
    /** @type {number[]} tree[n + i] is nums[i]; tree[i] = tree[2i] + tree[2i + 1] */
    this.tree = new Array(2 * this.n).fill(0);
    for (let i = 0; i < this.n; i++) this.tree[this.n + i] = nums[i];
    for (let i = this.n - 1; i >= 1; i--) this.tree[i] = this.tree[2 * i] + this.tree[2 * i + 1];
  }

  /**
   * @param {number} index
   * @param {number} val
   */
  update(index, val) {
    let p = index + this.n;
    this.tree[p] = val; // set the leaf…
    while (p > 1) {
      p >>= 1; // …and recompute every ancestor from its two children
      this.tree[p] = this.tree[2 * p] + this.tree[2 * p + 1];
    }
  }

  /**
   * @param {number} left
   * @param {number} right
   * @returns {number}
   */
  sumRange(left, right) {
    let sum = 0;
    let l = left + this.n; // inclusive
    let r = right + this.n + 1; // exclusive
    while (l < r) {
      if (l & 1) sum += this.tree[l++]; // l is a right child: take it, step right
      if (r & 1) sum += this.tree[--r]; // r - 1 is a right child: step left, take it
      l >>= 1;
      r >>= 1;
    }
    return sum;
  }
}
