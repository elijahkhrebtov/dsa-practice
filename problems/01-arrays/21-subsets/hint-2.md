# Hint 2

Use **backtracking** with a growing `path` array and a `start` index:

- Every time you enter the recursive function, the current `path` is itself a valid subset — record a **copy** of it.
- Then, for each index `i` from `start` to the end, add `nums[i]` to the path, recurse with `start = i + 1`, and remove it again.

Only ever moving forward (`i + 1`) is what guarantees you never build `[2, 1]` after `[1, 2]`.
