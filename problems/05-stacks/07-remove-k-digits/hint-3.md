# Hint 3

For each digit `d`: while `k > 0` and the stack top is greater than `d`, pop and decrement `k`. Then push `d`.

Two clean-up steps after the scan:

1. If `k` is still positive, the stack is non-decreasing, so the largest digits are at the end. Drop the last `k`.
2. Join the stack, strip the leading zeros, and return `"0"` if nothing is left.
