# Hint 2

A prefix can still be completed into a well-formed string exactly when:

- it has used **at most `n`** opening brackets, and
- it has **never** used more `')'` than `'('` (no prefix closes something unopened).

So use **backtracking**: from the current prefix, add `'('` only if `open < n`, and add `')'` only if `close < open`. Any branch you take can still succeed — you never generate garbage.
