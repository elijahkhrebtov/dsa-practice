# Hint 2

Use **backtracking** with a `path` and a `used` boolean array (one flag per index):

- If `path` has `n` elements, record a **copy** and return.
- Otherwise try every index `i` whose flag is off: mark it, push `nums[i]`, recurse, then pop and unmark.

Unlike Subsets, the loop always starts at 0 here — order matters, so `[2, 1]` and `[1, 2]` are both wanted. (An alternative is to swap elements into place inside `nums`, but then you must swap them back.)
