# Hint 3

Merge sort, sketched:

1. `sort(lo, hi)` sorts the range `[lo, hi)`. If it has fewer than 2 elements, return.
2. `mid = (lo + hi) >> 1`; call `sort(lo, mid)` and `sort(mid, hi)`.
3. Merge: walk `i` over the left half and `j` over the right half, each time copying the smaller of `a[i]` / `a[j]` into a buffer (take from the left on ties). When one half runs out, copy the rest of the other. Copy the buffer back into `[lo, hi)`.

Allocate one buffer of length `n` up front and reuse it for every merge, instead of creating new arrays with `slice` / `concat` at each level — it's much faster. The recursion depth is only about `log2(n) ≈ 17`.
