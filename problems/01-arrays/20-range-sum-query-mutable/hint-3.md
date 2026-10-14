# Hint 3

With the `2n` array layout:

- **update**: set the leaf at `index + n`, then repeatedly move to the parent (`p >> 1`) and recompute it as the sum of its two children until you reach node 1.
- **sumRange**: keep a half-open window `[l, r)` on the current level, starting with `l = left + n`, `r = right + n + 1`. While `l < r`: if `l` is odd it's a right child, so add `tree[l]` and step `l` right; if `r` is odd, step `r` left and add `tree[r]`. Then move both up a level (halve them).

If you go the Fenwick route instead, remember that it can only **add** a delta: keep the current values and add `val - old` on update.
