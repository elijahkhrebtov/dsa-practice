# Hint 3

Iterative version: set `result = 1` and `base = x` (or `1/x` if n is negative), and let `e = |n|`. While `e > 0`: if `e` is odd, multiply `result` by `base`. Then square `base` and halve `e` (rounding down).

You're reading the binary digits of `e`: each 1 bit contributes the matching power `x^(2^k)`.

Careful with `n = −2^31`: `|n| = 2^31` doesn't fit in a signed 32-bit int, so `e >> 1` and `e | 0` misbehave. Use `Math.floor(e / 2)` or `e >>> 1`.
