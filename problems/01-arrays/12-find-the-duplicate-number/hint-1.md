# Hint 1

You can't sort, can't mark, and can't use a Set. So think about what's special about the **values**: every value is in `[1, n]`, which is also a valid **index** into an array of length `n + 1`.

What happens if you treat each `nums[i]` as a pointer "from `i` to `nums[i]`" and keep following pointers starting from index 0?
