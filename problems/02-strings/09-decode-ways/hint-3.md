# Hint 3

Set `ways(0) = 1`: the empty prefix has exactly one decoding, which makes the first steps work without special cases.

For each `i` from 1 to `n`, start at 0, add `ways(i-1)` if `s[i-1] !== '0'`, and add `ways(i-2)` if `i >= 2` and `s[i-2..i)` is between `"10"` and `"26"`. Return `ways(n)`.

You only ever look two steps back, so two variables are enough instead of an array.
