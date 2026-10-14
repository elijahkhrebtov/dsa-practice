# Hint 1

Write down where the value at `(r, c)` ends up after a clockwise rotation: `(c, n - 1 - r)`. Moving values there directly overwrites cells you still need, so you'd need a copy.

Can you get the same result by combining two simpler "mirror" operations, each made only of swaps?
