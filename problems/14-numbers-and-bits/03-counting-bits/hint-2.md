# Hint 2

Since `i >> 1` is smaller than `i`, its count is already in your array when you reach `i`. So `ans[i] = ans[i >> 1] + (i & 1)`: the count of the number without its last bit, plus that last bit.

Another recurrence that works just as well: `i & (i - 1)` is `i` with its lowest 1 bit cleared, so `ans[i] = ans[i & (i - 1)] + 1`.
