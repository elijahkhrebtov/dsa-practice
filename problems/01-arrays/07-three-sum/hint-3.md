# Hint 3

In a sorted array, equal values sit next to each other, so you can avoid duplicates without a Set:

- **First number:** skip `i` if `nums[i] === nums[i - 1]`. That value was already used as the first number, and every triplet it can start has been found.
- **After a match:** move `lo` forward past every copy of `nums[lo]`, and move `hi` backward past every copy of `nums[hi]`, before you continue.

Skipping on all three positions is what makes `[0, 0, 0, 0]` give exactly one `[0, 0, 0]`.
