# Hint 3

Another way to see it is **lower bound**: "the first index whose value is `>= x`". The run of `target` starts at `lowerBound(target)` and ends just before `lowerBound(target + 1)`, which works because the values are integers.

If `lowerBound(target)` is past the end of the array, or `nums` at that index isn't `target`, the target is absent → `[-1, -1]`.
