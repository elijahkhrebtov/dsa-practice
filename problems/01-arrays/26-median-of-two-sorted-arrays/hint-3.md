# Hint 3

Make sure `nums1` is the shorter array (swap the arguments if not). Search `lo = 0`, `hi = m`:

1. `i = (lo + hi) >> 1`, `j = half - i`.
2. Read the four border values, using `-Infinity` when a left side is empty (`i === 0` / `j === 0`) and `+Infinity` when a right side is empty (`i === m` / `j === n`).
3. If `aLeft > bRight` → `hi = i - 1`. Else if `bLeft > aRight` → `lo = i + 1`.
4. Otherwise the split is right: with an odd total the median is `max(aLeft, bLeft)`; with an even total it's the average of `max(aLeft, bLeft)` and `min(aRight, bRight)`.

Searching over the shorter array keeps `j` within `0 … n` automatically and gives O(log(min(m, n))).
