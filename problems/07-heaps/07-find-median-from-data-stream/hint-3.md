# Hint 3

A neat way to add a number without any case analysis:

1. Push it into `low`.
2. Pop `low`'s top and push it into `high`. Whatever crosses over is the largest of the lower side, so the ordering invariant holds.
3. If `high` is now bigger than `low`, pop `high`'s top and push it back into `low`.

This way `low` always holds the extra element when the count is odd. `findMedian` returns `low`'s top for an odd count and the average of both tops for an even count (use `/ 2`, not integer division).
