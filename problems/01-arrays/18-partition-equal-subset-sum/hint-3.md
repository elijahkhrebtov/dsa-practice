# Hint 3

Keep a boolean array `can` of length `target + 1` with `can[0] = true` (the empty subset).

For each number `x`, update `can[s] = can[s] || can[s - x]` for `s` from `target` **down** to `x`. Going downward matters: it guarantees `can[s - x]` still describes subsets *without* `x`, so `x` is used at most once. (Going upward would let one `x` be added again and again.)

The answer is `can[target]`; you can return `true` as soon as it becomes true.
