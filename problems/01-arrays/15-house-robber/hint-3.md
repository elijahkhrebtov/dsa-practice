# Hint 3

Each `best(i)` only needs the previous two values, so you don't need a whole table.

Keep two variables: `prev2` = best up to house `i - 2` and `prev1` = best up to house `i - 1`, both starting at 0. For each house, compute `cur = max(prev1, prev2 + nums[i])`, then shift: `prev2 = prev1`, `prev1 = cur`. After the last house, `prev1` is the answer.

Starting both at 0 handles the first two houses automatically — no special cases needed.
