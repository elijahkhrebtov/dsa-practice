# Hint 2

Count the letters (**frequency counting**). Since there are only 26 lowercase letters, an array of 26 counters indexed by `charCode - 97` works as a tiny, collision-free hash map.

You don't even need two count arrays: add 1 for each letter of `s`, subtract 1 for each letter of `t`, and check that everything ends at zero. Check the lengths first, since different lengths can be rejected immediately.
