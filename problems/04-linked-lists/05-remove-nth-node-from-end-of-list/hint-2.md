# Hint 2

Two passes works: count the length `L`, then walk `L - n` steps from a dummy node placed before the head. You land on the predecessor.

For one pass, use two pointers with a fixed **gap**. If one pointer is exactly `n` nodes ahead of the other, then when the leading one reaches the end, the trailing one is exactly `n` nodes from the end.
