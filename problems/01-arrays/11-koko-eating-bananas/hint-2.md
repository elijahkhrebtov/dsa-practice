# Hint 2

"Fast enough" is **monotonic** in `k`: every speed below some threshold fails and every speed from the threshold up succeeds. You're looking for that threshold — the first `true` in a sorted sequence of `false…false true…true`.

That's a binary search, but over the space of possible **answers** (speeds), not over the array. What are the smallest and largest speeds worth considering?
