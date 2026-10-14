# Hint 3

Walk `i` from left to right. While `nums[i]` is in `1 … n` **and** its home slot doesn't already hold the same value (`nums[nums[i] - 1] !== nums[i]`), swap `nums[i]` with the element in its home slot. Only then move on to `i + 1`.

- The "home slot already holds the same value" check is what stops duplicates from swapping forever.
- Every swap puts at least one value into its final place, so there are at most `n` swaps in total — the nested `while` is still O(n) overall.
- Careful when swapping in JS: compute the target index **before** you overwrite `nums[i]`.
