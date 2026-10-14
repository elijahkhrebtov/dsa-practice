# Hint 3

Loop: compute the carry `(a & b) << 1`, replace `a` with `a ^ b`, replace `b` with the carry, and stop when the carry is 0. `a` is then the answer.

Each round pushes the lowest carry at least one column to the left, so there are at most 32 rounds. In JavaScript, `<<` keeps everything in 32 bits, so a carry out of bit 31 simply disappears. That's exactly two's-complement behavior, and why negative numbers work without special cases.
