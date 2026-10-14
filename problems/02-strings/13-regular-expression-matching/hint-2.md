# Hint 2

Write the recursion `match(i, j)`: "does `s[i..]` match `p[j..]`?". A `x*` token can be skipped (zero uses), or, if `s[i]` matches `x`, it can consume `s[i]` while the same token stays available.

That recursion is correct but exponential on `"aaaa…ab"` vs `"a*a*a*…c"`. Every call is fully described by the pair `(i, j)`, and there are only `(m+1)·(n+1)` pairs. So **memoize** it, or turn it into a bottom-up **DP** table.
