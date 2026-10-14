# Hint 2

`a ^ b` is the sum without carries. `(a & b) << 1` is the carries, already moved to the column they go into.

So `a + b` equals `(a ^ b) + ((a & b) << 1)`. That's still an addition, but of two new numbers. What happens if you just repeat the step?
